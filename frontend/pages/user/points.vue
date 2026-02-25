<template>
    <view class="points-page">
        <view class="points-header">
            <PointsCard 
                label="积分余额" 
                :value="balance" 
                show-button 
                button-text="积分规则"
                @action="showRules"
            />
        </view>
        
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
                获取
            </view>
            <view 
                class="tab-item" 
                :class="{ active: currentType === 2 }"
                @click="selectType(2)"
            >
                消耗
            </view>
        </view>
        
        <scroll-view 
            class="records-list" 
            scroll-y 
            @scrolltolower="loadMore"
            refresher-enabled
            :refresher-triggered="isRefreshing"
            @refresherrefresh="onRefresh"
        >
            <view class="record-item" v-for="record in records" :key="record.record_id">
                <view class="record-info">
                    <text class="record-desc">{{ record.description }}</text>
                    <text class="record-time">{{ formatTime(record.created_at) }}</text>
                </view>
                <text class="record-amount" :class="{ earn: record.type === 1, spend: record.type === 2 }">
                    {{ record.type === 1 ? '+' : '-' }}{{ record.amount }}
                </text>
            </view>
            
            <view class="loading" v-if="isLoading">
                <text>加载中...</text>
            </view>
            
            <view class="no-more" v-if="noMore && records.length > 0">
                <text>没有更多了</text>
            </view>
            
            <view class="empty" v-if="!isLoading && records.length === 0">
                <text>暂无积分记录</text>
            </view>
        </scroll-view>
        
        <view class="rules-popup" v-if="showRulesPopup" @click="showRulesPopup = false">
            <view class="rules-content" @click.stop>
                <text class="rules-title">积分规则</text>
                <view class="rules-list">
                    <view class="rule-item">
                        <text class="rule-name">每日签到</text>
                        <text class="rule-points">+10~30积分</text>
                    </view>
                    <view class="rule-item">
                        <text class="rule-name">完善资料</text>
                        <text class="rule-points">+50积分</text>
                    </view>
                    <view class="rule-item">
                        <text class="rule-name">绑定手机</text>
                        <text class="rule-points">+30积分</text>
                    </view>
                    <view class="rule-item">
                        <text class="rule-name">邀请好友</text>
                        <text class="rule-points">+100积分</text>
                    </view>
                </view>
                <button class="close-btn" @click="showRulesPopup = false">关闭</button>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePointsStore } from '@/store/points'
import PointsCard from '@/components/business/PointsCard.vue'

const pointsStore = usePointsStore()

const balance = ref(0)
const records = ref([])
const currentType = ref(0)
const page = ref(1)
const isLoading = ref(false)
const isRefreshing = ref(false)
const noMore = ref(false)
const showRulesPopup = ref(false)

onMounted(async () => {
    await loadBalance()
    await loadRecords()
})

async function loadBalance() {
    try {
        balance.value = await pointsStore.getBalance()
    } catch (error) {
        console.error('Load balance failed:', error)
    }
}

async function loadRecords(isLoadMore = false) {
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
        
        const data = await pointsStore.getRecords(params)
        
        if (isLoadMore) {
            records.value = [...records.value, ...data.list]
        } else {
            records.value = data.list || []
        }
        
        noMore.value = records.value.length >= data.total
    } catch (error) {
        console.error('Load records failed:', error)
    } finally {
        isLoading.value = false
        isRefreshing.value = false
    }
}

function selectType(type) {
    currentType.value = type
    page.value = 1
    noMore.value = false
    loadRecords()
}

function loadMore() {
    if (noMore.value || isLoading.value) return
    
    page.value++
    loadRecords(true)
}

function onRefresh() {
    isRefreshing.value = true
    page.value = 1
    noMore.value = false
    loadBalance()
    loadRecords()
}

function showRules() {
    showRulesPopup.value = true
}

function formatTime(time) {
    if (!time) return ''
    const date = new Date(time)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}
</script>

<style lang="scss" scoped>
.points-page {
    min-height: 100vh;
    background-color: #f8f8f8;
}

.points-header {
    padding: 20rpx;
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

.records-list {
    height: calc(100vh - 300rpx);
    padding: 20rpx;
}

.record-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 25rpx 20rpx;
    margin-bottom: 15rpx;
    background-color: #ffffff;
    border-radius: 10rpx;
}

.record-info {
    display: flex;
    flex-direction: column;
}

.record-desc {
    font-size: 28rpx;
    color: #333333;
    margin-bottom: 10rpx;
}

.record-time {
    font-size: 22rpx;
    color: #999999;
}

.record-amount {
    font-size: 32rpx;
    font-weight: bold;
    
    &.earn {
        color: #52c41a;
    }
    
    &.spend {
        color: #ff4d4f;
    }
}

.loading, .no-more, .empty {
    text-align: center;
    padding: 40rpx;
    color: #999999;
    font-size: 26rpx;
}

.rules-popup {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
}

.rules-content {
    width: 80%;
    padding: 40rpx;
    background-color: #ffffff;
    border-radius: 20rpx;
}

.rules-title {
    display: block;
    text-align: center;
    font-size: 36rpx;
    font-weight: bold;
    color: #333333;
    margin-bottom: 30rpx;
}

.rules-list {
    margin-bottom: 30rpx;
}

.rule-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #eeeeee;
    
    &:last-child {
        border-bottom: none;
    }
}

.rule-name {
    font-size: 28rpx;
    color: #333333;
}

.rule-points {
    font-size: 28rpx;
    color: #1890ff;
    font-weight: bold;
}

.close-btn {
    width: 100%;
    height: 80rpx;
    background-color: #1890ff;
    color: #ffffff;
    border-radius: 40rpx;
    font-size: 28rpx;
    border: none;
}
</style>
