import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: String,
    passwordHash: String
})

export default mongoose.model('User', userSchema, 'users')