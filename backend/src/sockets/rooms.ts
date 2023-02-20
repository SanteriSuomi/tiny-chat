import Room from '../schemas/room'
import Message from '../schemas/message'
import { verify } from 'jsonwebtoken'
import { RoomEnterEvent, RoomLeaveEvent, RoomMessageEvent } from '../types/events'

async function onConnection(socket: any) {
    const { token } = socket.handshake.headers
    if (!token) {
        return socket.disconnect()
    }

    verify(token, process.env.JWT_SECRET!, (err: any) => {
        if (err) {
            return socket.disconnect()
        }

        const roomId = socket.handshake.query['room_id'] as string
        try {
            const enterEvent = `${roomId}_enter`
            socket.on(enterEvent, (event: RoomEnterEvent) => {
                socket.broadcast.emit(enterEvent, event)
            })

            const leaveEvent = `${roomId}_leave`
            socket.on(leaveEvent, (event: RoomLeaveEvent) => {
                socket.broadcast.emit(leaveEvent, event)
            })

            const messageEvent = `${roomId}_message`
            socket.on(messageEvent, async (event: RoomMessageEvent) => {
                const id = await onRoomMessage(event, roomId)
                if (id) {
                    event._id = id.toString()
                    socket.broadcast.emit(messageEvent, event)
                }
            })
        } catch (error) {
            console.log(error)
        }
    })
}

async function onRoomMessage(event: RoomMessageEvent, roomId: string) {
    const room = await Room.findOne({ _id: roomId })
    if (room) {
        const message = new Message(event)
        await message.save()
        room.messages.push(message._id)
        await room.save()
        return message._id
    }
    return null
}

export default onConnection