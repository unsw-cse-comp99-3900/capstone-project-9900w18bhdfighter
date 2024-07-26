import axios from 'axios'

export const baseURL = process.env.REACT_APP_API_URL as string
export const staticWrapped = (path: string) => {
  let _path = path.trim()
  if (_path.startsWith('/')) {
    _path = _path.substring(1)
  }
  if (_path.endsWith('/')) {
    _path = _path.substring(0, _path.length - 1)
  }
  return `${baseURL}/${_path}`
}

const api = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    if (config) {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response && error.response.status === 401) {
    }

    return Promise.reject(error)
  }
)

export default api
