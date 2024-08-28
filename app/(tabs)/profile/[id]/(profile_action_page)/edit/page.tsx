"use client";
import { getUploadUrl, uploadProduct } from "@/app/(tabs)/home/add/actions";
import Button from "@/components/button";
import ProfileInput from "@/components/profile-edit-input";
import { getUserInfo } from "@/lib/db_user";
import { PhotoIcon, UserIcon } from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { editAccount } from "./action";

interface UserResult {
  id: number;
  username: string;
  avatar: string | null;
  phone: string | null;
}

export default function EditPage() {
  const [preview, setPreview] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [photoId, setPhotoId] = useState("");
  const [user, setUser] = useState<UserResult>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const userResult = async () => {
      const res = await getUserInfo();
      if (res) {
        setUser(res);
        setPreview(res.avatar ?? "");
        console.log("in useEffect: ", res);
      } else {
        console.log("useEffect doesnt work");
      }
    };
    userResult();
  }, []);
  const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    //target에서 files(이미지)를 가져와서 preview해 주는 코드
    const {
      target: { files },
    } = event;
    if (!files) {
      return;
    }
    //배열일텐데, 일단 하나 골랐으니까 첫 번째거 가져오기
    const file = files[0];

    //preview를 위한 url
    //브라우저 메모리 어딘가 저장된 이미지 파일의 url을 얻어내기
    const url = URL.createObjectURL(file);
    //그리고 그걸 preview로 정하기
    console.log("url : ", url);
    setPreview(url);

    //그 다음 CloudFlare의 upload Url을 받아낸다.
    const { success, result } = await getUploadUrl();
    if (success) {
      const { id, uploadURL } = result;
      setUploadUrl(uploadURL);
      setPhotoId(id);
      console.log(uploadURL);
    }
  };
  const onClickImage = () => {
    fileInputRef.current?.click();
  };

  //uploadProduct를 하기 전에, 이미지부터 CF에 올려주고, 그 다음에 uploadProduct를 하자
  //다시 말해, uploadProduct전에 해야할 작업이 있기 때문에, 인터셉트 해서 이미지 올리고,
  //그 다음 물품 업로드하자는 의미.
  //uploadProduct에서 이미지를 업로드하고 url받아오고 동시에 진행하면 뭔가... 복잡하지?
  //그래서 이렇게 따로 구분해서 중간단계 함수를 만들어 주었다.
  const interceptAction = async (_: any, formData: FormData) => {
    //upload image to CF
    //여러개의 input 중에서 photo라는 name인 input을 가져온다.
    const file = formData.get("avatar");

    //없으면 리턴
    //이런걸 해 줘야 타입스크립트가 불평을 하지 않음.
    //없을수도 있는걸 보여주려고 하면 타입스크립트가 미리 알고 불평을 함.
    //hey dude, 이건 없을수도 있어 그니까 확실한걸 넣어.
    //느낌표로 대신할 수도 있고, 아래와 같이 if로 체크를 해도 된다.
    if (!file) {
      formData.set("avatar", "");

      return editAccount(_, formData);
    }

    const cloudflareForm = new FormData();
    cloudflareForm.append("file", file);
    const response = await fetch(uploadUrl, {
      method: "post",
      body: cloudflareForm,
    });
    if (response.status !== 200) {
      return;
    }

    //replace 'avatar' to string url
    //photoUrl을 만들어 준다. photo의 id가 필요한데 이건 getUploadUrl에서 받아온다.
    const avatarUrl = `https://imagedelivery.net/JZTGP99uCM7XCgQ8Y2NN5Q/${photoId}/avatar`;

    //이제 formData의 photo를 파일이 아니라 string으로 바꿔준다.
    //database에 올릴땐 파일자체가 아니라 CF에 업로드되어있는 그 url string만 올려야지.
    formData.set("avatar", avatarUrl);

    return editAccount(_, formData);
    //call uploadProduct.
  };
  const [state, action] = useFormState(interceptAction, null);

  return (
    <div className="p-5  h-screen mt-4 ">
      <div className="bg-neutral-800  rounded-lg shadow">
        <form action={action} className="flex flex-col gap-5 p-5 items-center">
          <div className="flex justify-center w-full px-10 py-2 items-center gap-0">
            <label
              htmlFor="photo"
              className="size-16 border-1 flex items-center justify-center flex-col rounded-full border-dashed cursor-pointer bg-center bg-cover bg-neutral-700"
              style={{
                backgroundImage: `url(${preview})`,
              }}
            >
              {preview === "" ? (
                <>
                  <UserIcon className="w-10" />
                  <div className="text-neutral-400 text-sm">
                    {/* {state?.fieldErrors.photo} */}
                  </div>
                </>
              ) : null}
            </label>
            <span
              onClick={onClickImage}
              className="cursor-pointer mt-12 ml-10 text-2xl absolute"
            >
              +
            </span>
            <input
              onChange={onImageChange}
              type="file"
              id="avatar"
              name="avatar"
              className="hidden"
              defaultValue=""
              ref={fileInputRef}
            />
          </div>
          <ProfileInput
            title="닉네임"
            name="username"
            placeholder={user?.username ?? "익명의_오이러"}
            type="text"
            errors={state?.fieldErrors.username}
          />

          <ProfileInput
            title="Password"
            name="password"
            placeholder="비밀번호 변경"
            type="password"
            errors={state?.fieldErrors.password}
          />
          <ProfileInput
            title="Password confirm"
            name="confirmPassword"
            placeholder="비밀번호 확인"
            type="password"
            errors={state?.fieldErrors.confirmPassword}
          />
          <ProfileInput
            title="Phone"
            name="phone"
            placeholder={user?.phone ?? ""}
            type="tel"
            errors={state?.fieldErrors.phone}
          />
          <Button text="완료" edit />
        </form>
      </div>
    </div>
  );
}
