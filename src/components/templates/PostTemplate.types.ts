import { PostPageProps } from "types/PostPage.types";

export type PostTemplateProps = Pick<PostPageProps<any>, "post" | "controlDisplayLinks" | "hdImagesToDisplay" | "hasRouteScheme">;
