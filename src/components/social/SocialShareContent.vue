<template>
  <div class="social-share-content">
    <h2>社交分享</h2>
    <p class="section-description">将你的灵感分享到社交平台，获取更多反馈</p>
    
    <div class="share-content" v-if="!showShareForm">
      <div class="share-platforms">
        <div class="platform-card" @click="shareToXiaohongshu">
          <div class="platform-icon xiaohongshu">
            <span class="material-icons">public</span>
          </div>
          <div class="platform-info">
            <h3>小红书</h3>
            <p>分享灵感笔记，获取创意反馈</p>
          </div>
        </div>
        
        <div class="platform-card" @click="shareToWeibo">
          <div class="platform-icon weibo">
            <span class="material-icons">forum</span>
          </div>
          <div class="platform-info">
            <h3>微博</h3>
            <p>分享创意灵感，引发更多讨论</p>
          </div>
        </div>
        
        <div class="platform-card" @click="shareToWechat">
          <div class="platform-icon wechat">
            <span class="material-icons">chat</span>
          </div>
          <div class="platform-info">
            <h3>微信</h3>
            <p>分享给好友或朋友圈</p>
          </div>
        </div>
      </div>
      
      <div class="recent-shares">
        <h3>最近分享</h3>
        <div class="share-history">
          <div v-if="shareHistory.length > 0" class="history-list">
            <div v-for="(item, index) in shareHistory" :key="index" class="history-item">
              <div class="history-platform" :class="item.platform"></div>
              <div class="history-content">
                <h4>{{ item.title }}</h4>
                <p>{{ item.date }}</p>
              </div>
            </div>
          </div>
          <div v-else class="empty-history">
            <p>暂无分享记录</p>
            <button class="btn" @click="shareToXiaohongshu">立即分享</button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="share-form" v-else>
      <div class="form-header">
        <h3>分享到 {{ getPlatformName(currentPlatform) }}</h3>
        <button class="btn-close" @click="cancelShare">
          <span class="material-icons">close</span>
        </button>
      </div>
      
      <div class="form-content">
        <div class="form-preview">
          <div class="preview-header">
            <div class="preview-platform" :class="currentPlatform"></div>
            <div class="preview-title">{{ shareData.title }}</div>
          </div>
          
          <div class="preview-content">
            <div v-if="shareData.type === 'text'" class="preview-text">
              {{ shareData.content }}
            </div>
            <div v-else-if="shareData.type === 'image'" class="preview-image">
              <img :src="shareData.content" :alt="shareData.title">
            </div>
            <div v-else-if="shareData.type === 'audio'" class="preview-audio">
              <div class="audio-icon">
                <span class="material-icons">music_note</span>
              </div>
              <p>{{ shareData.transcript || '语音灵感' }}</p>
            </div>
          </div>
          
          <div class="preview-tags">
            <span v-for="tag in shareData.tags" :key="tag" class="tag">#{{ tag }}</span>
          </div>
        </div>
        
        <div class="form-options">
          <h4>AI优化选项</h4>
          <div class="option-item">
            <label>
              <input type="checkbox" v-model="aiOptions.optimizeTitle">
              优化标题
            </label>
            <p class="option-desc">使用AI优化标题，提高吸引力</p>
          </div>
          
          <div class="option-item">
            <label>
              <input type="checkbox" v-model="aiOptions.expandContent">
              扩展内容
            </label>
            <p class="option-desc">使用AI扩展内容，增加详细度</p>
          </div>
          
          <div class="option-item">
            <label>
              <input type="checkbox" v-model="aiOptions.suggestTags">
              推荐标签
            </label>
            <p class="option-desc">使用AI推荐热门标签，提高曝光</p>
          </div>
          
          <div class="ai-status" v-if="isOptimizing">
            <div class="spinner"></div>
            <p>AI正在优化内容...</p>
          </div>
          
          <div class="ai-result" v-if="optimizationComplete">
            <div class="result-icon">
              <span class="material-icons">check_circle</span>
            </div>
            <p>AI优化完成！内容已更新</p>
          </div>
        </div>
        
        <div class="form-actions">
          <button class="btn btn-outline" @click="cancelShare">取消</button>
          <button class="btn btn-ai" @click="optimizeContent" :disabled="isOptimizing || !hasAiOptionsSelected">
            <span class="material-icons">auto_fix_high</span>
            AI优化
          </button>
          <button class="btn" @click="confirmShare" :disabled="isOptimizing">分享</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useInspirationStore } from '../../store/inspirationStore'
import { useUserStore } from '../../store/userStore'

const inspirationStore = useInspirationStore()
const userStore = useUserStore()

// 模拟分享历史
const shareHistory = ref([
  {
    platform: 'xiaohongshu',
    title: '关于创意的思考',
    date: '2023-06-12'
  },
  {
    platform: 'weibo',
    title: '城市街景灵感',
    date: '2023-06-10'
  },
  {
    platform: 'wechat',
    title: '自然的声音',
    date: '2023-06-08'
  },
  {
    platform: 'xiaohongshu',
    title: '色彩实验',
    date: '2023-06-05'
  },
  {
    platform: 'weibo',
    title: '旋律片段',
    date: '2023-06-01'
  }
])

// 分享表单状态
const showShareForm = ref(false)
const currentPlatform = ref('')
const isOptimizing = ref(false)
const optimizationComplete = ref(false)

// AI优化选项
const aiOptions = ref({
  optimizeTitle: false,
  expandContent: false,
  suggestTags: false
})

// 计算是否有AI选项被选中
const hasAiOptionsSelected = computed(() => {
  return aiOptions.value.optimizeTitle || 
         aiOptions.value.expandContent || 
         aiOptions.value.suggestTags
})

// 分享数据
const shareData = ref({
  title: '',
  content: '',
  type: 'text',
  tags: []
})

function shareToXiaohongshu() {
  prepareShare('xiaohongshu')
}

function shareToWeibo() {
  prepareShare('weibo')
}

function shareToWechat() {
  prepareShare('wechat')
}

function getPlatformName(platformId) {
  const platforms = {
    'xiaohongshu': '小红书',
    'weibo': '微博',
    'wechat': '微信'
  }
  return platforms[platformId] || platformId
}

function prepareShare(platform) {
  // 创建一个默认灵感内容
  const defaultInspiration = {
    id: 'default',
    title: '我的创意灵感',
    content: '分享我的创意灵感，期待与你交流！',
    type: 'text',
    tags: ['创意', '灵感', '分享']
  }
  
  // 获取最新的灵感作为默认分享内容，如果没有则使用默认内容
  const latestInspiration = inspirationStore.inspirations && inspirationStore.inspirations.length > 0 
    ? inspirationStore.inspirations[0] 
    : defaultInspiration
  
  // 处理内容URL，确保使用可靠的资源
  let content = latestInspiration.content
  if (latestInspiration.type === 'image' && content.includes('unsplash.com')) {
    // 替换为可靠的图片资源
    content = 'https://cdn.pixabay.com/photo/2015/01/09/11/08/startup-594090_1280.jpg'
  } else if (latestInspiration.type === 'audio' && !content.includes('pixabay.com')) {
    // 替换为可靠的音频资源
    content = 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_270f49b9bf.mp3'
  }
  
  // 设置分享数据
  shareData.value = {
    title: latestInspiration.title,
    content: content,
    type: latestInspiration.type,
    tags: [...latestInspiration.tags],
    transcript: latestInspiration.transcript
  }
  
  // 设置当前平台
  currentPlatform.value = platform
  
  // 显示分享表单
  showShareForm.value = true
  
  // 重置AI优化状态
  optimizationComplete.value = false
  aiOptions.value = {
    optimizeTitle: false,
    expandContent: false,
    suggestTags: false
  }
}

function cancelShare() {
  showShareForm.value = false
  isOptimizing.value = false
}

function optimizeContent() {
  if (!hasAiOptionsSelected.value) return
  
  isOptimizing.value = true
  
  // 模拟AI优化过程
  setTimeout(() => {
    // 优化标题
    if (aiOptions.value.optimizeTitle) {
      const platformSpecific = {
        'xiaohongshu': '超实用！',
        'weibo': '分享给大家！',
        'wechat': '与你分享'
      }
      
      shareData.value.title = `${platformSpecific[currentPlatform.value] || ''} ${shareData.value.title}`
    }
    
    // 扩展内容
    if (aiOptions.value.expandContent && shareData.value.type === 'text') {
      shareData.value.content += '\n\n这个灵感来源于我的日常观察和思考，希望能给大家带来一些启发。欢迎在评论区留下你的想法！'
    }
    
    // 推荐标签
    if (aiOptions.value.suggestTags) {
      const hotTags = {
        'xiaohongshu': ['创意灵感', '生活记录', '分享'],
        'weibo': ['每日分享', '创意', '灵感触发'],
        'wechat': ['朋友圈', '日常', '创意']
      }
      
      shareData.value.tags = [...new Set([...shareData.value.tags, ...hotTags[currentPlatform.value]])]
    }
    
    isOptimizing.value = false
    optimizationComplete.value = true
  }, 1500)
}

function confirmShare() {
  // 添加到分享历史
  const now = new Date()
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  
  shareHistory.value.unshift({
    platform: currentPlatform.value,
    title: shareData.value.title,
    date: dateStr
  })
  
  // 保持历史记录不超过10条
  if (shareHistory.value.length > 10) {
    shareHistory.value.pop()
  }
  
  // 奖励积分
  userStore.addPoints(20, `分享到${getPlatformName(currentPlatform.value)}`)
  
  // 关闭分享表单
  showShareForm.value = false
  
  // 触发分享事件
  const event = new CustomEvent('share-inspiration', {
    detail: {
      platform: currentPlatform.value,
      inspiration: shareData.value
    },
    bubbles: true
  })
  document.dispatchEvent(event)
  
  alert(`已成功分享到${getPlatformName(currentPlatform.value)}！获得20积分`)
}
</script>

<style scoped>
.social-share-content {
  padding: var(--spacing-md) 0;
}

.section-description {
  color: var(--light-text-color);
  margin-bottom: var(--spacing-lg);
}

.share-platforms {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.platform-card {
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  box-shadow: 0 2px 8px var(--shadow-color);
  cursor: pointer;
  transition: all var(--transition-speed);
}

.platform-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--shadow-color);
}

.platform-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: var(--spacing-md);
  overflow: hidden;
}

.platform-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.platform-info {
  flex: 1;
}

.platform-info h3 {
  margin: 0;
  margin-bottom: 4px;
}

.platform-info p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--light-text-color);
}

.recent-shares h3 {
  margin-bottom: var(--spacing-md);
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.history-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-sm);
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: var(--border-radius-sm);
}

.history-platform {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: var(--spacing-sm);
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}

.history-platform.xiaohongshu {
  background-color: #fe2c55;
}

.history-platform.weibo {
  background-color: #e6162d;
}

.history-platform.wechat {
  background-color: #07c160;
}

.history-content {
  flex: 1;
}

.history-content h4 {
  margin: 0;
  font-size: 0.9rem;
}

.history-content p {
  margin: 0;
  font-size: 0.8rem;
  color: var(--light-text-color);
}

.share-form {
  background-color: white;
  border-radius: var(--border-radius-md);
  box-shadow: 0 4px 16px var(--shadow-color);
  overflow: hidden;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
}

.form-header h3 {
  margin: 0;
}

.btn-close {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--light-text-color);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 50%;
  transition: all var(--transition-speed);
}

.btn-close:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: var(--text-color);
}

.form-content {
  padding: var(--spacing-lg);
}

.form-preview {
  background-color: #f9f9f9;
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.preview-header {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.preview-platform {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: var(--spacing-sm);
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}

.preview-platform.xiaohongshu {
  background-color: #fe2c55;
}

.preview-platform.weibo {
  background-color: #e6162d;
}

.preview-platform.wechat {
  background-color: #07c160;
}

.preview-title {
  font-weight: bold;
}

.preview-content {
  margin-bottom: var(--spacing-md);
}

.preview-text {
  white-space: pre-line;
}

.preview-image img {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: var(--border-radius-sm);
}

.preview-audio {
  display: flex;
  align-items: center;
  background-color: #f0f7ff;
  padding: var(--spacing-md);
  border-radius: var(--border-radius-sm);
}

.audio-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #e1effe;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: var(--spacing-md);
}

.audio-icon .material-icons {
  color: #2196f3;
}

.preview-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.tag {
  font-size: 0.8rem;
  padding: 2px 8px;
  border-radius: 12px;
  background-color: var(--border-color);
  color: var(--text-color);
}

.form-options {
  margin-bottom: var(--spacing-lg);
}

.form-options h4 {
  margin-bottom: var(--spacing-md);
}

.option-item {
  display: flex;
  flex-direction: column;
  margin-bottom: var(--spacing-sm);
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  transition: background-color var(--transition-speed);
}

.option-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.option-item label {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  font-weight: 500;
}

.option-desc {
  margin: 4px 0 0 24px;
  font-size: 0.9rem;
  color: var(--light-text-color);
}

.ai-status {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background-color: rgba(33, 150, 243, 0.1);
  border-radius: var(--border-radius-md);
  margin-top: var(--spacing-md);
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(33, 150, 243, 0.3);
  border-left-color: #2196f3;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.ai-result {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background-color: rgba(76, 175, 80, 0.1);
  border-radius: var(--border-radius-md);
  margin-top: var(--spacing-md);
}

.result-icon {
  color: var(--primary-color);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
}

.btn-ai {
  background-color: #2196f3;
  color: white;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.btn-ai:hover {
  background-color: #1976d2;
}

.btn-ai:disabled {
  background-color: #e0e0e0;
  color: #a0a0a0;
  cursor: default;
}

.empty-history {
  text-align: center;
  padding: var(--spacing-lg) 0;
  color: var(--light-text-color);
}

.empty-history p {
  margin-bottom: var(--spacing-md);
}
</style>