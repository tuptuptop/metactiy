<template>
    <view class="city-card" @click="onClick">
        <image class="city-cover" :src="city.cover_image" mode="aspectFill" />
        <view class="city-info">
            <text class="city-name">{{ city.city_name }}</text>
            <text class="city-province">{{ city.province }}</text>
            <view class="city-bottom">
                <text class="city-price">¥{{ city.min_price }}起</text>
                <view class="progress-bar">
                    <view class="progress" :style="{ width: progressPercent + '%' }"></view>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    city: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['click'])

const progressPercent = computed(() => {
    if (!props.city.total_count || props.city.total_count === 0) return 0
    return Math.round((props.city.sold_count / props.city.total_count) * 100)
})

function onClick() {
    emit('click', props.city)
}
</script>

<style lang="scss" scoped>
.city-card {
    display: flex;
    padding: 20rpx;
    background-color: #ffffff;
    border-radius: 10rpx;
    margin-bottom: 20rpx;
}

.city-cover {
    width: 180rpx;
    height: 140rpx;
    border-radius: 10rpx;
    margin-right: 20rpx;
}

.city-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.city-name {
    font-size: 30rpx;
    font-weight: bold;
    color: #333333;
}

.city-province {
    font-size: 24rpx;
    color: #999999;
}

.city-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.city-price {
    font-size: 28rpx;
    color: #ff6b00;
    font-weight: bold;
}

.progress-bar {
    width: 150rpx;
    height: 8rpx;
    background-color: #eeeeee;
    border-radius: 4rpx;
    overflow: hidden;
}

.progress {
    height: 100%;
    background-color: #1890ff;
    border-radius: 4rpx;
}
</style>
