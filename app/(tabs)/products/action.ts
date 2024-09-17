"use server";

import db from '@/lib/db'

export async function getMoreProducts(page:number) {
    const pageSize = 1;
  const products = await db.product.findMany({
    select: {
        title: true,
        price: true,
        created_at: true,
        photo: true,
        id: true,
    },
    skip: page*pageSize,
    take: 1,
    orderBy: {
        created_at: "desc",
    }
  });
  return products;
}