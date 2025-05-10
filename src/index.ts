import express, {Express} from "express"
import {createServer} from 'node:http';
import {Server} from 'socket.io';
import cors from 'cors';

import 'dotenv/config'
import initWebSocket from "./socket/webSocket";
import router from "./routes";
import initSocketIo from "./socket/socketIo";
import {cacheManager} from "./lib/cacheManager";
import {SYMBOLS} from "./constants";

const PORT = process.env.PORT || 3001

console.log(process.env)

const main = async () => {
    const app: Express = express()
    const server = createServer(app);
    const io = new Server(server, {
        cors: {
            origin: "*",
        }
    });

    cacheManager.set("socketClients", [])

    app.use(cors())
    app.use(router)

    app.get('/health', (req, res) => {
        res.send("OK")
    })

    //add not found route
    app.use((req, res) => {
        res.status(404).send("Not Found")
    })

    cacheManager.set("currencyKeysWithSocketId", SYMBOLS.map((symbol: string) => ({
        id: symbol,
        socketIds: []
    })))
    await initSocketIo(io)
    await initWebSocket(io)

    server.listen(3001, () => {
        console.log('WebSocket server is running')
    })
    app.listen(PORT, () => {
        console.log(`Server is running`)
    })
}

main()

