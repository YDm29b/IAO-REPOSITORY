import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  LogOut, 
  Calendar, 
  Sun, 
  Moon, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Filter, 
  Trash2, 
  Eye, 
  Database, 
  RefreshCw, 
  Power, 
  FileSpreadsheet, 
  Check, 
  X, 
  Loader2, 
  ArrowLeft,
  Mail
} from 'lucide-react';
import { 
  fetchAdminOverview, 
  updateAdminSystemSettings, 
  fetchAdminBookings, 
  updateAdminBookingStatus, 
  deleteAdminBooking, 
  fetchAdminSubscribers, 
  deleteAdminSubscriber, 
  fetchAdminDatabaseStatus,
  fetchDayAvailability
} from '../services/apiService';
import { 
  AdminOverviewStats, 
  BookingRecord, 
  SubscriberRecord, 
  DatabaseAuditStatus,
  DayAvailability,
  SystemSettings 
} from '../types';

interface AdminDashboardProps {
  token: string;
  onLogout: () => void;
  onNavigateHome: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ token, onLogout, onNavigateHome }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'capacity' | 'subscribers' | 'database'>('overview');

  // Overview Stats & Settings State
  const [overview, setOverview] = useState<AdminOverviewStats | null>(null);

  // Confirmation Modal State for System Control Toggles
  const [modalConfig, setModalConfig] = useState<{
    open: boolean;
    type: 'bookingsOpen' | 'paymentRequired';
    targetValue: boolean;
    title: string;
    description: string;
  } | null>(null);
  const [isUpdatingSettings, setIsUpdatingSettings] = useState<boolean>(false);

  // Bookings Tab State
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loadingBookings, setLoadingBookings] = useState<boolean>(false);
  const [dateFilter, setDateFilter] = useState<string>('');
  const [slotFilter, setSlotFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [sessionTypeFilter, setSessionTypeFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBookingDetail, setSelectedBookingDetail] = useState<BookingRecord | null>(null);

  // Capacity & Weather Tab State
  const [inspectDate, setInspectDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [dayAvailability, setDayAvailability] = useState<DayAvailability | null>(null);
  const [loadingCapacity, setLoadingCapacity] = useState<boolean>(false);

  // Subscribers Tab State
  const [subscribers, setSubscribers] = useState<SubscriberRecord[]>([]);
  const [loadingSubscribers, setLoadingSubscribers] = useState<boolean>(false);

  // Database Audit Tab State
  const [dbStatus, setDbStatus] = useState<DatabaseAuditStatus | null>(null);
  const [loadingDbStatus, setLoadingDbStatus] = useState<boolean>(false);

  // Feedback Notification Toast
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Load Overview Data
  const loadOverview = async () => {
    try {
      const data = await fetchAdminOverview(token);
      setOverview(data);
    } catch (err: any) {
      showToast('error', err.message || 'Failed to fetch admin overview.');
    }
  };

  useEffect(() => {
    loadOverview();
  }, [token]);

  // Load Bookings when Bookings tab active or filters change
  const loadBookings = async () => {
    setLoadingBookings(true);
    try {
      const data = await fetchAdminBookings(token, {
        date: dateFilter,
        slotId: slotFilter,
        status: statusFilter,
        sessionType: sessionTypeFilter,
        search: searchQuery
      });
      setBookings(data);
    } catch (err: any) {
      showToast('error', err.message || 'Failed to load bookings list.');
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'bookings') {
      loadBookings();
    }
  }, [activeTab, dateFilter, slotFilter, statusFilter, sessionTypeFilter, searchQuery, token]);

  // Load Capacity for Inspect Date
  const loadCapacity = async () => {
    setLoadingCapacity(true);
    try {
      const data = await fetchDayAvailability(inspectDate);
      setDayAvailability(data);
    } catch (err: any) {
      showToast('error', 'Failed to fetch slot availability.');
    } finally {
      setLoadingCapacity(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'capacity') {
      loadCapacity();
    }
  }, [activeTab, inspectDate]);

  // Load Subscribers
  const loadSubscribers = async () => {
    setLoadingSubscribers(true);
    try {
      const data = await fetchAdminSubscribers(token);
      setSubscribers(data);
    } catch (err: any) {
      showToast('error', 'Failed to load newsletter subscribers.');
    } finally {
      setLoadingSubscribers(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'subscribers') {
      loadSubscribers();
    }
  }, [activeTab, token]);

  // Load Database Status
  const loadDbStatus = async () => {
    setLoadingDbStatus(true);
    try {
      const data = await fetchAdminDatabaseStatus(token);
      setDbStatus(data);
    } catch (err: any) {
      showToast('error', 'Failed to fetch database audit status.');
    } finally {
      setLoadingDbStatus(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'database') {
      loadDbStatus();
    }
  }, [activeTab, token]);

  // Handle System Setting Toggle Confirmation Executions
  const confirmToggleSetting = async () => {
    if (!modalConfig) return;
    setIsUpdatingSettings(true);

    try {
      const updates = {
        [modalConfig.type]: modalConfig.targetValue
      };
      const updated = await updateAdminSystemSettings(token, updates);
      setOverview(prev => prev ? { ...prev, systemSettings: updated } : null);
      showToast('success', `System Control updated: ${modalConfig.title} is now ${modalConfig.targetValue ? 'ENABLED' : 'DISABLED'}.`);
      setModalConfig(null);
    } catch (err: any) {
      showToast('error', err.message || 'Failed to update system setting.');
    } finally {
      setIsUpdatingSettings(false);
    }
  };

  // Booking Actions
  const handleUpdateBookingStatus = async (reference: string, status: string, paymentStatus?: string) => {
    try {
      const updated = await updateAdminBookingStatus(token, reference, { status, paymentStatus });
      setBookings(prev => prev.map(b => b.bookingReference === reference ? updated : b));
      if (selectedBookingDetail?.bookingReference === reference) {
        setSelectedBookingDetail(updated);
      }
      showToast('success', `Booking ${reference} updated to ${status}.`);
      loadOverview();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to update booking.');
    }
  };

  const handleDeleteBooking = async (reference: string) => {
    if (!window.confirm(`Are you sure you want to permanently remove booking ${reference}?`)) return;
    try {
      await deleteAdminBooking(token, reference);
      setBookings(prev => prev.filter(b => b.bookingReference !== reference));
      if (selectedBookingDetail?.bookingReference === reference) {
        setSelectedBookingDetail(null);
      }
      showToast('success', `Booking ${reference} removed.`);
      loadOverview();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to delete booking.');
    }
  };

  // Subscriber Actions
  const handleDeleteSubscriber = async (email: string) => {
    if (!window.confirm(`Remove ${email} from subscribers list?`)) return;
    try {
      await deleteAdminSubscriber(token, email);
      setSubscribers(prev => prev.filter(s => s.email !== email));
      showToast('success', `Subscriber ${email} removed.`);
    } catch (err: any) {
      showToast('error', err.message || 'Failed to remove subscriber.');
    }
  };

  // CSV Export for Subscribers
  const exportSubscribersCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,Email,Status,Date Subscribed\n' + 
      subscribers.map(s => `"${s.email}","${s.status}","${s.createdAt}"`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `iao_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const systemSettings: SystemSettings = overview?.systemSettings || { bookingsOpen: true, paymentRequired: true };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col">
      
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className={`fixed top-20 right-6 z-50 p-4 rounded-2xl border text-xs font-semibold flex items-center gap-3 shadow-2xl animate-in fade-in ${
          toastMessage.type === 'success' ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300' : 'bg-rose-950/90 border-rose-500 text-rose-300'
        }`}>
          {toastMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertCircle className="w-5 h-5 text-rose-400" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Confirmation Modal for System Controls */}
      {modalConfig && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card-dark rounded-3xl p-6 sm:p-8 max-w-md w-full border border-gold-500/40 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-gold-400 border-b border-slate-800 pb-3">
              <Power className="w-6 h-6" />
              <h3 className="font-serif-display text-lg font-bold text-white">Confirm System Setting Change</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-light">
              {modalConfig.description}
            </p>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-amber-300">
              ⚡ This change will take effect <strong>immediately</strong> across all public booking interfaces and backend endpoints.
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                disabled={isUpdatingSettings}
                onClick={() => setModalConfig(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300"
              >
                Cancel
              </button>
              <button
                disabled={isUpdatingSettings}
                onClick={confirmToggleSetting}
                className="px-5 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-black text-xs font-semibold flex items-center gap-2 shadow-lg"
              >
                {isUpdatingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                <span>Confirm & Apply Setting</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="glass-card-dark rounded-3xl p-6 border border-gold-500/30 shadow-2xl relative overflow-hidden mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-gold-500/40 flex items-center justify-center text-gold-400 shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif-display text-2xl font-bold text-white">IAO Admin Control Center</h1>
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-gold-500/15 border border-gold-500/30 text-gold-400">
                Authenticated
              </span>
            </div>
            <p className="text-xs text-slate-400 font-light">IST Astronomical Observatory Operations & Session Administration</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateHome}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Public Site</span>
          </button>
          
          <button
            onClick={onLogout}
            className="px-4 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-xs font-semibold text-rose-300 flex items-center gap-1.5 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out Admin</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'bg-gold-500 text-black shadow-md'
              : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Power className="w-3.5 h-3.5" />
          <span>Overview & System Controls</span>
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'bookings'
              ? 'bg-gold-500 text-black shadow-md'
              : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Bookings Manager ({overview?.totalBookings || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('capacity')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'capacity'
              ? 'bg-gold-500 text-black shadow-md'
              : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Sun className="w-3.5 h-3.5" />
          <span>Slots Capacity & Weather</span>
        </button>

        <button
          onClick={() => setActiveTab('subscribers')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'subscribers'
              ? 'bg-gold-500 text-black shadow-md'
              : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Subscribers ({overview?.totalSubscribers || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('database')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'database'
              ? 'bg-gold-500 text-black shadow-md'
              : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Database & Production Readiness</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & SYSTEM CONTROLS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* SYSTEM OPERATIONAL CONTROLS SECTION */}
          <div className="glass-card-dark rounded-3xl p-6 sm:p-8 border border-gold-500/40 shadow-2xl relative overflow-hidden space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <Power className="w-5 h-5 text-gold-400" />
                <h2 className="font-serif-display text-xl font-bold text-white">System Operational Controls</h2>
              </div>
              <span className="text-[10px] font-mono text-slate-400 uppercase">Server-Side Global Authority</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* 1. BOOKINGS OPEN / CLOSED CONTROL */}
              <div className={`p-6 rounded-2xl border transition-all space-y-4 ${
                systemSettings.bookingsOpen !== false
                  ? 'bg-emerald-950/30 border-emerald-500/40'
                  : 'bg-rose-950/30 border-rose-500/40'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                    Observation Session Bookings
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono uppercase flex items-center gap-1.5 border ${
                    systemSettings.bookingsOpen !== false
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40'
                      : 'bg-rose-950 text-rose-400 border-rose-500/40'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${systemSettings.bookingsOpen !== false ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                    {systemSettings.bookingsOpen !== false ? 'OPEN' : 'CLOSED'}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  {systemSettings.bookingsOpen !== false 
                    ? 'Visitors can view available slots and submit new observation session reservations.' 
                    : 'Public booking submission is disabled. Visitors will see a clear closure notification.'}
                </p>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-mono">* Existing bookings remain intact</span>
                  
                  {systemSettings.bookingsOpen !== false ? (
                    <button
                      onClick={() => setModalConfig({
                        open: true,
                        type: 'bookingsOpen',
                        targetValue: false,
                        title: 'Close Observation Bookings',
                        description: 'Are you sure you want to CLOSE observation session bookings? Visitors will be blocked from submitting new booking requests on both frontend and backend.'
                      })}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-1.5"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Close Bookings</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setModalConfig({
                        open: true,
                        type: 'bookingsOpen',
                        targetValue: true,
                        title: 'Open Observation Bookings',
                        description: 'Are you sure you want to OPEN observation session bookings? Public reservation submissions will be enabled immediately.'
                      })}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-semibold shadow-md transition-all flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Open Bookings</span>
                    </button>
                  )}
                </div>
              </div>

              {/* 2. PAYMENT REQUIREMENT CONTROL */}
              <div className={`p-6 rounded-2xl border transition-all space-y-4 ${
                systemSettings.paymentRequired !== false
                  ? 'bg-emerald-950/30 border-emerald-500/40'
                  : 'bg-slate-900 border-slate-800'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                    Payment Requirement
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono uppercase flex items-center gap-1.5 border ${
                    systemSettings.paymentRequired !== false
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${systemSettings.paymentRequired !== false ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                    {systemSettings.paymentRequired !== false ? 'REQUIRED' : 'NOT REQUIRED'}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  {systemSettings.paymentRequired !== false
                    ? 'Visitors must complete registration payment before session booking is confirmed.'
                    : 'Visitors can book sessions directly without payment gateway requirement (Free / Direct booking).'
                  }
                </p>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-mono">* Affects new session checkouts</span>

                  {systemSettings.paymentRequired !== false ? (
                    <button
                      onClick={() => setModalConfig({
                        open: true,
                        type: 'paymentRequired',
                        targetValue: false,
                        title: 'Disable Payment Requirement',
                        description: 'Are you sure you want to DISABLE the payment requirement? Visitors will be able to submit observation bookings without making a payment.'
                      })}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold shadow-md transition-all"
                    >
                      Disable Payments
                    </button>
                  ) : (
                    <button
                      onClick={() => setModalConfig({
                        open: true,
                        type: 'paymentRequired',
                        targetValue: true,
                        title: 'Enable Payment Requirement',
                        description: 'Are you sure you want to REQUIRE payment for observation bookings? Visitors will be required to verify payment during checkout.'
                      })}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-semibold shadow-md transition-all"
                    >
                      Require Payments
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* METRICS SUMMARY GRID */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="glass-card-dark p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="text-slate-400 text-xs font-mono uppercase">Total Bookings</div>
              <div className="text-3xl font-bold font-mono text-white">{overview?.totalBookings || 0}</div>
              <div className="text-[11px] text-emerald-400 font-mono">{overview?.confirmedBookings || 0} Confirmed</div>
            </div>

            <div className="glass-card-dark p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="text-slate-400 text-xs font-mono uppercase">Today's Sessions</div>
              <div className="text-3xl font-bold font-mono text-gold-400">{overview?.todayBookingsCount || 0}</div>
              <div className="text-[11px] text-slate-300 font-mono">{overview?.todayAttendees || 0} Attendees Registered</div>
            </div>

            <div className="glass-card-dark p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="text-slate-400 text-xs font-mono uppercase">Total Revenue</div>
              <div className="text-3xl font-bold font-mono text-emerald-400">PKR {overview?.totalRevenue?.toLocaleString() || 0}</div>
              <div className="text-[11px] text-slate-400 font-mono">Completed Payments</div>
            </div>

            <div className="glass-card-dark p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="text-slate-400 text-xs font-mono uppercase">Active Subscribers</div>
              <div className="text-3xl font-bold font-mono text-blue-400">{overview?.totalSubscribers || 0}</div>
              <div className="text-[11px] text-slate-400 font-mono">Newsletter Dispatches</div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: BOOKINGS MANAGER */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          
          {/* Filters Bar */}
          <div className="glass-card-dark p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-white uppercase font-mono">
                <Filter className="w-4 h-4 text-gold-400" />
                <span>Filter & Search Bookings</span>
              </div>
              <button
                onClick={loadBookings}
                className="text-xs text-gold-400 hover:text-gold-300 flex items-center gap-1 font-mono"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
              
              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Reference, Name, Email..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-gold-500"
                />
              </div>

              {/* Date */}
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-gold-500 font-mono"
              />

              {/* Status */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-gold-500"
              >
                <option value="">All Statuses</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="PENDING_PAYMENT">PENDING_PAYMENT</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>

              {/* Session Type */}
              <select
                value={sessionTypeFilter}
                onChange={(e) => setSessionTypeFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-gold-500"
              >
                <option value="">Solar & Night</option>
                <option value="solar">Solar Observation</option>
                <option value="night">Night Observation</option>
              </select>

              {/* Slot */}
              <select
                value={slotFilter}
                onChange={(e) => setSlotFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-gold-500"
              >
                <option value="">All Slots (1–6)</option>
                <option value="1">Slot 1 (7:00–8:00 AM)</option>
                <option value="2">Slot 2 (8:00–9:00 AM)</option>
                <option value="3">Slot 3 (9:00–10:00 AM)</option>
                <option value="4">Slot 4 (8:30–9:30 PM)</option>
                <option value="5">Slot 5 (9:30–10:30 PM)</option>
                <option value="6">Slot 6 (10:30–11:30 PM)</option>
              </select>

            </div>
          </div>

          {/* Bookings Table */}
          <div className="glass-card-dark rounded-2xl border border-slate-800 overflow-hidden">
            {loadingBookings ? (
              <div className="p-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-gold-400" />
                <span>Loading bookings database...</span>
              </div>
            ) : bookings.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                No observation bookings found matching criteria.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-mono text-[10px] uppercase border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">Reference</th>
                      <th className="p-3.5">Visitor</th>
                      <th className="p-3.5">Contact</th>
                      <th className="p-3.5">Date & Slot</th>
                      <th className="p-3.5">Type</th>
                      <th className="p-3.5">Group</th>
                      <th className="p-3.5">Payment</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-900/50 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-gold-400">{b.bookingReference}</td>
                        <td className="p-3.5 font-semibold text-white">{b.customer.name}</td>
                        <td className="p-3.5 text-slate-300">
                          <div>{b.customer.email}</div>
                          <div className="text-[10px] text-slate-500">{b.customer.phone}</div>
                        </td>
                        <td className="p-3.5 text-slate-200 font-mono">
                          <div>{b.date}</div>
                          <div className="text-[10px] text-slate-400">{b.slotTime}</div>
                        </td>
                        <td className="p-3.5">
                          {b.sessionType === 'solar' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                              <Sun className="w-3 h-3" /> Solar
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                              <Moon className="w-3 h-3" /> Night
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-slate-300 font-mono">{b.numberOfPeople} Person(s)</td>
                        <td className="p-3.5 font-mono">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                            b.paymentStatus === 'COMPLETED' ? 'text-emerald-400 bg-emerald-950 border-emerald-500/30' : 'text-amber-400 bg-amber-950 border-amber-500/30'
                          }`}>
                            {b.paymentStatus}
                          </span>
                        </td>
                        <td className="p-3.5 font-mono">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                            b.status === 'CONFIRMED' ? 'text-emerald-400 bg-emerald-950 border-emerald-500/30' :
                            b.status === 'CANCELLED' ? 'text-rose-400 bg-rose-950 border-rose-500/30' :
                            'text-amber-400 bg-amber-950 border-amber-500/30'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right space-x-1">
                          <button
                            onClick={() => setSelectedBookingDetail(b)}
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                            title="View Full Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          
                          {b.status !== 'CONFIRMED' && (
                            <button
                              onClick={() => handleUpdateBookingStatus(b.bookingReference, 'CONFIRMED', 'COMPLETED')}
                              className="p-1.5 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-900"
                              title="Quick Confirm"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {b.status !== 'CANCELLED' && (
                            <button
                              onClick={() => handleUpdateBookingStatus(b.bookingReference, 'CANCELLED')}
                              className="p-1.5 rounded-lg bg-rose-950 border border-rose-500/40 text-rose-400 hover:bg-rose-900"
                              title="Quick Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            onClick={() => handleDeleteBooking(b.bookingReference)}
                            className="p-1.5 rounded-lg bg-slate-900 text-rose-400 hover:bg-rose-950"
                            title="Delete Booking"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Booking Detail Modal */}
          {selectedBookingDetail && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="glass-card-dark rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-gold-500/40 space-y-6 animate-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <div className="text-[10px] font-mono uppercase text-slate-400">Booking Reference:</div>
                    <div className="text-xl font-mono font-bold text-gold-400">{selectedBookingDetail.bookingReference}</div>
                  </div>
                  <button
                    onClick={() => setSelectedBookingDetail(null)}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">Visitor Name:</span>
                    <span className="text-white font-semibold">{selectedBookingDetail.customer.name}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">Email:</span>
                    <span className="text-white font-semibold">{selectedBookingDetail.customer.email}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">Phone:</span>
                    <span className="text-white font-semibold">{selectedBookingDetail.customer.phone}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">Group Size:</span>
                    <span className="text-white font-semibold">{selectedBookingDetail.numberOfPeople} Person(s)</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">Date:</span>
                    <span className="text-gold-400 font-mono font-bold">{selectedBookingDetail.date}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">Slot Time:</span>
                    <span className="text-white font-semibold">{selectedBookingDetail.slotTime}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">Amount Paid:</span>
                    <span className="text-emerald-400 font-mono font-bold">PKR {selectedBookingDetail.amountPaid || 0}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">Transaction ID:</span>
                    <span className="text-slate-300 font-mono text-[11px]">{selectedBookingDetail.paymentId || 'N/A'}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateBookingStatus(selectedBookingDetail.bookingReference, 'CONFIRMED', 'COMPLETED')}
                      className="px-3.5 py-2 rounded-xl bg-emerald-500 text-black text-xs font-semibold"
                    >
                      Set CONFIRMED
                    </button>
                    <button
                      onClick={() => handleUpdateBookingStatus(selectedBookingDetail.bookingReference, 'CANCELLED')}
                      className="px-3.5 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold"
                    >
                      Set CANCELLED
                    </button>
                  </div>

                  <button
                    onClick={() => setSelectedBookingDetail(null)}
                    className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 3: SLOTS CAPACITY & WEATHER MONITOR */}
      {activeTab === 'capacity' && (
        <div className="space-y-6">
          <div className="glass-card-dark p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif-display text-xl font-bold text-white mb-1">Observation Slot Capacity Monitor</h2>
              <p className="text-xs text-slate-400">Inspect weather authority status and 6 daily slot capacities for any selected date.</p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Inspect Date:</span>
              <input
                type="date"
                value={inspectDate}
                onChange={(e) => setInspectDate(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-gold-500 font-mono"
              />
            </div>
          </div>

          {loadingCapacity ? (
            <div className="p-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-gold-400" />
              <span>Fetching capacity breakdown for {inspectDate}...</span>
            </div>
          ) : dayAvailability && (
            <div className="space-y-6">
              
              {/* Weather Status Summary Card */}
              <div className="glass-card-dark p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-mono uppercase mb-1">Weather Authority Assessment:</div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono uppercase border ${
                      dayAvailability.status === 'OPEN' ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40' :
                      dayAvailability.status === 'CONDITIONALLY_OPEN' ? 'bg-amber-950 text-amber-400 border-amber-500/40' :
                      'bg-rose-950 text-rose-400 border-rose-500/40'
                    }`}>
                      {dayAvailability.status}
                    </span>
                    <span className="text-xs text-slate-300">{dayAvailability.statusNote}</span>
                  </div>
                </div>

                <div className="text-right text-xs font-mono text-slate-300">
                  <div>Cloud Cover: <strong>{dayAvailability.weatherSummary.cloudCover}%</strong></div>
                  <div>Wind Speed: <strong>{dayAvailability.weatherSummary.windSpeed} km/h</strong></div>
                </div>
              </div>

              {/* 6 Slots Capacity Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dayAvailability.slots.map(slot => (
                  <div key={slot.slotId} className="glass-card-dark p-5 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-white uppercase">{slot.name}</span>
                      {slot.sessionType === 'solar' ? (
                        <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">Solar</span>
                      ) : (
                        <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">Night</span>
                      )}
                    </div>

                    <div className="text-sm font-semibold text-white">{slot.time}</div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-400">Capacity Booked:</span>
                        <span className={`font-bold ${slot.isFullyBooked ? 'text-rose-400' : 'text-gold-400'}`}>
                          {slot.bookedGroups} / {slot.maxGroups} Groups ({slot.isFullyBooked ? 'FULL' : `${slot.remainingSlots} left`})
                        </span>
                      </div>
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                        <div 
                          className={`h-full transition-all duration-300 ${
                            slot.isFullyBooked ? 'bg-rose-500' : slot.bookedGroups > 0 ? 'bg-gold-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${(slot.bookedGroups / slot.maxGroups) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}
        </div>
      )}

      {/* TAB 4: NEWSLETTER SUBSCRIBERS */}
      {activeTab === 'subscribers' && (
        <div className="space-y-6">
          <div className="glass-card-dark p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="font-serif-display text-xl font-bold text-white mb-1">Newsletter Subscribers Directory</h2>
              <p className="text-xs text-slate-400">Manage registered email subscribers for monthly observatory celestial dispatches.</p>
            </div>

            <button
              onClick={exportSubscribersCSV}
              disabled={subscribers.length === 0}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-white flex items-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="glass-card-dark rounded-2xl border border-slate-800 overflow-hidden">
            {loadingSubscribers ? (
              <div className="p-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-gold-400" />
                <span>Loading subscriber records...</span>
              </div>
            ) : subscribers.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                No newsletter subscribers found.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-mono text-[10px] uppercase border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Subscriber Email</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Date Subscribed</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {subscribers.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="p-3.5 font-semibold text-white font-mono">{sub.email}</td>
                      <td className="p-3.5 font-mono">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          sub.status === 'ACTIVE' ? 'text-emerald-400 bg-emerald-950 border-emerald-500/30' : 'text-slate-400 bg-slate-800 border-slate-700'
                        }`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-400 font-mono">{new Date(sub.createdAt).toLocaleDateString()}</td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleDeleteSubscriber(sub.email)}
                          className="p-1.5 rounded-lg bg-slate-900 text-rose-400 hover:bg-rose-950"
                          title="Remove Subscriber"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: DATABASE & PRODUCTION READINESS */}
      {activeTab === 'database' && (
        <div className="space-y-6">
          <div className="glass-card-dark p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <Database className="w-6 h-6 text-gold-400" />
              <div>
                <h2 className="font-serif-display text-xl font-bold text-white">Database Engine Audit & Production Readiness</h2>
                <p className="text-xs text-slate-400">PostgreSQL / Supabase migration status and production security checklist.</p>
              </div>
            </div>

            {loadingDbStatus ? (
              <div className="p-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-gold-400" />
                <span>Auditing database status...</span>
              </div>
            ) : dbStatus && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Engine Status Card */}
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 text-xs">
                  <div className="font-mono text-slate-400 text-[10px] uppercase">Active Engine:</div>
                  <div className="text-base font-bold font-mono text-gold-400">{dbStatus.engine}</div>
                  
                  <div className="pt-2 border-t border-slate-800/80 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">PostgreSQL DATABASE_URL:</span>
                      <span className={`font-mono font-bold ${dbStatus.postgresEnvDetected ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {dbStatus.postgresEnvDetected ? 'CONNECTED' : 'NOT CONFIGURED'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Stored Customers:</span>
                      <span className="text-white font-mono">{dbStatus.totalCustomers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Stored Bookings:</span>
                      <span className="text-white font-mono">{dbStatus.totalBookings}</span>
                    </div>
                  </div>
                </div>

                {/* Production Instructions */}
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 text-xs">
                  <div className="font-bold text-white">PostgreSQL / Supabase Migration Steps:</div>
                  <ol className="list-decimal pl-4 text-slate-300 space-y-1.5 leading-relaxed font-light">
                    <li>Create a PostgreSQL database on Supabase, Railway, Neon, or AWS RDS.</li>
                    <li>Execute the SQL Schema script located in <strong className="text-gold-400 font-mono">server/schema.sql</strong>.</li>
                    <li>Configure environment variables on your hosting provider:
                      <ul className="list-disc pl-4 font-mono text-[11px] text-amber-300 mt-1">
                        <li>DATABASE_URL=postgres://...</li>
                        <li>ADMIN_PASSWORD=&lt;secure-pass&gt;</li>
                        <li>JWT_SECRET=&lt;secure-secret&gt;</li>
                      </ul>
                    </li>
                  </ol>
                </div>

              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
