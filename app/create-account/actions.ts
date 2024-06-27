"use server";
import { z } from "zod";

// const usernameSchema = z.string().min(5).max(10);
const formSchema = z.object({
  username: z.string().min(3).max(10),
  email: z.string().email(),
  password: z.string().min(10),
  confirmPassword: z.string().min(10),
});

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };
  // formSchema.parse()는 런타임 에러를 일으킴.(try catch문 써야함.)
  // safeParse는 결과를 반환하기에 try catch 안 써도 됨.
  const result = formSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  }
}
