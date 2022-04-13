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
  weather: string;
  trailCondition: string;
  stats: Stats;
  dangers: string;
  accomodation: string;
  transportation: string;
  gear: string;
  other: string;
  shortDescription: string;
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
