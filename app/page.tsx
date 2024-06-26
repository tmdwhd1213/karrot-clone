import Image from "next/image";

export default function Home() {
  return (
    <main className="bg-gray-100 sm:bg-red-100 md:bg-green-100 lg:bg-cyan-100 xl:bg-orange-100 2xl:bg-purple-100 h-screen flex items-center justify-center p-5">
      <div className="bg-white w-full shadow-lg p-5 rounded-3xl max-w-screen-sm flex flex-col md:flex-row gap-2">
        <input
          className="w-full rounded-full py-3 h-10 bg-gray-200 pl-5 outline-none 
            ring ring-transparent focus:ring-orange-500 focus:ring-offset-2
            transition-shadow placeholder:drop-shadow"
          type="text"
          placeholder="Search here..."
        />
        {/* 클래스네임을 커서로 갖다대어보면 --tw-??-?? 이런식으로 변수가 설정되어있음. 이걸 사용자가 임의로 가져가 쓸 수 있다. */}
        <button
          className="bg-black text-white py-2 rounded-full
            active:scale-90 transition-transform font-medium focus:scale-90 outline-none
            bg-opacity-100 md:px-10"
        >
          Search
        </button>
      </div>
    </main>
  );
}
