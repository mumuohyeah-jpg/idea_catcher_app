<template>
  <div class="calendar-page">
    <div class="container">
      <div class="page-header">
        <h1>灵感日历</h1>
        <p>回顾你的创意历程，发现灵感规律</p>
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-step completed">收集灵感</div>
            <div class="progress-step completed">灵感工坊</div>
            <div class="progress-step active">灵感日历</div>
            <div class="progress-step">灵感分享</div>
          </div>
        </div>
        <div class="capsule-banner" @click="showTimeCapsuleModal = true">
          <div class="capsule-icon">
            <span class="material-icons">schedule</span>
          </div>
          <div class="capsule-content">
            <h3>创建时光胶囊</h3>
            <p>将灵感封存，在未来的某一天收到提醒</p>
          </div>
          <div class="capsule-action">
            <span class="material-icons">arrow_forward</span>
          </div>
        </div>
        <div class="next-step-guide">
          <p>查看完历程后，前往灵感分享与社区交流</p>
          <router-link to="/social" class="btn btn-next">
            <span>下一步：灵感分享</span>
            <span class="material-icons">arrow_forward</span>
          </router-link>
        </div>
      </div>
      
      <div class="view-selector">
        <button 
          class="view-btn" 
          :class="{ active: currentView === 'calendar' }"
          @click="currentView = 'calendar'"
        >
          <span class="material-icons">calendar_month</span>
          <span>日历视图</span>
        </button>
        <button 
          class="view-btn" 
          :class="{ active: currentView === 'timeline' }"
          @click="currentView = 'timeline'"
        >
          <span class="material-icons">timeline</span>
          <span>时间轴</span>
        </button>
        <button 
          class="view-btn" 
          :class="{ active: currentView === 'report' }"
          @click="currentView = 'report'"
        >
          <span class="material-icons">insights</span>
          <span>灵感报告</span>
        </button>
      </div>
      
      <div class="calendar-container">
        <!-- 日历视图 -->
        <div v-if="currentView === 'calendar'" class="view-content">
          <CalendarView />
        </div>
        
        <!-- 时间轴视图 -->
        <div v-else-if="currentView === 'timeline'" class="view-content">
          <div class="timeline">
            <div class="timeline-header">
              <h3>灵感时间轴</h3>
              <p>滑动查看你的灵感历程</p>
            </div>
            
            <div class="timeline-container">
              <div 
                v-for="(group, date) in groupedInspirations" 
                :key="date"
                class="timeline-group"
              >
                <div class="timeline-date">
                  <div class="date-bubble">{{ formatDate(date) }}</div>
                </div>
                
                <div class="timeline-items">
                  <div 
                    v-for="inspiration in group" 
                    :key="inspiration.id"
                    class="timeline-item"
                    :class="inspiration.type"
                    @click="viewInspiration(inspiration)"
                  >
                    <div class="timeline-item-icon">
                      <span class="material-icons">{{ getTypeIcon(inspiration.type) }}</span>
                    </div>
                    <div class="timeline-item-content">
                      <h4>{{ inspiration.title }}</h4>
                      <div class="timeline-item-tags">
                        <span v-for="tag in inspiration.tags.slice(0, 2)" :key="tag" class="tag-mini">{{ tag }}</span>
                      </div>
                      <div class="timeline-item-time">{{ formatTime(inspiration.createdAt) }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="timeline-actions">
              <button class="btn" @click="createTimeCapsule">
                <span class="material-icons">schedule</span>
                创建时光胶囊
              </button>
            </div>
          </div>
        </div>
        
        <!-- 灵感报告视图 -->
        <div v-else-if="currentView === 'report'" class="view-content">
          <div class="report">
            <div class="report-header">
              <h3>灵感报告</h3>
              <div class="report-period">
                <button 
                  class="period-btn" 
                  :class="{ active: reportPeriod === 'week' }"
                  @click="reportPeriod = 'week'"
                >
                  本周
                </button>
                <button 
                  class="period-btn" 
                  :class="{ active: reportPeriod === 'month' }"
                  @click="reportPeriod = 'month'"
                >
                  本月
                </button>
                <button 
                  class="period-btn" 
                  :class="{ active: reportPeriod === 'year' }"
                  @click="reportPeriod = 'year'"
                >
                  今年
                </button>
              </div>
            </div>
            
            <div class="report-content">
              <div class="report-section">
                <h4>灵感统计</h4>
                <div class="stats-grid">
                  <div class="stat-card">
                    <div class="stat-value">{{ stats.total }}</div>
                    <div class="stat-label">灵感总数</div>
                  </div>
                  <div class="stat-card">
                    <div class="stat-value">{{ stats.text }}</div>
                    <div class="stat-label">文字灵感</div>
                  </div>
                  <div class="stat-card">
                    <div class="stat-value">{{ stats.image }}</div>
                    <div class="stat-label">图片灵感</div>
                  </div>
                  <div class="stat-card">
                    <div class="stat-value">{{ stats.audio }}</div>
                    <div class="stat-label">语音灵感</div>
                  </div>
                </div>
              </div>
              
              <div class="report-section">
                <h4>高频标签</h4>
                <div class="tags-cloud">
                  <div 
                    v-for="tag in topTags" 
                    :key="tag.name"
                    class="cloud-tag"
                    :style="{ fontSize: tagFontSize(tag.count) }"
                  >
                    {{ tag.name }}
                  </div>
                </div>
              </div>
              
              <div class="report-section">
                <h4>创作活跃度</h4>
                <div class="activity-chart">
                  <div class="chart-placeholder">
                    <!-- 这里将来会使用 Chart.js 渲染图表 -->
                    <p>活跃度图表将在这里显示</p>
                  </div>
                </div>
              </div>
              
              <div class="report-actions">
                <button class="btn" @click="generatePDF">
                  <span class="material-icons">picture_as_pdf</span>
                  导出 PDF 报告
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 时光胶囊弹窗 -->
    <TimeCapsuleModal 
      :visible="showTimeCapsuleModal" 
      @close="showTimeCapsuleModal = false"
      @save="handleSaveTimeCapsule"
    />
    
    <TutorialOverlay 
      :visible="tutorialVisible" 
      :steps="tutorialSteps"
      @close="closeTutorial"
      @complete="completeTutorial"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useInspirationStore } from '../store/inspirationStore'
import { useUserStore } from '../store/userStore'
import CalendarView from '../components/calendar/CalendarView.vue'
import TutorialOverlay from '../components/common/TutorialOverlay.vue'
import TimeCapsuleModal from '../components/common/TimeCapsuleModal.vue'

const inspirationStore = useInspirationStore()
const userStore = useUserStore()

const currentView = ref('calendar')
const reportPeriod = ref('month')
const showTimeCapsuleModal = ref(false)
const tutorialVisible = ref(false)

const tutorialSteps = [
  {
    title: '灵感日历',
    description: '在这里，你可以回顾和整理你的创意历程。',
    image: ''
  },
  {
    title: '多种视图',
    description: '切换不同视图模式：日历视图、时间轴和灵感报告。',
    image: ''
  },
  {
    title: '时光胶囊',
    description: '创建时光胶囊，在未来的某一天收到过去的灵感提醒。',
    image: ''
  },
  {
    title: '灵感报告',
    description: '查看你的灵感统计和创作活跃度，导出PDF报告。',
    image: ''
  }
]

const inspirations = computed(() => {
  return inspirationStore.inspirations
})

const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

// 按日期分组的灵感
const groupedInspirations = computed(() => {
  const groups = {}
  
  inspirations.value.forEach(inspiration => {
    const date = new Date(inspiration.createdAt).toDateString()
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(inspiration)
  })
  
  // 按日期排序
  const sortedGroups = {}
  Object.keys(groups)
    .sort((a, b) => new Date(b) - new Date(a))
    .forEach(date => {
      sortedGroups[date] = groups[date]
    })
  
  return sortedGroups
})

// 灵感统计
const stats = computed(() => {
  const result = {
    total: inspirations.value.length,
    text: 0,
    image: 0,
    audio: 0
  }
  
  inspirations.value.forEach(inspiration => {
    if (inspiration.type === 'text') result.text++
    else if (inspiration.type === 'image') result.image++
    else if (inspiration.type === 'audio') result.audio++
  })
  
  return result
})

// 高频标签
const topTags = computed(() => {
  return inspirationStore.getTagsWithCount
    .sort((a, b) => b.count - a.count)
    .slice(0, 15)
})

onMounted(async () => {
  await inspirationStore.fetchInspirations()
  
  // 如果是首次使用日历页面，显示教程
  if (!localStorage.getItem('calendarTutorialShown')) {
    setTimeout(() => {
      tutorialVisible.value = true
      localStorage.setItem('calendarTutorialShown', 'true')
    }, 500)
  }
})

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    month: 'long',
    day: 'numeric'
  })
}

function formatTime(dateString) {
  const date = new Date(dateString)
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getTypeIcon(type) {
  const icons = {
    text: 'text_fields',
    image: 'image',
    audio: 'mic'
  }
  return icons[type] || 'note'
}

function viewInspiration(inspiration) {
  inspirationStore.setCurrentInspiration(inspiration)
  // 导航到灵感详情或收集页面
}

function handleSaveTimeCapsule(capsuleData) {
  // 保存时光胶囊
  alert('时光胶囊已创建，将在设定的日期提醒你')
  console.log('保存时光胶囊数据:', capsuleData)
}

function tagFontSize(count) {
  // 根据标签出现次数计算字体大小
  const minSize = 0.8
  const maxSize = 1.8
  const maxCount = Math.max(...topTags.value.map(t => t.count))
  const minCount = Math.min(...topTags.value.map(t => t.count))
  
  if (maxCount === minCount) return `${minSize + (maxSize - minSize) / 2}rem`
  
  const size = minSize + ((count - minCount) / (maxCount - minCount)) * (maxSize - minSize)
  return `${size}rem`
}

function generatePDF() {
  alert('PDF报告生成功能将在这里实现')
}

function closeTutorial() {
  tutorialVisible.value = false
}

function completeTutorial() {
  tutorialVisible.value = false
}
</script>

<style scoped>
.calendar-page {
  padding-bottom: var(--spacing-xl);
}

.page-header {
  margin-bottom: var(--spacing-lg);
}

.page-header h1 {
  color: var(--primary-color);
  margin-bottom: var(--spacing-xs);
}

.page-header p {
  color: var(--light-text-color);
}

.view-selector {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.view-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--border-radius-md);
  background-color: white;
  cursor: pointer;
  transition: all var(--transition-speed);
  box-shadow: 0 2px 4px var(--shadow-color);
}

.view-btn:hover {
  background-color: rgba(76, 175, 80, 0.05);
}

.view-btn.active {
  background-color: var(--primary-color);
  color: white;
}

.calendar-container {
  margin-bottom: var(--spacing-xl);
}

/* 时间轴样式 */
.timeline {
  background-color: white;
  border-radius: var(--border-radius-md);
  box-shadow: 0 2px 8px var(--shadow-color);
  padding: var(--spacing-lg);
}

.timeline-header {
  margin-bottom: var(--spacing-lg);
}

.timeline-header h3 {
  color: var(--primary-color);
  margin-bottom: var(--spacing-xs);
}

.timeline-header p {
  color: var(--light-text-color);
}

.timeline-container {
  position: relative;
  padding-left: 30px;
}

.timeline-container::before {
  content: '';
  position: absolute;
  left: 15px;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: var(--border-color);
}

.timeline-group {
  margin-bottom: var(--spacing-lg);
  position: relative;
}

.timeline-date {
  margin-bottom: var(--spacing-md);
  position: relative;
}

.date-bubble {
  background-color: var(--primary-color);
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  display: inline-block;
  font-size: 0.9rem;
  position: relative;
  left: -40px;
}

.timeline-items {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.timeline-item {
  display: flex;
  background-color: #f9f9f9;
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  cursor: pointer;
  transition: all var(--transition-speed);
}

.timeline-item:hover {
  background-color: rgba(76, 175, 80, 0.05);
  transform: translateX(5px);
}

.timeline-item.text {
  border-left: 4px solid #1976D2;
}

.timeline-item.image {
  border-left: 4px solid #388E3C;
}

.timeline-item.audio {
  border-left: 4px solid #F57C00;
}

.timeline-item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: var(--spacing-md);
}

.timeline-item.text .timeline-item-icon {
  background-color: #E3F2FD;
  color: #1976D2;
}

.timeline-item.image .timeline-item-icon {
  background-color: #E8F5E9;
  color: #388E3C;
}

.timeline-item.audio .timeline-item-icon {
  background-color: #FFF3E0;
  color: #F57C00;
}

.timeline-item-content {
  flex: 1;
}

.timeline-item-content h4 {
  margin: 0;
  margin-bottom: 4px;
}

.timeline-item-tags {
  display: flex;
  gap: 4px;
  margin-bottom: 4px;
}

.tag-mini {
  font-size: 0.7rem;
  padding: 1px 6px;
  border-radius: 10px;
  background-color: var(--border-color);
  color: var(--text-color);
}

.timeline-item-time {
  font-size: 0.8rem;
  color: var(--light-text-color);
}

.timeline-actions {
  display: flex;
  justify-content: center;
  margin-top: var(--spacing-lg);
}

.timeline-actions .btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

/* 报告样式 */
.report {
  background-color: white;
  border-radius: var(--border-radius-md);
  box-shadow: 0 2px 8px var(--shadow-color);
  padding: var(--spacing-lg);
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.report-header h3 {
  color: var(--primary-color);
  margin: 0;
}

.report-period {
  display: flex;
  gap: var(--spacing-xs);
}

.period-btn {
  padding: var(--spacing-xs) var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  background-color: white;
  cursor: pointer;
  transition: all var(--transition-speed);
}

.period-btn.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.report-section {
  margin-bottom: var(--spacing-xl);
}

.report-section h4 {
  margin-bottom: var(--spacing-md);
  color: var(--text-color);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--spacing-md);
}

.stat-card {
  background-color: #f9f9f9;
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  text-align: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: var(--spacing-xs);
}

.stat-label {
  color: var(--light-text-color);
  font-size: 0.9rem;
}

.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background-color: #f9f9f9;
  border-radius: var(--border-radius-md);
}

.cloud-tag {
  color: var(--primary-color);
  transition: all var(--transition-speed);
  cursor: pointer;
}

.cloud-tag:hover {
  transform: scale(1.1);
}

.activity-chart {
  background-color: #f9f9f9;
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  height: 200px;
}

.chart-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--light-text-color);
}

.report-actions {
  display: flex;
  justify-content: center;
  margin-top: var(--spacing-lg);
}

.report-actions .btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background-color: white;
  border-radius: var(--border-radius-md);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
  margin: 0;
  color: var(--primary-color);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--light-text-color);
}

.modal-content {
  padding: var(--spacing-lg);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  border-top: 1px solid var(--border-color);
}

.capsule-methods {
  display: flex;
  gap: var(--spacing-md);
}

.method-option {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  cursor: pointer;
}

@media (max-width: 768px) {
  .view-selector {
    flex-wrap: wrap;
  }
  
  .view-btn {
    flex: 1;
    justify-content: center;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>