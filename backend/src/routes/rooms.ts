import express from 'express'
import authorize from '../middleware/authorize'
import { deleteRoom, getRoomMessages, getRoomParticipants, getRooms, postCreateRoom, putParticipateInRoom } from '../controllers/rooms'

const router = express.Router()
router.use(authorize)

router.get('/', getRooms)

router.get('/messages', getRoomMessages)

router.get('/participants', getRoomParticipants)

router.post('/create', postCreateRoom)

router.delete('/delete', deleteRoom)

router.put('/participate', putParticipateInRoom)

export default router