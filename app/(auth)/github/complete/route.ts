import db from "@/lib/db";
import { saveSession } from "@/lib/session";
import { getAccessToken, getGithubEmail, getGithubProfile } from "@/lib/utils";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    // Bad Request
    return new Response(null, {
      status: 400,
    });
  }

  const { error, access_token } = await getAccessToken(code);

  if (error) {
    return new Response(null, {
      status: 400,
    });
  }

  const { id, avatar_url, login } = await (
    await getGithubProfile(access_token)
  ).json();
  const [{ email }] = await (await getGithubEmail(access_token)).json();

  const user = await db.user.findUnique({
    where: {
      github_id: id + "",
    },
    select: {
      id: true,
    },
  });
  if (user) {
    await saveSession(user.id);
    return redirect("/profile");
  }
  const existUsername = await db.user.findUnique({
    where: {
      username: login,
    },
    select: {
      id: true,
    },
  });
  const newUser = await db.user.create({
    data: {
      username: !existUsername ? login : `${login}-github`,
      github_id: id + "",
      avatar: avatar_url,
    },
    select: {
      id: true,
    },
  });
  await saveSession(newUser.id);
  return redirect("/profile");
}
