import { Request, Response } from 'express'
import Room from '../models/room'
import Message from '../models/message'
import { io } from '../index'

async function deleteMessages(req: Request, res: Response) {
    try {
        const { user, ids } = req.body
        let count = 0
        for (const id of ids) {
            const message = await Message.findOne({ '_id': id })
            if (!message) {
                return res.status(404).json({ msg: 'Message not found' })
            } else if (message.sender_id !== user.id) {
                return res.status(401).json({ msg: 'User not owner of message' })
            }
            const room = await Room.findOne({ messages: { '$all': id } })
            if (room) {
                room.messages = room.messages.filter((message) => {
                    return message._id !== id
                })
                await room.save()
                await message.delete()
                count++
                io.sockets.emit(`${room._id}_message_delete`, { id: id })
            }
        }
        res.status(200).json({ msg: `${count} messages deleted` })
    } catch (error) {
        res.status(500).json({ msg: (error as Error).message })
    }
}

export {
    deleteMessages
}