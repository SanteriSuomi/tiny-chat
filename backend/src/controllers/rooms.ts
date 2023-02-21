import { Request, Response } from 'express'
import Room from '../models/room'
import Message from '../models/message'
import User from '../models/user'

async function getRooms(req: Request, res: Response) {
    try {
        const { user } = req.body
        const ownedRooms = await Room.find({ owner: user.id })
        const partRooms = await Room.find({ participants: { '$in': [user.id] } }).select('-messages')
        res.status(200).json({
            content: {
                owned: ownedRooms,
                participant: partRooms
            }
        })
    } catch (error) {
        res.status(500).json({ msg: (error as Error).message })
    }
}

async function getRoomMessages(req: Request, res: Response) {
    try {
        const { user } = req.body
        const { id } = req.query
        const room = await Room.findOne({ _id: id, participants: { '$in': [user.id] } })
        if (!room) {
            return res.status(404).json({ msg: 'Not a participant in this room' })
        }
        const messages = await Message.find().where('_id').in(room.messages).exec()
        res.status(200).json({
            content: messages
        })
    } catch (error) {
        res.status(500).json({ msg: (error as Error).message })
    }
}

async function getRoomParticipants(req: Request, res: Response) {
    try {
        const { user } = req.body
        const { id } = req.query
        const room = await Room.findOne({ _id: id, participants: { '$in': [user.id] } })
        if (!room) {
            return res.status(404).json({ msg: 'Not a participant in this room' })
        }
        const participants = await User.find().where('_id').in(room.participants).exec()
        res.status(200).json({
            content: participants
        })
    } catch (error) {
        res.status(500).json({ msg: (error as Error).message })
    }
}

async function postCreateRoom(req: Request, res: Response) {
    try {
        const { user, name } = req.body
        if (name.length < 3 || name.length > 12) {
            return res.status(400).json({ msg: "Room name length must be between 3 and 12" })
        }
        let room = await Room.findOne({ name: name, owner: user.name })
        if (room) {
            return res.status(406).json({ msg: "Room already exists" })
        }
        room = new Room({ name: name, owner: user.id, participants: [user.id] })
        await room.save();
        res.status(201).json({ msg: "New room created", content: room })
    } catch (error) {
        res.status(500).json({ msg: (error as Error).message })
    }
}

async function deleteRoom(req: Request, res: Response) {
    try {
        const { user, id } = req.body
        const room = await Room.findOneAndDelete({ _id: id, owner: user.id })
        if (!room) {
            return res.status(400).json({ msg: "Nothing to delete" })
        }
        res.status(200).json({ msg: "Room deleted" })
    } catch (error) {
        res.status(500).json({ msg: (error as Error).message })
    }
}

async function putParticipateInRoom(req: Request, res: Response) {
    try {
        const { user, id } = req.body
        const room = await Room.findOne({ _id: id })
        if (!room) {
            return res.status(404).json({ msg: "Room not found" })
        }
        if (room.participants.includes(user.id)) {
            return res.status(406).json({ msg: "User already in room" })
        }
        room.participants.push(user.id)
        await room.save();
        res.status(202).json({ msg: "Room joined" })
    } catch (error) {
        res.status(500).json({ msg: (error as Error).message })
    }
}

export {
    getRooms,
    getRoomMessages,
    getRoomParticipants,
    postCreateRoom,
    deleteRoom,
    putParticipateInRoom
}