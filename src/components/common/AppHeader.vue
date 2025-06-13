<template>
  <header class="app-header">
    <div class="container flex items-center justify-between">
      <router-link to="/" class="logo">
        <div class="logo-container">
          <span class="logo-icon material-icons">eco</span>
          <h1>灵感捕手</h1>
        </div>
      </router-link>
      
      <nav class="main-nav" :class="{ 'active': menuOpen }">
        <ul class="nav-list flex">
          <li><router-link to="/" exact>首页</router-link></li>
          <li><router-link to="/collect">收集灵感</router-link></li>
          <li><router-link to="/create">灵感工坊</router-link></li>
          <li><router-link to="/calendar">灵感日历</router-link></li>
          <li><router-link to="/social">灵感分享</router-link></li>
          <li><router-link to="/profile">我的</router-link></li>
        </ul>
      </nav>
      
      <button class="menu-toggle" @click="toggleMenu" aria-label="菜单">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'

const menuOpen = ref(false)

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}
</script>

<style scoped>
.app-header {
  background-color: white;
  box-shadow: 0 2px 10px var(--shadow-color);
  position: sticky;
  top: 0;
  z-index: 100;
  padding: var(--spacing-sm) 0;
}

.logo {
  text-decoration: none;
  color: var(--primary-color);
}

.logo-container {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.logo-icon {
  font-size: 1.8rem;
  color: var(--primary-color);
}

.logo h1 {
  font-size: 1.5rem;
  font-weight: 600;
}

.nav-list {
  list-style: none;
  gap: var(--spacing-lg);
}

.nav-list a {
  text-decoration: none;
  color: var(--text-color);
  font-weight: 500;
  transition: all var(--transition-speed);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  position: relative;
}

.nav-list a:hover {
  color: var(--primary-color);
}

.nav-list a.router-link-active {
  color: var(--primary-color);
}

.nav-list a.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--primary-color);
  border-radius: 2px;
}

.menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 24px;
  height: 18px;
  background: transparent;
  border: none;
  cursor: pointer;
}

.menu-toggle span {
  display: block;
  height: 2px;
  width: 100%;
  background-color: var(--text-color);
  transition: all var(--transition-speed);
}

@media (max-width: 768px) {
  .menu-toggle {
    display: flex;
  }
  
  .main-nav {
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    background-color: white;
    box-shadow: 0 4px 8px var(--shadow-color);
    padding: var(--spacing-md);
    transform: translateY(-100%);
    opacity: 0;
    transition: all var(--transition-speed);
    pointer-events: none;
  }
  
  .main-nav.active {
    transform: translateY(0);
    opacity: 1;
    pointer-events: all;
  }
  
  .nav-list {
    flex-direction: column;
    align-items: center;
  }
}
</style>