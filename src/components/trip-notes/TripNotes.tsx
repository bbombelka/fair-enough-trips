import { Divider } from "components/divider/Divider";
import { Paragraph } from "components/paragraph/Paragraph";
import React, { FC } from "react";
import { TripNotesProps } from "./TripNotes.types";

export const TripNotes: FC<TripNotesProps> = ({ notes, title }) => {
  return (
    <div id="trip-notes">
      <h1 className="title">{title}</h1>
      {notes.map(({ title, paragraph, links }, index) => (
        <>
          <Divider title={title} key={`divider-${index}`} id={`note-${index + 1}`} />
          <Paragraph body={paragraph} links={links} key={`paragraph-${index}`} />
        </>
      ))}
    </div>
  );
};
