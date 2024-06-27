"use client";

import FormInput from "../components/form-input";
import FormButton from "../components/form-button";
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
        <FormInput
          type="text"
          placeholder="Username"
          name="username"
          required
          errors={state?.fieldErrors.username}
        />
        <FormInput
          type="email"
          placeholder="Email"
          name="email"
          required
          errors={state?.fieldErrors.email}
        />
        <FormInput
          type="password"
          placeholder="Password"
          name="password"
          required
          errors={state?.fieldErrors.password}
        />
        <FormInput
          type="password"
          placeholder="Confirm Password"
          name="confirmPassword"
          required
          errors={state?.fieldErrors.confirmPassword}
        />
        <FormButton text="Create account" />
      </form>
      <SocialLogin />
    </div>
  );
}
