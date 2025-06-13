<template>
  <div class="profile-page">
    <div class="container">
      <div class="page-header">
        <h1>个人中心</h1>
        <p>管理你的个人设置和成就</p>
      </div>
      
      <div class="profile-grid">
        <div class="profile-main">
          <ProfileSettings />
        </div>
        <div class="profile-sidebar">
          <UserPoints />
          <MusicPlayer />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ProfileSettings from '../components/user/ProfileSettings.vue'
import UserPoints from '../components/user/UserPoints.vue'
import MusicPlayer from '../components/user/MusicPlayer.vue'
</script>

<style scoped>
.profile-page {
  padding-bottom: var(--spacing-xl);
}

.page-header {
  margin-bottom: var(--spacing-lg);
}

.page-header h1 {
  color: var(--primary-color);
  margin-bottom: var(--spacing-xs);
}

.page-header p {
  color: var(--light-text-color);
}

.profile-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--spacing-lg);
}

@media (max-width: 768px) {
  .profile-grid {
    grid-template-columns: 1fr;
  }
}
</style>