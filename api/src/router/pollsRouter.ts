import type { Request, Response, NextFunction } from 'express';
import express from 'express';
import { createPollSchema } from './types';
import prisma from '../database';

const router = express.Router();


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
        data: data
    })
});



export default router;