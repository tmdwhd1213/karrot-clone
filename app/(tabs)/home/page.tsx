import ProductList from "@/components/product-list";
import db from "@/lib/db";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Prisma } from "@prisma/client";
import { unstable_cache as nextCache, revalidatePath } from "next/cache";
import Link from "next/link";

// static 페이지를 build할 때 dynamic 페이지로 강제설정
// export const dynamic = "force-dynamic";

// production mode에서 쓰이는 (dev모드 X) revalidate를 이용한 60초마다 리프래쉬 해주는 것.
export const revalidate = 10;

// title에 나타날 것.
export const metadata = {
  title: "Home",
};

export type InitialProducts = Prisma.PromiseReturnType<
  typeof getInitialProducts
>;

// 데이터베이스를 여러번 hit하는 것은 비용이 많이 듦. 따라서 nextjs에서 캐싱한 데이터를 가져다 쓰기.
// 데이터를 가져오는데 이전과 같을 때 캐싱을 사용하고, 새로운 데이터가 추가될 때 새로운 데이터를 보여줘야함.
const getCachedProducts = nextCache(getInitialProducts, ["home-products"], {
  // 이 함수가 호출되면 60초를 셈. 만약 사용자가 호출되고 60초 이전에 한번 더 호출하면 캐싱된 데이터를 보여줌.
  // 60초마다 한번씩 호출 ㄴㄴ!!!
  revalidate: 60,
});

async function getInitialProducts() {
  console.log("hit!!!");
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    // 임시
    // take: 1,
    orderBy: {
      created_at: "desc",
    },
  });

  return products;
}

// 모달 주변 클릭 시 탈출

export default async function Products() {
  const initialProducts = await getInitialProducts();

  const revalidate = async () => {
    "use server";
    // 해당 경로에 있는 모든 캐시들은 새로고침된다. (next/cache의 revalidatePath('string'))
    revalidatePath("/home");
  };

  return (
    <div>
      <ProductList initialProducts={initialProducts} />
      <form action={revalidate}>
        <button>Revalidate</button>
      </form>
      <Link
        href="/product/add"
        className="bg-green-500 flex items-center justify-center rounded-full size-16 fixed bottom-24 right-8 text-white transition-colors hover:bg-green-400"
      >
        <PlusIcon className="size-10" />
      </Link>
    </div>
  );
}
