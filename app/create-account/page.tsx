"use client";

import Input from "../components/input";
import Button from "../components/button";
import SocialLogin from "../components/social-login";
import { useFormState } from "react-dom";
import { createAccount } from "./actions";

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
          minLength={3}
          maxLength={10}
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
          minLength={4}
          required
          errors={state?.fieldErrors.password}
        />
        <Input
          type="password"
          placeholder="Confirm Password"
          name="confirmPassword"
          required
          minLength={4}
          errors={state?.fieldErrors.confirmPassword}
        />
        <Button text="Create account" />
      </form>
      <SocialLogin />
    </div>
  );
}
