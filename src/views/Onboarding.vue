<template>
  <div class="onboarding">
    <div class="onboarding-container">
      <div class="onboarding-content">
        <div class="onboarding-header">
          <h1>欢迎使用灵感捕手</h1>
          <p>让我们一起开始你的创意之旅</p>
        </div>
        
        <div class="onboarding-steps">
          <div class="step-indicators">
            <div 
              v-for="(step, index) in steps" 
              :key="index"
              class="step-indicator"
              :class="{ active: currentStep === index, completed: index < currentStep }"
              @click="goToStep(index)"
            >
              <div class="indicator-circle">
                <span v-if="index < currentStep" class="material-icons">check</span>
                <span v-else>{{ index + 1 }}</span>
              </div>
              <span class="indicator-label">{{ step.title }}</span>
            </div>
          </div>
          
          <div class="step-content">
            <transition name="fade" mode="out-in">
              <div :key="currentStep" class="step">
                <div class="step-image" v-if="currentStepData.image">
                  <img :src="currentStepData.image" :alt="currentStepData.title">
                </div>
                
                <h2>{{ currentStepData.title }}</h2>
                <p>{{ currentStepData.description }}</p>
                
                <div v-if="currentStepData.component" class="step-component">
                  <component :is="currentStepData.component"></component>
                </div>
              </div>
            </transition>
            
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
                {{ isLastStep ? '开始使用' : '下一步' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store/userStore'

const router = useRouter()
const userStore = useUserStore()

const currentStep = ref(0)

const steps = [
  {
    title: '欢迎',
    description: '灵感捕手是一款专为创意人群设计的灵感管理工具，帮助你收集、整理和分享创意灵感。',
    image: ''
  },
  {
    title: '灵感收集',
    description: '你可以通过文字、语音或图片的方式记录灵感，确保不错过任何创意火花。支持手写、语音转文字和图片上传等多种方式。',
    image: ''
  },
  {
    title: '创作引擎',
    description: 'AI创作引擎可以帮助你将零散的灵感整合成完整的创意作品，激发更多可能性。你还可以与其他创作者协作，共同创作。',
    image: ''
  },
  {
    title: '灵感回顾',
    description: '灵感日历让你可以回顾过去的创意历程，时光胶囊功能会在未来的某一天提醒你回顾当初的灵感，激发新的创意。',
    image: ''
  },
  {
    title: '个性化体验',
    description: '你可以选择不同的主题风格，设置背景音乐，解锁成就系统，打造属于你的创意空间。',
    image: ''
  }
]

const currentStepData = computed(() => {
  return steps[currentStep.value] || { title: '', description: '' }
})

const isLastStep = computed(() => {
  return currentStep.value === steps.length - 1
})

function nextStep() {
  if (isLastStep.value) {
    completeOnboarding()
  } else {
    currentStep.value++
  }
}

function prevStep() {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

function goToStep(step) {
  if (step < currentStep.value) {
    currentStep.value = step
  }
}

function completeOnboarding() {
  userStore.completeOnboarding()
  router.push('/collect')
}
</script>

<style scoped>
.onboarding {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  padding: var(--spacing-lg);
}

.onboarding-container {
  background-color: white;
  border-radius: var(--border-radius-lg);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 900px;
  overflow: hidden;
}

.onboarding-content {
  padding: var(--spacing-xl);
}

.onboarding-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.onboarding-header h1 {
  color: var(--primary-color);
  margin-bottom: var(--spacing-sm);
}

.onboarding-steps {
  display: flex;
  gap: var(--spacing-xl);
}

.step-indicators {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.step-indicator {
  display: flex;
  align-items: center;
  cursor: pointer;
  opacity: 0.7;
  transition: all var(--transition-speed);
}

.step-indicator.active {
  opacity: 1;
}

.step-indicator.completed {
  opacity: 1;
}

.indicator-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: var(--spacing-sm);
  transition: all var(--transition-speed);
}

.step-indicator.active .indicator-circle {
  background-color: var(--primary-color);
  color: white;
}

.step-indicator.completed .indicator-circle {
  background-color: var(--primary-color);
  color: white;
}

.indicator-label {
  font-weight: 500;
}

.step-content {
  flex: 1;
}

.step {
  margin-bottom: var(--spacing-lg);
}

.step h2 {
  color: var(--primary-color);
  margin-bottom: var(--spacing-sm);
}

.step-image {
  margin-bottom: var(--spacing-md);
  border-radius: var(--border-radius-md);
  overflow: hidden;
}

.step-image img {
  width: 100%;
  height: auto;
}

.step-component {
  margin-top: var(--spacing-lg);
}

.step-navigation {
  display: flex;
  justify-content: space-between;
  margin-top: var(--spacing-xl);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .onboarding-steps {
    flex-direction: column;
  }
  
  .step-indicators {
    flex-direction: row;
    overflow-x: auto;
    padding-bottom: var(--spacing-sm);
  }
  
  .indicator-label {
    display: none;
  }
}
</style>