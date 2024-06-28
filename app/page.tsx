import Link from "next/link";
import "./lib/db";

export default function Home() {
  return (
    <main
      className="flex flex-col items-center
      justify-center min-h-screen p-6"
    >
      <div
        className="my-auto flex flex-col
          gap-2 items-center *:font-medium"
      >
        <span className="text-9xl">🥒</span>
        <h1 className="text-4xl">오이</h1>
        <h2 className="text-2xl">오이 마켓에 어서오세요!</h2>
      </div>
      <div className="flex flex-col items-center gap-3 w-full">
        <Link href="/create-account" className="primary-btn py-2.5 text-lg">
          시작하기
        </Link>
        <div className="flex gap-2">
          <span>이미 계정이 있나요?</span>
          <Link href="/login" className="hover:underline underline-offset-2">
            로그인
          </Link>
        </div>
      </div>
    </main>
  );
}
