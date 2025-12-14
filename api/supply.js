import {Hono} from 'hono'
import { handle } from 'hono/vercel'

export const config = {
  runtime: 'edge',
}

const app = new Hono()

app.get('*', async (c) => {
    console.log('Supply endpoint hit')
    //Fetch from Snowpeer
    const SNOWPEER_URL = 'https://api.snowpeer.io/v1/monetary/current-total-supply?network=mainnet'
    
    try {
        const response = await fetch(SNOWPEER_URL, {
            method: 'GET',
            headers: { 
                'accept': 'application/json',
                'x-org': process.env.SNOWPEER_API_USERNAME,
                'x-user': process.env.SNOWPEER_API_PASSWORD,
            }
        })

        if (!response.ok) {
            throw new Error(`Snowperr Api Error: ${response.status}`)
        }
        const data = await response.json()

        return c.json({
            supply: data.supply / 1e9
        }) 
    } catch (error) {
        console.error("Fetch Error", error)
        return c.json({error: "Failed to fetch supply"}, 500)
    }
})

export default handle(app)
