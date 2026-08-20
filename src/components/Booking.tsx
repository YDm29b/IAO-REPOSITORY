import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Sun, 
  Moon, 
  CheckCircle2, 
  AlertCircle, 
  CreditCard, 
  ShieldCheck, 
  Sparkles,
  Printer,
  ChevronRight,
  Info,
  Loader2
} from 'lucide-react';
import { 
  fetchDayAvailability, 
  createBookingSession, 
  verifyBookingPayment 
} from '../services/apiService';
import { 
  DayAvailability, 
  ObservationSlot, 
  BookingRecord 
} from '../types';

interface BookingProps {
  onNavigateHome: () => void;
}

export const Booking: React.FC<BookingProps> = ({ onNavigateHome }) => {
  // Booking Workflow State: 1 = Date & Slot, 2 = Visitor Info, 3 = Payment, 4 = Confirmation
  const [step, setStep] = useState<number>(1);

  // Date selection (Default to today's date YYYY-MM-DD)
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [availability, setAvailability] = useState<DayAvailability | null>(null);
  const [loadingAvailability, setLoadingAvailability] = useState<boolean>(true);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);

  // Selected Slot
  const [selectedSlot, setSelectedSlot] = useState<ObservationSlot | null>(null);

  // Visitor Form Input
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [numberOfPeople, setNumberOfPeople] = useState<number>(1);

  // Processing & Errors
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Created Booking Record & Payment State
  const [bookingRecord, setBookingRecord] = useState<BookingRecord | null>(null);
  const [paymentAction, setPaymentAction] = useState<string>('simulate_success');

  // Load availability when selectedDate changes
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoadingAvailability(true);
      setAvailabilityError(null);
      try {
        const data = await fetchDayAvailability(selectedDate);
        if (isMounted) {
          setAvailability(data);
          // Reset slot selection if date changed
          if (selectedSlot) {
            const updatedSlot = data.slots.find(s => s.slotId === selectedSlot.slotId);
            if (updatedSlot && !updatedSlot.isFullyBooked) {
              setSelectedSlot(updatedSlot);
            } else {
              setSelectedSlot(null);
            }
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setAvailabilityError(err.message || 'Failed to load observation slot availability.');
        }
      } finally {
        if (isMounted) setLoadingAvailability(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [selectedDate]);

  const handleSlotSelect = (slot: ObservationSlot) => {
    if (slot.isFullyBooked || availability?.status === 'CLOSED') return;
    setSelectedSlot(slot);
    setFormError(null);
  };

  const handleProceedToVisitorInfo = () => {
    if (!selectedSlot) {
      setFormError('Please select an available observation slot before proceeding.');
      return;
    }
    setFormError(null);
    setStep(2);
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !availability) return;

    if (!name || name.trim().length < 2) {
      setFormError('Please enter a valid full name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      setFormError('Please enter a valid email address.');
      return;
    }

    const phoneRegex = /^[\d\+\-\s\(\)]{7,20}$/;
    if (!phone || !phoneRegex.test(phone.trim())) {
      setFormError('Please enter a valid contact phone number (at least 7 digits).');
      return;
    }

    if (numberOfPeople < 1 || numberOfPeople > 5) {
      setFormError('Group size must be between 1 and 5 people.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      const res = await createBookingSession({
        name,
        email,
        phone,
        numberOfPeople,
        date: selectedDate,
        slotId: selectedSlot.slotId
      });

      setBookingRecord(res.booking);
      if (res.paymentRequired === false || res.booking.paymentStatus === 'COMPLETED') {
        setStep(4); // Skip payment, move directly to confirmation
      } else {
        setStep(3); // Move to Payment step
      }
    } catch (err: any) {
      setFormError(err.message || 'Failed to process booking reservation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExecutePayment = async () => {
    if (!bookingRecord) return;
    setIsSubmitting(true);
    setFormError(null);

    try {
      const res = await verifyBookingPayment(
        bookingRecord.bookingReference,
        undefined,
        paymentAction
      );

      if (res.success) {
        setBookingRecord(res.booking);
        setStep(4); // Move to Confirmation Step
      } else {
        setFormError(res.verification?.message || 'Payment verification failed.');
      }
    } catch (err: any) {
      setFormError(err.message || 'Payment processing error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Printable Ticket Trigger
  const handlePrintTicket = () => {
    window.print();
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto flex flex-col">
      
      {/* Breadcrumb Navigation */}
      <div className="mb-6 print:hidden">
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800 text-xs font-semibold text-slate-300 hover:text-gold-300 hover:border-gold-500/40 transition-all duration-200 hover:-translate-y-0.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Homepage</span>
        </button>
      </div>

      {/* Hero Header */}
      <div className="glass-card-dark rounded-3xl p-6 sm:p-10 border border-gold-500/30 shadow-2xl relative overflow-hidden mb-8 backdrop-blur-lg print:hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-gold-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.25)] shrink-0">
              <Calendar className="w-7 h-7 text-gold-400" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-[10px] font-semibold uppercase tracking-widest mb-1.5">
                <Sparkles className="w-3 h-3" />
                <span>Real-Time Reservation Engine</span>
              </div>
              <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-white">
                Observation Session Booking
              </h1>
            </div>
          </div>

          {/* Stepper Indicator */}
          <div className="flex items-center gap-2 bg-slate-950/80 px-4 py-2 rounded-2xl border border-slate-800 text-xs">
            <span className={`px-2 py-0.5 rounded font-mono font-semibold ${step >= 1 ? 'bg-gold-500 text-black' : 'text-slate-500'}`}>1</span>
            <span className="text-slate-600">→</span>
            <span className={`px-2 py-0.5 rounded font-mono font-semibold ${step >= 2 ? 'bg-gold-500 text-black' : 'text-slate-500'}`}>2</span>
            <span className="text-slate-600">→</span>
            <span className={`px-2 py-0.5 rounded font-mono font-semibold ${step >= 3 ? 'bg-gold-500 text-black' : 'text-slate-500'}`}>3</span>
            <span className="text-slate-600">→</span>
            <span className={`px-2 py-0.5 rounded font-mono font-semibold ${step >= 4 ? 'bg-emerald-500 text-black' : 'text-slate-500'}`}>4</span>
          </div>
        </div>
      </div>

      {/* Main Workflow Form Container */}
      <div className="glass-card-dark rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl relative">
        
        {/* Global Closed Bookings Alert Banner */}
        {availability?.systemSettings?.bookingsOpen === false && (
          <div className="mb-6 p-5 rounded-2xl bg-rose-950/90 border border-rose-500/60 text-rose-200 text-xs sm:text-sm flex items-start gap-3.5 shadow-2xl animate-in fade-in">
            <AlertCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-white mb-1 font-serif-display text-base">
                Observation Session Bookings are Currently Closed
              </div>
              <p className="leading-relaxed font-light text-rose-200">
                Observatory administration has temporarily paused new public observation session bookings. Please check back later or subscribe to our newsletter for reopening announcements.
              </p>
            </div>
          </div>
        )}

        {/* Error Notification Alert */}
        {formError && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-3 animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* STEP 1: Date & Slot Selection */}
        {step === 1 && (
          <div className="space-y-8">
            
            {/* Top Bar: Date Selector & Weather Condition Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Date Input */}
              <div className="lg:col-span-1 glass-card-dark p-5 rounded-2xl border border-slate-800 space-y-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gold-400" />
                  <span>Select Observation Date:</span>
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-gold-500 font-mono"
                />
                <p className="text-[10px] text-slate-500">
                  * Bookings open up to 30 days in advance.
                </p>
              </div>

              {/* Weather & Observing Conditions Card */}
              <div className="lg:col-span-2 glass-card-dark p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
                {loadingAvailability ? (
                  <div className="flex items-center justify-center py-6 gap-3 text-slate-400 text-xs">
                    <Loader2 className="w-5 h-5 animate-spin text-gold-400" />
                    <span>Evaluating atmospheric conditions for {selectedDate}...</span>
                  </div>
                ) : availabilityError ? (
                  <div className="text-xs text-rose-400 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>{availabilityError}</span>
                  </div>
                ) : availability && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">Observing Condition Authority:</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${
                          availability.status === 'OPEN'
                            ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40'
                            : availability.status === 'CONDITIONALLY_OPEN'
                            ? 'bg-amber-950/60 text-amber-400 border-amber-500/40'
                            : 'bg-rose-950/60 text-rose-400 border-rose-500/40'
                        }`}>
                          {availability.status}
                        </span>
                      </div>
                      <div className="text-xs font-mono text-slate-300">
                        {availability.weatherSummary.temperature}°C • Cloud: {availability.weatherSummary.cloudCover}%
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-light bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                      {availability.statusNote}
                    </p>

                    {availability.status === 'CLOSED' && (
                      <div className="text-xs text-rose-400 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>Sessions cannot be booked on CLOSED weather days to ensure safety and telescope preservation.</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Slots Grid */}
            {availability && (
              <div className="space-y-6">
                
                {/* Solar Observation Slots */}
                <div>
                  <div className="flex items-center gap-2 text-amber-400 font-serif-display text-sm font-semibold mb-3">
                    <Sun className="w-4 h-4 text-amber-400" />
                    <span>Solar Observation Sessions (Daytime • High-Resolution Solar Etalon)</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {availability.slots.filter(s => s.sessionType === 'solar').map(slot => {
                      const isSelected = selectedSlot?.slotId === slot.slotId;
                      const isDisabled = slot.isFullyBooked || availability.status === 'CLOSED';

                      return (
                        <button
                          key={slot.slotId}
                          disabled={isDisabled}
                          onClick={() => handleSlotSelect(slot)}
                          className={`p-5 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
                            isSelected
                              ? 'bg-amber-500/15 border-amber-500 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                              : isDisabled
                              ? 'bg-slate-950/40 border-slate-900 text-slate-600 cursor-not-allowed opacity-60'
                              : 'bg-slate-900/70 hover:bg-slate-800/90 border-slate-800 text-slate-200 hover:border-amber-500/40'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-bold uppercase tracking-wider font-mono">{slot.name}</span>
                              <Sun className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                            </div>
                            <div className="text-sm font-semibold text-white mb-3">
                              {slot.time}
                            </div>
                          </div>

                          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                            {slot.isFullyBooked ? (
                              <span className="text-rose-400 font-bold uppercase">Fully Booked</span>
                            ) : (
                              <>
                                <span className="text-slate-400">{slot.bookedGroups} / {slot.maxGroups} groups</span>
                                <span className="text-amber-400 font-semibold">{slot.remainingSlots} left</span>
                              </>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Night Observation Slots */}
                <div>
                  <div className="flex items-center gap-2 text-indigo-300 font-serif-display text-sm font-semibold mb-3">
                    <Moon className="w-4 h-4 text-indigo-400" />
                    <span>Night Sky Observation Sessions (Deep-Sky Photometry & Planetary Viewing)</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {availability.slots.filter(s => s.sessionType === 'night').map(slot => {
                      const isSelected = selectedSlot?.slotId === slot.slotId;
                      const isDisabled = slot.isFullyBooked || availability.status === 'CLOSED';

                      return (
                        <button
                          key={slot.slotId}
                          disabled={isDisabled}
                          onClick={() => handleSlotSelect(slot)}
                          className={`p-5 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
                            isSelected
                              ? 'bg-indigo-500/15 border-indigo-500 text-indigo-300 shadow-[0_0_20px_rgba(99,102,241,0.2)]'
                              : isDisabled
                              ? 'bg-slate-950/40 border-slate-900 text-slate-600 cursor-not-allowed opacity-60'
                              : 'bg-slate-900/70 hover:bg-slate-800/90 border-slate-800 text-slate-200 hover:border-indigo-500/40'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-bold uppercase tracking-wider font-mono">{slot.name}</span>
                              <Moon className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                            </div>
                            <div className="text-sm font-semibold text-white mb-3">
                              {slot.time}
                            </div>
                          </div>

                          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                            {slot.isFullyBooked ? (
                              <span className="text-rose-400 font-bold uppercase">Fully Booked</span>
                            ) : (
                              <>
                                <span className="text-slate-400">{slot.bookedGroups} / {slot.maxGroups} groups</span>
                                <span className="text-indigo-400 font-semibold">{slot.remainingSlots} left</span>
                              </>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
              <div className="text-xs text-slate-400">
                {selectedSlot ? (
                  <span>Selected: <strong className="text-white">{selectedSlot.name} ({selectedSlot.time})</strong> on <strong className="text-gold-400">{selectedDate}</strong></span>
                ) : (
                  <span>Please select a date and an available slot.</span>
                )}
              </div>

              <button
                onClick={handleProceedToVisitorInfo}
                disabled={!selectedSlot || availability?.status === 'CLOSED'}
                className="px-6 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-[#040711] text-xs font-semibold transition-all duration-200 shadow-[0_4px_14px_rgba(212,175,55,0.35)] flex items-center gap-2"
              >
                <span>Continue to Visitor Details</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* STEP 2: Visitor Information Form */}
        {step === 2 && selectedSlot && (
          <form onSubmit={handleCreateBooking} className="space-y-6">
            
            {/* Header Summary */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-gold-500/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                {selectedSlot.sessionType === 'solar' ? (
                  <Sun className="w-5 h-5 text-amber-400" />
                ) : (
                  <Moon className="w-5 h-5 text-indigo-400" />
                )}
                <div>
                  <div className="text-white font-semibold">{selectedDate} • {selectedSlot.name} ({selectedSlot.time})</div>
                  <div className="text-slate-400 text-[11px]">Slot Capacity: {selectedSlot.bookedGroups} / {selectedSlot.maxGroups} groups booked</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-gold-400 hover:text-gold-300 text-xs font-medium underline"
              >
                Change Slot
              </button>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter primary visitor name..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">
                  Email Address <span className="text-rose-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. visitor@university.edu.pk"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">
                  Phone / WhatsApp Contact <span className="text-rose-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+92 300 1234567"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500"
                />
              </div>

              {/* Number of Attendees (Max 5 people) */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Number of Attendees in Group <span className="text-rose-400">*</span></span>
                  <span className="text-[10px] text-amber-400 font-mono">Maximum 5 people per group</span>
                </label>
                <select
                  value={numberOfPeople}
                  onChange={(e) => setNumberOfPeople(parseInt(e.target.value, 10))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-gold-500"
                >
                  <option value={1}>1 Person (Individual Visitor)</option>
                  <option value={2}>2 People</option>
                  <option value={3}>3 People</option>
                  <option value={4}>4 People</option>
                  <option value={5}>5 People (Maximum Group Size Limit)</option>
                </select>
              </div>

            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-3">
              <Info className="w-5 h-5 shrink-0 text-amber-400" />
              <span>To preserve observatory deck security and safety protocols, each booking group is strictly limited to 5 people maximum.</span>
            </div>

            {/* Form Actions */}
            <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white"
              >
                Back
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-[#040711] text-xs font-semibold transition-all duration-200 shadow-[0_4px_14px_rgba(212,175,55,0.35)] flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Reserving Session...</span>
                  </>
                ) : (
                  <>
                    <span>Proceed to Payment</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </form>
        )}

        {/* STEP 3: Payment Verification Architecture */}
        {step === 3 && bookingRecord && (
          <div className="space-y-6">
            
            {/* Booking Reference Summary Card */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-gold-500/40 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <div className="text-xs text-slate-400 uppercase font-mono">Booking Reference Code:</div>
                  <div className="text-2xl font-mono font-bold text-gold-400">{bookingRecord.bookingReference}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400 uppercase font-mono">Session Registration Fee:</div>
                  <div className="text-xl font-bold text-white font-mono">PKR 1,500</div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Visitor:</span>
                  <span className="text-white font-semibold">{bookingRecord.customer.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Date:</span>
                  <span className="text-white font-semibold">{bookingRecord.date}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Time Slot:</span>
                  <span className="text-white font-semibold">{bookingRecord.slotTime}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Group Size:</span>
                  <span className="text-white font-semibold">{bookingRecord.numberOfPeople} Person(s)</span>
                </div>
              </div>
            </div>

            {/* Payment Mode Selector & Simulator */}
            <div className="glass-card-dark p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <CreditCard className="w-5 h-5 text-gold-400" />
                  <span>Server-Side Payment Abstraction Gateway</span>
                </div>
                <span className="text-[10px] font-mono uppercase bg-slate-800 px-2 py-0.5 rounded text-gold-400 border border-gold-500/20">
                  ENV Configured Provider
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-light">
                This transaction communicates with the server-side payment engine using environment secret credentials. Select a verification response mode to simulate payment processing:
              </p>

              {/* Payment Action Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentAction('simulate_success')}
                  className={`p-3 rounded-xl border text-xs text-left transition-all ${
                    paymentAction === 'simulate_success'
                      ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300 font-semibold'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="font-bold mb-0.5">Success Verification</div>
                  <div className="text-[10px] opacity-80">Simulate completed payment</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentAction('simulate_fail')}
                  className={`p-3 rounded-xl border text-xs text-left transition-all ${
                    paymentAction === 'simulate_fail'
                      ? 'bg-rose-950/60 border-rose-500/60 text-rose-300 font-semibold'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="font-bold mb-0.5">Failed Payment</div>
                  <div className="text-[10px] opacity-80">Simulate declined transaction</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentAction('simulate_cancel')}
                  className={`p-3 rounded-xl border text-xs text-left transition-all ${
                    paymentAction === 'simulate_cancel'
                      ? 'bg-amber-950/60 border-amber-500/60 text-amber-300 font-semibold'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="font-bold mb-0.5">Cancelled Payment</div>
                  <div className="text-[10px] opacity-80">Simulate user cancellation</div>
                </button>
              </div>

            </div>

            {/* Payment Actions */}
            <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white"
              >
                Back
              </button>

              <button
                type="button"
                onClick={handleExecutePayment}
                disabled={isSubmitting}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-semibold transition-all duration-200 shadow-[0_4px_14px_rgba(16,185,129,0.35)] flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Transaction...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Confirm & Authorize Payment</span>
                  </>
                )}
              </button>
            </div>

          </div>
        )}

        {/* STEP 4: Official Booking Ticket & Confirmation */}
        {step === 4 && bookingRecord && (
          <div className="space-y-6">
            
            {/* Confirmation Header Banner */}
            <div className="p-6 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2 border border-emerald-500/30">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h2 className="font-serif-display text-2xl font-bold text-white">
                Observation Session Confirmed
              </h2>
              <p className="text-xs text-emerald-300 max-w-md mx-auto">
                Your reservation has been verified and registered in the observatory database. Present your reference code upon arrival.
              </p>
            </div>

            {/* Official Printable Pass/Ticket */}
            <div className="p-8 rounded-3xl bg-slate-950 border-2 border-gold-500/40 space-y-6 relative overflow-hidden shadow-2xl print:border-black print:text-black">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-6">
                <div>
                  <div className="font-serif-display text-xl font-bold text-white">
                    IST Astronomical Observatory (IAO)
                  </div>
                  <div className="text-xs text-slate-400">Official Visitor Entry Pass</div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] uppercase font-mono text-slate-500">Booking Reference:</div>
                  <div className="font-mono text-xl font-bold text-gold-400">{bookingRecord.bookingReference}</div>
                </div>
              </div>

              {/* Ticket Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono mb-1">Primary Visitor:</span>
                  <span className="text-white font-semibold text-sm">{bookingRecord.customer.name}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono mb-1">Contact Email:</span>
                  <span className="text-white font-semibold">{bookingRecord.customer.email}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono mb-1">Contact Phone:</span>
                  <span className="text-white font-semibold">{bookingRecord.customer.phone}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono mb-1">Observation Date:</span>
                  <span className="text-gold-400 font-bold text-sm font-mono">{bookingRecord.date}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono mb-1">Session Slot & Time:</span>
                  <span className="text-white font-semibold">{bookingRecord.slotTime}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono mb-1">Session Type:</span>
                  <span className="text-white font-semibold uppercase">{bookingRecord.sessionType} Observation</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono mb-1">Attendees Registered:</span>
                  <span className="text-white font-semibold">{bookingRecord.numberOfPeople} Person(s)</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono mb-1">Payment Status:</span>
                  <span className="text-emerald-400 font-bold uppercase font-mono">{bookingRecord.paymentStatus}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono mb-1">Transaction ID:</span>
                  <span className="text-slate-300 font-mono text-[11px]">{bookingRecord.paymentId || 'N/A'}</span>
                </div>
              </div>

              {/* Bottom Instructions */}
              <div className="pt-6 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
                <p>• Please arrive 15 minutes prior to your scheduled slot at the IAO Visitor Gate.</p>
                <p>• Red LED flashlights are required on the observation deck during night sessions.</p>
                <p>• Location: IST Campus, Expressway, Islamabad, Pakistan.</p>
              </div>

            </div>

            {/* Printable & Home Actions */}
            <div className="pt-4 flex items-center justify-between print:hidden">
              <button
                onClick={handlePrintTicket}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-white flex items-center gap-2"
              >
                <Printer className="w-4 h-4 text-gold-400" />
                <span>Print Official Confirmation Pass</span>
              </button>

              <button
                onClick={onNavigateHome}
                className="px-6 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-[#040711] text-xs font-semibold transition-all shadow-[0_4px_14px_rgba(212,175,55,0.35)]"
              >
                Return to Homepage
              </button>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
