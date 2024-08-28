import { formatToWon } from "@/lib/utils";
import Image from "next/image";
import { getReservation } from "./action";
import { revalidateTag } from "next/cache";

export default async function ReservationPage() {
  const products = await getReservation();
  revalidateTag("product-reservation");
  return (
    <div className="p-6 h-screen flex flex-col gap-4 items-center text-white">
      <div className="w-full mx-auto px-5 py-8 bg-neutral-800  rounded-lg shadow">
        <h1 className="text-xl font-bold">Reservation List</h1>
        <hr />
        <div className="flex flex-col gap-3 mt-4 px-4">
          {products.map((product) => (
            <div key={product.id}>
              <div className="grid grid-cols-5  gap-4 mb-2 p-2 rounded-lg shadow-md">
                <div className="relative w-20 h-20 flex justify-center items-center ">
                  <Image
                    layout="fill"
                    objectFit="cover"
                    src={`${product.photo}/public`}
                    alt={product.title}
                    priority
                    className="rounded-lg"
                  />
                </div>
                <div className="flex flex-col col-span-4">
                  <h1>{product.title}</h1>
                  <span>{`${formatToWon(product.price)}원`}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
