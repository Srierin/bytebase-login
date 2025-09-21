/**
 * GitHub OAuth 服务模块
 * 处理GitHub第三方登录相关功能
 * 更新版本：集成后端API调用
 */
// import.meta.env.VITE_API_BASE_URL ||
// 后端API配置
const API_BASE_URL =  'http://localhost:3001';

// 安全检测浏览器环境的辅助函数
const isBrowser = typeof window !== 'undefined';
const isLocalStorageAvailable = isBrowser && typeof localStorage !== 'undefined';
const isSessionStorageAvailable = isBrowser && typeof sessionStorage !== 'undefined';

// 获取基础URL（兼容浏览器和非浏览器环境）
const getBaseUrl = () => {
  if (isBrowser) {
    return window.location.origin;
  }
  // 非浏览器环境使用环境变量或默认值
  return process.env.FRONTEND_URL || 'http://localhost:5173';
};

// GitHub OAuth配置
// import.meta.env.VITE_GITHUB_CLIENT_ID ||
const GITHUB_CONFIG = {
  CLIENT_ID: 'Ov23lifytnOh5Z5A3i2E',
  REDIRECT_URI: `${getBaseUrl()}/auth/callback`,
  SCOPE: 'user:email read:user'
}


/**
 * 生成GitHub OAuth授权URL
 * @returns {string} 授权URL
 */
export const getGitHubAuthUrl = () => {
  const params = new URLSearchParams({
    client_id: GITHUB_CONFIG.CLIENT_ID,
    redirect_uri: GITHUB_CONFIG.REDIRECT_URI,
    scope: GITHUB_CONFIG.SCOPE,
    state: generateState(), // 防止CSRF攻击
    allow_signup: 'true'
  })
  
  return `https://github.com/login/oauth/authorize?${params.toString()}`
}

/**
 * 生成随机状态字符串，用于防止CSRF攻击
 * @returns {string} 随机状态字符串
 */
const generateState = () => {
  const state = Math.random().toString(36).substring(2, 15) + 
                Math.random().toString(36).substring(2, 15)
  
  if (isSessionStorageAvailable) {
    sessionStorage.setItem('github_oauth_state', state)
  }
  
  return state
}

/**
 * 验证OAuth回调状态
 * @param {string} state - 回调中的状态参数
 * @returns {boolean} 状态是否有效
 */
export const validateState = (state) => {
  let storedState = null;
  
  if (isSessionStorageAvailable) {
    storedState = sessionStorage.getItem('github_oauth_state')
    sessionStorage.removeItem('github_oauth_state')
  }
  
  return state === storedState
}

/**
 * 使用授权码通过后端API获取用户信息
 * @param {string} code - 授权码
 * @param {string} state - 状态参数
 * @returns {Promise<Object>} 用户信息和访问令牌
 */
export const exchangeCodeForToken = async (code, state) => {
  try {
    console.log('🔄 调用后端API交换访问令牌...')
    
    const response = await fetch(`${API_BASE_URL}/api/auth/github/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, state })
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.message || '后端API调用失败')
    }

    console.log('✅ 后端API调用成功')
    return data

  } catch (error) {
    console.error('❌ 后端API调用失败:', error.message)
    
    // 如果后端API不可用，回退到模拟模式
    if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
      console.warn('⚠️ 后端API不可用，使用模拟模式')
      return await getMockUserData()
    }
    
    throw error
  }
}

/**
 * 模拟用户数据（后端API不可用时的回退方案）
 * @returns {Promise<Object>} 模拟的用户数据
 */
const getMockUserData = async () => {
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return {
    success: true,
    user: {
      login: 'demo-user',
      id: 12345,
      name: 'Demo User',
      email: 'demo@example.com',
      avatar_url: 'https://avatars.githubusercontent.com/u/9919?s=200&v=4',
      html_url: 'https://github.com/demo-user',
      bio: 'This is a demo user for testing purposes',
      public_repos: 42,
      followers: 100,
      following: 50,
      created_at: '2023-01-01T00:00:00Z',
      provider: 'github'
    },
    access_token: 'mock_access_token_' + Date.now(),
    token_type: 'bearer'
  }
}

/**
 * 使用访问令牌获取用户信息
 * @param {string} token - 访问令牌
 * @returns {Promise<Object>} 用户信息
 */
export const getUserInfo = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.message || '获取用户信息失败')
    }

    return data.user

  } catch (error) {
    console.error('❌ 获取用户信息失败:', error.message)
    throw error
  }
}

/**
 * 完整的GitHub OAuth登录流程
 * @returns {Promise<Object>} 用户信息
 */
export const loginWithGitHub = async () => {
  try {
    // 非浏览器环境下直接抛出错误或返回null
    if (!isBrowser) {
      console.warn('⚠️ 非浏览器环境下不支持完整的GitHub登录流程')
      return null;
    }
    
    // 检查是否有授权码
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const state = urlParams.get('state')
    const error = urlParams.get('error')
    
    if (error) {
      throw new Error(`GitHub授权失败: ${error}`)
    }
    
    if (!code) {
      // 没有授权码，跳转到GitHub授权页面
      window.location.href = getGitHubAuthUrl()
      return null
    }

    // 验证状态参数
    if (!validateState(state)) {
      throw new Error('Invalid state parameter - 可能的CSRF攻击')
    }

    // 通过后端API交换访问令牌并获取用户信息
    const authData = await exchangeCodeForToken(code, state)
    
    
    // 清除URL参数
    window.history.replaceState({}, document.title, window.location.pathname)
    
    // 存储用户信息和token到localStorage
    if (isLocalStorageAvailable) {
      localStorage.setItem('github_token', authData.access_token)
      localStorage.setItem('user_info', JSON.stringify(authData.user))
    }
    
    return authData.user
  } catch (error) {
    console.error('❌ GitHub登录失败:', error.message)
    throw error
  }
}

/**
 * 退出登录
 */
export const logout = async () => {
  try {
    const token = getStoredToken()
    
    if (token) {
      // 调用后端注销API
      try {
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      } catch (error) {
        console.warn('⚠️ 后端注销API调用失败:', error.message)
      }
    }
    
    // 清除本地存储
    if (isLocalStorageAvailable) {
      localStorage.removeItem('github_token')
      localStorage.removeItem('user_info')
    }
    
    if (isSessionStorageAvailable) {
      sessionStorage.removeItem('github_oauth_state')
    }
    
  } catch (error) {
    console.error('❌ 注销失败:', error.message)
    // 即使后端调用失败，也要清除本地存储
    if (isLocalStorageAvailable) {
      localStorage.removeItem('github_token')
      localStorage.removeItem('user_info')
    }
    
    if (isSessionStorageAvailable) {
      sessionStorage.removeItem('github_oauth_state')
    }
  }
}

/**
 * 检查是否已登录
 * @returns {Object|null} 用户信息或null
 */
export const getCurrentUser = () => {
  try {
    if (!isLocalStorageAvailable) {
      return null;
    }
    
    const userInfo = localStorage.getItem('user_info')
    return userInfo ? JSON.parse(userInfo) : null
  } catch (error) {
    console.error('❌ 解析用户信息失败:', error.message)
    return null
  }
}

/**
 * 获取存储的访问令牌
 * @returns {string|null} 访问令牌或null
 */
export const getStoredToken = () => {
  if (!isLocalStorageAvailable) {
    return null;
  }
  
  return localStorage.getItem('github_token')
}

/**
 * 检查后端API是否可用
 * @returns {Promise<boolean>} API是否可用
 */
export const checkApiHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      timeout: 5000 // 5秒超时
    })
    
    return response.ok
  } catch (error) {
    console.warn('⚠️ 后端API健康检查失败:', error.message)
    return false
  }
}