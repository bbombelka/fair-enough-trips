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
    url: "white-mountains",
  },
  {
    code: "003",
    name: "Cretan countryside",
    url: "cretan-countryside",
    originalName: "",
  },
  {
    code: "004",
    name: "Julian Alps",
    url: "julian-alps",
    originalName: "Julijske Alpe",
  },
  {
    code: "005",
    name: "Accursed Mountains",
    url: "accursed-mountains",
    originalName: "Prokletije",
  },
  {
    code: "006",
    name: "Hostýn-Vsetín Mountains",
    url: "hostyn-vsetin-mountains",
    originalName: "Hostýnsko-vsetínská hornatina",
  },
  {
    code: "007",
    name: "Durmitor",
    url: "durmitor",
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
  {
    code: "003",
    name: "Slovenia",
    url: "slovenia",
  },
  { code: "004", name: "Czechia", url: "czechia" },
  { code: "005", name: "Montenegro", url: "montenegro" },
  { code: "006", name: "Albania", url: "albania" },
  { code: "007", name: "Kosovo", url: "kosovo" },
];

export enum CategoriesEnum {
  Countries = "countries",
  Regions = "regions",
  Activities = "activities",
}
