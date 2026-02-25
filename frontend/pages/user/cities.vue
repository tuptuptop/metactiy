<template>
    <view class="my-cities-page">
        <view class="stats-card" v-if="stats.totalCities > 0">
            <view class="stat-item">
                <text class="stat-value">{{ stats.totalCities }}</text>
                <text class="stat-label">持有城市</text>
            </view>
            <view class="stat-item">
                <text class="stat-value">{{ stats.totalBlocks }}</text>
                <text class="stat-label">持有地块</text>
            </view>
            <view class="stat-item">
                <text class="stat-value">{{ stats.totalAmount }}</text>
                <text class="stat-label">总投入</text>
            </view>
        </view>
        
        <scroll-view 
            class="city-list" 
            scroll-y 
            @scrolltolower="loadMore"
            refresher-enabled
            :refresher-triggered="isRefreshing"
            @refresherrefresh="onRefresh"
        >
            <view class="city-item" v-for="city in cityList" :key="city.city_id" @click="goToDetail(city.city_id)">
                <image class="city-cover" :src="city.cover_image" mode="aspectFill" />
                <view class="city-info">
                    <text class="city-name">{{ city.city_name }}</text>
                    <view class="city-stats">
                        <text class="block-count">{{ city.block_count }}块地</text>
                        <text class="total-amount">¥{{ city.total_amount }}</text>
                    </view>
                    <text class="buy-time">{{ formatTime(city.created_at) }}购入</text>
                </view>
            </view>
            
            <view class="loading" v-if="isLoading">
                <text>加载中...</text>
            </view>
            
            <view class="no-more" v-if="noMore && cityList.length > 0">
                <text>没有更多了</text>
            </view>
            
            <view class="empty" v-if="!isLoading && cityList.length === 0">
                <image class="empty-image" src="/static/images/empty-city.png" mode="aspectFit" />
                <text class="empty-text">暂无持有城市</text>
                <button class="empty-btn" @click="goToCityList">去选购</button>
            </view>
        </scroll-view>
    </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { get } from '@/utils/request'

const stats = ref({
    totalCities: 0,
    totalBlocks: 0,
    totalAmount: 0
})

const cityList = ref([])
const page = ref(1)
const isLoading = ref(false)
const isRefreshing = ref(false)
const noMore = ref(false)

onMounted(async () => {
    await loadUserCities()
})

async function loadUserCities(isLoadMore = false) {
    if (isLoading.value) return
    
    isLoading.value = true
    
    try {
        const data = await get('/user/cities', {
            page: page.value,
            pageSize: 20
        })
        
        if (isLoadMore) {
            cityList.value = [...cityList.value, ...data.list]
        } else {
            cityList.value = data.list || []
        }
        
        if (cityList.value.length > 0) {
            stats.value.totalCities = data.total
            stats.value.totalBlocks = cityList.value.reduce((sum, c) => sum + (c.block_count || 0), 0)
            stats.value.totalAmount = cityList.value.reduce((sum, c) => sum + (c.total_amount || 0), 0)
        }
        
        noMore.value = cityList.value.length >= data.total
    } catch (error) {
        console.error('Load user cities failed:', error)
    } finally {
        isLoading.value = false
        isRefreshing.value = false
    }
}

function loadMore() {
    if (noMore.value || isLoading.value) return
    
    page.value++
    loadUserCities(true)
}

function onRefresh() {
    isRefreshing.value = true
    page.value = 1
    noMore.value = false
    loadUserCities()
}

function goToDetail(cityId) {
    uni.navigateTo({ url: `/pages/city/detail?id=${cityId}` })
}

function goToCityList() {
    uni.switchTab({ url: '/pages/city/list' })
}

function formatTime(time) {
    if (!time) return ''
    const date = new Date(time)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
</script>

<style lang="scss" scoped>
.my-cities-page {
    min-height: 100vh;
    background-color: #f8f8f8;
}

.stats-card {
    display: flex;
    justify-content: space-around;
    padding: 30rpx;
    margin: 20rpx;
    background: linear-gradient(135deg, #1890ff, #36cfc9);
    border-radius: 10rpx;
}

.stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.stat-value {
    font-size: 36rpx;
    font-weight: bold;
    color: #ffffff;
    margin-bottom: 10rpx;
}

.stat-label {
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.8);
}

.city-list {
    height: calc(100vh - 200rpx);
    padding: 0 20rpx;
}

.city-item {
    display: flex;
    padding: 20rpx;
    margin-bottom: 20rpx;
    background-color: #ffffff;
    border-radius: 10rpx;
}

.city-cover {
    width: 160rpx;
    height: 120rpx;
    border-radius: 10rpx;
    margin-right: 20rpx;
}

.city-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.city-name {
    font-size: 30rpx;
    font-weight: bold;
    color: #333333;
}

.city-stats {
    display: flex;
    justify-content: space-between;
}

.block-count {
    font-size: 24rpx;
    color: #666666;
}

.total-amount {
    font-size: 26rpx;
    color: #ff6b00;
    font-weight: bold;
}

.buy-time {
    font-size: 22rpx;
    color: #999999;
}

.loading, .no-more {
    text-align: center;
    padding: 40rpx;
    color: #999999;
    font-size: 26rpx;
}

.empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 100rpx 0;
}

.empty-image {
    width: 200rpx;
    height: 200rpx;
    margin-bottom: 30rpx;
}

.empty-text {
    font-size: 28rpx;
    color: #999999;
    margin-bottom: 30rpx;
}

.empty-btn {
    padding: 15rpx 40rpx;
    background-color: #1890ff;
    color: #ffffff;
    border-radius: 30rpx;
    font-size: 28rpx;
    border: none;
}
</style>
