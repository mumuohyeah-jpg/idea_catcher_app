from flask import Blueprint, request, jsonify
from ai_service import AliCloudAIService
import os

# 创建蓝图
ai_bp = Blueprint('ai', __name__, url_prefix='/api/ai')

# 初始化AI服务
ai_service = AliCloudAIService()

@ai_bp.route('/generate-image', methods=['POST'])
def generate_image():
    """
    文生图API接口
    
    请求体:
    {
        "prompt": "图像描述",
        "size": "1024x1024" (可选)
    }
    """
    data = request.json
    
    if not data or 'prompt' not in data:
        return jsonify({"error": "缺少必要参数 'prompt'"}), 400
    
    prompt = data['prompt']
    size = data.get('size', '1024x1024')
    
    try:
        result = ai_service.generate_image(prompt, size)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@ai_bp.route('/health', methods=['GET'])
def health_check():
    """健康检查接口"""
    api_key = os.environ.get('DASHSCOPE_API_KEY')
    return jsonify({
        "status": "ok",
        "api_key_configured": bool(api_key)
    })