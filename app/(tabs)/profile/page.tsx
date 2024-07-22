import { notFound, redirect } from "next/navigation";
import db from "../../lib/db";
import getSession from "../../lib/session";

async function getUser() {
  const session = await getSession();
  if (session.id) {
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
    });
    if (user) {
      return user;
    }
  }
  notFound();
}

export default async function Profile() {
  const user = await getUser();
  const logOut = async () => {
    "use server";
    const session = await getSession();
    // 쿠기 없애는 작업 -> 로그아웃
    session.destroy();
    redirect("/");
  };
  return (
    <div>
      <h1>welcome! {user?.username}</h1>
      {/* form안에 버튼 하나만 있다면 "use client"없이 action으로 onClick 작업 가능 */}
      <form action={logOut}>
        <button>로그아웃</button>
      </form>
    </div>
  );
}
