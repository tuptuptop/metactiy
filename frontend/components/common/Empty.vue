<template>
    <view class="empty">
        <image class="empty-image" :src="image" mode="aspectFit" />
        <text class="empty-text">{{ text }}</text>
        <button v-if="showButton" class="empty-btn" @click="$emit('action')">
            {{ buttonText }}
        </button>
    </view>
</template>

<script setup>
defineProps({
    image: {
        type: String,
        default: '/static/images/empty.png'
    },
    text: {
        type: String,
        default: '暂无数据'
    },
    showButton: {
        type: Boolean,
        default: false
    },
    buttonText: {
        type: String,
        default: '重新加载'
    }
})

defineEmits(['action'])
</script>

<style lang="scss" scoped>
.empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 100rpx 0;
}

.empty-image {
    width: 200rpx;
    height: 200rpx;
    margin-bottom: 30rpx;
}

.empty-text {
    font-size: 28rpx;
    color: #999999;
    margin-bottom: 30rpx;
}

.empty-btn {
    padding: 15rpx 40rpx;
    background-color: #1890ff;
    color: #ffffff;
    border-radius: 30rpx;
    font-size: 28rpx;
    border: none;
}
</style>
