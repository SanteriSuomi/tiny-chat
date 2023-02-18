import Room from '../schemas/room'
import { verify } from 'jsonwebtoken'
import { RoomEnterEvent, RoomLeaveEvent, RoomMessageEvent } from '../types/events'

async function onConnection(socket: any) {
    const { authorization } = socket.handshake.headers
    if (!authorization) {
        return socket.disconnect()
    }

    verify(authorization, process.env.JWT_SECRET!, (err: any) => {
        if (err) {
            return socket.disconnect()
        }

        const roomId = socket.handshake.query['room_id'] as string

        const enterEvent = `${roomId}_enter`
        socket.on(enterEvent, (event: RoomEnterEvent) => {
            socket.broadcast.emit(enterEvent, event)
        })

        const leaveEvent = `${roomId}_leave`
        socket.on(leaveEvent, (event: RoomLeaveEvent) => {
            socket.broadcast.emit(leaveEvent, event)
        })

        const messageEvent = `${roomId}_message`
        socket.on(messageEvent, (event: RoomMessageEvent) => {
            onRoomMessage(event, roomId)
            socket.broadcast.emit(messageEvent, event)
        })
    })
}

async function onRoomMessage(event: RoomMessageEvent, roomId: string) {
    const room = await Room.findOne({ _id: roomId })
    if (room) {
        room.messages.push(event)
        await room.save()
    }
}

export default onConnection