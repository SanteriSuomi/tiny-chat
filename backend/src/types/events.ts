interface RoomEnterEvent {
    name: string
}

interface RoomLeaveEvent {
    name: string
}

interface RoomMessageEvent {
    sender_id: string
    sender_name: string
    message: string
    timestamp: number
}

export {
    RoomEnterEvent,
    RoomLeaveEvent,
    RoomMessageEvent
}