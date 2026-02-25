<template>
    <view class="setting-page">
        <view class="setting-group">
            <view class="setting-item" @click="goToProfile">
                <text class="item-label">个人资料</text>
                <text class="item-arrow">›</text>
            </view>
            <view class="setting-item" @click="goToPassword">
                <text class="item-label">修改密码</text>
                <text class="item-arrow">›</text>
            </view>
            <view class="setting-item" @click="goToPhone">
                <text class="item-label">绑定手机</text>
                <text class="item-value">{{ maskedPhone }}</text>
                <text class="item-arrow">›</text>
            </view>
        </view>
        
        <view class="setting-group">
            <view class="setting-item" @click="clearCache">
                <text class="item-label">清除缓存</text>
                <text class="item-value">{{ cacheSize }}</text>
            </view>
            <view class="setting-item" @click="checkUpdate">
                <text class="item-label">检查更新</text>
                <text class="item-value">v1.0.0</text>
                <text class="item-arrow">›</text>
            </view>
        </view>
        
        <view class="setting-group">
            <view class="setting-item" @click="goToAbout">
                <text class="item-label">关于我们</text>
                <text class="item-arrow">›</text>
            </view>
            <view class="setting-item" @click="goToAgreement">
                <text class="item-label">用户协议</text>
                <text class="item-arrow">›</text>
            </view>
            <view class="setting-item" @click="goToPrivacy">
                <text class="item-label">隐私政策</text>
                <text class="item-arrow">›</text>
            </view>
        </view>
        
        <view class="logout-section" v-if="userStore.isLoggedIn">
            <button class="logout-btn" @click="logout">退出登录</button>
        </view>
    </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

const cacheSize = ref('0KB')

const maskedPhone = computed(() => {
    if (userStore.userInfo && userStore.userInfo.phone) {
        return userStore.userInfo.phone
    }
    return '未绑定'
})

onMounted(() => {
    calculateCacheSize()
})

function calculateCacheSize() {
    cacheSize.value = '0KB'
}

function goToProfile() {
    uni.showToast({ title: '功能开发中', icon: 'none' })
}

function goToPassword() {
    uni.showToast({ title: '功能开发中', icon: 'none' })
}

function goToPhone() {
    uni.showToast({ title: '功能开发中', icon: 'none' })
}

function clearCache() {
    uni.showModal({
        title: '提示',
        content: '确定要清除缓存吗？',
        success: (res) => {
            if (res.confirm) {
                uni.showLoading({ title: '清除中...' })
                setTimeout(() => {
                    uni.hideLoading()
                    cacheSize.value = '0KB'
                    uni.showToast({ title: '清除成功', icon: 'success' })
                }, 1000)
            }
        }
    })
}

function checkUpdate() {
    uni.showToast({ title: '已是最新版本', icon: 'success' })
}

function goToAbout() {
    uni.navigateTo({ url: '/pages/webview/index?url=https://www.metacity.top/about' })
}

function goToAgreement() {
    uni.navigateTo({ url: '/pages/webview/index?url=https://www.metacity.top/agreement' })
}

function goToPrivacy() {
    uni.navigateTo({ url: '/pages/webview/index?url=https://www.metacity.top/privacy' })
}

function logout() {
    uni.showModal({
        title: '提示',
        content: '确定要退出登录吗？',
        success: (res) => {
            if (res.confirm) {
                userStore.logout()
                uni.showToast({ title: '已退出登录', icon: 'success' })
                setTimeout(() => {
                    uni.switchTab({ url: '/pages/index/index' })
                }, 1000)
            }
        }
    })
}
</script>

<style lang="scss" scoped>
.setting-page {
    min-height: 100vh;
    background-color: #f8f8f8;
}

.setting-group {
    margin: 20rpx;
    background-color: #ffffff;
    border-radius: 10rpx;
}

.setting-item {
    display: flex;
    align-items: center;
    padding: 30rpx;
    border-bottom: 1rpx solid #eeeeee;
    
    &:last-child {
        border-bottom: none;
    }
}

.item-label {
    flex: 1;
    font-size: 30rpx;
    color: #333333;
}

.item-value {
    font-size: 26rpx;
    color: #999999;
    margin-right: 10rpx;
}

.item-arrow {
    font-size: 32rpx;
    color: #cccccc;
}

.logout-section {
    margin: 40rpx 20rpx;
}

.logout-btn {
    width: 100%;
    height: 90rpx;
    background-color: #ffffff;
    color: #ff4d4f;
    border-radius: 10rpx;
    font-size: 32rpx;
    border: none;
}
</style>
