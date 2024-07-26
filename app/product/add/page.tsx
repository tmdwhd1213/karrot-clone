"use client";

import Button from "@/app/components/button";
import Input from "@/app/components/input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { uploadProduct } from "./actions";
import { useFormState } from "react-dom";

export default function AddProduct() {
  const [preview, setPreview] = useState("");
  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;

    if (!files) return;
    const file = files[0];
    // 자바스크립트는 사용자의 컴퓨터를 함부러 열람할 수 없다.
    // 사용자가 업로드한 파일을 주소로 바꿈. (브라우저는 이미지를 메모리 어딘가에 가지고 있음.)
    // 이를 위해 URL로 바꾸고 그 주소(브라우저 메모리)를 참조하여 파일을 보는 것.(보안 상의 이유)
    const url = URL.createObjectURL(file);
    setPreview(url);
  };
  const [state, action] = useFormState(uploadProduct, null);
  return (
    <div>
      <form action={action} className="p-5 flex flex-col gap-5">
        <label
          htmlFor="photo"
          style={{ backgroundImage: `url(${preview})` }}
          className="bg-center bg-cover border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer"
        >
          {!preview && (
            <>
              <PhotoIcon className="w-20" />
              <div className="text-neutral-400 text-sm">
                사진을 추가해주세요.
                {state?.fieldErrors.title}
              </div>
            </>
          )}
        </label>
        <input
          onChange={onImageChange}
          type="file"
          id="photo"
          name="photo"
          className="hidden"
        />
        <Input
          name="title"
          required
          placeholder="제목"
          type="text"
          errors={state?.fieldErrors.title}
        />
        <Input
          name="price"
          required
          placeholder="가격"
          type="number"
          errors={state?.fieldErrors.price}
        />
        <Input
          name="description"
          required
          placeholder="자세한 설명"
          type="text"
          errors={state?.fieldErrors.description}
        />
        <Button text="작성 완료" />
      </form>
    </div>
  );
}
