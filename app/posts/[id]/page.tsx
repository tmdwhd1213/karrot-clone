import LikeButton from "@/components/like-button";
import { AVATAR_SIZE } from "@/lib/constants";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToTimeAgo } from "@/lib/utils";
import { EyeIcon, UserIcon } from "@heroicons/react/24/solid";
import { unstable_cache as nextCache } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";
import AddComment from "@/components/add-comment";
import UpperTabBar from "@/components/upper-tab-bar";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const post = await getCachedPost(+params.id);
  return {
    title: post?.title,
  };
}

const getCachedPost = nextCache(getPost, ["post-detail"], {
  tags: ["post-detail"],
  revalidate: 60,
});

async function getLikeStatus(postId: number, userId: number) {
  const isLike = await db.like.findUnique({
    where: {
      id: {
        postId,
        userId,
      },
    },
  });
  const likeCount = await db.like.count({
    where: {
      postId,
    },
  });
  return {
    likeCount,
    isLiked: Boolean(isLike),
  };
}

async function getCachedLikeStatus(postId: number) {
  "use server";
  const { id: userId } = await getSession();
  const cachedLikeStatus = nextCache(getLikeStatus, ["product-like-status"], {
    tags: [`like-status-${postId}`],
  });

  return cachedLikeStatus(postId, userId!);
}

async function getPost(id: number) {
  try {
    const post = await db.post.update({
      where: {
        id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
        comments: {
          select: {
            id: true,
            payload: true, // comment String
            userId: true, // userId of comment
            created_at: true,
            user: {
              select: {
                avatar: true,
                username: true,
              },
            },
          },
        },
        _count: {
          select: {
            comments: true,
            // Likes: true,
          },
        },
      },
    });

    return post;
  } catch (e) {
    return null;
  }
}

export default async function PostDetail({
  params,
}: {
  params: { id: string };
}) {
  const postId = Number(params.id);
  if (isNaN(postId)) {
    return notFound();
  }

  const post = await getCachedPost(postId);
  if (!post) {
    return notFound();
  }
  const { user: postUser, comments: postComments } = post;
  const { likeCount, isLiked } = await getCachedLikeStatus(postId);
  const session = await getSession();
  return (
    <>
      <UpperTabBar id={postId} isOwner={false} />
      <div className="p-5 pt-24 text-white bg-neutral-800">
        <div className="flex items-center gap-2">
          {postUser.avatar ? (
            <Image
              width={AVATAR_SIZE}
              height={AVATAR_SIZE}
              className="size-9 rounded-full"
              src={postUser.avatar!}
              alt={postUser.username}
            />
          ) : (
            <UserIcon className="size-9 rounded-full" />
          )}
          <div className="ml-1">
            <span className="text-md font-semibold">{postUser.username}</span>
            <div className="text-xs text-neutral-400 mt-[2px]">
              <span>{formatToTimeAgo(post.created_at.toString())}</span>
            </div>
          </div>
        </div>
        <h2 className="mt-5 text-xl font-semibold">{post.title}</h2>
        <p className="mb-5 mt-2">{post.description}</p>
        <div className="flex flex-col gap-5 items-start">
          <div className="flex items-center gap-2 text-neutral-400 text-sm">
            <EyeIcon className="size-5" />
            <span>{post.views}명이 봤어요</span>
          </div>
          <LikeButton isLiked={isLiked} likeCount={likeCount} postId={postId} />
        </div>
      </div>
      <AddComment
        comments={postComments}
        id={postId}
        sessionId={session.id!}
        commentsAmount={post._count.comments}
      />
    </>
  );
}
