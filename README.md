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

2. **Start Kafka, Zookeeper**
   ```bash
   docker-compose up
   ```

3. **Install Backend Dependencies**
   ```bash
   cd api
   npm install
   ```

4. **Run Backend**
   ```bash
   cd api
   npm run dev
   ```

5. **Install Frontend Dependencies**
   ```bash
   cd ../client
   npm install
   ```

6. **Run Frontend**
   ```bash
   cd ../client
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:4000