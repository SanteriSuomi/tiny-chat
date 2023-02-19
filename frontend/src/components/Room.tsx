import { Button, Flex, Text, useColorModeValue } from '@chakra-ui/react'
import { RoomType } from '../types/room'

interface RoomProps {
    room: RoomType
}

const Room: React.FC<RoomProps> = ({ room }) => {
    const formBackground = useColorModeValue('gray.200', 'gray.500')

    return (
        <Button
            maxWidth={125}
            background={formBackground}
            rounded={6}
            padding={2}
            size="sm"
        >
            <Text>{room.name}</Text>
        </Button>
    )
}

export default Room
