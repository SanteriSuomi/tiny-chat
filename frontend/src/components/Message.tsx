import { Button, Flex, Text, useColorModeValue } from '@chakra-ui/react'
import { useState } from 'react'
import { MessageType } from '../types/message'
import { UserData } from '../types/user'

interface MessageProps {
    message: MessageType
    userData: UserData
    deleteMessage: (id: string) => void
}

const Message: React.FC<MessageProps> = ({
    message,
    userData,
    deleteMessage,
}) => {
    const foreignBackground = useColorModeValue('gray.200', 'gray.500')
    const ownerBackground = useColorModeValue('blue.200', 'blue.500')

    const [mouseOver, setMouseOver] = useState(false)
    const setMouseOverVal = (val: boolean) => {
        if (message.sender_id === userData.id) {
            setMouseOver(val)
        }
    }

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
            ml={message.sender_id === userData.id ? '' : '5%'}
            mr={message.sender_id === userData.id ? '5%' : ''}
            onMouseEnter={() => {
                setMouseOverVal(true)
            }}
            onMouseLeave={() => {
                setMouseOverVal(false)
            }}
        >
            <Text fontSize="smaller" pr={2}>
                {message.message}
            </Text>
            <Text fontSize="2xs" color="black" alignSelf="flex-end">
                {message.sender_name}
            </Text>
            {mouseOver ? (
                <Button
                    maxWidth={100}
                    rounded={6}
                    padding={2}
                    size="xs"
                    ml={3}
                    colorScheme="red"
                    onClick={() => {
                        if (message._id) {
                            deleteMessage(message._id)
                        }
                    }}
                >
                    Delete
                </Button>
            ) : (
                <></>
            )}
        </Flex>
    )
}

export default Message
