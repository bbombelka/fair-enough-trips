import { PostPageProps } from "types/pages/post.types";

export type PostTemplateProps = Pick<PostPageProps, "post" | "controlDisplayLinks" | "hasRouteScheme" | "posts" | "subPosts" | "parentPostData">;
