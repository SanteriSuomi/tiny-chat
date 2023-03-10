interface RoomEnterEvent {
    name: string
}

interface RoomLeaveEvent {
    name: string
}

interface RoomMessageEvent {
    _id: string
    sender_id: string
    sender_name: string
    message: string
    timestamp: number
}

interface RoomMessageDeleteEvent {
    id: string
}

export {
    RoomEnterEvent,
    RoomLeaveEvent,
    RoomMessageEvent,
    RoomMessageDeleteEvent
}