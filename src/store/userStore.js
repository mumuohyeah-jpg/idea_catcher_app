import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    name: '用户',
    avatar: '',
    email: '',
    preferences: {},
    achievements: [],
    onboardingCompleted: false,
    points: 320,
    level: 3,
    completedTasks: [],
    pointsHistory: []
  }),
  
  actions: {
    loadPreferences() {
      // 从本地存储加载用户偏好设置
      try {
        const savedPreferences = localStorage.getItem('userPreferences')
        if (savedPreferences) {
          this.preferences = JSON.parse(savedPreferences)
        }
      } catch (error) {
        console.error('Failed to load preferences:', error)
      }
    },
    updateProfile(profile) {
      this.name = profile.name || this.name
      this.avatar = profile.avatar || this.avatar
      this.email = profile.email || this.email
    },
    
    updatePreferences(preferences) {
      this.preferences = { ...this.preferences, ...preferences }
    },
    
    unlockAchievement(achievement) {
      if (!this.achievements.some(a => a.id === achievement.id)) {
        this.achievements.push({
          ...achievement,
          unlockedAt: new Date().toISOString()
        })
        
        // 解锁成就奖励积分
        this.addPoints(25, `解锁成就: ${achievement.name}`)
        
        return true
      }
      return false
    },
    
    completeOnboarding() {
      this.onboardingCompleted = true
      
      // 完成引导奖励积分
      this.addPoints(50, '完成新手引导')
    },
    
    addPoints(amount, reason) {
      this.points += amount
      
      // 添加积分记录
      const now = new Date()
      const timeStr = now.getHours() + ':' + now.getMinutes().toString().padStart(2, '0')
      
      this.pointsHistory.unshift({
        title: reason,
        points: amount,
        time: '今天 ' + timeStr
      })
      
      // 保持历史记录不超过20条
      if (this.pointsHistory.length > 20) {
        this.pointsHistory.pop()
      }
    },
    
    setLevel(level) {
      this.level = level
    },
    
    completeTask(taskId) {
      if (!this.completedTasks.includes(taskId)) {
        this.completedTasks.push(taskId)
      }
    }
  }
})