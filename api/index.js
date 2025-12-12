import {Hono} from 'hono'
import { handle } from 'hono/vercel'
import { readFile } from 'node:fs/promises'
import { serve } from '@hono/node-server' // local dev
import {serveStatic} from '@hono/node-server/serve-static' // local dev

const app = new Hono()

app.get('api/supply', async (c) => {
    //Fetch from Snowpeer
    const SNOWPEER_URL = 'https://api.snowpeer.io/v1/monetary/current-total-supply?network=mainnet'
    
    try {
        const response = await fetch(SNOWPEER_URL, {
            method: 'GET',
            headers: { 'accept': 'application/json' }
        })

        if (!response.ok) {
            throw new Error(`Snowperr Api Error: ${response.status}`)
        }
        const data = await response.json()

        return c.json({
            supply: data
        }) 
    } catch (error) {
        console.error("Fetch Error", error)
        return c.json({error: "Failed to fetch supply"}, 500)
    }
})

// Frontend
app.get('/', async (c) => {
try {
    const html = await readFile('../public/index.html', 'utf-8')
    return c.html(html)
} catch (error) {
    return c.text('Error: Could not load index.html', 500)
}
})

export default handle(app)

// Local development
if (process.env.NODE_ENV !== 'production' && process.argv[1] === import.meta.url) {
    console.log("Starting Local Development Server on port 3000...")
    app.use('/*', serveStatic({ root: '../public' }))
    serve({
        fetch: app.fetch,
        port: 3000
    }).then(() => {
        console.log("Server is running successfully!");
    }).catch(err => {
        console.error("Failed to start server:", err);
    });
}