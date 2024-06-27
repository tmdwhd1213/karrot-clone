"use server";
export async function onSubmit(prevState: any, data: FormData) {
  console.log(prevState);
  if (prevState === null) {
    // send sms
    return {
      sms: true,
    };
  }
  await new Promise((resolve) => setTimeout(resolve, 2000));
  // input에 name 어트리뷰트를 설정해야지 FormData 객체가 바라볼 수 있음.
  console.log(data.get("email"), data.get("password"));
  return {
    errors: ["wrong password", "password too short"],
  };
}
