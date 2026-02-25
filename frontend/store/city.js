import { defineStore } from 'pinia'
import { ref } from 'vue'
import { get, post } from '@/utils/request'

export const useCityStore = defineStore('city', () => {
    const categories = ref([])
    const hotCities = ref([])
    const cityList = ref([])
    const currentCity = ref(null)
    
    async function getCategories() {
        const data = await get('/city/category')
        categories.value = data
        return data
    }
    
    async function getHotCities(limit = 10) {
        const data = await get('/city/hot', { limit })
        hotCities.value = data
        return data
    }
    
    async function getCityList(params) {
        const data = await get('/city/list', params)
        cityList.value = data.list
        return data
    }
    
    async function getCityDetail(cityId) {
        const data = await get(`/city/detail/${cityId}`)
        currentCity.value = data
        return data
    }
    
    async function searchCities(keyword, page = 1, pageSize = 20) {
        const data = await get('/city/search', { keyword, page, pageSize })
        return data
    }
    
    return {
        categories,
        hotCities,
        cityList,
        currentCity,
        getCategories,
        getHotCities,
        getCityList,
        getCityDetail,
        searchCities
    }
})
