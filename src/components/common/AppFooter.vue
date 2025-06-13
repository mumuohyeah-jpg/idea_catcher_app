<template>
  <footer class="app-footer">
    <div class="container">
      <div class="footer-content">
        <p>&copy; {{ currentYear }} 灵感捕手 - 让创意永不流失</p>
        <div class="footer-links">
          <a href="#" @click.prevent="showAbout">关于我们</a>
          <a href="#" @click.prevent="showPrivacy">隐私政策</a>
          <a href="#" @click.prevent="showTerms">使用条款</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())

const showAbout = () => {
  // 实现显示关于我们的逻辑
  alert('关于灵感捕手：一款帮助年轻人收集、整理和分享创意灵感的应用。')
}

const showPrivacy = () => {
  // 实现显示隐私政策的逻辑
  alert('隐私政策将在这里显示')
}

const showTerms = () => {
  // 实现显示使用条款的逻辑
  alert('使用条款将在这里显示')
}
</script>

<style scoped>
.app-footer {
  background-color: white;
  border-top: 1px solid var(--border-color);
  padding: var(--spacing-lg) 0;
  margin-top: var(--spacing-xl);
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--light-text-color);
  font-size: 0.9rem;
}

.footer-links {
  display: flex;
  gap: var(--spacing-lg);
}

.footer-links a {
  color: var(--light-text-color);
  text-decoration: none;
  transition: color var(--transition-speed);
}

.footer-links a:hover {
  color: var(--primary-color);
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: var(--spacing-md);
    text-align: center;
  }
}
</style>