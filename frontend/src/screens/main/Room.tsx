import { Button, Flex, IconButton, Text, Textarea } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { RoomType } from '../../types/room'
import { UserData } from '../../types/user'
import { useEffect, useState } from 'react'
import { MessageType } from '../../types/message'
import Message from '../../components/Message'

interface RoomProps {
    userData: UserData
    room: RoomType
    setActiveRoom: (room: RoomType | undefined) => void
}

const Room: React.FC<RoomProps> = ({ userData, room, setActiveRoom }) => {
    const [messages, setMessages] = useState<MessageType[]>([])

    const retrieveMessages = async () => {
        const response = await fetch(
            `${
                process.env.REACT_APP_BACKEND_URL
            }rooms/messages?${new URLSearchParams({ id: room._id })}`,
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    token: userData.token,
                },
            }
        )
        const object = await response.json()
        if (object.content) {
            setMessages(object.content)
        }
    }

    useEffect(() => {
        retrieveMessages()
    }, [])

    return (
        <>
            <Flex alignItems="center" mt={3}>
                <IconButton
                    aria-label="Back to login screen"
                    alignSelf="flex-start"
                    icon={<ArrowBackIcon></ArrowBackIcon>}
                    onClick={() => {
                        setActiveRoom(undefined)
                    }}
                    mr={3}
                ></IconButton>
                <Text fontSize="xl" mr={6}>
                    {room.name}
                </Text>
                <Text fontSize="md">ID: {room._id}</Text>
            </Flex>
            <Flex direction="column" alignItems="center">
                <Flex
                    width="40%"
                    height={350}
                    direction="column"
                    alignItems="center"
                    justifyContent="flex-start"
                    overflowY="scroll"
                    mt={3}
                >
                    {messages.map((message) => {
                        return (
                            <Message
                                key={message._id}
                                message={message}
                                userData={userData}
                            ></Message>
                        )
                    })}
                </Flex>
                <Flex alignItems="center" justifyContent="center" mt={4}>
                    <Textarea
                        maxWidth={300}
                        variant="filled"
                        resize="none"
                    ></Textarea>
                    <Button colorScheme="teal" size="sm" ml={3}>
                        Send
                    </Button>
                </Flex>
            </Flex>
        </>
    )
}

export default Room
