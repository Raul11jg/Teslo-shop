import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  if (req.nextUrl.pathname.startsWith('/checkout')) {
    const token = req.cookies.get('token') || '';
    console.log('midd token: ', token);

    try {
      await jose.jwtVerify(token || '', new TextEncoder().encode(process.env.JWT_SECRET_SEED || ''));
      console.log('OK: ', token);

      return NextResponse.next();
    } catch (error) {
      console.log('KO: ', error);

      const { protocol, host, pathname } = req.nextUrl;
      return NextResponse.redirect(`${protocol}//${host}/auth/login?prevPage=${pathname}`);
    }
  }
}
// Only the paths declared in here will run the middleware
export const config = {
  matcher: ['/checkout/:path*'],
};
