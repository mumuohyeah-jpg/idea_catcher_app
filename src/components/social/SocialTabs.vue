<template>
  <div class="social-tabs">
    <div class="tab-header">
      <div 
        v-for="(tab, index) in tabs" 
        :key="tab.id"
        class="tab-item"
        :class="{ active: activeTab === index }"
        @click="setActiveTab(index)"
      >
        {{ tab.name }}
      </div>
      <div class="tab-indicator" :style="indicatorStyle"></div>
    </div>
    
    <div class="tab-content">
      <div v-if="activeTab === 0" class="tab-pane-item">
        <slot name="wall"></slot>
      </div>
      <div v-if="activeTab === 1" class="tab-pane-item">
        <slot name="blindbox"></slot>
      </div>
      <div v-if="activeTab === 2" class="tab-pane-item">
        <slot name="share"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  initialTab: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['change'])

const tabs = [
  { id: 'wall', name: '灵感墙' },
  { id: 'blindbox', name: '灵感盲盒' },
  { id: 'share', name: '社交分享' }
]

const activeTab = ref(props.initialTab)

const indicatorStyle = computed(() => {
  const width = 100 / tabs.length
  return {
    width: `${width}%`,
    left: `${activeTab.value * width}%`
  }
})

function setActiveTab(index) {
  activeTab.value = index
  emit('change', tabs[index].id)
}

onMounted(() => {
  emit('change', tabs[activeTab.value].id)
})
</script>

<style scoped>
.social-tabs {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.tab-header {
  display: flex;
  position: relative;
  background-color: white;
  border-radius: var(--border-radius-md) var(--border-radius-md) 0 0;
  overflow: hidden;
  box-shadow: 0 2px 4px var(--shadow-color);
  margin-bottom: var(--spacing-md);
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: var(--spacing-md);
  cursor: pointer;
  font-weight: 500;
  transition: color var(--transition-speed);
  z-index: 2;
}

.tab-item.active {
  color: var(--primary-color);
}

.tab-indicator {
  position: absolute;
  bottom: 0;
  height: 3px;
  background-color: var(--primary-color);
  transition: all var(--transition-speed);
  z-index: 1;
}

.tab-content {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.tab-pane-item {
  height: 100%;
  overflow-y: auto;
  padding: 0 var(--spacing-xs);
}
</style>