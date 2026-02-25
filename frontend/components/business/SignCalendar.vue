<template>
    <view class="sign-calendar">
        <view class="calendar-header">
            <text class="month-text">{{ currentMonth }}</text>
        </view>
        <view class="calendar-weekdays">
            <text v-for="day in weekdays" :key="day" class="weekday">{{ day }}</text>
        </view>
        <view class="calendar-days">
            <view 
                v-for="(day, index) in days" 
                :key="index" 
                class="day-item"
                :class="{ 
                    signed: isSigned(day.date),
                    today: isToday(day.date),
                    empty: !day.date 
                }"
            >
                <text v-if="day.date" class="day-text">{{ day.day }}</text>
                <view v-if="isSigned(day.date)" class="signed-mark">✓</view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
    signedDates: {
        type: Array,
        default: () => []
    }
})

const currentYear = ref(new Date().getFullYear())
const currentMonth = ref(new Date().getMonth() + 1)

const weekdays = ['日', '一', '二', '三', '四', '五', '六']

const days = computed(() => {
    const year = currentYear.value
    const month = currentMonth.value
    const firstDay = new Date(year, month - 1, 1).getDay()
    const daysInMonth = new Date(year, month, 0).getDate()
    
    const result = []
    
    for (let i = 0; i < firstDay; i++) {
        result.push({ date: null, day: null })
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
        const date = `${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`
        result.push({ date, day: i })
    }
    
    return result
})

function isSigned(date) {
    if (!date) return false
    return props.signedDates.some(d => d.date === date && d.signed)
}

function isToday(date) {
    if (!date) return false
    const today = new Date().toISOString().split('T')[0]
    return date === today
}
</script>

<style lang="scss" scoped>
.sign-calendar {
    padding: 20rpx;
    background-color: #ffffff;
    border-radius: 10rpx;
}

.calendar-header {
    text-align: center;
    padding: 20rpx 0;
}

.month-text {
    font-size: 32rpx;
    font-weight: bold;
    color: #333333;
}

.calendar-weekdays {
    display: flex;
    margin-bottom: 20rpx;
}

.weekday {
    flex: 1;
    text-align: center;
    font-size: 24rpx;
    color: #999999;
}

.calendar-days {
    display: flex;
    flex-wrap: wrap;
}

.day-item {
    width: calc(100% / 7);
    height: 80rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    
    &.empty {
        visibility: hidden;
    }
    
    &.today {
        .day-text {
            color: #1890ff;
            font-weight: bold;
        }
    }
    
    &.signed {
        .day-text {
            color: #52c41a;
        }
        
        .signed-mark {
            position: absolute;
            bottom: 5rpx;
            font-size: 20rpx;
            color: #52c41a;
        }
    }
}

.day-text {
    font-size: 26rpx;
    color: #333333;
}
</style>
