import {
    Button,
    Flex,
    useColorMode,
    useColorModeValue,
    Spinner,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import Login from './screens/Login'
import Register from './screens/Register'
import Main from './screens/Main'

function App() {
    const { toggleColorMode } = useColorMode()
    const formBackground = useColorModeValue('gray.100', 'gray.700')

    const [screen, setScreen] = useState('')

    const authorize = async (token: string) => {
        const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}users/authorize`,
            {
                method: 'GET',
                headers: {
                    Authorization: token,
                },
            }
        )
        if (!response.ok) {
            localStorage.setItem('token', '')
            return false
        }
        return true
    }

    useEffect(() => {
        const token = localStorage.getItem('token') || ''
        authorize(token).then(() => {
            setScreen('main')
        })
    }, [])

    const getScreen = () => {
        if (screen === 'login') {
            return (
                <>
                    <Login></Login>
                    <Button
                        colorScheme="teal"
                        mb={6}
                        onClick={() => {
                            setScreen('register')
                        }}
                    >
                        No Account? Register
                    </Button>
                    <Button onClick={toggleColorMode}>Toggle Color Mode</Button>
                </>
            )
        } else if (screen === 'register') {
            return <Register setScreen={setScreen}></Register>
        } else if (screen === 'main') {
            return <Main></Main>
        }
        return <Spinner size="lg"></Spinner>
    }

    return (
        <Flex height="100vh" alignItems="center" justifyContent="center">
            <Flex
                direction="column"
                background={formBackground}
                padding={12}
                rounded={6}
            >
                {getScreen()}
            </Flex>
        </Flex>
    )
}

export default App
