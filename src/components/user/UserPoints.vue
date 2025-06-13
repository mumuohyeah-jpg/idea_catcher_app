<template>
  <div class="user-points">
    <div class="points-header">
      <h3>我的积分</h3>
      <div class="points-total">
        <span class="points-value">{{ userPoints }}</span>
        <span class="points-label">积分</span>
      </div>
    </div>
    
    <div class="points-progress">
      <div class="level-info">
        <span class="level-label">Lv.{{ currentLevel }}</span>
        <span class="level-name">{{ levelName }}</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
      </div>
      <div class="progress-text">
        距离下一等级还需 <span class="highlight">{{ pointsToNextLevel }}</span> 积分
      </div>
    </div>
    

    
    <div class="points-history">
      <h4>积分记录</h4>
      <div class="history-list">
        <div v-for="(record, index) in pointsHistory" :key="index" class="history-item">
          <div class="history-info">
            <div class="history-title">{{ record.title }}</div>
            <div class="history-time">{{ record.time }}</div>
          </div>
          <div class="history-points" :class="{ positive: record.points > 0 }">
            {{ record.points > 0 ? '+' : '' }}{{ record.points }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '../../store/userStore'

const userStore = useUserStore()
const userPoints = ref(userStore.points || 320)
const currentLevel = ref(userStore.level || 3)
const levelThresholds = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500]

const levelNames = [
  '初学者',
  '灵感收集者',
  '创意探索者',
  '思维突破者',
  '创新大师',
  '灵感导师',
  '创意领袖',
  '思想先锋',
  '创新大师',
  '灵感传奇'
]

const dailyTasks = ref([])

const pointsHistory = ref(userStore.pointsHistory || [
  { title: '收集灵感', points: 10, time: '今天 10:25' },
  { title: '连续登录奖励', points: 5, time: '今天 09:30' },
  { title: '分享到小红书', points: 20, time: '昨天 16:45' },
  { title: '使用AI创作', points: 15, time: '昨天 14:20' }
])

const levelName = computed(() => {
  return levelNames[currentLevel.value] || '灵感大师'
})

const pointsToNextLevel = computed(() => {
  const nextLevelThreshold = levelThresholds[currentLevel.value + 1] || levelThresholds[currentLevel.value] + 500
  return nextLevelThreshold - userPoints.value
})

const progressPercentage = computed(() => {
  const currentThreshold = levelThresholds[currentLevel.value]
  const nextThreshold = levelThresholds[currentLevel.value + 1] || currentThreshold + 500
  const totalNeeded = nextThreshold - currentThreshold
  const current = userPoints.value - currentThreshold
  return Math.min(100, Math.max(0, (current / totalNeeded) * 100))
})

onMounted(() => {
  // 监听积分变化
  userStore.$subscribe((mutation, state) => {
    if (state.points !== userPoints.value) {
      userPoints.value = state.points
      checkLevelUp()
    }
    
    // 更新积分历史
    pointsHistory.value = state.pointsHistory.slice(0, 10)
  })
})

// 任务功能已移除

function checkLevelUp() {
  while (currentLevel.value < levelThresholds.length - 1 && 
         userPoints.value >= levelThresholds[currentLevel.value + 1]) {
    currentLevel.value++
    userStore.setLevel(currentLevel.value)
    alert(`恭喜！你已升级到 Lv.${currentLevel.value} ${levelName.value}`)
  }
}
</script>

<style scoped>
.user-points {
  background-color: white;
  border-radius: var(--border-radius-md);
  box-shadow: 0 2px 8px var(--shadow-color);
  padding: var(--spacing-lg);
}

.points-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.points-header h3 {
  margin: 0;
  color: var(--text-color);
}

.points-total {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.points-value {
  font-size: 1.8rem;
  font-weight: bold;
  color: var(--primary-color);
}

.points-label {
  font-size: 0.9rem;
  color: var(--light-text-color);
}

.points-progress {
  background-color: rgba(92, 174, 149, 0.1);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.level-info {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.level-label {
  font-weight: bold;
  margin-right: var(--spacing-sm);
}

.level-name {
  color: var(--primary-color);
}

.progress-bar {
  height: 8px;
  background-color: var(--border-color);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: var(--spacing-sm);
}

.progress-fill {
  height: 100%;
  background-color: var(--primary-color);
  border-radius: 4px;
  transition: width 0.5s ease;
}

.progress-text {
  font-size: 0.9rem;
  color: var(--light-text-color);
  text-align: right;
}

.highlight {
  color: var(--primary-color);
  font-weight: bold;
}

.points-tasks h4,
.points-history h4 {
  margin-bottom: var(--spacing-md);
  color: var(--text-color);
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm);
  background-color: #f9f9f9;
  border-radius: var(--border-radius-sm);
  transition: background-color var(--transition-speed);
}

.task-item.completed {
  background-color: rgba(92, 174, 149, 0.1);
}

.task-info {
  flex: 1;
}

.task-name {
  margin-bottom: 2px;
}

.task-reward {
  font-size: 0.8rem;
  color: var(--primary-color);
}

.task-btn {
  padding: 4px 12px;
  border-radius: var(--border-radius-sm);
  background-color: var(--primary-color);
  color: white;
  border: none;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all var(--transition-speed);
}

.task-btn:hover:not(:disabled) {
  background-color: var(--secondary-color);
}

.task-btn:disabled {
  background-color: #e0e0e0;
  color: #a0a0a0;
  cursor: default;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm);
  border-bottom: 1px solid var(--border-color);
}

.history-item:last-child {
  border-bottom: none;
}

.history-title {
  margin-bottom: 2px;
}

.history-time {
  font-size: 0.8rem;
  color: var(--light-text-color);
}

.history-points {
  font-weight: bold;
  color: #f44336;
}

.history-points.positive {
  color: var(--primary-color);
}
</style>