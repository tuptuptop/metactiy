<template>
    <view class="fund-detail-page">
        <view class="fund-header">
            <text class="fund-name">{{ fund.fund_name }}</text>
            <text class="fund-type">{{ fund.fund_type }}</text>
        </view>
        
        <view class="fund-progress-card">
            <view class="amount-info">
                <view class="amount-item">
                    <text class="amount-value">¥{{ formatAmount(fund.current_amount) }}</text>
                    <text class="amount-label">已筹集</text>
                </view>
                <view class="amount-item">
                    <text class="amount-value">¥{{ formatAmount(fund.target_amount) }}</text>
                    <text class="amount-label">目标金额</text>
                </view>
                <view class="amount-item">
                    <text class="amount-value">{{ fund.donor_count }}</text>
                    <text class="amount-label">捐赠人数</text>
                </view>
            </view>
            
            <view class="progress-section">
                <view class="progress-bar">
                    <view class="progress" :style="{ width: progressPercent + '%' }"></view>
                </view>
                <text class="progress-text">{{ progressPercent }}%</text>
            </view>
        </view>
        
        <view class="fund-desc-section">
            <text class="section-title">项目介绍</text>
            <text class="fund-desc">{{ fund.description }}</text>
        </view>
        
        <view class="donations-section">
            <text class="section-title">捐赠记录</text>
            
            <view class="donation-item" v-for="item in donations" :key="item.donation_id">
                <image class="donor-avatar" :src="item.avatar || '/static/default-avatar.png'" mode="aspectFill" />
                <view class="donor-info">
                    <text class="donor-name">{{ item.nickname }}</text>
                    <text class="donation-time">{{ formatTime(item.created_at) }}</text>
                </view>
                <text class="donation-amount">¥{{ item.amount }}</text>
            </view>
            
            <view class="load-more" v-if="hasMoreDonations" @click="loadMoreDonations">
                <text>加载更多</text>
            </view>
            
            <view class="empty" v-if="donations.length === 0">
                <text>暂无捐赠记录</text>
            </view>
        </view>
        
        <view class="bottom-bar">
            <button class="donate-btn" @click="goToDonate">
                立即捐赠
            </button>
        </view>
    </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { get } from '@/utils/request'

const fundId = ref('')
const fund = ref({})
const donations = ref([])
const donationPage = ref(1)
const hasMoreDonations = ref(true)

const progressPercent = computed(() => {
    if (!fund.value.target_amount || fund.value.target_amount === 0) return 0
    return Math.round((fund.value.current_amount / fund.value.target_amount) * 100)
})

onLoad((options) => {
    fundId.value = options.id
    loadFundDetail()
    loadDonations()
})

async function loadFundDetail() {
    try {
        const data = await get(`/fund/detail/${fundId.value}`)
        fund.value = data || {}
    } catch (error) {
        console.error('Load fund detail failed:', error)
    }
}

async function loadDonations() {
    try {
        const data = await get('/fund/donations', {
            fundId: fundId.value,
            page: donationPage.value,
            pageSize: 20
        })
        
        if (donationPage.value === 1) {
            donations.value = data.list || []
        } else {
            donations.value = [...donations.value, ...(data.list || [])]
        }
        
        hasMoreDonations.value = donations.value.length < data.total
    } catch (error) {
        console.error('Load donations failed:', error)
    }
}

function loadMoreDonations() {
    donationPage.value++
    loadDonations()
}

function goToDonate() {
    uni.showToast({
        title: '捐赠功能开发中',
        icon: 'none'
    })
}

function formatAmount(amount) {
    if (!amount) return '0'
    if (amount >= 10000) {
        return (amount / 10000).toFixed(1) + '万'
    }
    return amount.toLocaleString()
}

function formatTime(time) {
    if (!time) return ''
    const date = new Date(time)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
</script>

<style lang="scss" scoped>
.fund-detail-page {
    min-height: 100vh;
    padding-bottom: 120rpx;
    background-color: #f8f8f8;
}

.fund-header {
    padding: 30rpx;
    background-color: #ffffff;
}

.fund-name {
    display: block;
    font-size: 40rpx;
    font-weight: bold;
    color: #333333;
    margin-bottom: 15rpx;
}

.fund-type {
    display: inline-block;
    padding: 5rpx 15rpx;
    font-size: 22rpx;
    color: #1890ff;
    background-color: #e6f7ff;
    border-radius: 15rpx;
}

.fund-progress-card {
    margin: 20rpx;
    padding: 30rpx;
    background-color: #ffffff;
    border-radius: 10rpx;
}

.amount-info {
    display: flex;
    justify-content: space-around;
    margin-bottom: 30rpx;
}

.amount-item {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.amount-value {
    font-size: 36rpx;
    font-weight: bold;
    color: #333333;
    margin-bottom: 10rpx;
}

.amount-label {
    font-size: 24rpx;
    color: #999999;
}

.progress-section {
    display: flex;
    align-items: center;
}

.progress-bar {
    flex: 1;
    height: 16rpx;
    background-color: #eeeeee;
    border-radius: 8rpx;
    overflow: hidden;
    margin-right: 20rpx;
}

.progress {
    height: 100%;
    background: linear-gradient(to right, #1890ff, #52c41a);
    border-radius: 8rpx;
}

.progress-text {
    font-size: 28rpx;
    color: #1890ff;
    font-weight: bold;
}

.fund-desc-section, .donations-section {
    margin: 20rpx;
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

.fund-desc {
    font-size: 28rpx;
    color: #666666;
    line-height: 1.6;
}

.donation-item {
    display: flex;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #eeeeee;
    
    &:last-child {
        border-bottom: none;
    }
}

.donor-avatar {
    width: 70rpx;
    height: 70rpx;
    border-radius: 35rpx;
    margin-right: 20rpx;
}

.donor-info {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.donor-name {
    font-size: 28rpx;
    color: #333333;
    margin-bottom: 5rpx;
}

.donation-time {
    font-size: 22rpx;
    color: #999999;
}

.donation-amount {
    font-size: 30rpx;
    color: #ff6b00;
    font-weight: bold;
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

.bottom-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20rpx;
    background-color: #ffffff;
    box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.donate-btn {
    width: 100%;
    height: 90rpx;
    background-color: #1890ff;
    color: #ffffff;
    border-radius: 45rpx;
    font-size: 32rpx;
    border: none;
}
</style>
