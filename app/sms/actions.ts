"use server";

import validator from "validator";
import { z } from "zod";
import { TOKEN_MAX, TOKEN_MIN } from "../lib/constants";
import { redirect } from "next/navigation";

interface ActionState {
  token: boolean;
}

const phoneSchema = z
  .string()
  .trim()
  .refine(
    (phone) => validator.isMobilePhone(phone, "ko-KR"),
    "잘못된 번호 형식이에요."
  );

const tokenSchema = z.coerce.number().min(TOKEN_MIN).max(TOKEN_MAX); // 형 변환 (coercion(강제))

export async function smsVerification(
  prevState: ActionState,
  formData: FormData
) {
  const phone = formData.get("phone");
  const token = formData.get("token");
  if (!prevState.token) {
    const result = phoneSchema.safeParse(phone);
    if (!result.success) {
      return {
        token: false,
        error: result.error.flatten(),
      };
    } else {
      return {
        token: true,
      };
    }
  } else {
    const result = tokenSchema.safeParse(token);
    if (!result.success) {
      return {
        token: true,
        // return the errors
        error: result.error.flatten(),
      };
    } else {
      redirect("/");
    }
  }
}
