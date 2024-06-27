"use server";
export async function onSubmit(prevState: any, data: FormData) {
  console.log(prevState);
  await new Promise((resolve) => setTimeout(resolve, 2000));
  console.log(data.get("email"), data.get("password"));
  return {
    errors: ["wrong password", "password too short"],
  };
}
