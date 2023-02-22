import { ToastId, UseToastOptions } from "@chakra-ui/react"

function successToast(description: string, toast?: (options?: UseToastOptions | undefined) => ToastId) {
    toast?.({
        title: 'Success',
        description: description,
        duration: 4000,
        isClosable: true,
        position: 'bottom-right',
        status: 'success'
    })
}

function errorToast(description: string, toast?: (options?: UseToastOptions | undefined) => ToastId) {
    toast?.({
        title: 'Error',
        description: description,
        duration: 4000,
        isClosable: true,
        position: 'bottom-right',
        status: 'error'
    })
}

function infoToast(description: string, toast?: (options?: UseToastOptions | undefined) => ToastId) {
    toast?.({
        title: 'Info',
        description: description,
        duration: 3000,
        isClosable: true,
        position: 'bottom-right',
        status: 'info'
    })
}

export { successToast, errorToast, infoToast }