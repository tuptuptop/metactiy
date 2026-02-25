<template>
    <view class="city-detail-page">
        <swiper class="banner-swiper" indicator-dots circular v-if="city.banner_images && city.banner_images.length">
            <swiper-item v-for="(img, index) in city.banner_images" :key="index">
                <image class="banner-image" :src="img" mode="aspectFill" />
            </swiper-item>
        </swiper>
        
        <image v-else class="cover-image" :src="city.cover_image" mode="aspectFill" />
        
        <view class="city-header">
            <text class="city-name">{{ city.city_name }}</text>
            <view class="hot-level">
                <text v-for="i in city.hot_level" :key="i" class="star">⭐</text>
            </view>
        </view>
        
        <view class="city-stats">
            <view class="stat-item">
                <text class="stat-value">{{ city.sold_count }}</text>
                <text class="stat-label">已售</text>
            </view>
            <view class="stat-item">
                <text class="stat-value">{{ city.total_count }}</text>
                <text class="stat-label">总量</text>
            </view>
            <view class="stat-item">
                <text class="stat-value">¥{{ city.min_price }}-{{ city.max_price }}</text>
                <text class="stat-label">价格区间</text>
            </view>
        </view>
        
        <view class="progress-section">
            <text class="section-title">销售进度</text>
            <view class="progress-bar">
                <view class="progress" :style="{ width: progressPercent + '%' }"></view>
            </view>
            <text class="progress-text">{{ progressPercent }}%</text>
        </view>
        
        <view class="description-section" v-if="city.description">
            <text class="section-title">城市介绍</text>
            <text class="description">{{ city.description }}</text>
        </view>
        
        <view class="features-section" v-if="city.features && city.features.length">
            <text class="section-title">城市特色</text>
            <view class="features">
                <text class="feature-tag" v-for="(feature, index) in city.features" :key="index">
                    {{ feature }}
                </text>
            </view>
        </view>
        
        <view class="announcements-section" v-if="announcements.length">
            <text class="section-title">城市公告</text>
            <view class="announcement-item" v-for="item in announcements" :key="item.id">
                <text class="announcement-title">{{ item.title }}</text>
                <text class="announcement-time">{{ formatTime(item.created_at) }}</text>
            </view>
        </view>
        
        <view class="bottom-bar">
            <view class="action-btn favorite" @click="toggleFavorite">
                <text>{{ isFavorite ? '已收藏' : '收藏' }}</text>
            </view>
            <view class="action-btn buy" @click="goToBuy">
                <text>立即购买</text>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { get } from '@/utils/request'

const cityId = ref('')
const city = ref({})
const announcements = ref([])
const isFavorite = ref(false)

const progressPercent = computed(() => {
    if (!city.value.total_count || city.value.total_count === 0) return 0
    return Math.round((city.value.sold_count / city.value.total_count) * 100)
})

onLoad((options) => {
    cityId.value = options.id
    loadCityDetail()
    loadAnnouncements()
})

async function loadCityDetail() {
    try {
        const data = await get(`/city/detail/${cityId.value}`)
        city.value = data || {}
        
        if (typeof data.banner_images === 'string') {
            try {
                city.value.banner_images = JSON.parse(data.banner_images)
            } catch {
                city.value.banner_images = []
            }
        }
        
        if (typeof data.features === 'string') {
            try {
                city.value.features = JSON.parse(data.features)
            } catch {
                city.value.features = []
            }
        }
    } catch (error) {
        console.error('Load city detail failed:', error)
    }
}

async function loadAnnouncements() {
    try {
        const data = await get(`/city/announcement/${cityId.value}`, { pageSize: 5 })
        announcements.value = data.list || []
    } catch (error) {
        console.error('Load announcements failed:', error)
    }
}

function toggleFavorite() {
    isFavorite.value = !isFavorite.value
    uni.showToast({
        title: isFavorite.value ? '收藏成功' : '取消收藏',
        icon: 'success'
    })
}

function goToBuy() {
    uni.showToast({
        title: '购买功能开发中',
        icon: 'none'
    })
}

function formatTime(time) {
    if (!time) return ''
    const date = new Date(time)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
</script>

<style lang="scss" scoped>
.city-detail-page {
    min-height: 100vh;
    padding-bottom: 120rpx;
    background-color: #f8f8f8;
}

.banner-swiper {
    width: 100%;
    height: 400rpx;
}

.banner-image, .cover-image {
    width: 100%;
    height: 400rpx;
}

.city-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx;
    background-color: #ffffff;
}

.city-name {
    font-size: 40rpx;
    font-weight: bold;
    color: #333333;
}

.star {
    font-size: 24rpx;
}

.city-stats {
    display: flex;
    justify-content: space-around;
    padding: 30rpx;
    margin-top: 20rpx;
    background-color: #ffffff;
}

.stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.stat-value {
    font-size: 32rpx;
    font-weight: bold;
    color: #333333;
    margin-bottom: 10rpx;
}

.stat-label {
    font-size: 24rpx;
    color: #999999;
}

.progress-section, .description-section, .features-section, .announcements-section {
    margin-top: 20rpx;
    padding: 30rpx;
    background-color: #ffffff;
}

.section-title {
    display: block;
    font-size: 32rpx;
    font-weight: bold;
    color: #333333;
    margin-bottom: 20rpx;
}

.progress-bar {
    width: 100%;
    height: 16rpx;
    background-color: #eeeeee;
    border-radius: 8rpx;
    overflow: hidden;
    margin-bottom: 10rpx;
}

.progress {
    height: 100%;
    background: linear-gradient(to right, #1890ff, #52c41a);
    border-radius: 8rpx;
}

.progress-text {
    font-size: 24rpx;
    color: #1890ff;
}

.description {
    font-size: 28rpx;
    color: #666666;
    line-height: 1.6;
}

.features {
    display: flex;
    flex-wrap: wrap;
}

.feature-tag {
    padding: 10rpx 20rpx;
    margin-right: 20rpx;
    margin-bottom: 20rpx;
    font-size: 24rpx;
    color: #1890ff;
    background-color: #e6f7ff;
    border-radius: 20rpx;
}

.announcement-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #eeeeee;
    
    &:last-child {
        border-bottom: none;
    }
}

.announcement-title {
    flex: 1;
    font-size: 28rpx;
    color: #333333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.announcement-time {
    font-size: 24rpx;
    color: #999999;
    margin-left: 20rpx;
}

.bottom-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    padding: 20rpx;
    background-color: #ffffff;
    box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.action-btn {
    flex: 1;
    height: 80rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 40rpx;
    font-size: 30rpx;
    
    &.favorite {
        margin-right: 20rpx;
        background-color: #f5f5f5;
        color: #666666;
    }
    
    &.buy {
        background-color: #1890ff;
        color: #ffffff;
    }
}
</style>
