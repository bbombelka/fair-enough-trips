import { TimelineItem } from "./components/GearGallery";

export interface ReferencedTrip {
  id: string;
  title: string;
  parentId?: string;
}

export interface GearItem {
  id: string;
  slug: string;
  brand: string;
  name: string;
  type: string;
  description: string;
  usage: string;
  statsGeneral: Record<string, unknown>;
  statsSpecific?: Record<string, unknown>;
  pros: string[];
  cons: string[];
  images: {
    general: string[];
    timeline?: TimelineItem[];
  };
}

export interface GearTemplateProps {
  gearItem: GearItem;
  referencedTrips: ReferencedTrip[];
}
