import { MultidayFullPost, PostPageProps } from "types/pages/post.types";

export type PostMultidayTemplateProps = Pick<PostPageProps, "controlDisplayLinks" | "hasRouteScheme" | "posts"> & { post: MultidayFullPost };
