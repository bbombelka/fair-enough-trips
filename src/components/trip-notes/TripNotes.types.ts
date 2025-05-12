import { PostLink } from "types/PostPage.types";

export type TripNote = {
  title: string;
  paragraph: string[];
  links: PostLink[];
};

export type TripNotesProps = Pick<TripNoteDocument, "notes">;

export type TripNoteDocument = {
  id: string;
  notes: TripNote[];
};
