import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken'

function authorize(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers
    if (!authorization) {
        return res.status(401).json({ msg: 'No authorization header' })
    }
    verify(authorization, 'tokensecret', (err, user) => {
        if (err) {
            return res.status(403).json('Token is not valid')
        }
        next();
    })
}

export default authorize