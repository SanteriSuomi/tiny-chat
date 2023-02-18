interface RoomEnterEvent {
    name: string;
}

interface RoomLeaveEvent {
    name: string;
}

interface RoomMessageEvent {
    sender: string;
    message: string;
    timestamp: number;
}

export {
    RoomEnterEvent,
    RoomLeaveEvent,
    RoomMessageEvent
}