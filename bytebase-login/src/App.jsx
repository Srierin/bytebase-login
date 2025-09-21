import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent } from '@/components/ui/card.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Github, Chrome, Square, AlertCircle, Loader2, ExternalLink, Smartphone, Monitor } from 'lucide-react'
import { useAuth } from './hooks/useAuth.js'
import { useResponsive } from './hooks/useResponsive.js'
import MobileLayout from './components/MobileLayout.jsx'
import './App.css'

function App() {
  const [email, setEmail] = useState('')
  const { 
    user, 
    loading, 
    error, 
    isAuthenticated, 
    isGitHubUser,
    loginWithGitHub, 
    loginWithEmail, 
    logout, 
    clearError 
  } = useAuth()
  
  const { isMobile, isTablet, windowSize } = useResponsive()

  // 处理邮箱登录
  const handleEmailLogin = async () => {
    if (!email) {
      alert('请输入邮箱地址')
      return
    }
    await loginWithEmail(email)
  }

  // 模拟其他第三方登录
  const handleGoogleLogin = () => {
    alert('Google登录功能需要配置Google OAuth。\n请参考文档配置相应的OAuth应用。')
  }

  const handleMicrosoftLogin = () => {
    alert('Microsoft登录功能需要配置Microsoft OAuth。\n请参考文档配置相应的OAuth应用。')
  }

  // 如果正在加载，显示加载状态
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-blue-400 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <h2 className="text-xl font-semibold mb-2">正在登录...</h2>
            <p className="text-gray-600">请稍候，正在处理您的登录请求</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 如果已登录，显示用户信息（响应式布局）
  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-blue-400 flex items-center justify-center p-4">
        <Card className={`w-full ${isMobile ? 'max-w-sm' : 'max-w-md'}`}>
          <CardContent className={`${isMobile ? 'p-6' : 'p-8'}`}>
            {/* 设备信息显示 */}
            <div className="flex items-center justify-center mb-4 text-xs text-gray-500">
              {isMobile ? (
                <><Smartphone className="w-3 h-3 mr-1" />移动端</>
              ) : (
                <><Monitor className="w-3 h-3 mr-1" />桌面端</>
              )}
              <span className="ml-2">{windowSize.width}×{windowSize.height}</span>
            </div>

            {/* 用户头像和基本信息 */}
            <div className="text-center mb-6">
              <img 
                src={user.avatar_url} 
                alt="用户头像" 
                className={`${isMobile ? 'w-16 h-16' : 'w-20 h-20'} rounded-full mx-auto mb-4 border-4 border-white shadow-lg`}
              />
              <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold mb-2`}>欢迎回来!</h2>
              <p className={`text-gray-700 font-medium mb-1 ${isMobile ? 'text-sm' : ''}`}>
                {user.name || user.login}
              </p>
              <p className={`text-gray-500 mb-4 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                {user.email}
              </p>
              
              {/* GitHub用户额外信息 */}
              {isGitHubUser && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className={`flex items-center justify-center space-x-4 text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                    <div className="text-center">
                      <div className="font-semibold text-gray-900">{user.public_repos || 0}</div>
                      <div>仓库</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-gray-900">{user.followers || 0}</div>
                      <div>关注者</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-gray-900">{user.following || 0}</div>
                      <div>关注中</div>
                    </div>
                  </div>
                  
                  {user.bio && (
                    <p className={`text-gray-600 mt-3 text-center italic ${isMobile ? 'text-xs' : 'text-sm'}`}>
                      "{user.bio}"
                    </p>
                  )}
                  
                  {user.html_url && (
                    <div className="mt-3 text-center">
                      <a 
                        href={user.html_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`inline-flex items-center text-blue-600 hover:text-blue-700 ${isMobile ? 'text-xs' : 'text-sm'}`}
                      >
                        <Github className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} mr-1`} />
                        查看GitHub主页
                        <ExternalLink className={`${isMobile ? 'w-2 h-2' : 'w-3 h-3'} ml-1`} />
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 操作按钮 */}
            <div className="space-y-3">
              <Button 
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white ${isMobile ? 'h-10 text-sm' : 'h-12'}`}
                onClick={() => alert('欢迎使用Bytebase！这里可以跳转到主应用。')}
              >
                进入Bytebase
              </Button>
              <Button 
                onClick={logout} 
                variant="outline" 
                className={`w-full ${isMobile ? 'h-10 text-sm' : 'h-12'}`}
              >
                退出登录
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 移动端使用专门的移动布局
  if (isMobile) {
    return (
      <MobileLayout
        email={email}
        setEmail={setEmail}
        loading={loading}
        error={error}
        clearError={clearError}
        loginWithGitHub={loginWithGitHub}
        handleEmailLogin={handleEmailLogin}
        handleGoogleLogin={handleGoogleLogin}
        handleMicrosoftLogin={handleMicrosoftLogin}
      />
    )
  }

  // 桌面端和平板端布局
  return (
    <div className="min-h-screen flex">
      {/* 左侧插画区域 */}
      <div className={`${isTablet ? 'hidden' : 'hidden lg:flex'} lg:flex-1 bg-gradient-to-br from-blue-500 via-purple-600 to-blue-400 relative overflow-hidden`}>
        {/* 背景装饰元素 */}
        <div className="absolute inset-0">
          {/* 浮动的装饰圆点 */}
          <div className="absolute top-20 left-20 w-4 h-4 bg-green-400 rounded-full animate-bounce"></div>
          <div className="absolute top-32 right-32 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
          <div className="absolute bottom-40 left-40 w-2 h-2 bg-pink-400 rounded-full animate-ping"></div>
          <div className="absolute top-1/2 left-1/4 w-6 h-6 bg-cyan-400 rounded-full animate-bounce delay-300"></div>
          <div className="absolute top-1/3 right-1/4 w-5 h-5 bg-purple-300 rounded-full animate-pulse delay-500"></div>
          <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-green-300 rounded-full animate-bounce delay-700"></div>
        </div>
        
        {/* 主要内容区域 */}
        <div className="flex flex-col justify-center items-center text-white p-12 z-10 relative">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Change, Query, Secure, Govern
            </h1>
            <p className="text-xl opacity-90">
              all Databases in a Single Place
            </p>
          </div>
          
          {/* 插画区域 - 使用CSS创建类似的卡通形象 */}
          <div className="relative">
            {/* Welcome横幅 */}
            <div className="bg-purple-600 text-white px-8 py-3 rounded-full text-xl font-bold mb-8 transform -rotate-3 shadow-lg animate-pulse">
              WELCOME
            </div>
            
            {/* 卡通人物区域 */}
            <div className="flex space-x-8 items-end mb-6">
              {/* DBA角色 */}
              <div className="text-center transform hover:scale-105 transition-transform duration-300">
                <div className="w-20 h-20 bg-white rounded-full mb-2 flex items-center justify-center shadow-lg">
                  <div className="text-2xl">👨‍💼</div>
                </div>
                <div className="bg-white text-blue-600 px-3 py-1 rounded text-sm font-bold shadow-md">
                  DBA
                </div>
              </div>
              
              {/* DEV角色 */}
              <div className="text-center transform hover:scale-105 transition-transform duration-300">
                <div className="w-20 h-20 bg-white rounded-full mb-2 flex items-center justify-center shadow-lg">
                  <div className="text-2xl">👨‍💻</div>
                </div>
                <div className="bg-white text-blue-600 px-3 py-1 rounded text-sm font-bold shadow-md">
                  DEV
                </div>
              </div>
            </div>
            
            {/* 底部按钮 */}
            <div className="flex space-x-4">
              <div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg hover:bg-green-600 transition-colors cursor-pointer">
                APPROVE
              </div>
              <div className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg hover:bg-red-600 transition-colors cursor-pointer">
                DEPLOY
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 右侧登录表单区域 */}
      <div className={`flex-1 ${isTablet ? 'lg:flex-none lg:w-full' : 'lg:flex-none lg:w-1/2 xl:w-2/5'} bg-white flex items-center justify-center p-8`}>
        <div className={`w-full ${isTablet ? 'max-w-lg' : 'max-w-md'}`}>
          {/* 设备信息显示 */}
          <div className="flex items-center justify-center mb-4 text-xs text-gray-400">
            {isTablet ? (
              <>📱 平板端 ({windowSize.width}×{windowSize.height})</>
            ) : (
              <>🖥️ 桌面端 ({windowSize.width}×{windowSize.height})</>
            )}
          </div>

          {/* Logo和标题 */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center mr-3">
                <Square className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">Bytebase</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">欢迎</h2>
            <p className="text-gray-600">
              登录 Bytebase 以继续使用 Bytebase Hub。
            </p>
          </div>

          {/* 错误提示 */}
          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
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

          {/* 第三方登录按钮 */}
          <div className="space-y-3 mb-6">
            <Button
              onClick={handleGoogleLogin}
              variant="outline"
              className="w-full h-12 flex items-center justify-center space-x-3 border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <Chrome className="w-5 h-5 text-gray-600" />
              <span>继续使用 Google</span>
            </Button>
            
            <Button
              onClick={loginWithGitHub}
              variant="outline"
              className="w-full h-12 flex items-center justify-center space-x-3 border-gray-300 hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
              ) : (
                <Github className="w-5 h-5 text-gray-600" />
              )}
              <span>{loading ? '登录中...' : '继续使用 GitHub'}</span>
            </Button>
            
            <Button
              onClick={handleMicrosoftLogin}
              variant="outline"
              className="w-full h-12 flex items-center justify-center space-x-3 border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <Square className="w-5 h-5 text-blue-600" />
              <span>继续使用 Microsoft Account</span>
            </Button>
          </div>

          {/* 分割线 */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">或</span>
            </div>
          </div>

          {/* 邮箱登录表单 */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                电子邮件地址 *
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="请输入邮箱地址"
                className="w-full h-12"
                onKeyPress={(e) => e.key === 'Enter' && handleEmailLogin()}
              />
            </div>
            
            <Button
              onClick={handleEmailLogin}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white transition-colors"
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
          <div className="text-center mt-6">
            <span className="text-gray-600">没有账户？</span>
            <a 
              href="#" 
              className="text-blue-600 hover:text-blue-700 ml-1 transition-colors"
              onClick={(e) => {
                e.preventDefault()
                alert('注册功能需要后端支持。在实际应用中，这里会跳转到注册页面。')
              }}
            >
              注册
            </a>
          </div>

         
        </div>
      </div>
    </div>
  )
}

export default App
