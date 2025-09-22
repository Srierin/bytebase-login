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
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-blue-500 flex items-center justify-center p-4">
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-blue-500 flex items-center justify-center p-4">
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
                className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white ${isMobile ? 'h-10 text-sm' : 'h-12'}`}
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

  // === 桌面端布局：左右各占 50% ===
  return (
    <div className="min-h-screen flex">
      {/* 左侧插画区域 - 占 50% 宽度 */}
      <div
        className="relative w-1/2 min-h-screen bg-no-repeat bg-cover bg-center bg-top"
        style={{
          backgroundImage: `url('https://dalleproduse.blob.core.windows.net/private/images/cc881318-aa02-4350-92cd-5587f22844cd/generated_00.png?se=2025-09-23T05%3A25%3A27Z&sig=sV36d%2BjMr6QlWM%2B%2BNohb%2F477x7J0Vrd0EMScP1Psn1o%3D&ske=2025-09-27T00%3A12%3A39Z&skoid=09ba021e-c417-441c-b203-c81e5dcd7b7f&sks=b&skt=2025-09-20T00%3A12%3A39Z&sktid=33e01921-4d64-4f8c-a055-5bdaffd5e33d&skv=2020-10-02&sp=r&spr=https&sr=b&sv=2020-10-02')`,
        }}
      >
        <div className="w-full text-center pt-10 md:pt-12 lg:pt-14 px-6">
          <h1 className="text-white font-extrabold leading-tight text-[30px] sm:text-[36px] md:text-[44px] lg:text-[48px] tracking-wide drop-shadow-[0_2px_0_rgba(0,0,0,0.18)]">
            Change, Query, Secure, Govern
            <br className="hidden sm:block" /> all Databases in a Single Place
          </h1>
        </div>
      </div>

      {/* 右侧登录表单区域 - 占 50% 宽度 */}
      <div className="w-1/2 bg-white flex items-center justify-center p-12">
        <div className="w-full max-w-sm">
          {/* Logo和标题 */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              {/* Bytebase Logo - 黑色圆形，内有聊天气泡 */}
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mr-3">
                <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center relative">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                  <div className="w-2 h-2 bg-black rounded-full ml-1"></div>
                  {/* 聊天气泡尾巴 */}
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white transform rotate-45"></div>
                </div>
              </div>
              <span className="text-3xl font-bold text-black">Bytebase</span>
            </div>
            <h2 className="text-3xl font-bold text-black mb-3">欢迎</h2>
            <p className="text-gray-600 text-base">
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
          <div className="space-y-3 mb-8">
            <Button
              onClick={handleGoogleLogin}
              variant="outline"
              className="w-full h-12 flex items-center justify-start px-4 border border-gray-300 hover:bg-gray-50 transition-colors text-base font-normal bg-white"
            >
              {/* Google 图标 - 彩色G */}
              <div className="w-5 h-5 mr-3 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>
              <span className="text-gray-700">继续使用 Google</span>
            </Button>
            
            <Button
              onClick={loginWithGitHub}
              variant="outline"
              className="w-full h-12 flex items-center justify-start px-4 border border-gray-300 hover:bg-gray-50 transition-colors text-base font-normal bg-white"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-gray-600 mr-3" />
              ) : (
                <Github className="w-5 h-5 text-gray-600 mr-3" />
              )}
              <span className="text-gray-700">{loading ? '登录中...' : '继续使用 GitHub'}</span>
            </Button>
            
            <Button
              onClick={handleMicrosoftLogin}
              variant="outline"
              className="w-full h-12 flex items-center justify-start px-4 border border-gray-300 hover:bg-gray-50 transition-colors text-base font-normal bg-white"
            >
              {/* Microsoft 图标 - 四色方块 */}
              <div className="w-5 h-5 mr-3 grid grid-cols-2 gap-0.5">
                <div className="w-2 h-2 bg-red-500"></div>
                <div className="w-2 h-2 bg-green-500"></div>
                <div className="w-2 h-2 bg-blue-500"></div>
                <div className="w-2 h-2 bg-yellow-500"></div>
              </div>
              <span className="text-gray-700">继续使用 Microsoft Account</span>
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
                placeholder=""
                className="w-full h-12 text-base border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                onKeyPress={(e) => e.key === 'Enter' && handleEmailLogin()}
              />
            </div>
            
            <Button
              onClick={handleEmailLogin}
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white transition-colors text-base font-medium"
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
            <span className="text-gray-600 text-sm">没有账户？</span>
            <a 
              href="#" 
              className="text-indigo-600 hover:text-indigo-700 text-sm transition-colors ml-1"
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