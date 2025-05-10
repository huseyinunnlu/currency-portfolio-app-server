import axios from "axios";
import {Server} from "socket.io";
import {FIELDS, SYMBOLS} from "../constants";
import {cacheManager} from "../lib/cacheManager";
import {CurrencyKeysWithSocketIdTypes} from "../types";

function login(webSocket: WebSocket, token: string) {
    webSocket.send(JSON.stringify({
        _id: 64,
        token,
        info: {
            "company": "foreks",
            "resource": "server",
            "platform": "web",
            "app-name": "foreks-com",
            "device-os": "MacIntel",
            "device-model": "Gecko",
            "client-address": "https://www.foreks.com",
            "client-port": "",
            "client-language": "en-US",
            "client-navigator": "5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML like Gecko) Chrome/135.0.0.0 Safari/537.36"
        },
        resource: "server"
    }))
}

function hearthbeat(webSocket: WebSocket) {
    setInterval(() => {
        webSocket.send(JSON.stringify({_id: 16}))
    }, 10000)
}

function startCurrencyDataStream(webSocket: WebSocket) {
    webSocket.send(JSON.stringify({
        _id: 1,
        _s: 1,
        id: 47,
        symbols: SYMBOLS,
        fields: FIELDS
    }))
}

async function getServiceToken(retryCount: number = 0): Promise<string | null> {
    console.log("process.env.SERVICE_URL", process.env.SERVICE_URL)    
    if (retryCount > 4) {
        console.error('Max retry attempts reached. Unable to fetch token.');
        return null;
    }

    if (!process.env.SERVICE_URL) {
        console.error('SERVICE_URL environment variable is not set');
        return null;
    }

    console.log(`Attempting to fetch token... (Attempt ${retryCount + 1})`);

    try {
        const response = await axios.get(`${process.env.SERVICE_URL}/token`);

        if (response?.data && response.data.token) {
            console.log('Token fetched successfully');
            cacheManager.set("token", response.data.token)
            return response.data.token;
        }
        console.error('Error: Token not fetched');

        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before retrying
        return getServiceToken(retryCount + 1);
    } catch (error) {
        console.error('Error fetching token:', error);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before retrying
        return getServiceToken(retryCount + 1);
    }
}

export default async function initWebSocket(io: Server) {
    try {
        // Check if required environment variables are set
        if (!process.env.WEBSOCKET_SERVER_URL) {
            console.error('WEBSOCKET_SERVER_URL environment variable is not set');
            return null;
        }

        let token: string | null = await getServiceToken();
        if (!token) {
            console.error('Failed to get service token');
            return null;
        }

        const webSocket = new WebSocket(process.env.WEBSOCKET_SERVER_URL);

        webSocket.onopen = () => {
            console.log('WebSocket connection established');
            login(webSocket, token as string);
            hearthbeat(webSocket);
        };

        webSocket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        webSocket.onclose = (event) => {
            console.log(`WebSocket connection closed: ${event.code} ${event.reason}`);
        };

        webSocket.onmessage = (event) => {
            try {
                const parsedData = JSON.parse(event.data);

                switch (parsedData._id) {
                    case 65:
                        if (parsedData?.result === 100) {
                            console.log('Login successful:');
                            startCurrencyDataStream(webSocket)
                            break;
                        }
                        webSocket.close()
                        console.log('Login failed:', parsedData?.err || "Unknown error");
                        break
                    case 1:
                        const currencyData = cacheManager.get("currencyData") || [] as any;
                        const selectedCurrencyData = currencyData.find((data: any) => data?._i === parsedData._i)
                        const newData = {
                            ...selectedCurrencyData || {},
                            ...parsedData
                        }
                        cacheManager.set("currencyData", [
                            ...currencyData.filter((data: any) => data?._i !== parsedData._i),
                            newData
                        ]);

                        const currencyKeysWithSocketId = cacheManager.get("currencyKeysWithSocketId") as CurrencyKeysWithSocketIdTypes[]
                        const selectedCurrencyKey = currencyKeysWithSocketId.find((currency: any) => currency.id === parsedData._i)

                        if (selectedCurrencyKey?.socketIds) {
                            selectedCurrencyKey.socketIds.forEach((socketId: string) => {
                                io.to(socketId).emit("currencyData", [newData])
                            })
                        }
                        break
                }
            } catch (error) {
                console.error('Error processing WebSocket message:', error);
            }
        };
        return webSocket;
    } catch (error) {
        console.error('Error initializing WebSocket:', error);
        return null;
    }
}