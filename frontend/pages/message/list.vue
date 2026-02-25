<template>
    <view class="message-list-page">
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
                系统
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
            class="message-list" 
            scroll-y 
            @scrolltolower="loadMore"
            refresher-enabled
            :refresher-triggered="isRefreshing"
            @refresherrefresh="onRefresh"
        >
            <view class="message-item" v-for="msg in messageList" :key="msg.msg_id" :class="{ unread: !msg.is_read }">
                <view class="message-header">
                    <text class="message-title">{{ msg.title }}</text>
                    <text class="unread-dot" v-if="!msg.is_read"></text>
                </view>
                <text class="message-content">{{ msg.content }}</text>
                <view class="message-footer">
                    <text class="message-time">{{ formatTime(msg.created_at) }}</text>
                </view>
            </view>
            
            <view class="loading" v-if="isLoading">
                <text>加载中...</text>
            </view>
            
            <view class="no-more" v-if="noMore && messageList.length > 0">
                <text>没有更多了</text>
            </view>
            
            <view class="empty" v-if="!isLoading && messageList.length === 0">
                <text>暂无消息</text>
            </view>
        </scroll-view>
        
        <view class="bottom-bar" v-if="unreadCount > 0">
            <button class="read-all-btn" @click="markAllRead">
                全部标为已读 ({{ unreadCount }})
            </button>
        </view>
    </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { get, put } from '@/utils/request'

const currentType = ref(0)
const messageList = ref([])
const page = ref(1)
const isLoading = ref(false)
const isRefreshing = ref(false)
const noMore = ref(false)
const unreadCount = ref(0)

onMounted(async () => {
    await loadMessageList()
    await loadUnreadCount()
})

async function loadMessageList(isLoadMore = false) {
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
        
        const data = await get('/message/list', params)
        
        if (isLoadMore) {
            messageList.value = [...messageList.value, ...data.list]
        } else {
            messageList.value = data.list || []
        }
        
        noMore.value = messageList.value.length >= data.total
    } catch (error) {
        console.error('Load message list failed:', error)
    } finally {
        isLoading.value = false
        isRefreshing.value = false
    }
}

async function loadUnreadCount() {
    try {
        const data = await get('/message/unread')
        unreadCount.value = data.count || 0
    } catch (error) {
        console.error('Load unread count failed:', error)
    }
}

function selectType(type) {
    currentType.value = type
    page.value = 1
    noMore.value = false
    loadMessageList()
}

function loadMore() {
    if (noMore.value || isLoading.value) return
    
    page.value++
    loadMessageList(true)
}

function onRefresh() {
    isRefreshing.value = true
    page.value = 1
    noMore.value = false
    loadMessageList()
    loadUnreadCount()
}

async function markAllRead() {
    try {
        const unreadIds = messageList.value
            .filter(m => !m.is_read)
            .map(m => m.msg_id)
        
        if (unreadIds.length === 0) return
        
        await put('/message/read', { msgIds: unreadIds })
        
        messageList.value.forEach(m => {
            m.is_read = 1
        })
        
        unreadCount.value = 0
        
        uni.showToast({
            title: '已全部标为已读',
            icon: 'success'
        })
    } catch (error) {
        console.error('Mark all read failed:', error)
    }
}

function formatTime(time) {
    if (!time) return ''
    const date = new Date(time)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}
</script>

<style lang="scss" scoped>
.message-list-page {
    min-height: 100vh;
    padding-bottom: 120rpx;
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

.message-list {
    height: calc(100vh - 220rpx);
    padding: 20rpx;
}

.message-item {
    padding: 25rpx;
    margin-bottom: 15rpx;
    background-color: #ffffff;
    border-radius: 10rpx;
    
    &.unread {
        background-color: #e6f7ff;
    }
}

.message-header {
    display: flex;
    align-items: center;
    margin-bottom: 15rpx;
}

.message-title {
    flex: 1;
    font-size: 30rpx;
    font-weight: bold;
    color: #333333;
}

.unread-dot {
    width: 16rpx;
    height: 16rpx;
    background-color: #ff4d4f;
    border-radius: 50%;
}

.message-content {
    font-size: 26rpx;
    color: #666666;
    line-height: 1.5;
    margin-bottom: 15rpx;
}

.message-footer {
    display: flex;
    justify-content: flex-end;
}

.message-time {
    font-size: 22rpx;
    color: #999999;
}

.loading, .no-more, .empty {
    text-align: center;
    padding: 40rpx;
    color: #999999;
    font-size: 26rpx;
}

.bottom-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20rpx;
    background-color: #ffffff;
    box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.read-all-btn {
    width: 100%;
    height: 80rpx;
    background-color: #1890ff;
    color: #ffffff;
    border-radius: 40rpx;
    font-size: 28rpx;
    border: none;
}
</style>
