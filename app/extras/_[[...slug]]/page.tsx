import { revalidatePath } from "next/cache";
import HackedComponent from "../hacked-component";
import {
  experimental_taintObjectReference,
  experimental_taintUniqueValue,
} from "react";

async function getHackedData() {
  const keys = {
    apiKey: "123124123",
    secret: "123141234110",
  };
  // experimental_taintObjectReference("API_KEYS were leaked!!", keys);  // object 전체에 대해서
  experimental_taintUniqueValue("Secret key was exposed.", keys, keys.secret);
  return keys;
}

async function getData() {
  const data = await fetch(
    "https://nomad-movies.nomadcoders.workers.dev/movies"
  );

  return data;
}

export default async function ExtraSlugPage({
  params,
}: {
  params: { slug: string[] };
}) {
  console.log(params.slug);
  await getData();
  const action = async () => {
    "use server";
    revalidatePath("/extras");
  };

  const { apiKey } = await getHackedData();

  return (
    <h1 className="font-noto">
      {params.slug ? (
        params.slug.map((param, idx) => (
          <div className="font-rubick text-2xl" key={idx}>
            {param}
          </div>
        ))
      ) : (
        <div className={`flex flex-col gap-3 py-10`}>
          <h1 className="text-6xl font-rubick">Extras!</h1>
          <h2>so much more to learn</h2>
          <h2>안녕하세요?</h2>
          <form action={action}>
            <button>revalidate</button>
          </form>
          <HackedComponent data={apiKey} />
        </div>
      )}
    </h1>
  );
}
