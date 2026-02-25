<template>
    <view class="notice-list-page">
        <view class="tabs">
            <view 
                class="tab-item" 
                :class="{ active: currentType === 0 }"
                @click="selectType(0)"
            >
                全部
            </view>
            <view 
                class="tab-item" 
                :class="{ active: currentType === 1 }"
                @click="selectType(1)"
            >
                公告
            </view>
            <view 
                class="tab-item" 
                :class="{ active: currentType === 2 }"
                @click="selectType(2)"
            >
                活动
            </view>
        </view>
        
        <scroll-view 
            class="notice-list" 
            scroll-y 
            @scrolltolower="loadMore"
            refresher-enabled
            :refresher-triggered="isRefreshing"
            @refresherrefresh="onRefresh"
        >
            <view class="notice-item" v-for="notice in noticeList" :key="notice.notice_id" @click="goToDetail(notice.notice_id)">
                <view class="notice-header">
                    <text class="notice-title">{{ notice.title }}</text>
                    <text class="notice-tag" v-if="notice.is_top">置顶</text>
                </view>
                <text class="notice-content">{{ notice.content }}</text>
                <view class="notice-footer">
                    <text class="notice-time">{{ formatTime(notice.created_at) }}</text>
                    <text class="notice-views">{{ notice.read_count }}阅读</text>
                </view>
            </view>
            
            <view class="loading" v-if="isLoading">
                <text>加载中...</text>
            </view>
            
            <view class="no-more" v-if="noMore && noticeList.length > 0">
                <text>没有更多了</text>
            </view>
            
            <view class="empty" v-if="!isLoading && noticeList.length === 0">
                <text>暂无公告</text>
            </view>
        </scroll-view>
    </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { get } from '@/utils/request'

const currentType = ref(0)
const noticeList = ref([])
const page = ref(1)
const isLoading = ref(false)
const isRefreshing = ref(false)
const noMore = ref(false)

onMounted(async () => {
    await loadNoticeList()
})

async function loadNoticeList(isLoadMore = false) {
    if (isLoading.value) return
    
    isLoading.value = true
    
    try {
        const params = {
            page: page.value,
            pageSize: 20
        }
        
        if (currentType.value > 0) {
            params.type = currentType.value
        }
        
        const data = await get('/notice/list', params)
        
        if (isLoadMore) {
            noticeList.value = [...noticeList.value, ...data.list]
        } else {
            noticeList.value = data.list || []
        }
        
        noMore.value = noticeList.value.length >= data.total
    } catch (error) {
        console.error('Load notice list failed:', error)
    } finally {
        isLoading.value = false
        isRefreshing.value = false
    }
}

function selectType(type) {
    currentType.value = type
    page.value = 1
    noMore.value = false
    loadNoticeList()
}

function loadMore() {
    if (noMore.value || isLoading.value) return
    
    page.value++
    loadNoticeList(true)
}

function onRefresh() {
    isRefreshing.value = true
    page.value = 1
    noMore.value = false
    loadNoticeList()
}

function goToDetail(noticeId) {
    uni.navigateTo({ url: `/pages/notice/detail?id=${noticeId}` })
}

function formatTime(time) {
    if (!time) return ''
    const date = new Date(time)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
</script>

<style lang="scss" scoped>
.notice-list-page {
    min-height: 100vh;
    background-color: #f8f8f8;
}

.tabs {
    display: flex;
    padding: 20rpx;
    background-color: #ffffff;
    border-bottom: 1rpx solid #eeeeee;
}

.tab-item {
    flex: 1;
    text-align: center;
    padding: 15rpx 0;
    font-size: 28rpx;
    color: #666666;
    
    &.active {
        color: #1890ff;
        font-weight: bold;
    }
}

.notice-list {
    height: calc(100vh - 100rpx);
    padding: 20rpx;
}

.notice-item {
    padding: 25rpx;
    margin-bottom: 15rpx;
    background-color: #ffffff;
    border-radius: 10rpx;
}

.notice-header {
    display: flex;
    align-items: center;
    margin-bottom: 15rpx;
}

.notice-title {
    flex: 1;
    font-size: 30rpx;
    font-weight: bold;
    color: #333333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.notice-tag {
    padding: 5rpx 15rpx;
    font-size: 20rpx;
    color: #ff4d4f;
    background-color: #fff1f0;
    border-radius: 10rpx;
    margin-left: 15rpx;
}

.notice-content {
    font-size: 26rpx;
    color: #666666;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin-bottom: 15rpx;
}

.notice-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.notice-time, .notice-views {
    font-size: 22rpx;
    color: #999999;
}

.loading, .no-more, .empty {
    text-align: center;
    padding: 40rpx;
    color: #999999;
    font-size: 26rpx;
}
</style>
