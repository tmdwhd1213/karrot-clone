import db from "@/lib/db";
// import getSession from "@/lib/session";
import { formatToWon, getProduct } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";
import getSession from "@/lib/session";
import UpperTabBar from "@/components/upper-tab-bar";

// [id]를 db조회한 후 미리 알려줘서 dynamic page를 static page로 바꾸기.
// 쿠키를 import하면 pre-render를 사용할 수 없음.
async function getIsOwner(userId: number) {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  }
  return false;
}

const getCachedProduct = nextCache(getProduct, ["product-detail"], {
  tags: ["product-detail", "xxxx"], // xxxx는 같이 캐싱됨.
});

async function getProductTitle(id: number) {
  console.log("타이틀 히트");
  const product = await db.product.findUnique({
    where: {
      id: +id,
    },
    select: {
      title: true,
    },
  });

  return product;
}

const getCachedProductTitle = nextCache(getProductTitle, ["product-title"], {
  tags: ["product-title", "xxxx"],
});

const revalidate = async () => {
  "use server";
  revalidateTag("xxxx"); // xxxx인 태그 전부를 캐싱 새로고침
  // revalidatePath("/home"); // home과 관련있는 캐시들을 nextCache 호출 새로고침뿐 아니라 api fetch도 새로고침함.
};

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getCachedProductTitle(+params.id);
  return {
    title: product?.title,
  };
}

export default async function ProductDetail({
  params,
}: {
  params: { id: string };
}) {
  // 숫자가 아닌 문자열이 들어가는 것 처리 로직
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }

  // DB에 있는 물건이 맞는지 확인하는 로직
  const product = await getProduct(id);
  if (!product) {
    return notFound();
  }

  const isOwner = await getIsOwner(product.userId);

  const createChatRoom = async () => {
    "use server";
    const session = await getSession();
    const room = await db.chatRoom.create({
      data: {
        users: {
          connect: [
            {
              id: product.userId, // 판매자
            },
            {
              id: session.id, // 구매자
            },
          ],
        },
      },
      select: {
        id: true,
      },
    });
    // redirect(`/chats/${room.id}`);
    redirect(`/chats/clzjajj8w00031qwuvmfucn9y`); // 임시
  };

  return (
    <>
      <div>
        <UpperTabBar id={id} isOwner={isOwner} />
        <div className="flex flex-col">
          <div className="relative aspect-square">
            <Image
              fill
              className="object-cover"
              src={product.photo}
              alt={product.title}
            />
          </div>
        </div>
        <div className="p-5 flex items-center gap-3 border-b border-neutral-700">
          <div className="size-10 overflow-hidden rounded-full">
            {product.user.avatar !== null ? (
              <Image
                src={product.user.avatar}
                alt={product.user.username}
                width={40}
                height={40}
              />
            ) : (
              <UserIcon />
            )}
          </div>
          <div>
            <h3>{product.user.username}</h3>
          </div>
        </div>
        <div className="p-5">
          <h1 className="text-2xl font-semibold">{product.title}</h1>
          <p>{product.description}</p>
        </div>
        <div className="fixed w-full bottom-0 left-0 p-5 pb-10 bg-neutral-800 flex justify-between items-center">
          <span className="font-semibold text-lg">
            {formatToWon(product.price)}원
          </span>
          <form action={createChatRoom}>
            <button className="bg-green-500 px-5 py-2.5 rounded-md text-white font-semibold">
              채팅하기
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

// Next.js에서 지정한 이름.
export async function generateStaticParams() {
  const products = await db.product.findMany({ select: { id: true } });
  return products.map(({ id }) => ({
    id: id + "",
  }));
}

// 오직 빌드할 떄 미리 생성된 페이지들만 찾을 수 있다. (false하면 db에 새로 생성되도 not-found)
// true의 멋진 효과 -> 새로운 DataRow가 있어서 그 주소로 들어가면 html을 새로 만들고 사용자가 볼 수 있음. (build이후 static으로 변경)
// export const dynamicParams = false; // 기본값 : true
