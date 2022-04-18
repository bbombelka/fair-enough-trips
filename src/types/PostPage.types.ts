export type PostPageProps = {
  post: FullPost;
};

export type PostLink = {
  title: string;
  href: string;
};

export type PostImage = {
  desc: string;
  filename: string;
  isVertical: boolean;
};

type Paragraph = string[];

export type FullPost = {
  id: string;
  title: string;
  subTitle: string;
  category: string;
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
  imageUrl: string;
  startingPoint: string;
  endingPoint: string;
  links: Record<
    | "accomodation"
    | "transportation"
    | "other"
    | "dangers"
    | "weather"
    | "gear",
    PostLink[]
  >;
  images: PostImage[];
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
