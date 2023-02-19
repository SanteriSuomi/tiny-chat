import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken'

function authorize(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.token as string
    if (!token) {
        return res.status(401).json({ msg: 'No token header' })
    }
    verify(token, process.env.JWT_SECRET!, (err, user) => {
        if (err) {
            return res.status(403).json('Token is not valid')
        }
        req.body.user = user
        next();
    })
}

export default authorize