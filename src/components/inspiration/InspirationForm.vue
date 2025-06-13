<template>
  <div class="inspiration-form">
    <h2>{{ isEditing ? '编辑灵感' : '记录新灵感' }}</h2>
    
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="title">标题</label>
        <input 
          type="text" 
          id="title" 
          v-model="form.title" 
          class="form-control" 
          placeholder="给你的灵感起个标题"
          required
        >
      </div>
      
      <div class="form-group">
        <label>灵感类型</label>
        <div class="type-selector">
          <button 
            type="button" 
            class="type-btn" 
            :class="{ active: form.type === 'text' }"
            @click="switchType('text')"
          >
            <span class="material-icons">text_fields</span>
            <span>文字</span>
          </button>
          <button 
            type="button" 
            class="type-btn" 
            :class="{ active: form.type === 'image' }"
            @click="switchType('image')"
          >
            <span class="material-icons">image</span>
            <span>图片</span>
          </button>
          <button 
            type="button" 
            class="type-btn" 
            :class="{ active: form.type === 'audio' }"
            @click="switchType('audio')"
          >
            <span class="material-icons">mic</span>
            <span>语音</span>
          </button>
        </div>
      </div>
      
      <!-- 文字输入 -->
      <div v-if="form.type === 'text'" class="form-group">
        <label for="text-content">内容</label>
        <textarea 
          id="text-content" 
          v-model="form.content" 
          class="form-control" 
          rows="5" 
          placeholder="记录你的灵感..."
          required
        ></textarea>
        <div class="form-hint">支持 Markdown 格式</div>
      </div>
      
      <!-- 图片上传 -->
      <div v-if="form.type === 'image'" class="form-group">
        <label for="image-upload">上传图片</label>
        <div class="image-upload-container">
          <input 
            type="file" 
            id="image-upload" 
            @change="handleImageUpload" 
            accept="image/*"
            class="file-input"
          >
          <div class="upload-placeholder" v-if="!imagePreview">
            <span class="material-icons">cloud_upload</span>
            <span>点击或拖拽图片到此处</span>
          </div>
          <div class="image-preview" v-else>
            <img :src="imagePreview" alt="预览">
            <button type="button" class="remove-btn" @click="removeImage">
              <span class="material-icons">close</span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- 语音记录 -->
      <div v-if="form.type === 'audio'" class="form-group">
        <label>语音记录</label>
        <div class="audio-recorder">
          <button 
            type="button" 
            class="record-btn" 
            :class="{ 'recording': isRecording }"
            @click="toggleRecording"
          >
            <span class="material-icons">{{ isRecording ? 'stop' : 'mic' }}</span>
            <span>{{ isRecording ? '停止录音' : '开始录音' }}</span>
          </button>
          
          <div v-if="audioUrl" class="audio-preview">
            <audio controls :src="audioUrl"></audio>
            <button type="button" class="remove-btn" @click="removeAudio">
              <span class="material-icons">close</span>
            </button>
          </div>
          
          <div v-if="transcript" class="transcript">
            <h4>语音转文字</h4>
            <p>{{ transcript }}</p>
          </div>
        </div>
      </div>
      
      <!-- 标签 -->
      <div class="form-group">
        <label for="tags">标签</label>
        <div class="tags-input">
          <div class="tags-container">
            <span 
              v-for="(tag, index) in form.tags" 
              :key="index" 
              class="tag"
            >
              {{ tag }}
              <button type="button" class="tag-remove" @click="removeTag(index)">×</button>
            </span>
          </div>
          <input 
            type="text" 
            id="tags" 
            v-model="tagInput" 
            @keydown.enter.prevent="addTag"
            class="form-control" 
            placeholder="添加标签，按回车确认"
          >
        </div>
      </div>
      
      <div class="form-actions">
        <button type="button" class="btn btn-outline" @click="cancel">取消</button>
        <button type="submit" class="btn">{{ isEditing ? '保存修改' : '保存灵感' }}</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useInspirationStore } from '../../store/inspirationStore'

const props = defineProps({
  inspiration: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['saved', 'cancel'])

const inspirationStore = useInspirationStore()

const form = ref({
  title: '',
  type: 'text',
  content: '',
  tags: []
})

const tagInput = ref('')
const imagePreview = ref('')
const audioUrl = ref('')
const transcript = ref('')
const isRecording = ref(false)
let mediaRecorder = null

const isEditing = computed(() => !!props.inspiration)

// 如果是编辑模式，填充表单
onMounted(() => {
  if (props.inspiration) {
    form.value = {
      title: props.inspiration.title,
      type: props.inspiration.type,
      content: props.inspiration.content,
      tags: [...props.inspiration.tags]
    }
    
    if (props.inspiration.type === 'image') {
      imagePreview.value = props.inspiration.content
    } else if (props.inspiration.type === 'audio') {
      audioUrl.value = props.inspiration.content
      transcript.value = props.inspiration.transcript || ''
    }
  }
})

const addTag = () => {
  const tag = tagInput.value.trim()
  if (tag && !form.value.tags.includes(tag)) {
    form.value.tags.push(tag)
  }
  tagInput.value = ''
}

const removeTag = (index) => {
  form.value.tags.splice(index, 1)
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    // 使用本地文件预览
    const reader = new FileReader()
    
    reader.onload = (e) => {
      // 设置预览图片
      imagePreview.value = e.target.result
      form.value.content = e.target.result
      
      // 更新标题
      const now = new Date()
      const dateStr = `${now.getMonth() + 1}月${now.getDate()}日`
      form.value.title = `灵感快拍 - ${dateStr}`
    }
    
    // 读取文件为DataURL
    reader.readAsDataURL(file)
  }
}

const removeImage = () => {
  imagePreview.value = ''
  form.value.content = ''
}

// 语音记录功能 - 使用麦克风录制
const toggleRecording = () => {
  if (isRecording.value) {
    // 停止录音
    stopRecording()
  } else {
    // 开始录音
    startRecording()
  }
}

const startRecording = async () => {
  try {
    // 请求麦克风权限
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    
    // 创建MediaRecorder实例
    mediaRecorder = new MediaRecorder(stream)
    
    // 存储录音数据
    const audioChunks = []
    
    mediaRecorder.addEventListener('dataavailable', event => {
      audioChunks.push(event.data)
    })
    
    mediaRecorder.addEventListener('stop', () => {
      // 创建音频Blob
      const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' })
      
      // 创建可播放的URL
      audioUrl.value = URL.createObjectURL(audioBlob)
      
      // 设置表单内容为音频URL
      form.value.content = audioUrl.value
      
      // 设置默认标题
      const now = new Date()
      const dateStr = `${now.getMonth() + 1}月${now.getDate()}日`
      form.value.title = `语音灵感 - ${dateStr}`
      
      // 添加默认标签
      if (!form.value.tags.includes('语音')) {
        form.value.tags.push('语音')
      }
      
      // 模拟语音转文字结果
      transcript.value = '这是一条语音记录，点击保存后可以在灵感库中查看。'
      
      // 停止所有音轨
      stream.getTracks().forEach(track => track.stop())
      
      isRecording.value = false
    })
    
    // 开始录音
    mediaRecorder.start()
    isRecording.value = true
    
    // 设置录音时长限制（例如60秒）
    setTimeout(() => {
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop()
      }
    }, 60000)
  } catch (error) {
    console.error('无法访问麦克风', error)
    alert('无法访问麦克风，请确保已授予麦克风权限')
    isRecording.value = false
  }
}

const stopRecording = () => {
  // 停止录音
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    mediaRecorder.stop()
  }
  isRecording.value = false
}

const removeAudio = () => {
  audioUrl.value = ''
  transcript.value = ''
  form.value.content = ''
}

const submitForm = async () => {
  try {
    // 确保所有类型都有内容
    if (!form.value.content) {
      if (form.value.type === 'text') {
        form.value.content = '这是一条灵感记录'
      } else if (form.value.type === 'image') {
        form.value.content = '/images/default-image.jpg'
        imagePreview.value = form.value.content
      } else if (form.value.type === 'audio') {
        form.value.content = '这是一条语音记录'
        transcript.value = form.value.content
      }
    }
    
    // 确保有标题
    if (!form.value.title) {
      const now = new Date()
      const dateStr = `${now.getMonth() + 1}月${now.getDate()}日`
      form.value.title = `灵感记录 - ${dateStr}`
    }
    
    // 创建新灵感
    const newInspiration = await inspirationStore.addInspiration({
      title: form.value.title,
      type: form.value.type,
      content: form.value.content,
      tags: form.value.tags || ['灵感'],
      transcript: transcript.value || ''
    })
    
    // 提示保存成功
    alert('灵感保存成功！')
    
    emit('saved', newInspiration)
    
    // 重置表单
    resetForm()
  } catch (error) {
    console.error('保存灵感失败', error)
    alert('保存失败，请重试')
  }
}

const resetForm = () => {
  form.value = {
    title: '',
    type: 'text',
    content: '',
    tags: []
  }
  tagInput.value = ''
  imagePreview.value = ''
  audioUrl.value = ''
  transcript.value = ''
}

const cancel = () => {
  emit('cancel')
}
</script>

<style scoped>
.inspiration-form {
  background-color: white;
  border-radius: var(--border-radius-md);
  box-shadow: 0 4px 12px var(--shadow-color);
  padding: var(--spacing-lg);
}

.inspiration-form h2 {
  margin-bottom: var(--spacing-lg);
  color: var(--primary-color);
}

.type-selector {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.type-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  background-color: white;
  cursor: pointer;
  transition: all var(--transition-speed);
  flex: 1;
}

.type-btn.active {
  border-color: var(--primary-color);
  background-color: rgba(76, 175, 80, 0.1);
  color: var(--primary-color);
}

.type-btn .material-icons {
  font-size: 24px;
  margin-bottom: var(--spacing-xs);
}

.form-hint {
  font-size: 0.8rem;
  color: var(--light-text-color);
  margin-top: var(--spacing-xs);
}

.image-upload-container {
  position: relative;
  min-height: 200px;
  border: 2px dashed var(--border-color);
  border-radius: var(--border-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.file-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 2;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--light-text-color);
}

.upload-placeholder .material-icons {
  font-size: 48px;
  margin-bottom: var(--spacing-sm);
}

.image-preview {
  position: relative;
  width: 100%;
  height: 100%;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.remove-btn {
  position: absolute;
  top: var(--spacing-xs);
  right: var(--spacing-xs);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.audio-recorder {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.record-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border: none;
  border-radius: var(--border-radius-md);
  background-color: var(--primary-color);
  color: white;
  cursor: pointer;
  transition: all var(--transition-speed);
}

.record-btn.recording {
  background-color: #f44336;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(244, 67, 54, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(244, 67, 54, 0);
  }
}

.audio-preview {
  position: relative;
}

.audio-preview audio {
  width: 100%;
}

.transcript {
  background-color: #f5f5f5;
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
}

.transcript h4 {
  margin-bottom: var(--spacing-xs);
  color: var(--light-text-color);
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

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
}
</style>
// 添加类型切换函数
const switchType = (newType) => {
  // 如果正在录音，先停止录音
  if (isRecording.value && mediaRecorder && mediaRecorder.state === 'recording') {
    mediaRecorder.stop()
    isRecording.value = false
  }
  
  // 切换类型
  form.value.type = newType
}
// 监听类型变化
watch(() => form.value.type, (newType) => {
  // 当类型变化时，保留标题和标签，但清空内容
  if (newType === 'text') {
    form.value.content = ''
  } else if (newType === 'image') {
    imagePreview.value = ''
    form.value.content = ''
  } else if (newType === 'audio') {
    audioUrl.value = ''
    transcript.value = ''
    form.value.content = ''
  }
})