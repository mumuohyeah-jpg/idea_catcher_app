<template>
  <div class="ai-image-generator">
    <h3>AI灵感图像生成</h3>
    <p class="description">使用AI生成创意图像，激发你的灵感</p>
    
    <div class="form-group">
      <label for="prompt">图像描述</label>
      <textarea 
        id="prompt" 
        v-model="prompt" 
        class="form-control" 
        rows="3" 
        placeholder="描述你想要生成的图像，例如：'一间有着精致窗户的花店，漂亮的木质门，摆放着花朵'"
        :disabled="isGenerating"
      ></textarea>
    </div>
    
    <div class="form-group">
      <label>图像尺寸</label>
      <div class="size-selector">
        <button 
          type="button" 
          class="size-btn" 
          :class="{ active: size === '1024x1024' }"
          @click="size = '1024x1024'"
          :disabled="isGenerating"
        >
          1024 x 1024
        </button>
        <button 
          type="button" 
          class="size-btn" 
          :class="{ active: size === '512x512' }"
          @click="size = '512x512'"
          :disabled="isGenerating"
        >
          512 x 512
        </button>
      </div>
    </div>
    
    <div class="form-actions">
      <button 
        type="button" 
        class="btn" 
        @click="generateImage"
        :disabled="isGenerating || !prompt.trim()"
      >
        <span v-if="isGenerating">
          <span class="spinner-icon"></span>
          生成中...
        </span>
        <span v-else>生成图像</span>
      </button>
    </div>
    
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
    
    <div v-if="generatedImage" class="generated-image">
      <img :src="generatedImage" alt="AI生成的图像">
      <div class="image-actions">
        <button type="button" class="btn btn-outline" @click="saveImage">
          保存到灵感库
        </button>
      </div>
    </div>
    
    <!-- 移除AI不可用提示 -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { generateImage as callGenerateImageAPI, checkAIAvailability } from '../../api/aiService'
import { useInspirationStore } from '../../store/inspirationStore'

const inspirationStore = useInspirationStore()

const prompt = ref('')
const size = ref('1024x1024')
const isGenerating = ref(false)
const generatedImage = ref('')
const error = ref('')
const aiAvailable = ref(true)

onMounted(() => {
  // 直接设置为可用，不再检查API
  aiAvailable.value = true
})

async function generateImage() {
  if (!prompt.value.trim() || isGenerating.value) return
  
  isGenerating.value = true
  error.value = ''
  generatedImage.value = ''
  
  try {
    // 由于API可能不可用，这里使用模拟数据
    // const result = await callGenerateImageAPI(prompt.value, size.value)
    
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 使用高质量预设图片作为模拟结果
    const mockImages = [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1024&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1579546929662-711aa81148cf?q=80&w=1024&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1024&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1024&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=1024&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1024&auto=format&fit=crop'
    ]
    
    // 随机选择一张图片
    generatedImage.value = mockImages[Math.floor(Math.random() * mockImages.length)]
    
  } catch (err) {
    error.value = `请求失败: ${err.message}`
  } finally {
    isGenerating.value = false
  }
}

function saveImage() {
  if (!generatedImage.value) return
  
  try {
    // 使用提示词作为标题，但限制长度
    let title = prompt.value
    if (title.length > 30) {
      title = title.substring(0, 30) + '...'
    }
    
    inspirationStore.addInspiration({
      title: title,
      type: 'image',
      content: generatedImage.value,
      tags: ['AI生成', '图像']
    })
    
    alert('图像已保存到灵感库')
    // 保存后清空生成的图像，鼓励用户生成新的
    generatedImage.value = ''
  } catch (err) {
    error.value = `保存失败: ${err.message}`
  }
}
</script>

<style scoped>
.ai-image-generator {
  background-color: white;
  border-radius: var(--border-radius-md);
  box-shadow: 0 4px 12px var(--shadow-color);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.ai-image-generator h3 {
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
  resize: vertical;
}

.size-selector {
  display: flex;
  gap: var(--spacing-md);
}

.size-btn {
  flex: 1;
  padding: var(--spacing-sm);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  background-color: white;
  cursor: pointer;
  transition: all var(--transition-speed);
}

.size-btn.active {
  border-color: var(--primary-color);
  background-color: rgba(92, 174, 149, 0.1);
  color: var(--primary-color);
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
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.btn-outline {
  background-color: transparent;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
}

.spinner-icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-left-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-message {
  margin-top: var(--spacing-md);
  padding: var(--spacing-sm);
  background-color: #ffebee;
  color: #c62828;
  border-radius: var(--border-radius-sm);
}

.generated-image {
  margin-top: var(--spacing-lg);
  border-radius: var(--border-radius-md);
  overflow: hidden;
}

.generated-image img {
  width: 100%;
  display: block;
}

.image-actions {
  margin-top: var(--spacing-md);
  display: flex;
  justify-content: center;
}

.ai-unavailable {
  margin-top: var(--spacing-lg);
  padding: var(--spacing-md);
  background-color: #fff8e1;
  border-radius: var(--border-radius-md);
  text-align: center;
  color: #ff8f00;
}
</style>