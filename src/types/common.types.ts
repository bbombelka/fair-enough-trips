export type Categories = {
  activity: string[];
  region: string[];
  country: string[];
};

export type Post = {
  id: string;
  title: string;
  category: Categories;
  isTop?: boolean;
  postDate: string;
  base64Image: string;
};

export type PostLink = {
  title: string;
  href: string;
  internal?: boolean;
  type: "image" | "navigation";
};

export type PostImage = {
  desc: string;
  filename: string;
  isVertical: boolean;
};

export type PostVideo = {
  src: string;
  desc: string;
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

export type Category = {
  code: string;
  url: string;
  name: string;
};

export type CodedCategory = {
  country: string[];
  region: string[];
  activity: string[];
};
