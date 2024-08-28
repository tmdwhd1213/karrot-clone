import db from "./db";

export function formatToWon(price: number) {
  return price.toLocaleString("ko-KR");
}

export function capitalized(word: string): string {
  if (word.length === 0) return word;
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

// export function formatToTimeAgo(date: string): string {
//   const DAY_IN_MS = 1000 * 60 * 60 * 24;
//   const TIME = new Date(date).getTime();
//   const NOW = new Date().getTime();
//   const DIFF = Math.round((TIME - NOW) / DAY_IN_MS);
//   const formatter = new Intl.RelativeTimeFormat("ko");

//   return formatter.format(DIFF, "days").toString();
// }

export function formatToTimeAgo(date: string): string {
  function time(unitInMs: number, unit: Intl.RelativeTimeFormatUnit): string {
    const TIME = new Date(date).getTime();
  const NOW = new Date().getTime();
  const DIFF = NOW - TIME;
    const times = Math.round(DIFF / unitInMs);
    return formatter.format(-times, unit).toString();
  }

  const SECONDS_IN_MS = 1000;
  const MINUTES_IN_MS = SECONDS_IN_MS * 60;
  const HOURS_IN_MS = MINUTES_IN_MS * 60;
  const DAYS_IN_MS = HOURS_IN_MS * 24;

  const TIME = new Date(date).getTime();
  const NOW = new Date().getTime();
  const DIFF = NOW - TIME;

  const formatter = new Intl.RelativeTimeFormat("ko");

  switch (true) {
    // case DIFF < MINUTES_IN_MS:
    //   return time(SECONDS_IN_MS, "seconds");
    case DIFF < HOURS_IN_MS:
      return time(MINUTES_IN_MS, "minutes");
    case DIFF < DAYS_IN_MS:
      return time(HOURS_IN_MS, "hours");
    default:
      return time(DAYS_IN_MS, "days");
  }
}

export const calculateLeftDday = (eventDate: string) => {
  const today = new Date();
  const locale = today.toDateString();
  const calLocale = new Date(locale);
  const targetDate = new Date(eventDate);
  const daysToAdd = 7;

  targetDate.setDate(targetDate.getDate() + daysToAdd);
  const localeTarget = targetDate.toDateString();

  const calLocaleTarget = new Date(localeTarget);

  const result =
    (calLocaleTarget.getTime() - calLocale.getTime()) / (24 * 60 * 60 * 1000);
  console.log("구매확정 마감일 : ", localeTarget);
  console.log("오늘 날짜 : ", locale);
  console.log("D-day", result);
  return Number(result);
};

//클래스 이름 추가하기
export function cls(...classname: string[]) {
  return classname.join(" ");
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
