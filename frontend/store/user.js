import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { post, get } from '@/utils/request'

export const useUserStore = defineStore('user', () => {
    const token = ref('')
    const userInfo = ref(null)
    
    const isLoggedIn = computed(() => !!token.value)
    
    async function login(phone, password, loginType = 'password') {
        const data = await post('/user/login', { phone, password, loginType })
        token.value = data.token
        userInfo.value = data.user
        return data
    }
    
    async function loginByCode(phone, code) {
        const data = await post('/user/login', { phone, code, loginType: 'code' })
        token.value = data.token
        userInfo.value = data.user
        return data
    }
    
    async function register(phone, password, code, inviteCode) {
        const data = await post('/user/register', { phone, password, code, inviteCode })
        token.value = data.token
        userInfo.value = data.user
        return data
    }
    
    async function getUserInfo() {
        const data = await get('/user/info')
        userInfo.value = data
        return data
    }
    
    async function updateUserInfo(info) {
        await post('/user/update', info)
        await getUserInfo()
    }
    
    function logout() {
        token.value = ''
        userInfo.value = null
    }
    
    function setToken(newToken) {
        token.value = newToken
    }
    
    return {
        token,
        userInfo,
        isLoggedIn,
        login,
        loginByCode,
        register,
        getUserInfo,
        updateUserInfo,
        logout,
        setToken
    }
}, {
    persist: {
        key: 'metacity-user',
        paths: ['token', 'userInfo']
    }
})
