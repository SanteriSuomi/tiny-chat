import {
    Button,
    Flex,
    IconButton,
    Spinner,
    Text,
    Textarea,
    useCallbackRef,
    useToast,
} from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { RoomType } from '../../types/room'
import { User, UserData } from '../../types/user'
import { useEffect, useState } from 'react'
import { MessageType } from '../../types/message'
import { Socket, io } from 'socket.io-client'
import Message from '../../components/Message'
import Participant from '../../components/Participant'
import { RoomEnterEvent } from '../../types/events'
import fetchJson from '../../utils/fetch'
import { infoToast } from '../../utils/toast'

interface RoomProps {
    userData: UserData
    room: RoomType
    setActiveRoom: (room: RoomType | undefined) => void
}

const Room: React.FC<RoomProps> = ({ userData, room, setActiveRoom }) => {
    const toast = useToast()

    const [socket] = useState<Socket>(
        io(process.env.REACT_APP_BACKEND_URL!, {
            transportOptions: {
                polling: {
                    extraHeaders: {
                        token: userData.token,
                    },
                },
            },
            query: {
                room_id: room._id,
            },
        })
    )

    const [messages, setMessages] = useState<MessageType[]>([])
    const [participants, setParticipants] = useState<User[]>([])
    const [incomingMessage, setIncomingMessage] = useState<
        MessageType | undefined
    >()
    const [localMessage, setLocalMessage] = useState('')

    const onMessagesRef = useCallbackRef(
        (node) => {
            if (node) {
                node.scrollTop = node.scrollHeight
            }
        },
        [messages]
    )

    const retrieveMessages = async () => {
        const obj = await fetchJson(
            `rooms/messages?${new URLSearchParams({ id: room._id })}`,
            'GET',
            undefined,
            {
                token: userData.token,
            }
        )
        if (obj) {
            const messages: MessageType[] | undefined = obj.content
            if (messages && messages.length > 0) {
                setMessages(messages)
            } else {
                setMessages([
                    {
                        message: 'No messages',
                        timestamp: Date.now(),
                    },
                ])
            }
        }
    }

    const retrieveParticipants = async () => {
        const obj = await fetchJson(
            `rooms/participants?${new URLSearchParams({ id: room._id })}`,
            'GET',
            undefined,
            {
                token: userData.token,
            }
        )
        if (obj) {
            const participants: User[] | undefined = obj.content
            if (participants && participants.length > 0) {
                setParticipants(participants)
            }
        }
    }

    const onMessageReceived = (message: MessageType) => {
        setIncomingMessage(message)
    }

    const onRoomEvent = (event: RoomEnterEvent, msg: string) => {
        if (event.name !== userData.name) {
            infoToast(`${event.name} ${msg}`, toast)
        }
    }

    const sendMessage = async () => {
        const response = await socket.emitWithAck(`${room._id}_message`, {
            sender_id: userData.id,
            sender_name: userData.name,
            message: localMessage,
            timestamp: Date.now(),
        })
        infoToast(response, toast)
    }

    useEffect(() => {
        retrieveMessages()
        retrieveParticipants()

        socket.on(`${room._id}_message`, onMessageReceived)
        socket.on(`${room._id}_enter`, (event) => {
            onRoomEvent(event, 'joined the room')
        })
        socket.on(`${room._id}_leave`, (event) => {
            onRoomEvent(event, 'left the room')
        })

        socket.emit(`${room._id}_enter`, { name: userData.name })

        return () => {
            socket.emit(`${room._id}_leave`, { name: userData.name })
            socket.disconnect()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [room._id])

    useEffect(() => {
        if (incomingMessage) {
            if (messages[0].message === 'No messages') {
                setMessages([incomingMessage])
            } else {
                setMessages([...messages, incomingMessage])
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [incomingMessage])

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
            <Flex
                justifyContent="center"
                alignItems="flex-start"
                height="100%"
                width="100%"
            >
                {messages.length > 0 && participants.length > 0 ? (
                    <>
                        <Flex
                            direction="column"
                            alignItems="center"
                            height="100%"
                            width="100%"
                        >
                            <Flex
                                height="100%"
                                width="75%"
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
                                    onChange={(event) => {
                                        setLocalMessage(
                                            event.currentTarget.value
                                        )
                                    }}
                                ></Textarea>
                                <Button
                                    colorScheme="teal"
                                    size="sm"
                                    ml={3}
                                    onClick={sendMessage}
                                >
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
                            {participants.map((participant) => {
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
