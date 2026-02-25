<template>
    <view class="index-page">
        <swiper class="banner-swiper" indicator-dots autoplay circular>
            <swiper-item v-for="banner in banners" :key="banner.id" @click="onBannerClick(banner)">
                <image class="banner-image" :src="banner.image_url" mode="aspectFill" />
            </swiper-item>
        </swiper>
        
        <view class="function-entry">
            <view class="entry-item" v-for="item in functionEntries" :key="item.id" @click="onEntryClick(item)">
                <image class="entry-icon" :src="item.icon" mode="aspectFit" />
                <text class="entry-text">{{ item.name }}</text>
            </view>
        </view>
        
        <view class="section">
            <view class="section-header">
                <text class="section-title">热门城市</text>
                <text class="section-more" @click="goToCityList">更多</text>
            </view>
            <view class="city-grid">
                <view class="city-item" v-for="city in hotCities" :key="city.city_id" @click="goToCityDetail(city.city_id)">
                    <image class="city-cover" :src="city.cover_image" mode="aspectFill" />
                    <view class="city-info">
                        <text class="city-name">{{ city.city_name }}</text>
                        <text class="city-price">¥{{ city.min_price }}起</text>
                    </view>
                </view>
            </view>
        </view>
        
        <view class="section">
            <view class="section-header">
                <text class="section-title">最新动态</text>
            </view>
            <view class="news-list">
                <view class="news-item" v-for="news in newsList" :key="news.id">
                    <text class="news-title">{{ news.title }}</text>
                    <text class="news-time">{{ formatTime(news.created_at) }}</text>
                </view>
            </view>
        </view>
        
        <view class="notice-bar" v-if="notice" @click="goToNoticeDetail(notice.notice_id)">
            <text class="notice-icon">🔔</text>
            <text class="notice-text">{{ notice.title }}</text>
        </view>
    </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { get } from '@/utils/request'
import { useCityStore } from '@/store/city'

const cityStore = useCityStore()

const banners = ref([])
const hotCities = ref([])
const newsList = ref([])
const notice = ref(null)

const functionEntries = ref([
    { id: 1, name: '城市', icon: '/static/icons/city.png', path: '/pages/city/list' },
    { id: 2, name: '众创', icon: '/static/icons/create.png', path: '/pages/create/index' },
    { id: 3, name: '众投', icon: '/static/icons/vote.png', path: '/pages/vote/index' },
    { id: 4, name: '基金', icon: '/static/icons/fund.png', path: '/pages/fund/list' },
    { id: 5, name: '更多', icon: '/static/icons/more.png', path: '/pages/more/index' }
])

onMounted(async () => {
    await loadHomeData()
})

async function loadHomeData() {
    try {
        const data = await get('/home/index')
        banners.value = data.banners || []
        hotCities.value = data.hotCities || []
        newsList.value = data.news || []
        notice.value = data.notice || null
    } catch (error) {
        console.error('Load home data failed:', error)
    }
}

function onBannerClick(banner) {
    if (banner.link_url) {
        uni.navigateTo({ url: banner.link_url })
    }
}

function onEntryClick(item) {
    uni.navigateTo({ url: item.path })
}

function goToCityList() {
    uni.switchTab({ url: '/pages/city/list' })
}

function goToCityDetail(cityId) {
    uni.navigateTo({ url: `/pages/city/detail?id=${cityId}` })
}

function goToNoticeDetail(noticeId) {
    uni.navigateTo({ url: `/pages/notice/detail?id=${noticeId}` })
}

function formatTime(time) {
    if (!time) return ''
    const date = new Date(time)
    return `${date.getMonth() + 1}-${date.getDate()}`
}
</script>

<style lang="scss" scoped>
.index-page {
    min-height: 100vh;
    background-color: #f8f8f8;
}

.banner-swiper {
    width: 100%;
    height: 360rpx;
}

.banner-image {
    width: 100%;
    height: 100%;
}

.function-entry {
    display: flex;
    justify-content: space-around;
    padding: 30rpx 0;
    background-color: #ffffff;
}

.entry-item {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.entry-icon {
    width: 80rpx;
    height: 80rpx;
    margin-bottom: 10rpx;
}

.entry-text {
    font-size: 24rpx;
    color: #333333;
}

.section {
    margin-top: 20rpx;
    padding: 20rpx;
    background-color: #ffffff;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
}

.section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333333;
}

.section-more {
    font-size: 24rpx;
    color: #999999;
}

.city-grid {
    display: flex;
    flex-wrap: wrap;
    margin: -10rpx;
}

.city-item {
    width: calc(50% - 20rpx);
    margin: 10rpx;
    border-radius: 10rpx;
    overflow: hidden;
    background-color: #f8f8f8;
}

.city-cover {
    width: 100%;
    height: 200rpx;
}

.city-info {
    padding: 15rpx;
}

.city-name {
    display: block;
    font-size: 28rpx;
    color: #333333;
    margin-bottom: 5rpx;
}

.city-price {
    display: block;
    font-size: 24rpx;
    color: #ff6b00;
}

.news-list {
    background-color: #ffffff;
}

.news-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #eeeeee;
    
    &:last-child {
        border-bottom: none;
    }
}

.news-title {
    flex: 1;
    font-size: 28rpx;
    color: #333333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.news-time {
    font-size: 24rpx;
    color: #999999;
    margin-left: 20rpx;
}

.notice-bar {
    display: flex;
    align-items: center;
    padding: 20rpx;
    margin: 20rpx;
    background-color: #fff7e6;
    border-radius: 10rpx;
}

.notice-icon {
    margin-right: 10rpx;
}

.notice-text {
    flex: 1;
    font-size: 26rpx;
    color: #fa8c16;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
