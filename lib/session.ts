import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

interface SessionContent {
  id?: number;
}

export default function getSession() {
  return getIronSession<SessionContent>(cookies(), {
    cookieName: "delicious-cucumber",
    password: process.env.COOKIE_PASSWORD!,
  });
}

export async function saveSession(id: number) {
  const session = await getSession();
  session.id = id;
  await session.save();
}
