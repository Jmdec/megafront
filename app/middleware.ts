import { NextResponse } from 'next/server';
import Cookies from 'js-cookie';

export function middleware(req: any) {
  const token = Cookies.get("auth_token");


  if (!token) {
    return NextResponse.redirect(new URL('/auth', req.url));  // Redirect to /auth page
  }


  return NextResponse.next();  // Allow request to proceed
}

export const config = {
  matcher: ['/admin/*'],  // Apply to routes starting with /admin
};
