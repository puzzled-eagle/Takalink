import { useState, useEffect } from 'react';
import {
  UserProfile,
  Listing,
  BulkRequest,
  Offer,
  TransportJob,
  Review,
  Report,
  InAppNotification,
  Conversation,
  UserRole,
  AggregationContribution,
  TransportQuote,
} from '../types';
import {
  DEMO_USERS,
  INITIAL_LISTINGS,
  INITIAL_BULK_REQUESTS,
  INITIAL_OFFERS,
  INITIAL_TRANSPORT_JOBS,
  INITIAL_REVIEWS,
  INITIAL_REPORTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_CONVERSATIONS,
} from './mockData';

export type ThemeMode = 'light' | 'dark';

const STORAGE_KEYS = {
  CURRENT_USER_ROLE: 'takalink_active_role_v1',
  THEME: 'takalink_theme_v1',
  LISTINGS: 'takalink_listings_v1',
  BULK_REQUESTS: 'takalink_bulk_requests_v1',
  OFFERS: 'takalink_offers_v1',
  TRANSPORT_JOBS: 'takalink_transport_jobs_v1',
  REVIEWS: 'takalink_reviews_v1',
  REPORTS: 'takalink_reports_v1',
  NOTIFICATIONS: 'takalink_notifications_v1',
  CONVERSATIONS: 'takalink_conversations_v1',
  USERS: 'takalink_users_v1',
};

// Safe local storage helper
function getStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`Error reading key ${key} from localStorage`, e);
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error writing key ${key} to localStorage`, e);
  }
}

// In-memory state
let currentTheme: ThemeMode = (localStorage.getItem(STORAGE_KEYS.THEME) as ThemeMode) || 'light';
let currentRole: UserRole = (localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ROLE) as UserRole) || 'supplier';
let usersMap: Record<string, UserProfile> = getStored(STORAGE_KEYS.USERS, DEMO_USERS);
let listings: Listing[] = getStored(STORAGE_KEYS.LISTINGS, INITIAL_LISTINGS);
let bulkRequests: BulkRequest[] = getStored(STORAGE_KEYS.BULK_REQUESTS, INITIAL_BULK_REQUESTS);
let offers: Offer[] = getStored(STORAGE_KEYS.OFFERS, INITIAL_OFFERS);
let transportJobs: TransportJob[] = getStored(STORAGE_KEYS.TRANSPORT_JOBS, INITIAL_TRANSPORT_JOBS);
let reviews: Review[] = getStored(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
let reports: Report[] = getStored(STORAGE_KEYS.REPORTS, INITIAL_REPORTS);
let notifications: InAppNotification[] = getStored(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
let conversations: Conversation[] = getStored(STORAGE_KEYS.CONVERSATIONS, INITIAL_CONVERSATIONS);

// Apply theme class to document
if (typeof document !== 'undefined') {
  if (currentTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

const listeners: Set<() => void> = new Set();
function notifyListeners() {
  listeners.forEach((listener) => listener());
}

export const store = {
  // Getters
  getTheme: () => currentTheme,
  setTheme: (theme: ThemeMode) => {
    currentTheme = theme;
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    if (typeof document !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    notifyListeners();
  },
  toggleTheme: () => {
    const next = currentTheme === 'light' ? 'dark' : 'light';
    store.setTheme(next);
  },
  getCurrentRole: () => currentRole,
  getCurrentUser: (): UserProfile => usersMap[currentRole] || DEMO_USERS.supplier,
  getAllUsers: () => Object.values(usersMap),
  getListings: () => listings,
  getListingById: (id: string) => listings.find((l) => l.id === id),
  getBulkRequests: () => bulkRequests,
  getBulkRequestById: (id: string) => bulkRequests.find((b) => b.id === id),
  getOffers: () => offers,
  getTransportJobs: () => transportJobs,
  getReviews: () => reviews,
  getReports: () => reports,
  getNotifications: () => notifications,
  getConversations: () => conversations,

  // Role switching
  switchRole: (role: UserRole) => {
    currentRole = role;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ROLE, role);
    notifyListeners();
  },

  // Reset to demo defaults
  resetToDemoDefaults: () => {
    usersMap = { ...DEMO_USERS };
    listings = [...INITIAL_LISTINGS];
    bulkRequests = [...INITIAL_BULK_REQUESTS];
    offers = [...INITIAL_OFFERS];
    transportJobs = [...INITIAL_TRANSPORT_JOBS];
    reviews = [...INITIAL_REVIEWS];
    reports = [...INITIAL_REPORTS];
    notifications = [...INITIAL_NOTIFICATIONS];
    conversations = [...INITIAL_CONVERSATIONS];

    setStored(STORAGE_KEYS.USERS, usersMap);
    setStored(STORAGE_KEYS.LISTINGS, listings);
    setStored(STORAGE_KEYS.BULK_REQUESTS, bulkRequests);
    setStored(STORAGE_KEYS.OFFERS, offers);
    setStored(STORAGE_KEYS.TRANSPORT_JOBS, transportJobs);
    setStored(STORAGE_KEYS.REVIEWS, reviews);
    setStored(STORAGE_KEYS.REPORTS, reports);
    setStored(STORAGE_KEYS.NOTIFICATIONS, notifications);
    setStored(STORAGE_KEYS.CONVERSATIONS, conversations);

    notifyListeners();
  },

  // Listing actions
  addListing: (newListing: Omit<Listing, 'id' | 'createdAt' | 'updatedAt' | 'viewCount' | 'supplierId' | 'supplierName' | 'supplierRole' | 'supplierVerified' | 'supplierRating'>) => {
    const user = store.getCurrentUser();
    const created: Listing = {
      ...newListing,
      id: `list-${Date.now()}`,
      supplierId: user.id,
      supplierName: user.businessName || user.fullName,
      supplierRole: user.role,
      supplierVerified: user.verificationStatus === 'verified',
      supplierRating: user.rating,
      viewCount: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    listings = [created, ...listings];
    setStored(STORAGE_KEYS.LISTINGS, listings);

    // Auto notify potential buyers or admin
    store.addNotification({
      userId: DEMO_USERS.buyer.id,
      title: 'New Waste Available',
      message: `${created.supplierName} listed ${created.quantity} ${created.unit} of ${created.subcategory || created.categoryName} in ${created.approximateLocation.area}, Eldoret.`,
      type: 'system',
      linkTarget: 'marketplace',
    });

    notifyListeners();
    return created;
  },

  updateListingStatus: (listingId: string, status: Listing['status']) => {
    listings = listings.map((l) => (l.id === listingId ? { ...l, status, updatedAt: new Date().toISOString() } : l));
    setStored(STORAGE_KEYS.LISTINGS, listings);
    notifyListeners();
  },

  incrementListingViews: (listingId: string) => {
    listings = listings.map((l) => (l.id === listingId ? { ...l, viewCount: l.viewCount + 1 } : l));
    setStored(STORAGE_KEYS.LISTINGS, listings);
    notifyListeners();
  },

  // Offer actions
  createOffer: (offerData: {
    listingId: string;
    quantity: number;
    pricePerUnit: number;
    proposedCollectionDate: string;
    notes?: string;
  }) => {
    const user = store.getCurrentUser();
    const listing = listings.find((l) => l.id === offerData.listingId);
    if (!listing) throw new Error('Listing not found');

    const totalEstimatedValue = Math.round(offerData.quantity * offerData.pricePerUnit * 100) / 100;

    const newOffer: Offer = {
      id: `offer-${Date.now()}`,
      listingId: listing.id,
      listingTitle: listing.title,
      categoryName: listing.categoryName,
      supplierId: listing.supplierId,
      supplierName: listing.supplierName,
      buyerId: user.id,
      buyerName: user.businessName || user.fullName,
      buyerVerified: user.verificationStatus === 'verified',
      quantity: offerData.quantity,
      unit: listing.unit,
      pricePerUnit: offerData.pricePerUnit,
      totalEstimatedValue,
      currency: 'KES',
      proposedCollectionDate: offerData.proposedCollectionDate,
      notes: offerData.notes,
      status: 'offer_submitted',
      history: [
        {
          actorId: user.id,
          actorName: user.businessName || user.fullName,
          actorRole: user.role,
          action: 'Offer Submitted',
          note: offerData.notes || `Offered KES ${offerData.pricePerUnit}/${listing.unit} for ${offerData.quantity} ${listing.unit}`,
          pricePerUnit: offerData.pricePerUnit,
          quantity: offerData.quantity,
          timestamp: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    offers = [newOffer, ...offers];
    setStored(STORAGE_KEYS.OFFERS, offers);

    // Notify supplier
    store.addNotification({
      userId: listing.supplierId,
      title: 'New Offer Received!',
      message: `${newOffer.buyerName} made an offer of KES ${newOffer.pricePerUnit}/${listing.unit} for ${newOffer.quantity} ${listing.unit}.`,
      type: 'offer',
      linkTarget: 'offers',
    });

    notifyListeners();
    return newOffer;
  },

  respondToOffer: (
    offerId: string,
    action: 'accept' | 'reject' | 'counter',
    counterDetails?: { pricePerUnit: number; notes: string }
  ) => {
    const user = store.getCurrentUser();
    offers = offers.map((offer) => {
      if (offer.id !== offerId) return offer;

      const updatedHistory = [...offer.history];

      if (action === 'accept') {
        updatedHistory.push({
          actorId: user.id,
          actorName: user.businessName || user.fullName,
          actorRole: user.role,
          action: 'Accepted Offer',
          note: 'Offer accepted. Awaiting collection or logistics arrangement.',
          timestamp: new Date().toISOString(),
        });

        // Reserve listing if all quantity taken
        if (offer.quantity >= (store.getListingById(offer.listingId)?.quantity || 0)) {
          store.updateListingStatus(offer.listingId, 'reserved');
        }

        // Notify counterparty
        const recipientId = user.id === offer.buyerId ? offer.supplierId : offer.buyerId;
        store.addNotification({
          userId: recipientId,
          title: 'Offer Accepted!',
          message: `${user.businessName || user.fullName} accepted the offer of KES ${offer.pricePerUnit}/${offer.unit} (${offer.totalEstimatedValue.toLocaleString()} KES total).`,
          type: 'offer',
          linkTarget: 'offers',
        });

        return {
          ...offer,
          status: 'accepted',
          history: updatedHistory,
          updatedAt: new Date().toISOString(),
        };
      } else if (action === 'reject') {
        updatedHistory.push({
          actorId: user.id,
          actorName: user.businessName || user.fullName,
          actorRole: user.role,
          action: 'Declined Offer',
          note: counterDetails?.notes || 'Offer declined.',
          timestamp: new Date().toISOString(),
        });

        return {
          ...offer,
          status: 'rejected',
          history: updatedHistory,
          updatedAt: new Date().toISOString(),
        };
      } else if (action === 'counter' && counterDetails) {
        const newTotal = Math.round(offer.quantity * counterDetails.pricePerUnit * 100) / 100;
        updatedHistory.push({
          actorId: user.id,
          actorName: user.businessName || user.fullName,
          actorRole: user.role,
          action: 'Counteroffer Sent',
          note: counterDetails.notes,
          pricePerUnit: counterDetails.pricePerUnit,
          quantity: offer.quantity,
          timestamp: new Date().toISOString(),
        });

        // Notify counterparty
        const recipientId = user.id === offer.buyerId ? offer.supplierId : offer.buyerId;
        store.addNotification({
          userId: recipientId,
          title: 'Counteroffer Received',
          message: `${user.businessName || user.fullName} countered at KES ${counterDetails.pricePerUnit}/${offer.unit}: "${counterDetails.notes}"`,
          type: 'offer',
          linkTarget: 'offers',
        });

        return {
          ...offer,
          pricePerUnit: counterDetails.pricePerUnit,
          totalEstimatedValue: newTotal,
          counterPricePerUnit: counterDetails.pricePerUnit,
          counterNotes: counterDetails.notes,
          status: 'counteroffer',
          history: updatedHistory,
          updatedAt: new Date().toISOString(),
        };
      }
      return offer;
    });

    setStored(STORAGE_KEYS.OFFERS, offers);
    notifyListeners();
  },

  advanceOfferStatus: (offerId: string, status: Offer['status'], note?: string) => {
    const user = store.getCurrentUser();
    offers = offers.map((o) => {
      if (o.id !== offerId) return o;
      const history = [
        ...o.history,
        {
          actorId: user.id,
          actorName: user.businessName || user.fullName,
          actorRole: user.role,
          action: `Status changed to ${status.replace('_', ' ')}`,
          note,
          timestamp: new Date().toISOString(),
        },
      ];
      return { ...o, status, history, updatedAt: new Date().toISOString() };
    });
    setStored(STORAGE_KEYS.OFFERS, offers);
    notifyListeners();
  },

  // Bulk Request / Aggregation actions
  createBulkRequest: (req: Omit<BulkRequest, 'id' | 'buyerId' | 'buyerName' | 'buyerVerified' | 'currentAggregatedQuantity' | 'status' | 'contributions' | 'createdAt'>) => {
    const user = store.getCurrentUser();
    const newReq: BulkRequest = {
      ...req,
      id: `bulk-${Date.now()}`,
      buyerId: user.id,
      buyerName: user.businessName || user.fullName,
      buyerVerified: user.verificationStatus === 'verified',
      currentAggregatedQuantity: 0,
      status: 'open',
      contributions: [],
      createdAt: new Date().toISOString(),
    };
    bulkRequests = [newReq, ...bulkRequests];
    setStored(STORAGE_KEYS.BULK_REQUESTS, bulkRequests);

    store.addNotification({
      userId: DEMO_USERS.supplier.id,
      title: 'New Bulk Waste Request in Eldoret',
      message: `${newReq.buyerName} is seeking ${newReq.targetQuantity.toLocaleString()} ${newReq.unit} of ${newReq.subcategory || newReq.categoryName}. Join the aggregation group to fulfill it.`,
      type: 'aggregation',
      linkTarget: 'bulk-requests',
    });

    notifyListeners();
    return newReq;
  },

  contributeToBulkRequest: (bulkId: string, listingId: string, quantity: number) => {
    const user = store.getCurrentUser();
    const listing = listings.find((l) => l.id === listingId);
    if (!listing) throw new Error('Listing not found');

    bulkRequests = bulkRequests.map((b) => {
      if (b.id !== bulkId) return b;

      const newContribution: AggregationContribution = {
        id: `contrib-${Date.now()}`,
        groupId: b.id,
        listingId: listing.id,
        supplierId: user.id,
        supplierName: user.businessName || user.fullName,
        supplierArea: listing.approximateLocation.area,
        proposedQuantity: quantity,
        unit: b.unit,
        agreedPricePerUnit: b.targetPricePerUnit,
        status: 'approved',
        createdAt: new Date().toISOString(),
      };

      const newContributions = [...b.contributions, newContribution];
      const newAggQuantity = newContributions.reduce((sum, c) => sum + c.proposedQuantity, 0);
      const newStatus = newAggQuantity >= b.targetQuantity ? 'target_reached' : 'partially_matched';

      return {
        ...b,
        contributions: newContributions,
        currentAggregatedQuantity: newAggQuantity,
        status: newStatus,
      };
    });

    setStored(STORAGE_KEYS.BULK_REQUESTS, bulkRequests);

    // Notify buyer
    const targetBulk = bulkRequests.find((b) => b.id === bulkId);
    if (targetBulk) {
      store.addNotification({
        userId: targetBulk.buyerId,
        title: 'New Aggregation Contribution!',
        message: `${user.businessName || user.fullName} added ${quantity} ${targetBulk.unit} toward your ${targetBulk.subcategory || targetBulk.categoryName} target (${targetBulk.currentAggregatedQuantity}/${targetBulk.targetQuantity} ${targetBulk.unit} reached).`,
        type: 'aggregation',
        linkTarget: 'bulk-requests',
      });
    }

    notifyListeners();
  },

  // Transport & Logistics actions
  createTransportJob: (jobData: Omit<TransportJob, 'id' | 'requesterId' | 'requesterName' | 'requesterRole' | 'status' | 'quotes' | 'createdAt'>) => {
    const user = store.getCurrentUser();
    const newJob: TransportJob = {
      ...jobData,
      id: `job-${Date.now()}`,
      requesterId: user.id,
      requesterName: user.businessName || user.fullName,
      requesterRole: user.role === 'buyer' ? 'buyer' : 'supplier',
      status: 'open_for_quotes',
      quotes: [],
      createdAt: new Date().toISOString(),
    };
    transportJobs = [newJob, ...transportJobs];
    setStored(STORAGE_KEYS.TRANSPORT_JOBS, transportJobs);

    // Notify transporters
    store.addNotification({
      userId: DEMO_USERS.transporter.id,
      title: 'New Recyclable Haulage Job',
      message: `${newJob.requesterName} needs transport for ${newJob.quantity} ${newJob.unit} of ${newJob.materialName} (${newJob.pickupArea} → ${newJob.deliveryArea}).`,
      type: 'collection',
      linkTarget: 'logistics',
    });

    notifyListeners();
    return newJob;
  },

  submitTransportQuote: (quoteData: {
    jobId: string;
    vehicleType: TransportJob['vehicleRequirement'];
    quoteAmount: number;
    estimatedHours: number;
    availabilityNotes: string;
  }) => {
    const user = store.getCurrentUser();
    transportJobs = transportJobs.map((job) => {
      if (job.id !== quoteData.jobId) return job;

      const newQuote: TransportQuote = {
        id: `quote-${Date.now()}`,
        jobId: job.id,
        transporterId: user.id,
        transporterName: user.businessName || user.fullName,
        transporterRating: user.rating,
        vehicleType: quoteData.vehicleType,
        quoteAmount: quoteData.quoteAmount,
        currency: 'KES',
        estimatedHours: quoteData.estimatedHours,
        availabilityNotes: quoteData.availabilityNotes,
        status: 'submitted',
        createdAt: new Date().toISOString(),
      };

      return {
        ...job,
        quotes: [...job.quotes, newQuote],
      };
    });

    setStored(STORAGE_KEYS.TRANSPORT_JOBS, transportJobs);

    // Notify requester
    const targetJob = transportJobs.find((j) => j.id === quoteData.jobId);
    if (targetJob) {
      store.addNotification({
        userId: targetJob.requesterId,
        title: 'New Transport Quote Received',
        message: `${user.businessName || user.fullName} submitted a quote of KES ${quoteData.quoteAmount.toLocaleString()} for hauling ${targetJob.materialName}.`,
        type: 'collection',
        linkTarget: 'logistics',
      });
    }

    notifyListeners();
  },

  acceptTransportQuote: (jobId: string, quoteId: string) => {
    transportJobs = transportJobs.map((job) => {
      if (job.id !== jobId) return job;
      const acceptedQuote = job.quotes.find((q) => q.id === quoteId);
      if (!acceptedQuote) return job;

      return {
        ...job,
        assignedTransporterId: acceptedQuote.transporterId,
        assignedTransporterName: acceptedQuote.transporterName,
        agreedFee: acceptedQuote.quoteAmount,
        status: 'assigned',
        quotes: job.quotes.map((q) => (q.id === quoteId ? { ...q, status: 'accepted' } : { ...q, status: 'rejected' })),
      };
    });

    setStored(STORAGE_KEYS.TRANSPORT_JOBS, transportJobs);
    notifyListeners();
  },

  advanceTransportStatus: (jobId: string, newStatus: TransportJob['status'], notes?: { proof?: string }) => {
    transportJobs = transportJobs.map((j) => {
      if (j.id !== jobId) return j;
      const updates: Partial<TransportJob> = { status: newStatus };
      if (newStatus === 'in_transit') {
        updates.pickupTimestamp = new Date().toISOString();
        if (notes?.proof) updates.pickupProofNote = notes.proof;
      } else if (newStatus === 'delivered' || newStatus === 'completed') {
        updates.deliveryTimestamp = new Date().toISOString();
        if (notes?.proof) updates.deliveryProofNote = notes.proof;
      }
      return { ...j, ...updates };
    });
    setStored(STORAGE_KEYS.TRANSPORT_JOBS, transportJobs);
    notifyListeners();
  },

  // Review
  addReview: (reviewData: Omit<Review, 'id' | 'createdAt' | 'reviewerId' | 'reviewerName' | 'reviewerRole'>) => {
    const user = store.getCurrentUser();
    const newRev: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      reviewerId: user.id,
      reviewerName: user.businessName || user.fullName,
      reviewerRole: user.role,
      createdAt: new Date().toISOString(),
    };
    reviews = [newRev, ...reviews];
    setStored(STORAGE_KEYS.REVIEWS, reviews);
    notifyListeners();
    return newRev;
  },

  // Report
  addReport: (reportData: Omit<Report, 'id' | 'createdAt' | 'status' | 'reporterId' | 'reporterName'>) => {
    const user = store.getCurrentUser();
    const newRep: Report = {
      ...reportData,
      id: `rep-${Date.now()}`,
      reporterId: user.id,
      reporterName: user.businessName || user.fullName,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    reports = [newRep, ...reports];
    setStored(STORAGE_KEYS.REPORTS, reports);
    notifyListeners();
    return newRep;
  },

  resolveReport: (reportId: string, resolution: 'resolved' | 'dismissed', adminNotes: string) => {
    reports = reports.map((r) => (r.id === reportId ? { ...r, status: resolution, adminNotes } : r));
    setStored(STORAGE_KEYS.REPORTS, reports);
    notifyListeners();
  },

  // Notification
  addNotification: (notifData: Omit<InAppNotification, 'id' | 'createdAt' | 'read'>) => {
    const newNotif: InAppNotification = {
      ...notifData,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    notifications = [newNotif, ...notifications];
    setStored(STORAGE_KEYS.NOTIFICATIONS, notifications);
    notifyListeners();
  },

  markNotificationRead: (id: string) => {
    notifications = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    setStored(STORAGE_KEYS.NOTIFICATIONS, notifications);
    notifyListeners();
  },

  markAllNotificationsRead: () => {
    notifications = notifications.map((n) => ({ ...n, read: true }));
    setStored(STORAGE_KEYS.NOTIFICATIONS, notifications);
    notifyListeners();
  },

  // Messages & Chat
  sendMessage: (conversationId: string, text: string) => {
    const user = store.getCurrentUser();
    const timestamp = new Date().toISOString();
    conversations = conversations.map((conv) => {
      if (conv.id !== conversationId) return conv;
      const newMsg = {
        id: `msg-${Date.now()}`,
        senderId: user.id,
        senderName: user.businessName || user.fullName,
        senderRole: user.role,
        text,
        timestamp,
      };
      return {
        ...conv,
        messages: [...conv.messages, newMsg],
        lastMessage: text,
        lastMessageTimestamp: timestamp,
      };
    });
    setStored(STORAGE_KEYS.CONVERSATIONS, conversations);
    notifyListeners();
  },

  // Verification request update
  updateUserVerification: (userId: string, status: UserProfile['verificationStatus']) => {
    const roleKey = Object.keys(usersMap).find((k) => usersMap[k].id === userId);
    if (roleKey) {
      usersMap[roleKey] = { ...usersMap[roleKey], verificationStatus: status };
      setStored(STORAGE_KEYS.USERS, usersMap);
      notifyListeners();
    }
  },
};

// React hook for observing store updates
export function useTakaStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const update = () => setTick((t) => t + 1);
    listeners.add(update);
    return () => {
      listeners.delete(update);
    };
  }, []);

  const currentUser = store.getCurrentUser();
  const currentRole = store.getCurrentRole();
  const listings = store.getListings();
  const bulkRequests = store.getBulkRequests();
  const offers = store.getOffers();
  const transportJobs = store.getTransportJobs();
  const reviews = store.getReviews();
  const reports = store.getReports();
  const notifications = store.getNotifications();
  const conversations = store.getConversations();

  return {
    theme: store.getTheme(),
    setTheme: store.setTheme,
    toggleTheme: store.toggleTheme,
    currentUser,
    currentRole,
    listings,
    bulkRequests,
    offers,
    transportJobs,
    reviews,
    reports,
    notifications,
    conversations,
    switchRole: store.switchRole,
    resetToDemoDefaults: store.resetToDemoDefaults,
    addListing: store.addListing,
    updateListingStatus: store.updateListingStatus,
    incrementListingViews: store.incrementListingViews,
    createOffer: store.createOffer,
    respondToOffer: store.respondToOffer,
    advanceOfferStatus: store.advanceOfferStatus,
    createBulkRequest: store.createBulkRequest,
    contributeToBulkRequest: store.contributeToBulkRequest,
    createTransportJob: store.createTransportJob,
    submitTransportQuote: store.submitTransportQuote,
    acceptTransportQuote: store.acceptTransportQuote,
    advanceTransportStatus: store.advanceTransportStatus,
    addReview: store.addReview,
    addReport: store.addReport,
    resolveReport: store.resolveReport,
    markNotificationRead: store.markNotificationRead,
    markAllNotificationsRead: store.markAllNotificationsRead,
    sendMessage: store.sendMessage,
    updateUserVerification: store.updateUserVerification,
  };
}
