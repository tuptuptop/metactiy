<template>
    <view class="register-page">
        <view class="register-header">
            <text class="title">注册账号</text>
            <text class="subtitle">加入元城市，开启您的城市之旅</text>
        </view>
        
        <view class="register-form">
            <view class="form-item">
                <input 
                    class="input" 
                    v-model="phone" 
                    type="number" 
                    placeholder="请输入手机号" 
                    maxlength="11"
                />
            </view>
            
            <view class="form-item code-item">
                <input 
                    class="input" 
                    v-model="code" 
                    type="number" 
                    placeholder="请输入验证码" 
                    maxlength="6"
                />
                <text class="code-btn" :class="{ disabled: countdown > 0 }" @click="sendCode">
                    {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
                </text>
            </view>
            
            <view class="form-item">
                <input 
                    class="input" 
                    v-model="password" 
                    type="password" 
                    placeholder="请设置密码(至少6位)" 
                />
            </view>
            
            <view class="form-item">
                <input 
                    class="input" 
                    v-model="confirmPassword" 
                    type="password" 
                    placeholder="请确认密码" 
                />
            </view>
            
            <view class="form-item">
                <input 
                    class="input" 
                    v-model="inviteCode" 
                    placeholder="邀请码(选填)" 
                />
            </view>
            
            <view class="agreement">
                <checkbox :checked="agreed" @click="agreed = !agreed" />
                <text>我已阅读并同意</text>
                <text class="link" @click="viewAgreement">《用户协议》</text>
            </view>
            
            <button class="register-btn" @click="handleRegister">注册</button>
            
            <view class="login-link">
                <text>已有账号？</text>
                <text class="link" @click="goToLogin">立即登录</text>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/store/user'
import { post } from '@/utils/request'

const userStore = useUserStore()

const phone = ref('')
const code = ref('')
const password = ref('')
const confirmPassword = ref('')
const inviteCode = ref('')
const agreed = ref(false)
const countdown = ref(0)

async function sendCode() {
    if (countdown.value > 0) return
    
    if (!phone.value || !/^1[3-9]\d{9}$/.test(phone.value)) {
        uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
        return
    }
    
    try {
        await post('/user/sms/send', { phone: phone.value })
        uni.showToast({ title: '验证码已发送', icon: 'success' })
        
        countdown.value = 60
        const timer = setInterval(() => {
            countdown.value--
            if (countdown.value <= 0) {
                clearInterval(timer)
            }
        }, 1000)
    } catch (error) {
        console.error('Send code failed:', error)
    }
}

async function handleRegister() {
    if (!phone.value || !/^1[3-9]\d{9}$/.test(phone.value)) {
        uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
        return
    }
    
    if (!code.value || !/^\d{6}$/.test(code.value)) {
        uni.showToast({ title: '请输入6位验证码', icon: 'none' })
        return
    }
    
    if (!password.value || password.value.length < 6) {
        uni.showToast({ title: '密码至少6位', icon: 'none' })
        return
    }
    
    if (password.value !== confirmPassword.value) {
        uni.showToast({ title: '两次密码不一致', icon: 'none' })
        return
    }
    
    if (!agreed.value) {
        uni.showToast({ title: '请同意用户协议', icon: 'none' })
        return
    }
    
    try {
        await userStore.register(phone.value, password.value, code.value, inviteCode.value)
        uni.showToast({ title: '注册成功', icon: 'success' })
        setTimeout(() => {
            uni.switchTab({ url: '/pages/index/index' })
        }, 1000)
    } catch (error) {
        console.error('Register failed:', error)
    }
}

function viewAgreement() {
    uni.navigateTo({ url: '/pages/webview/index?url=https://www.metacity.top/agreement' })
}

function goToLogin() {
    uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.register-page {
    min-height: 100vh;
    padding: 0 60rpx;
    background-color: #ffffff;
}

.register-header {
    padding-top: 80rpx;
    margin-bottom: 60rpx;
}

.title {
    display: block;
    font-size: 48rpx;
    font-weight: bold;
    color: #333333;
    margin-bottom: 20rpx;
}

.subtitle {
    font-size: 28rpx;
    color: #999999;
}

.register-form {
    .form-item {
        margin-bottom: 30rpx;
    }
    
    .input {
        width: 100%;
        height: 90rpx;
        padding: 0 30rpx;
        background-color: #f5f5f5;
        border-radius: 45rpx;
        font-size: 30rpx;
    }
    
    .code-item {
        display: flex;
        align-items: center;
        
        .input {
            flex: 1;
            margin-right: 20rpx;
        }
        
        .code-btn {
            padding: 0 30rpx;
            height: 90rpx;
            line-height: 90rpx;
            background-color: #1890ff;
            color: #ffffff;
            border-radius: 45rpx;
            font-size: 28rpx;
            white-space: nowrap;
            
            &.disabled {
                background-color: #cccccc;
            }
        }
    }
}

.agreement {
    display: flex;
    align-items: center;
    margin-bottom: 40rpx;
    font-size: 26rpx;
    color: #666666;
    
    checkbox {
        margin-right: 10rpx;
    }
    
    .link {
        color: #1890ff;
    }
}

.register-btn {
    width: 100%;
    height: 90rpx;
    background-color: #1890ff;
    color: #ffffff;
    border-radius: 45rpx;
    font-size: 32rpx;
    border: none;
}

.login-link {
    text-align: center;
    margin-top: 40rpx;
    font-size: 26rpx;
    color: #999999;
    
    .link {
        color: #1890ff;
    }
}
</style>
