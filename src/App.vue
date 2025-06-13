<template>
  <div class="app" :class="themeClass">
    <AppHeader v-if="showHeader" />
    <main class="main-content">
      <router-view />
    </main>
    <AppFooter v-if="showFooter" />
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from './store/userStore'
import AppHeader from './components/common/AppHeader.vue'
import AppFooter from './components/common/AppFooter.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 根据路由决定是否显示头部和底部
const showHeader = computed(() => {
  return !['Onboarding'].includes(route.name)
})

const showFooter = computed(() => {
  return !['Onboarding'].includes(route.name)
})

// 应用当前主题
const themeClass = computed(() => {
  const theme = userStore.preferences?.theme || 'default'
  return theme === 'default' ? '' : `theme-${theme}`
})

// 不再重定向到引导页
watch(() => route.name, (newRouteName) => {
  // 移除重定向逻辑，保留静态首页
})

onMounted(() => {
  // 加载用户偏好设置
  userStore.loadPreferences()
})
</script>

<style>
@import './assets/styles/main.css';
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-top: 60px;
}
</style>