import { defineStore } from 'pinia'

export const useInspirationStore = defineStore('inspiration', {
  state: () => ({
    inspirations: [],
    tags: [],
    currentInspiration: null,
    loading: false,
    error: null
  }),
  
  getters: {
    getInspirationById: (state) => (id) => {
      return state.inspirations.find(item => item.id === id)
    },
    
    getInspirationsByTag: (state) => (tag) => {
      return state.inspirations.filter(item => item.tags.includes(tag))
    },
    
    getInspirationsByDate: (state) => (date) => {
      return state.inspirations.filter(item => {
        const itemDate = new Date(item.createdAt).toDateString()
        const targetDate = new Date(date).toDateString()
        return itemDate === targetDate
      })
    },
    
    getTagsWithCount: (state) => {
      const tagCount = {}
      state.inspirations.forEach(inspiration => {
        inspiration.tags.forEach(tag => {
          if (tagCount[tag]) {
            tagCount[tag]++
          } else {
            tagCount[tag] = 1
          }
        })
      })
      
      return Object.keys(tagCount).map(tag => ({
        name: tag,
        count: tagCount[tag]
      }))
    }
  },
  
  actions: {
    async fetchInspirations() {
      this.loading = true
      try {
        // 尝试从本地存储获取数据
        let savedInspirations = []
        try {
          savedInspirations = JSON.parse(localStorage.getItem('inspirations') || '[]')
        } catch (e) {
          console.error('从本地存储读取失败', e)
        }
        
        // 如果本地存储没有数据，使用模拟数据
        if (!savedInspirations || savedInspirations.length === 0) {
          savedInspirations = [
            {
              id: '1',
              title: '早晨的灵感',
              content: '清晨阳光透过窗帘的感觉让我想到了新的设计灵感',
              type: 'text',
              tags: ['设计', '生活'],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            {
              id: '2',
              title: '项目构思',
              content: '一个帮助人们记录和整理灵感的应用',
              type: 'text',
              tags: ['工作', '项目'],
              createdAt: new Date(Date.now() - 86400000).toISOString(),
              updatedAt: new Date(Date.now() - 86400000).toISOString()
            },
            {
              id: '3',
              title: '灵感快拍 - 创意笔记',
              content: 'https://cdn.pixabay.com/photo/2015/01/09/11/08/startup-594090_1280.jpg',
              type: 'image',
              tags: ['灵感快拍', '创意'],
              createdAt: new Date(Date.now() - 172800000).toISOString(),
              updatedAt: new Date(Date.now() - 172800000).toISOString()
            }
          ]
          
          // 保存到本地存储
          localStorage.setItem('inspirations', JSON.stringify(savedInspirations))
        }
        
        this.inspirations = savedInspirations
        
        // 提取所有标签
        const allTags = new Set()
        savedInspirations.forEach(item => {
          if (item.tags && Array.isArray(item.tags)) {
            item.tags.forEach(tag => allTags.add(tag))
          }
        })
        
        this.tags = Array.from(allTags)
        this.loading = false
      } catch (error) {
        this.error = error.message
        this.loading = false
      }
    },
    
    async addInspiration(inspiration) {
      try {
        // 确保有内容
        if (!inspiration.content && inspiration.type === 'text') {
          inspiration.content = '这是一条灵感记录'
        }
        
        // 确保有标签
        if (!inspiration.tags || inspiration.tags.length === 0) {
          inspiration.tags = ['灵感']
        }
        
        // 添加ID和时间戳
        const newInspiration = {
          ...inspiration,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        // 将来会发送到API
        // 现在直接添加到本地状态
        this.inspirations.unshift(newInspiration)
        
        // 更新标签
        newInspiration.tags.forEach(tag => {
          if (!this.tags.includes(tag)) {
            this.tags.push(tag)
          }
        })
        
        // 保存到本地存储以确保持久化
        try {
          const savedInspirations = JSON.parse(localStorage.getItem('inspirations') || '[]')
          savedInspirations.unshift(newInspiration)
          localStorage.setItem('inspirations', JSON.stringify(savedInspirations))
        } catch (e) {
          console.error('保存到本地存储失败', e)
        }
        
        return newInspiration
      } catch (error) {
        this.error = error.message
        throw error
      }
    },
    
    async updateInspiration(id, updates) {
      try {
        const index = this.inspirations.findIndex(item => item.id === id)
        if (index !== -1) {
          const updatedInspiration = {
            ...this.inspirations[index],
            ...updates,
            updatedAt: new Date().toISOString()
          }
          
          // 将来会发送到API
          // 现在直接更新本地状态
          this.inspirations[index] = updatedInspiration
          
          // 更新标签
          if (updates.tags) {
            updates.tags.forEach(tag => {
              if (!this.tags.includes(tag)) {
                this.tags.push(tag)
              }
            })
          }
          
          return updatedInspiration
        }
        throw new Error('灵感不存在')
      } catch (error) {
        this.error = error.message
        throw error
      }
    },
    
    async deleteInspiration(id) {
      try {
        const index = this.inspirations.findIndex(item => item.id === id)
        if (index !== -1) {
          // 将来会发送到API
          // 现在直接从本地状态删除
          this.inspirations.splice(index, 1)
          return true
        }
        throw new Error('灵感不存在')
      } catch (error) {
        this.error = error.message
        throw error
      }
    },
    
    setCurrentInspiration(inspiration) {
      this.currentInspiration = inspiration
    }
  }
})