import {
    Flex,
    Text,
    Divider,
    Stack,
    Button,
    Container,
    Heading,
} from '@chakra-ui/react'
import { UserData } from '../types/user'

interface MainProps {
    userData: UserData
    logout: () => void
}

const Main: React.FC<MainProps> = ({ userData, logout }) => {
    return (
        <Flex direction="column" width="80vw" height="70vh">
            <Stack>
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
                <Divider orientation="horizontal"></Divider>
            </Stack>
        </Flex>
    )
}

export default Main
