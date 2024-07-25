"use server";

export async function uploadProduct(formData: FormData) {
  const data = {
    photo: formData.get("photo"),
    title: formData.get("title"),
    price: formData.get("price"),
    description: formData.get("description"),
  };

  console.log(data);
}

// 코드챌린지: 1. 유저가 업로드했는지 확인할 것.
// 2. 이미지 사이즈가 10MB 이하인지 확인할 것.
