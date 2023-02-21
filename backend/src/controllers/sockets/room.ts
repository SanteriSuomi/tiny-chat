import { Server, Socket } from "socket.io"
import { RoomEnterEvent, RoomMessageEvent } from "../../types/events"
import Room from '../../models/room'
import Message from '../../models/message'

async function onRoomEnter(eventName: string, event: RoomEnterEvent, socket: Socket) {
    try {
        socket.broadcast.emit(eventName, event)
    } catch (error) {
        console.log(error)
    }
}

async function onRoomLeave(eventName: string, event: RoomEnterEvent, socket: Socket) {
    try {
        socket.broadcast.emit(eventName, event)
    } catch (error) {
        console.log(error)
    }
}

async function onRoomMessage(eventName: string, event: RoomMessageEvent, roomId: string, io: Server, callback: any) {
    try {
        const id = await saveRoomMessage(event, roomId)
        if (id) {
            event._id = id.toString()
            io.sockets.emit(eventName, event)
            return callback?.("Message sent");
        }
    } catch (error) {
        console.log(error)
    }
    callback?.("Message not sent");
}


async function saveRoomMessage(event: RoomMessageEvent, roomId: string) {
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

export {
    onRoomEnter,
    onRoomLeave,
    onRoomMessage
}