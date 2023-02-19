import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
    sender_id: {
        type: String,
        required: true
    },
    sender_name: {
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