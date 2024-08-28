import { InputHTMLAttributes } from "react";

interface InputProps {
  //아래의 속성들은 InputHTMLAttributes를 추가로 받아오기 때문에 굳이 더 적지 않아도 된다.
  //만약 InputHTMLAttributes를 받아오지 않았다면, 적어줘야했겠지

  // type: string;
  // placeholder: string;
  // required: boolean;
  name: string;
  title: string;
  errors?: string[];
}

export default function ProfileInput({
  name,
  errors = [],
  title,
  ...rest
}: InputProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="grid grid-cols-5 w-full gap-3   px-10">
      <div className="flex justify-start items-center col-span-1">
        <span className="text-sm text-white">{title}</span>
      </div>
      <div className="flex flex-col gap-2 col-span-3">
        <input
          className="bg-transparent rounded-md w-full h-10   text-white focus:outline-none ring-2 focus:ring-4 ring-neutral-200 focus:ring-green-500 border-none placeholder:text-neutral-400 transition"
          name={name}
          {...rest}
        />

        {errors.map((error, index) => (
          <span key={index} className="text-red-500 font-medium">
            {error}
          </span>
        ))}
      </div>
    </div>
  );
}
