import { Post } from "components/card-list/CardList.types";
import { Graph } from "schema-dts";

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

export type PostLink = {
  title: string;
  href: string;
  internal?: boolean;
  type: "image" | "navigation";
};

type Links = Record<
  "accomodation" | "transportation" | "other" | "dangers" | "weather" | "gear" | "shortDescription" | "trailCondition" | "provisions",
  PostLink[]
>;

export type PostImage = {
  desc: string;
  filename: string;
  isVertical: boolean;
};

export type PostVideo = {
  src: string;
  desc: string;
};

type Paragraph = string[];
type TitledParagraph = { title: string; body: Paragraph; links?: PostLink[] };

export type CodedCategory = {
  country: string[];
  region: string[];
  activity: string[];
};

export type Category = {
  code: string;
  url: string;
  name: string;
};

export type Categories = {
  activity: string[];
  region: string[];
  country: string[];
};

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

export type DateClass = {
  season: number;
  period: number;
  month: number;
  year: number;
};

export type Stats = {
  duration: number;
  up: number;
  down: number;
  distance: number;
  highestPoint: number;
};

export type SearchPostType = Pick<FullPost, "id" | "category" | "title" | "postDate" | "base64Image"> & { isTop: boolean };

export type BreadcrumbParentPostData = Pick<FullPost, "id" | "title">;
