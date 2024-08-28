"use client";
import { createReview } from "@/app/chats/[id]/action";
import { useState } from "react";
import { useFormState } from "react-dom";

export default function CreateReview({ productId }: { productId: number }) {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);

  const setRatingWithHover = (index: number) => {
    setHover(index);
    if (rating > 5) {
      setRating(5);
      return;
    }
    setRating(index);
  };

  const interceptReview = (_: any, formData: FormData) => {
    formData.set("rating", rating.toString());
    formData.set("productId", productId.toString());
    return createReview(_, formData);
  };
  const [state, action] = useFormState(interceptReview, null);

  return (
    <div className="w-full px-6 py-2 bg-neutral-800 rounded-md flex justify-between items-center text-white">
      <div className="flex flex-col items-center gap-4 w-full pb-4">
        <span className="mt-4">거래는 만족스러우셨나요?</span>
        <div className="flex items-center *:size-6 gap-1 ">
          {[1, 2, 3, 4, 5].map((star, index) => {
            return (
              <button
                key={index}
                className={`w-10 h-10 ${
                  index <= (hover || rating)
                    ? "text-yellow-500"
                    : "text-gray-300"
                }`}
                onClick={() => setRating(index)}
                onMouseEnter={() => setRatingWithHover(index)}
                onMouseLeave={() => setHover(rating)}
              >
                <svg
                  className="w-full h-full"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              </button>
            );
          })}
        </div>
        <form action={action} className="flex flex-col w-full px-6 gap-4">
          <input
            name="review"
            type="text"
            placeholder="리뷰를 입력해 주세요."
            className="rounded-md"
          />
          <button className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap ">
            리뷰올리기
          </button>
        </form>
      </div>
    </div>
  );
}
