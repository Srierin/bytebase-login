/**
 * 响应式设计Hook
 * 用于检测屏幕尺寸和设备类型
 */

import { useState, useEffect } from 'react'

/**
 * 断点配置 - 基于Tailwind CSS的断点
 */
const BREAKPOINTS = {
  sm: 640,   // 小屏幕
  md: 768,   // 中等屏幕
  lg: 1024,  // 大屏幕
  xl: 1280,  // 超大屏幕
  '2xl': 1536 // 2倍超大屏幕
}

/**
 * 响应式Hook
 * @returns {Object} 屏幕信息和响应式状态
 */
export const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  })

  useEffect(() => {
    // 处理窗口大小变化
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    // 添加事件监听器
    window.addEventListener('resize', handleResize)
    
    // 初始化时获取窗口大小
    handleResize()

    // 清理事件监听器
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 计算当前断点
  const getCurrentBreakpoint = () => {
    const { width } = windowSize
    
    if (width >= BREAKPOINTS['2xl']) return '2xl'
    if (width >= BREAKPOINTS.xl) return 'xl'
    if (width >= BREAKPOINTS.lg) return 'lg'
    if (width >= BREAKPOINTS.md) return 'md'
    if (width >= BREAKPOINTS.sm) return 'sm'
    return 'xs'
  }

  // 检查是否为移动设备
  const isMobile = windowSize.width < BREAKPOINTS.md

  // 检查是否为平板设备
  const isTablet = windowSize.width >= BREAKPOINTS.md && windowSize.width < BREAKPOINTS.lg

  // 检查是否为桌面设备
  const isDesktop = windowSize.width >= BREAKPOINTS.lg

  // 检查是否为小屏幕
  const isSmallScreen = windowSize.width < BREAKPOINTS.sm

  // 检查是否为大屏幕
  const isLargeScreen = windowSize.width >= BREAKPOINTS.xl

  // 检查屏幕方向
  const isPortrait = windowSize.height > windowSize.width
  const isLandscape = windowSize.width > windowSize.height

  // 检查是否为触摸设备
  const isTouchDevice = typeof window !== 'undefined' && 
    ('ontouchstart' in window || navigator.maxTouchPoints > 0)

  // 获取设备像素比
  const devicePixelRatio = typeof window !== 'undefined' ? 
    window.devicePixelRatio || 1 : 1

  // 检查是否为高分辨率屏幕
  const isHighDPI = devicePixelRatio > 1

  return {
    // 窗口尺寸
    windowSize,
    width: windowSize.width,
    height: windowSize.height,
    
    // 断点信息
    breakpoint: getCurrentBreakpoint(),
    
    // 设备类型
    isMobile,
    isTablet,
    isDesktop,
    isSmallScreen,
    isLargeScreen,
    
    // 屏幕方向
    isPortrait,
    isLandscape,
    
    // 设备特性
    isTouchDevice,
    isHighDPI,
    devicePixelRatio,
    
    // 工具函数
    isBreakpoint: (bp) => getCurrentBreakpoint() === bp,
    isBreakpointUp: (bp) => windowSize.width >= BREAKPOINTS[bp],
    isBreakpointDown: (bp) => windowSize.width < BREAKPOINTS[bp],
    
    // 断点常量
    breakpoints: BREAKPOINTS
  }
}

/**
 * 媒体查询Hook
 * @param {string} query - CSS媒体查询字符串
 * @returns {boolean} 是否匹配媒体查询
 */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia(query)
    setMatches(mediaQuery.matches)

    const handler = (event) => setMatches(event.matches)
    
    // 现代浏览器
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler)
      return () => mediaQuery.removeEventListener('change', handler)
    } 
    // 旧版浏览器兼容
    else {
      mediaQuery.addListener(handler)
      return () => mediaQuery.removeListener(handler)
    }
  }, [query])

  return matches
}

/**
 * 预定义的媒体查询Hook
 */
export const useIsMobile = () => useMediaQuery('(max-width: 767px)')
export const useIsTablet = () => useMediaQuery('(min-width: 768px) and (max-width: 1023px)')
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)')
export const useIsSmallScreen = () => useMediaQuery('(max-width: 639px)')
export const useIsLargeScreen = () => useMediaQuery('(min-width: 1280px)')
export const useIsDarkMode = () => useMediaQuery('(prefers-color-scheme: dark)')
export const usePrefersReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')

/**
 * 方向检测Hook
 */
export const useOrientation = () => {
  const [orientation, setOrientation] = useState('portrait')

  useEffect(() => {
    const updateOrientation = () => {
      if (window.innerWidth > window.innerHeight) {
        setOrientation('landscape')
      } else {
        setOrientation('portrait')
      }
    }

    updateOrientation()
    window.addEventListener('resize', updateOrientation)
    window.addEventListener('orientationchange', updateOrientation)

    return () => {
      window.removeEventListener('resize', updateOrientation)
      window.removeEventListener('orientationchange', updateOrientation)
    }
  }, [])

  return orientation
}
