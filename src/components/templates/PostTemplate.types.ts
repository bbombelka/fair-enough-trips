import { PostPageProps } from "types/PostPage.types";

export type PostTemplateProps = Pick<PostPageProps, "post" | "controlDisplayLinks" | "hasRouteScheme" | "posts" | "subPosts" | "parentPostData">;
