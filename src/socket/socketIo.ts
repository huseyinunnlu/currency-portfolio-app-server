import {Server} from "socket.io";
import {CurrencyKeysWithSocketIdTypes} from "../types";
import {cacheManager} from "../lib/cacheManager";

function appendConnectedClientToCache(io: Server) {
    io.fetchSockets().then(clients => {
        cacheManager.del("socketClients")
        cacheManager.set("socketClients", clients.map((client) => client.id))
    })
}

function setSocketIdsToCurrencyKeys(currencyKeys: string[], socketId: string) {
    const currencyKeysWithSocketId = cacheManager.get("currencyKeysWithSocketId") as CurrencyKeysWithSocketIdTypes[]
    const updatedData = currencyKeysWithSocketId.map((currencyKey: CurrencyKeysWithSocketIdTypes) => {
        const selectedCurrencyKey = currencyKeys.find((key: string) => key === currencyKey.id)
        if (selectedCurrencyKey) {
            return {
                id: currencyKey.id,
                socketIds: [...currencyKey.socketIds.filter(id => id !== socketId), socketId]
            }
        }

        return currencyKey
    })

    cacheManager.set("currencyKeysWithSocketId", updatedData)
}



export default async function initSocketIo(io: Server) {
    io.on('connection', (socket) => {
        console.log("socket connected", socket.id)
        appendConnectedClientToCache(io)

        socket.on('triggerCurrencyData', (data) => {
            setSocketIdsToCurrencyKeys(data, socket.id)
            const currencyData = cacheManager.get("currencyData") as any
            socket.emit("currencyData", currencyData?.filter(((currency: any) => data.includes(currency._i))) || [])
        })

        socket.on('disconnect', () => {
            const clients = cacheManager.get("socketClients") as string[]
            const currencyKeysWithSocketId = cacheManager.get("currencyKeysWithSocketId") as CurrencyKeysWithSocketIdTypes[]
            cacheManager.set("socketClients", clients.filter(client => client !== socket.id))
            cacheManager.set("currencyKeysWithSocketId", currencyKeysWithSocketId.map((currency: any) => {
                return {
                    id: currency.id,
                    socketIds: currency.socketIds.filter((id: string) => id !== socket.id)
                }
            }))
        })
    })
}