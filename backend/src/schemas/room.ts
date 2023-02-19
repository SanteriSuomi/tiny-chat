import mongoose, { Schema } from 'mongoose'

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
        type: [Schema.Types.ObjectId],
        required: true
    },
    messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }]
})

export default mongoose.model('Room', roomSchema, 'rooms')