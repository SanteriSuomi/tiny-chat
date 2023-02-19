import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
    sender: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    timestamp: {
        type: Number,
        required: true
    }
})

export default mongoose.model('Message', messageSchema, 'messages')