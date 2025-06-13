<template>
  <div class="profile-settings">
    <h2>个人设置</h2>
    
    <div class="settings-section">
      <h3>主题设置</h3>
      <div class="theme-selector">
        <div 
          class="theme-option" 
          :class="{ active: currentTheme === 'default' }"
          @click="changeTheme('default')"
        >
          <div class="theme-preview default-theme"></div>
          <span>小清新绿植</span>
        </div>
        <div 
          class="theme-option" 
          :class="{ active: currentTheme === 'vintage' }"
          @click="changeTheme('vintage')"
        >
          <div class="theme-preview vintage-theme"></div>
          <span>复古</span>
        </div>
        <div 
          class="theme-option" 
          :class="{ active: currentTheme === 'cyberpunk' }"
          @click="changeTheme('cyberpunk')"
        >
          <div class="theme-preview cyberpunk-theme"></div>
          <span>赛博朋克</span>
        </div>
      </div>
    </div>
    
    <div class="settings-section">
      <h3>通知设置</h3>
      <div class="setting-item">
        <div class="setting-info">
          <h4>推送通知</h4>
          <p>接收灵感提醒和创作建议</p>
        </div>
        <label class="toggle-switch">
          <input type="checkbox" v-model="notifications" @change="toggleNotifications">
          <span class="toggle-slider"></span>
        </label>
      </div>
      
      <div class="setting-item">
        <div class="setting-info">
          <h4>灵感音乐</h4>
          <p>创作时播放背景音乐</p>
        </div>
        <label class="toggle-switch">
          <input type="checkbox" v-model="musicEnabled" @change="toggleMusic">
          <span class="toggle-slider"></span>
        </label>
      </div>
    </div>
    
    <div class="settings-section">
      <h3>成就</h3>
      <div class="achievements-grid">
        <div 
          v-for="achievement in achievements" 
          :key="achievement.id"
          class="achievement-card"
          :class="{ unlocked: achievement.unlocked }"
        >
          <div class="achievement-icon">
            <span class="material-icons">{{ achievement.icon }}</span>
          </div>
          <div class="achievement-info">
            <h4>{{ achievement.name }}</h4>
            <p>{{ achievement.description }}</p>
            <div v-if="achievement.unlocked" class="achievement-date">
              {{ formatDate(achievement.unlockedAt) }}
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="settings-section">
      <h3>数据管理</h3>
      <div class="data-actions">
        <button class="btn" @click="exportData">导出数据</button>
        <button class="btn btn-outline" @click="showTutorial">查看教程</button>
        <button class="btn btn-danger" @click="confirmClearData">清除所有数据</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '../../store/userStore'

const userStore = useUserStore()

// 设置默认值，避免undefined错误
const currentTheme = computed(() => userStore.currentTheme || 'default')
const notifications = ref(userStore.preferences?.notifications !== undefined ? userStore.preferences.notifications : true)
const musicEnabled = ref(userStore.preferences?.musicEnabled !== undefined ? userStore.preferences.musicEnabled : true)

// 成就列表
const achievementsList = [
  {
    id: 'first_inspiration',
    name: '灵感初现',
    description: '记录你的第一条灵感',
    icon: 'lightbulb',
    unlocked: false
  },
  {
    id: 'inspiration_master',
    name: '灵感大师',
    description: '记录超过10条灵感',
    icon: 'psychology',
    unlocked: false
  },
  {
    id: 'creative_explorer',
    name: '创意探索者',
    description: '使用所有灵感收集方式',
    icon: 'explore',
    unlocked: false
  },
  {
    id: 'social_butterfly',
    name: '社交蝴蝶',
    description: '分享5条灵感到社交平台',
    icon: 'share',
    unlocked: false
  },
  {
    id: 'consistent_creator',
    name: '持续创作者',
    description: '连续7天记录灵感',
    icon: 'calendar_today',
    unlocked: false
  },
  {
    id: 'theme_collector',
    name: '主题收藏家',
    description: '尝试所有主题风格',
    icon: 'palette',
    unlocked: false
  }
]

const achievements = ref([])

onMounted(() => {
  // 加载用户偏好设置
  userStore.loadPreferences()
  
  // 确保achievements数组存在
  if (!userStore.achievements) {
    userStore.achievements = []
  }
  
  // 合并成就数据
  achievements.value = achievementsList.map(achievement => {
    const userAchievement = userStore.achievements.find(a => a?.id === achievement.id)
    if (userAchievement) {
      return {
        ...achievement,
        unlocked: true,
        unlockedAt: userAchievement.unlockedAt
      }
    }
    return achievement
  })
})

function changeTheme(theme) {
  // 直接更新用户偏好设置
  if (!userStore.preferences) {
    userStore.preferences = {}
  }
  userStore.preferences.theme = theme
  userStore.updatePreferences({ theme })
}

function toggleNotifications() {
  // 直接更新用户偏好设置
  if (!userStore.preferences) {
    userStore.preferences = {}
  }
  userStore.preferences.notifications = notifications.value
  userStore.updatePreferences({ notifications: notifications.value })
}

function toggleMusic() {
  // 直接更新用户偏好设置
  if (!userStore.preferences) {
    userStore.preferences = {}
  }
  userStore.preferences.musicEnabled = musicEnabled.value
  userStore.updatePreferences({ musicEnabled: musicEnabled.value })
}

function formatDate(dateString) {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function exportData() {
  // 导出用户数据
  alert('数据导出功能将在这里实现')
}

function showTutorial() {
  // 显示教程
  alert('教程将在这里显示')
}

function confirmClearData() {
  if (confirm('确定要清除所有数据吗？此操作不可撤销。')) {
    // 清除数据
    localStorage.clear()
    alert('所有数据已清除，页面将刷新')
    window.location.reload()
  }
}
</script>

<style scoped>
.profile-settings {
  background-color: white;
  border-radius: var(--border-radius-md);
  box-shadow: 0 4px 12px var(--shadow-color);
  padding: var(--spacing-lg);
}

.settings-section {
  margin-bottom: var(--spacing-xl);
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
}

.settings-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.settings-section h3 {
  margin-bottom: var(--spacing-md);
  color: var(--primary-color);
}

.theme-selector {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.theme-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-speed);
}

.theme-option.active {
  background-color: rgba(76, 175, 80, 0.1);
}

.theme-preview {
  width: 100px;
  height: 60px;
  border-radius: var(--border-radius-sm);
  margin-bottom: var(--spacing-sm);
  border: 1px solid var(--border-color);
  overflow: hidden;
}

.default-theme {
  background: linear-gradient(to bottom right, #4CAF50, #8BC34A);
}

.vintage-theme {
  background: linear-gradient(to bottom right, #A87D5F, #C9A66B);
}

.cyberpunk-theme {
  background: linear-gradient(to bottom right, #FF00FF, #00FFFF);
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) 0;
  border-bottom: 1px solid var(--border-color);
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-info h4 {
  margin: 0;
  margin-bottom: 4px;
}

.setting-info p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--light-text-color);
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: var(--transition-speed);
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: var(--transition-speed);
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: var(--primary-color);
}

input:checked + .toggle-slider:before {
  transform: translateX(26px);
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-md);
}

.achievement-card {
  display: flex;
  align-items: center;
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  background-color: #f5f5f5;
  opacity: 0.7;
}

.achievement-card.unlocked {
  background-color: rgba(76, 175, 80, 0.1);
  opacity: 1;
}

.achievement-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #e0e0e0;
  margin-right: var(--spacing-md);
  color: #9e9e9e;
}

.achievement-card.unlocked .achievement-icon {
  background-color: var(--primary-color);
  color: white;
}

.achievement-info {
  flex: 1;
}

.achievement-info h4 {
  margin: 0;
  margin-bottom: 4px;
}

.achievement-info p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--light-text-color);
}

.achievement-date {
  margin-top: var(--spacing-xs);
  font-size: 0.8rem;
  color: var(--primary-color);
}

.data-actions {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.btn-danger {
  background-color: #f44336;
  color: white;
}

.btn-danger:hover {
  background-color: #d32f2f;
}

@media (max-width: 768px) {
  .theme-selector {
    justify-content: center;
  }
  
  .data-actions {
    flex-direction: column;
  }
}
</style>