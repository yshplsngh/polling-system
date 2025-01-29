import { Pool, PoolClient } from 'pg';

class ConnectionPool {
    private static instance: Pool | null = null;

    private constructor() { }

    public static getInstance(): Pool {
        if (!ConnectionPool.instance) {
            ConnectionPool.instance = new Pool({
                user: 'postgres',
                host: 'localhost',
                database: 'polling',
                password: 'postgres',
                port: 5432,
                max: 20,
                idleTimeoutMillis: 30000,
                connectionTimeoutMillis: 2000,
            });

            ConnectionPool.instance.on('error', (err) => {
                console.error('Unexpected error on idle client', err);
            });
            console.log("New Database pool created");
        }
        return ConnectionPool.instance;
    }

    public static async closePool(): Promise<void> {
        if (ConnectionPool.instance) {
            await ConnectionPool.instance.end();
            ConnectionPool.instance = null;
            console.log("Database pool closed");
        }
    }
}

export function getPool(): Pool {
    return ConnectionPool.getInstance();
}
export function closePool(): Promise<void> {
    return ConnectionPool.closePool();
}

export async function execQuery<T>(queryFn: (client: PoolClient) => Promise<T>) {
    let client;

    try {
        client = await getPool().connect();
        return await queryFn(client);
    } catch (error) {
        console.error('Error acquiring client from pool:', error);
        throw error;
    } finally {
        if (client) {
            client.release();
        }
    }
}