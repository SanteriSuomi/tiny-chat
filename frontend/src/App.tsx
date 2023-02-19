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
import { UserData } from './types/user'

function App() {
    const { toggleColorMode } = useColorMode()
    const formBackground = useColorModeValue('gray.100', 'gray.700')

    const [screen, setScreen] = useState('')
    const [userData, setUserData] = useState<UserData>({
        token: '',
        name: '',
    })

    const authenticate = async (data: UserData) => {
        const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}users/authenticate`,
            {
                method: 'GET',
                headers: {
                    token: data.token,
                },
            }
        )
        if (!response.ok) {
            localStorage.setItem('login-data', '')
            return false
        }
        return true
    }

    const logout = () => {
        localStorage.setItem('login-data', '')
        setUserData({ token: '', name: '' })
        setScreen('login')
    }

    useEffect(() => {
        const storage = localStorage.getItem('login-data')
        if (storage) {
            const data = JSON.parse(storage)
            if (data) {
                authenticate(data).then((authenticated) => {
                    if (authenticated) {
                        setUserData(data)
                    }
                })
            }
        } else {
            setScreen('login')
        }
    }, [])

    useEffect(() => {
        if (userData.token.length > 0) {
            setScreen('main')
        }
    }, [userData])

    const getScreen = () => {
        if (screen === 'login') {
            return (
                <>
                    <Login setUserData={setUserData}></Login>
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
            return <Main userData={userData} logout={logout}></Main>
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
