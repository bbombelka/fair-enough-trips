import { PostLink } from "types/common.types";

export type ParagraphHTMLElement = {
  tag: "li" | "li-ol" | "ul" | "ol";
  body: string;
};

export type ParagraphProps = {
  body: Array<string | ParagraphHTMLElement>;
  title?: string;
  links?: PostLink[];
  id?: string;
};
