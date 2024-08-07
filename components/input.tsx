import { InputHTMLAttributes, memo } from "react";

interface InputProps {
  name: string;
  errors?: string[];
  ref?: any;
}

const Input = ({
  name,
  errors = [],
  ...rest
}: InputProps & InputHTMLAttributes<HTMLInputElement>) => (
  <div className="flex flex-col gap-2">
    <input
      name={name}
      className="bg-transparent rounded-md w-full h-10 focus:outline-none ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-green-500 border-none placeholder:text-neutral-400"
      {...rest}
    />
    {errors.map((error, index) => (
      <span key={index} className="text-red-500 font-medium">
        {error}
      </span>
    ))}
  </div>
);

export default Input;
