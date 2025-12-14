import {Hono} from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono()

app.get('/supply', async (c) => {
    //Fetch from Snowpeer
    const SNOWPEER_URL = 'https://api.snowpeer.io/v1/monetary/current-total-supply?network=mainnet'
    
    try {
        const response = await fetch(SNOWPEER_URL, {
            method: 'GET',
            headers: { 
                'accept': 'application/json', 
                'x-org': 'SNWPR_ARIF',
                'x-user': 'arif_snwpr_pel23.1??d',
            }
        })

        if (!response.ok) {
            throw new Error(`Snowperr Api Error: ${response.status}`)
        }
        const data = await response.json()

        return c.json({
            supply: data.supply || data
        }) 
    } catch (error) {
        console.error("Fetch Error", error)
        return c.json({error: "Failed to fetch supply"}, 500)
    }
})

export default handle(app)
