import axios from 'axios'
import { useUserStore } from '@/store/user'

const BASE_URL = '/api'

const request = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
    }
})

request.interceptors.request.use(
    (config) => {
        const userStore = useUserStore()
        if (userStore.token) {
            config.headers.Authorization = `Bearer ${userStore.token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

request.interceptors.response.use(
    (response) => {
        const res = response.data
        
        if (res.code === 0) {
            return res.data
        }
        
        if (res.code === 401) {
            const userStore = useUserStore()
            userStore.logout()
            uni.navigateTo({
                url: '/pages/user/login'
            })
            return Promise.reject(new Error(res.message || 'Unauthorized'))
        }
        
        uni.showToast({
            title: res.message || 'Error',
            icon: 'none'
        })
        
        return Promise.reject(new Error(res.message || 'Error'))
    },
    (error) => {
        uni.showToast({
            title: error.message || 'Network Error',
            icon: 'none'
        })
        return Promise.reject(error)
    }
)

export default request

export const get = (url, params) => {
    return request.get(url, { params })
}

export const post = (url, data) => {
    return request.post(url, data)
}

export const put = (url, data) => {
    return request.put(url, data)
}

export const del = (url, data) => {
    return request.delete(url, { data })
}
