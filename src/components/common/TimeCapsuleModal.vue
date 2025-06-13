<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal-container">
      <div class="modal-header">
        <h3>创建时光胶囊</h3>
        <button class="close-btn" @click="close">×</button>
      </div>
      
      <div class="modal-content">
        <div class="form-group">
          <label>选择灵感</label>
          <select v-model="capsuleData.inspirationId" class="form-control">
            <option v-for="inspiration in inspirations" :key="inspiration.id" :value="inspiration.id">
              {{ inspiration.title }}
            </option>
          </select>
        </div>
        
        <div class="form-group">
          <label>发送日期</label>
          <input type="date" v-model="capsuleData.date" class="form-control" :min="minDate">
        </div>
        
        <div class="form-group">
          <label>发送方式</label>
          <div class="capsule-methods">
            <label class="method-option">
              <input type="radio" v-model="capsuleData.method" value="email">
              <span>邮件提醒</span>
            </label>
            <label class="method-option">
              <input type="radio" v-model="capsuleData.method" value="notification">
              <span>应用通知</span>
            </label>
          </div>
        </div>
        
        <div class="form-group" v-if="capsuleData.method === 'email'">
          <label>邮箱地址</label>
          <input type="email" v-model="capsuleData.email" class="form-control" placeholder="输入你的邮箱">
        </div>
        
        <div class="form-group">
          <label>附加留言</label>
          <textarea v-model="capsuleData.message" class="form-control" rows="3" placeholder="给未来的自己留言..."></textarea>
        </div>
      </div>
      
      <div class="modal-footer">
        <button class="btn btn-outline" @click="close">取消</button>
        <button class="btn" @click="save">创建胶囊</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useInspirationStore } from '../../store/inspirationStore'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'save'])

const inspirationStore = useInspirationStore()

const capsuleData = ref({
  inspirationId: '',
  date: '',
  method: 'notification',
  email: '',
  message: ''
})

const inspirations = computed(() => {
  return inspirationStore.inspirations
})

const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

function close() {
  emit('close')
}

function save() {
  emit('save', capsuleData.value)
  close()
}
</script>

<style scoped>
.modal-overlay {
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

.modal-container {
  background-color: white;
  border-radius: var(--border-radius-md);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
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

.modal-content {
  padding: var(--spacing-lg);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  border-top: 1px solid var(--border-color);
}

.capsule-methods {
  display: flex;
  gap: var(--spacing-md);
}

.method-option {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  cursor: pointer;
}
</style>