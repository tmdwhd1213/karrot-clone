import db from "@/lib/db";
import { revalidatePath, revalidateTag } from "next/cache";

export async function deleteProduct(_: any, formData: FormData) {
  // if (!isOwner) {
  //   throw new Error("Not authorized");
  // }
  const data = {
    id: formData.get("id"),
  };
  try {
    await db.product.delete({
      where: {
        id: +data.id!,
      },
      select: {
        id: true,
      },
    });
    revalidatePath("/home");
    revalidateTag("product-detail");
  } catch (error) {
    console.error(error);
  }
}
