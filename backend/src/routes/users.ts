import express from 'express'
import authorize from '../middleware/authorize'
import { getAuthorizeUser, patchLoginUser, postRegisterUser } from '../controllers/users'

const router = express.Router()

router.post('/register', postRegisterUser)

router.patch('/login', patchLoginUser)

router.get('/authenticate', authorize, getAuthorizeUser)

export default router