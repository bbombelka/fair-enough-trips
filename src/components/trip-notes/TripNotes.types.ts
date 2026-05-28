import { TripNoteDocument } from "types/database.types";

export type TripNotesProps = Pick<TripNoteDocument, "notes"> & { title: string };
