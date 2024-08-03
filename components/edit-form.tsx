"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
// import { debounce } from "lodash";

interface ProductType {
  id: number;
  title: string;
  price: number;
  description: string;
  photo: string;
  created_at: Date;
  updated_at: Date;
  userId: number;
}

interface UserProdcutType extends ProductType {
  user: {
    username: string;
    avatar: string | null;
  };
}

export default function EditForm({
  uploadProduct,
  product,
}: {
  uploadProduct: any;
  product: UserProdcutType;
}) {
  const [preview, setPreview] = useState("");
  const imageRef = useRef(null);
  const [formData, setFormData] = useState({
    title: "",
    price: 0,
    description: "",
    photo: "",
  });
  useEffect(() => {
    setPreview(product.photo);
    setFormData({
      photo: product.photo,
      title: product.title,
      price: product.price,
      description: product.description,
    });
  }, [product]);

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;
    if (!files) {
      return;
    }
    const file = files[0];
    const url = URL.createObjectURL(file);

    setPreview(url);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [state, action] = useFormState<any>(uploadProduct, null);

  return (
    <div>
      <form action={action} className="p-5 flex flex-col gap-5">
        <input id="id" name="id" className="hidden" value={product.id} />
        <label
          htmlFor="photo"
          className="border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover"
          style={{
            backgroundImage: `url(${preview})`,
          }}
        >
          {preview === "" ? (
            <>
              <PhotoIcon className="w-20" />
              <div className="text-neutral-400 text-sm">
                사진을 추가해주세요.
                {state?.fieldErrors.photo}
              </div>
            </>
          ) : null}
        </label>
        {!imageRef.current ? (
          <>
            <input
              onChange={onImageChange}
              type="text"
              value={formData.photo}
              id="tempPhoto"
              name="tempPhoto"
              className="hidden"
            />
            <input
              onChange={onImageChange}
              type="file"
              id="photo"
              name="photo"
              accept="image/*"
              className="hidden"
            />
          </>
        ) : (
          <input
            onChange={onImageChange}
            type="file"
            id="photo"
            name="photo"
            accept="image/*"
            className="hidden"
          />
        )}

        <Input
          name="title"
          required
          placeholder="제목"
          type="text"
          value={formData.title}
          onChange={handleChange}
          errors={state?.fieldErrors.title}
        />
        <Input
          name="price"
          type="number"
          required
          placeholder="가격"
          value={formData.price}
          onChange={handleChange}
          errors={state?.fieldErrors.price}
        />
        <Input
          name="description"
          type="text"
          required
          placeholder="자세한 설명"
          value={formData.description}
          onChange={handleChange}
          errors={state?.fieldErrors.description}
        />
        <Button text="작성 완료" />
      </form>
    </div>
  );
}
