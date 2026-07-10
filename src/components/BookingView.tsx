import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CalendarRange, CalendarDays, Clock, IndianRupee, Sparkles, Phone, Mail, MapPin, ClipboardList, CheckCircle2, ChevronRight, RefreshCw, Trash2, Printer, Lock } from 'lucide-react';
import { SERVICES } from '../data';
import { Booking, UserProfile } from '../types';
import { User } from 'firebase/auth';
import { db } from '../lib/firebase';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import AuthView from './AuthView';

interface BookingViewProps {
  preselectedServiceId?: string;
  user: User | null;
  profile: UserProfile | null;
  onBookingSubmitted?: () => void;
}

export default function BookingView({ preselectedServiceId = '', user, profile, onBookingSubmitted }: BookingViewProps) {
  // Booking fields
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [serviceType, setServiceType] = useState(preselectedServiceId || SERVICES[0].id);
  
  // Set default preferred date as tomorrow
  const getTomorrowDateString = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };
  const [preferredDate, setPreferredDate] = useState(getTomorrowDateString());
  const [preferredTime, setPreferredTime] = useState('09:00');
  const [duration, setDuration] = useState(3); // default hours
  const [specialInstructions, setSpecialInstructions] = useState('');

  // App states
  const [submitting, setSubmitting] = useState(false);
  const [pendingBooking, setPendingBooking] = useState<Booking | null>(null);
  const [pastBookings, setPastBookings] = useState<Booking[]>([]);
  const [showHistoryOnly, setShowHistoryOnly] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [permissionError, setPermissionError] = useState<boolean>(false);

  // Sync preselectedServiceId
  useEffect(() => {
    if (preselectedServiceId) {
      setServiceType(preselectedServiceId);
      setShowHistoryOnly(false); // Switch to booking form when preselecting
    }
  }, [preselectedServiceId]);

  // Autofill form inputs with user profile variables
  useEffect(() => {
    if (profile) {
      setCustomerName(profile.name || '');
      setPhone(profile.phone || '');
      setEmail(profile.email || '');
      setAddress(profile.address || '');
    } else if (user) {
      setCustomerName(user.displayName || '');
      setEmail(user.email || '');
    }
  }, [profile, user]);

  // Load user-specific bookings from Firestore 
  useEffect(() => {
    if (!user) {
      setPastBookings([]);
      return;
    }

    const fetchBookings = async () => {
      setLoadingHistory(true);
      setPermissionError(false);
      try {
        const q = query(
          collection(db, 'bookings'),
          where('userId', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);
        const bookingsList: Booking[] = [];
        
        querySnapshot.forEach((docSnap) => {
          bookingsList.push({
            id: docSnap.id,
            ...docSnap.data()
          } as Booking);
        });
        
        // Sort manually by date descending
        bookingsList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setPastBookings(bookingsList);
      } catch (e: any) {
        console.warn('Booking parse warn (rules check):', e);
        const msg = e.message || '';
        if (msg.includes('permission') || msg.includes('Permission') || e.code === 'permission-denied') {
          setPermissionError(true);
        }
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchBookings();
  }, [user, pendingBooking]);

  // Compute live price
  const selectedServiceObj = SERVICES.find(s => s.id === serviceType) || SERVICES[0];
  const calculatedTotal = selectedServiceObj.pricePerHour * duration;

  // Validate fields
  const validateForm = () => {
    const errs: { [key: string]: string } = {};
    if (!customerName.trim()) errs.customerName = 'Customer Name is required.';
    if (!phone.trim()) {
      errs.phone = 'Phone number is required.';
    } else if (!/^\+?[0-9\s\-()]{7,15}$/.test(phone)) {
      errs.phone = 'Please provide a valid telephone number (7-15 digits).';
    }
    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please provide a valid email format.';
    }
    if (!address.trim()) errs.address = 'Service delivery address is required.';
    if (!preferredDate) errs.preferredDate = 'Please select a date.';
    if (!preferredTime) errs.preferredTime = 'Please select a time.';
    if (duration < 1 || duration > 12) errs.duration = 'Duration must be between 1 and 12 hours.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const uniqueCode = 'HM-' + Math.floor(100000 + Math.random() * 900000).toString(10);
      
      const newBookingData = {
        userId: user.uid,
        customerName: customerName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        serviceType,
        preferredDate,
        preferredTime,
        duration,
        specialInstructions: specialInstructions.trim(),
        bookingCode: uniqueCode,
        status: 'Confirmed' as const, // instant auto confirmation in matching helper
        totalAmount: calculatedTotal,
        createdAt: new Date().toISOString()
      };

      // Push to Firestore bookings collection
      const docRef = await addDoc(collection(db, "bookings"), newBookingData);
      
      const savedBooking: Booking = {
        id: docRef.id,
        ...newBookingData
      };

      setPendingBooking(savedBooking);

      // Reset parts of form fields
      setSpecialInstructions('');
      setDuration(3);

      if (onBookingSubmitted) {
        onBookingSubmitted();
      }
    } catch (error: any) {
      console.warn("Firestore collection reservation notice:", error);
      const msg = error.message || '';
      if (msg.includes('permission') || msg.includes('Permission') || error.code === 'permission-denied') {
        setPermissionError(true);
        alert("Firestore Permission Denied. Your personal Firebase Database rules for project 'home-maid-9b643' are blocking database write operations for bookings. Please look at the helpful instruction banner at the top of the booking view to solve this instantly.");
      } else {
        alert("Submission failed. Please check network connection and try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Cancel Booking Handler
  const handleCancelBooking = async (id: string) => {
    const confirmCancel = window.confirm('Are you sure you want to cancel this scheduled helper visit?');
    if (!confirmCancel) return;

    try {
      await deleteDoc(doc(db, 'bookings', id));
      setPastBookings(prev => prev.filter(b => b.id !== id));
    } catch (e) {
      console.warn("Cancellation notice (network issue):", e);
      alert("Cancellation error. Please retry.");
    }
  };

  // Auth gate check
  if (!user) {
    return (
      <div id="auth-gate-section" className="bg-slate-50/50 py-16 font-sans">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-md mx-auto mb-10 space-y-3">
            <span className="text-[10px] font-bold text-teal-600 uppercase bg-teal-50 px-3 py-1 rounded-full border border-teal-150 tracking-widest flex items-center justify-center w-fit mx-auto space-x-1">
              <Lock className="h-3 w-3" />
              <span>Security Portal Gate</span>
            </span>
            <h2 className="text-2xl font-extrabold text-gray-950 font-display leading-tight">
              Customer Log In Required
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              To book pre-vetted helpers, prevent duplication of reservation hours, and follow dynamic schedules, please sign in or register below.
            </p>
          </div>
          <AuthView onSuccess={() => setShowHistoryOnly(false)} />
        </div>
      </div>
    );
  }

  return (
    <div id="booking-view-container" className="bg-slate-50/50 py-12 font-sans select-none">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Tabs */}
        <div className="flex h-11 items-center justify-center space-x-2.5 mb-10">
          <button
            onClick={() => { setShowHistoryOnly(false); setPendingBooking(null); }}
            className={`flex items-center space-x-2 rounded-xl px-5 py-2 text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
              !showHistoryOnly && !pendingBooking
                ? 'bg-teal-600 text-white shadow'
                : 'bg-white text-gray-500 border border-gray-200 hover:text-gray-900 shadow-3xs'
            }`}
          >
            <CalendarRange className="h-4.5 w-4.5" />
            <span>Book Helpers</span>
          </button>
          
          <button
            onClick={() => { setShowHistoryOnly(true); setPendingBooking(null); }}
            className={`flex items-center space-x-2 rounded-xl px-5 py-2 text-xs font-semibold uppercase tracking-wider transition relative cursor-pointer ${
              showHistoryOnly
                ? 'bg-teal-600 text-white shadow'
                : 'bg-white text-gray-500 border border-gray-200 hover:text-gray-900 shadow-3xs'
            }`}
          >
            <ClipboardList className="h-4.5 w-4.5" />
            <span>My Bookings</span>
            {pastBookings.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow animate-bounce">
                {pastBookings.length}
              </span>
            )}
          </button>
        </div>

        {/* Permission Required Alert */}
        <AnimatePresence>
          {permissionError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8 rounded-2xl border border-rose-200 bg-rose-50/60 p-5 font-sans shadow-sm text-rose-950"
            >
              <div className="flex items-start space-x-3">
                <span className="shrink-0 h-9 w-9 flex items-center justify-center rounded-xl bg-rose-100 text-rose-700 border border-rose-200 font-bold text-center">⚠</span>
                <div className="space-y-2 flex-1">
                  <h4 className="font-display font-bold text-sm text-rose-900 leading-snug">
                    Firestore Database Rules Issue Detected (Permission Denied)
                  </h4>
                  <p className="text-xs text-rose-800 leading-relaxed">
                    Firestore is refusing read/write queries. Since you connected your personal Firebase account <strong>"home-maid-9b643"</strong>, you must configure the Firestore Security Rules on your Firebase Console.
                  </p>
                  
                  <div className="pt-2">
                    <p className="text-[10px] font-bold uppercase text-rose-500 tracking-wider mb-2">Instructions to Solve:</p>
                    <ol className="list-decimal pl-4 text-xs space-y-1.5 text-rose-800">
                      <li>Go to the <a href="https://console.firebase.google.com/project/home-maid-9b643/firestore/rules" target="_blank" rel="noreferrer" className="underline font-bold hover:text-rose-950">Firebase Console Rules page</a>.</li>
                      <li>Replace the existing rules with the template below:</li>
                    </ol>

                    <pre className="mt-3 overflow-x-auto text-[10px] font-mono leading-relaxed bg-slate-900 text-slate-100 rounded-xl p-3.5 shadow-inner select-all border border-slate-800">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /bookings/{bookingId} {
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow read, update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}`}
                    </pre>
                    <p className="text-[10px] text-rose-600 mt-2 font-medium">Click "Publish" in your Firebase Rules dashboard to instantly save and live-test!</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          
          {/* Case 1: Booking Success Screen */}
          {pendingBooking && !showHistoryOnly && (
            <motion.div
              key="success-receipt"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              id="booking-receipt-success"
              className="rounded-3xl border border-teal-100 bg-white p-6 sm:p-10 shadow-xl"
            >
              <div className="text-center space-y-3 mb-8">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-teal-600 border border-teal-100 shadow-3xs">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h2 className="font-display text-2xl font-extrabold text-gray-900 sm:text-3.5xl">
                  Booking Confirmed!
                </h2>
                <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
                  Excellent choice! Your pre-vetted helper has been matched and reserved. A confirming snapshot has been compiled in your database for <span className="font-semibold text-gray-800">{pendingBooking.email}</span>.
                </p>
              </div>

              {/* Booking Ticket Frame */}
              <div id="receipt-ticket" className="rounded-2xl border border-dashed border-gray-200 bg-slate-50/50 p-6 space-y-6">
                
                {/* Reference ID & Time Stamp */}
                <div className="flex flex-col sm:flex-row items-baseline sm:justify-between border-b border-gray-150 pb-4 gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Reference ID:</span>
                    <h4 className="font-mono text-base font-extrabold text-teal-700">{pendingBooking.bookingCode}</h4>
                  </div>
                  <div className="text-xs text-gray-400">
                    <span>Booked: </span>
                    <span className="font-medium text-gray-700">{new Date(pendingBooking.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Details Breakdown */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm text-gray-600">
                  <div className="flex items-start space-x-2.5">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Service Ordered</p>
                      <p className="font-semibold text-gray-900">
                        {SERVICES.find(s => s.id === pendingBooking.serviceType)?.title || pendingBooking.serviceType}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2.5">
                    <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Preferred Date & Time</p>
                      <p className="font-semibold text-gray-900">{pendingBooking.preferredDate} at {pendingBooking.preferredTime}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2.5">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Duration Reserved</p>
                      <p className="font-semibold text-gray-900">{pendingBooking.duration} Continuous Hours</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2.5">
                    <IndianRupee className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Estimated Cost</p>
                      <p className="font-mono font-bold text-gray-950 text-base">₹{pendingBooking.totalAmount.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2.5 sm:col-span-2 border-t border-gray-100 pt-4.5 mt-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Service Delivery Address</p>
                      <p className="text-gray-700 leading-tight">{pendingBooking.address}</p>
                    </div>
                  </div>

                  {pendingBooking.specialInstructions && (
                    <div className="flex items-start space-x-2.5 sm:col-span-2 border-t border-gray-100 pt-4.5">
                      <ClipboardList className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Special Instructions</p>
                        <p className="text-gray-500 text-xs italic">"{pendingBooking.specialInstructions}"</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action operations */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => { setPendingBooking(null); setShowHistoryOnly(false); }}
                  className="w-full sm:w-auto rounded-xl bg-teal-600 px-6 py-3 text-sm font-bold text-white hover:bg-teal-700 transition cursor-pointer text-center"
                >
                  Schedule Another visit
                </button>
                <button
                  type="button"
                  onClick={() => setShowHistoryOnly(true)}
                  className="w-full sm:w-auto rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer text-center"
                >
                  Manage My Reservations
                </button>
              </div>
            </motion.div>
          )}

          {/* Case 2: Past Bookings List History */}
          {showHistoryOnly && !pendingBooking && (
            <motion.div
              key="bookings-history"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              id="my-bookings-panel"
              className="space-y-6"
            >
              <div className="rounded-2xl border border-gray-150 bg-white p-6 shadow-sm">
                <h3 className="font-display text-lg font-bold text-gray-900 mb-2">My Scheduled Helpers</h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-6">
                  Here are your upcoming matches and real-time database confirmations. You are permitted to modify or cancel scheduled visits up to 12 hours before arrival times.
                </p>

                {loadingHistory ? (
                  <div className="flex flex-col items-center justify-center py-16 space-y-3">
                    <RefreshCw className="h-7 w-7 text-teal-500 animate-spin" />
                    <span className="text-xs text-gray-450 font-medium">Synchronizing live records...</span>
                  </div>
                ) : pastBookings.length === 0 ? (
                  <div className="text-center py-12 px-4 rounded-xl border border-dashed border-gray-200">
                    <p className="text-sm font-semibold text-gray-400">No active bookings found in your database.</p>
                    <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">Fill out the quick helper booking form to schedule home care assistance today!</p>
                    <button
                      onClick={() => setShowHistoryOnly(false)}
                      className="mt-4 rounded-xl bg-teal-50 px-4 py-2 text-xs font-bold text-teal-700 hover:bg-teal-100 transition cursor-pointer"
                    >
                      Book helper now
                    </button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {pastBookings.map((bk) => {
                      const serviceObj = SERVICES.find(s => s.id === bk.serviceType) || SERVICES[0];
                      return (
                        <div
                          key={bk.id}
                          id={`history-row-${bk.id}`}
                          className="rounded-xl border border-gray-150 p-4 relative bg-slate-50/30 hover:bg-white hover:border-teal-100 transition space-y-4"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-3 gap-2">
                             <div>
                              <span className="inline-block rounded-md bg-teal-50 text-[10px] font-bold text-teal-700 px-2 py-0.5 mb-1 text-xs">
                                {serviceObj.title}
                              </span>
                              <h4 className="font-display text-sm font-bold text-gray-950">{bk.customerName}'s Reservation</h4>
                            </div>
                            <div className="text-left sm:text-right">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Reference: </span>
                              <span className="font-mono text-sm font-extrabold text-teal-700 leading-none block sm:inline">{bk.bookingCode}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 text-xs text-gray-500">
                            <div>
                              <p className="font-semibold text-gray-400 text-[10px] uppercase">Service Name</p>
                              <p className="font-medium text-gray-800 mt-0.5">{serviceObj.title}</p>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-400 text-[10px] uppercase">Schedule Date</p>
                              <p className="font-medium text-gray-800 mt-0.5">{bk.preferredDate}</p>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-400 text-[10px] uppercase">Start Time / duration</p>
                              <p className="font-medium text-gray-800 mt-0.5">{bk.preferredTime} ({bk.duration} hours)</p>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-400 text-[10px] uppercase">Amount</p>
                              <p className="font-mono font-bold text-gray-900 mt-0.5">₹{bk.totalAmount.toFixed(2)}</p>
                            </div>
                          </div>

                          <div className="text-xs text-gray-500 bg-white/50 p-3.5 rounded-lg border border-gray-100 flex items-start space-x-2">
                            <MapPin className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                            <span className="leading-tight">{bk.address}</span>
                          </div>

                          <div className="flex items-center justify-end space-x-3 pt-1">
                            <button
                              type="button"
                              onClick={() => {
                                window.print();
                              }}
                              className="inline-flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-900 transition font-medium cursor-pointer"
                            >
                              <Printer className="h-3.5 w-3.5" />
                              <span>Print</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCancelBooking(bk.id)}
                              className="inline-flex items-center space-x-1 text-xs text-rose-600 hover:text-rose-700 transition font-bold cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>Cancel Reservation</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Case 3: Interactive Booking Form */}
          {!showHistoryOnly && !pendingBooking && (
            <motion.div
              key="booking-form-wrapper"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 gap-8 lg:grid-cols-12"
            >
              
              {/* Form Entry Column */}
              <form 
                id="service-reservation-form" 
                onSubmit={handleSubmit}
                className="rounded-2xl border border-gray-150 bg-white p-6 sm:p-8 shadow-sm space-y-5 lg:col-span-8"
              >
                <div className="border-b border-gray-100 pb-4 mb-2">
                  <h3 className="font-display text-lg font-bold text-gray-950">Helper Booking Form</h3>
                  <p className="text-xs text-gray-450 leading-relaxed mt-0.5">Please provide your contact info and home service configuration.</p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Customer Name */}
                  <div className="space-y-1.5" id="field-name-container">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Customer Name</label>
                    <input
                      id="input-customer-name"
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className={`w-full rounded-xl border px-3.5 py-3 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-hidden ${
                        errors.customerName ? 'border-rose-400 bg-rose-50/10' : 'border-gray-200'
                      }`}
                    />
                    {errors.customerName && <p className="text-[10px] text-rose-500 font-semibold">{errors.customerName}</p>}
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-1.5" id="field-phone-container">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Phone Number</label>
                    <input
                      id="input-phone-number"
                      type="tel"
                      required
                      placeholder="+1 (555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full rounded-xl border px-3.5 py-3 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-hidden ${
                        errors.phone ? 'border-rose-400 bg-rose-50/10' : 'border-gray-200'
                      }`}
                    />
                    {errors.phone && <p className="text-[10px] text-rose-500 font-semibold">{errors.phone}</p>}
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1.5" id="field-email-container">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Email Address</label>
                  <input
                    id="input-email-address"
                    type="email"
                    required
                    placeholder="jane.doe@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full rounded-xl border px-3.5 py-3 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-hidden ${
                      errors.email ? 'border-rose-400 bg-rose-50/10' : 'border-gray-200'
                    }`}
                  />
                  {errors.email && <p className="text-[10px] text-rose-500 font-semibold">{errors.email}</p>}
                </div>

                {/* Address */}
                <div className="space-y-1.5" id="field-address-container">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Service delivery Address</label>
                  <textarea
                    id="input-address"
                    required
                    rows={2}
                    placeholder="Winding Road Apt 3B, Downtown Center, City Zip Code"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-hidden ${
                      errors.address ? 'border-rose-400 bg-rose-50/10' : 'border-gray-200'
                    }`}
                  />
                  {errors.address && <p className="text-[10px] text-rose-500 font-semibold">{errors.address}</p>}
                </div>

                {/* Dropdown Service Select */}
                <div className="space-y-1.5" id="field-service-container">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Service Type Requested</label>
                  <div className="relative">
                    <select
                      id="input-service-type"
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-hidden appearance-none cursor-pointer"
                    >
                      {SERVICES.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.title} (₹{s.pricePerHour}/hr)
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                      ▼
                    </div>
                  </div>
                </div>

                {/* Date & Time Parameters */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Date selection */}
                  <div className="space-y-1.5" id="field-date-container">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center space-x-1.5">
                      <CalendarDays className="h-4 w-4 text-teal-600" />
                      <span>Preferred Date</span>
                    </label>
                    <input
                      id="input-preferred-date"
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-3.5 py-3 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-hidden cursor-pointer"
                    />
                  </div>

                  {/* Time selection */}
                  <div className="space-y-1.5" id="field-time-container">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center space-x-1.5">
                      <Clock className="h-4 w-4 text-teal-600" />
                      <span>Preferred Arrival Time</span>
                    </label>
                    <input
                      id="input-preferred-time"
                      type="time"
                      required
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-3.5 py-3 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-hidden cursor-pointer"
                    />
                  </div>
                </div>

                {/* Duration Slider / Counter */}
                <div className="space-y-2 lg:pt-2" id="field-duration-container">
                  <div className="flex justify-between items-baseline">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Duration Required</label>
                    <span className="font-mono text-sm font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
                      {duration} continuous hours
                    </span>
                  </div>
                  <input
                    id="input-duration-range"
                    type="range"
                    min="1"
                    max="12"
                    step="1"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                  />
                  <div className="flex justify-between text-[10px] font-semibold text-gray-400 uppercase">
                    <span>1 Hour (Quick Visit)</span>
                    <span>6 Hours</span>
                    <span>12 Hours (Day-Long)</span>
                  </div>
                </div>

                {/* Special Instructions */}
                <div className="space-y-1.5" id="field-instructions-container">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Special Instructions / Allergies</label>
                  <textarea
                    id="input-special-instructions"
                    rows={3}
                    placeholder="Ex: Please bring a pet-friendly mop, key is placed under the front door rug, focus on window handles, etc."
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-hidden"
                  />
                </div>

                {/* Submit Booking button */}
                <div className="pt-4.5">
                  <button
                    id="submit-booking-button"
                    type="submit"
                    disabled={submitting}
                    className="flex w-full items-center justify-center space-x-2 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 px-6 py-4 text-sm font-bold text-white shadow-md active:scale-98 transition cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Reserving Helper & Syncing Firebase...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4.5 w-4.5" />
                        <span>Submit Booking Match Request</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Estimate Cost Card Right Column */}
              <div id="booking-side-estimator" className="lg:col-span-4 space-y-6">
                
                {/* Live Estimator Receipt */}
                <div className="rounded-2xl border border-gray-150 bg-white p-6 shadow-sm space-y-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 h-16 w-16 bg-teal-500/5 rounded-bl-full pointer-events-none" />
                  <h4 className="font-display text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">
                    Reserve Cost Calculator
                  </h4>
                  
                  <div className="space-y-3 text-xs text-gray-500">
                    <div className="flex justify-between">
                      <span>Rate ({selectedServiceObj.title})</span>
                      <span className="font-mono text-gray-800 font-semibold">₹{selectedServiceObj.pricePerHour}/hr</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration Requested</span>
                      <span className="font-mono text-gray-800 font-semibold">{duration} Hours</span>
                    </div>
                    
                    <hr className="border-gray-100 my-2" />
                    
                    <div className="flex justify-between items-baseline">
                      <span className="text-gray-900 font-bold">Estimated Cost</span>
                      <span className="font-mono text-xl font-black text-teal-600">₹{calculatedTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="rounded-xl bg-teal-50/50 border border-teal-100 p-4 space-y-2.5 text-xs text-teal-800 leading-relaxed">
                    <div className="flex items-center space-x-1.5 font-bold">
                      <Sparkles className="h-3.5 w-3.5 text-teal-600 animate-pulse" />
                      <span>Match Guarantee Includes</span>
                    </div>
                    <ul className="space-y-1.5 pl-4 list-disc text-teal-700 font-medium">
                      <li>Free direct matchmaking replacement</li>
                      <li>Accident liability coverage</li>
                      <li>100% pre-vetted helper assignment</li>
                    </ul>
                  </div>
                </div>

                {/* Helpful support notice */}
                <div className="rounded-2xl bg-slate-900 text-slate-100 p-6 space-y-3">
                  <h4 className="font-display text-xs font-bold uppercase tracking-widest text-teal-400">Need Immediate Help?</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Have unique chores or require rapid service helper delivery? Dial our direct booking call center inside 10 minutes.
                  </p>
                  <p className="font-mono text-xs font-semibold text-white flex items-center space-x-1.5 pt-1">
                    <Phone className="h-3.5 w-3.5 text-teal-400 shrink-0" />
                    <span>+1 (555) HOME-MAID</span>
                  </p>
                </div>

              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
