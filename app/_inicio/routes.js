import express from 'express'
const app = express()

app.all('/', (req, res) => {
    res.json({ error: false, data: { message: 'Hello from the API!' } })
})

export default app
