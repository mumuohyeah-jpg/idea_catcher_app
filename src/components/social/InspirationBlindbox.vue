<template>
  <div class="blindbox-modal" v-if="visible">
    <div class="blindbox-container">
      <div class="blindbox-header">
        <h3>灵感盲盒</h3>
        <button class="close-btn" @click="close">×</button>
      </div>
      
      <div class="blindbox-content">
        <div v-if="!opened" class="blindbox-unopened">
          <div class="blindbox-image" @click="openBox">
            <span class="material-icons">card_giftcard</span>
          </div>
          <p>点击盲盒，获取随机灵感</p>
          <p class="blindbox-hint">每次打开盲盒，你将收到来自其他创作者的随机灵感</p>
        </div>
        
        <div v-else class="blindbox-opened">
          <div class="blindbox-result">
            <div class="result-type-icon" :class="randomInspiration.type">
              <span class="material-icons">{{ getTypeIcon(randomInspiration.type) }}</span>
            </div>
            <h4>{{ randomInspiration.title }}</h4>
            
            <!-- 文字内容 -->
            <div v-if="randomInspiration.type === 'text'" class="result-content text-content">
              <p>{{ randomInspiration.content }}</p>
            </div>
            
            <!-- 图片内容 -->
            <div v-else-if="randomInspiration.type === 'image'" class="result-content image-content">
              <img :src="randomInspiration.content" :alt="randomInspiration.title">
            </div>
            
            <!-- 音频内容 -->
            <div v-else-if="randomInspiration.type === 'audio'" class="result-content audio-content">
              <audio controls>
                <source :src="randomInspiration.content" type="audio/mpeg">
                您的浏览器不支持音频播放
              </audio>
              <p v-if="randomInspiration.transcript">{{ randomInspiration.transcript }}</p>
            </div>
            
            <div class="result-tags">
              <span v-for="tag in randomInspiration.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
            
            <div class="result-author">
              来自: {{ randomInspiration.anonymous ? '匿名用户' : randomInspiration.author }}
            </div>
          </div>
          
          <div class="blindbox-actions">
            <button class="btn btn-outline" @click="openBox">再来一个</button>
            <button class="btn" @click="saveInspiration">保存到我的灵感</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useInspirationStore } from '../../store/inspirationStore'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'save'])

const inspirationStore = useInspirationStore()
const opened = ref(false)
const randomInspiration = ref(null)

// 模拟灵感库
const inspirationPool = [
  {
    id: 'b1',
    title: '城市的夜晚',
    content: '城市的夜晚，霓虹灯闪烁，人们匆匆而过，每个人都有自己的故事和目的地。',
    type: 'text',
    tags: ['城市', '夜晚', '观察'],
    author: '都市观察者',
    anonymous: false
  },
  {
    id: 'b2',
    title: '海边日落',
    content: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmZjk1MDAiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNmZjVlMDAiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cGF0aCBmaWxsPSJ1cmwoI2EpIiBkPSJNMCAwaDgwMHY0MDBIMHoiLz48cGF0aCBkPSJNMCAzMDBoODAwdjEwMEgweiIgZmlsbD0iIzAwNTZiMyIvPjxjaXJjbGUgY3g9IjQwMCIgY3k9IjE1MCIgcj0iODAiIGZpbGw9IiNmZmYiIG9wYWNpdHk9Ii44Ii8+PC9zdmc+',
    type: 'image',
    tags: ['自然', '日落', '海洋'],
    author: '自然摄影师',
    anonymous: false
  },
  {
    id: 'b3',
    title: '雨声',
    content: 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAbAAuLi4uLi4uLi4uLi4uLi4uLi4uLi44ODg4ODg4ODg4ODg4ODg4ODg4ODg4OD///////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAYHl',
    transcript: '雨滴落在窗户上的声音，让人感到宁静与放松。',
    type: 'audio',
    tags: ['声音', '雨天', '放松'],
    author: '声音收集者',
    anonymous: true
  },
  {
    id: 'b4',
    title: '关于创造力的思考',
    content: '创造力不是凭空而来，而是对已有事物的重新组合和解读。当我们打破常规思维，从不同角度看待问题时，灵感就会不期而至。',
    type: 'text',
    tags: ['创造力', '思考', '灵感'],
    author: '创意教练',
    anonymous: false
  }
]

function getTypeIcon(type) {
  const icons = {
    text: 'text_fields',
    image: 'image',
    audio: 'mic'
  }
  return icons[type] || 'note'
}

function openBox() {
  // 随机选择一个灵感
  const randomIndex = Math.floor(Math.random() * inspirationPool.length)
  randomInspiration.value = inspirationPool[randomIndex]
  opened.value = true
}

function saveInspiration() {
  if (randomInspiration.value) {
    // 将灵感保存到用户的灵感库
    inspirationStore.addInspiration({
      title: randomInspiration.value.title,
      content: randomInspiration.value.content,
      type: randomInspiration.value.type,
      tags: [...randomInspiration.value.tags, '盲盒'],
      transcript: randomInspiration.value.transcript || ''
    })
    
    emit('save', randomInspiration.value)
    alert('已保存到你的灵感库')
  }
}

function close() {
  opened.value = false
  randomInspiration.value = null
  emit('close')
}
</script>

<style scoped>
.blindbox-modal {
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

.blindbox-container {
  background-color: white;
  border-radius: var(--border-radius-md);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.blindbox-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
}

.blindbox-header h3 {
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

.blindbox-content {
  padding: var(--spacing-lg);
}

.blindbox-unopened {
  text-align: center;
}

.blindbox-image {
  width: 150px;
  height: 150px;
  margin: 0 auto var(--spacing-lg);
  background-color: var(--accent-color);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-speed);
  animation: pulse 2s infinite;
}

.blindbox-image:hover {
  transform: scale(1.05);
}

.blindbox-image .material-icons {
  font-size: 80px;
  color: var(--primary-color);
}

.blindbox-hint {
  color: var(--light-text-color);
  font-size: 0.9rem;
  margin-top: var(--spacing-md);
}

.blindbox-opened {
  text-align: center;
}

.blindbox-result {
  background-color: var(--accent-color);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.result-type-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--spacing-md);
}

.result-type-icon.text {
  background-color: #E3F2FD;
  color: #1976D2;
}

.result-type-icon.image {
  background-color: #E8F5E9;
  color: #388E3C;
}

.result-type-icon.audio {
  background-color: #FFF3E0;
  color: #F57C00;
}

.result-type-icon .material-icons {
  font-size: 30px;
}

.blindbox-result h4 {
  margin-bottom: var(--spacing-md);
  color: var(--text-color);
}

.result-content {
  margin-bottom: var(--spacing-md);
}

.text-content {
  text-align: left;
  white-space: pre-line;
}

.image-content img {
  max-width: 100%;
  border-radius: var(--border-radius-sm);
}

.audio-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.audio-content audio {
  width: 100%;
}

.result-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  justify-content: center;
  margin-bottom: var(--spacing-md);
}

.tag {
  background-color: white;
  color: var(--text-color);
  font-size: 0.8rem;
  padding: 2px 8px;
  border-radius: 12px;
}

.result-author {
  font-size: 0.9rem;
  color: var(--light-text-color);
}

.blindbox-actions {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(109, 171, 144, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(109, 171, 144, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(109, 171, 144, 0);
  }
}

@media (max-width: 768px) {
  .blindbox-actions {
    flex-direction: column;
  }
}
</style>