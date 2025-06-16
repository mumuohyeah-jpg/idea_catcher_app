<template>
  <div class="music-player">
    <h3>灵感音乐</h3>
    <p class="player-description">根据创作类型推荐的背景音乐</p>
    
    <div class="current-track">
      <div class="track-cover" :class="{ playing: isPlaying }">
        <img :src="currentTrack.cover" :alt="currentTrack.title">
        <div class="play-overlay" @click="togglePlay">
          <span class="material-icons">{{ isPlaying ? 'pause' : 'play_arrow' }}</span>
        </div>
      </div>
      
      <div class="track-info">
        <h4>{{ currentTrack.title }}</h4>
        <p>{{ currentTrack.artist }}</p>
        
        <div class="track-progress">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
          </div>
          <div class="time-info">
            <span>{{ formatTime(currentTime) }}</span>
            <span>{{ formatTime(currentTrack.duration) }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="player-controls">
      <button class="control-btn" @click="prevTrack">
        <span class="material-icons">skip_previous</span>
      </button>
      <button class="control-btn play-btn" @click="togglePlay" :disabled="isLoading">
        <span v-if="isLoading" class="spinner"></span>
        <span v-else class="material-icons">{{ isPlaying ? 'pause' : 'play_arrow' }}</span>
      </button>
      <button class="control-btn" @click="nextTrack">
        <span class="material-icons">skip_next</span>
      </button>
    </div>
    
    <div class="volume-control">
      <span class="material-icons volume-icon" @click="toggleMute">
        {{ volume > 0 ? (volume > 0.5 ? 'volume_up' : 'volume_down') : 'volume_off' }}
      </span>
      <input 
        type="range" 
        min="0" 
        max="1" 
        step="0.01" 
        v-model="volume" 
        @input="updateVolume"
        class="volume-slider"
      >
    </div>
    
    <div class="playlist">
      <h4>推荐播放列表</h4>
      <div class="playlist-items">
        <div 
          v-for="(track, index) in playlist" 
          :key="index"
          class="playlist-item"
          :class="{ active: currentTrackIndex === index }"
          @click="selectTrack(index)"
        >
          <div class="item-cover">
            <img :src="track.cover" :alt="track.title">
          </div>
          <div class="item-info">
            <h5>{{ track.title }}</h5>
            <p>{{ track.artist }}</p>
          </div>
          <div class="item-duration">{{ formatTime(track.duration) }}</div>
        </div>
      </div>
    </div>
    
    <audio 
      ref="audioPlayer"
      :src="currentTrack.url"
      @timeupdate="updateProgress"
      @ended="handleEnded"
    ></audio>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useUserStore } from '../../store/userStore'

const userStore = useUserStore()
const audioPlayer = ref(null)
const isPlaying = ref(false)
const currentTrackIndex = ref(0)
const currentTime = ref(0)
const isLoading = ref(false)
const volume = ref(0.7)
const retryCount = ref(0)
const maxRetries = 3

// 播放列表 - 使用更可靠的白噪音音频源
const playlist = [
  {
    title: '专注白噪音',
    artist: 'Focus Sounds',
    cover: 'https://cdn.pixabay.com/photo/2017/11/04/08/14/tree-2916763_1280.jpg',
    url: 'https://assets.mixkit.co/sfx/preview/mixkit-forest-stream-ambience-loop-542.mp3',
    backupUrl: 'https://cdn.freesound.org/previews/573/573577_5674468-lq.mp3',
    duration: 240
  },
  {
    title: '雨声白噪音',
    artist: 'Rain Sounds',
    cover: 'https://cdn.pixabay.com/photo/2018/01/14/23/12/nature-3082832_1280.jpg',
    url: 'https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-2393.mp3',
    backupUrl: 'https://cdn.freesound.org/previews/346/346562_5121236-lq.mp3',
    duration: 201
  },
  {
    title: '自然白噪音',
    artist: 'Nature Ambience',
    cover: 'https://cdn.pixabay.com/photo/2015/12/01/20/28/road-1072823_1280.jpg',
    url: 'https://assets.mixkit.co/sfx/preview/mixkit-calm-forest-ambience-loop-522.mp3',
    backupUrl: 'https://cdn.freesound.org/previews/459/459658_4766646-lq.mp3',
    duration: 180
  }
]

const currentTrack = computed(() => {
  return playlist[currentTrackIndex.value]
})

const progressPercentage = computed(() => {
  if (currentTrack.value.duration === 0) return 0
  return (currentTime.value / currentTrack.value.duration) * 100
})

function togglePlay() {
  if (!audioPlayer.value) return;
  
  if (isPlaying.value) {
    audioPlayer.value.pause()
    isPlaying.value = false
  } else {
    // 重置重试计数
    retryCount.value = 0
    // 显示加载状态
    isLoading.value = true
    
    // 先加载音频
    audioPlayer.value.load()
    // 然后尝试播放
    playAudio()
  }
}

function playAudio() {
  if (!audioPlayer.value) return;
  
  const playPromise = audioPlayer.value.play()
  
  if (playPromise !== undefined) {
    playPromise.then(() => {
      // 播放成功
      isPlaying.value = true
      isLoading.value = false
      retryCount.value = 0 // 重置重试计数
    }).catch(error => {
      console.error('播放失败:', error)
      
      // 如果是自动播放限制，显示提示
      if (error.name === 'NotAllowedError') {
        console.log('浏览器阻止了自动播放，请点击播放按钮手动播放')
        isLoading.value = false
        return
      }
      
      // 尝试使用备用URL
      if (retryCount.value === 0 && currentTrack.value.backupUrl) {
        console.log('尝试使用备用音频源')
        // 临时切换到备用URL
        const originalUrl = audioPlayer.value.src
        audioPlayer.value.src = currentTrack.value.backupUrl
        audioPlayer.value.load()
        retryCount.value++
        
        // 重试播放
        setTimeout(() => {
          playAudio()
        }, 1000)
      } else if (retryCount.value < maxRetries) {
        // 继续重试
        console.log(`重试播放 (${retryCount.value + 1}/${maxRetries})`)
        retryCount.value++
        
        // 延迟重试
        setTimeout(() => {
          audioPlayer.value.load()
          playAudio()
        }, 1000 * retryCount.value) // 逐渐增加重试间隔
      } else {
        // 重试次数用尽
        console.log('音频播放失败，请稍后再试')
        isPlaying.value = false
        isLoading.value = false
      }
    })
  } else {
    // 对于不支持Promise的旧浏览器
    isPlaying.value = true
    isLoading.value = false
  }
}

function prevTrack() {
  currentTrackIndex.value = (currentTrackIndex.value - 1 + playlist.length) % playlist.length
  resetAndPlay()
}

function nextTrack() {
  currentTrackIndex.value = (currentTrackIndex.value + 1) % playlist.length
  resetAndPlay()
}

function selectTrack(index) {
  if (currentTrackIndex.value === index) {
    togglePlay()
  } else {
    currentTrackIndex.value = index
    resetAndPlay()
  }
}

function resetAndPlay() {
  currentTime.value = 0
  retryCount.value = 0
  
  if (audioPlayer.value) {
    isLoading.value = true
    
    // 需要在下一个事件循环中播放，确保src已更新
    setTimeout(() => {
      if (audioPlayer.value) {
        audioPlayer.value.load() // 确保重新加载音频
        playAudio()
      }
    }, 50) // 增加延迟，确保音频加载
  }
}

function updateProgress() {
  if (audioPlayer.value) {
    currentTime.value = audioPlayer.value.currentTime
  }
}

function handleEnded() {
  nextTrack()
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}

// 监听当前曲目变化
watch(currentTrackIndex, () => {
  if (isPlaying.value) {
    resetAndPlay()
  }
})

// 音量控制函数
function updateVolume() {
  if (audioPlayer.value) {
    audioPlayer.value.volume = volume.value
  }
}

function toggleMute() {
  if (volume.value > 0) {
    // 存储当前音量以便恢复
    audioPlayer.value._previousVolume = volume.value
    volume.value = 0
  } else {
    // 恢复之前的音量或默认值
    volume.value = audioPlayer.value._previousVolume || 0.7
  }
  updateVolume()
}

onMounted(() => {
  // 初始化音频播放器
  setTimeout(() => {
    if (audioPlayer.value) {
      audioPlayer.value.volume = volume.value
      audioPlayer.value.preload = 'auto'
      audioPlayer.value.crossOrigin = 'anonymous' // 添加跨域支持
      
      // 添加音频加载事件监听
      const handleLoaded = () => {
        console.log('音频已加载')
        isLoading.value = false
      }
      audioPlayer.value.addEventListener('loadeddata', handleLoaded)
      
      // 添加音频加载中事件
      const handleLoading = () => {
        isLoading.value = true
      }
      audioPlayer.value.addEventListener('loadstart', handleLoading)
      
      // 添加音频错误事件监听
      const handleError = (e) => {
        console.error('音频加载错误:', e)
        isLoading.value = false
      }
      audioPlayer.value.addEventListener('error', handleError)
      
      // 存储事件处理函数引用，以便在组件卸载时正确移除
      audioPlayer.value._loadedHandler = handleLoaded
      audioPlayer.value._loadingHandler = handleLoading
      audioPlayer.value._errorHandler = handleError
      
      // 预加载第一首歌
      audioPlayer.value.load()
    }
  }, 500)
})

onUnmounted(() => {
  // 清理
  if (audioPlayer.value) {
    audioPlayer.value.pause()
    
    // 正确移除事件监听器
    if (audioPlayer.value._loadedHandler) {
      audioPlayer.value.removeEventListener('loadeddata', audioPlayer.value._loadedHandler)
    }
    
    if (audioPlayer.value._loadingHandler) {
      audioPlayer.value.removeEventListener('loadstart', audioPlayer.value._loadingHandler)
    }
    
    if (audioPlayer.value._errorHandler) {
      audioPlayer.value.removeEventListener('error', audioPlayer.value._errorHandler)
    }
    
    // 释放资源
    audioPlayer.value.src = ''
  }
})
</script>

<style scoped>
.music-player {
  background-color: white;
  border-radius: var(--border-radius-md);
  box-shadow: 0 2px 8px var(--shadow-color);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.player-description {
  color: var(--light-text-color);
  margin-bottom: var(--spacing-lg);
}

.current-track {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.track-cover {
  width: 120px;
  height: 120px;
  border-radius: var(--border-radius-md);
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
}

.track-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-speed);
}

.track-cover.playing img {
  transform: scale(1.05);
}

.play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity var(--transition-speed);
  cursor: pointer;
}

.play-overlay .material-icons {
  font-size: 48px;
  color: white;
}

.track-cover:hover .play-overlay {
  opacity: 1;
}

.track-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.track-info h4 {
  margin: 0;
  margin-bottom: 4px;
}

.track-info p {
  margin: 0;
  color: var(--light-text-color);
  margin-bottom: var(--spacing-md);
}

.track-progress {
  margin-top: auto;
}

.progress-bar {
  height: 4px;
  background-color: var(--border-color);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 4px;
}

.progress-fill {
  height: 100%;
  background-color: var(--primary-color);
  border-radius: 2px;
}

.time-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: var(--light-text-color);
}

.player-controls {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.control-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background-color: var(--border-color);
  color: var(--text-color);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-speed);
}

.control-btn:hover {
  background-color: var(--primary-color);
  color: white;
}

.play-btn {
  width: 48px;
  height: 48px;
  background-color: var(--primary-color);
  color: white;
  position: relative;
}

.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.volume-control {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
  padding: 0 var(--spacing-md);
}

.volume-icon {
  cursor: pointer;
  color: var(--primary-color);
}

.volume-slider {
  flex: 1;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: var(--border-color);
  border-radius: 2px;
  outline: none;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--primary-color);
  cursor: pointer;
}

.volume-slider::-moz-range-thumb {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--primary-color);
  cursor: pointer;
  border: none;
}

.playlist h4 {
  margin-bottom: var(--spacing-md);
}

.playlist-items {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.playlist-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: background-color var(--transition-speed);
}

.playlist-item:hover {
  background-color: rgba(92, 174, 149, 0.1);
}

.playlist-item.active {
  background-color: rgba(92, 174, 149, 0.2);
}

.item-cover {
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius-sm);
  overflow: hidden;
  margin-right: var(--spacing-sm);
}

.item-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  flex: 1;
}

.item-info h5 {
  margin: 0;
  font-size: 0.9rem;
  margin-bottom: 2px;
}

.item-info p {
  margin: 0;
  font-size: 0.8rem;
  color: var(--light-text-color);
}

.item-duration {
  font-size: 0.8rem;
  color: var(--light-text-color);
}
</style>