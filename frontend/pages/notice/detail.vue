<template>
    <view class="notice-detail-page">
        <view class="notice-header">
            <text class="notice-title">{{ notice.title }}</text>
            <view class="notice-meta">
                <text class="notice-time">{{ formatTime(notice.created_at) }}</text>
                <text class="notice-views">{{ notice.read_count }}阅读</text>
            </view>
        </view>
        
        <view class="notice-content">
            <text>{{ notice.content }}</text>
        </view>
    </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { get } from '@/utils/request'

const noticeId = ref('')
const notice = ref({})

onLoad((options) => {
    noticeId.value = options.id
    loadNoticeDetail()
})

async function loadNoticeDetail() {
    try {
        const data = await get(`/notice/detail/${noticeId.value}`)
        notice.value = data || {}
    } catch (error) {
        console.error('Load notice detail failed:', error)
    }
}

function formatTime(time) {
    if (!time) return ''
    const date = new Date(time)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}
</script>

<style lang="scss" scoped>
.notice-detail-page {
    min-height: 100vh;
    background-color: #f8f8f8;
}

.notice-header {
    padding: 30rpx;
    background-color: #ffffff;
}

.notice-title {
    display: block;
    font-size: 36rpx;
    font-weight: bold;
    color: #333333;
    line-height: 1.4;
    margin-bottom: 20rpx;
}

.notice-meta {
    display: flex;
    gap: 30rpx;
}

.notice-time, .notice-views {
    font-size: 24rpx;
    color: #999999;
}

.notice-content {
    margin-top: 20rpx;
    padding: 30rpx;
    background-color: #ffffff;
    
    text {
        font-size: 28rpx;
        color: #333333;
        line-height: 1.8;
    }
}
</style>
