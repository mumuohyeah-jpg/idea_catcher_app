import os
from flask import Flask, send_from_directory, jsonify
from ai_routes import ai_bp

# 检查环境变量
if 'DASHSCOPE_API_KEY' not in os.environ:
    print("警告: DASHSCOPE_API_KEY 环境变量未设置，AI功能将不可用")
    print("请设置: export DASHSCOPE_API_KEY='sk-ab5f589083bf4996b63384048400d835'")

app = Flask(__name__, static_folder='dist', static_url_path='')

# 注册AI蓝图
app.register_blueprint(ai_bp)

@app.route('/')
def index():
    return send_from_directory('dist', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('dist', path)

@app.errorhandler(404)
def not_found(e):
    return send_from_directory('dist', 'index.html')

@app.route('/api/config')
def get_config():
    """返回前端配置信息"""
    return jsonify({
        "aiEnabled": 'DASHSCOPE_API_KEY' in os.environ
    })

if __name__ == '__main__':
    print("启动灵感捕手应用...")
    print("请访问: http://localhost:3000")
    
    if 'DASHSCOPE_API_KEY' in os.environ:
        print("阿里云AI功能已启用")
    else:
        print("阿里云AI功能未启用，请设置环境变量")
    
    app.run(host='0.0.0.0', port=3000)
