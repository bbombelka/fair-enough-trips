import { MultidayFullPost, PostPageProps } from "types/PostPage.types";

export type PostMultidayTemplateProps = Pick<PostPageProps, "controlDisplayLinks" | "hasRouteScheme" | "posts"> & { post: MultidayFullPost };
