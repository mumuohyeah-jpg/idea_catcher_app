<template>
  <div class="home">
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <div class="hero-icon">
            <span class="material-icons">eco</span>
          </div>
          <h1>捕捉每一刻灵感</h1>
          <p>从灵光乍现到创意成型，让你的想法不再流失</p>
          <div class="hero-actions">
            <router-link to="/collect" class="btn btn-lg">开始记录</router-link>
          </div>
        </div>
        <div class="hero-decoration">
          <div class="plant-decoration plant-1"></div>
          <div class="plant-decoration plant-2"></div>
          <div class="idea-bubble idea-1">
            <span class="material-icons">lightbulb</span>
          </div>
          <div class="idea-bubble idea-2">
            <span class="material-icons">psychology</span>
          </div>
        </div>
      </div>
    </section>
    
    <section class="features">
      <div class="container">
        <h2 class="section-title">核心功能</h2>
        
        <div class="features-grid">
          <div class="feature-card" @click="navigateTo('/collect')">
            <div class="feature-icon">
              <span class="material-icons">lightbulb</span>
            </div>
            <h3>收集灵感</h3>
            <p>文字、语音、图片，多种方式记录你的创意火花</p>
          </div>
          
          <div class="feature-card" @click="navigateTo('/create')">
            <div class="feature-icon">
              <span class="material-icons">psychology</span>
            </div>
            <h3>灵感工坊</h3>
            <p>AI辅助创作，将零散灵感整合为完整作品</p>
          </div>
          
          <div class="feature-card" @click="navigateTo('/calendar')">
            <div class="feature-icon">
              <span class="material-icons">calendar_today</span>
            </div>
            <h3>灵感日历</h3>
            <p>时间轴展示创意历程，定期回顾激发新思路</p>
          </div>
          
          <div class="feature-card" @click="navigateTo('/social')">
            <div class="feature-icon">
              <span class="material-icons">share</span>
            </div>
            <h3>灵感分享</h3>
            <p>匿名灵感墙，与创意社区交流碰撞</p>
          </div>
        </div>
      </div>
    </section>
    
    <section class="workflow">
      <div class="container">
        <h2 class="section-title">创意流程</h2>
        
        <div class="workflow-steps">
          <div class="workflow-step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3>收集灵感</h3>
              <p>随时随地记录灵感，不让任何创意溜走</p>
            </div>
          </div>
          
          <div class="workflow-connector"></div>
          
          <div class="workflow-step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3>灵感工坊</h3>
              <p>整合灵感，AI辅助将想法转化为作品</p>
            </div>
          </div>
          
          <div class="workflow-connector"></div>
          
          <div class="workflow-step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3>灵感日历</h3>
              <p>时间轴展示创意历程，定期回顾激发新思路</p>
            </div>
          </div>
          
          <div class="workflow-connector"></div>
          
          <div class="workflow-step">
            <div class="step-number">4</div>
            <div class="step-content">
              <h3>灵感分享</h3>
              <p>与创意社区交流，获取反馈与灵感</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <section class="cta">
      <div class="container">
        <div class="cta-content">
          <h2>准备好开始你的创意之旅了吗？</h2>
          <p>加入灵感捕手，让每一个灵光乍现都成为可能</p>
          <router-link to="/collect" class="btn btn-lg">立即开始</router-link>
        </div>
      </div>
    </section>
    

  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '../store/userStore'

const router = useRouter()
const userStore = useUserStore()

function navigateTo(path) {
  router.push(path)
}
</script>

<style scoped>
.home {
  margin-top: -60px; /* 抵消header的高度 */
}

.hero {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  padding: 120px 0 60px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero-icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-md);
}

.hero-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.plant-decoration {
  position: absolute;
  background-size: contain;
  background-repeat: no-repeat;
  opacity: 0.2;
}

.plant-1 {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 22a7.5 7.5 0 0 0 7.5-7.5c0-4.5-3-6.5-7.5-9.5-4.5 3-7.5 5-7.5 9.5A7.5 7.5 0 0 0 12 22z'/%3E%3Cpath d='M12 11.5v5'/%3E%3Cpath d='M9 13.5l3-2 3 2'/%3E%3Cpath d='M9 16.5l3-2 3 2'/%3E%3C/svg%3E");
  width: 200px;
  height: 200px;
  left: -50px;
  top: 20px;
  transform: rotate(-15deg);
}

.plant-2 {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M2 22a10 10 0 0 1 20 0'/%3E%3Cpath d='M12 6v16'/%3E%3Cpath d='M8 10a6 6 0 0 0 12 0'/%3E%3Cpath d='M4 4a10 10 0 0 1 20 0'/%3E%3C/svg%3E");
  width: 180px;
  height: 180px;
  right: -40px;
  bottom: -20px;
  transform: rotate(15deg);
}

.idea-bubble {
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.idea-1 {
  top: 100px;
  right: 15%;
  animation-delay: 0.5s;
}

.idea-2 {
  bottom: 80px;
  left: 20%;
  animation-delay: 1s;
}



.hero-content {
  max-width: 700px;
  margin: 0 auto;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: var(--spacing-md);
}

.hero p {
  font-size: 1.2rem;
  margin-bottom: var(--spacing-lg);
  opacity: 0.9;
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
}

.btn-lg {
  padding: var(--spacing-md) var(--spacing-xl);
  font-size: 1.1rem;
}

.section-title {
  text-align: center;
  margin-bottom: var(--spacing-xl);
  color: var(--primary-color);
  position: relative;
  padding-bottom: var(--spacing-md);
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background-color: var(--primary-color);
}

.features {
  padding: var(--spacing-xl) 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
}

.feature-card {
  background-color: white;
  border-radius: var(--border-radius-md);
  box-shadow: 0 4px 12px var(--shadow-color);
  padding: var(--spacing-lg);
  text-align: center;
  transition: all var(--transition-speed);
  cursor: pointer;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px var(--shadow-color);
}

.feature-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: rgba(76, 175, 80, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--spacing-md);
}

.feature-icon .material-icons {
  font-size: 32px;
  color: var(--primary-color);
}

.feature-card h3 {
  margin-bottom: var(--spacing-sm);
  color: var(--primary-color);
}

.workflow {
  padding: var(--spacing-xl) 0;
  background-color: #f9f9f9;
}

.workflow-steps {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.workflow-step {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 200px;
}

.step-number {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin-right: var(--spacing-md);
}

.workflow-connector {
  flex: 0.5;
  height: 2px;
  background-color: var(--primary-color);
  position: relative;
}

.workflow-connector::before {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-left: 8px solid var(--primary-color);
}

.cta {
  padding: var(--spacing-xl) 0;
  background: linear-gradient(135deg, var(--secondary-color), var(--primary-color));
  color: white;
  text-align: center;
}

.cta-content {
  max-width: 700px;
  margin: 0 auto;
}

.cta h2 {
  margin-bottom: var(--spacing-md);
}

.cta p {
  margin-bottom: var(--spacing-lg);
  opacity: 0.9;
}

.cta .btn {
  background-color: white;
  color: var(--primary-color);
}

.cta .btn:hover {
  background-color: rgba(255, 255, 255, 0.9);
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2rem;
  }
  
  .hero p {
    font-size: 1rem;
  }
  
  .hero-actions {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
  
  .workflow-steps {
    flex-direction: column;
    gap: var(--spacing-lg);
  }
  
  .workflow-connector {
    width: 2px;
    height: 24px;
    transform: rotate(90deg);
  }
}
</style>