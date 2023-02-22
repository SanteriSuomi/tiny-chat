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
import fetchJson from '../../utils/fetch'

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
        const obj = await fetchJson('rooms', 'GET', undefined, {
            token: userData.token,
        })
        if (obj) {
            setRooms(obj.content)
        }
    }

    const joinRoom = async () => {
        const obj = await fetchJson(
            'rooms/participate',
            'PUT',
            { id: roomID },
            {
                token: userData.token,
            },
            toast
        )
        if (obj) {
            retrieveRooms()
        }
    }

    const createRoom = async () => {
        const obj = await fetchJson(
            'rooms/create',
            'POST',
            { name: roomName },
            {
                token: userData.token,
            },
            toast
        )
        if (obj) {
            retrieveRooms()
        }
    }

    const deleteRoom = async (room: RoomType) => {
        const obj = await fetchJson(
            'rooms/delete',
            'DELETE',
            { id: room._id },
            {
                token: userData.token,
            },
            toast
        )
        if (obj) {
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
