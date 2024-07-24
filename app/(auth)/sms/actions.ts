"use server";

import validator from "validator";
import { z } from "zod";
import { TOKEN_MAX, TOKEN_MIN } from "@/app/lib/constants";
import { redirect } from "next/navigation";
import db from "@/app/lib/db";
import crypto from "crypto";
import twilio from "twilio";
import { saveSession } from "@/app/lib/session";

interface ActionState {
  token: boolean;
  phone?: string;
}

const phoneSchema = z
  .string()
  .trim()
  .refine(
    (phone) => validator.isMobilePhone(phone, "ko-KR"),
    "잘못된 번호 형식이에요."
  );

async function tokenExists(token: number) {
  const exists = await db.sMSToken.findUnique({
    where: {
      token: token.toString(),
    },
    select: {
      id: true,
    },
  });
  return Boolean(exists);
}

const tokenSchema = z.coerce
  .number()
  .min(TOKEN_MIN)
  .max(TOKEN_MAX)
  .refine(tokenExists, "존재하지 않는 인증번호에요."); // 형 변환 (coercion(강제))

async function getToken() {
  const token = crypto.randomInt(TOKEN_MIN, TOKEN_MAX).toString();
  const exists = await db.sMSToken.findUnique({
    where: {
      token,
    },
    select: {
      id: true,
    },
  });

  if (exists) {
    return getToken();
  } else {
    return token;
  }
}

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
      // delete prev token
      await db.sMSToken.deleteMany({
        where: {
          user: {
            phone: result.data,
          },
        },
      });
      // create token
      const token = await getToken();
      await db.sMSToken.create({
        data: {
          token,
          user: {
            // 연결하는데 만약 없으면 create -> connectOrCreate
            connectOrCreate: {
              where: {
                phone: result.data,
              },
              create: {
                username: crypto.randomBytes(10).toString("hex"),
                phone: result.data,
              },
            },
          },
        },
      });
      // send the token using twillio
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
      await client.messages.create({
        body: `오이마켓 인증번호: ${token}`,
        from: process.env.TWILIO_PHONE_NUMBER!,
        to: process.env.MY_PHONE_NUMBER!, // 원래는 그러나 체험판이므로 내 폰번호 result.data
      });
      return {
        token: true,
        phone,
      };
    }
  } else {
    const result = await tokenSchema.safeParseAsync(token);
    if (!result.success) {
      return {
        ...prevState,
        // return the errors
        error: result.error.flatten(),
      };
    } else {
      // get the userId of token
      const token = await db.sMSToken.findUnique({
        where: {
          token: result.data.toString(),
        },
        select: {
          id: true,
          userId: true,
          user: true,
        },
      });
      if (token) {
        if (prevState.phone !== token.user.phone) {
          return {
            ...prevState,
            error: { formErrors: ["올바르지 않은 인증번호입니다."] },
          };
        }
        await saveSession(token.userId);
        await db.sMSToken.delete({
          where: {
            id: token.id,
          },
        });
      }
      // log the user in
      redirect("/profile");
    }
  }
}
