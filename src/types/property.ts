export type RoomType =
  | 'exterior_front'
  | 'exterior_rear'
  | 'garden'
  | 'kitchen'
  | 'living_room'
  | 'dining_room'
  | 'bedroom'
  | 'bathroom'
  | 'hallway'
  | 'study'
  | 'utility'
  | 'garage'
  | 'aerial'
  | 'street'
  | 'other';

export type PriceQualifier =
  | 'guide_price'
  | 'offers_over'
  | 'offers_in_region'
  | 'fixed';

export type Tenure = 'freehold' | 'leasehold' | 'share_of_freehold';

export interface PropertyAddress {
  line1: string;
  line2: string;
  city: string;
  county: string;
  postcode: string;
}

export interface PropertyDetails {
  address: PropertyAddress;
  price: number;
  priceQualifier: PriceQualifier;
  bedrooms: number;
  bathrooms: number;
  receptions: number;
  propertyType: string;
  tenure: Tenure;
  councilTaxBand: string;
  epcRating: string;
  sqft?: number;
  yearBuilt?: string;
  agentName?: string;
  agentPhone?: string;
  agentEmail?: string;
  agentLogo?: string;
  floorPlanUrl?: string;
  listingUrl?: string;
}
