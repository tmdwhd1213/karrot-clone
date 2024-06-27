"use server";
import { z } from "zod";

const checkUsername = (username: string) => !username.includes("병신");

const checkPasswords = ({
  password,
  confirmPassword,
}: {
  password: string;
  confirmPassword: string;
}) => password === confirmPassword;

// const usernameSchema = z.string().min(5).max(10);
const formSchema = z
  .object({
    // optional() 메서드를 붙이지 않으면 required라는 것을 의미함.
    username: z
      .string({
        invalid_type_error: "이름에는 문자만 입력해주세요.",
        required_error: "이름을 입력해주세요.",
      })
      .min(3, "너무 짧아요. 3글자 이상 입력해주세요.")
      .max(10, "너무 길어요. 10글자 이하로 입력해주세요.")
      .refine(checkUsername, "욕설을 포함한 단어는 이름으로 설정할 수 없어요."),
    email: z.string().email("이메일 형식이 올바른지 확인해주세요."),
    password: z.string().min(10, "비밀번호는 최소 10글자 이상 입력해주세요."),
    confirmPassword: z
      .string()
      .min(10, "비밀번호는 최소 10글자 이상 입력해주세요."),
  })
  // 전체 form에 대한 커스텀 에러를 만들었지만, 비밀번호 확인란 UI에 떠야함.
  // 따라서 2번째 인수에 문자열이 아닌 message와 path 프로퍼티를 가진 객체를 전달해
  // path는 떠야할 필드의 이름(input 어트리뷰트의 name)
  .refine(checkPasswords, {
    message: "비밀번호와 비밀번호 확인란이 일치하지 않아요.",
    path: ["confirmPassword"],
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
    console.log(result.error.flatten());
    return result.error.flatten();
  }
}
