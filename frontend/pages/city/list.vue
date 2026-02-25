<template>
    <view class="city-list-page">
        <view class="search-bar">
            <input 
                class="search-input" 
                v-model="keyword" 
                placeholder="搜索城市" 
                @confirm="onSearch"
            />
            <text class="search-btn" @click="onSearch">搜索</text>
        </view>
        
        <scroll-view 
            class="category-scroll" 
            scroll-x 
            :scroll-into-view="'cat-' + currentCategory"
        >
            <view 
                class="category-item" 
                :class="{ active: currentCategory === 0 }"
                id="cat-0"
                @click="selectCategory(0)"
            >
                全部
            </view>
            <view 
                class="category-item" 
                v-for="cat in categories" 
                :key="cat.id"
                :class="{ active: currentCategory === cat.id }"
                :id="'cat-' + cat.id"
                @click="selectCategory(cat.id)"
            >
                {{ cat.category_name }}
            </view>
        </scroll-view>
        
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
                    <view class="city-header">
                        <text class="city-name">{{ city.city_name }}</text>
                        <view class="hot-level">
                            <text v-for="i in city.hot_level" :key="i" class="star">⭐</text>
                        </view>
                    </view>
                    <text class="city-province">{{ city.province }}</text>
                    <view class="city-stats">
                        <text class="sold-count">已售 {{ city.sold_count }}</text>
                        <text class="price">¥{{ city.min_price }}起</text>
                    </view>
                    <view class="progress-bar">
                        <view class="progress" :style="{ width: progressPercent(city) + '%' }"></view>
                    </view>
                </view>
            </view>
            
            <view class="loading" v-if="isLoading">
                <text>加载中...</text>
            </view>
            
            <view class="no-more" v-if="noMore && cityList.length > 0">
                <text>没有更多了</text>
            </view>
            
            <view class="empty" v-if="!isLoading && cityList.length === 0">
                <text>暂无城市数据</text>
            </view>
        </scroll-view>
    </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { get } from '@/utils/request'

const keyword = ref('')
const categories = ref([])
const currentCategory = ref(0)
const cityList = ref([])
const page = ref(1)
const pageSize = ref(20)
const total = ref(0)
const isLoading = ref(false)
const isRefreshing = ref(false)
const noMore = ref(false)

onMounted(async () => {
    await loadCategories()
    await loadCityList()
})

async function loadCategories() {
    try {
        const data = await get('/city/category')
        categories.value = data || []
    } catch (error) {
        console.error('Load categories failed:', error)
    }
}

async function loadCityList(isLoadMore = false) {
    if (isLoading.value) return
    
    isLoading.value = true
    
    try {
        const params = {
            page: page.value,
            pageSize: pageSize.value
        }
        
        if (currentCategory.value > 0) {
            params.categoryId = currentCategory.value
        }
        
        if (keyword.value) {
            params.keyword = keyword.value
        }
        
        const data = await get('/city/list', params)
        
        if (isLoadMore) {
            cityList.value = [...cityList.value, ...data.list]
        } else {
            cityList.value = data.list
        }
        
        total.value = data.total
        noMore.value = cityList.value.length >= total.value
    } catch (error) {
        console.error('Load city list failed:', error)
    } finally {
        isLoading.value = false
        isRefreshing.value = false
    }
}

function selectCategory(categoryId) {
    currentCategory.value = categoryId
    page.value = 1
    noMore.value = false
    loadCityList()
}

function onSearch() {
    page.value = 1
    noMore.value = false
    loadCityList()
}

function loadMore() {
    if (noMore.value || isLoading.value) return
    
    page.value++
    loadCityList(true)
}

function onRefresh() {
    isRefreshing.value = true
    page.value = 1
    noMore.value = false
    loadCityList()
}

function goToDetail(cityId) {
    uni.navigateTo({ url: `/pages/city/detail?id=${cityId}` })
}

function progressPercent(city) {
    if (!city.total_count || city.total_count === 0) return 0
    return Math.round((city.sold_count / city.total_count) * 100)
}
</script>

<style lang="scss" scoped>
.city-list-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: #f8f8f8;
}

.search-bar {
    display: flex;
    align-items: center;
    padding: 20rpx;
    background-color: #ffffff;
}

.search-input {
    flex: 1;
    height: 70rpx;
    padding: 0 20rpx;
    background-color: #f5f5f5;
    border-radius: 35rpx;
    font-size: 28rpx;
}

.search-btn {
    margin-left: 20rpx;
    font-size: 28rpx;
    color: #1890ff;
}

.category-scroll {
    white-space: nowrap;
    padding: 20rpx;
    background-color: #ffffff;
    border-bottom: 1rpx solid #eeeeee;
}

.category-item {
    display: inline-block;
    padding: 10rpx 30rpx;
    margin-right: 20rpx;
    font-size: 26rpx;
    color: #666666;
    background-color: #f5f5f5;
    border-radius: 30rpx;
    
    &.active {
        color: #ffffff;
        background-color: #1890ff;
    }
}

.city-list {
    flex: 1;
    padding: 20rpx;
}

.city-item {
    display: flex;
    padding: 20rpx;
    margin-bottom: 20rpx;
    background-color: #ffffff;
    border-radius: 10rpx;
}

.city-cover {
    width: 200rpx;
    height: 150rpx;
    border-radius: 10rpx;
    margin-right: 20rpx;
}

.city-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.city-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.city-name {
    font-size: 32rpx;
    font-weight: bold;
    color: #333333;
}

.star {
    font-size: 20rpx;
}

.city-province {
    font-size: 24rpx;
    color: #999999;
}

.city-stats {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.sold-count {
    font-size: 24rpx;
    color: #666666;
}

.price {
    font-size: 28rpx;
    color: #ff6b00;
    font-weight: bold;
}

.progress-bar {
    width: 100%;
    height: 8rpx;
    background-color: #eeeeee;
    border-radius: 4rpx;
    overflow: hidden;
}

.progress {
    height: 100%;
    background-color: #1890ff;
    border-radius: 4rpx;
}

.loading, .no-more, .empty {
    text-align: center;
    padding: 40rpx;
    color: #999999;
    font-size: 26rpx;
}
</style>
