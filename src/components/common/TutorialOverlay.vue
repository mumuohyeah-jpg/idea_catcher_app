<template>
  <Teleport to="body">
    <div v-if="visible" class="tutorial-overlay" :class="{ 'active': visible }">
      <div class="tutorial-content">
        <button class="close-btn" @click="close">×</button>
        <h2>{{ title }}</h2>
        <div class="tutorial-step">
          <div class="step-indicator">
            <div 
              v-for="(step, index) in steps" 
              :key="index"
              class="step-dot"
              :class="{ 'active': currentStep === index }"
              @click="goToStep(index)"
            ></div>
          </div>
          
          <div class="step-content">
            <div class="step-image" v-if="currentStepData.image">
              <img :src="currentStepData.image" :alt="currentStepData.title">
            </div>
            <h3>{{ currentStepData.title }}</h3>
            <p>{{ currentStepData.description }}</p>
          </div>
          
          <div class="step-navigation">
            <button 
              v-if="currentStep > 0" 
              class="btn btn-outline"
              @click="prevStep"
            >
              上一步
            </button>
            <button 
              class="btn"
              @click="nextStep"
            >
              {{ isLastStep ? '完成' : '下一步' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: '功能教程'
  },
  steps: {
    type: Array,
    required: true
  },
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'complete'])

const currentStep = ref(0)

const currentStepData = computed(() => {
  return props.steps[currentStep.value] || { title: '', description: '' }
})

const isLastStep = computed(() => {
  return currentStep.value === props.steps.length - 1
})

const nextStep = () => {
  if (isLastStep.value) {
    emit('complete')
    close()
  } else {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const goToStep = (step) => {
  currentStep.value = step
}

const close = () => {
  emit('close')
}
</script>

<style scoped>
.tutorial-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all var(--transition-speed);
}

.tutorial-overlay.active {
  opacity: 1;
  visibility: visible;
}

.tutorial-content {
  background-color: white;
  border-radius: var(--border-radius-lg);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 600px;
  padding: var(--spacing-xl);
  position: relative;
}

.close-btn {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--light-text-color);
}

.tutorial-step {
  margin-top: var(--spacing-lg);
}

.step-indicator {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.step-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: var(--border-color);
  cursor: pointer;
  transition: all var(--transition-speed);
}

.step-dot.active {
  background-color: var(--primary-color);
  transform: scale(1.2);
}

.step-content {
  text-align: center;
  margin-bottom: var(--spacing-lg);
}

.step-image {
  margin-bottom: var(--spacing-md);
}

.step-image img {
  max-width: 100%;
  border-radius: var(--border-radius-md);
}

.step-navigation {
  display: flex;
  justify-content: space-between;
}

@media (max-width: 768px) {
  .tutorial-content {
    width: 95%;
    padding: var(--spacing-lg);
  }
}
</style>