<template>
    <view class="feedback-page">
        <view class="feedback-form">
            <view class="form-item">
                <text class="form-label">反馈类型</text>
                <view class="type-list">
                    <view 
                        class="type-item" 
                        :class="{ active: formData.type === item.value }"
                        v-for="item in typeList" 
                        :key="item.value"
                        @click="formData.type = item.value"
                    >
                        {{ item.label }}
                    </view>
                </view>
            </view>
            
            <view class="form-item">
                <text class="form-label">反馈内容</text>
                <textarea 
                    class="form-textarea" 
                    v-model="formData.content"
                    placeholder="请详细描述您遇到的问题或建议..."
                    maxlength="500"
                />
                <text class="word-count">{{ formData.content.length }}/500</text>
            </view>
            
            <view class="form-item">
                <text class="form-label">联系方式</text>
                <input 
                    class="form-input" 
                    v-model="formData.contact"
                    placeholder="请输入手机号或邮箱(选填)"
                />
            </view>
            
            <view class="form-item">
                <text class="form-label">上传图片</text>
                <view class="image-list">
                    <view class="image-item" v-for="(img, index) in imageList" :key="index">
                        <image class="preview-image" :src="img" mode="aspectFill" />
                        <text class="delete-btn" @click="deleteImage(index)">×</text>
                    </view>
                    <view class="upload-btn" v-if="imageList.length < 3" @click="chooseImage">
                        <text class="upload-icon">+</text>
                        <text class="upload-text">上传图片</text>
                    </view>
                </view>
                <text class="image-tip">最多上传3张图片</text>
            </view>
        </view>
        
        <view class="submit-section">
            <button class="submit-btn" @click="submitFeedback">提交反馈</button>
        </view>
        
        <view class="feedback-history">
            <text class="history-title">历史反馈</text>
            <view class="history-item" v-for="item in historyList" :key="item.id">
                <view class="history-header">
                    <text class="history-type">{{ getTypeName(item.type) }}</text>
                    <text class="history-status" :class="{ resolved: item.status === 1 }">
                        {{ item.status === 1 ? '已处理' : '处理中' }}
                    </text>
                </view>
                <text class="history-content">{{ item.content }}</text>
                <text class="history-time">{{ formatTime(item.created_at) }}</text>
            </view>
            
            <view class="empty-history" v-if="historyList.length === 0">
                <text>暂无反馈记录</text>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { post, get } from '@/utils/request'

const typeList = [
    { label: '功能建议', value: 1 },
    { label: '问题反馈', value: 2 },
    { label: '投诉举报', value: 3 },
    { label: '其他', value: 4 }
]

const formData = reactive({
    type: 1,
    content: '',
    contact: ''
})

const imageList = ref([])
const historyList = ref([])

onMounted(async () => {
    await loadHistory()
})

async function loadHistory() {
    try {
        const data = await get('/feedback/list', { page: 1, pageSize: 10 })
        historyList.value = data.list || []
    } catch (error) {
        console.error('Load history failed:', error)
    }
}

function chooseImage() {
    uni.chooseImage({
        count: 3 - imageList.value.length,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
            imageList.value = [...imageList.value, ...res.tempFilePaths]
        }
    })
}

function deleteImage(index) {
    imageList.value.splice(index, 1)
}

async function submitFeedback() {
    if (!formData.content.trim()) {
        uni.showToast({ title: '请输入反馈内容', icon: 'none' })
        return
    }
    
    try {
        await post('/feedback/submit', {
            type: formData.type,
            content: formData.content,
            contact: formData.contact,
            images: JSON.stringify(imageList.value)
        })
        
        uni.showToast({ title: '提交成功', icon: 'success' })
        
        formData.content = ''
        formData.contact = ''
        imageList.value = []
        
        await loadHistory()
    } catch (error) {
        console.error('Submit feedback failed:', error)
    }
}

function getTypeName(type) {
    const item = typeList.find(t => t.value === type)
    return item ? item.label : '其他'
}

function formatTime(time) {
    if (!time) return ''
    const date = new Date(time)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
</script>

<style lang="scss" scoped>
.feedback-page {
    min-height: 100vh;
    padding-bottom: 120rpx;
    background-color: #f8f8f8;
}

.feedback-form {
    margin: 20rpx;
    padding: 30rpx;
    background-color: #ffffff;
    border-radius: 10rpx;
}

.form-item {
    margin-bottom: 30rpx;
    
    &:last-child {
        margin-bottom: 0;
    }
}

.form-label {
    display: block;
    font-size: 28rpx;
    color: #333333;
    margin-bottom: 15rpx;
}

.type-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
}

.type-item {
    padding: 15rpx 30rpx;
    font-size: 26rpx;
    color: #666666;
    background-color: #f5f5f5;
    border-radius: 30rpx;
    
    &.active {
        color: #ffffff;
        background-color: #1890ff;
    }
}

.form-textarea {
    width: 100%;
    height: 200rpx;
    padding: 20rpx;
    font-size: 28rpx;
    background-color: #f8f8f8;
    border-radius: 10rpx;
    box-sizing: border-box;
}

.word-count {
    display: block;
    text-align: right;
    font-size: 22rpx;
    color: #999999;
    margin-top: 10rpx;
}

.form-input {
    width: 100%;
    height: 80rpx;
    padding: 0 20rpx;
    font-size: 28rpx;
    background-color: #f8f8f8;
    border-radius: 10rpx;
    box-sizing: border-box;
}

.image-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
}

.image-item {
    position: relative;
    width: 180rpx;
    height: 180rpx;
}

.preview-image {
    width: 100%;
    height: 100%;
    border-radius: 10rpx;
}

.delete-btn {
    position: absolute;
    top: -10rpx;
    right: -10rpx;
    width: 40rpx;
    height: 40rpx;
    line-height: 40rpx;
    text-align: center;
    font-size: 28rpx;
    color: #ffffff;
    background-color: #ff4d4f;
    border-radius: 50%;
}

.upload-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 180rpx;
    height: 180rpx;
    background-color: #f8f8f8;
    border: 2rpx dashed #cccccc;
    border-radius: 10rpx;
}

.upload-icon {
    font-size: 50rpx;
    color: #cccccc;
}

.upload-text {
    font-size: 24rpx;
    color: #999999;
    margin-top: 10rpx;
}

.image-tip {
    display: block;
    font-size: 22rpx;
    color: #999999;
    margin-top: 15rpx;
}

.submit-section {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20rpx;
    background-color: #ffffff;
    box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.submit-btn {
    width: 100%;
    height: 90rpx;
    background-color: #1890ff;
    color: #ffffff;
    border-radius: 45rpx;
    font-size: 32rpx;
    border: none;
}

.feedback-history {
    margin: 20rpx;
    padding: 30rpx;
    background-color: #ffffff;
    border-radius: 10rpx;
}

.history-title {
    display: block;
    font-size: 30rpx;
    font-weight: bold;
    color: #333333;
    margin-bottom: 20rpx;
}

.history-item {
    padding: 20rpx 0;
    border-bottom: 1rpx solid #eeeeee;
    
    &:last-child {
        border-bottom: none;
    }
}

.history-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10rpx;
}

.history-type {
    font-size: 24rpx;
    color: #1890ff;
}

.history-status {
    font-size: 22rpx;
    color: #faad14;
    
    &.resolved {
        color: #52c41a;
    }
}

.history-content {
    display: block;
    font-size: 26rpx;
    color: #333333;
    line-height: 1.5;
    margin-bottom: 10rpx;
}

.history-time {
    font-size: 22rpx;
    color: #999999;
}

.empty-history {
    text-align: center;
    padding: 40rpx;
    color: #999999;
    font-size: 26rpx;
}
</style>
