import { getPosts } from "../../api/posts/utils/posts";
import type { EntryGenerator } from "./$types";

export const entries: EntryGenerator = async () => {
  const posts = await getPosts();
  return posts.map(({ slug }) => ({
    slug,
  }));
};

export const prerender = true;
