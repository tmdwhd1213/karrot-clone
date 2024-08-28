import { cls } from "@/lib/utils";
import { StarIcon } from "@heroicons/react/24/solid";

interface ReviewsProps {
  averageRatings: string;
  reviews: {
    user: {
      username: string;
      avatar: string | null;
    };
    id: number;
    created_at: Date;
    reviewMessage: string | null;
    rating: number;
    product: {
      title: string;
    };
  }[];
  countRatings: {
    [key: number]: number;
  };
}

export default function ReviewsComponent({
  averageRatings,
  reviews,
  countRatings,
}: ReviewsProps) {
  const starRate = [1, 2, 3, 4, 5];
  return (
    <div className="w-full mx-auto px-5 py-8 bg-neutral-800 flex flex-col gap-2">
      <h1 className="text-xl font-bold">매너온도</h1>
      <hr />
      <div className="grid grid-cols-3 ">
        <div className="flex flex-col gap-2 justify-center items-center">
          <div className="text-6xl font-bold">{averageRatings}</div>
          <div className="flex items-center *:size-4 gap-2">
            {starRate.map((star) => (
              <StarIcon
                key={star}
                className={`size-4 ${cls(
                  Number(averageRatings) >= star
                    ? "text-yellow-400"
                    : "text-gray-400"
                )}`}
              />
            ))}
          </div>
          <div className="text-gray-400 text-sm">
            받은 매너 평가: {reviews.length}
          </div>
        </div>
        <div className="  col-span-2 flex flex-col  justify-center items-center ">
          {starRate.reverse().map((star, idx) => (
            <div className="flex items-center justify-evenly w-full" key={idx}>
              <span className="text-gray-400">{star}</span>
              <progress
                className="progress w-56 "
                value={countRatings[star] ?? 0}
                max={Object.keys(countRatings).length}
              ></progress>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
