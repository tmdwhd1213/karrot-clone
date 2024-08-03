import db from "./db";

export function formatToWon(price: number) {
  return price.toLocaleString("ko-KR");
}

export function formatToTimeAgo(date: string): string {
  const DAY_IN_MS = 1000 * 60 * 60 * 24;
  const TIME = new Date(date).getTime();
  const NOW = new Date().getTime();
  const DIFF = Math.round((TIME - NOW) / DAY_IN_MS);
  const formatter = new Intl.RelativeTimeFormat("ko");

  return formatter.format(DIFF, "days").toString();
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

export async function getProduct(id: number) {
  console.log("물품 전체 히트");
  const product = await db.product.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });

  return product;
}
