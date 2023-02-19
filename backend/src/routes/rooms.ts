import express from 'express'
import authorize from '../middleware/authorize'
import Room from '../schemas/room'
import Message from '../schemas/message'

const router = express.Router()
router.use(authorize)

router.get('/', async (req, res) => {
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
})

router.get('/messages', async (req, res) => {
    try {
        const { user } = req.body
        const { id } = req.query
        const room = await Room.findOne({ _id: id, participants: { '$in': [user.id] } })
        console.log(room)
        if (!room) {
            return res.status(404).json({ msg: 'Not a participant in this room' })
        }
        const messages = await Message.find().where('_id').in(room.messages).exec()
        console.log(messages)
        res.status(200).json({
            content: messages
        })
    } catch (error) {
        res.status(500).json({ msg: (error as Error).message })
    }
})

router.post('/create', async (req, res) => {
    try {
        const { user, name } = req.body
        let room = await Room.findOne({ name: name, owner: user.name })
        if (room) {
            return res.status(406).json({ msg: "Can't create duplicate rooms" })
        }
        room = new Room({ name: name, owner: user.id, participants: [user.id] })
        await room.save();
        res.status(201).json({ msg: "New room created", content: room })
    } catch (error) {
        res.status(500).json({ msg: (error as Error).message })
    }
})

router.delete('/delete', async (req, res) => {
    try {
        const { user, id } = req.body
        const room = await Room.findOneAndDelete({ _id: id, owner: user.name })
        if (!room) {
            return res.status(400).json({ msg: "Nothing to delete" })
        }
        res.status(200).json({ msg: "Room deleted" })
    } catch (error) {
        res.status(500).json({ msg: (error as Error).message })
    }
})

router.put('/participate', async (req, res) => {
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
})

export default router