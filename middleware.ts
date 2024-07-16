import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import getSession from "./app/lib/session";

export async function middleware(request: NextRequest) {
  // 방법 1. 모든 pathname에 if문을 써서 제외시키기.
  // const pathname = request.nextUrl.pathname;
  // if (pathname === "/") {
  //   const response = NextResponse.next();
  //   response.cookies.set("middleware-cookie", "hello!");
  //   return response;
  // }
  // if (pathname === "/profile") {
  //   return Response.redirect(new URL("/", request.url));
  // }
  console.log("hello!");
}

// 방법 2. config로 matcher에 해당하는 것들을 제외시키기.
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
