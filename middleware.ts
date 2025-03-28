import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 需要登录才能访问的路径
const protectedPaths = [
  '/settings',
  '/settings/wechat',
  '/settings/api-keys',
  '/settings/model-config',
  '/ai-chat',
  '/ai-generator',
  '/articles',
  '/editor',
  '/preview',
  '/publish'
];

// 中间件函数
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // 检查是否是受保护的路径
  const isProtectedPath = protectedPaths.some(protectedPath => 
    path === protectedPath || path.startsWith(`${protectedPath}/`)
  );
  
  if (isProtectedPath) {
    // 检查是否有会话令牌
    const sessionToken = request.cookies.get('next-auth.session-token')?.value;
    const userToken = request.cookies.get('user_token')?.value;
    
    // 如果没有会话令牌或用户令牌，重定向到登录页面
    if (!sessionToken || !userToken) {
      const url = new URL('/login', request.url);
      url.searchParams.set('redirect', path);
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}

// 配置中间件匹配的路径
export const config = {
  matcher: [
    /*
     * 匹配所有需要保护的路径:
     * - /settings
     * - /ai-chat
     * - /ai-generator
     * - /articles
     * - /editor
     * - /preview
     * - /publish
     */
    '/settings/:path*',
    '/ai-chat/:path*',
    '/ai-generator/:path*',
    '/articles/:path*',
    '/editor/:path*',
    '/preview/:path*',
    '/publish/:path*'
  ],
};