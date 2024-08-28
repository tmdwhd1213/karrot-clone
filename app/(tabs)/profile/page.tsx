import ProfileButtons from "@/components/profile-buttons";
import ReviewsComponent from "@/components/reviews";
import { AVATAR_SIZE } from "@/lib/constants";
import { getReviewsInfo, getUserInfo, logOut } from "@/lib/db_user";
import { cls } from "@/lib/utils";
import { StarIcon, UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";

interface ReviewsResponse {
  id: number;
  reviewMessage: string | null;
  rating: number;
  user: {
    username: string;
    avatar: string | null;
  };
  product: {
    title: string;
  };
  created_at: Date;
}

interface NumericDictionary {
  [key: number]: number;
}

export default async function Profile() {
  //user profile 가져오기
  const user = await getUserInfo();

  //review 가져오기
  const reviews = await getReviewsInfo();

  //rating 평균 계산하기
  function calculateAverageRating(reviews: ReviewsResponse[]): number {
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
    return averageRating;
  }

  //rating 갯수 구하기
  function getCountRatings(reviews: ReviewsResponse[]): {
    [key: number]: number;
  } {
    return reviews.reduce((acc: NumericDictionary, { rating }) => {
      acc[rating] = (acc[rating] || 0) + 1;
      return acc;
    }, {});
  }

  const averageRatings = calculateAverageRating(reviews).toFixed(1);
  //ratings max 갯수
  const countRatings = getCountRatings(reviews);
  console.log("평균 Rate:" + averageRatings);
  console.log("Rating Count:" + JSON.stringify(countRatings));

  interface ProfileButtonProps {
    path: string;
    title: string;
  }
  const buttonTitles: ProfileButtonProps[] = [
    { path: "purchase", title: "구매물품" },
    { path: "sale", title: "판매물품" },
    { path: "reservation", title: "예약물품" },
  ];

  return (
    <div className="p-6 h-screen flex flex-col gap-4 items-center">
      <div className="w-full mx-auto px-5 py-8 flex flex-col gap-2 bg-neutral-800 shadow">
        <section className="flex gap-5">
          <div className="w-12 h-12 overflow-hidden rounded-full ">
            {user?.avatar ? (
              <Image
                width={48}
                height={48}
                src={user?.avatar}
                alt={user?.username}
                className="object-cover"
              />
            ) : (
              <UserIcon className="bg-neutral-500" />
            )}
          </div>
          <div className="flex justify-center items-center gap-3">
            <h1 className="text-2xl">{`${
              user?.username ?? "익명의_오이러"
            }`}</h1>
            <p className="text-gray-500">{user?.email ?? user?.phone}</p>
          </div>
        </section>
        <section className="mt-3 py-1 rounded-md">
          <ProfileButtons id={user?.id} path="edit" title="프로필 수정" />
        </section>
        <section>
          <form action={logOut} className="w-full">
            <button className="w-full bg-green-500 rounded-md py-1 font-bold hover:bg-green-600 transition-colors">
              Log Out
            </button>
          </form>
        </section>
        <section>
          <ReviewsComponent
            averageRatings={averageRatings}
            countRatings={countRatings}
            reviews={reviews}
          />
        </section>
      </div>
      <section className="bg-neutral-800 rounded-md mx-auto w-full flex flex-col">
        {buttonTitles.map(({ path, title }: ProfileButtonProps, idx) => (
          <ProfileButtons key={idx} id={user?.id} title={title} path={path} />
        ))}
      </section>
      {reviews.length ? (
        <div className="flex flex-col gap-4 w-full mx-auto px-5 py-8 bg-neutral-800 shadow text-white">
          {reviews.map((review) => (
            <div key={review.id} className="grid grid-cols-3 h-16">
              <div className="flex justify-start  items-center gap-4 ">
                <div className="flex">
                  {review.user.avatar ? (
                    <Image
                      src={review.user.avatar}
                      alt={review.user.username}
                      width={28}
                      height={28}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="rounded-full size-8 bg-gray-400 ">
                      <UserIcon />
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1  justify-center items-start">
                  <div className="text-lg">{review.user.username}</div>
                  <div className="text-gray-700 text-xs bg-slate-200 rounded-2xl px-2 py-1">
                    구매자
                  </div>
                </div>
              </div>
              <div className="col-span-2 flex flex-col gap-1 justify-center ">
                <div>
                  <div className="flex items-center ">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        className={`size-4 ${cls(
                          review.rating >= star
                            ? "text-yellow-400"
                            : "text-gray-400"
                        )}`}
                      />
                    ))}
                  </div>
                </div>
                <div>{review.reviewMessage}</div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
