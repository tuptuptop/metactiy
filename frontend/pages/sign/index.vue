<template>
    <view class="sign-page">
        <view class="sign-header">
            <view class="sign-status" :class="{ signed: signStatus.todaySigned }">
                <text class="status-icon">{{ signStatus.todaySigned ? '✓' : '📅' }}</text>
                <text class="status-text">{{ signStatus.todaySigned ? '今日已签到' : '今日未签到' }}</text>
            </view>
            
            <view class="sign-stats">
                <view class="stat-item">
                    <text class="stat-value">{{ signStatus.continuousDays }}</text>
                    <text class="stat-label">连续签到</text>
                </view>
                <view class="stat-item">
                    <text class="stat-value">{{ signStatus.totalDays }}</text>
                    <text class="stat-label">累计签到</text>
                </view>
                <view class="stat-item">
                    <text class="stat-value">{{ signStatus.todayPoints }}</text>
                    <text class="stat-label">今日获得</text>
                </view>
            </view>
        </view>
        
        <view class="sign-calendar-section">
            <text class="section-title">签到日历</text>
            <SignCalendar :signed-dates="signStatus.signCalendar" />
        </view>
        
        <view class="sign-rules-section">
            <text class="section-title">签到规则</text>
            <view class="rules-list">
                <view class="rule-item">
                    <text class="rule-day">每日签到</text>
                    <text class="rule-points">+10积分</text>
                </view>
                <view class="rule-item">
                    <text class="rule-day">连续3天</text>
                    <text class="rule-points">额外+5积分</text>
                </view>
                <view class="rule-item">
                    <text class="rule-day">连续7天</text>
                    <text class="rule-points">额外+20积分</text>
                </view>
            </view>
        </view>
        
        <view class="sign-btn-section">
            <button 
                class="sign-btn" 
                :class="{ disabled: signStatus.todaySigned }"
                @click="doSign"
            >
                {{ signStatus.todaySigned ? '今日已签到' : '立即签到' }}
            </button>
        </view>
        
        <view class="sign-records-section">
            <text class="section-title">签到记录</text>
            
            <view class="record-item" v-for="record in records" :key="record.sign_date">
                <view class="record-info">
                    <text class="record-date">{{ record.sign_date }}</text>
                    <text class="record-days">连续{{ record.continuous_days }}天</text>
                </view>
                <text class="record-points">+{{ record.points_earned }}积分</text>
            </view>
            
            <view class="load-more" v-if="hasMore" @click="loadMore">
                <text>加载更多</text>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSignStore } from '@/store/sign'
import SignCalendar from '@/components/business/SignCalendar.vue'

const signStore = useSignStore()

const signStatus = ref({
    todaySigned: false,
    continuousDays: 0,
    totalDays: 0,
    todayPoints: 0,
    signCalendar: []
})

const records = ref([])
const recordPage = ref(1)
const hasMore = ref(true)

onMounted(async () => {
    await loadSignStatus()
    await loadRecords()
})

async function loadSignStatus() {
    try {
        await signStore.getSignStatus()
        signStatus.value = signStore.signStatus || {}
    } catch (error) {
        console.error('Load sign status failed:', error)
    }
}

async function loadRecords() {
    try {
        const data = await signStore.getSignRecords(recordPage.value, 20)
        if (recordPage.value === 1) {
            records.value = data.list || []
        } else {
            records.value = [...records.value, ...(data.list || [])]
        }
        hasMore.value = records.value.length < data.total
    } catch (error) {
        console.error('Load records failed:', error)
    }
}

function loadMore() {
    recordPage.value++
    loadRecords()
}

async function doSign() {
    if (signStatus.value.todaySigned) return
    
    try {
        const result = await signStore.doSign()
        uni.showToast({
            title: `签到成功，获得${result.pointsEarned}积分`,
            icon: 'success'
        })
        await loadSignStatus()
        recordPage.value = 1
        await loadRecords()
    } catch (error) {
        console.error('Sign failed:', error)
    }
}
</script>

<style lang="scss" scoped>
.sign-page {
    min-height: 100vh;
    padding-bottom: 120rpx;
    background-color: #f8f8f8;
}

.sign-header {
    padding: 40rpx 30rpx;
    background: linear-gradient(135deg, #1890ff, #36cfc9);
}

.sign-status {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 30rpx;
    
    &.signed {
        .status-icon {
            background-color: #52c41a;
        }
    }
}

.status-icon {
    width: 100rpx;
    height: 100rpx;
    line-height: 100rpx;
    text-align: center;
    font-size: 50rpx;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    margin-bottom: 15rpx;
}

.status-text {
    font-size: 32rpx;
    color: #ffffff;
    font-weight: bold;
}

.sign-stats {
    display: flex;
    justify-content: space-around;
    padding: 20rpx 0;
}

.stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.stat-value {
    font-size: 40rpx;
    font-weight: bold;
    color: #ffffff;
    margin-bottom: 10rpx;
}

.stat-label {
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.8);
}

.sign-calendar-section, .sign-rules-section, .sign-records-section {
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

.rules-list {
    background-color: #f8f8f8;
    border-radius: 10rpx;
}

.rule-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 30rpx;
    border-bottom: 1rpx solid #eeeeee;
    
    &:last-child {
        border-bottom: none;
    }
}

.rule-day {
    font-size: 28rpx;
    color: #333333;
}

.rule-points {
    font-size: 28rpx;
    color: #ff6b00;
    font-weight: bold;
}

.sign-btn-section {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20rpx 30rpx;
    background-color: #ffffff;
    box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.sign-btn {
    width: 100%;
    height: 90rpx;
    background-color: #1890ff;
    color: #ffffff;
    border-radius: 45rpx;
    font-size: 32rpx;
    border: none;
    
    &.disabled {
        background-color: #cccccc;
    }
}

.record-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #eeeeee;
    
    &:last-child {
        border-bottom: none;
    }
}

.record-info {
    display: flex;
    flex-direction: column;
}

.record-date {
    font-size: 28rpx;
    color: #333333;
    margin-bottom: 5rpx;
}

.record-days {
    font-size: 24rpx;
    color: #999999;
}

.record-points {
    font-size: 28rpx;
    color: #52c41a;
    font-weight: bold;
}

.load-more {
    text-align: center;
    padding: 20rpx;
    color: #1890ff;
    font-size: 26rpx;
}
</style>
