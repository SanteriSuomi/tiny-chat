import { Button, Heading, Input, IconButton, useToast } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { useState } from 'react'
import fetchJson from '../utils/fetch'

interface RegisterProps {
    setScreen: (screen: string) => void
}

const Register: React.FC<RegisterProps> = ({ setScreen }) => {
    const toast = useToast()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const register = async () => {
        const obj = await fetchJson(
            'users/register',
            'POST',
            { name: username, password: password },
            undefined,
            toast
        )
        if (obj) {
            setScreen('login')
        }
    }

    return (
        <>
            <IconButton
                aria-label="Back to login screen"
                alignSelf="flex-start"
                mb={3}
                icon={<ArrowBackIcon></ArrowBackIcon>}
                onClick={() => {
                    setScreen('login')
                }}
            ></IconButton>
            <Heading mb={6}>Register</Heading>
            <Input
                placeholder="Username"
                variant="filled"
                mb={3}
                type="text"
                onChange={(event) => {
                    setUsername(event.currentTarget.value)
                }}
            ></Input>
            <Input
                placeholder="***********"
                variant="filled"
                mb={6}
                type="password"
                onChange={(event) => {
                    setPassword(event.currentTarget.value)
                }}
            ></Input>
            <Button colorScheme="teal" onClick={register}>
                Register
            </Button>
        </>
    )
}

export default Register
