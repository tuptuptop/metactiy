<template>
    <view class="promote-page">
        <view class="promote-header">
            <view class="invite-code-section">
                <text class="label">我的邀请码</text>
                <view class="code-box">
                    <text class="code">{{ stats.inviteCode }}</text>
                    <text class="copy-btn" @click="copyCode">复制</text>
                </view>
            </view>
            
            <view class="invite-link-section">
                <text class="label">邀请链接</text>
                <view class="link-box">
                    <text class="link">{{ stats.inviteLink }}</text>
                    <text class="copy-btn" @click="copyLink">复制</text>
                </view>
            </view>
        </view>
        
        <view class="stats-card">
            <view class="stat-item">
                <text class="stat-value">{{ stats.inviteCount }}</text>
                <text class="stat-label">邀请人数</text>
            </view>
            <view class="stat-item">
                <text class="stat-value">{{ stats.validCount }}</text>
                <text class="stat-label">有效用户</text>
            </view>
            <view class="stat-item">
                <text class="stat-value">{{ stats.totalEarnings }}</text>
                <text class="stat-label">累计收益</text>
            </view>
        </view>
        
        <view class="action-section">
            <button class="share-btn" open-type="share">
                分享给好友
            </button>
            <button class="poster-btn" @click="generatePoster">
                生成推广海报
            </button>
        </view>
        
        <view class="invite-list-section">
            <text class="section-title">邀请记录</text>
            
            <view class="invite-item" v-for="item in inviteList" :key="item.userId">
                <image class="avatar" :src="item.avatar || '/static/default-avatar.png'" mode="aspectFill" />
                <view class="user-info">
                    <text class="nickname">{{ item.nickname }}</text>
                    <text class="register-time">{{ formatTime(item.registerTime) }}</text>
                </view>
                <text class="status" :class="{ valid: item.status === 1 }">
                    {{ item.status === 1 ? '有效' : '待激活' }}
                </text>
            </view>
            
            <view class="load-more" v-if="hasMore" @click="loadMore">
                <text>加载更多</text>
            </view>
            
            <view class="empty" v-if="inviteList.length === 0">
                <text>暂无邀请记录</text>
            </view>
        </view>
        
        <view class="rules-section">
            <text class="section-title">推广规则</text>
            <view class="rules-content">
                <text>1. 分享邀请链接给好友</text>
                <text>2. 好友通过链接注册成功</text>
                <text>3. 您将获得100积分奖励</text>
                <text>4. 好友首单您可获得额外奖励</text>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { get } from '@/utils/request'

const stats = ref({
    inviteCode: '',
    inviteLink: '',
    inviteCount: 0,
    validCount: 0,
    totalEarnings: 0
})

const inviteList = ref([])
const page = ref(1)
const hasMore = ref(true)

onMounted(async () => {
    await loadStats()
    await loadInviteList()
})

async function loadStats() {
    try {
        const data = await get('/promote/stats')
        stats.value = data || {}
    } catch (error) {
        console.error('Load stats failed:', error)
    }
}

async function loadInviteList() {
    try {
        const data = await get('/promote/invites', {
            page: page.value,
            pageSize: 20
        })
        
        if (page.value === 1) {
            inviteList.value = data.list || []
        } else {
            inviteList.value = [...inviteList.value, ...(data.list || [])]
        }
        
        hasMore.value = inviteList.value.length < data.total
    } catch (error) {
        console.error('Load invite list failed:', error)
    }
}

function loadMore() {
    page.value++
    loadInviteList()
}

function copyCode() {
    uni.setClipboardData({
        data: stats.value.inviteCode,
        success: () => {
            uni.showToast({ title: '邀请码已复制', icon: 'success' })
        }
    })
}

function copyLink() {
    uni.setClipboardData({
        data: stats.value.inviteLink,
        success: () => {
            uni.showToast({ title: '链接已复制', icon: 'success' })
        }
    })
}

async function generatePoster() {
    try {
        const data = await get('/promote/poster')
        uni.previewImage({
            urls: [data.posterUrl]
        })
    } catch (error) {
        uni.showToast({
            title: '生成海报失败',
            icon: 'none'
        })
    }
}

function formatTime(time) {
    if (!time) return ''
    const date = new Date(time)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
</script>

<style lang="scss" scoped>
.promote-page {
    min-height: 100vh;
    background-color: #f8f8f8;
}

.promote-header {
    padding: 30rpx;
    background: linear-gradient(135deg, #722ed1, #1890ff);
}

.invite-code-section, .invite-link-section {
    margin-bottom: 20rpx;
    
    .label {
        display: block;
        font-size: 26rpx;
        color: rgba(255, 255, 255, 0.8);
        margin-bottom: 10rpx;
    }
}

.code-box, .link-box {
    display: flex;
    align-items: center;
    padding: 20rpx;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 10rpx;
}

.code, .link {
    flex: 1;
    font-size: 32rpx;
    color: #ffffff;
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.copy-btn {
    padding: 10rpx 20rpx;
    font-size: 24rpx;
    color: #722ed1;
    background-color: #ffffff;
    border-radius: 20rpx;
}

.stats-card {
    display: flex;
    justify-content: space-around;
    margin: -30rpx 20rpx 20rpx;
    padding: 30rpx;
    background-color: #ffffff;
    border-radius: 10rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.stat-value {
    font-size: 40rpx;
    font-weight: bold;
    color: #333333;
    margin-bottom: 10rpx;
}

.stat-label {
    font-size: 24rpx;
    color: #999999;
}

.action-section {
    display: flex;
    margin: 0 20rpx 20rpx;
    gap: 20rpx;
}

.share-btn, .poster-btn {
    flex: 1;
    height: 80rpx;
    font-size: 28rpx;
    border-radius: 40rpx;
    border: none;
}

.share-btn {
    background-color: #722ed1;
    color: #ffffff;
}

.poster-btn {
    background-color: #ffffff;
    color: #722ed1;
    border: 2rpx solid #722ed1;
}

.invite-list-section, .rules-section {
    margin: 0 20rpx 20rpx;
    padding: 30rpx;
    background-color: #ffffff;
    border-radius: 10rpx;
}

.section-title {
    display: block;
    font-size: 32rpx;
    font-weight: bold;
    color: #333333;
    margin-bottom: 20rpx;
}

.invite-item {
    display: flex;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #eeeeee;
    
    &:last-child {
        border-bottom: none;
    }
}

.avatar {
    width: 70rpx;
    height: 70rpx;
    border-radius: 35rpx;
    margin-right: 20rpx;
}

.user-info {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.nickname {
    font-size: 28rpx;
    color: #333333;
    margin-bottom: 5rpx;
}

.register-time {
    font-size: 22rpx;
    color: #999999;
}

.status {
    padding: 5rpx 15rpx;
    font-size: 22rpx;
    color: #999999;
    background-color: #f5f5f5;
    border-radius: 15rpx;
    
    &.valid {
        color: #52c41a;
        background-color: #f6ffed;
    }
}

.load-more {
    text-align: center;
    padding: 20rpx;
    color: #1890ff;
    font-size: 26rpx;
}

.empty {
    text-align: center;
    padding: 40rpx;
    color: #999999;
    font-size: 26rpx;
}

.rules-content {
    display: flex;
    flex-direction: column;
    gap: 15rpx;
    
    text {
        font-size: 26rpx;
        color: #666666;
        line-height: 1.5;
    }
}
</style>
