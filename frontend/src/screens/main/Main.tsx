import {
    Flex,
    Text,
    Divider,
    Stack,
    Button,
    Heading,
    Input,
    useToast,
} from '@chakra-ui/react'
import { UserData } from '../../types/user'
import { useEffect, useState } from 'react'
import { RoomType } from '../../types/room'
import Room from '../../components/Room'
import RoomScreen from './Room'

interface MainProps {
    userData: UserData
    logout: () => void
}

const Main: React.FC<MainProps> = ({ userData, logout }) => {
    const toast = useToast()

    const [roomID, setRoomID] = useState('')
    const [roomName, setRoomName] = useState('')
    const [rooms, setRooms] = useState<{
        owned: RoomType[]
        participant: RoomType[]
    }>()
    const [activeRoom, setActiveRoom] = useState<RoomType | undefined>()

    const retrieveRooms = async () => {
        const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}rooms`,
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
        setRooms(object.content)
    }

    const joinRoom = async () => {
        const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}rooms/participate`,
            {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    token: userData.token,
                },
                body: JSON.stringify({ id: roomID }),
            }
        )
        const object = await response.json()
        toast({
            description: object.msg,
            duration: 4000,
            isClosable: true,
            position: 'bottom-right',
        })
    }

    const createRoom = async () => {
        const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}rooms/create`,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    token: userData.token,
                },
                body: JSON.stringify({ name: roomName }),
            }
        )
        const object = await response.json()
        toast({
            description: object.msg,
            duration: 4000,
            isClosable: true,
            position: 'bottom-right',
        })
        if (response.ok) {
            retrieveRooms()
        }
    }

    const deleteRoom = async (room: RoomType) => {
        const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}rooms/delete`,
            {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    token: userData.token,
                },
                body: JSON.stringify({ id: room._id }),
            }
        )
        const object = await response.json()
        toast({
            description: object.msg,
            duration: 4000,
            isClosable: true,
            position: 'bottom-right',
        })
        if (response.ok) {
            retrieveRooms()
        }
    }

    useEffect(() => {
        retrieveRooms()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getScreen = () => {
        if (activeRoom) {
            return (
                <RoomScreen
                    room={activeRoom}
                    userData={userData}
                    setActiveRoom={setActiveRoom}
                ></RoomScreen>
            )
        }
        return (
            <Stack pt={3}>
                <Flex alignItems="center">
                    <Text fontSize="xl" mr={6}>
                        Rooms
                    </Text>
                    <Input
                        placeholder="room id"
                        variant="filled"
                        type="text"
                        maxWidth={210}
                        size="sm"
                        mr={1}
                        onChange={(event) => {
                            setRoomID(event.currentTarget.value)
                        }}
                    ></Input>
                    <Button colorScheme="teal" size="sm" onClick={joinRoom}>
                        Join
                    </Button>

                    <Input
                        placeholder="room name"
                        variant="filled"
                        type="text"
                        maxWidth={210}
                        size="sm"
                        mr={1}
                        ml={6}
                        onChange={(event) => {
                            setRoomName(event.currentTarget.value)
                        }}
                    ></Input>
                    <Button colorScheme="teal" size="sm" onClick={createRoom}>
                        Create
                    </Button>
                </Flex>
                <Stack pt={3}>
                    <Text>Owned Rooms</Text>
                    {rooms?.owned.map((room) => {
                        return (
                            <Room
                                key={room._id}
                                room={room}
                                setActiveRoom={setActiveRoom}
                                userData={userData}
                                deleteRoom={deleteRoom}
                            ></Room>
                        )
                    })}
                    <Text>Joined Rooms</Text>
                    {rooms?.participant.map((room) => {
                        return (
                            <Room
                                key={room._id}
                                room={room}
                                setActiveRoom={setActiveRoom}
                            ></Room>
                        )
                    })}
                </Stack>
            </Stack>
        )
    }

    return (
        <Flex direction="column" width="80vw" height="75vh">
            <Flex alignItems="center" justifyContent="space-between">
                <Heading size="md">Welcome to Tiny Chat!</Heading>
                <Flex alignItems="center">
                    <Text mr={4} fontSize="xl">
                        {userData.name}
                    </Text>
                    <Button colorScheme="teal" size="sm" onClick={logout}>
                        Log out
                    </Button>
                </Flex>
            </Flex>
            <Divider orientation="horizontal" pt={3}></Divider>
            {getScreen()}
        </Flex>
    )
}

export default Main
