// utils/fetchWithAuth.js
import Cookies from 'js-cookie'

export async function fetchWithAuth(url, options = {}) {
    const token = Cookies.get('jwt')

    const headers = {
        ...(options.headers || {}),
        Authorization: token ? `Bearer ${token}` : '',
    }

    const response = await fetch(url, {
        ...options,
        headers,
    })

    return response
}
