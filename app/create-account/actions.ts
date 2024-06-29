"use server";
import { z } from "zod";
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
} from "../lib/constants";
import db from "../lib/db";

const checkUsername = (username: string) => !username.includes("병신");

const checkPasswords = ({
  password,
  confirmPassword,
}: {
  password: string;
  confirmPassword: string;
}) => password === confirmPassword;

const checkUniqueUsername = async (username: string) => {
  const user = await db.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
    },
  });
  // 존재하면 안되니까 찾은 값의 반대로
  return !Boolean(user);
};

const checkUniqueEmail = async (email: string) => {
  const userEmail = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });
  // 존재하면 안되니까 찾은 값의 반대로
  return !Boolean(userEmail);
};

// const usernameSchema = z.string().min(5).max(10);
const formSchema = z
  .object({
    // optional() 메서드를 붙이지 않으면 required라는 것을 의미함.
    username: z
      .string({
        invalid_type_error: "이름에는 문자만 입력해주세요.",
        required_error: "이름을 입력해주세요.",
      })
      .min(USERNAME_MIN_LENGTH, "너무 짧아요. 3자 이상 입력해주세요.")
      .max(USERNAME_MAX_LENGTH, "너무 길어요. 10자 이하로 입력해주세요.")
      .trim()
      .toLowerCase()
      .refine(checkUsername, "욕설을 포함한 단어는 이름으로 설정할 수 없어요.")
      .refine(checkUniqueUsername, "이미 존재하는 사용자명이에요."),
    email: z
      .string()
      .email("이메일 형식이 올바른지 확인해주세요.")
      .toLowerCase()
      .refine(checkUniqueEmail, "이미 존재하는 이메일이에요."),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH, "비밀번호는 최소 8자 이상 입력해주세요.")
      .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirmPassword: z.string(),
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
  const result = await formSchema.safeParseAsync(data); // async가 하나라도 포함되어있을때
  if (!result.success) {
    console.log(result.error.flatten());
    return result.error.flatten();
  } else {
    // 비밀번호 암호화(hashing)
    // user를 db에 저장
    // 저장되면 로그인되게 구현
    // redirect "/home"
    console.log();
  }
}
