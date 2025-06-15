<template>
  <div class="inspiration-combiner">
    <h3>灵感组合器</h3>
    <p class="description">选择一个或多个灵感，用自然语言组合创造新的创意</p>
    
    <div class="form-group">
      <label>选择灵感</label>
      <div class="inspiration-selector">
        <div 
          v-for="inspiration in inspirations" 
          :key="inspiration.id"
          class="inspiration-item"
          :class="{ selected: selectedInspirations.includes(inspiration.id) }"
          @click="toggleInspiration(inspiration.id)"
        >
          <div class="inspiration-type-icon">
            <span class="material-icons">{{ getTypeIcon(inspiration.type) }}</span>
          </div>
          <div class="inspiration-info">
            <h4>{{ inspiration.title }}</h4>
            <div class="inspiration-tags">
              <span v-for="tag in inspiration.tags.slice(0, 2)" :key="tag" class="tag">{{ tag }}</span>
              <span v-if="inspiration.tags.length > 2" class="tag">+{{ inspiration.tags.length - 2 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="form-group">
      <label for="combined-title">新灵感标题</label>
      <input 
        type="text" 
        id="combined-title" 
        v-model="combinedTitle" 
        class="form-control" 
        placeholder="为组合后的灵感起个标题"
      />
    </div>
    
    <div class="form-group">
      <label for="combined-content">组合内容</label>
      <textarea 
        id="combined-content" 
        v-model="combinedContent" 
        class="form-control" 
        rows="8" 
        placeholder="编辑组合后的灵感内容，添加你的思考和创意"
      ></textarea>
      <div class="form-hint">提示：系统已自动生成内容框架，请根据你的想法进行修改和完善</div>
    </div>
    
    <div class="form-group">
      <label>标签</label>
      <div class="tags-input">
        <div v-for="(tag, index) in combinedTags" :key="index" class="tag">
          {{ tag }}
          <span class="remove-tag" @click="removeTag(index)">×</span>
        </div>
        <input 
          type="text" 
          v-model="newTag" 
          @keyup.enter="addTag" 
          placeholder="添加标签" 
          class="tag-input"
        />
      </div>
    </div>
    
    <div class="form-actions">
      <button 
        type="button" 
        class="btn btn-optimize" 
        @click="optimizeContent"
        :disabled="!combinedContent.trim() || optimizing"
      >
        <span v-if="optimizing">
          <span class="spinner-icon"></span>
          优化中...
        </span>
        <span v-else>AI优化内容</span>
      </button>
      <button 
        type="button" 
        class="btn" 
        @click="combineInspirations"
        :disabled="selectedInspirations.length < 1 || !combinedTitle.trim()"
      >
        保存组合灵感
      </button>
    </div>
    
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
    
    <!-- 引导弹窗 -->
    <div v-if="showModal" class="guidance-modal">
      <div class="modal-content">
        <h4>灵感已保存！</h4>
        <p>你的组合灵感已成功保存，接下来你想要：</p>
        <div class="guidance-steps">
          <div class="guidance-step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h5>将灵感转化为图像</h5>
              <p>使用AI图像生成器，将你的灵感可视化</p>
            </div>
          </div>
          <div class="guidance-step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h5>查看灵感时间轴</h5>
              <p>在灵感日历中查看你的创意历程</p>
            </div>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn" @click="navigateToImageGenerator">
            前往图像生成器
          </button>
          <button class="btn btn-outline" @click="navigateToCalendar">
            前往灵感日历
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useInspirationStore } from '../../store/inspirationStore'

const inspirationStore = useInspirationStore()

const inspirations = computed(() => inspirationStore.inspirations)
const selectedInspirations = ref([])
const combinedTitle = ref('')
const combinedContent = ref('')
const combinedTags = ref(['组合灵感'])
const newTag = ref('')
const error = ref('')
const showModal = ref(false)
const savedInspirationId = ref('')
const optimizing = ref(false)

function getTypeIcon(type) {
  const icons = {
    text: 'text_fields',
    image: 'image',
    audio: 'mic'
  }
  return icons[type] || 'note'
}

function toggleInspiration(id) {
  const index = selectedInspirations.value.indexOf(id)
  if (index === -1) {
    selectedInspirations.value.push(id)
  } else {
    selectedInspirations.value.splice(index, 1)
  }
}

// 当选择的灵感改变时，自动更新组合内容
watch(selectedInspirations, (newVal) => {
  if (newVal.length > 0) {
    const selected = newVal.map(id => inspirationStore.getInspirationById(id))
    
    // 自动生成标题
    if (!combinedTitle.value.trim() && selected.length > 0) {
      combinedTitle.value = `组合灵感: ${selected.map(item => item.title.substring(0, 10)).join(' + ')}`
    }
    
    // 组合内容 - 自然语言形式
    if (selected.length === 1) {
      // 只有一个灵感时直接使用其内容
      const item = selected[0]
      if (item.type === 'text') {
        combinedContent.value = item.content
      } else if (item.type === 'image') {
        combinedContent.value = `这是一张关于"${item.title}"的图片灵感，它给我的启发是...`
      } else if (item.type === 'audio') {
        combinedContent.value = item.transcript ? 
          `从这段录音中，我听到了: "${item.transcript}"，这让我想到...` : 
          `这段录音让我想到...`
      }
    } else {
      // 多个灵感时，生成自然语言组合
      const textInspirations = selected.filter(item => item.type === 'text')
      const imageInspirations = selected.filter(item => item.type === 'image')
      const audioInspirations = selected.filter(item => item.type === 'audio')
      
      let combinedText = '通过组合不同的灵感，我得到了以下新的想法：\n\n'
      
      if (textInspirations.length > 0) {
        combinedText += textInspirations.map(item => {
          return `从"${item.title}"中，我了解到：${item.content.substring(0, 100)}${item.content.length > 100 ? '...' : ''}`
        }).join('\n\n')
      }
      
      if (imageInspirations.length > 0) {
        if (textInspirations.length > 0) combinedText += '\n\n'
        combinedText += `结合${imageInspirations.length}张图片灵感(${imageInspirations.map(item => `"${item.title}"`).join('、')})，我发现这些视觉元素与上述文字形成了有趣的联系。\n\n`
      }
      
      if (audioInspirations.length > 0) {
        const transcripts = audioInspirations.filter(item => item.transcript).map(item => item.transcript)
        if (transcripts.length > 0) {
          combinedText += `从录音中，我听到了：${transcripts.join('；')}，这些声音元素为整体灵感增添了新的维度。\n\n`
        } else {
          combinedText += `还有${audioInspirations.length}段录音灵感，它们的声音元素为整体创意增添了新的维度。\n\n`
        }
      }
      
      combinedText += '综合以上灵感，我得出的新创意是：\n\n[在这里描述你的新创意...]'
      
      combinedContent.value = combinedText
    }
    
    // 合并标签
    const allTags = new Set(['组合灵感'])
    selected.forEach(item => {
      item.tags.forEach(tag => allTags.add(tag))
    })
    combinedTags.value = Array.from(allTags)
  }
}, { deep: true })

function addTag() {
  if (newTag.value.trim() && !combinedTags.value.includes(newTag.value.trim())) {
    combinedTags.value.push(newTag.value.trim())
    newTag.value = ''
  }
}

function removeTag(index) {
  combinedTags.value.splice(index, 1)
}

function optimizeContent() {
  if (!combinedContent.value.trim()) {
    error.value = '请先生成或输入内容再优化'
    return
  }
  
  // 显示优化中状态
  optimizing.value = true
  const originalContent = combinedContent.value
  
  // 模拟AI优化过程
  setTimeout(() => {
    // 简单的优化逻辑，实际项目中可以接入真正的AI服务
    let optimized = originalContent
      .replace('[在这里描述你的新创意...]', '基于以上灵感，我构思了一个融合多元素的创意方案，既保留了原始灵感的精髓，又增添了新的视角和可能性。')
      .replace(/；/g, '。') // 替换分号为句号
      .split('\n\n') // 按段落分割
      .map(paragraph => {
        // 为段落添加更丰富的表达
        if (paragraph.includes('我得出的新创意���')) {
          return '综合以上灵感元素，我得出了一个令人兴奋的新创意：这个创意不仅融合了文字的深度、图像的直观性，还可能包含了声音带来的情感共鸣。通过这种多维度的结合，我相信这个创意有潜力发展成为一个完整的项目。'
        }
        return paragraph
      })
      .join('\n\n')
    
    // 添加引导性结尾
    if (!optimized.includes('下一步')) {
      optimized += '\n\n下一步，我可以将这个创意转化为视觉形象，或者进一步完善细节，使其更加具体和可行。'
    }
    
    combinedContent.value = optimized
    optimizing.value = false
  }, 1500)
}

function combineInspirations() {
  if (selectedInspirations.value.length < 1) {
    error.value = '请至少选择一个灵感进行组合'
    return
  }
  
  if (!combinedTitle.value.trim()) {
    error.value = '请为组合灵感添加标题'
    return
  }
  
  // 检查是否包含占位文本
  if (combinedContent.value.includes('[在这里描述你的新创意...]')) {
    if (!confirm('内容中仍包含占位文本，是否继续保存？')) {
      return
    }
  }
  
  try {
    // 保存组合后的灵感
    const newInspiration = inspirationStore.addInspiration({
      title: combinedTitle.value,
      content: combinedContent.value,
      type: 'text',
      tags: combinedTags.value
    })
    
    // 显示引导弹窗
    showGuidanceModal(newInspiration.id)
    
    // 重置表单
    selectedInspirations.value = []
    combinedTitle.value = ''
    combinedContent.value = ''
    combinedTags.value = ['组合灵感']
    error.value = ''
    
    return newInspiration
  } catch (err) {
    error.value = `保存失败: ${err.message}`
  }
}

function showGuidanceModal(inspirationId) {
  // 保存当前灵感ID到本地存储，以便在其他页面中使用
  localStorage.setItem('currentInspirationId', inspirationId)
  
  // 显示引导弹窗
  showModal.value = true
  savedInspirationId.value = inspirationId
}

function navigateToImageGenerator() {
  // 关闭弹窗
  showModal.value = false
  
  // 滚动到图像生成器
  setTimeout(() => {
    const imageGenerator = document.querySelector('.ai-image-generator')
    if (imageGenerator) {
      imageGenerator.scrollIntoView({ behavior: 'smooth' })
    }
  }, 100)
}

function navigateToCalendar() {
  // 导航到灵感日历页面
  window.location.href = '#/calendar'
}
</script>

<style scoped>
.inspiration-combiner {
  background-color: white;
  border-radius: var(--border-radius-md);
  box-shadow: 0 4px 12px var(--shadow-color);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.inspiration-combiner h3 {
  margin-bottom: var(--spacing-xs);
  color: var(--primary-color);
}

.description {
  color: var(--light-text-color);
  margin-bottom: var(--spacing-lg);
}

.form-group {
  margin-bottom: var(--spacing-md);
}

.form-group label {
  display: block;
  margin-bottom: var(--spacing-xs);
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: var(--spacing-sm);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  font-family: inherit;
}

textarea.form-control {
  resize: vertical;
}

.inspiration-selector {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
}

.inspiration-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-sm);
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  transition: background-color var(--transition-speed);
}

.inspiration-item:last-child {
  border-bottom: none;
}

.inspiration-item:hover {
  background-color: rgba(92, 174, 149, 0.05);
}

.inspiration-item.selected {
  background-color: rgba(92, 174, 149, 0.1);
  border-left: 3px solid var(--primary-color);
}

.inspiration-type-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: var(--spacing-sm);
  flex-shrink: 0;
}

.inspiration-type-icon .material-icons {
  color: var(--primary-color);
}

.inspiration-info {
  flex: 1;
  min-width: 0;
}

.inspiration-info h4 {
  margin: 0 0 var(--spacing-xs);
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.inspiration-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.tag {
  background-color: #f0f0f0;
  color: var(--text-color);
  font-size: 0.75rem;
  padding: 2px 6px;
  border-radius: 10px;
}

.tags-input {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
}

.tags-input .tag {
  display: flex;
  align-items: center;
  background-color: var(--accent-color);
  color: var(--primary-color);
}

.remove-tag {
  margin-left: 4px;
  cursor: pointer;
}

.tag-input {
  border: none;
  outline: none;
  flex: 1;
  min-width: 100px;
  padding: 2px;
}

.form-actions {
  margin-top: var(--spacing-lg);
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

.btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-message {
  margin-top: var(--spacing-md);
  padding: var(--spacing-sm);
  background-color: #ffebee;
  color: #c62828;
  border-radius: var(--border-radius-sm);
}

.form-hint {
  margin-top: var(--spacing-xs);
  font-size: 0.85rem;
  color: var(--light-text-color);
  font-style: italic;
}

/* 引导弹窗样式 */
.guidance-modal {
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
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  width: 90%;
  max-width: 500px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  text-align: center;
  animation: slideUp 0.3s ease;
}

.modal-content h4 {
  color: var(--primary-color);
  margin-bottom: var(--spacing-md);
  font-size: 1.3rem;
}

.guidance-steps {
  margin: var(--spacing-lg) 0;
}

.guidance-step {
  display: flex;
  align-items: flex-start;
  margin-bottom: var(--spacing-md);
  text-align: left;
}

.step-number {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: var(--spacing-md);
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-content h5 {
  margin: 0 0 var(--spacing-xs);
  color: var(--text-color);
}

.step-content p {
  margin: 0;
  color: var(--light-text-color);
  font-size: 0.9rem;
}

.modal-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
}

.btn-optimize {
  background-color: #8ECAAD;
  margin-right: var(--spacing-md);
}

.spinner-icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-left-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 4px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>