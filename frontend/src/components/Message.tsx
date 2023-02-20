import { Flex, Text, useColorModeValue } from '@chakra-ui/react'
import { MessageType } from '../types/message'
import { UserData } from '../types/user'

interface MessageProps {
    message: MessageType
    userData: UserData
}

const Message: React.FC<MessageProps> = ({ message, userData }) => {
    const foreignBackground = useColorModeValue('gray.200', 'gray.500')
    const ownerBackground = useColorModeValue('blue.200', 'blue.500')

    return (
        <Flex
            background={
                message.sender_id === userData.id
                    ? ownerBackground
                    : foreignBackground
            }
            alignSelf={
                message.sender_id === userData.id ? 'flex-end' : 'flex-start'
            }
            rounded={6}
            padding={2}
            mt={3}
            ml={3}
            mr={3}
        >
            <Text fontSize="smaller" pr={2}>
                {message.message}
            </Text>
            <Text fontSize="2xs" color="black" alignSelf="flex-end">
                {message.sender_name}
            </Text>
        </Flex>
    )
}

export default Message
