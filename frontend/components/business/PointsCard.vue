<template>
    <view class="points-card">
        <view class="points-header">
            <text class="points-label">{{ label }}</text>
            <text class="points-value">{{ value }}</text>
        </view>
        <view class="points-footer" v-if="showButton">
            <button class="points-btn" @click="$emit('action')">
                {{ buttonText }}
            </button>
        </view>
    </view>
</template>

<script setup>
defineProps({
    label: {
        type: String,
        default: '积分余额'
    },
    value: {
        type: [Number, String],
        default: 0
    },
    showButton: {
        type: Boolean,
        default: false
    },
    buttonText: {
        type: String,
        default: '积分明细'
    }
})

defineEmits(['action'])
</script>

<style lang="scss" scoped>
.points-card {
    padding: 30rpx;
    background: linear-gradient(135deg, #1890ff, #36cfc9);
    border-radius: 10rpx;
    color: #ffffff;
}

.points-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20rpx 0;
}

.points-label {
    font-size: 26rpx;
    opacity: 0.8;
    margin-bottom: 10rpx;
}

.points-value {
    font-size: 60rpx;
    font-weight: bold;
}

.points-footer {
    margin-top: 20rpx;
    text-align: center;
}

.points-btn {
    padding: 15rpx 40rpx;
    background-color: rgba(255, 255, 255, 0.2);
    color: #ffffff;
    border-radius: 30rpx;
    font-size: 26rpx;
    border: none;
}
</style>
