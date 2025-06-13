<template>
  <div class="inspiration-card" :class="{ 'expanded': expanded }">
    <div class="card-header" @click="toggleExpand">
      <div class="card-title">
        <h3>{{ inspiration.title }}</h3>
        <span class="card-type" :class="inspiration.type">{{ typeLabel }}</span>
      </div>
      <div class="card-date">{{ formattedDate }}</div>
    </div>
    
    <div v-if="expanded" class="card-content">
      <!-- 文本内容 -->
      <div v-if="inspiration.type === 'text'" class="text-content">
        <p>{{ inspiration.content }}</p>
      </div>
      
      <!-- 图片内容 -->
      <div v-else-if="inspiration.type === 'image'" class="image-content">
        <img :src="inspiration.content" :alt="inspiration.title">
      </div>
      
      <!-- 语音内容 -->
      <div v-else-if="inspiration.type === 'audio'" class="audio-content">
        <audio controls>
          <source :src="inspiration.content" type="audio/mpeg">
          您的浏览器不支持音频播放
        </audio>
        <p v-if="inspiration.transcript">{{ inspiration.transcript }}</p>
      </div>
      
      <!-- 标签 -->
      <div class="card-tags">
        <span v-for="tag in inspiration.tags" :key="tag" class="tag">
          {{ tag }}
        </span>
      </div>
      
      <!-- 操作按钮 -->
      <div class="card-actions">
        <button class="btn-icon" @click.stop="editInspiration" title="编辑">
          <span class="material-icons">edit</span>
        </button>
        <button class="btn-icon" @click.stop="shareInspiration" title="分享">
          <span class="material-icons">share</span>
        </button>
        <button class="btn-icon" @click.stop="deleteInspiration" title="删除">
          <span class="material-icons">delete</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useInspirationStore } from '../../store/inspirationStore'

const props = defineProps({
  inspiration: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete', 'share'])

const inspirationStore = useInspirationStore()
const expanded = ref(false)

const typeLabel = computed(() => {
  const types = {
    text: '文字',
    image: '图片',
    audio: '语音'
  }
  return types[props.inspiration.type] || '未知'
})

const formattedDate = computed(() => {
  const date = new Date(props.inspiration.createdAt)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const toggleExpand = () => {
  expanded.value = !expanded.value
}

const editInspiration = () => {
  emit('edit', props.inspiration)
}

const shareInspiration = () => {
  emit('share', props.inspiration)
}

const deleteInspiration = () => {
  if (confirm('确定要删除这条灵感吗？')) {
    inspirationStore.deleteInspiration(props.inspiration.id)
    emit('delete', props.inspiration.id)
  }
}
</script>

<style scoped>
.inspiration-card {
  background-color: white;
  border-radius: var(--border-radius-md);
  box-shadow: 0 2px 8px var(--shadow-color);
  margin-bottom: var(--spacing-md);
  overflow: hidden;
  transition: all var(--transition-speed);
}

.inspiration-card:hover {
  box-shadow: 0 4px 12px var(--shadow-color);
  transform: translateY(-2px);
}

.card-header {
  padding: var(--spacing-md);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.card-title h3 {
  margin: 0;
  font-size: 1.1rem;
}

.card-type {
  font-size: 0.8rem;
  padding: 2px 8px;
  border-radius: 12px;
  background-color: var(--border-color);
}

.card-type.text {
  background-color: #E3F2FD;
  color: #1976D2;
}

.card-type.image {
  background-color: #E8F5E9;
  color: #388E3C;
}

.card-type.audio {
  background-color: #FFF3E0;
  color: #F57C00;
}

.card-date {
  font-size: 0.8rem;
  color: var(--light-text-color);
}

.card-content {
  padding: var(--spacing-md);
  border-top: 1px solid var(--border-color);
}

.text-content {
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

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-md);
}

.tag {
  background-color: var(--border-color);
  color: var(--text-color);
  font-size: 0.8rem;
  padding: 2px 8px;
  border-radius: 12px;
}

.card-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--light-text-color);
  transition: color var(--transition-speed);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
}

.btn-icon:hover {
  color: var(--primary-color);
  background-color: rgba(76, 175, 80, 0.1);
}

.material-icons {
  font-size: 20px;
}
</style>