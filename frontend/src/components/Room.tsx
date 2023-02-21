import { Button, Flex, Text, useColorModeValue } from '@chakra-ui/react'
import { RoomType } from '../types/room'
import { UserData } from '../types/user'

interface RoomProps {
    room: RoomType
    setActiveRoom: (room: RoomType) => void
    userData?: UserData
    deleteRoom?: (room: RoomType) => void
}

const Room: React.FC<RoomProps> = ({
    room,
    setActiveRoom,
    userData,
    deleteRoom,
}) => {
    const background = useColorModeValue('gray.200', 'gray.500')

    return (
        <Flex alignItems="center" justifyContent="flex-start">
            <Button
                maxWidth={125}
                background={background}
                rounded={6}
                padding={2}
                size="sm"
                onClick={() => {
                    setActiveRoom(room)
                }}
            >
                <Text>{room.name}</Text>
            </Button>
            {userData && deleteRoom && room.owner === userData.id ? (
                <Button
                    maxWidth={100}
                    rounded={6}
                    padding={2}
                    size="xs"
                    ml={3}
                    colorScheme="red"
                    onClick={() => {
                        deleteRoom(room)
                    }}
                >
                    Delete
                </Button>
            ) : (
                <></>
            )}
        </Flex>
    )
}

export default Room
