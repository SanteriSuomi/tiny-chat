import express from 'express'
import authorize from '../middleware/authorize'
import Room from '../schemas/room'

const router = express.Router()
router.use(authorize)

router.post('/create', async (req, res) => {
    const { user, name } = req.body
    let room = await Room.findOne({ name: name })
    if (room) {
        return res.status(409).json({ msg: "Room already exists" })
    }
    try {
        room = new Room({ name: name, owner: user.name, participants: [user.name] })
        await room.save();
        res.status(201).json({ msg: "New room created" })
    } catch (error) {
        return res.status(500).json({ msg: (error as Error).message })
    }
})

export default router