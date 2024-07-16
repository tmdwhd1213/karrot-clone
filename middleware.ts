import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import getSession from "./app/lib/session";

export async function middleware(request: NextRequest) {
  const session = await getSession();
  console.log(session);
  if (request.nextUrl.pathname === "/profile") {
    return Response.redirect(new URL("/", request.url));
  }
}
