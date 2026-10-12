import { DEFAULT_EXCERPT_LENGTH, resolveExcerpt, type ExcerptSourceLike } from "./excerpt";

export interface WidgetPost {
  id: string;
  data: {
    title: string;
    categories?: string[] | null;
    description: string;
  };
}

export interface WidgetPostSource extends ExcerptSourceLike {
  id: string;
  data: {
    title: string;
    categories?: string[] | null;
    description?: string;
    encrypted?: boolean;
    password?: string;
  };
}

export function createWidgetPosts(
  posts: WidgetPostSource[],
  excerptLength: number = DEFAULT_EXCERPT_LENGTH,
): WidgetPost[] {
  return posts.map((post) => {
    return {
      id: post.id,
      data: {
        title: post.data.title,
        categories: post.data.categories,
        description: resolveExcerpt(post, { length: excerptLength }),
      },
    };
  });
}
