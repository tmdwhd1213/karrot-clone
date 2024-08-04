async function getPosts() {
  await new Promise((r) => setTimeout(r, 3000));
}

export default async function Life() {
  const posts = await getPosts(); // 스켈레톤
  return (
    <div>
      <h1 className="text-white text-4xl">동네생활!</h1>
    </div>
  );
}
