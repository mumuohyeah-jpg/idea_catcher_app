<template>
  <div class="share-modal" v-if="visible">
    <div class="share-container">
      <div class="share-header">
        <h3>社交分享</h3>
        <button class="close-btn" @click="close">×</button>
      </div>
      
      <div class="share-content">
        <div class="share-preview">
          <div class="preview-header">
            <h4>预览</h4>
            <div class="platform-selector">
              <button 
                v-for="platform in platforms" 
                :key="platform.id"
                class="platform-btn"
                :class="{ active: selectedPlatform === platform.id }"
                @click="selectPlatform(platform.id)"
              >
                {{ platform.name }}
              </button>
            </div>
          </div>
          
          <div class="preview-content">
            <!-- 小红书风格 -->
            <div v-if="selectedPlatform === 'xiaohongshu'" class="preview-xiaohongshu">
              <div class="xhs-header">
                <div class="xhs-avatar"></div>
                <div class="xhs-user">用户名</div>
              </div>
              <div class="xhs-image">
                <img :src="previewData.image" :alt="inspiration.title">
              </div>
              <div class="xhs-title">{{ previewData.title }}</div>
              <div class="xhs-content">{{ previewData.content }}</div>
              <div class="xhs-tags">
                <span v-for="tag in previewData.tags" :key="tag" class="xhs-tag">#{{ tag }}</span>
              </div>
            </div>
            
            <!-- 微博风格 -->
            <div v-else-if="selectedPlatform === 'weibo'" class="preview-weibo">
              <div class="weibo-content">{{ previewData.content }}</div>
              <div class="weibo-image">
                <img :src="previewData.image" :alt="inspiration.title">
              </div>
              <div class="weibo-tags">
                <span v-for="tag in previewData.tags" :key="tag" class="weibo-tag">#{{ tag }}#</span>
              </div>
            </div>
            
            <!-- 微信风格 -->
            <div v-else-if="selectedPlatform === 'wechat'" class="preview-wechat">
              <div class="wechat-image">
                <img :src="previewData.image" :alt="inspiration.title">
              </div>
              <div class="wechat-title">{{ previewData.title }}</div>
              <div class="wechat-content">{{ previewData.content }}</div>
            </div>
          </div>
        </div>
        
        <div class="share-options">
          <div class="form-group">
            <label>自定义标题</label>
            <input type="text" v-model="customTitle" class="form-control" placeholder="输入标题...">
          </div>
          
          <div class="form-group">
            <label>自定义内容</label>
            <textarea v-model="customContent" class="form-control" rows="3" placeholder="输入内容..."></textarea>
          </div>
          
          <div class="form-group">
            <label>标签</label>
            <div class="tags-input">
              <div class="tags-container">
                <span 
                  v-for="(tag, index) in customTags" 
                  :key="index" 
                  class="tag"
                >
                  {{ tag }}
                  <button type="button" class="tag-remove" @click="removeTag(index)">×</button>
                </span>
              </div>
              <div class="tag-input-container">
                <input 
                  type="text" 
                  v-model="tagInput" 
                  @keydown.enter.prevent="addTag"
                  class="form-control" 
                  placeholder="添加标签，按回车确认"
                >
              </div>
            </div>
          </div>
          
          <div class="form-group">
            <button class="btn" @click="optimizeWithAI">
              <span class="material-icons">auto_awesome</span>
              AI优化内容
            </button>
          </div>
        </div>
      </div>
      
      <div class="share-footer">
        <button class="btn btn-outline" @click="close">取消</button>
        <button class="btn" @click="shareContent">分享</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  inspiration: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['close', 'share'])

const platforms = [
  { id: 'xiaohongshu', name: '小红书' },
  { id: 'weibo', name: '微博' },
  { id: 'wechat', name: '微信' }
]

const selectedPlatform = ref('xiaohongshu')
const customTitle = ref('')
const customContent = ref('')
const customTags = ref([])
const tagInput = ref('')
const isOptimizing = ref(false)

// 监听灵感变化，初始化表单
watch(() => props.inspiration, (newVal) => {
  if (newVal && newVal.title) {
    customTitle.value = newVal.title
    
    if (newVal.type === 'text') {
      customContent.value = newVal.content
    } else if (newVal.type === 'audio' && newVal.transcript) {
      customContent.value = newVal.transcript
    } else {
      customContent.value = `分享我的${newVal.type === 'image' ? '图片' : '音频'}灵感：${newVal.title}`
    }
    
    customTags.value = [...(newVal.tags || [])]
  }
}, { immediate: true })

// 预览数据
const previewData = computed(() => {
  // 根据不同平台生成不同的预览内容
  const baseData = {
    title: customTitle.value || props.inspiration.title || '我的灵感',
    content: customContent.value || '分享我的创意灵感...',
    tags: customTags.value.length > 0 ? customTags.value : ['灵感', '创意', '分享'],
    image: props.inspiration.type === 'image' 
      ? props.inspiration.content 
      : 'https://images.unsplash.com/photo-1513151233558-d860c5398176'
  }
  
  // 根据平台定制内容
  if (selectedPlatform.value === 'xiaohongshu') {
    return {
      ...baseData,
      title: `✨ ${baseData.title} ✨`,
      content: baseData.content.length > 100 
        ? baseData.content.substring(0, 100) + '...' 
        : baseData.content
    }
  } else if (selectedPlatform.value === 'weibo') {
    return {
      ...baseData,
      content: `${baseData.title}：${baseData.content.length > 120 
        ? baseData.content.substring(0, 120) + '...' 
        : baseData.content}`
    }
  } else if (selectedPlatform.value === 'wechat') {
    return baseData
  }
  
  return baseData
})

function selectPlatform(platform) {
  selectedPlatform.value = platform
}

function addTag() {
  const tag = tagInput.value.trim()
  if (tag && !customTags.value.includes(tag)) {
    customTags.value.push(tag)
  }
  tagInput.value = ''
}

function removeTag(index) {
  customTags.value.splice(index, 1)
}

function optimizeWithAI() {
  isOptimizing.value = true
  
  // 模拟AI优化过程
  setTimeout(() => {
    // 根据不同平台生成不同的优化内容
    if (selectedPlatform.value === 'xiaohongshu') {
      customTitle.value = `✨ 今日灵感分享 | ${props.inspiration.title} ✨`
      customContent.value = `分享一个超棒的创意灵感～\n\n${props.inspiration.type === 'text' ? props.inspiration.content : props.inspiration.transcript || props.inspiration.title}\n\n这个灵感让我有了新的思路，你们觉得呢？👇`
      if (!customTags.value.includes('灵感捕手')) {
        customTags.value.push('灵感捕手', '创意分享', '每日灵感')
      }
    } else if (selectedPlatform.value === 'weibo') {
      customContent.value = `#灵感分享# ${props.inspiration.title}：${props.inspiration.type === 'text' ? props.inspiration.content : props.inspiration.transcript || '分享一个创意灵感'} 来自@灵感捕手App`
      if (!customTags.value.includes('灵感捕手')) {
        customTags.value.push('灵感捕手', '创意', '灵感')
      }
    } else if (selectedPlatform.value === 'wechat') {
      customTitle.value = `${props.inspiration.title} | 灵感捕手`
      customContent.value = `${props.inspiration.type === 'text' ? props.inspiration.content : props.inspiration.transcript || '分享一个创意灵感'}\n\n——来自灵感捕手App`
    }
    
    isOptimizing.value = false
  }, 1000)
}

function shareContent() {
  // 模拟分享过程
  alert(`已分享到${platforms.find(p => p.id === selectedPlatform.value).name}`)
  emit('share', {
    platform: selectedPlatform.value,
    title: customTitle.value,
    content: customContent.value,
    tags: customTags.value,
    inspiration: props.inspiration
  })
  close()
}

function close() {
  emit('close')
}
</script>

<style scoped>
.share-modal {
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

.share-container {
  background-color: white;
  border-radius: var(--border-radius-md);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
}

.share-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
}

.share-header h3 {
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

.share-content {
  padding: var(--spacing-lg);
  display: flex;
  gap: var(--spacing-lg);
}

.share-preview {
  flex: 1;
  min-width: 0;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.preview-header h4 {
  margin: 0;
  color: var(--text-color);
}

.platform-selector {
  display: flex;
  gap: var(--spacing-xs);
}

.platform-btn {
  background: none;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  padding: 4px 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all var(--transition-speed);
}

.platform-btn.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.preview-content {
  background-color: #f5f5f5;
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  min-height: 400px;
}

/* 小红书风格 */
.preview-xiaohongshu {
  background-color: white;
  border-radius: var(--border-radius-md);
  overflow: hidden;
}

.xhs-header {
  display: flex;
  align-items: center;
  padding: var(--spacing-sm);
}

.xhs-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #f0f0f0;
  margin-right: var(--spacing-sm);
}

.xhs-user {
  font-weight: 500;
}

.xhs-image {
  width: 100%;
  height: 200px;
  background-color: #f0f0f0;
  overflow: hidden;
}

.xhs-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.xhs-title {
  padding: var(--spacing-sm);
  font-weight: bold;
  font-size: 1.1rem;
}

.xhs-content {
  padding: 0 var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
  color: #333;
  font-size: 0.9rem;
}

.xhs-tags {
  padding: var(--spacing-sm);
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.xhs-tag {
  color: #ff2442;
  font-size: 0.8rem;
}

/* 微博风格 */
.preview-weibo {
  background-color: white;
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
}

.weibo-content {
  margin-bottom: var(--spacing-md);
  font-size: 0.95rem;
}

.weibo-image {
  width: 100%;
  height: 200px;
  background-color: #f0f0f0;
  border-radius: var(--border-radius-sm);
  overflow: hidden;
  margin-bottom: var(--spacing-md);
}

.weibo-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.weibo-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.weibo-tag {
  color: #eb7350;
  font-size: 0.9rem;
}

/* 微信风格 */
.preview-wechat {
  background-color: white;
  border-radius: var(--border-radius-md);
  overflow: hidden;
}

.wechat-image {
  width: 100%;
  height: 200px;
  background-color: #f0f0f0;
  overflow: hidden;
}

.wechat-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.wechat-title {
  padding: var(--spacing-md);
  font-weight: bold;
  font-size: 1.1rem;
}

.wechat-content {
  padding: 0 var(--spacing-md) var(--spacing-md);
  color: #333;
  font-size: 0.9rem;
}

.share-options {
  flex: 1;
  min-width: 0;
}

.tags-input {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  min-height: 32px;
  margin-bottom: var(--spacing-xs);
}

.tag {
  display: flex;
  align-items: center;
  background-color: var(--border-color);
  color: var(--text-color);
  font-size: 0.9rem;
  padding: 2px 8px;
  border-radius: 12px;
}

.tag-remove {
  background: none;
  border: none;
  color: var(--light-text-color);
  margin-left: 4px;
  cursor: pointer;
  font-size: 1.2rem;
  line-height: 1;
}

.share-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  border-top: 1px solid var(--border-color);
}

@media (max-width: 768px) {
  .share-content {
    flex-direction: column;
  }
  
  .preview-content {
    min-height: 300px;
  }
}
</style>