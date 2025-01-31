# Real-time Polling Application

A real-time polling application built with TypeScript, NodeJS, Express, WebSocket, Kafka, and Prisma.

## Prerequisites

- Node.js (v18 or higher)
- Docker

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yshplsngh/polling-system.git
   cd polling-system
   ```

2. **Start Kafka, Zookeeper, Postgres, and Backend**
   ```bash
   docker-compose up
   ```
   - you have to stop local postgres service if it is running on port 5432.

3. **Install Frontend Dependencies**
   ```bash
   cd client
   npm install
   ```

4. **Run Frontend**
   ```bash
   cd client
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:4000

## How this kakfa handle Concurrency and Failover Handling:
- The `polling-topic` is divided into 3 partitions. Each partition is consumed by only one consumer in the same consumer group, it enable the `parallel processing` of votes.
- Three consumers (kafkaConsumer1, kafkaConsumer2, kafkaConsumer3) are initialized in the same consumer group. so that they can concurrently consume the votes from different partitions.
- we can also add more group with  more consumers, but I have not added in this project.
- I have added 2 `Replication factor` for fault tolerance.
- 