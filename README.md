# bytebase-logind登录页面

## 功能

- **响应式设计**: 自动适应桌面、平板和移动设备，为不同尺寸的屏幕提供优化的用户体验。
- **GitHub OAuth 登录**: 集成了（模拟的）GitHub 第三方登录流程。
  - 点击 "继续使用 GitHub" 按钮将跳转到 GitHub 授权页面。
  - 登录成功后，会显示用户的头像、名称、邮箱和一些 GitHub 统计数据。
- **邮箱登录**: 提供了模拟的邮箱登录功能。
- **组件化结构**: 采用清晰的、组件化的代码结构，易于理解和维护。
- **自定义 Hooks**: 使用自定义 Hooks (`useAuth`, `useResponsive`) 来封装和复用业务逻辑与响应式检测逻辑。
- **现代技术栈**: 使用 Vite、React 和 Tailwind CSS，提供优秀的开发体验和类型安全。

## 技术栈

- **框架**: [React](https://react.dev/)
- **构建工具**: [Vite](https://vitejs.dev/)
- **编程语言**: [TypeScript](https://www.typescriptlang.org/) (本项目使用 JSDoc 注释的 JavaScript，可轻松迁移到 `.ts` 或 `.tsx`)
- **样式**: [Tailwind CSS](https://tailwindcss.com/)
- **UI 组件库**: [shadcn/ui](https://ui.shadcn.com/)
- **图标**: [Lucide React](https://lucide.dev/)

## 项目结构

```
bytebase-login/
├── public/                # 静态资源
├── src/
│   ├── assets/            # 图片等资源
│   ├── components/
│   │   ├── ui/            # shadcn/ui 自动生成的组件
│   │   └── MobileLayout.jsx # 移动端专属布局组件
│   ├── hooks/
│   │   ├── useAuth.js     # 用户认证状态管理 Hook
│   │   └── useResponsive.js # 响应式设计 Hook
│   ├── services/
│   │   └── github.js      # GitHub OAuth 服务模块
│   ├── App.css            # 全局和应用级样式
│   ├── App.jsx            # 主应用组件（包含路由和布局逻辑）
│   ├── main.jsx           # 应用入口文件
│   └── index.css          # Tailwind CSS 基础样式
├── .env.example           # 环境变量示例文件
├── index.html             # HTML 入口文件
├── package.json           # 项目依赖和脚本
└── vite.config.js         # Vite 配置文件
```
后端实现流程
- 创建一个后端 API 端点 (例如 `/api/auth/github/callback`)。
- 前端在拿到 `code` 后，将其发送到这个后端端点。
- 后端使用 `client_id`, `client_secret` 和 `code` 向 GitHub API 请求 `access_token`。
- 后端使用获取到的 `access_token` 请求用户信息。
- 后端创建会话或生成 JWT，并返回给前端。