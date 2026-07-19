export interface ReferencedTrip {
  id: string;
  title: string;
  parentId?: string;
}

export interface GearItem {
  brand: string;
  name: string;
  type: string;
  description: string;
  usage: string;
  statsGeneral: Record<string, any>;
  statsSpecific?: Record<string, any>;
  pros: string[];
  cons: string[];
}

export interface GearTemplateProps {
  gearItem: GearItem;
  referencedTrips: ReferencedTrip[];
}
