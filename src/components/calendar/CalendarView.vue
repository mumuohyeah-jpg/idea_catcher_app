<template>
  <div class="calendar-view">
    <div class="calendar-header">
      <button class="btn-icon" @click="prevMonth">
        <span class="material-icons">chevron_left</span>
      </button>
      <h2>{{ currentMonthName }} {{ currentYear }}</h2>
      <button class="btn-icon" @click="nextMonth">
        <span class="material-icons">chevron_right</span>
      </button>
    </div>
    
    <div class="calendar-grid">
      <div class="weekday-header" v-for="day in weekdays" :key="day">{{ day }}</div>
      
      <div 
        v-for="day in calendarDays" 
        :key="day.date"
        class="calendar-day"
        :class="{
          'other-month': !day.isCurrentMonth,
          'today': day.isToday,
          'has-inspirations': day.inspirations.length > 0
        }"
        @click="selectDay(day)"
      >
        <div class="day-number">{{ day.dayNumber }}</div>
        <div class="day-indicator" v-if="day.inspirations.length > 0">
          <span class="indicator-dot" v-for="(inspiration, i) in day.inspirations.slice(0, 3)" :key="i"></span>
          <span class="indicator-more" v-if="day.inspirations.length > 3">+{{ day.inspirations.length - 3 }}</span>
        </div>
      </div>
    </div>
    
    <div v-if="selectedDay" class="day-details">
      <div class="day-details-header">
        <h3>{{ formatSelectedDay }}</h3>
        <button class="btn-icon" @click="closeDetails">
          <span class="material-icons">close</span>
        </button>
      </div>
      
      <div v-if="selectedDay.inspirations.length > 0" class="day-inspirations">
        <div 
          v-for="inspiration in selectedDay.inspirations" 
          :key="inspiration.id"
          class="day-inspiration-item"
          @click="viewInspiration(inspiration)"
        >
          <div class="inspiration-type-icon" :class="inspiration.type">
            <span class="material-icons">
              {{ getTypeIcon(inspiration.type) }}
            </span>
          </div>
          <div class="inspiration-info">
            <h4>{{ inspiration.title }}</h4>
            <div class="inspiration-tags">
              <span v-for="tag in inspiration.tags.slice(0, 2)" :key="tag" class="tag-mini">{{ tag }}</span>
              <span v-if="inspiration.tags.length > 2" class="tag-more">+{{ inspiration.tags.length - 2 }}</span>
            </div>
          </div>
          <span class="material-icons chevron">chevron_right</span>
        </div>
      </div>
      
      <div v-else class="no-inspirations">
        <p>这一天没有记录灵感</p>
        <button class="btn" @click="addNewInspiration">添加灵感</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useInspirationStore } from '../../store/inspirationStore'

const router = useRouter()
const inspirationStore = useInspirationStore()

const currentDate = ref(new Date())
const selectedDay = ref(null)

const weekdays = ['日', '一', '二', '三', '四', '五', '六']

const currentYear = computed(() => currentDate.value.getFullYear())
const currentMonth = computed(() => currentDate.value.getMonth())
const currentMonthName = computed(() => {
  return currentDate.value.toLocaleDateString('zh-CN', { month: 'long' })
})

const formatSelectedDay = computed(() => {
  if (!selectedDay.value) return ''
  
  const date = new Date(selectedDay.value.date)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
})

const calendarDays = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value
  
  // 获取当月第一天
  const firstDay = new Date(year, month, 1)
  // 获取当月最后一天
  const lastDay = new Date(year, month + 1, 0)
  
  // 当月第一天是星期几
  const firstDayOfWeek = firstDay.getDay()
  // 当月天数
  const daysInMonth = lastDay.getDate()
  
  // 上个月最后一天
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  
  const today = new Date()
  const todayDate = today.getDate()
  const todayMonth = today.getMonth()
  const todayYear = today.getFullYear()
  
  const days = []
  
  // 上个月的日期
  for (let i = 0; i < firstDayOfWeek; i++) {
    const day = prevMonthLastDay - firstDayOfWeek + i + 1
    const date = new Date(year, month - 1, day)
    days.push({
      date: date.toISOString(),
      dayNumber: day,
      isCurrentMonth: false,
      isToday: false,
      inspirations: getInspirationsForDate(date)
    })
  }
  
  // 当月的日期
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i)
    days.push({
      date: date.toISOString(),
      dayNumber: i,
      isCurrentMonth: true,
      isToday: i === todayDate && month === todayMonth && year === todayYear,
      inspirations: getInspirationsForDate(date)
    })
  }
  
  // 下个月的日期
  const remainingDays = 42 - days.length // 6行7列 = 42
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(year, month + 1, i)
    days.push({
      date: date.toISOString(),
      dayNumber: i,
      isCurrentMonth: false,
      isToday: false,
      inspirations: getInspirationsForDate(date)
    })
  }
  
  return days
})

onMounted(() => {
  inspirationStore.fetchInspirations()
})

function getInspirationsForDate(date) {
  return inspirationStore.getInspirationsByDate(date)
}

function prevMonth() {
  currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1)
  selectedDay.value = null
}

function nextMonth() {
  currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1)
  selectedDay.value = null
}

function selectDay(day) {
  selectedDay.value = day
}

function closeDetails() {
  selectedDay.value = null
}

function viewInspiration(inspiration) {
  inspirationStore.setCurrentInspiration(inspiration)
  router.push('/collect')
}

function addNewInspiration() {
  router.push('/collect')
}

function getTypeIcon(type) {
  const icons = {
    text: 'text_fields',
    image: 'image',
    audio: 'mic'
  }
  return icons[type] || 'note'
}
</script>

<style scoped>
.calendar-view {
  background-color: white;
  border-radius: var(--border-radius-md);
  box-shadow: 0 4px 12px var(--shadow-color);
  padding: var(--spacing-lg);
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-lg);
}

.calendar-header h2 {
  font-size: 1.5rem;
  color: var(--primary-color);
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-color);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: background-color var(--transition-speed);
}

.btn-icon:hover {
  background-color: rgba(76, 175, 80, 0.1);
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background-color: var(--border-color);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  overflow: hidden;
}

.weekday-header {
  background-color: var(--primary-color);
  color: white;
  padding: var(--spacing-sm);
  text-align: center;
  font-weight: 500;
}

.calendar-day {
  background-color: white;
  min-height: 80px;
  padding: var(--spacing-xs);
  cursor: pointer;
  position: relative;
  transition: background-color var(--transition-speed);
}

.calendar-day:hover {
  background-color: rgba(76, 175, 80, 0.05);
}

.calendar-day.other-month {
  color: var(--light-text-color);
  background-color: #f9f9f9;
}

.calendar-day.today {
  background-color: rgba(76, 175, 80, 0.1);
}

.calendar-day.has-inspirations {
  font-weight: 500;
}

.day-number {
  font-size: 0.9rem;
  margin-bottom: var(--spacing-sm);
}

.day-indicator {
  display: flex;
  gap: 2px;
  align-items: center;
}

.indicator-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--primary-color);
}

.indicator-more {
  font-size: 0.7rem;
  color: var(--primary-color);
}

.day-details {
  margin-top: var(--spacing-lg);
  border-top: 1px solid var(--border-color);
  padding-top: var(--spacing-lg);
}

.day-details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.day-details-header h3 {
  color: var(--primary-color);
}

.day-inspirations {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.day-inspiration-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  background-color: #f9f9f9;
  cursor: pointer;
  transition: background-color var(--transition-speed);
}

.day-inspiration-item:hover {
  background-color: rgba(76, 175, 80, 0.1);
}

.inspiration-type-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: var(--spacing-sm);
}

.inspiration-type-icon.text {
  background-color: #E3F2FD;
  color: #1976D2;
}

.inspiration-type-icon.image {
  background-color: #E8F5E9;
  color: #388E3C;
}

.inspiration-type-icon.audio {
  background-color: #FFF3E0;
  color: #F57C00;
}

.inspiration-info {
  flex: 1;
}

.inspiration-info h4 {
  margin: 0;
  font-size: 1rem;
}

.inspiration-tags {
  display: flex;
  gap: var(--spacing-xs);
  margin-top: 4px;
}

.tag-mini {
  font-size: 0.7rem;
  padding: 1px 6px;
  border-radius: 10px;
  background-color: var(--border-color);
  color: var(--text-color);
}

.tag-more {
  font-size: 0.7rem;
  color: var(--light-text-color);
}

.chevron {
  color: var(--light-text-color);
}

.no-inspirations {
  text-align: center;
  padding: var(--spacing-lg) 0;
  color: var(--light-text-color);
}

.no-inspirations p {
  margin-bottom: var(--spacing-md);
}

@media (max-width: 768px) {
  .calendar-day {
    min-height: 60px;
  }
}
</style>