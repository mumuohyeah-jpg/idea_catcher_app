<template>
  <div class="blindbox-content">
    <h2>灵感盲盒</h2>
    <p class="section-description">随机匹配用户交换灵感片段，激发跨领域创意</p>
    
    <div class="blindbox-container" :class="{ 'opened': boxOpened }">
      <div v-if="!boxOpened" class="blindbox-closed" @click="openBox">
        <div class="box-image">
          <span class="material-icons">card_giftcard</span>
        </div>
        <p>点击打开盲盒，获取随机灵感</p>
      </div>
      
      <div v-else class="blindbox-opened">
        <div class="result-header">
          <h3>{{ randomInspiration.title }}</h3>
          <div class="result-type" :class="randomInspiration.type">
            {{ getTypeLabel(randomInspiration.type) }}
          </div>
        </div>
        
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
        
        <div class="user-match">
          <div class="match-avatar">{{ randomInspiration.author.charAt(0) }}</div>
          <div class="match-info">
            <p>来自用户: <strong>{{ randomInspiration.anonymous ? '匿名用户' : randomInspiration.author }}</strong></p>
            <p class="match-message">与你的创意风格匹配度: <strong>{{ matchPercentage }}%</strong></p>
          </div>
        </div>
        
        <div class="result-actions">
          <button class="btn btn-outline" @click="openBox">再来一个</button>
          <button class="btn" @click="saveInspiration">保存到我的灵感</button>
        </div>
      </div>
    </div>
    
    <div class="blindbox-history">
      <h3>历史盲盒</h3>
      <div class="history-list">
        <div v-for="(item, index) in savedInspirations" :key="index" class="history-item">
          <div class="history-icon" :class="item.type">
            <span class="material-icons">{{ getTypeIcon(item.type) }}</span>
          </div>
          <div class="history-info">
            <h4>{{ item.title }}</h4>
            <div class="history-tags">
              <span v-for="tag in item.tags.slice(0, 2)" :key="tag" class="tag-mini">{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useInspirationStore } from '../../store/inspirationStore'

const inspirationStore = useInspirationStore()

const emit = defineEmits(['save'])
const boxOpened = ref(false)
const matchPercentage = ref(Math.floor(Math.random() * 30) + 70) // 70-99% 匹配度

// 使用真实的音频文件路径
const rainAudioPath = '/src/assets/audio/rain.mp3';

// 更美观的内嵌SVG图像
const sunsetImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmZjk1MDAiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNmZjVlMDAiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cGF0aCBmaWxsPSJ1cmwoI2EpIiBkPSJNMCAwaDgwMHY0MDBIMHoiLz48cGF0aCBkPSJNMCAzMDBoODAwdjEwMEgweiIgZmlsbD0iIzAwNTZiMyIvPjxjaXJjbGUgY3g9IjQwMCIgY3k9IjE1MCIgcj0iODAiIGZpbGw9IiNmZmYiIG9wYWNpdHk9Ii44Ii8+PC9zdmc+';

const forestImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMwMDY2MDAiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMwMDk5MDAiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cGF0aCBmaWxsPSJ1cmwoI2EpIiBkPSJNMCAwaDgwMHY0MDBIMHoiLz48cGF0aCBkPSJNMCAzMDBoODAwdjEwMEgweiIgZmlsbD0iIzAwMzMwMCIvPjxwYXRoIGQ9Ik0zNTAgMjAwbDUwLTEwMCA1MCAxMDB6TTI1MCAyMDBsMzAtNjAgMzAgNjB6TTUwMCAyMDBsMzAtNjAgMzAgNjB6IiBmaWxsPSIjMDAzMzAwIi8+PC9zdmc+';

// 预设一个默认灵感，避免初始状态为空
const randomInspiration = ref({
  id: 'b1',
  title: '城市的夜晚',
  content: '城市的夜晚，霓虹灯闪烁，人们匆匆而过，每个人都有自己的故事和目的地。',
  type: 'text',
  tags: ['城市', '夜晚', '观察'],
  author: '都市观察者',
  anonymous: false
})

// 预设一些已保存的灵感，让界面不为空
const savedInspirations = ref([
  {
    title: '城市的夜晚',
    type: 'text',
    tags: ['城市', '夜晚', '观察']
  },
  {
    title: '森林小径',
    type: 'image',
    tags: ['自然', '森林', '小径']
  },
  {
    title: '关于创造力的思考',
    type: 'text',
    tags: ['创造力', '思考', '灵感']
  }
])

// 灵感库
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
    content: sunsetImage,
    type: 'image',
    tags: ['自然', '日落', '海洋'],
    author: '自然摄影师',
    anonymous: false
  },
  {
    id: 'b3',
    title: '雨声',
    content: rainAudioPath,
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
  },
  {
    id: 'b5',
    title: '森林小径',
    content: forestImage,
    type: 'image',
    tags: ['自然', '森林', '小径'],
    author: '徒步爱好者',
    anonymous: false
  }
]

function getTypeLabel(type) {
  const types = {
    text: '文字',
    image: '图片',
    audio: '音频'
  }
  return types[type] || '未知'
}

function getTypeIcon(type) {
  const icons = {
    text: 'text_fields',
    image: 'image',
    audio: 'music_note'
  }
  return icons[type] || 'note'
}

function openBox() {
  // 随机选择一个灵感
  const randomIndex = Math.floor(Math.random() * inspirationPool.length)
  randomInspiration.value = inspirationPool[randomIndex]
  boxOpened.value = true
  
  // 生成新的匹配度
  matchPercentage.value = Math.floor(Math.random() * 30) + 70
}

function saveInspiration() {
  if (randomInspiration.value) {
    // 将灵感保存到用户的灵感库
    const savedInspiration = {
      title: randomInspiration.value.title,
      content: randomInspiration.value.content,
      type: randomInspiration.value.type,
      tags: [...randomInspiration.value.tags, '盲盒'],
      transcript: randomInspiration.value.transcript || ''
    }
    
    inspirationStore.addInspiration(savedInspiration)
    
    // 添加到已保存列表
    savedInspirations.value.unshift({
      title: randomInspiration.value.title,
      type: randomInspiration.value.type,
      tags: randomInspiration.value.tags
    })
    
    // 触发保存事件
    emit('save', savedInspiration)
    
    alert('已保存到你的灵感库')
  }
}
</script>

<style scoped>
.blindbox-content {
  padding: var(--spacing-md) 0;
}

.section-description {
  color: var(--light-text-color);
  margin-bottom: var(--spacing-lg);
}

.blindbox-container {
  background-color: white;
  border-radius: var(--border-radius-md);
  box-shadow: 0 4px 12px var(--shadow-color);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: all var(--transition-speed);
}

.blindbox-closed {
  text-align: center;
  cursor: pointer;
}

.box-image {
  width: 120px;
  height: 120px;
  margin: 0 auto var(--spacing-lg);
  background-color: var(--accent-color);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s infinite;
}

.box-image .material-icons {
  font-size: 60px;
  color: var(--primary-color);
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(92, 174, 149, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(92, 174, 149, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(92, 174, 149, 0);
  }
}

.blindbox-opened {
  width: 100%;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.result-header h3 {
  margin: 0;
}

.result-type {
  font-size: 0.8rem;
  padding: 2px 8px;
  border-radius: 12px;
}

.result-type.text {
  background-color: #E3F2FD;
  color: #1976D2;
}

.result-type.image {
  background-color: #E8F5E9;
  color: #388E3C;
}

.result-type.audio {
  background-color: #FFF3E0;
  color: #F57C00;
}

.result-content {
  margin-bottom: var(--spacing-md);
}

.text-content {
  white-space: pre-line;
}

.image-content img {
  width: 100%;
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
  margin-bottom: var(--spacing-lg);
}

.tag {
  font-size: 0.8rem;
  padding: 2px 8px;
  border-radius: 12px;
  background-color: var(--border-color);
  color: var(--text-color);
}

.result-actions {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
}

.user-match {
  display: flex;
  align-items: center;
  padding: var(--spacing-md);
  background-color: rgba(92, 174, 149, 0.1);
  border-radius: var(--border-radius-md);
  margin-bottom: var(--spacing-lg);
}

.match-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  margin-right: var(--spacing-md);
}

.match-info {
  flex: 1;
}

.match-info p {
  margin: 0;
}

.match-message {
  color: var(--primary-color);
  font-size: 0.9rem;
  margin-top: 4px;
}

.blindbox-history h3 {
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

.history-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: var(--spacing-sm);
}

.history-icon.text {
  background-color: #E3F2FD;
  color: #1976D2;
}

.history-icon.image {
  background-color: #E8F5E9;
  color: #388E3C;
}

.history-icon.audio {
  background-color: #FFF3E0;
  color: #F57C00;
}

.history-info {
  flex: 1;
}

.history-info h4 {
  margin: 0;
  font-size: 0.9rem;
  margin-bottom: 4px;
}

.history-tags {
  display: flex;
  gap: 4px;
}

.tag-mini {
  font-size: 0.7rem;
  padding: 1px 6px;
  border-radius: 10px;
  background-color: var(--border-color);
  color: var(--text-color);
}
</style>