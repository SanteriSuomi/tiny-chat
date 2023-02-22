import { Request, Response } from 'express'
import { hash, compare } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import User from '../models/user'

async function postRegisterUser(req: Request, res: Response) {
    try {
        const { name, password } = req.body
        if (!name || !password) {
            return res.status(400).json({ msg: "Name or password empty" })
        }
        if (name.length < 3 || password.length < 3 || name.length > 12 || password.length > 12) {
            return res.status(400).json({ msg: "Both name and password must be between 3 and 12 characters" })
        }
        let user = await User.findOne({ name: name })
        if (user) {
            return res.status(409).json({ msg: "User already exists" })
        }
        const passwordHash = await hash(password, 10)
        user = new User({ name: name, passwordHash: passwordHash })
        await user.save();
        res.status(201).json({ msg: "User registered", content: user })
    } catch (error) {
        res.status(500).json({ msg: (error as Error).message })
    }
}

async function patchLoginUser(req: Request, res: Response) {
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
            return res.status(403).json({ msg: "Password is incorrect" })
        }
        const accessToken = sign({ id: user._id, name: user.name, passwordHash: user.passwordHash }, process.env.JWT_SECRET!);
        res.status(200).json({
            msg: "User logged in", content: {
                id: user.id,
                name: user.name,
                token: accessToken
            }
        })
    } catch (error) {
        res.status(500).json({ msg: (error as Error).message })
    }
}

function getAuthorizeUser(req: Request, res: Response) {
    res.status(202).json({ msg: "User authenticated", content: req.body.user })
}

export {
    postRegisterUser,
    patchLoginUser,
    getAuthorizeUser
}