import express from 'express'
import cors from 'cors'
import http from 'http'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import usersRouter from './routes/users'
import roomsRouter from './routes/rooms'
import roomsSocket from './sockets/rooms'
import dotenv from 'dotenv'

dotenv.config()
mongoose.set('strictQuery', false)

const app = express()
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(cors())

const server = http.createServer(app)
const io = new Server(server, {
    serveClient: false, cors: {
        origin: true,
        methods: ["GET", "POST"],
        allowedHeaders: ["token"],
    }
})

async function main() {
    await mongoose.connect(process.env.DB_CONNECTION_STRING!);

    app.use('/users', usersRouter)
    app.use('/rooms', roomsRouter)

    io.on('connection', (socket) => {
        roomsSocket(socket)
    })

    app.get('*', (_, res) => {
        res.status(404).json({ msg: "Not found" })
    });

    server.listen(process.env.PORT, () => {
        console.log(`App listening on port ${process.env.PORT}`)
    });
}

main().catch(err => console.log(err));
