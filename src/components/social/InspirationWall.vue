<template>
  <div class="inspiration-wall">
    <h2>灵感墙</h2>
    <p class="wall-description">探索其他创作者的灵感，或分享你自己的创意</p>
    
    <div class="wall-filters">
      <div class="filter-tabs">
        <button 
          class="filter-tab" 
          :class="{ active: activeFilter === 'all' }"
          @click="setFilter('all')"
        >
          全部
        </button>
        <button 
          class="filter-tab" 
          :class="{ active: activeFilter === 'popular' }"
          @click="setFilter('popular')"
        >
          热门
        </button>
        <button 
          class="filter-tab" 
          :class="{ active: activeFilter === 'latest' }"
          @click="setFilter('latest')"
        >
          最新
        </button>
      </div>
      
      <div class="search-box">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="搜索灵感..." 
          class="form-control"
        >
        <button class="search-btn">
          <span class="material-icons">search</span>
        </button>
      </div>
    </div>
    
    <div class="wall-grid">
      <div 
        v-for="post in filteredPosts" 
        :key="post.id"
        class="wall-card"
        @click="viewPost(post)"
      >
        <!-- 图片类型 -->
        <div v-if="post.type === 'image'" class="wall-card-image">
          <img :src="post.content" :alt="post.title">
        </div>
        
        <!-- 文字类型 -->
        <div v-else-if="post.type === 'text'" class="wall-card-text">
          <p>{{ truncateText(post.content) }}</p>
        </div>
        
        <!-- 音频类型 -->
        <div v-else-if="post.type === 'audio'" class="wall-card-audio">
          <div class="audio-icon">
            <span class="material-icons">music_note</span>
          </div>
          <p>{{ post.transcript ? truncateText(post.transcript) : '语音灵感' }}</p>
          <audio controls class="mini-player">
            <source :src="post.content" type="audio/mpeg">
            您的浏览器不支持音频播放
          </audio>
        </div>
        
        <div class="wall-card-info">
          <h3>{{ post.title }}</h3>
          
          <div class="wall-card-tags">
            <span v-for="tag in post.tags.slice(0, 3)" :key="tag" class="tag">{{ tag }}</span>
          </div>
          
          <div class="wall-card-meta">
            <div class="wall-card-author">
              <div class="author-avatar">{{ post.author.charAt(0) }}</div>
              <span>{{ post.anonymous ? '匿名用户' : post.author }}</span>
            </div>
            
            <div class="wall-card-stats">
              <span class="stat" @click.stop="likePost(post)">
                <span class="material-icons" :class="{ 'liked': post.isLiked }">{{ post.isLiked ? 'favorite' : 'favorite_border' }}</span>
                {{ post.likes }}
              </span>
              <span class="stat" @click.stop="showComments(post)">
                <span class="material-icons">comment</span>
                {{ post.comments }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="loading" class="loading-indicator">
      <div class="spinner"></div>
      <p>加载中...</p>
    </div>
    
    <div v-if="!loading && filteredPosts.length === 0" class="no-results">
      <p>没有找到匹配的灵感</p>
    </div>
    
    <button class="share-btn" @click="shareInspiration">
      <span class="material-icons">add</span>
      分享灵感
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../store/userStore'
import { useInspirationStore } from '../../store/inspirationStore'

const router = useRouter()
const userStore = useUserStore()
const inspirationStore = useInspirationStore()

const posts = ref([])
const loading = ref(true)
const activeFilter = ref('all')
const searchQuery = ref('')

const emit = defineEmits(['view-post'])

// 模拟数据
const mockPosts = [
  {
    id: '1',
    title: '城市街景灵感',
    content: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b',
    type: 'image',
    tags: ['城市', '摄影', '建筑'],
    author: '城市探索者',
    anonymous: false,
    likes: 42,
    comments: 7,
    isLiked: false,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: '2',
    title: '关于创意的思考',
    content: '创意不是凭空而来，而是对已有事物的重新组合和解读。当我们打破常规思维，从不同角度看待问题时，灵感就会不期而至。',
    type: 'text',
    tags: ['创意', '思考', '灵感'],
    author: '思想家',
    anonymous: false,
    likes: 18,
    comments: 5,
    isLiked: false,
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
  },
  {
    id: '3',
    title: '自然的声音',
    content: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_dab6e1ed0a.mp3?filename=birds-in-spring-116192.mp3',
    transcript: '清晨在森林中散步，听着鸟鸣和溪流的声音，感受大自然的宁静与活力。',
    type: 'audio',
    tags: ['自然', '声音', '冥想'],
    author: '自然爱好者',
    anonymous: true,
    likes: 24,
    comments: 3,
    isLiked: false,
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    title: '极简设计理念',
    content: '少即是多。在设计中，我们应该专注于必要的元素，去除一切多余的装饰。真正的美来自于功能与形式的完美结合。',
    type: 'text',
    tags: ['设计', '极简主义', '美学'],
    author: '设计师',
    anonymous: false,
    likes: 36,
    comments: 12,
    isLiked: false,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    id: '5',
    title: '色彩实验',
    content: 'https://images.unsplash.com/photo-1550859492-d5da9d8e45f3',
    type: 'image',
    tags: ['色彩', '艺术', '创意'],
    author: '色彩实验室',
    anonymous: false,
    likes: 51,
    comments: 8,
    isLiked: false,
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString()
  },
  {
    id: '6',
    title: '旋律片段',
    content: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=inspiring-cinematic-ambient-116199.mp3',
    transcript: '这段旋律突然出现在我脑海中，可能会成为一首新歌的开头。',
    type: 'audio',
    tags: ['音乐', '创作', '旋律'],
    author: '音乐人',
    anonymous: false,
    likes: 29,
    comments: 6,
    isLiked: false,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString()
  }
]

const filteredPosts = computed(() => {
  let result = [...posts.value]
  
  // 应用过滤器
  if (activeFilter.value === 'popular') {
    result = result.sort((a, b) => b.likes - a.likes)
  } else if (activeFilter.value === 'latest') {
    result = result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }
  
  // 应用搜索
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(post => 
      post.title.toLowerCase().includes(query) || 
      post.tags.some(tag => tag.toLowerCase().includes(query)) ||
      (post.content && typeof post.content === 'string' && !post.content.startsWith('data:') && !post.content.startsWith('http') && post.content.toLowerCase().includes(query)) ||
      (post.transcript && post.transcript.toLowerCase().includes(query))
    )
  }
  
  return result
})

onMounted(() => {
  // 模拟API请求
  setTimeout(() => {
    posts.value = mockPosts
    loading.value = false
  }, 1000)
})

function setFilter(filter) {
  activeFilter.value = filter
}

function truncateText(text, length = 100) {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

function viewPost(post) {
  // 查看灵感详情并打开分享弹窗
  console.log('查看灵感:', post)
  emit('view-post', post)
}

function likePost(post) {
  // 点赞功能
  if (post.isLiked) {
    post.likes--
  } else {
    post.likes++
    // 添加积分
    userStore.addPoints(1, '点赞灵感')
  }
  post.isLiked = !post.isLiked
}

function showComments(post) {
  // 显示评论
  alert(`${post.title} 的评论功能即将上线`)
}

function shareInspiration() {
  // 打开用户分享灵感表单
  router.push({
    path: '/collect',
    query: { action: 'share' }
  })
}
</script>

<style scoped>
.inspiration-wall {
  position: relative;
  padding-bottom: 80px;
}

.wall-description {
  color: var(--light-text-color);
  margin-bottom: var(--spacing-lg);
}

.wall-filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.filter-tabs {
  display: flex;
  gap: var(--spacing-sm);
}

.filter-tab {
  background: none;
  border: none;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  font-weight: 500;
  transition: all var(--transition-speed);
}

.filter-tab.active {
  background-color: var(--primary-color);
  color: white;
}

.search-box {
  position: relative;
  width: 250px;
}

.search-btn {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  background: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  color: var(--light-text-color);
}

.wall-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}

.wall-card {
  background-color: white;
  border-radius: var(--border-radius-md);
  box-shadow: 0 2px 8px var(--shadow-color);
  overflow: hidden;
  cursor: pointer;
  transition: transform var(--transition-speed), box-shadow var(--transition-speed);
}

.wall-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px var(--shadow-color);
}

.wall-card-image {
  height: 180px;
  overflow: hidden;
}

.wall-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-speed);
}

.wall-card:hover .wall-card-image img {
  transform: scale(1.05);
}

.wall-card-text {
  height: 180px;
  padding: var(--spacing-md);
  background-color: #f9f9f9;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-style: italic;
  color: var(--text-color);
}

.wall-card-audio {
  height: 180px;
  padding: var(--spacing-md);
  background-color: #f0f7ff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.audio-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #e1effe;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-md);
}

.audio-icon .material-icons {
  font-size: 32px;
  color: #2196f3;
}

.mini-player {
  width: 100%;
  height: 30px;
  margin-top: var(--spacing-sm);
}

.wall-card-info {
  padding: var(--spacing-md);
}

.wall-card-info h3 {
  margin: 0 0 var(--spacing-sm);
  font-size: 1.1rem;
}

.wall-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: var(--spacing-sm);
}

.tag {
  font-size: 0.8rem;
  padding: 2px 8px;
  border-radius: 12px;
  background-color: var(--border-color);
  color: var(--text-color);
}

.wall-card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--spacing-sm);
}

.wall-card-author {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: 0.9rem;
  color: var(--light-text-color);
}

.author-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
}

.wall-card-stats {
  display: flex;
  gap: var(--spacing-sm);
}

.stat {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 0.8rem;
  color: var(--light-text-color);
  cursor: pointer;
  padding: 4px;
  border-radius: var(--border-radius-sm);
  transition: all var(--transition-speed);
}

.stat:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.stat .material-icons {
  font-size: 16px;
}

.stat .material-icons.liked {
  color: #f44336;
}

.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl) 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(76, 175, 80, 0.1);
  border-left-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: var(--spacing-md);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.no-results {
  text-align: center;
  padding: var(--spacing-xl) 0;
  color: var(--light-text-color);
}

.share-btn {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 28px;
  padding: var(--spacing-sm) var(--spacing-lg);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  box-shadow: 0 4px 12px var(--shadow-color);
  cursor: pointer;
  transition: all var(--transition-speed);
  z-index: 10;
}

.share-btn:hover {
  background-color: var(--secondary-color);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px var(--shadow-color);
}

@media (max-width: 768px) {
  .wall-filters {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box {
    width: 100%;
  }
}
</style>