import { notFound, redirect } from "next/navigation";
import db from "../../../lib/db";
import getSession from "../../../lib/session";
import { Suspense } from "react";
import Image from "next/image";

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

// loading.tsx를 안 만들고 Suspense를 통해서 skeleton 만들기
async function Username() {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const user = await getUser();
  return <h1>welcome! {user?.username}</h1>;
}

function Skeleton() {
  return (
    <>
      <h1>안녕하세요?</h1>
    </>
  );
}

export default async function Profile() {
  const logOut = async () => {
    "use server";
    const session = await getSession();
    // 쿠기 없애는 작업 -> 로그아웃
    session.destroy();
    redirect("/");
  };
  return (
    <div>
      <Suspense fallback={<Skeleton />}>
        <Username />
      </Suspense>
      {/* form안에 버튼 하나만 있다면 "use client"없이 action으로 onClick 작업 가능 */}
      <form action={logOut}>
        <button>로그아웃</button>
      </form>
    </div>
  );
}
