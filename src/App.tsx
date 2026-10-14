import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPageView } from './views/LandingPageView';
import { MarketplaceView } from './views/MarketplaceView';
import { BulkRequestsView } from './views/BulkRequestsView';
import { LogisticsView } from './views/LogisticsView';
import { OffersView } from './views/OffersView';
import { DashboardView } from './views/DashboardView';
import { HowItWorksView } from './views/HowItWorksView';

import { ListingDetailModal } from './components/ListingDetailModal';
import { CreateListingModal } from './components/CreateListingModal';
import { MakeOfferModal } from './components/MakeOfferModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { SchemaViewerModal } from './components/SchemaViewerModal';
import { PrivacyTermsModal } from './components/PrivacyTermsModal';
import { ReportModal } from './components/ReportModal';

import { Listing, Offer } from './types';
import { useTakaStore } from './services/store';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('landing');

  // Modals state
  const [showCreateListing, setShowCreateListing] = useState<boolean>(false);
  const [showAiAssistant, setShowAiAssistant] = useState<boolean>(false);
  const [showSchemaViewer, setShowSchemaViewer] = useState<boolean>(false);
  const [showPrivacyTerms, setShowPrivacyTerms] = useState<boolean>(false);

  const [selectedListingDetail, setSelectedListingDetail] = useState<Listing | null>(null);
  const [selectedListingForOffer, setSelectedListingForOffer] = useState<Listing | null>(null);
  const [selectedListingForReport, setSelectedListingForReport] = useState<Listing | null>(null);

  const { incrementListingViews, theme } = useTakaStore();

  const handleOpenListingDetails = (listing: Listing) => {
    incrementListingViews(listing.id);
    setSelectedListingDetail(listing);
  };

  const handleOpenMakeOffer = (listing: Listing) => {
    setSelectedListingForOffer(listing);
  };

  const handleOpenReportListing = (listing: Listing) => {
    setSelectedListingForReport(listing);
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans selection:bg-[#176B4D]/20 transition-colors ${
        theme === 'light'
          ? 'bg-[#FFFFFF] text-[#17324D]'
          : 'bg-[#0d1e2e] text-[#F7F8F4]'
      }`}
    >
      {/* Navbar with Demo Switcher and Primary Actions */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenCreateListing={() => setShowCreateListing(true)}
        onOpenAiAssistant={() => setShowAiAssistant(true)}
        onOpenSchemaViewer={() => setShowSchemaViewer(true)}
      />

      {/* Main Page Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {currentTab === 'landing' && (
          <LandingPageView
            onSelectTab={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenCreateListing={() => setShowCreateListing(true)}
            onOpenAiAssistant={() => setShowAiAssistant(true)}
          />
        )}

        {currentTab === 'marketplace' && (
          <MarketplaceView
            onViewDetails={handleOpenListingDetails}
            onMakeOffer={handleOpenMakeOffer}
            onOpenCreateListing={() => setShowCreateListing(true)}
            onOpenAiAssistant={() => setShowAiAssistant(true)}
          />
        )}

        {currentTab === 'bulk-requests' && (
          <BulkRequestsView
            onOpenAiAssistant={() => setShowAiAssistant(true)}
          />
        )}

        {currentTab === 'logistics' && (
          <LogisticsView />
        )}

        {currentTab === 'offers' && (
          <OffersView />
        )}

        {currentTab === 'dashboard' && (
          <DashboardView
            onOpenCreateListing={() => setShowCreateListing(true)}
            onOpenSchemaViewer={() => setShowSchemaViewer(true)}
            onSelectTab={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'how-it-works' && (
          <HowItWorksView />
        )}
      </main>

      {/* Footer */}
      <Footer
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenPrivacyTerms={() => setShowPrivacyTerms(true)}
        onOpenSchemaViewer={() => setShowSchemaViewer(true)}
      />

      {/* Modals */}
      {selectedListingDetail && (
        <ListingDetailModal
          listing={selectedListingDetail}
          onClose={() => setSelectedListingDetail(null)}
          onMakeOffer={(listing) => {
            setSelectedListingDetail(null);
            setSelectedListingForOffer(listing);
          }}
          onReportListing={(listing) => {
            setSelectedListingDetail(null);
            setSelectedListingForReport(listing);
          }}
        />
      )}

      {selectedListingForOffer && (
        <MakeOfferModal
          listing={selectedListingForOffer}
          onClose={() => setSelectedListingForOffer(null)}
          onSuccess={() => {
            setSelectedListingForOffer(null);
            setCurrentTab('offers');
          }}
        />
      )}

      {selectedListingForReport && (
        <ReportModal
          listing={selectedListingForReport}
          onClose={() => setSelectedListingForReport(null)}
          onSuccess={() => setSelectedListingForReport(null)}
        />
      )}

      {showCreateListing && (
        <CreateListingModal
          isOpen={showCreateListing}
          onClose={() => setShowCreateListing(false)}
          onSuccess={() => {
            setShowCreateListing(false);
            setCurrentTab('marketplace');
          }}
        />
      )}

      {showAiAssistant && (
        <AiAssistantModal
          isOpen={showAiAssistant}
          onClose={() => setShowAiAssistant(false)}
        />
      )}

      {showSchemaViewer && (
        <SchemaViewerModal
          isOpen={showSchemaViewer}
          onClose={() => setShowSchemaViewer(false)}
        />
      )}

      {showPrivacyTerms && (
        <PrivacyTermsModal
          isOpen={showPrivacyTerms}
          onClose={() => setShowPrivacyTerms(false)}
        />
      )}
    </div>
  );
};

export default App;
