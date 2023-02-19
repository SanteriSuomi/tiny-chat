import { Button, Flex, useColorMode, useColorModeValue } from '@chakra-ui/react'
import { useState } from 'react'
import Login from './screens/Login'
import Register from './screens/Register'
import Main from './screens/Main'

function App() {
    const { toggleColorMode } = useColorMode()
    const formBackground = useColorModeValue('gray.100', 'gray.700')

    const [screen, setScreen] = useState('login')

    const getScreen = () => {
        if (localStorage.getItem('token')) {
            return <Main></Main>
        } else if (screen === 'login') {
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
        }
        return <Register setScreen={setScreen}></Register>
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
