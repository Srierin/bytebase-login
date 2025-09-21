/**
 * 移动端布局组件
 * 专门为移动设备优化的登录界面
 */

import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent } from '@/components/ui/card.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Github, Chrome, Square, AlertCircle, Loader2, Menu, X } from 'lucide-react'

const MobileLayout = ({ 
  email, 
  setEmail, 
  loading, 
  error, 
  clearError,
  loginWithGitHub, 
  handleEmailLogin, 
  handleGoogleLogin, 
  handleMicrosoftLogin 
}) => {
  const [showInfo, setShowInfo] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 via-purple-600 to-blue-400 flex flex-col">
      {/* 顶部装饰区域 */}
      <div className="relative flex-1 min-h-[40vh] flex flex-col justify-center items-center text-white p-6 overflow-hidden">
        {/* 背景装饰元素 */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-3 h-3 bg-green-400 rounded-full animate-bounce"></div>
          <div className="absolute top-20 right-16 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 left-16 w-4 h-4 bg-pink-400 rounded-full animate-ping"></div>
          <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-cyan-400 rounded-full animate-bounce delay-300"></div>
        </div>
        
        {/* Logo和标题 */}
        <div className="text-center mb-6 z-10">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mr-3 shadow-lg">
              <Square className="w-7 h-7 text-black" />
            </div>
            <span className="text-3xl font-bold">Bytebase</span>
          </div>
          <h1 className="text-2xl font-bold mb-2 leading-tight">
            Change, Query, Secure, Govern
          </h1>
          <p className="text-lg opacity-90">
            all Databases in a Single Place
          </p>
        </div>

        {/* 简化的插画元素 */}
        <div className="flex space-x-6 items-center z-10">
          <div className="text-center">
            <div className="w-16 h-16 bg-white rounded-full mb-2 flex items-center justify-center shadow-lg">
              <div className="text-xl">👨‍💼</div>
            </div>
            <div className="bg-white text-blue-600 px-2 py-1 rounded text-xs font-bold">
              DBA
            </div>
          </div>
          
          <div className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
            WELCOME
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-white rounded-full mb-2 flex items-center justify-center shadow-lg">
              <div className="text-xl">👨‍💻</div>
            </div>
            <div className="bg-white text-blue-600 px-2 py-1 rounded text-xs font-bold">
              DEV
            </div>
          </div>
        </div>

        {/* 信息按钮 */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowInfo(!showInfo)}
          className="absolute top-4 right-4 text-white hover:bg-white/20"
        >
          {showInfo ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>

        {/* 展开的信息面板 */}
        {showInfo && (
          <div className="absolute top-16 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-xs">
            <h3 className="font-semibold text-gray-900 mb-2">关于Bytebase</h3>
            <p className="text-sm text-gray-700 mb-3">
              Bytebase是一个开源的数据库DevOps平台，帮助开发者和DBA协作管理数据库变更。
            </p>
            <div className="flex space-x-2">
              <div className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
                APPROVE
              </div>
              <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                DEPLOY
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 底部登录表单区域 */}
      <div className="bg-white rounded-t-3xl shadow-2xl p-6 pb-8">
        <div className="max-w-sm mx-auto">
          {/* 标题 */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">欢迎回来</h2>
            <p className="text-gray-600 text-sm">
              登录以继续使用 Bytebase Hub
            </p>
          </div>

          {/* 错误提示 */}
          {error && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700 text-sm">
                {error}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearError}
                  className="ml-2 h-auto p-0 text-red-600 hover:text-red-700"
                >
                  ✕
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* 第三方登录按钮 - 紧凑布局 */}
          <div className="space-y-3 mb-5">
            <Button
              onClick={handleGoogleLogin}
              variant="outline"
              className="w-full h-11 flex items-center justify-center space-x-2 border-gray-300 hover:bg-gray-50 transition-colors text-sm"
            >
              <Chrome className="w-4 h-4 text-gray-600" />
              <span>Google 登录</span>
            </Button>
            
            <Button
              onClick={loginWithGitHub}
              variant="outline"
              className="w-full h-11 flex items-center justify-center space-x-2 border-gray-300 hover:bg-gray-50 transition-colors text-sm"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
              ) : (
                <Github className="w-4 h-4 text-gray-600" />
              )}
              <span>{loading ? '登录中...' : 'GitHub 登录'}</span>
            </Button>
            
            <Button
              onClick={handleMicrosoftLogin}
              variant="outline"
              className="w-full h-11 flex items-center justify-center space-x-2 border-gray-300 hover:bg-gray-50 transition-colors text-sm"
            >
              <Square className="w-4 h-4 text-blue-600" />
              <span>Microsoft 登录</span>
            </Button>
          </div>

          {/* 分割线 */}
          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-gray-500">或使用邮箱</span>
            </div>
          </div>

          {/* 邮箱登录表单 */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                邮箱地址
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="输入邮箱地址"
                className="w-full h-11 text-sm"
                onKeyPress={(e) => e.key === 'Enter' && handleEmailLogin()}
              />
            </div>
            
            <Button
              onClick={handleEmailLogin}
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white transition-colors text-sm"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  登录中...
                </>
              ) : (
                '继续'
              )}
            </Button>
          </div>

          {/* 底部链接 */}
          <div className="text-center mt-5">
            <span className="text-gray-600 text-sm">没有账户？</span>
            <a 
              href="#" 
              className="text-blue-600 hover:text-blue-700 ml-1 transition-colors text-sm"
              onClick={(e) => {
                e.preventDefault()
                alert('注册功能需要后端支持')
              }}
            >
              立即注册
            </a>
          </div>

          {/* 移动端开发提示 - 可折叠 */}
          <details className="mt-6">
            <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
              开发说明 ▼
            </summary>
            <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="text-xs text-yellow-800">
                <p className="font-medium mb-1">GitHub OAuth配置：</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>创建GitHub OAuth应用</li>
                  <li>设置VITE_GITHUB_CLIENT_ID</li>
                  <li>配置回调URL</li>
                </ul>
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
  )
}

export default MobileLayout
