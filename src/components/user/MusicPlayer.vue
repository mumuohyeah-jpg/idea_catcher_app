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
      <button class="control-btn play-btn" @click="togglePlay">
        <span class="material-icons">{{ isPlaying ? 'pause' : 'play_arrow' }}</span>
      </button>
      <button class="control-btn" @click="nextTrack">
        <span class="material-icons">skip_next</span>
      </button>
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

// 播放列表 - 使用白噪音替代原有音乐，减少到3种
const playlist = [
  {
    title: '白噪音',
    artist: 'White Noise',
    cover: 'https://cdn.pixabay.com/photo/2017/11/04/08/14/tree-2916763_1280.jpg',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_1b2ffad42d.mp3',
    duration: 240
  },
  {
    title: '雨声白噪音',
    artist: 'Rain Sounds',
    cover: 'https://cdn.pixabay.com/photo/2018/01/14/23/12/nature-3082832_1280.jpg',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_270f49b9bf.mp3',
    duration: 201
  },
  {
    title: '自然白噪音',
    artist: 'Nature Ambience',
    cover: 'https://cdn.pixabay.com/photo/2015/12/01/20/28/road-1072823_1280.jpg',
    url: 'https://cdn.pixabay.com/download/audio/2021/11/25/audio_00f9eb1a48.mp3',
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
    // 先加载音频
    audioPlayer.value.load()
    // 然后尝试播放
    audioPlayer.value.play().catch(error => {
      console.error('播放失败:', error)
      isPlaying.value = false
      // 不显示弹窗，避免用户体验不佳
      console.log('音频播放失败，请稍后再试')
    })
    isPlaying.value = true
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
  if (isPlaying.value && audioPlayer.value) {
    // 需要在下一个事件循环中播放，确保src已更新
    setTimeout(() => {
      if (audioPlayer.value) {
        audioPlayer.value.play().catch(error => {
          console.error('播放失败:', error)
          isPlaying.value = false
        })
      }
    }, 0)
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

onMounted(() => {
  // 初始化音频播放器
  setTimeout(() => {
    if (audioPlayer.value) {
      audioPlayer.value.volume = 0.7
      audioPlayer.value.preload = 'auto'
      
      // 添加音频加载事件监听
      audioPlayer.value.addEventListener('loadeddata', () => {
        console.log('音频已加载')
      })
      
      // 添加音频错误事件监听
      audioPlayer.value.addEventListener('error', (e) => {
        console.error('音频加载错误:', e)
        // 不显示弹窗，避免用户体验不佳
        console.log('音频加载失败，请检查网络连接')
        isPlaying.value = false
      })
      
      // 预加载第一首歌
      audioPlayer.value.load()
    }
  }, 500)
})

onUnmounted(() => {
  // 清理
  if (audioPlayer.value) {
    audioPlayer.value.pause()
    audioPlayer.value.removeEventListener('loadeddata', () => {})
    audioPlayer.value.removeEventListener('error', () => {})
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