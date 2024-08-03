import { getProduct } from "@/lib/utils";
import { uploadProduct } from "./actions";
import EditForm from "@/components/edit-form";

interface ProductType {
  id: number;
  title: string;
  price: number;
  description: string;
  photo: string;
  created_at: Date;
  updated_at: Date;
  userId: number;
}

interface UserProdcutType extends ProductType {
  user: {
    username: string;
    avatar: string | null;
  };
}

export default async function EditProduct({
  params: { id },
}: {
  params: { id: string };
}) {
  const test = await getProduct(+id);
  console.log(test);
  return (
    <>
      <EditForm uploadProduct={uploadProduct} product={test!} />
    </>
  );
}
