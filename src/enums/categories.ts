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
  {
    code: "008",
    name: "Great Fatra",
    url: "great-fatra",
    originalName: "Velka Fatra",
  },
  {
    code: "009",
    name: "Berchtesgaden Alps",
    url: "berchtesgaden-alps",
    originalName: "Berchtesgadener Alpen",
  },
  {
    code: "010",
    name: "Rhodes",
    url: "rhodes",
    originalName: "Rodos",
  },
  {
    code: "011",
    name: "Cyprus",
    url: "cyprus",
    originalName: "Kýpros",
  },
  {
    code: "012",
    name: "Karavanks",
    url: "karavanks",
    originalName: "Karavanke",
  },
  {
    code: "013",
    name: "Dolomites",
    url: "dolomites",
    originalName: "Dolomiti",
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
  { code: "008", name: "Italy", url: "italy" },
  { code: "009", name: "Germany", url: "germany" },
  { code: "010", name: "Cyprus", url: "cyprus" },
  { code: "011", name: "Austria", url: "austria" },
];

export enum CategoriesEnum {
  Countries = "countries",
  Regions = "regions",
  Activities = "activities",
}
