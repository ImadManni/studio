import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
	const token = await getToken({ req: request as any, secret: process.env.NEXTAUTH_SECRET });
	const { pathname } = request.nextUrl;

	const isProtected = pathname.startsWith('/dashboard');
	const isAuthRoute = pathname.startsWith('/signin') || pathname.startsWith('/signup');

	if (isProtected && !token) {
		const url = new URL('/signin', request.url);
		url.searchParams.set('callbackUrl', pathname);
		return NextResponse.redirect(url);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/dashboard/:path*', '/signin', '/signup'],
};


