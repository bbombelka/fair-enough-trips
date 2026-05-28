import { PostLink } from "types/common.types";

export type ParapgraphHTMLElement = {
  tag: "li" | "ul" | "ol";
  body: string;
};

export type ParagraphProps = {
  body: Array<string | ParapgraphHTMLElement>;
  title?: string;
  links?: PostLink[];
  id?: string;
};
