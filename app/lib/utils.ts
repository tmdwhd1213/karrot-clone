import getSession from "./session";

export async function saveSession(id: number) {
  const session = await getSession();
  session.id = id;
  await session.save();
}

// Github response, request
export async function getAccessToken(code: string) {
  const accessTokenParams = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code,
  }).toString();
  const accessTokenURL = `https://github.com/login/oauth/access_token?${accessTokenParams}`;
  const result = await (
    await fetch(accessTokenURL, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();

  return result;
}

export async function getGithubProfile(access_token: string) {
  const userProfileResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: "no-cache",
  });

  return userProfileResponse;
}

export async function getGithubEmail(access_token: string) {
  const emailResponse = await fetch("https://api.github.com/user/emails", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: "no-cache",
  });

  return emailResponse;
}
