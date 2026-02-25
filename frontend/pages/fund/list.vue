<template>
    <view class="fund-list-page">
        <view class="fund-tabs">
            <view 
                class="tab-item" 
                :class="{ active: currentType === '' }"
                @click="selectType('')"
            >
                全部
            </view>
            <view 
                class="tab-item" 
                :class="{ active: currentType === '公益' }"
                @click="selectType('公益')"
            >
                公益
            </view>
            <view 
                class="tab-item" 
                :class="{ active: currentType === '建设' }"
                @click="selectType('建设')"
            >
                建设
            </view>
        </view>
        
        <scroll-view 
            class="fund-list" 
            scroll-y 
            @scrolltolower="loadMore"
            refresher-enabled
            :refresher-triggered="isRefreshing"
            @refresherrefresh="onRefresh"
        >
            <view class="fund-item" v-for="fund in fundList" :key="fund.fund_id" @click="goToDetail(fund.fund_id)">
                <view class="fund-header">
                    <text class="fund-name">{{ fund.fund_name }}</text>
                    <text class="fund-type">{{ fund.fund_type }}</text>
                </view>
                
                <text class="fund-desc">{{ fund.description }}</text>
                
                <view class="fund-progress">
                    <view class="progress-bar">
                        <view class="progress" :style="{ width: progressPercent(fund) + '%' }"></view>
                    </view>
                    <view class="progress-info">
                        <text class="current-amount">¥{{ formatAmount(fund.current_amount) }}</text>
                        <text class="target-amount">目标 ¥{{ formatAmount(fund.target_amount) }}</text>
                    </view>
                </view>
                
                <view class="fund-footer">
                    <text class="donor-count">{{ fund.donor_count }}人已捐赠</text>
                    <text class="donate-btn" @click.stop="goToDonate(fund)">立即捐赠</text>
                </view>
            </view>
            
            <view class="loading" v-if="isLoading">
                <text>加载中...</text>
            </view>
            
            <view class="no-more" v-if="noMore && fundList.length > 0">
                <text>没有更多了</text>
            </view>
            
            <view class="empty" v-if="!isLoading && fundList.length === 0">
                <text>暂无基金数据</text>
            </view>
        </scroll-view>
    </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { get } from '@/utils/request'

const currentType = ref('')
const fundList = ref([])
const page = ref(1)
const pageSize = ref(20)
const total = ref(0)
const isLoading = ref(false)
const isRefreshing = ref(false)
const noMore = ref(false)

onMounted(async () => {
    await loadFundList()
})

async function loadFundList(isLoadMore = false) {
    if (isLoading.value) return
    
    isLoading.value = true
    
    try {
        const params = {
            page: page.value,
            pageSize: pageSize.value
        }
        
        if (currentType.value) {
            params.fundType = currentType.value
        }
        
        const data = await get('/fund/list', params)
        
        if (isLoadMore) {
            fundList.value = [...fundList.value, ...data.list]
        } else {
            fundList.value = data.list
        }
        
        total.value = data.total
        noMore.value = fundList.value.length >= total.value
    } catch (error) {
        console.error('Load fund list failed:', error)
    } finally {
        isLoading.value = false
        isRefreshing.value = false
    }
}

function selectType(type) {
    currentType.value = type
    page.value = 1
    noMore.value = false
    loadFundList()
}

function loadMore() {
    if (noMore.value || isLoading.value) return
    
    page.value++
    loadFundList(true)
}

function onRefresh() {
    isRefreshing.value = true
    page.value = 1
    noMore.value = false
    loadFundList()
}

function goToDetail(fundId) {
    uni.navigateTo({ url: `/pages/fund/detail?id=${fundId}` })
}

function goToDonate(fund) {
    uni.showToast({
        title: '捐赠功能开发中',
        icon: 'none'
    })
}

function progressPercent(fund) {
    if (!fund.target_amount || fund.target_amount === 0) return 0
    return Math.round((fund.current_amount / fund.target_amount) * 100)
}

function formatAmount(amount) {
    if (!amount) return '0'
    if (amount >= 10000) {
        return (amount / 10000).toFixed(1) + '万'
    }
    return amount.toLocaleString()
}
</script>

<style lang="scss" scoped>
.fund-list-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: #f8f8f8;
}

.fund-tabs {
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

.fund-list {
    flex: 1;
    padding: 20rpx;
}

.fund-item {
    padding: 30rpx;
    margin-bottom: 20rpx;
    background-color: #ffffff;
    border-radius: 10rpx;
}

.fund-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
}

.fund-name {
    font-size: 32rpx;
    font-weight: bold;
    color: #333333;
}

.fund-type {
    padding: 5rpx 15rpx;
    font-size: 22rpx;
    color: #1890ff;
    background-color: #e6f7ff;
    border-radius: 15rpx;
}

.fund-desc {
    font-size: 26rpx;
    color: #666666;
    line-height: 1.5;
    margin-bottom: 20rpx;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.fund-progress {
    margin-bottom: 20rpx;
}

.progress-bar {
    width: 100%;
    height: 12rpx;
    background-color: #eeeeee;
    border-radius: 6rpx;
    overflow: hidden;
    margin-bottom: 10rpx;
}

.progress {
    height: 100%;
    background: linear-gradient(to right, #1890ff, #52c41a);
    border-radius: 6rpx;
}

.progress-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.current-amount {
    font-size: 28rpx;
    color: #1890ff;
    font-weight: bold;
}

.target-amount {
    font-size: 24rpx;
    color: #999999;
}

.fund-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.donor-count {
    font-size: 24rpx;
    color: #999999;
}

.donate-btn {
    padding: 10rpx 30rpx;
    font-size: 26rpx;
    color: #ffffff;
    background-color: #1890ff;
    border-radius: 25rpx;
}

.loading, .no-more, .empty {
    text-align: center;
    padding: 40rpx;
    color: #999999;
    font-size: 26rpx;
}
</style>
