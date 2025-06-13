<template>
  <div class="create-page">
    <div class="container">
      <div class="page-header">
        <h1>灵感工坊</h1>
        <p>发展你的创意，将灵感转化为作品</p>
      </div>
      
      <div class="create-container">
        <!-- 当前灵感展示 -->
        <div v-if="currentInspiration" class="current-inspiration">
          <h3>当前灵感</h3>
          
          <div class="inspiration-card">
            <div class="inspiration-header">
              <h4>{{ currentInspiration.title }}</h4>
              <div class="inspiration-tags">
                <span v-for="tag in currentInspiration.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
            </div>
            
            <div class="inspiration-content">
              <!-- 文本内容 -->
              <div v-if="currentInspiration.type === 'text'" class="text-content">
                <p>{{ currentInspiration.content }}</p>
              </div>
              
              <!-- 图片内容 -->
              <div v-if="currentInspiration.type === 'image'" class="image-content">
                <img :src="currentInspiration.content" :alt="currentInspiration.title">
              </div>
              
              <!-- 语音内容 -->
              <div v-if="currentInspiration.type === 'audio'" class="audio-content">
                <p>{{ currentInspiration.content }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- AI图像生成器 -->
        <AIImageGenerator />
        
        <!-- 其他创意工具可以在这里添加 -->
        <div class="coming-soon">
          <h3>更多创意工具即将推出</h3>
          <p>我们正在开发更多AI驱动的创意工具，敬请期待！</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AIImageGenerator from '../components/inspiration/AIImageGenerator.vue'
import { useInspirationStore } from '../store/inspirationStore'

const inspirationStore = useInspirationStore()
const currentInspiration = ref(null)

onMounted(async () => {
  // 从本地存储获取当前灵感ID
  const currentId = localStorage.getItem('currentInspirationId')
  
  if (currentId) {
    // 确保灵感数据已加载
    if (inspirationStore.inspirations.length === 0) {
      await inspirationStore.fetchInspirations()
    }
    
    // 查找当前灵感
    currentInspiration.value = inspirationStore.getInspirationById(currentId)
    
    // 清除本地存储中的ID
    localStorage.removeItem('currentInspirationId')
  }
})
</script>

<style scoped>
.create-page {
  padding-bottom: var(--spacing-xl);
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
}

.create-container {
  max-width: 800px;
  margin: 0 auto;
}

.current-inspiration {
  background-color: white;
  border-radius: var(--border-radius-md);
  box-shadow: 0 4px 12px var(--shadow-color);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.current-inspiration h3 {
  color: var(--primary-color);
  margin-bottom: var(--spacing-md);
}

.inspiration-card {
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-md);
}

.inspiration-header {
  margin-bottom: var(--spacing-md);
}

.inspiration-header h4 {
  margin-bottom: var(--spacing-xs);
}

.inspiration-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.tag {
  background-color: var(--border-color);
  color: var(--text-color);
  font-size: 0.8rem;
  padding: 2px 8px;
  border-radius: 12px;
}

.text-content {
  white-space: pre-line;
}

.image-content img {
  max-width: 100%;
  border-radius: var(--border-radius-sm);
}

.audio-content {
  background-color: #f5f5f5;
  padding: var(--spacing-md);
  border-radius: var(--border-radius-sm);
}

.coming-soon {
  background-color: white;
  border-radius: var(--border-radius-md);
  box-shadow: 0 4px 12px var(--shadow-color);
  padding: var(--spacing-lg);
  text-align: center;
  margin-top: var(--spacing-lg);
}

.coming-soon h3 {
  color: var(--primary-color);
  margin-bottom: var(--spacing-sm);
}

.coming-soon p {
  color: var(--light-text-color);
}
</style>