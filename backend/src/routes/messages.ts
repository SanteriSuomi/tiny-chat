import express from 'express'
import { deleteMessages } from '../controllers/messages'
import authorize from '../middleware/authorize'

const router = express.Router()
router.use(authorize)

router.delete('/delete', deleteMessages)

export default router