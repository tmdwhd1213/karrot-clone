import { z } from "zod";

export const commentSchema = z.object({
  payload: z
    .string({
      required_error: "내용이 없는 것 같아요. 다시 확인해주세요.",
    })
    .min(5),
  postId: z.string({
    required_error: "postId is requried.",
  }),
});
