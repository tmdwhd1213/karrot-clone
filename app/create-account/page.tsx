"use client";

import Input from "../components/input";
import Button from "../components/button";
import SocialLogin from "../components/social-login";
import { useFormState } from "react-dom";
import { createAccount } from "./actions";
import {
  PASSWORD_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
} from "../lib/constants";

export default function CreateAccount() {
  const [state, dispatch] = useFormState(createAccount, null);
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">Fill in the form below to join!</h2>
      </div>
      <form action={dispatch} className="flex flex-col gap-3">
        <Input
          type="text"
          placeholder="Username"
          name="username"
          required
          errors={state?.fieldErrors.username}
          minLength={USERNAME_MIN_LENGTH}
          maxLength={USERNAME_MAX_LENGTH}
        />
        <Input
          type="email"
          placeholder="Email"
          name="email"
          required
          errors={state?.fieldErrors.email}
        />
        <Input
          type="password"
          placeholder="Password"
          name="password"
          minLength={PASSWORD_MIN_LENGTH}
          required
          errors={state?.fieldErrors.password}
        />
        <Input
          type="password"
          placeholder="Confirm Password"
          name="confirmPassword"
          required
          minLength={PASSWORD_MIN_LENGTH}
          errors={state?.fieldErrors.confirmPassword}
        />
        <Button text="Create account" />
      </form>
      <SocialLogin />
    </div>
  );
}
