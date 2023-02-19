import { Button, Text, useColorModeValue } from '@chakra-ui/react'
import { RoomType } from '../types/room'

interface RoomProps {
    room: RoomType
    setActiveRoom: (room: RoomType) => void
}

const Room: React.FC<RoomProps> = ({ room, setActiveRoom }) => {
    const background = useColorModeValue('gray.200', 'gray.500')

    const enterRoom = () => {
        setActiveRoom(room)
    }

    return (
        <Button
            maxWidth={125}
            background={background}
            rounded={6}
            padding={2}
            size="sm"
            onClick={enterRoom}
        >
            <Text>{room.name}</Text>
        </Button>
    )
}

export default Room
