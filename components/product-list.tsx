"use client"

import { getMoreProducts } from "@/app/(tabs)/products/action";
import { InitialProducts } from "@/app/(tabs)/products/page";
import { useEffect, useRef, useState } from "react";
import ListProduct from "./list-product";

interface ProductListProps  {
    initialProducts: InitialProducts
  }
  
 export default function ProductList({initialProducts}: ProductListProps) {
  const [products, setProducts] = useState(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);

  const trigger = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      async (
        entries: IntersectionObserverEntry[],
        observer: IntersectionObserver
      ) => {
        console.log(entries);
        const element = entries[0];
        if (element.isIntersecting && trigger.current) {
          observer.unobserve(trigger.current);
          // product loading-> get
          setIsLoading(true);
          const newProducts = await getMoreProducts(page + 1);
          if (newProducts.length !== 0) {
            setPage((prev) => prev + 1);
            setProducts((prev) => [...prev, ...newProducts]);
          } else {
            setIsLastPage(true);
          }
          setIsLoading(false);
          //
        }
      },
      {
        threshold: 1.0,
        //rootMargin:"0px 0px -100px 0px"
      }
    );
    if (trigger.current) {
      observer.observe(trigger.current);
    }
    return () => {
      //cleanup function - user가 page를 떠날때 호출
      observer.disconnect();
    };
  }, [page]);
  return (      
    <div className="p-5 flex flex-col gap-5">
      {products.map((product)=>{
        return (
          <ListProduct key={product.id} {...product}/>
        );
      })}
      {!isLastPage ? (
        <span ref={trigger}
          //style={{
          //  marginTop: `${page + 1 * 900}vh`,
          //}}
          //className="mb-96 text-sm font-semibold bg-orange-500 w-fit mx-auto px-3 py-2 rounded-md hover:opacity-90 active:scale-95"
          className="text-sm font-semibold bg-orange-500 w-fit mx-auto px-3 py-2 rounded-md hover:opacity-90 active:scale-95"
        >
            {isLoading? "로딩 중" : "Load more"}
        </span>
      ):(
        null
      )}      
    </div>
   
  );
}