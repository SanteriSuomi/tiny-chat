import {
    Button,
    Flex,
    IconButton,
    Spinner,
    Text,
    Textarea,
    useCallbackRef,
} from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { RoomType } from '../../types/room'
import { User, UserData } from '../../types/user'
import { useEffect, useState } from 'react'
import { MessageType } from '../../types/message'
import { io } from 'socket.io-client'
import Message from '../../components/Message'
import Participant from '../../components/Participant'

interface RoomProps {
    userData: UserData
    room: RoomType
    setActiveRoom: (room: RoomType | undefined) => void
}

const Room: React.FC<RoomProps> = ({ userData, room, setActiveRoom }) => {
    const [messages, setMessages] = useState<MessageType[]>([])
    const [participants, setParticipants] = useState<User[]>([])
    const [message, setMessage] = useState<MessageType | undefined>()

    const onMessagesRef = useCallbackRef(
        (node) => {
            if (node) {
                node.scrollTop = node.scrollHeight
            }
        },
        [messages]
    )

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

    const retrieveParticipants = async () => {
        const response = await fetch(
            `${
                process.env.REACT_APP_BACKEND_URL
            }rooms/participants?${new URLSearchParams({ id: room._id })}`,
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
            setParticipants(object.content)
        }
    }

    const onMessageReceived = (message: MessageType) => {
        setMessage(message)
    }

    useEffect(() => {
        retrieveMessages()
        retrieveParticipants()
        const socket = io(process.env.REACT_APP_BACKEND_URL!, {
            transportOptions: {
                polling: {
                    extraHeaders: {
                        token: userData.token,
                    },
                },
            },
        })
        socket.on(`${room._id}_message`, onMessageReceived)
        return () => {
            socket.disconnect()
        }
    }, [room._id])

    useEffect(() => {
        if (message) {
            setMessages([...messages, message])
        }
    }, [message])

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
            <Flex justifyContent="center" alignItems="center">
                {messages.length > 0 && participants.length > 0 ? (
                    <>
                        <Flex direction="column" alignItems="center">
                            <Flex
                                maxHeight={375}
                                minWidth={375}
                                direction="column"
                                alignItems="flex-start"
                                justifyContent="flex-start"
                                overflowY="scroll"
                                mt={3}
                                ref={onMessagesRef}
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
                            <Flex
                                alignItems="center"
                                justifyContent="center"
                                mt={4}
                            >
                                <Textarea
                                    maxWidth={250}
                                    variant="outline"
                                    resize="none"
                                ></Textarea>
                                <Button colorScheme="teal" size="sm" ml={3}>
                                    Send
                                </Button>
                            </Flex>
                        </Flex>
                        <Flex
                            direction="column"
                            alignItems="flex-start"
                            justifyContent="flex-start"
                            height="100%"
                            ml={50}
                        >
                            <Text>Participants</Text>
                            {participants
                                .sort((a) => (a._id === room.owner ? 1 : -1))
                                .map((participant) => {
                                    return (
                                        <Participant
                                            key={participant._id}
                                            participant={participant}
                                            userData={userData}
                                        ></Participant>
                                    )
                                })}
                        </Flex>
                    </>
                ) : (
                    <Spinner size="xl"></Spinner>
                )}
            </Flex>
        </>
    )
}

export default Room
