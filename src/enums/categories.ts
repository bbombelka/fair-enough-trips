import { Category } from "types/PostPage.types";

export const Activities: Category[] = [
  {
    code: "001",
    name: "Trekking",
    url: "trekking",
  },
  {
    code: "002",
    name: "Scrambling",
    url: "scrambling",
  },
  {
    code: "003",
    name: "Via Ferrata",
    url: "via-ferrata",
  },
  {
    code: "004",
    name: "Alpine Climbing",
    url: "alpine-climbing",
  },
  {
    code: "005",
    name: "Kid friendly",
    url: "kid-friendly",
  },
];

export const Regions: Array<Category & { originalName: string }> = [
  {
    code: "001",
    name: "High Tatras",
    originalName: "Vysoke Tatry",
    url: "high-tatras",
  },
  {
    code: "002",
    name: "White Mountains",
    originalName: "Lefka Ori",
    url: "lefka-ori",
  },
  {
    code: "003",
    name: "Cretan countryside",
    url: "cretan-countryside",
    originalName: "",
  },
];

export const Countries: Category[] = [
  {
    code: "001",
    name: "Slovakia",
    url: "slovakia",
  },
  {
    code: "002",
    name: "Greece",
    url: "greece",
  },
];
