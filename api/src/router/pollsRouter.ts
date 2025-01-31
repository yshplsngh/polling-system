import type { Request, Response, NextFunction } from 'express';
import express from 'express';
import { createPollSchema } from './types';
import prisma from '../database';
import { createError } from '../utils/errorHander';
import kafkaProducer from '../kafka/producer';

const router = express.Router();

// for creating a poll
router.post('/polls', async (req: Request, res: Response, next: NextFunction) => {
    const isValidate = createPollSchema.safeParse(req.body);
    if (!isValidate.success) {
        next(isValidate.error); // error will be handled by errorHandler
        return;
    }

    const data = await prisma.$transaction(async (tx) => {
        const poll = await tx.polls.create({
            data: {
                question: isValidate.data.question,
                options: {
                    createMany: {
                        data: isValidate.data.options.map((option) => ({
                            option_text: option
                        }))
                    }
                }
            }
        })
        return poll;
    })

    return res.status(201).json({
        message: 'Poll created successfully',
        data: { poll_id: data.id }
    })
});

// for getting a single poll results
router.get('/polls/:id', async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
        next(new createError('Invalid poll id, must be a number', 400));
        return;
    }
    const poll = await prisma.polls.findUnique({
        where: {
            id: +id
        }
    })
    if (!poll) {
        next(new createError('Poll not found', 404));
        return;
    }

    const options = await prisma.options.findMany({
        where: {
            poll_id: poll.id
        },
        orderBy:{
            id:"asc"
        }
    })
    const total_votes = options.reduce((count, option) => {
        count += option.vote_count;
        return count;
    }, 0)

    const finalOptions = options.map((option) => {
        return {
            id: option.id,
            option_text: option.option_text,
            vote_count: option.vote_count,
            percentage: Math.round((option.vote_count / total_votes) * 100) || 0
        }
    })

    return res.status(200).json({
        message: 'Poll fetched successfully',
        data: {
            poll_id: poll.id,
            question: poll.question,
            options: finalOptions
        }
    })
})

// for voting on a poll
router.post('/polls/:id/vote', async (req: Request, res: Response, next: NextFunction) => {
    const { id: raw_poll_id } = req.params;
    const { option_id: raw_option_id } = req.body;

    const option_id = Number(raw_option_id);
    const poll_id = Number(raw_poll_id);

    if (isNaN(poll_id) || isNaN(option_id)) {
        next(new createError('Invalid ID format', 400));
        return;
    }

    await kafkaProducer.addVote({
        poll_id: poll_id,
        option_id: option_id,
        timestamp: new Date().toISOString()
    })

    return res.status(202).json({
        message: 'Vote registered successfully'
    });
})

// for getting the leaderboard of all polls
router.get('/leaderboard', async (req: Request, res: Response, next: NextFunction) => {
    const leaderboard = await prisma.polls.findMany({
        select: {
            id: true,
            question: true,
            options: {
                orderBy: {
                    vote_count: 'desc'
                },
                take: 1,
                select: {
                    id: true,
                    option_text: true,
                    vote_count: true
                }
            },
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
    const pollTotalVotes = await prisma.options.groupBy({
        by: ['poll_id'],
        _sum: { vote_count: true }
    })
    // map => poll_id, total_votes
    const pollTotalVotesMap = new Map(pollTotalVotes.map(poll => [poll.poll_id,poll._sum.vote_count]))

    const finalLeaderboard = leaderboard.map((poll)=>{
        return {
            id:poll.id,
            question:poll.question,
            total_votes: pollTotalVotesMap.get(poll.id) ?? 0,
            options:poll.options[0] // options arraywill contain only one option
        }
    })
    return res.status(200).json({
        message: 'Leaderboard fetched successfully',
        data: finalLeaderboard
    })
})

export default router;