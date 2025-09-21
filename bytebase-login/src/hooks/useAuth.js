/**
 * 用户认证状态管理Hook
 * 提供登录、退出、用户状态管理等功能
 */

import { useState, useEffect, useCallback } from 'react'
import { 
  loginWithGitHub, 
  logout as githubLogout, 
  getCurrentUser,
  getGitHubAuthUrl 
} from '../services/github.js'

/**
 * 用户认证Hook
 * @returns {Object} 认证状态和方法
 */
export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  /**
   * 初始化用户状态
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // 检查URL中是否有OAuth回调参数
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get('code')
        const error = urlParams.get('error')
        
        if (error) {
          // OAuth授权被拒绝或出错
          setError(`GitHub授权失败: ${error}`)
          // 清除URL参数
          window.history.replaceState({}, document.title, window.location.pathname)
          return
        }
        
        if (code) {
          // 处理OAuth回调
          try {
            const userInfo = await loginWithGitHub()
            if (userInfo) {
              setUser(userInfo)
            }
          } catch (err) {
            setError('登录过程中发生错误: ' + err.message)
            // 清除URL参数
            window.history.replaceState({}, document.title, window.location.pathname)
          }
        } else {
          // 检查本地存储的用户信息
          const currentUser = getCurrentUser()
          if (currentUser) {
            setUser(currentUser)
          }
        }
      } catch (err) {
        setError('初始化认证状态失败: ' + err.message)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  /**
   * GitHub登录
   */
  const loginWithGitHubHandler = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // 跳转到GitHub授权页面
      window.location.href = getGitHubAuthUrl()
    } catch (err) {
      setError('启动GitHub登录失败: ' + err.message)
      setLoading(false)
    }
  }, [])

  /**
   * 邮箱登录（模拟）
   */
  const loginWithEmail = useCallback(async (email, password) => {
    try {
      setLoading(true)
      setError(null)
      
      // 模拟邮箱登录
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 在实际应用中，这里应该调用后端API进行认证
      const mockUser = {
        id: 'email_user_' + Date.now(),
        login: email.split('@')[0],
        name: email.split('@')[0],
        email: email,
        avatar_url: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=6366f1&color=fff`,
        provider: 'email'
      }
      
      // 存储用户信息
      localStorage.setItem('user_info', JSON.stringify(mockUser))
      setUser(mockUser)
      
    } catch (err) {
      setError('邮箱登录失败: ' + err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * 退出登录
   */
  const logout = useCallback(() => {
    try {
      githubLogout()
      setUser(null)
      setError(null)
    } catch (err) {
      setError('退出登录失败: ' + err.message)
    }
  }, [])

  /**
   * 清除错误信息
   */
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  /**
   * 检查是否已登录
   */
  const isAuthenticated = user !== null

  /**
   * 检查是否是GitHub用户
   */
  const isGitHubUser = user?.provider !== 'email'

  return {
    // 状态
    user,
    loading,
    error,
    isAuthenticated,
    isGitHubUser,
    
    // 方法
    loginWithGitHub: loginWithGitHubHandler,
    loginWithEmail,
    logout,
    clearError
  }
}
