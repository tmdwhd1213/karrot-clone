import Input from "../components/input";
import Button from "../components/button";
import SocialLogin from "../components/social-login";

export default function SMSLogin() {
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">SMS Login</h1>
        <h2 className="text-xl">Verify your Phone Number.</h2>
      </div>
      <form className="flex flex-col gap-3">
        <Input
          type="number"
          placeholder="Phone number"
          required
          name="phoneNumber"
          errors={[]}
        />
        <Input
          type="number"
          placeholder="Verification Code"
          required
          name="verificationCode"
          errors={[]}
        />
        <Button text="Verify" />
      </form>
    </div>
  );
}
