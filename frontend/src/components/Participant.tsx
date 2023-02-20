import { Flex, Text, useColorModeValue } from '@chakra-ui/react'
import { User, UserData } from '../types/user'

interface ParticipantProps {
    participant: User
    userData: UserData
}

const Participant: React.FC<ParticipantProps> = ({ participant, userData }) => {
    const foreignBackground = useColorModeValue('gray.200', 'gray.500')
    const ownerBackground = useColorModeValue('blue.200', 'blue.500')

    return (
        <Flex
            background={
                participant._id === userData.id
                    ? ownerBackground
                    : foreignBackground
            }
            rounded={6}
            padding={2}
            mt={3}
        >
            <Text fontSize="smaller" pr={2}>
                {participant.name}
            </Text>
        </Flex>
    )
}

export default Participant
