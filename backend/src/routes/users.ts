import express from 'express'
import User from '../schemas/user'

const router = express.Router()

router.post('/register', async (req, res) => {
    const user = new User({ username: "Test", passwordHash: "Test" })
    await user.save();
    res.status(201).json({ msg: "User saved" })
})

export default router