import { defineStore } from 'pinia'
import { ref } from 'vue'
import { get, post } from '@/utils/request'

export const usePointsStore = defineStore('points', () => {
    const balance = ref(0)
    const records = ref([])
    
    async function getBalance() {
        const data = await get('/points/balance')
        balance.value = data.balance
        return data.balance
    }
    
    async function getRecords(params) {
        const data = await get('/points/records', params)
        records.value = data.list
        return data
    }
    
    return {
        balance,
        records,
        getBalance,
        getRecords
    }
})
