"use client";

import { useEffect, useRef, useState } from "react";
import { InitialProducts } from "../(tabs)/product/page";
import ListProduct from "./list-product";
import { getMoreProducts } from "../(tabs)/product/action";

interface ProductListProps {
  // 방법 1. 원하는 곳에서 긁어서 붙여넣기 (쉬움)
  // initialProducts: {
  //   id: number;
  //   title: string;
  //   price: number;
  //   photo: string;
  //   created_at: Date;
  // }[];
  // 방법 2. prisma.promiseReturnType<typeof function> 을 해서 export하기(어럅)
  initialProducts: InitialProducts;
}

export default function ProductList({ initialProducts }: ProductListProps) {
  const [products, setProducts] = useState(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const trigger = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (
        entries: IntersectionObserverEntry[],
        observer: IntersectionObserver
      ) => {
        console.log(entries);
      }
    );
    if (trigger.current !== null) {
      observer.observe(trigger.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [page]);
  const onLoadMoreClick = async () => {
    setIsLoading(true);
    const newProducts = await getMoreProducts(page + 1);
    if (newProducts.length !== 0) {
      setPage((prev) => prev + 1);
      setProducts((prev) => [...prev, ...newProducts]);
    } else {
      setIsLastPage(true);
    }
    setIsLoading(false);
  };
  return (
    <div className="p-5 flex flex-col gap-5">
      {products.map((product) => (
        <ListProduct key={product.id} {...product} />
      ))}
      <span
        ref={trigger}
        // 500vh -> 수직 화면 높이의 5배
        className="mt-[300vh] mb-96 text-sm font-semibold bg-green-500 w-fit mx-auto px-3 py-2 rounded-md hover:opacity-90 active:scale-95"
      >
        {isLoading ? "가져오는 중..." : "더 가져오기"}
      </span>
    </div>
  );
}
