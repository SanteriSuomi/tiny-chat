import mongoose from 'mongoose'

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    owner: {
        type: String,
        required: true
    },
    participants: {
        type: [String],
        required: true
    },
    messages: [{ sender: String, message: String, timestamp: Number }]
})

export default mongoose.model('Room', roomSchema, 'rooms')