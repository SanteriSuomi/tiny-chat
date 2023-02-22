import { Button, Heading, Input, useToast } from '@chakra-ui/react'
import { useState } from 'react'
import { UserData } from '../types/user'
import fetchJson from '../utils/fetch'

interface LoginProps {
    setUserData: (userData: UserData) => void
}

const Login: React.FC<LoginProps> = ({ setUserData }) => {
    const toast = useToast()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const login = async () => {
        const obj = await fetchJson(
            'users/login',
            'PATCH',
            { name: username, password: password },
            undefined,
            toast
        )
        const content = obj.content
        if (content) {
            localStorage.setItem('login-data', JSON.stringify(content))
            setUserData(content)
        }
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
