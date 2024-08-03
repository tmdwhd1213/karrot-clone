import db from "@/lib/db";
import { getProduct } from "@/lib/utils";
import { NextApiRequest, NextApiResponse } from "next";

export async function GET({ params }: { params: { id: string } }) {
  console.log(params);
  // console.log(parmas);
  // if (req.method === "GET") {
  //   try {
  //     // const product = await getProduct(+id!);
  //     const product = true;
  //     if (!product) {
  //       return res.status(404).json({ error: "Product not found!" });
  //     }
  //     return Response.json({
  //       ok: true,
  //     });
  //   } catch {
  //     res.status(500).json({ error: "Internal Server Error!" });
  //   }
  // }
}
