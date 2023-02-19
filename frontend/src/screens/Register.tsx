import { Button, Heading, Input, IconButton, useToast } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { useState } from 'react'

interface RegisterProps {
    setScreen: (screen: string) => void
}

const Register: React.FC<RegisterProps> = ({ setScreen }) => {
    const toast = useToast()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const register = async () => {
        const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}users/register`,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: username, password: password }),
            }
        )
        const object = await response.json()
        toast({
            description: object.msg,
            duration: 5000,
            isClosable: true,
        })
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
