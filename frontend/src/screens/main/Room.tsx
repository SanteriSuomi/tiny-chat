import { Flex, Text, useColorModeValue } from '@chakra-ui/react'
import { RoomType } from '../../types/room'

interface RoomProps {
    room: RoomType
}

const Room: React.FC<RoomProps> = ({ room }) => {
    const background = useColorModeValue('gray.200', 'gray.500')

    return (
        <Flex>
            <Text fontSize="xl" mr={6}>
                {room.name}
            </Text>
        </Flex>
    )
}

export default Room
