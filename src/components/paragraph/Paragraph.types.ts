import { PostLink } from "types/common.types";
import { RouteStats } from "types/pages/post.types";

export type ParagraphHTMLElement = {
  tag: "li" | "li-ol" | "ul" | "ol";
  body: string;
};

export type ParagraphProps = {
  body: Array<string | ParagraphHTMLElement>;
  title?: string;
  links?: PostLink[];
  id?: string;
  stats?: RouteStats;
};
