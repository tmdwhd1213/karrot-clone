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

export const SUPABASE_PUBLIC_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93b21neWlnb3l5eWl5dGxzZnZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI5NTg2MDEsImV4cCI6MjAzODUzNDYwMX0.u7IvloefO1BHcQ_X-IpkpYBZHKML7KRuetG4g0qcUeY";

export const SUPABASE_URL = "https://owomgyigoyyyiytlsfvx.supabase.co";
