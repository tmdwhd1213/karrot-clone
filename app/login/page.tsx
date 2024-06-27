import FormInput from "../components/form-input";
import FormButton from "../components/form-button";
import SocialLogin from "../components/social-login";

export default function LoginPage() {
  const onSubmit = async (data: FormData) => {
    "use server";
    console.log(data.get("email"), data.get("password"));
  };
  const onClick = async () => {
    const response = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify({
        username: "승종",
        password: "a12345678",
      }),
    });
    console.log(await response.json());
  };

  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">Log in with E-mail and password.</h2>
      </div>
      <form className="flex flex-col gap-3" action={onSubmit}>
        <FormInput
          type="email"
          placeholder="Email"
          name="email"
          required
          errors={[]}
        />
        <FormInput
          type="password"
          placeholder="Password"
          name="password"
          required
          errors={[]}
        />
        <FormButton loading={false} text="로그인" />
      </form>
      <SocialLogin />
    </div>
  );
}
