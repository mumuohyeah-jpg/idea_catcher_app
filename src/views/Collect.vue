<template>
  <div class="collect-page">
    <div class="container">
      <div class="page-header">
        <h1>收集灵感</h1>
        <p>捕捉你的创意火花，多种方式记录灵感</p>
        <div class="progress-container desktop-only">
          <div class="progress-bar">
            <div class="progress-step active" data-label="收集灵感">
              <span class="step-number">1</span>
            </div>
            <div class="progress-step" data-label="工坊">
              <span class="step-number">2</span>
            </div>
            <div class="progress-step" data-label="日历">
              <span class="step-number">3</span>
            </div>
            <div class="progress-step" data-label="分享">
              <span class="step-number">4</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="collect-container">
        <div class="collect-sidebar">
          <div class="sidebar-section">
            <h3>快速操作</h3>
            <div class="quick-actions">
              <button class="action-btn primary-btn" @click="showNewInspirationForm">
                <span class="material-icons">text_fields</span>
                <span>文字灵感</span>
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
          
          <div class="sidebar-section mobile-hidden">
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

// 监听屏幕宽度变化
const isMobile = ref(window.innerWidth <= 768)
window.addEventListener('resize', () => {
  isMobile.value = window.innerWidth <= 768
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
  editingInspiration.value = {
    title: '',
    type: 'text',
    content: '',
    tags: []
  }
  showForm.value = true
  hideGuide()
  
  // 自动选择文字类型
  selectedTypes.value = ['text']
}

function editInspiration(inspiration) {
  editingInspiration.value = inspiration
  showForm.value = true
  
  // 自动选择对应类型
  selectedTypes.value = [inspiration.type]
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
    
    // 自动选择语音类型
    selectedTypes.value = ['audio']
    
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
    
    // 自动选择语音类型
    selectedTypes.value = ['audio']
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
  
  // 自动选择图片类型
  selectedTypes.value = ['image']
  
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
  background-color: var(--background-color);
  min-height: 100vh;
}

.page-header {
  margin-bottom: var(--spacing-lg);
  text-align: center;
  padding: var(--spacing-lg) 0;
}

.desktop-only {
  display: block;
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
  position: relative;
  overflow: hidden;
}

.progress-bar {
  display: flex;
  justify-content: space-between;
  position: relative;
  margin-bottom: var(--spacing-lg);
  padding: 0 20px;
  width: 100%;
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

.progress-bar::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  width: 15%;
  height: 2px;
  background-color: var(--primary-color);
  transform: translateY(-50%);
  z-index: 1;
  transition: width 0.5s ease;
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
  margin: 0 10px;
  flex-shrink: 0;
  box-shadow: 0 2px 4px var(--shadow-color);
  transition: all var(--transition-speed);
}

.step-number {
  font-size: 14px;
  font-weight: 600;
  color: var(--light-text-color);
}

.progress-step.active {
  transform: scale(1.1);
  border-color: var(--primary-color);
  border-width: 2.5px;
  background-color: var(--primary-color);
}

.progress-step.active .step-number {
  color: white;
}

.progress-step::after {
  content: attr(data-label);
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: var(--spacing-xs);
  white-space: nowrap;
  font-size: 0.9rem;
  color: var(--light-text-color);
  font-weight: normal;
  text-align: center;
  width: max-content;
}

@media (max-width: 480px) {
  .progress-step::after {
    display: none;
  }
}

.progress-step.completed {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
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
  box-shadow: 0 2px 12px var(--shadow-color);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  position: relative;
  overflow: hidden;
  border-left: 4px solid var(--primary-color);
  transition: transform var(--transition-speed), box-shadow var(--transition-speed);
}

.sidebar-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px var(--shadow-color);
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
  justify-content: center;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding: var(--spacing-md) var(--spacing-sm);
  border: none;
  border-radius: var(--border-radius-md);
  background-color: #f5f5f5;
  cursor: pointer;
  transition: all var(--transition-speed);
  text-align: center;
  position: relative;
  overflow: hidden;
  z-index: 1;
  font-weight: 500;
}

.action-btn .material-icons {
  font-size: 24px;
  margin-bottom: 4px;
}

.action-btn.primary-btn {
  background-color: rgba(92, 174, 149, 0.1);
  color: var(--primary-color);
}

@media (min-width: 769px) {
  .action-btn {
    flex-direction: row;
    text-align: left;
    padding: var(--spacing-sm) var(--spacing-md);
  }
  
  .action-btn .material-icons {
    margin-bottom: 0;
  }
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
  padding: var(--spacing-xl) var(--spacing-md);
  background-color: white;
  border-radius: var(--border-radius-lg);
  box-shadow: 0 2px 12px var(--shadow-color);
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  max-width: 100%;
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
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-md);
  width: 100%;
}

.floating-guide {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  border-radius: var(--border-radius-lg);
  box-shadow: 0 8px 24px var(--shadow-color);
  padding: var(--spacing-lg);
  z-index: 100;
  max-width: 90%;
  width: 400px;
  animation: slideUp 0.5s ease;
  backdrop-filter: blur(8px);
  border: 1px solid var(--border-color);
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
    justify-content: center;
  }
  
  .action-btn {
    flex: 1;
    min-width: 100px;
    max-width: 30%;
    margin: 0 5px;
  }
  
  .inspirations-list {
    grid-template-columns: 1fr;
  }
  
  .floating-guide {
    width: 90%;
  }
  
  .page-header h1 {
    font-size: 1.8rem;
    margin-bottom: var(--spacing-sm);
  }
  
  .page-header p {
    font-size: 1rem;
    padding: 0 var(--spacing-md);
    margin-bottom: var(--spacing-sm);
  }
  
  .mobile-hidden {
    display: none;
  }
  
  .desktop-only {
    display: none;
  }
}

@media (max-width: 480px) {
  .sidebar-section {
    padding: var(--spacing-sm);
  }
  
  .action-btn {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: 0.9rem;
  }
  
  .filter-tag {
    padding: 4px 10px;
    font-size: 0.8rem;
  }
  
  .page-header {
    padding: var(--spacing-md) 0;
  }
  
  .page-header h1 {
    font-size: 1.6rem;
  }
  
  .page-header p {
    font-size: 0.95rem;
  }
}
</style>