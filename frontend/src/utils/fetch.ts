import { ToastId, UseToastOptions } from "@chakra-ui/react"
import { errorToast, successToast } from "./toast"

async function fetchJson(path: string, method: string, body?: object, headers?: object, toast?: (options?: UseToastOptions | undefined) => ToastId) {
    const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}${path}`,
        {
            method: method,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                ...headers
            },
            body: JSON.stringify(body),
        }
    )
    const obj = await response.json()
    if (toast) {
        if (response.ok) {
            successToast(obj.msg, toast)
        } else {
            errorToast(obj.msg, toast)
            return null
        }
    }
    return obj
}

export default fetchJson