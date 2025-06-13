<template>
  <div class="social-page">
    <div class="container">
      <div class="page-header">
        <h1>灵感分享</h1>
        <p>与创意社区交流，获取反馈与灵感</p>
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-step completed">收集灵感</div>
            <div class="progress-step completed">灵感工坊</div>
            <div class="progress-step completed">灵感日历</div>
            <div class="progress-step active">灵感分享</div>
          </div>
        </div>
        <div class="completion-message">
          <div class="completion-icon">
            <span class="material-icons">check_circle</span>
          </div>
          <p>恭喜！你已完成创意流程的所有步骤</p>
          <router-link to="/collect" class="btn btn-primary">
            <span>开始新的创意之旅</span>
          </router-link>
        </div>
      </div>
      
      <div class="social-container">
        <SocialTabs @change="handleTabChange">
          <template #wall>
            <InspirationWall @view-post="openShareModal" />
          </template>
          <template #blindbox>
            <BlindboxContent @save="handleBlindboxSave" />
          </template>
          <template #share>
            <SocialShareContent />
          </template>
        </SocialTabs>
      </div>
    </div>
    
    <!-- 社交分享 -->
    <SocialShareModal
      :visible="showShareModal"
      :inspiration="selectedInspiration"
      @close="showShareModal = false"
      @share="handleShare"
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
import { ref, onMounted, onBeforeMount } from 'vue'
import { useUserStore } from '../store/userStore'
import { useInspirationStore } from '../store/inspirationStore'
import InspirationWall from '../components/social/InspirationWall.vue'
import SocialTabs from '../components/social/SocialTabs.vue'
import BlindboxContent from '../components/social/BlindboxContent.vue'
import SocialShareContent from '../components/social/SocialShareContent.vue'
import SocialShareModal from '../components/social/SocialShareModal.vue'
import TutorialOverlay from '../components/common/TutorialOverlay.vue'

const userStore = useUserStore()
const inspirationStore = useInspirationStore()
const tutorialVisible = ref(false)
const showShareModal = ref(false)
const selectedInspiration = ref(null)
const activeTab = ref('wall')

const tutorialSteps = [
  {
    title: '灵感分享',
    description: '在这里，你可以分享你的灵感，也可以浏览其他创作者的灵感。',
    image: ''
  },
  {
    title: '灵感墙',
    description: '浏览灵感墙，发现来自不同创作者的创意火花。',
    image: ''
  },
  {
    title: '灵感盲盒',
    description: '参与灵感盲盒，与其他创作者随机交换灵感，激发跨领域创意。',
    image: ''
  },
  {
    title: '社交分享',
    description: '将你的灵感分享到社交平台，获取更多反馈。',
    image: ''
  }
]

onBeforeMount(() => {
  // 监听社交分享事件
  document.addEventListener('share-inspiration', handleShareEvent)
})

onMounted(() => {
  // 如果是首次使用社交页面，显示教程
  if (!localStorage.getItem('socialTutorialShown')) {
    setTimeout(() => {
      tutorialVisible.value = true
      localStorage.setItem('socialTutorialShown', 'true')
    }, 500)
  }
})

function handleShareEvent(event) {
  const { platform, inspiration } = event.detail
  if (inspiration) {
    selectedInspiration.value = inspiration
    showShareModal.value = true
  }
}

function closeTutorial() {
  tutorialVisible.value = false
}

function completeTutorial() {
  tutorialVisible.value = false
  userStore.addPoints(10, '完成社交功能教程')
}

function openShareModal(post) {
  selectedInspiration.value = post
  showShareModal.value = true
}

function handleShare(shareData) {
  console.log('分享数据:', shareData)
  // 实际分享到社交平台
  
  // 添加分享记录
  const shareRecord = {
    platform: shareData.platform,
    title: shareData.title,
    date: new Date().toLocaleDateString()
  }
  
  // 更新用户积分
  userStore.addPoints(20, `分享到${getPlatformName(shareData.platform)}`)
  userStore.completeTask('share_social')
  
  alert(`成功分享到${getPlatformName(shareData.platform)}！获得20积分`)
}

function handleBlindboxSave(inspiration) {
  // 用户保存盲盒灵感时奖励积分
  userStore.addPoints(5, '保存灵感盲盒')
  userStore.completeTask('open_blindbox')
}

function getPlatformName(platformId) {
  const platforms = {
    'xiaohongshu': '小红书',
    'weibo': '微博',
    'wechat': '微信'
  }
  return platforms[platformId] || platformId
}

function handleTabChange(tabId) {
  activeTab.value = tabId
  console.log('当前标签页:', tabId)
}
</script>

<style scoped>
.social-page {
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

.social-features {
  display: flex;
  gap: var(--spacing-md);
  margin: var(--spacing-lg) 0;
}

.feature-card {
  flex: 1;
  background-color: white;
  border-radius: var(--border-radius-md);
  box-shadow: 0 2px 8px var(--shadow-color);
  padding: var(--spacing-md);
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all var(--transition-speed);
}

.feature-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px var(--shadow-color);
}

.blindbox-card {
  background-color: rgba(255, 193, 7, 0.1);
  border-left: 4px solid #FFC107;
}

.share-card {
  background-color: rgba(33, 150, 243, 0.1);
  border-left: 4px solid #2196F3;
}

.feature-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: var(--spacing-md);
}

.blindbox-card .feature-icon {
  background-color: #FFC107;
  color: white;
}

.share-card .feature-icon {
  background-color: #2196F3;
  color: white;
}

.feature-content {
  flex: 1;
}

.feature-content h3 {
  margin: 0;
  margin-bottom: 4px;
}

.feature-content p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--light-text-color);
}

.social-container {
  background-color: white;
  border-radius: var(--border-radius-md);
  box-shadow: 0 2px 8px var(--shadow-color);
  padding: var(--spacing-lg);
  height: 70vh;
}

@media (max-width: 768px) {
  .social-features {
    flex-direction: column;
  }
}
</style>