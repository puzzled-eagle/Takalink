export type UserRole = 'supplier' | 'buyer' | 'transporter' | 'admin';

export type VerificationStatus = 'unverified' | 'pending' | 'verified';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  businessName?: string;
  role: UserRole;
  phoneNumber: string;
  location: {
    county: string;
    town: string;
    area: string; // e.g. CBD, Pioneer, Langas, Huruma, Kapsoya, West Indies
  };
  verificationStatus: VerificationStatus;
  avatarUrl?: string;
  rating: number;
  reviewCount: number;
  joinedDate: string;
  bio?: string;
  nemaPermitNumber?: string; // For certified recyclers/transporters
}

export type MaterialCondition = 'sorted_clean' | 'mixed_recyclable' | 'needs_cleaning' | 'raw_industrial';

export type PricingMode = 'fixed' | 'negotiable' | 'request_offers';

export type ListingStatus = 'draft' | 'active' | 'reserved' | 'sold' | 'expired' | 'removed';

export interface MaterialCategory {
  id: string;
  name: string;
  code: string;
  description: string;
  iconName: string;
  commonSubtypes: string[];
  unitDefault: string;
  typicalMarketPriceRange: {
    min: number; // KES
    max: number; // KES
    unit: string;
    benchmarkDate: string;
  };
  handlingRestrictions?: string;
  isHazardous?: boolean;
}

export interface Listing {
  id: string;
  supplierId: string;
  supplierName: string;
  supplierRole: string;
  supplierVerified: boolean;
  supplierRating: number;
  categoryId: string;
  categoryName: string;
  subcategory: string;
  title: string;
  description: string;
  photos: string[];
  quantity: number;
  unit: string; // 'kg' | 'tonnes' | 'pieces' | 'bales' | 'litres'
  condition: MaterialCondition;
  contaminationNotes?: string;
  pricingMode: PricingMode;
  askingPricePerUnit: number; // In KES. 0 if request_offers
  currency: 'KES';
  approximateLocation: {
    town: string;
    area: string;
    landmark?: string;
  };
  availabilityDate: string;
  minQuantity?: number;
  status: ListingStatus;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export type OfferStatus =
  | 'inquiry'
  | 'offer_submitted'
  | 'counteroffer'
  | 'accepted'
  | 'rejected'
  | 'awaiting_collection'
  | 'collection_scheduled'
  | 'picked_up'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'disputed';

export interface OfferHistoryItem {
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  note?: string;
  timestamp: string;
  pricePerUnit?: number;
  quantity?: number;
}

export interface Offer {
  id: string;
  listingId: string;
  listingTitle: string;
  categoryName: string;
  supplierId: string;
  supplierName: string;
  buyerId: string;
  buyerName: string;
  buyerVerified: boolean;
  quantity: number;
  unit: string;
  pricePerUnit: number; // KES
  totalEstimatedValue: number; // KES
  currency: 'KES';
  proposedCollectionDate: string;
  notes?: string;
  counterPricePerUnit?: number;
  counterNotes?: string;
  status: OfferStatus;
  history: OfferHistoryItem[];
  createdAt: string;
  updatedAt: string;
}

export type BulkRequestStatus =
  | 'open'
  | 'partially_matched'
  | 'target_reached'
  | 'confirmed'
  | 'completed'
  | 'cancelled';

export interface AggregationContribution {
  id: string;
  groupId: string;
  listingId: string;
  supplierId: string;
  supplierName: string;
  supplierArea: string;
  proposedQuantity: number;
  unit: string;
  agreedPricePerUnit: number;
  status: 'pending' | 'approved' | 'collected';
  createdAt: string;
}

export interface BulkRequest {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerVerified: boolean;
  categoryId: string;
  categoryName: string;
  subcategory: string;
  title: string;
  targetQuantity: number;
  currentAggregatedQuantity: number;
  unit: string;
  qualityRequirements: string;
  maxContaminationAcceptable: string;
  targetPricePerUnit: number;
  currency: 'KES';
  locationArea: string;
  deadline: string;
  status: BulkRequestStatus;
  contributions: AggregationContribution[];
  createdAt: string;
}

export type VehicleRequirement =
  | 'motorcycle_cargo'
  | 'tuk_tuk'
  | 'pickup_truck'
  | 'canter_3ton'
  | 'tipper_lorry'
  | 'flatbed';

export type TransportJobStatus =
  | 'open_for_quotes'
  | 'assigned'
  | 'in_transit'
  | 'delivered'
  | 'completed'
  | 'cancelled';

export interface TransportQuote {
  id: string;
  jobId: string;
  transporterId: string;
  transporterName: string;
  transporterRating: number;
  vehicleType: VehicleRequirement;
  quoteAmount: number; // KES
  currency: 'KES';
  estimatedHours: number;
  availabilityNotes: string;
  status: 'submitted' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface TransportJob {
  id: string;
  transactionId?: string;
  listingId?: string;
  requesterId: string;
  requesterName: string;
  requesterRole: 'buyer' | 'supplier';
  materialName: string;
  quantity: number;
  unit: string;
  pickupArea: string;
  deliveryArea: string;
  pickupAddressApprox: string;
  deliveryAddressApprox: string;
  vehicleRequirement: VehicleRequirement;
  preferredDate: string;
  notes?: string;
  assignedTransporterId?: string;
  assignedTransporterName?: string;
  agreedFee?: number;
  status: TransportJobStatus;
  quotes: TransportQuote[];
  pickupProofNote?: string;
  deliveryProofNote?: string;
  pickupTimestamp?: string;
  deliveryTimestamp?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  transactionId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerRole: UserRole;
  revieweeId: string;
  revieweeName: string;
  rating: number; // 1 to 5
  comment: string;
  materialCategory: string;
  createdAt: string;
}

export interface Report {
  id: string;
  reporterId: string;
  reporterName: string;
  targetType: 'listing' | 'user';
  targetId: string;
  targetTitle: string;
  reason: 'counterfeit_or_misrepresented' | 'hazardous_unauthorized' | 'scam_pricing' | 'no_show_collection' | 'inappropriate_conduct';
  details: string;
  status: 'pending' | 'under_review' | 'resolved' | 'dismissed';
  adminNotes?: string;
  createdAt: string;
}

export interface InAppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'offer' | 'collection' | 'aggregation' | 'system' | 'verification';
  linkTarget?: string;
  read: boolean;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  listingId?: string;
  listingTitle?: string;
  participants: {
    id: string;
    name: string;
    role: UserRole;
  }[];
  messages: ChatMessage[];
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadCount: number;
}
