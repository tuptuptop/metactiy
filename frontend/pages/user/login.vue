<template>
    <view class="login-page">
        <view class="login-header">
            <image class="logo" src="/static/logo.png" mode="aspectFit" />
            <text class="title">元城市</text>
        </view>
        
        <view class="login-form">
            <view class="form-item">
                <input 
                    class="input" 
                    v-model="phone" 
                    type="number" 
                    placeholder="请输入手机号" 
                    maxlength="11"
                />
            </view>
            
            <view class="form-item" v-if="loginType === 'password'">
                <input 
                    class="input" 
                    v-model="password" 
                    type="password" 
                    placeholder="请输入密码" 
                />
            </view>
            
            <view class="form-item code-item" v-if="loginType === 'code'">
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
            
            <view class="login-type">
                <text @click="switchLoginType">
                    {{ loginType === 'password' ? '验证码登录' : '密码登录' }}
                </text>
            </view>
            
            <button class="login-btn" @click="handleLogin">登录</button>
            
            <view class="register-link">
                <text>还没有账号？</text>
                <text class="link" @click="goToRegister">立即注册</text>
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
const password = ref('')
const code = ref('')
const loginType = ref('password')
const countdown = ref(0)

function switchLoginType() {
    loginType.value = loginType.value === 'password' ? 'code' : 'password'
}

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

async function handleLogin() {
    if (!phone.value || !/^1[3-9]\d{9}$/.test(phone.value)) {
        uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
        return
    }
    
    if (loginType.value === 'password') {
        if (!password.value) {
            uni.showToast({ title: '请输入密码', icon: 'none' })
            return
        }
        
        try {
            await userStore.login(phone.value, password.value, 'password')
            uni.showToast({ title: '登录成功', icon: 'success' })
            setTimeout(() => {
                uni.switchTab({ url: '/pages/user/index' })
            }, 1000)
        } catch (error) {
            console.error('Login failed:', error)
        }
    } else {
        if (!code.value || !/^\d{6}$/.test(code.value)) {
            uni.showToast({ title: '请输入6位验证码', icon: 'none' })
            return
        }
        
        try {
            await userStore.loginByCode(phone.value, code.value)
            uni.showToast({ title: '登录成功', icon: 'success' })
            setTimeout(() => {
                uni.switchTab({ url: '/pages/user/index' })
            }, 1000)
        } catch (error) {
            console.error('Login failed:', error)
        }
    }
}

function goToRegister() {
    uni.navigateTo({ url: '/pages/user/register' })
}
</script>

<style lang="scss" scoped>
.login-page {
    min-height: 100vh;
    padding: 0 60rpx;
    background-color: #ffffff;
}

.login-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 120rpx;
    margin-bottom: 80rpx;
}

.logo {
    width: 160rpx;
    height: 160rpx;
    margin-bottom: 30rpx;
}

.title {
    font-size: 48rpx;
    font-weight: bold;
    color: #333333;
}

.login-form {
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

.login-type {
    text-align: right;
    margin-bottom: 40rpx;
    
    text {
        font-size: 26rpx;
        color: #1890ff;
    }
}

.login-btn {
    width: 100%;
    height: 90rpx;
    background-color: #1890ff;
    color: #ffffff;
    border-radius: 45rpx;
    font-size: 32rpx;
    border: none;
}

.register-link {
    text-align: center;
    margin-top: 40rpx;
    font-size: 26rpx;
    color: #999999;
    
    .link {
        color: #1890ff;
    }
}
</style>
