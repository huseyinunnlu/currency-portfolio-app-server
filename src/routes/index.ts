import {Request, Response, Router} from "express"
import axios from "axios";
import {cacheManager} from "../lib/cacheManager";

const router = Router()

router.get('/definitions', async (req: Request, res: Response) => {

    const result = await axios.get(`${process.env.SERVICE_URL}/definitions`)
    if (result?.status === 200) {
        res.setHeader('Cache-Control', 'public, max-age=43200');
        res.send(result.data)
        return
    }

    res.status(500).send("Internal Server Error")
    return
})

router.get('/currency-history/:legacyCode', async (req: Request, res: Response) => {
    const {legacyCode} = req.params
    const {startDate, endDate, period} = req.query
    //const {startDate, endDate} = req.query
    if (!legacyCode || !startDate || !endDate || !period) {
        res.status(400).send("Bad Request")
        return
    }
    const headers = {
        origin: "https://www.foreks.com",
        authorization: `Bearer ${cacheManager.get("token")}`,
    }
    let url = `${process.env.HISTORY_SERVICE_URL}/cloud-proxy/historical-service/intraday/code/${encodeURIComponent(legacyCode)}/period/${period}/from/${startDate}/to/${endDate}`

    try {
        const result = await axios.get(url, {headers})
        if (result?.status === 200) {
            res.send(result.data)
            return
        }

        res.status(500).send("Internal Server Error")
        return
    } catch {
        res.status(500).send("Internal Server Error")
        return
    }
})

export default router

