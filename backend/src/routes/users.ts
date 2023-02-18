import express from 'express'
import User from '../schemas/user'
import { hash } from 'bcrypt'

const router = express.Router()

router.post('/register', async (req, res) => {
    const { name, password } = req.body
    if (!name || !password) {
        return res.status(400).json({ msg: "Name or password empty" })
    }
    try {
        const passwordHash = await hash(password, 10)
        const user = new User({ name: name, passwordHash: passwordHash })
        await user.save();
    } catch (error) {
        return res.status(500).json({ msg: (error as Error)?.message })
    }
    res.status(201).json({ msg: "User saved" })
})

export default router