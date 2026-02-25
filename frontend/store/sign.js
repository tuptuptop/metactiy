import { defineStore } from 'pinia'
import { ref } from 'vue'
import { get, post } from '@/utils/request'

export const useSignStore = defineStore('sign', () => {
    const signStatus = ref(null)
    const signRecords = ref([])
    
    async function doSign() {
        const data = await post('/sign/do')
        return data
    }
    
    async function getSignStatus() {
        const data = await get('/sign/status')
        signStatus.value = data
        return data
    }
    
    async function getSignRecords(page = 1, pageSize = 30) {
        const data = await get('/sign/records', { page, pageSize })
        signRecords.value = data.list
        return data
    }
    
    return {
        signStatus,
        signRecords,
        doSign,
        getSignStatus,
        getSignRecords
    }
})
