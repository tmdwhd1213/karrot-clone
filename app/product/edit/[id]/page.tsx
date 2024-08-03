import { getProduct } from "@/lib/utils";
import { uploadProduct } from "./actions";
import EditForm from "@/components/edit-form";

export default async function EditProduct({
  params: { id },
}: {
  params: { id: string };
}) {
  const product = await getProduct(+id);

  return (
    <>
      <EditForm uploadProduct={uploadProduct} product={product!} />
    </>
  );
}
