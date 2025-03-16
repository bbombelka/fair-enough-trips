import { Divider } from "components/divider/Divider";
import { Paragraph } from "components/paragraph/Paragraph";
import React, { FC } from "react";
import { PostLink } from "types/PostPage.types";

export type TripNote = {
  title: string;
  paragraph: string[];
  links: PostLink[];
};

type TripNotesProps = {
  notes: TripNote[];
};

export const TripNotes: FC<TripNotesProps> = ({ notes }) => {
  return (
    <div id="trip-notes">
      <h1 className="title">Trip Notes</h1>
      {notes.map(({ title, paragraph, links }, index) => (
        <>
          <Divider title={title} key={`divider-${index}`} />
          <Paragraph body={paragraph} links={links} key={`paragraph-${index}`} />
        </>
      ))}
    </div>
  );
};
