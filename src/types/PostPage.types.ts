import { Activities, Regions, Countries } from "enums/categories";

export type PostPageProps = {
  post: FullPost;
};

export type PostLink = {
  title: string;
  href: string;
};

type Links = Record<
  | "accomodation"
  | "transportation"
  | "other"
  | "dangers"
  | "weather"
  | "gear"
  | "shortDescription"
  | "trailCondition",
  PostLink[]
>;

export type PostImage = {
  desc: string;
  filename: string;
  isVertical: boolean;
};

type Paragraph = string[];

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
  shortDescription: Paragraph;
  iframeUrl: string;
  startingPoint: string;
  endingPoint: string;
  links: Links;
  images: PostImage[];
  postDate: Date;
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
