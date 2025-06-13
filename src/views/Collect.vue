<template>
  <div class="collect-page">
    <div class="container">
      <div class="page-header">
        <h1>收集灵感</h1>
        <p>捕捉你的创意火花，多种方式记录灵感</p>
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-step active">收集灵感</div>
            <div class="progress-step">灵感工坊</div>
            <div class="progress-step">灵感日历</div>
            <div class="progress-step">灵感分享</div>
          </div>
        </div>
      </div>
      
      <div class="collect-container">
        <div class="collect-sidebar">
          <div class="sidebar-section">
            <h3>快速操作</h3>
            <div class="quick-actions">
              <button class="action-btn primary-btn" @click="showNewInspirationForm">
                <span class="material-icons">add</span>
                <span>新建灵感</span>
              </button>
              <button class="action-btn" @click="startVoiceRecording">
                <span class="material-icons">mic</span>
                <span>语音记录</span>
              </button>
              <button class="action-btn" @click="openCamera">
                <span class="material-icons">photo_camera</span>
                <span>灵感快拍</span>
              </button>
            </div>
          </div>
          
          <div class="sidebar-section">
            <h3>标签筛选</h3>
            <div class="tags-filter">
              <div 
                v-for="tag in tags" 
                :key="tag"
                class="filter-tag"
                :class="{ active: selectedTags.includes(tag) }"
                @click="toggleTag(tag)"
              >
                {{ tag }}
              </div>
            </div>
          </div>
          
          <div class="sidebar-section">
            <h3>类型筛选</h3>
            <div class="type-filter">
              <button 
                class="type-btn"
                :class="{ active: selectedTypes.includes('text') }"
                @click="toggleType('text')"
              >
                <span class="material-icons">text_fields</span>
                <span>文字</span>
              </button>
              <button 
                class="type-btn"
                :class="{ active: selectedTypes.includes('image') }"
                @click="toggleType('image')"
              >
                <span class="material-icons">image</span>
                <span>图片</span>
              </button>
              <button 
                class="type-btn"
                :class="{ active: selectedTypes.includes('audio') }"
                @click="toggleType('audio')"
              >
                <span class="material-icons">mic</span>
                <span>语音</span>
              </button>
            </div>
          </div>
        </div>
        
        <div class="collect-main">
          <div v-if="showForm" class="inspiration-form-container">
            <InspirationForm 
              :inspiration="editingInspiration"
              @saved="handleInspirationSaved"
              @cancel="hideForm"
            />
          </div>
          
          <div v-else-if="loading" class="loading-container">
            <div class="spinner"></div>
            <p>加载中...</p>
          </div>
          
          <div v-else-if="filteredInspirations.length === 0" class="empty-state">
            <div class="empty-icon">
              <span class="material-icons">lightbulb</span>
            </div>
            <h3>还没有灵感记录</h3>
            <p>点击"新建灵感"按钮开始记录你的第一个创意</p>
            <button class="btn" @click="showNewInspirationForm">新建灵感</button>
          </div>
          
          <div v-else class="inspirations-list">
            <InspirationCard 
              v-for="inspiration in filteredInspirations" 
              :key="inspiration.id"
              :inspiration="inspiration"
              @edit="editInspiration"
              @delete="deleteInspiration"
              @share="shareInspiration"
            />
          </div>
        </div>
      </div>
    </div>
    
    <div class="floating-guide" v-if="showGuide">
      <div class="guide-content">
        <div class="guide-header">
          <h3>开始记录你的灵感</h3>
          <span class="material-icons guide-icon">tips_and_updates</span>
        </div>
        <p>点击"新建灵感"按钮，选择记录方式，填写灵感内容</p>
        <div class="guide-actions">
          <button class="btn btn-primary" @click="showNewInspirationForm">立即开始</button>
          <button class="btn btn-outline" @click="hideGuide">我知道了</button>
        </div>
      </div>
    </div>
    
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
import { useRoute } from 'vue-router'
import { useInspirationStore } from '../store/inspirationStore'
import { useUserStore } from '../store/userStore'
import InspirationForm from '../components/inspiration/InspirationForm.vue'
import InspirationCard from '../components/inspiration/InspirationCard.vue'
import TutorialOverlay from '../components/common/TutorialOverlay.vue'

const route = useRoute()
const inspirationStore = useInspirationStore()
const userStore = useUserStore()

const loading = ref(true)
const showForm = ref(false)
const editingInspiration = ref(null)
const selectedTags = ref([])
const selectedTypes = ref([])
const tutorialVisible = ref(false)
const showGuide = ref(!localStorage.getItem('guideShown'))

const tutorialSteps = [
  {
    title: '灵感收集',
    description: '这里是灵感收集页面，你可以通过多种方式记录你的创意灵感。',
    image: ''
  },
  {
    title: '新建灵感',
    description: '点击"新建灵感"按钮，选择记录方式，填写灵感内容。',
    image: ''
  },
  {
    title: '语音记录',
    description: '使用语音记录功能，直接说出你的灵感，系统会自动转换为文字。',
    image: ''
  },
  {
    title: '灵感快拍',
    description: '看到灵感来源？使用灵感快拍功能，立即拍下保存。',
    image: ''
  },
  {
    title: '标签管理',
    description: '为灵感添加标签，方便日后查找和整理。',
    image: ''
  }
]

const tags = computed(() => {
  return inspirationStore.tags
})

const filteredInspirations = computed(() => {
  let result = [...inspirationStore.inspirations]
  
  // 应用标签筛选
  if (selectedTags.value.length > 0) {
    result = result.filter(inspiration => 
      selectedTags.value.some(tag => inspiration.tags.includes(tag))
    )
  }
  
  // 应用类型筛选
  if (selectedTypes.value.length > 0) {
    result = result.filter(inspiration => 
      selectedTypes.value.includes(inspiration.type)
    )
  }
  
  return result
})

onMounted(async () => {
  await inspirationStore.fetchInspirations()
  loading.value = false
  
  // 如果是首次使用，显示教程
  if (!userStore.onboardingCompleted) {
    setTimeout(() => {
      tutorialVisible.value = true
    }, 500)
  }
  
  // 检查是否从社交页面跳转过来分享灵感
  if (route.query.action === 'share') {
    showNewInspirationForm()
  }
})

function showNewInspirationForm() {
  editingInspiration.value = null
  showForm.value = true
  hideGuide()
}

function editInspiration(inspiration) {
  editingInspiration.value = inspiration
  showForm.value = true
}

function hideForm() {
  showForm.value = false
  editingInspiration.value = null
}

function handleInspirationSaved(inspiration) {
  showForm.value = false
  editingInspiration.value = null
  
  // 添加积分
  userStore.addPoints(10, '收集新灵感')
  
  // 显示保存成功提示
  alert('灵感保存成功！即将前往灵感工坊...')
  
  // 保存当前灵感ID到本地存储，以便在灵感工坊中使用
  try {
    localStorage.setItem('currentInspirationId', inspiration.id)
  } catch (e) {
    console.error('保存灵感ID失败', e)
  }
  
  // 导航到灵感工坊页面
  setTimeout(() => {
    window.location.href = '#/create'
  }, 1000)
}

function deleteInspiration(id) {
  // 已在InspirationCard组件中处理
}

function shareInspiration(inspiration) {
  // 触发社交分享事件
  const event = new CustomEvent('share-inspiration', {
    detail: {
      platform: 'xiaohongshu',
      inspiration: inspiration
    },
    bubbles: true
  })
  document.dispatchEvent(event)
  
  // 导航到社交页面
  window.location.href = '#/social'
}

function toggleTag(tag) {
  const index = selectedTags.value.indexOf(tag)
  if (index === -1) {
    selectedTags.value.push(tag)
  } else {
    selectedTags.value.splice(index, 1)
  }
}

function toggleType(type) {
  const index = selectedTypes.value.indexOf(type)
  if (index === -1) {
    selectedTypes.value.push(type)
  } else {
    selectedTypes.value.splice(index, 1)
  }
}

async function startVoiceRecording() {
  // 使用当前日期作为默认标题的一部分
  const now = new Date()
  const dateStr = `${now.getMonth() + 1}月${now.getDate()}日`
  
  try {
    // 请求麦克风权限
    await navigator.mediaDevices.getUserMedia({ audio: true })
    
    // 设置编辑状态
    editingInspiration.value = {
      title: `语音灵感 - ${dateStr}`,
      type: 'audio',
      content: '',
      tags: ['语音记录'],
      transcript: ''
    }
    
    showForm.value = true
    hideGuide()
    
    // 短暂延迟后自动开始录音
    setTimeout(() => {
      const recordBtn = document.querySelector('.record-btn')
      if (recordBtn) recordBtn.click()
    }, 500)
  } catch (error) {
    console.error('无法访问麦克风', error)
    alert('无法访问麦克风，请确保已授予麦克风权限')
    
    // 即使没有麦克风权限，也允许用户进入表单
    editingInspiration.value = {
      title: `语音灵感 - ${dateStr}`,
      type: 'audio',
      content: '',
      tags: ['语音记录'],
      transcript: ''
    }
    
    showForm.value = true
    hideGuide()
  }
}

function openCamera() {
  // 使用当前日期作为默认标题的一部分
  const now = new Date()
  const dateStr = `${now.getMonth() + 1}月${now.getDate()}日`
  
  // 设置为空内容，让用户选择本地图片
  editingInspiration.value = {
    title: `灵感快拍 - ${dateStr}`,
    type: 'image',
    content: '',
    tags: ['灵感快拍']
  }
  showForm.value = true
  hideGuide()
  
  // 短暂延迟后自动触发文件选择
  setTimeout(() => {
    const fileInput = document.querySelector('#image-upload')
    if (fileInput) fileInput.click()
  }, 500)
}

function closeTutorial() {
  tutorialVisible.value = false
}

function completeTutorial() {
  tutorialVisible.value = false
  userStore.completeOnboarding()
}

function hideGuide() {
  showGuide.value = false
  localStorage.setItem('guideShown', 'true')
}
</script>

<style scoped>
.collect-page {
  padding-bottom: var(--spacing-xl);
  position: relative;
  background-color: #f8f9fa;
}

.page-header {
  margin-bottom: var(--spacing-lg);
  text-align: center;
  padding: var(--spacing-lg) 0;
}

.page-header h1 {
  color: var(--primary-color);
  margin-bottom: var(--spacing-xs);
  font-size: 2rem;
  font-weight: 700;
}

.page-header p {
  color: var(--light-text-color);
  font-size: 1.1rem;
  margin-bottom: var(--spacing-md);
}

.progress-container {
  max-width: 600px;
  margin: 0 auto;
  margin-top: var(--spacing-lg);
}

.progress-bar {
  display: flex;
  justify-content: space-between;
  position: relative;
  margin-bottom: var(--spacing-lg);
  padding: 0 20px;
}

.progress-bar::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background-color: var(--border-color);
  transform: translateY(-50%);
  z-index: 1;
}

.progress-step {
  position: relative;
  background-color: white;
  border: 2px solid var(--border-color);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0;
  margin: 0 10px;
}

.progress-step::after {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: var(--spacing-xs);
  white-space: nowrap;
  font-size: 0.9rem;
  color: var(--light-text-color);
  font-weight: normal;
}

.progress-step:nth-child(1)::after {
  content: "收集灵感";
}

.progress-step:nth-child(2)::after {
  content: "灵感工坊";
}

.progress-step:nth-child(3)::after {
  content: "灵感日历";
}

.progress-step:nth-child(4)::after {
  content: "灵感分享";
}

.progress-step.active {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.progress-step.active::after {
  color: var(--primary-color);
  font-weight: 500;
}

.progress-step.completed {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.collect-container {
  display: flex;
  gap: var(--spacing-lg);
  position: relative;
  margin-top: var(--spacing-xl);
}

.collect-sidebar {
  width: 280px;
  flex-shrink: 0;
}

.collect-main {
  flex: 1;
  min-height: 500px;
}

.sidebar-section {
  background-color: white;
  border-radius: var(--border-radius-lg);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  position: relative;
  overflow: hidden;
  border-left: 4px solid var(--primary-color);
}

.sidebar-section h3 {
  margin-bottom: var(--spacing-md);
  color: var(--primary-color);
  font-size: 1.1rem;
  font-weight: 600;
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.action-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--border-radius-md);
  background-color: #f5f5f5;
  cursor: pointer;
  transition: all var(--transition-speed);
  text-align: left;
  position: relative;
  overflow: hidden;
  z-index: 1;
  font-weight: 500;
}

.action-btn.primary-btn {
  background-color: rgba(92, 174, 149, 0.1);
  color: var(--primary-color);
}

.action-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--primary-color);
  opacity: 0;
  z-index: -1;
  transition: opacity var(--transition-speed);
}

.action-btn:hover::before {
  opacity: 0.1;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px var(--shadow-color);
}

.tags-filter {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.filter-tag {
  padding: 6px 12px;
  border-radius: 20px;
  background-color: #f5f5f5;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all var(--transition-speed);
}

.filter-tag:hover {
  background-color: rgba(92, 174, 149, 0.1);
  transform: translateY(-2px);
}

.filter-tag.active {
  background-color: var(--primary-color);
  color: white;
  box-shadow: 0 2px 4px var(--shadow-color);
}

.type-filter {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.type-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--border-radius-md);
  background-color: #f5f5f5;
  cursor: pointer;
  transition: all var(--transition-speed);
  text-align: left;
}

.type-btn:hover {
  background-color: rgba(92, 174, 149, 0.1);
  transform: translateX(4px);
}

.type-btn.active {
  background-color: var(--primary-color);
  color: white;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl) 0;
  background-color: white;
  border-radius: var(--border-radius-lg);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  min-height: 300px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(92, 174, 149, 0.1);
  border-left-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: var(--spacing-md);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: var(--spacing-xl) 0;
  background-color: white;
  border-radius: var(--border-radius-lg);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.empty-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: rgba(92, 174, 149, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--spacing-md);
}

.empty-icon .material-icons {
  font-size: 40px;
  color: var(--primary-color);
}

.empty-state h3 {
  margin-bottom: var(--spacing-sm);
  color: var(--text-color);
  font-weight: 600;
}

.empty-state p {
  margin-bottom: var(--spacing-lg);
  color: var(--light-text-color);
  max-width: 300px;
}

.inspirations-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-md);
}

.floating-guide {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  border-radius: var(--border-radius-lg);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  padding: var(--spacing-lg);
  z-index: 100;
  max-width: 90%;
  width: 400px;
  animation: slideUp 0.5s ease;
}

@keyframes slideUp {
  from {
    transform: translate(-50%, 100%);
    opacity: 0;
  }
  to {
    transform: translate(-50%, 0);
    opacity: 1;
  }
}

.guide-content {
  text-align: center;
}

.guide-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-sm);
}

.guide-header h3 {
  margin: 0;
  color: var(--primary-color);
  font-weight: 600;
}

.guide-icon {
  color: var(--primary-color);
  font-size: 24px;
  margin-left: var(--spacing-xs);
}

.guide-content p {
  margin-bottom: var(--spacing-md);
  color: var(--light-text-color);
}

.guide-actions {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
}

.btn {
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  padding: var(--spacing-sm) var(--spacing-lg);
  cursor: pointer;
  transition: all var(--transition-speed);
  font-weight: 500;
}

.btn:hover {
  background-color: var(--secondary-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.btn-outline {
  background-color: transparent;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
}

.btn-outline:hover {
  background-color: rgba(92, 174, 149, 0.1);
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

@media (max-width: 768px) {
  .collect-container {
    flex-direction: column;
  }
  
  .collect-sidebar {
    width: 100%;
  }
  
  .quick-actions {
    flex-direction: row;
    flex-wrap: wrap;
  }
  
  .action-btn {
    flex: 1;
    min-width: 120px;
  }
  
  .inspirations-list {
    grid-template-columns: 1fr;
  }
  
  .floating-guide {
    width: 90%;
  }
}
</style>