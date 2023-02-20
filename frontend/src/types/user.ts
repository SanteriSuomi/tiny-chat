interface UserData {
    id: string
    name: string
    token: string
}

interface User {
    _id: string
    name: string
    passwordHash: string
}

export type {
    UserData, User
}