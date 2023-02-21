import { Socket, Server } from "socket.io"
import { verify } from 'jsonwebtoken'
import { RoomEnterEvent, RoomLeaveEvent, RoomMessageEvent } from '../../types/events'
import { onRoomEnter, onRoomLeave, onRoomMessage } from '../../controllers/sockets/room'

async function onRoomSocketConnection(socket: Socket, io: Server) {
    const { token } = socket.handshake.headers
    if (!token) {
        return socket.disconnect()
    }

    verify(token as string, process.env.JWT_SECRET!, (err) => {
        if (err) {
            return socket.disconnect()
        }

        const roomId = socket.handshake.query['room_id'] as string

        const enterEvent = `${roomId}_enter`
        socket.on(enterEvent, (event: RoomEnterEvent) => {
            onRoomEnter(enterEvent, event, socket)
        })

        const leaveEvent = `${roomId}_leave`
        socket.on(leaveEvent, (event: RoomLeaveEvent) => {
            onRoomLeave(leaveEvent, event, socket)
        })

        const messageEvent = `${roomId}_message`
        socket.on(messageEvent, async (event: RoomMessageEvent, callback) => {
            onRoomMessage(messageEvent, event, roomId, io, callback)
        })
    })
}

export default onRoomSocketConnection