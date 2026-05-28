import { Post } from "../common.types";

export type ActivityPageProps = {
  mainPost: Post;
  latestPosts: Post[];
  code?: string;
  richData: any[];
};
