import React, { useState } from 'react';
import {
  Recycle,
  Layers,
  Truck,
  PlusCircle,
  Bell,
  HelpCircle,
  LayoutDashboard,
  Sparkles,
  CheckCircle,
  FileText,
  User,
  Shield,
  RotateCcw,
  Sun,
  Moon,
} from 'lucide-react';
import { useTakaStore } from '../services/store';
import { UserRole } from '../types';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenCreateListing: () => void;
  onOpenAiAssistant: () => void;
  onOpenSchemaViewer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenCreateListing,
  onOpenAiAssistant,
  onOpenSchemaViewer,
}) => {
  const {
    theme,
    toggleTheme,
    currentUser,
    currentRole,
    switchRole,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    resetToDemoDefaults,
  } = useTakaStore();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const rolesList: { role: UserRole; label: string; badge: string; desc: string }[] = [
    { role: 'supplier', label: 'Waste Supplier', badge: 'Grace Wanjiku', desc: 'Sells sorted PET & cardboard in West Indies' },
    { role: 'buyer', label: 'Recycler / Buyer', badge: 'Rift Valley Recyclers', desc: 'Sources bulk materials in Industrial Area' },
    { role: 'transporter', label: 'Cargo Transporter', badge: 'Kipchoge Eco-Logistics', desc: 'Canter & pickup hauler in Pioneer' },
    { role: 'admin', label: 'Platform Admin', badge: 'TakaLink Compliance Desk', desc: 'Verifications, disputes, and safety audit' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E9ED]">
      {/* Top Demo Context Banner */}
      <div
        className={`text-xs py-1.5 px-4 flex flex-wrap items-center justify-between gap-2 border-b transition-colors ${
          theme === 'light'
            ? 'bg-[#F7F8F4] text-[#17324D] border-[#E5E9ED]'
            : 'bg-[#17324D] text-[#F7F8F4] border-[#17324D]/20'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-[#176B4D] text-[10px] font-bold tracking-wide uppercase text-white">
            Eldoret Pilot
          </span>
          <span className={`hidden sm:inline ${theme === 'light' ? 'text-[#536575]' : 'text-white/80'}`}>
            TakaLink Circular Economy Platform — Demonstration Mode
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className={`flex items-center gap-1.5 text-xs px-2 py-0.5 rounded transition ${
                theme === 'light'
                  ? 'text-[#17324D] hover:bg-[#F7F8F4] border border-[#E5E9ED]'
                  : 'text-white/90 hover:text-white bg-white/10'
              }`}
            >
              <User className="w-3.5 h-3.5 text-[#176B4D]" />
              <span>Viewing as:</span>
              <strong className={theme === 'light' ? 'text-[#17324D] capitalize' : 'text-white capitalize'}>
                {currentRole}
              </strong>
              <span className="text-[10px] opacity-70">({currentUser.businessName || currentUser.fullName})</span>
              <span className="ml-1 text-[10px]">▼</span>
            </button>

            {showRoleMenu && (
              <div
                className="absolute right-0 mt-1 w-72 bg-white rounded-lg shadow-xl border border-[#E5E9ED] py-1 z-50 text-[#17324D]"
                onMouseLeave={() => setShowRoleMenu(false)}
              >
                <div className="px-3 py-1.5 border-b border-[#E5E9ED] bg-[#F7F8F4]">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#536575]">
                    Switch Persona (Test Workflows)
                  </p>
                </div>
                {rolesList.map((item) => (
                  <button
                    key={item.role}
                    onClick={() => {
                      switchRole(item.role);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex flex-col gap-0.5 hover:bg-[#F7F8F4] transition ${
                      currentRole === item.role ? 'bg-[#176B4D]/10 border-l-4 border-[#176B4D]' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#17324D]">{item.label}</span>
                      {currentRole === item.role && (
                        <CheckCircle className="w-3.5 h-3.5 text-[#176B4D]" />
                      )}
                    </div>
                    <span className="text-[11px] text-[#176B4D] font-medium">{item.badge}</span>
                    <span className="text-[10px] text-[#536575]">{item.desc}</span>
                  </button>
                ))}
                <div className="border-t border-[#E5E9ED] p-2 bg-[#F7F8F4]">
                  <button
                    onClick={() => {
                      resetToDemoDefaults();
                      setShowRoleMenu(false);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 px-2 py-1 text-[11px] text-[#536575] hover:text-[#17324D] hover:bg-white rounded transition"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset Demo State
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onOpenSchemaViewer}
            className={`hidden md:flex items-center gap-1 text-[11px] transition ${
              theme === 'light' ? 'text-[#536575] hover:text-[#17324D]' : 'text-white/70 hover:text-white'
            }`}
            title="View PostgreSQL / Supabase Schema"
          >
            <FileText className="w-3 h-3" />
            <span>Database SQL</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo & Tagline */}
          <button
            onClick={() => onSelectTab('landing')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-[#176B4D] flex items-center justify-center text-white shadow-sm transition group-hover:scale-105">
              <Recycle className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-[#17324D] font-heading">
                  Taka<span className="text-[#176B4D]">Link</span>
                </span>
                <span className="text-[10px] bg-[#176B4D]/10 text-[#176B4D] font-bold px-1.5 py-0.5 rounded">
                  KE
                </span>
              </div>
              <p className="text-[10px] font-medium text-[#17324D]/60 tracking-tight -mt-0.5">
                Turning waste into value.
              </p>
            </div>
          </button>

          {/* Nav Items */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
            <button
              onClick={() => onSelectTab('marketplace')}
              className={`px-3 py-2 rounded-lg transition ${
                currentTab === 'marketplace'
                  ? 'bg-[#176B4D] text-white font-semibold'
                  : 'text-[#17324D] hover:bg-[#F7F8F4]'
              }`}
            >
              Marketplace
            </button>

            <button
              onClick={() => onSelectTab('bulk-requests')}
              className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition ${
                currentTab === 'bulk-requests'
                  ? 'bg-[#176B4D] text-white font-semibold'
                  : 'text-[#17324D] hover:bg-[#F7F8F4]'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Bulk Aggregation</span>
            </button>

            <button
              onClick={() => onSelectTab('logistics')}
              className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition ${
                currentTab === 'logistics'
                  ? 'bg-[#176B4D] text-white font-semibold'
                  : 'text-[#17324D] hover:bg-[#F7F8F4]'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Logistics</span>
            </button>

            <button
              onClick={() => onSelectTab('offers')}
              className={`px-3 py-2 rounded-lg transition ${
                currentTab === 'offers'
                  ? 'bg-[#176B4D] text-white font-semibold'
                  : 'text-[#17324D] hover:bg-[#F7F8F4]'
              }`}
            >
              Negotiations
            </button>

            <button
              onClick={() => onSelectTab('dashboard')}
              className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition ${
                currentTab === 'dashboard'
                  ? 'bg-[#176B4D] text-white font-semibold'
                  : 'text-[#17324D] hover:bg-[#F7F8F4]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => onSelectTab('how-it-works')}
              className={`px-3 py-2 rounded-lg transition ${
                currentTab === 'how-it-works'
                  ? 'bg-[#176B4D] text-white font-semibold'
                  : 'text-[#17324D]/80 hover:bg-[#F7F8F4]'
              }`}
            >
              How It Works
            </button>
          </nav>

          {/* Right Action Icons & Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Mode Toggle (Light / Dark) */}
            <button
              onClick={toggleTheme}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition ${
                theme === 'light'
                  ? 'bg-[#F7F8F4] text-[#17324D] border-[#E5E9ED] hover:bg-[#E5E9ED]'
                  : 'bg-[#17324D] text-[#F7F8F4] border-gray-700 hover:bg-[#17324D]/80'
              }`}
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="hidden sm:inline">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-blue-300 shrink-0" />
                  <span className="hidden sm:inline">Dark Mode</span>
                </>
              )}
            </button>

            {/* AI Assistant button */}
            <button
              onClick={onOpenAiAssistant}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-[#176B4D]/10 text-[#176B4D] hover:bg-[#176B4D]/20 transition"
              title="TakaLink Circular Economy AI Assistant"
            >
              <Sparkles className="w-4 h-4 text-[#176B4D]" />
              <span className="hidden sm:inline">AI Advisor</span>
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg text-[#17324D] hover:bg-[#F7F8F4] transition"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#176B4D] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-[#E5E9ED] overflow-hidden z-50 text-[#17324D]"
                  onMouseLeave={() => setShowNotifications(false)}
                >
                  <div className="p-3 bg-[#F7F8F4] border-b border-[#E5E9ED] flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#17324D]">
                      In-App Notifications
                    </span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-[11px] text-[#176B4D] font-semibold hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-[#E5E9ED]">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-[#536575]">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.slice(0, 6).map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            markNotificationRead(notif.id);
                            if (notif.linkTarget) onSelectTab(notif.linkTarget);
                            setShowNotifications(false);
                          }}
                          className={`p-3 text-xs cursor-pointer hover:bg-[#F7F8F4] transition ${
                            !notif.read ? 'bg-[#176B4D]/5 font-medium' : 'text-[#536575]'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-[#17324D]">{notif.title}</span>
                            <span className="text-[10px] text-[#536575]">
                              {new Date(notif.createdAt).toLocaleDateString([], {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#536575] leading-snug">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Post Listing (Primary action) */}
            <button
              onClick={onOpenCreateListing}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#176B4D] text-white text-xs sm:text-sm font-semibold hover:bg-[#176B4D]/90 shadow-sm transition active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List Waste</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="lg:hidden flex items-center justify-between overflow-x-auto py-2 border-t border-[#E5E9ED] text-xs font-medium gap-1 scrollbar-none">
          <button
            onClick={() => onSelectTab('marketplace')}
            className={`px-2.5 py-1.5 rounded-md shrink-0 ${
              currentTab === 'marketplace' ? 'bg-[#176B4D] text-white font-bold' : 'text-[#17324D]'
            }`}
          >
            Marketplace
          </button>
          <button
            onClick={() => onSelectTab('bulk-requests')}
            className={`px-2.5 py-1.5 rounded-md shrink-0 ${
              currentTab === 'bulk-requests' ? 'bg-[#176B4D] text-white font-bold' : 'text-[#17324D]'
            }`}
          >
            Bulk Pools
          </button>
          <button
            onClick={() => onSelectTab('logistics')}
            className={`px-2.5 py-1.5 rounded-md shrink-0 ${
              currentTab === 'logistics' ? 'bg-[#176B4D] text-white font-bold' : 'text-[#17324D]'
            }`}
          >
            Logistics
          </button>
          <button
            onClick={() => onSelectTab('offers')}
            className={`px-2.5 py-1.5 rounded-md shrink-0 ${
              currentTab === 'offers' ? 'bg-[#176B4D] text-white font-bold' : 'text-[#17324D]'
            }`}
          >
            Offers
          </button>
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`px-2.5 py-1.5 rounded-md shrink-0 ${
              currentTab === 'dashboard' ? 'bg-[#176B4D] text-white font-bold' : 'text-[#17324D]'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onSelectTab('how-it-works')}
            className={`px-2.5 py-1.5 rounded-md shrink-0 ${
              currentTab === 'how-it-works' ? 'bg-[#176B4D] text-white font-bold' : 'text-[#17324D]'
            }`}
          >
            Guide
          </button>
        </div>
      </div>
    </header>
  );
};
