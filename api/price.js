import {Hono} from 'hono'
import { parse } from 'hono/utils/cookie'
import { handle } from 'hono/vercel'

const app = new Hono()

app.get('*', async (c) => {
    console.log('Fetching Price')

    const PRICE_URL = 'https://api.snowpeer.io/v1/monetary/current-avax-price'

    try {
        const response = await fetch(PRICE_URL, {
            method: 'GET',
            headers: { 
                'accept': 'application/json',
                'x-org': process.env.SNOWPEER_API_USERNAME,
                'x-user': process.env.SNOWPEER_API_PASSWORD,
            }
        })
        if (!response.ok) throw new Error(`Api Error: ${response.status}`)
        
        const data = await response.json()

        if (!data.price) {
            throw new Error('Price not found in response')
        }
        return c.json({price: parseFloat(data.price)})
        
    } catch (error) {
        console.error('Fetch Price Error', error)
        return c.json({error: 'Failed to fetch price'}, 500)
    }
})

export default handle(app)