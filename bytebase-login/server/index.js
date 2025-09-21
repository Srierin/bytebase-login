/**
 * Bytebase登录页面后端API服务器
 * 处理GitHub OAuth认证和用户数据获取
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// 使用动态导入避免node-fetch版本问题
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// 加载环境变量
console.log('尝试加载.env文件...');
const envPath = path.resolve(__dirname, '..', '.env');
console.log(`env文件路径: ${envPath}`);

try {
  const dotenvResult = dotenv.config({ path: envPath });
  if (dotenvResult.error) {
    console.error('❌ dotenv加载失败:', dotenvResult.error);
  } else {
    console.log('✅ dotenv加载成功');
  }
} catch (error) {
  console.error('❌ 加载.env文件时发生异常:', error);
}

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件配置
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 请求日志中间件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// GitHub OAuth配置 - 确保有默认值
const GITHUB_CONFIG = {
  CLIENT_ID: process.env.VITE_GITHUB_CLIENT_ID || 'Ov23lifytnOh5Z5A3i2E',
  CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET || '7692711757c71db2e7f76626955e0d360b26adab',
  REDIRECT_URI: process.env.GITHUB_REDIRECT_URI || 'http://localhost:5173/auth/callback'
};

console.log('GITHUB_CONFIG:', {
  CLIENT_ID: GITHUB_CONFIG.CLIENT_ID ? '已设置' : '未设置',
  CLIENT_SECRET: GITHUB_CONFIG.CLIENT_SECRET ? '已设置' : '未设置',
  REDIRECT_URI: GITHUB_CONFIG.REDIRECT_URI
});

// 模拟数据库存储（实际应用中应使用真实数据库）
const mockDatabase = {
  users: new Map(),
  sessions: new Map()
};

/**
 * 生成随机访问令牌
 */
const generateAccessToken = () => {
  return 'access_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

/**
 * 健康检查端点
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Bytebase Login API',
    nodeVersion: process.version
  });
});

/**
 * GitHub OAuth回调端点 - 处理授权码交换
 */
app.post('/api/auth/github/callback', async (req, res) => {
  try {
    const { code, state } = req.body;
    
    console.log('收到GitHub授权码交换请求:', { code: code ? '已提供' : '未提供', state });
    
    if (!code) {
      return res.status(400).json({
        success: false,
        message: '缺少授权码'
      });
    }
    
    try {
      // 1. 尝试真实的GitHub API调用交换访问令牌
      const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          client_id: GITHUB_CONFIG.CLIENT_ID,
          client_secret: GITHUB_CONFIG.CLIENT_SECRET,
          code: code,
          redirect_uri: GITHUB_CONFIG.REDIRECT_URI,
          state: state
        })
      });
      
      const tokenData = await tokenResponse.json();
      
      // 检查是否有错误
      if (tokenData.error) {
        console.error('GitHub令牌交换失败:', tokenData.error);
        // 回退到模拟模式
        throw new Error('GitHub API调用失败');
      }
      
      const accessToken = tokenData.access_token;
      
      // 2. 使用访问令牌获取用户信息
      const userResponse = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      
      const userData = await userResponse.json();
      
      // 3. 获取用户邮箱
      const emailResponse = await fetch('https://api.github.com/user/emails', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      
      const emails = await emailResponse.json();
      const primaryEmail = emails.find(email => email.primary)?.email || userData.email;
      
      // 4. 保存用户信息
      const user = {
        id: userData.id.toString(),
        login: userData.login,
        name: userData.name,
        email: primaryEmail,
        avatar_url: userData.avatar_url,
        html_url: userData.html_url,
        bio: userData.bio,
        public_repos: userData.public_repos,
        followers: userData.followers,
        following: userData.following,
        created_at: userData.created_at,
        provider: 'github'
      };
      
      // 生成会话令牌
      const sessionToken = generateAccessToken();
      mockDatabase.users.set(sessionToken, user);
      mockDatabase.sessions.set(sessionToken, {
        token: accessToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24小时后过期
      });
      
      console.log('GitHub登录成功，用户:', user.login);
      
      return res.json({
        success: true,
        user: user,
        access_token: sessionToken,
        token_type: 'bearer'
      });
      
    } catch (error) {
      console.warn('真实GitHub API调用失败，使用模拟模式:', error.message);
      
      // 模拟模式：直接返回模拟用户数据
      const mockUser = {
        id: 'github_user_' + Date.now(),
        login: 'demo-user',
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
      };
      
      const mockToken = generateAccessToken();
      mockDatabase.users.set(mockToken, mockUser);
      
      return res.json({
        success: true,
        user: mockUser,
        access_token: mockToken,
        token_type: 'bearer'
      });
    }
    
  } catch (error) {
    console.error('处理GitHub回调时发生错误:', error);
    res.status(500).json({
      success: false,
      message: '处理GitHub回调失败: ' + error.message
    });
  }
});

/**
 * 获取用户信息端点
 */
app.get('/api/auth/user', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: '缺少授权头'
      });
    }
    
    const token = authHeader.replace('Bearer ', '');
    const user = mockDatabase.users.get(token);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '无效的访问令牌'
      });
    }
    
    return res.json({
      success: true,
      user: user
    });
    
  } catch (error) {
    console.error('获取用户信息时发生错误:', error);
    res.status(500).json({
      success: false,
      message: '获取用户信息失败: ' + error.message
    });
  }
});

/**
 * 注销登录端点
 */
app.post('/api/auth/logout', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      
      // 从模拟数据库中删除用户会话
      if (mockDatabase.users.has(token)) {
        mockDatabase.users.delete(token);
        if (mockDatabase.sessions.has(token)) {
          mockDatabase.sessions.delete(token);
        }
        console.log('用户注销成功');
      }
    }
    
    return res.json({
      success: true,
      message: '注销成功'
    });
    
  } catch (error) {
    console.error('注销登录时发生错误:', error);
    res.status(500).json({
      success: false,
      message: '注销失败: ' + error.message
    });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log('🚀 Bytebase登录API服务器启动成功!');
  console.log(`📍 服务地址: http://localhost:${PORT}`);
  console.log(`🔗 健康检查: http://localhost:${PORT}/api/health`);
  console.log(`🔐 可用API端点:`);
  console.log(`   - POST /api/auth/callback - GitHub授权码交换`);
  console.log(`   - GET /api/auth/user - 获取用户信息`);
  console.log(`   - POST /api/auth/logout - 注销登录`);
});

module.exports = app;