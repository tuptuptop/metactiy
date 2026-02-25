<template>
    <view class="user-page">
        <view class="user-header" v-if="userStore.isLoggedIn">
            <image class="avatar" :src="userInfo.avatar || '/static/default-avatar.png'" mode="aspectFill" />
            <view class="user-info">
                <text class="nickname">{{ userInfo.nickname || '元居民' }}</text>
                <text class="user-id">ID: {{ userInfo.userId }}</text>
            </view>
        </view>
        
        <view class="user-header" v-else @click="goToLogin">
            <image class="avatar" src="/static/default-avatar.png" mode="aspectFill" />
            <view class="user-info">
                <text class="nickname">点击登录</text>
                <text class="user-id">登录后查看更多功能</text>
            </view>
        </view>
        
        <view class="assets-card" v-if="userStore.isLoggedIn">
            <view class="asset-item" @click="goToCities">
                <text class="asset-value">{{ assets.totalCities }}</text>
                <text class="asset-label">我的城市</text>
            </view>
            <view class="asset-item" @click="goToPoints">
                <text class="asset-value">{{ assets.totalPoints }}</text>
                <text class="asset-label">积分</text>
            </view>
            <view class="asset-item" @click="goToPromote">
                <text class="asset-value">{{ assets.inviteCount }}</text>
                <text class="asset-label">邀请好友</text>
            </view>
        </view>
        
        <view class="sign-card" v-if="userStore.isLoggedIn" @click="goToSign">
            <view class="sign-info">
                <text class="sign-title">每日签到</text>
                <text class="sign-desc">连续签到{{ signStatus.continuousDays }}天</text>
            </view>
            <view class="sign-btn" :class="{ signed: signStatus.todaySigned }">
                {{ signStatus.todaySigned ? '已签到' : '签到' }}
            </view>
        </view>
        
        <view class="menu-list">
            <view class="menu-item" v-for="item in menuList" :key="item.id" @click="onMenuClick(item)">
                <image class="menu-icon" :src="item.icon" mode="aspectFit" />
                <text class="menu-text">{{ item.name }}</text>
                <text class="menu-arrow">›</text>
            </view>
        </view>
        
        <view class="logout-btn" v-if="userStore.isLoggedIn" @click="logout">
            退出登录
        </view>
    </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/store/user'
import { useSignStore } from '@/store/sign'
import { get } from '@/utils/request'

const userStore = useUserStore()
const signStore = useSignStore()

const userInfo = ref({})
const assets = ref({
    totalCities: 0,
    totalPoints: 0,
    inviteCount: 0
})
const signStatus = ref({
    todaySigned: false,
    continuousDays: 0
})

const menuList = ref([
    { id: 1, name: '我的城市', icon: '/static/icons/city.png', path: '/pages/user/cities' },
    { id: 2, name: '积分明细', icon: '/static/icons/points.png', path: '/pages/user/points' },
    { id: 3, name: '推广中心', icon: '/static/icons/promote.png', path: '/pages/promote/index' },
    { id: 4, name: '消息中心', icon: '/static/icons/message.png', path: '/pages/message/list' },
    { id: 5, name: '意见反馈', icon: '/static/icons/feedback.png', path: '/pages/feedback/index' },
    { id: 6, name: '设置', icon: '/static/icons/setting.png', path: '/pages/user/setting' }
])

onMounted(async () => {
    if (userStore.isLoggedIn) {
        await loadUserData()
    }
})

async function loadUserData() {
    try {
        const data = await get('/user/center')
        userInfo.value = data.userInfo || {}
        assets.value = data.assets || {}
        
        await signStore.getSignStatus()
        signStatus.value = signStore.signStatus || {}
    } catch (error) {
        console.error('Load user data failed:', error)
    }
}

function goToLogin() {
    uni.navigateTo({ url: '/pages/user/login' })
}

function goToCities() {
    uni.navigateTo({ url: '/pages/user/cities' })
}

function goToPoints() {
    uni.navigateTo({ url: '/pages/user/points' })
}

function goToPromote() {
    uni.navigateTo({ url: '/pages/promote/index' })
}

function goToSign() {
    uni.navigateTo({ url: '/pages/sign/index' })
}

function onMenuClick(item) {
    if (!userStore.isLoggedIn) {
        goToLogin()
        return
    }
    uni.navigateTo({ url: item.path })
}

function logout() {
    uni.showModal({
        title: '提示',
        content: '确定要退出登录吗？',
        success: (res) => {
            if (res.confirm) {
                userStore.logout()
                uni.showToast({
                    title: '已退出登录',
                    icon: 'success'
                })
            }
        }
    })
}
</script>

<style lang="scss" scoped>
.user-page {
    min-height: 100vh;
    background-color: #f8f8f8;
}

.user-header {
    display: flex;
    align-items: center;
    padding: 40rpx 30rpx;
    background: linear-gradient(135deg, #1890ff, #36cfc9);
}

.avatar {
    width: 120rpx;
    height: 120rpx;
    border-radius: 60rpx;
    border: 4rpx solid #ffffff;
    margin-right: 30rpx;
}

.user-info {
    display: flex;
    flex-direction: column;
}

.nickname {
    font-size: 36rpx;
    font-weight: bold;
    color: #ffffff;
    margin-bottom: 10rpx;
}

.user-id {
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.8);
}

.assets-card {
    display: flex;
    justify-content: space-around;
    margin: -30rpx 30rpx 20rpx;
    padding: 30rpx;
    background-color: #ffffff;
    border-radius: 10rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.asset-item {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.asset-value {
    font-size: 40rpx;
    font-weight: bold;
    color: #333333;
    margin-bottom: 10rpx;
}

.asset-label {
    font-size: 24rpx;
    color: #999999;
}

.sign-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 30rpx 20rpx;
    padding: 30rpx;
    background-color: #ffffff;
    border-radius: 10rpx;
}

.sign-info {
    display: flex;
    flex-direction: column;
}

.sign-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333333;
    margin-bottom: 10rpx;
}

.sign-desc {
    font-size: 24rpx;
    color: #999999;
}

.sign-btn {
    padding: 15rpx 40rpx;
    background-color: #1890ff;
    color: #ffffff;
    border-radius: 30rpx;
    font-size: 28rpx;
    
    &.signed {
        background-color: #cccccc;
    }
}

.menu-list {
    margin: 0 30rpx;
    background-color: #ffffff;
    border-radius: 10rpx;
}

.menu-item {
    display: flex;
    align-items: center;
    padding: 30rpx;
    border-bottom: 1rpx solid #eeeeee;
    
    &:last-child {
        border-bottom: none;
    }
}

.menu-icon {
    width: 40rpx;
    height: 40rpx;
    margin-right: 20rpx;
}

.menu-text {
    flex: 1;
    font-size: 30rpx;
    color: #333333;
}

.menu-arrow {
    font-size: 32rpx;
    color: #cccccc;
}

.logout-btn {
    margin: 40rpx 30rpx;
    padding: 25rpx;
    text-align: center;
    background-color: #ffffff;
    border-radius: 10rpx;
    font-size: 30rpx;
    color: #ff4d4f;
}
</style>
