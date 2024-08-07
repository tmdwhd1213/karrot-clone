export const PASSWORD_REGEX = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$/
);

export const PASSWORD_REGEX_ERROR =
  "비밀번호는 소문자, 대문자, 숫자, 특수문자를 포함해야 합니다.";

export const PASSWORD_MIN_LENGTH = 8;

export const USERNAME_MIN_LENGTH = 3;

export const USERNAME_MAX_LENGTH = 10;

export const TOKEN_MIN = 100000;
export const TOKEN_MAX = 999999;

export const AVATAR_SIZE = 28;

export const CHAT_AVATAR_SIZE = 50;
