import { Graph } from "schema-dts";
import {
  Post,
  Categories,
  PostLink,
  PostImage,
  PostVideo,
  Stats,
  DateClass,
} from "../common.types";

export type PostPageProps = {
  post: FullPost;
  controlDisplayLinks: ControlDisplayLinks;
  hasRouteScheme: boolean;
  richData: Graph & { "@context": string };
  posts: Post[];
  subPosts?: Post[];
  parentPostData?: BreadcrumbParentPostData;
};

export type ControlDisplayLinks = {
  displayGpxChart: boolean;
  gpxDownloadLink: string;
  topoDownloadLink: string;
};

type Links = Record<
  | "accomodation"
  | "transportation"
  | "other"
  | "dangers"
  | "weather"
  | "gear"
  | "shortDescription"
  | "trailCondition"
  | "provisions",
  PostLink[]
>;

type Paragraph = string[];
type TitledParagraph = { title: string; body: Paragraph; links?: PostLink[] };

export type FullPost = {
  id: string;
  title: string;
  subTitle: string;
  category: Categories;
  attractiveness: number;
  condition: number;
  difficulty: string;
  terrain: string;
  date: DateClass;
  weather: Paragraph;
  trailCondition: Paragraph;
  stats: Stats;
  dangers: Paragraph;
  accomodation: Paragraph;
  transportation: Paragraph;
  gear: Paragraph;
  other: Paragraph;
  provisions?: Paragraph;
  shortDescription: Paragraph;
  iframeUrl: string;
  startingPoint: string;
  endingPoint: string;
  links: Links;
  images: PostImage[];
  postDate: Date;
  base64Image: string;
  videos: PostVideo[];
  description?: TitledParagraph[];
  subIds?: string[];
  parentId?: string;
};

export type MultidayFullPost = FullPost & {
  description?: TitledParagraph[];
  shortDescription: TitledParagraph[];
};

export type SearchPostType = Pick<
  FullPost,
  "id" | "category" | "title" | "postDate" | "base64Image"
> & { isTop: boolean };

export type BreadcrumbParentPostData = Pick<FullPost, "id" | "title">;
