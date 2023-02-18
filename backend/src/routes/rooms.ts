import express from 'express'
import authorize from '../middleware/authorize'
import Room from '../schemas/room'

const router = express.Router()
router.use(authorize)

router.post('/create', async (req, res) => {
    try {
        const { user, name } = req.body
        let room = await Room.findOne({ name: name, owner: user.name })
        if (room) {
            return res.status(406).json({ msg: "Can't create duplicate rooms" })
        }
        room = new Room({ name: name, owner: user.name, participants: [user.name] })
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
        if (room) {
            return res.status(200).json({ msg: "Room deleted" })
        }
        res.status(400).json({ msg: "Nothing to delete" })
    } catch (error) {
        res.status(500).json({ msg: (error as Error).message })
    }
})

export default router