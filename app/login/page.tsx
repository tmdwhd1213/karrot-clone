"use client";

import FormInput from "../components/form-input";
import FormButton from "../components/form-button";
import SocialLogin from "../components/social-login";
import { useFormState, useFormStatus } from "react-dom";
import { onSubmit } from "./actions";

export default function LoginPage() {
  // 처음 보낼 때 server에 초기값인 2번째 인수(null)이 보내지고,
  // 다시 보낼 때는 1번째 인수의 리턴 값인 state를 server에 보낸다.
  // action의 결과를 얻기위해서(return 값) useFormState 훅을 사용했음.
  const [state, dispatch] = useFormState(onSubmit, null);

  // ReactJS의 useFormStatus 훅 -> Form의 자식에서만 쓸 수 있다. (폼에서는 못 씀)
  // 자식 컴포넌트.(같은 컴포넌트에서 쓰면 에러 뜸)
  const onClick = async () => {
    const response = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify({
        username: "승종",
        password: "a12345678",
      }),
    });
    console.log(await response.json());
  };

  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">Log in with E-mail and password.</h2>
      </div>
      <form className="flex flex-col gap-3" action={dispatch}>
        <FormInput
          type="email"
          placeholder="Email"
          name="email"
          required
          errors={[]}
        />
        <FormInput
          type="password"
          placeholder="Password"
          name="password"
          required
          errors={state?.errors ?? []}
        />
        <FormButton text="로그인" />
      </form>
      <SocialLogin />
    </div>
  );
}
