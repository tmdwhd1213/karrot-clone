export default function Modifier() {
  return (
    <main className="bg-gray-100 sm:bg-red-100 md:bg-green-100 lg:bg-cyan-100 xl:bg-orange-100 2xl:bg-purple-100 h-screen flex items-center justify-center p-5">
      <div
        className="bg-white w-full shadow-lg p-5 rounded-3xl 
        max-w-screen-sm flex flex-col md:flex-row gap-2
        *:outline-none ring ring-transparent transition-shadow
        has-[:invalid]:ring-red-100"
      >
        <input
          className="w-full rounded-full py-3 h-10 bg-gray-200 pl-5 
            ring ring-transparent focus:ring-green-500 focus:ring-offset-2
            transition-shadow placeholder:drop-shadow
            invalid:md:focus:ring-red-500 peer"
          type="text"
          required
          placeholder="Email address"
        />
        <span className="text-red-500 font-medium hidden peer-invalid:block">
          Email is required.
        </span>
        {/* 클래스네임을 커서로 갖다대어보면 --tw-??-?? 이런식으로 변수가 설정되어있음. 이걸 사용자가 임의로 가져가 쓸 수 있다. */}
        <button
          className="text-white py-2 rounded-full
            active:scale-90 transition-transform font-medium focus:scale-90
            bg-opacity-100 md:px-10 bg-gradient-to-tr from-cyan-500 via-yellow-400 to-purple-400
            peer-invalid:bg-red-100 peer-required:bg-green-500"
        >
          {/* bg-gradient-to- -> 그라데이션 from to 설정, via 중간 진행방향 왼쪽(from) 중앙option(via) 오른쪽(to)*/}
          Login
        </button>
      </div>
    </main>
  );
}
