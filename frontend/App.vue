<script setup>
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'

onLaunch(() => {
    console.log('App Launch')
})

onShow(() => {
    console.log('App Show')
})

onHide(() => {
    console.log('App Hide')
})
</script>

<style lang="scss">
@import './styles/common.scss';

page {
    background-color: #f8f8f8;
    font-size: 28rpx;
    color: #333333;
}

.container {
    padding: 20rpx;
}

.text-center {
    text-align: center;
}

.text-right {
    text-align: right;
}

.flex {
    display: flex;
}

.flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
}

.flex-between {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.flex-column {
    display: flex;
    flex-direction: column;
}

.flex-1 {
    flex: 1;
}

.mt-10 {
    margin-top: 10rpx;
}

.mt-20 {
    margin-top: 20rpx;
}

.mt-30 {
    margin-top: 30rpx;
}

.mb-10 {
    margin-bottom: 10rpx;
}

.mb-20 {
    margin-bottom: 20rpx;
}

.mb-30 {
    margin-bottom: 30rpx;
}

.ml-10 {
    margin-left: 10rpx;
}

.mr-10 {
    margin-right: 10rpx;
}

.p-20 {
    padding: 20rpx;
}

.p-30 {
    padding: 30rpx;
}

.bg-white {
    background-color: #ffffff;
}

.text-primary {
    color: #1890ff;
}

.text-success {
    color: #52c41a;
}

.text-warning {
    color: #faad14;
}

.text-error {
    color: #ff4d4f;
}

.text-gray {
    color: #999999;
}

.text-sm {
    font-size: 24rpx;
}

.text-lg {
    font-size: 32rpx;
}

.text-bold {
    font-weight: bold;
}

.border-bottom {
    border-bottom: 1rpx solid #eeeeee;
}

.border-top {
    border-top: 1rpx solid #eeeeee;
}

.radius-10 {
    border-radius: 10rpx;
}

.radius-20 {
    border-radius: 20rpx;
}

.shadow {
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
}
</style>
