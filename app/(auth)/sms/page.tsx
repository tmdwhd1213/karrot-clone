"use client";

import Input from "../components/input";
import Button from "../components/button";
import SocialLogin from "../components/social-login";
import { useFormState } from "react-dom";
import { smsVerification } from "./actions";
import { TOKEN_MAX, TOKEN_MIN } from "../lib/constants";

const initialState = {
  token: false,
  error: undefined,
};

export default function SMSLogin() {
  const [state, dispatch] = useFormState(smsVerification, initialState);
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">SMS 로그인</h1>
        <h2 className="text-xl">본인 휴대전화 인증</h2>
      </div>
      <form action={dispatch} className="flex flex-col gap-3">
        {state?.token ? (
          <Input
            type="number"
            placeholder="인증 번호"
            required
            name="token"
            min={TOKEN_MIN}
            max={TOKEN_MAX}
            errors={state?.error?.formErrors}
          />
        ) : (
          <Input
            type="text"
            placeholder="휴대전화 번호"
            required
            name="phone"
            errors={state?.error?.formErrors}
          />
        )}
        <Button text={state.token ? "확인" : "인증 요청"} />
      </form>
    </div>
  );
}
