import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import usersRouter from "./routes/users"
import roomsRouter from "./routes/rooms"

mongoose.set('strictQuery', false)

const app = express()
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

const server = http.createServer(app)
const io = new Server(server, { serveClient: false })

const port = 3000;

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/tiny-chat');

    app.get('*', (_, res) => {
        res.status(404).json({ msg: "Not found" })
    });

    app.use('/users', usersRouter)
    app.use('/rooms', roomsRouter)

    io.on('connection', (socket) => {
        socket.on("join", (msg) => {
            console.log(msg)
        })
    })

    server.listen(port, () => {
        console.log(`App listening on port ${port}`)
    });
}

main().catch(err => console.log(err));
