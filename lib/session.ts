import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

interface SessionContent {
  id?: number;
}

export default function getSession(cookieHeader?: any) {
  if(!cookieHeader) {
    cookieHeader = cookies();
  }
  return getIronSession<SessionContent>(cookieHeader, {
    cookieName: "delicious-cucumber",
    password: process.env.COOKIE_PASSWORD!,
  });
}

export async function saveSession(id: number) {
  const session = await getSession();
  session.id = id;
  await session.save();
}

export async function getIsOwner(userId: number) {
  // 세션을 불러와서 아이디를 꺼낼거야.
  const session = await getSession();
  if (session.id) {
    return session.id === userId; //세션 아이디와 물건의 유저 아이디가 같다면 true
  } else {
    return false; //아니면 당연히 false
  }
}