import Image from "next/image";

export default function Home() {
  return (
    <main className="bg-gray-100 h-screen flex items-center justify-center p-5">
      <div
        className="bg-white w-full shadow-lg p-5 rounded-3xl 
        max-w-screen-sm flex flex-col gap-3"
      >
        {["Nico", "Me", "You", "Yourself", ""].map((person, index) => {
          const loading = false;
          return (
            <>
              {loading ? (
                <div
                  key={index}
                  // odd:bg-gray-100 even:bg-cyan-100
                  // last:border-0 last:pb-0
                  className="flex
            items-center gap-5 *:animate-pulse"
                >
                  <div className="size-10 bg-blue-400 rounded-full" />
                  <div className="w-40 h-4 rounded-full bg-gray-400" />
                  <div className="w-20 h-4 rounded-full bg-gray-400" />
                </div>
              ) : (
                <div key={index} className="flex items-center gap-5 group">
                  <div className="size-10 bg-blue-400 rounded-full" />
                  <span
                    className="text-lg font-medium empty:w-24 empty:h-5 empty:rounded-full
                  empty:animate-pulse empty:bg-gray-300 group-hover:text-red-500"
                  >
                    {person}
                  </span>
                  <div className="size-6 bg-red-500 relative text-white flex items-center justify-center rounded-full">
                    <span className="z-10">{index}</span>
                    <div className="size-6 bg-red-500 rounded-full absolute animate-ping" />
                  </div>
                  <div className="group flex flex-col">
                    <input
                      className="bg-gray-100 w-full"
                      placeholder="Write your email"
                    />
                    <span className="group-focus-within:block hidden">
                      Make sure it is a valid email...
                    </span>
                    {/* 하나의 방대한 CSS파일이 아닌 컴파일러에서 불러옴. JIT 컴파일러 */}
                    {/* tailwind.config.ts의 theme.extend.borderRadius.sexy-name 에서 불러옴*/}
                    <button className="w-full bg-black text-[#ffccaa] rounded-sexy-name">
                      Submit
                    </button>
                  </div>
                </div>
              )}
            </>
          );
        })}
      </div>
    </main>
  );
}
