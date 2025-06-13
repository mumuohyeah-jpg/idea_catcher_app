import os
import requests
import json

class AliCloudAIService:
    """阿里云AI服务接口类"""
    
    def __init__(self):
        self.api_key = os.environ.get('DASHSCOPE_API_KEY')
        if not self.api_key:
            raise ValueError("DASHSCOPE_API_KEY 环境变量未设置")
        
        self.image_synthesis_url = "https://dashscope.aliyuncs.com/api/v1/services/aigc/image-generation/image-synthesis"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
    
    def generate_image(self, prompt, size="1024x1024"):
        """
        根据文本提示生成图像
        
        参数:
            prompt (str): 图像生成提示词
            size (str): 图像尺寸，例如 "1024x1024"
            
        返回:
            dict: API响应结果
        """
        payload = {
            "input": {
                "prompt": prompt,
                "size": size
            }
        }
        
        try:
            response = requests.post(
                self.image_synthesis_url,
                headers=self.headers,
                data=json.dumps(payload)
            )
            
            response.raise_for_status()  # 如果请求失败则抛出异常
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"图像生成请求失败: {e}")
            return {"error": str(e)}