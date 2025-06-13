# 灵感捕手 (Idea Catcher)

一个帮助用户捕捉、整理和分享创意灵感的应用。

## 功能特点

- 灵感收集：随时记录文字、图片和语音灵感
- 灵感墙：探索其他创作者的灵感，获取创意启发
- 灵感盲盒：随机获取来自其他创作者的灵感
- AI图像生成：通过描述生成创意图像
- 社交分享：将灵感分享到各大社交平台
- 语音功能：支持语音记录和播放灵感

## 技术栈

- 前端：Vue.js 3 + Vite
- 后端：Python Flask
- AI服务：集成图像生成和语音处理功能

## 安装与运行

### 前端

```bash
# 安装依赖
npm install

# 开发模式运行
npm run dev

# 构建生产版本
npm run build
```

### 后端

```bash
# 安装依赖
pip install -r requirements.txt

# 运行服务器
python app.py
```

## 项目结构

- `/src` - 前端源代码
  - `/api` - API服务接口
  - `/assets` - 静态资源
  - `/components` - Vue组件
  - `/router` - 路由配置
  - `/store` - 状态管理
  - `/views` - 页面视图
- `/public` - 公共资源
- `app.py` - Flask后端入口
- `ai_service.py` - AI服务接口

## 贡献指南

欢迎提交问题和功能请求。如果您想贡献代码，请先创建issue讨论您想要更改的内容。

## 许可证

[MIT](LICENSE)