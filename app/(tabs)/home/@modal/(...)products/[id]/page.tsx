import CloseButton from "@/components/close-button";
import CloseOnClick from "@/components/close-click";
import CloseOnEscape from "@/components/close-escape";
import { formatToWon, getProduct } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function Modal({ params }: { params: { id: number } }) {
  if (isNaN(params.id)) {
    return notFound();
  }
  const product = await getProduct(+params.id);
  if (!product) {
    return notFound();
  }

  return (
    <>
      <CloseOnEscape />
      <div className="absolute w-full h-full z-50 flex justify-center items-center bg-black bg-opacity-60 left-0 top-0">
        <CloseOnClick>
          <div className="max-w-screen-sm h-3/4 w-full flex justify-center">
            <CloseButton />
            <div className="flex flex-col">
              <div className="p-5 flex items-center">
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
              <div className="flex-col gap-1 aspect-square bg-neutral-900 text-neutral-200 rounded-md flex">
                <div className="relative aspect-square flex justify-center min-w-[350px]">
                  <Image
                    className="object-cover"
                    fill
                    src={product.photo}
                    alt={product.title}
                  />
                </div>

                <div className="p-5">
                  <h1 className="text-2xl font-semibold">{product.title}</h1>
                  <p className="">{product.description}</p>
                </div>
                <div className="w-full bottom-0 left-0 p-5 pb-3 flex justify-between items-center">
                  <span className="font-semibold text-lg">
                    {formatToWon(product.price)}원
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CloseOnClick>
      </div>
    </>
  );
}
