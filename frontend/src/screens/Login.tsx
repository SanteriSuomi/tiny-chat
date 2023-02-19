import { Button, Heading, Input, useToast } from '@chakra-ui/react'
import { useState } from 'react'
import { UserData } from '../types/user'

interface LoginProps {
    setUserData: (userData: UserData) => void
}

const Login: React.FC<LoginProps> = ({ setUserData }) => {
    const toast = useToast()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const login = async () => {
        const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}users/login`,
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
        const content = object.content
        if (content) {
            localStorage.setItem('login-data', JSON.stringify(content))
            setUserData(content)
        }
        toast({
            description: object.msg,
            duration: 4000,
            isClosable: true,
        })
    }

    return (
        <>
            <Heading mb={6}>Log in</Heading>
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
            <Button colorScheme="teal" mb={6} onClick={login}>
                Log in
            </Button>
        </>
    )
}

export default Login
