import express from 'express'
import http from 'http'
import { Server } from 'socket.io'

const app = express()
const server = http.createServer(app)
const io = new Server(server, { serveClient: false })

const port = 3000;

app.get('/', (req, res) => {
    res.send("No content")
});

io.on('connection', (socket) => {
    socket.on("join", (msg) => {
        console.log(msg)
    })
})

server.listen(port, () => {
    console.log(`App listening on port ${port}`)
});