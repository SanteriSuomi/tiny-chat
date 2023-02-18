import express from 'express'
import authorize from '../middleware/authorize'

const router = express.Router()
router.use(authorize)

router.post('/create', async (req, res) => {
    res.status(201).json({ msg: "New room created" })
})

export default router