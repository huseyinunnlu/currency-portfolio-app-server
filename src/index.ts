import express, { Express } from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import cors from 'cors';

import 'dotenv/config';
import initWebSocket from '@/socket/webSocket';
import router from '@/routes';
import initSocketIo from '@/socket/socketIo';
import { cacheManager } from '@/lib/cacheManager';
import { SYMBOLS } from '@/constants';
import { errorHandler, notFoundHandler } from '@/middleware/errorHandler';

import { connect } from 'mongoose';

const PORT = process.env.PORT || 3001;

const main = async () => {
    const app: Express = express();
    const server = createServer(app);
    const io = new Server(server, {
        cors: {
            origin: '*',
        },
    });

    cacheManager.set('socketClients', []);

    app.use(cors());

    // Add request data parsing middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Register API routes
    app.use(router);

    app.get('/health', (_req, res) => {
        res.send('OK');
    });

    // Add 404 handler for undefined routes
    app.use(notFoundHandler);

    // Add global error handler - this must be the last middleware
    app.use(errorHandler);

    cacheManager.set(
        'currencyKeysWithSocketId',
        SYMBOLS.map((symbol: string) => ({
            id: symbol,
            socketIds: [],
        }))
    );

    try {
        // Connect to MongoDB
        //await connectToDatabase();

        await connect(process.env.MONGODB_URI || '');

        // Initialize WebSocket connections
        await initSocketIo(io);
        await initWebSocket(io);

        // Start server
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

main();
