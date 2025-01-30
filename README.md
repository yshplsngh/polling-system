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

2. **Start Kafka and Zookeeper**
   ```bash
   docker-compose up
   ```

3. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd api
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # In api directory, create .env file
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/polling"
   ```

4. **Set up the database**
   ```bash
   cd api
   npm run migrate
   npm run generate
   ```

6. **Run the application**
   ```bash
   # Start backend (in api directory)
   npm run dev

   # Start frontend (in client directory)
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:4000