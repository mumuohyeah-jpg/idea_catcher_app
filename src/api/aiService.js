/**
 * 阿里云AI服务前端接口
 */

/**
 * 生成图像
 * @param {string} prompt - 图像描述提示词
 * @param {string} size - 图像尺寸，默认1024x1024
 * @returns {Promise} - 返回生成的图像数据
 */
export async function generateImage(prompt, size = '1024x1024') {
  try {
    const response = await fetch('/api/ai/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, size }),
    });
    
    if (!response.ok) {
      throw new Error(`请求失败: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('生成图像失败:', error);
    throw error;
  }
}

/**
 * 检查AI服务是否可用
 * @returns {Promise<boolean>} - 返回AI服务是否可用
 */
export async function checkAIAvailability() {
  try {
    const response = await fetch('/api/config');
    const data = await response.json();
    return data.aiEnabled;
  } catch (error) {
    console.error('检查AI服务可用性失败:', error);
    return false;
  }
}