"use server";

import db from "@/lib/db";
import bcrypt from "bcrypt";
import { z } from "zod";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";
import getSession from "@/lib/session";
// import { revalidateTag } from "next/cache";

function checkUsername(username: string) {
  return !username.includes("potato");
}
function checkPassword({
  password,
  confirmPassword,
}: {
  password?: string;
  confirmPassword?: string;
}) {
  return password === confirmPassword;
}

// 패스워드 검증 스키마 정의
const passwordSchema = z.string().refine(
  (data) => {
    // 비어 있지 않을 경우 길이 검사 수행
    if (data !== "") {
      return data.length >= 8; // 최소 길이 조건
    }
    return true; // 비어 있는 경우 검증을 건너뛰고 유효한 것으로 간주
  },
  {
    message: "Password must be at least 8 characters long", // 오류 메시지
  }
);
const avatarSchema = z.string().refine(
  (data) => {
    if (data !== "") {
      return true;
    }
    return true;
  },
  {
    message: "avatar error message 입니다", // 오류 메시지
  }
);

const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: "사용자의 이름은 숫자로 구성할 수 없습니다.",
      })
      .toLowerCase()
      .trim()
      .refine(checkUsername, "포테이토는 안됩니다. error"),

    password: passwordSchema,
    // .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirmPassword: passwordSchema,
    phone: z.string(),
    avatar: avatarSchema,
  }) //refine을 오브젝트 전체에 넣을 수 있다. 여러 개의 항목을 동시에 체크하기 위해
  .superRefine(async ({ phone }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        phone,
      },
      select: {
        id: true,
      },
    });
    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "이미 사용중인 번호입니다.",
        path: ["phone"],
        fatal: true,
      });
      return z.NEVER;
    }
  })
  .superRefine(async ({ username }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
      },
    });
    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "이미 사용중인 이름입니다.",
        path: ["username"],
        fatal: true,
      });
      return z.NEVER;
    }
  })
  .refine(checkPassword, {
    message: "패스워드가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

interface EditDataForm {
  [key: string]: string | null;
}

export async function editAccount(prevState: any, formData: FormData) {
  //formData에 담겨 있는 것을 data 오브젝트에 모두 넣어주고 있다.
  //여기 있는 username, email, password, confirmPassword 등은 Input의 name을 참조하고 있다.
  const data = {
    username: formData.get("username"),
    phone: formData.get("phone"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    avatar: formData.get("avatar"),
  };
  //filter data
  //undefine이나 "" 공란이라면 update하지 않겠다.
  function filterValidData(data: any) {
    const filtered: EditDataForm = {};
    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined && data[key] !== "") {
        filtered[key] = data[key];
      }
    });
    console.log("필터된 데이터는 : ", filtered);
    return filtered;
  }

  const session = await getSession();

  const result = await formSchema.safeParseAsync(data);

  if (!result.success) {
    return result.error.flatten();
    //실패하면 에러를 리턴
  } else {
    //성공하면 무언가를 해야겠지
    //check if username is taken
    //check if the email is already used
    //hash passowrd

    const validUpdate = filterValidData(result.data);

    const hashedPassword = await bcrypt.hash(result.data.password, 12);
    if (validUpdate.password) {
      validUpdate.password = hashedPassword;
    }

    delete validUpdate.confirmPassword;
    console.log("Update user data : ", validUpdate);

    const user = await db.user.update({
      where: {
        id: session.id,
      },
      data: validUpdate,
      select: {
        id: true,
      },
    });

    // revalidateTag("user-detail");
    //save the user to db (with prisma)
    //log the user in
    //redirect "/home"
  }
}