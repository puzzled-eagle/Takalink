import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Layers,
  Truck,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  CheckCircle,
  XCircle,
  FileText,
  User,
  PlusCircle,
  ExternalLink,
} from 'lucide-react';
import { useTakaStore } from '../services/store';
import { UserRole, Listing, Offer, TransportJob, Report } from '../types';

interface DashboardViewProps {
  onOpenCreateListing: () => void;
  onOpenSchemaViewer: () => void;
  onSelectTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenCreateListing,
  onOpenSchemaViewer,
  onSelectTab,
}) => {
  const {
    currentUser,
    currentRole,
    switchRole,
    listings,
    bulkRequests,
    offers,
    transportJobs,
    reports,
    resolveReport,
    updateListingStatus,
    updateUserVerification,
  } = useTakaStore();

  // Metrics calculations
  const myListings = listings.filter((l) => l.supplierId === currentUser.id);
  const myOffersReceived = offers.filter((o) => o.supplierId === currentUser.id);
  const myOffersSent = offers.filter((o) => o.buyerId === currentUser.id);
  const myTransportQuotes = transportJobs.filter((j) =>
    j.quotes.some((q) => q.transporterId === currentUser.id) || j.assignedTransporterId === currentUser.id
  );

  const completedSales = myOffersReceived.filter((o) => o.status === 'completed');
  const totalSalesRevenue = completedSales.reduce((acc, o) => acc + o.totalEstimatedValue, 0);

  const completedPurchases = myOffersSent.filter((o) => o.status === 'completed');
  const totalPurchaseSpend = completedPurchases.reduce((acc, o) => acc + o.totalEstimatedValue, 0);

  const completedHaulage = transportJobs.filter(
    (j) => j.assignedTransporterId === currentUser.id && j.status === 'completed'
  );
  const totalFreightRevenue = completedHaulage.reduce((acc, j) => acc + (j.agreedFee || 0), 0);

  return (
    <div className="space-y-6 py-6">
      {/* Top Welcome Card */}
      <div className="bg-white rounded-2xl p-6 border border-[#17324D]/10 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#176B4D] bg-[#176B4D]/10 px-2 py-0.5 rounded">
              {currentRole.toUpperCase()} CONSOLE
            </span>
            {currentUser.verificationStatus === 'verified' && (
              <span className="flex items-center gap-1 text-[11px] font-bold text-[#176B4D]">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Entity
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#17324D] font-heading">
            {currentUser.businessName || currentUser.fullName}
          </h1>
          <p className="text-xs text-gray-500">
            Operating in {currentUser.location.area}, {currentUser.location.town} • NEMA Ref:{' '}
            {currentUser.nemaPermitNumber || 'Standard Licensed'}
          </p>
        </div>

        {/* Role Quick Switch in Dashboard */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F7F8F4] rounded-xl border border-gray-200 text-xs">
          {(['supplier', 'buyer', 'transporter', 'admin'] as UserRole[]).map((r) => (
            <button
              key={r}
              onClick={() => switchRole(r)}
              className={`px-3 py-1.5 rounded-lg font-semibold capitalize transition ${
                currentRole === r
                  ? 'bg-[#17324D] text-white shadow-xs'
                  : 'text-gray-600 hover:text-[#17324D]'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* SUPPLIER DASHBOARD */}
      {currentRole === 'supplier' && (
        <div className="space-y-6">
          {/* Supplier Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-xl border border-gray-200">
              <span className="text-[10px] font-bold text-gray-400 uppercase">My Active Listings</span>
              <p className="text-2xl font-extrabold text-[#17324D] mt-1">{myListings.length}</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-gray-200">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Incoming Offers</span>
              <p className="text-2xl font-extrabold text-[#176B4D] mt-1">{myOffersReceived.length}</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-gray-200">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Completed Trades</span>
              <p className="text-2xl font-extrabold text-[#17324D] mt-1">{completedSales.length}</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-gray-200">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Settled Revenue</span>
              <p className="text-2xl font-extrabold text-[#176B4D] mt-1">
                KES {totalSalesRevenue.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Supplier Listings Manager */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#17324D] uppercase tracking-wider">
                  My Listed Inventory
                </h3>
                <p className="text-xs text-gray-500">Manage, pause, or update your active waste stock</p>
              </div>
              <button
                onClick={onOpenCreateListing}
                className="px-3 py-1.5 bg-[#176B4D] text-white text-xs font-bold rounded-lg hover:bg-[#176B4D]/90 transition"
              >
                + Post Batch
              </button>
            </div>

            {myListings.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-500">
                You haven't posted any waste listings yet. Click "+ Post Batch" to start.
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {myListings.map((item) => (
                  <div key={item.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="font-bold text-[#17324D]">{item.title}</span>
                      <p className="text-[11px] text-gray-500">
                        {item.quantity} {item.unit} • {item.approximateLocation.area} • KES {item.askingPricePerUnit}/{item.unit}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        item.status === 'active' ? 'bg-[#176B4D]/10 text-[#176B4D]' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {item.status}
                      </span>
                      {item.status === 'active' ? (
                        <button
                          onClick={() => updateListingStatus(item.id, 'reserved')}
                          className="px-2.5 py-1 text-[11px] text-gray-600 hover:bg-gray-100 rounded"
                        >
                          Mark Reserved
                        </button>
                      ) : (
                        <button
                          onClick={() => updateListingStatus(item.id, 'active')}
                          className="px-2.5 py-1 text-[11px] text-[#176B4D] hover:bg-[#176B4D]/10 rounded"
                        >
                          Reactivate
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* BUYER DASHBOARD */}
      {currentRole === 'buyer' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-xl border border-gray-200">
              <span className="text-[10px] font-bold text-gray-400 uppercase">My Purchase Offers</span>
              <p className="text-2xl font-extrabold text-[#17324D] mt-1">{myOffersSent.length}</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-gray-200">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Bulk Pools Open</span>
              <p className="text-2xl font-extrabold text-[#176B4D] mt-1">{bulkRequests.length}</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-gray-200">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Materials Received</span>
              <p className="text-2xl font-extrabold text-[#17324D] mt-1">{completedPurchases.length}</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-gray-200">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Procurement Spend</span>
              <p className="text-2xl font-extrabold text-[#176B4D] mt-1">
                KES {totalPurchaseSpend.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#17324D] uppercase tracking-wider">
                  Submitted Offers to Suppliers
                </h3>
                <p className="text-xs text-gray-500">Review status of your material procurement bids</p>
              </div>
              <button
                onClick={() => onSelectTab('marketplace')}
                className="px-3 py-1.5 bg-[#176B4D] text-white text-xs font-bold rounded-lg hover:bg-[#176B4D]/90 transition"
              >
                Browse Batches
              </button>
            </div>

            <div className="divide-y divide-gray-100">
              {myOffersSent.map((offer) => (
                <div key={offer.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-[#17324D]">{offer.listingTitle}</span>
                    <p className="text-[11px] text-gray-500">
                      Supplier: {offer.supplierName} • {offer.quantity} {offer.unit} @ KES {offer.pricePerUnit}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[#176B4D]">
                      KES {offer.totalEstimatedValue.toLocaleString()}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#176B4D]/10 text-[#176B4D]">
                      {offer.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TRANSPORTER DASHBOARD */}
      {currentRole === 'transporter' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-xl border border-gray-200">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Eligible Jobs</span>
              <p className="text-2xl font-extrabold text-[#17324D] mt-1">{transportJobs.length}</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-gray-200">
              <span className="text-[10px] font-bold text-gray-400 uppercase">My Active Quotes</span>
              <p className="text-2xl font-extrabold text-[#176B4D] mt-1">{myTransportQuotes.length}</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-gray-200">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Completed Hauls</span>
              <p className="text-2xl font-extrabold text-[#17324D] mt-1">{completedHaulage.length}</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-gray-200">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Logistics Earnings</span>
              <p className="text-2xl font-extrabold text-[#176B4D] mt-1">
                KES {totalFreightRevenue.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#17324D] uppercase tracking-wider">
                  Assigned & Active Freight Jobs
                </h3>
                <p className="text-xs text-gray-500">Your dispatched vehicles and collection schedules</p>
              </div>
              <button
                onClick={() => onSelectTab('logistics')}
                className="px-3 py-1.5 bg-[#176B4D] text-white text-xs font-bold rounded-lg hover:bg-[#176B4D]/90 transition"
              >
                Logistics Board
              </button>
            </div>

            <div className="divide-y divide-gray-100">
              {transportJobs.map((job) => (
                <div key={job.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-[#17324D]">
                      {job.quantity} {job.unit} of {job.materialName}
                    </span>
                    <p className="text-[11px] text-gray-500">
                      Route: {job.pickupArea} ➔ {job.deliveryArea}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-50 text-blue-700">
                      {job.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ADMIN DASHBOARD */}
      {currentRole === 'admin' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-xl border border-gray-200">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Platform Listings</span>
              <p className="text-2xl font-extrabold text-[#17324D] mt-1">{listings.length}</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-gray-200">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Active Offers</span>
              <p className="text-2xl font-extrabold text-[#176B4D] mt-1">{offers.length}</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-gray-200">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Pending Reports</span>
              <p className="text-2xl font-extrabold text-red-600 mt-1">
                {reports.filter((r) => r.status === 'pending').length}
              </p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-gray-200">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Transport Jobs</span>
              <p className="text-2xl font-extrabold text-[#17324D] mt-1">{transportJobs.length}</p>
            </div>
          </div>

          {/* Reports & Compliance Desk */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#17324D] uppercase tracking-wider">
                  Safety Reports & Listing Moderation Queue
                </h3>
                <p className="text-xs text-gray-500">
                  Enforce NEMA hazardous waste compliance and anti-fraud policies
                </p>
              </div>

              <button
                onClick={onOpenSchemaViewer}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#17324D] text-white rounded-lg hover:bg-[#17324D]/90 transition"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Supabase SQL Migration</span>
              </button>
            </div>

            {reports.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-500">
                All reports resolved. No pending compliance issues.
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map((rep) => (
                  <div
                    key={rep.id}
                    className="p-4 rounded-xl border border-gray-200 bg-white text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-red-700">Flagged: {rep.targetTitle}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        rep.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {rep.status}
                      </span>
                    </div>
                    <p className="text-gray-700">
                      <strong>Report Reason:</strong> {rep.reason.replace(/_/g, ' ')}
                    </p>
                    <p className="text-gray-600 bg-gray-50 p-2 rounded border border-gray-100">
                      {rep.details}
                    </p>
                    {rep.adminNotes && (
                      <p className="text-gray-500 italic text-[11px]">Admin Resolution: "{rep.adminNotes}"</p>
                    )}

                    {rep.status === 'pending' && (
                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          onClick={() => resolveReport(rep.id, 'dismissed', 'Verified compliant with NEMA exemptions.')}
                          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-[11px]"
                        >
                          Dismiss Flag
                        </button>
                        <button
                          onClick={() => resolveReport(rep.id, 'resolved', 'Seller suspended pending NEMA transport certification.')}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-[11px]"
                        >
                          Enforce & Take Down
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
