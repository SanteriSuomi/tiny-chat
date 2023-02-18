import express from 'express'
import User from '../schemas/user'
import { hash, compare } from 'bcrypt'
import { sign } from 'jsonwebtoken'

const router = express.Router()

router.post('/register', async (req, res) => {
    try {
        const { name, password } = req.body
        if (!name || !password) {
            return res.status(400).json({ msg: "Name or password empty" })
        }
        let user = await User.findOne({ name: name })
        if (user) {
            return res.status(409).json({ msg: "User already exists" })
        }
        const passwordHash = await hash(password, 10)
        user = new User({ name: name, passwordHash: passwordHash })
        await user.save();
        res.status(201).json({ msg: "User registered" })
    } catch (error) {
        res.status(500).json({ msg: (error as Error).message })
    }
})

router.post('/login', async (req, res) => {
    try {
        const { name, password } = req.body
        if (!name || !password) {
            return res.status(400).json({ msg: "Name or password empty" })
        }
        const user = await User.findOne({ name: name })
        if (!user || !user.passwordHash) {
            return res.status(404).json({ msg: "User does not exist" })
        }
        if (!(await compare(password, user.passwordHash))) {
            return res.status(403).json({ msg: "Password incorrect" })
        }
        const accessToken = sign({ name: user.name, passwordHash: user.passwordHash }, process.env.JWT_SECRET!);
        res.status(200).json({ msg: "User logged in", content: accessToken })
    } catch (error) {
        res.status(500).json({ msg: (error as Error).message })
    }
})

export default router