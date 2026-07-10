import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, 
  Unlock, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Calendar, 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Check, 
  X, 
  Filter, 
  TrendingUp, 
  ClipboardList, 
  IndianRupee, 
  Layers, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  RefreshCw,
  LogOut,
  User as UserIcon,
  ChevronsUpDown
} from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, User } from 'firebase/auth';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { Booking, UserProfile } from '../types';
import { SERVICES } from '../data';

export default function AdminPortal() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Auth state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [authError, setAuthError] = useState<string | React.ReactNode>('');

  // Dashboard state
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [useLocalBackup, setUseLocalBackup] = useState(() => {
    return localStorage.getItem('hm_admin_use_local') === 'true';
  });

  // Filtering / Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'value-high' | 'value-low'>('newest');

  // Creating a new booking
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newServiceType, setNewServiceType] = useState(SERVICES[0].id);
  const [newDate, setNewDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [newTime, setNewTime] = useState('09:00');
  const [newDuration, setNewDuration] = useState(3);
  const [newInstructions, setNewInstructions] = useState('');
  const [newInitialStatus, setNewInitialStatus] = useState<'Pending' | 'Confirmed' | 'InProgress' | 'Completed'>('Confirmed');
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');

  // Editing an existing booking
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [editCustName, setEditCustName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editServiceType, setEditServiceType] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editDuration, setEditDuration] = useState(3);
  const [editInstructions, setEditInstructions] = useState('');
  const [editStatus, setEditStatus] = useState<'Pending' | 'Confirmed' | 'InProgress' | 'Completed'>('Pending');
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  // Listen to auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      setCurrentUser(usr);
      if (usr && (usr.email === 'admin@gmail.com' || usr.email === 'admin.homemaid@gmail.com' || usr.email === 'aarshpatel175@gmail.com')) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch bookings when admin is verified or backup toggle changes
  useEffect(() => {
    if (isAdmin) {
      fetchBookings();
    } else {
      setBookings([]);
    }
  }, [isAdmin, useLocalBackup]);

  // Handle local database switch dynamically
  const toggleLocalBackup = (enabled: boolean) => {
    setUseLocalBackup(enabled);
    localStorage.setItem('hm_admin_use_local', enabled ? 'true' : 'false');
  };

  const fetchBookings = async () => {
    setBookingsLoading(true);
    setLoadError('');
    
    if (useLocalBackup) {
      try {
        const localData = localStorage.getItem('hm_local_bookings');
        let list: Booking[] = [];
        if (localData) {
          list = JSON.parse(localData);
        } else {
          // Initialize premium high-fidelity demo records if local database is empty
          list = [
            {
              id: 'local_1',
              userId: 'demo-user-1',
              customerName: 'Aarsh Patel',
              phone: '+91 98765 43210',
              email: 'aarshpatel@gmail.com',
              address: 'Sec-15, Rohini, New Delhi, India',
              serviceType: 'house-cleaning',
              preferredDate: '2026-06-17',
              preferredTime: '10:00',
              duration: 3,
              specialInstructions: 'Please focus on living room carpets and dusting shelves thoroughly.',
              bookingCode: 'HM-SANDBOX-98124',
              status: 'Pending',
              totalAmount: 540,
              createdAt: new Date().toISOString()
            },
            {
              id: 'local_2',
              userId: 'demo-user-2',
              customerName: 'Priyanka Sharma',
              phone: '+91 99999 88888',
              email: 'priyanka@outlook.com',
              address: 'Greater Kailash II, New Delhi',
              serviceType: 'child-care',
              preferredDate: '2026-06-18',
              preferredTime: '14:30',
              duration: 4,
              specialInstructions: 'Support children with homework and prepare light nutrition snacks.',
              bookingCode: 'HM-SANDBOX-15492',
              status: 'Confirmed',
              totalAmount: 1120,
              createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
            },
            {
              id: 'local_3',
              userId: 'demo-user-3',
              customerName: 'Rohit Khandelwal',
              phone: '+91 98111 22233',
              email: 'rohitkh@gmail.com',
              address: 'Golf Green Apartments, Sector 56, Gurugram',
              serviceType: 'deep-cleaning',
              preferredDate: '2026-06-20',
              preferredTime: '08:30',
              duration: 5,
              specialInstructions: 'Need detailed deep scrub of kitchen tile grout lines and window tracks.',
              bookingCode: 'HM-SANDBOX-45218',
              status: 'Completed',
              totalAmount: 1750,
              createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
            }
          ];
          localStorage.setItem('hm_local_bookings', JSON.stringify(list));
        }
        // Ensure manual date ordering
        list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        setBookings(list);
      } catch (localErr: any) {
        console.error("Local parse error", localErr);
        setLoadError("Failed to parse sandbox local reservations: " + localErr.message);
      } finally {
        setBookingsLoading(false);
        setRefreshing(false);
      }
      return;
    }

    try {
      const snap = await getDocs(collection(db, 'bookings'));
      const list: Booking[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as Booking);
      });
      // Sort default newest
      list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      setBookings(list);
    } catch (err: any) {
      console.warn("Error fetching all bookings", err);
      setLoadError(err.message || String(err));
    } finally {
      setBookingsLoading(false);
      setRefreshing(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail !== 'admin@gmail.com' && cleanEmail !== 'admin.homemaid@gmail.com' && cleanEmail !== 'aarshpatel175@gmail.com') {
      setAuthError('Access Denied. Only authorized admin email addresses can log in here.');
      return;
    }

    setLoginLoading(true);
    setAuthError('');

    try {
      await signInWithEmailAndPassword(auth, cleanEmail, password);
    } catch (err: any) {
      // If the email doesn't exist, automatically sign it up (Zero setup experience!)
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || (err.message && err.message.includes('credential'))) {
        try {
          const userCred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
          // Set up admin profile in firestore
          await setDoc(doc(db, "users", userCred.user.uid), {
            uid: userCred.user.uid,
            name: "Portal Administrator",
            email: cleanEmail,
            phone: "+91 99999 99999",
            address: "Home-Maid HQ, New Delhi, India",
            createdAt: new Date().toISOString()
          });
        } catch (suErr: any) {
          if (suErr.code === 'auth/email-already-in-use') {
            if (cleanEmail === 'admin@gmail.com') {
              setAuthError(
                <span>
                  <strong>Incorrect password or account collision.</strong><br/>
                  Since <code className="bg-rose-100 font-bold px-1 rounded text-rose-800 font-mono">admin@gmail.com</code> has already been registered on this shared Firebase database by another sandbox user with a different password, please use the alternative admin account: <strong className="text-gray-950 font-mono select-all">admin.homemaid@gmail.com</strong> with password <strong className="text-gray-950 font-mono select-all">Admin@123</strong> (it will auto-register on your first try!).
                </span>
              );
            } else {
              setAuthError('Incorrect password for the admin account. Please enter the correct password.');
            }
          } else {
            console.error("Auto sign up error for admin:", suErr);
            setAuthError(suErr.message || 'Authentication error.');
          }
        }
      } else {
        setAuthError(err.message || 'Failed to authenticate Admin.');
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleCreateAdminBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim() || !newPhone.trim() || !newEmail.trim() || !newAddress.trim()) {
      setAddError("Please fill out all required customer information.");
      return;
    }

    setAddLoading(true);
    setAddError('');

    const targetService = SERVICES.find(s => s.id === newServiceType) || SERVICES[0];
    const totalAmount = targetService.pricePerHour * newDuration;
    const uniqueCode = 'HM-ADMIN-' + Math.floor(100000 + Math.random() * 900000).toString(10);

    const bookingPayload = {
      userId: currentUser?.uid || "admin-creator",
      customerName: newCustName.trim(),
      phone: newPhone.trim(),
      email: newEmail.trim(),
      address: newAddress.trim(),
      serviceType: newServiceType,
      preferredDate: newDate,
      preferredTime: newTime,
      duration: newDuration,
      specialInstructions: newInstructions.trim(),
      bookingCode: uniqueCode,
      status: newInitialStatus,
      totalAmount,
      createdAt: new Date().toISOString()
    };

    try {
      if (useLocalBackup) {
        const localData = localStorage.getItem('hm_local_bookings');
        const currentList = localData ? JSON.parse(localData) : [];
        const newBookingLocal = { id: 'local_' + Date.now(), ...bookingPayload };
        currentList.push(newBookingLocal);
        localStorage.setItem('hm_local_bookings', JSON.stringify(currentList));
      } else {
        await addDoc(collection(db, 'bookings'), bookingPayload);
      }
      setShowAddForm(false);
      // Reset form variables
      setNewCustName('');
      setNewPhone('');
      setNewEmail('');
      setNewAddress('');
      setNewInstructions('');
      setNewDuration(3);
      // Refresh list
      fetchBookings();
    } catch (err: any) {
      console.error("Admin booking failure", err);
      setAddError("Could not save new booking to Firestore: " + (err.message || String(err)));
    } finally {
      setAddLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: 'Pending' | 'Confirmed' | 'InProgress' | 'Completed') => {
    try {
      if (useLocalBackup) {
        const localData = localStorage.getItem('hm_local_bookings');
        if (localData) {
          const currentList: Booking[] = JSON.parse(localData);
          const updated = currentList.map(b => b.id === id ? { ...b, status: newStatus } : b);
          localStorage.setItem('hm_local_bookings', JSON.stringify(updated));
        }
      } else {
        await updateDoc(doc(db, 'bookings', id), { status: newStatus });
      }
      setBookings(prev => 
        prev.map(b => b.id === id ? { ...b, status: newStatus } : b)
      );
    } catch (err: any) {
      alert("Failed to update status: " + err.message);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this booking? This action is irreversible.")) {
      return;
    }
    try {
      if (useLocalBackup) {
        const localData = localStorage.getItem('hm_local_bookings');
        if (localData) {
          const currentList: Booking[] = JSON.parse(localData);
          const filtered = currentList.filter(b => b.id !== id);
          localStorage.setItem('hm_local_bookings', JSON.stringify(filtered));
        }
      } else {
        await deleteDoc(doc(db, 'bookings', id));
      }
      setBookings(prev => prev.filter(b => b.id !== id));
    } catch (err: any) {
      alert("Purchase deletion failed: " + err.message);
    }
  };

  const startEditBooking = (b: Booking) => {
    setEditingBooking(b);
    setEditCustName(b.customerName);
    setEditPhone(b.phone);
    setEditEmail(b.email);
    setEditAddress(b.address);
    setEditServiceType(b.serviceType);
    setEditDate(b.preferredDate);
    setEditTime(b.preferredTime);
    setEditDuration(b.duration);
    setEditInstructions(b.specialInstructions || '');
    setEditStatus(b.status);
    setEditError('');
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking) return;

    if (!editCustName.trim() || !editPhone.trim() || !editEmail.trim() || !editAddress.trim()) {
      setEditError("Customer information cannot be empty.");
      return;
    }

    setEditLoading(true);
    setEditError('');

    const targetService = SERVICES.find(s => s.id === editServiceType) || SERVICES[0];
    const totalAmount = targetService.pricePerHour * editDuration;

    const updatePayload = {
      customerName: editCustName.trim(),
      phone: editPhone.trim(),
      email: editEmail.trim(),
      address: editAddress.trim(),
      serviceType: editServiceType,
      preferredDate: editDate,
      preferredTime: editTime,
      duration: editDuration,
      specialInstructions: editInstructions.trim(),
      status: editStatus,
      totalAmount
    };

    try {
      if (useLocalBackup) {
        const localData = localStorage.getItem('hm_local_bookings');
        if (localData) {
          const currentList: Booking[] = JSON.parse(localData);
          const updated = currentList.map(b => b.id === editingBooking.id ? { ...b, ...updatePayload } : b);
          localStorage.setItem('hm_local_bookings', JSON.stringify(updated));
        }
      } else {
        await updateDoc(doc(db, 'bookings', editingBooking.id), updatePayload);
      }
      setEditingBooking(null);
      fetchBookings();
    } catch (err: any) {
      console.error(err);
      setEditError("Failed to update booking: " + err.message);
    } finally {
      setEditLoading(false);
    }
  };

  // Log out current admin
  const handleLogOut = async () => {
    try {
      await auth.signOut();
    } catch (err) {
      console.error("Sign out error", err);
    }
  };

  // Format Date beautifully
  const formatDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-IN', options);
  };

  // Live filter & sort
  const filteredBookings = bookings.filter((b) => {
    const query = searchQuery.toLowerCase().trim();
    const serviceName = SERVICES.find(s => s.id === b.serviceType)?.title || '';
    
    // Search filter
    const matchesQuery = 
      b.customerName.toLowerCase().includes(query) ||
      b.bookingCode.toLowerCase().includes(query) ||
      b.email.toLowerCase().includes(query) ||
      b.phone.includes(query) ||
      b.address.toLowerCase().includes(query) ||
      serviceName.toLowerCase().includes(query);

    // Status filter
    const matchesStatus = selectedStatus === 'all' || b.status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesQuery && matchesStatus;
  });

  // Apply sorting
  const sortedAndFilteredBookings = [...filteredBookings].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    }
    if (sortBy === 'oldest') {
      return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
    }
    if (sortBy === 'value-high') {
      return b.totalAmount - a.totalAmount;
    }
    if (sortBy === 'value-low') {
      return a.totalAmount - b.totalAmount;
    }
    return 0;
  });

  // Calculation metrics
  const totalRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const pendingCount = bookings.filter(b => b.status === 'Pending').length;
  const confirmedCount = bookings.filter(b => b.status === 'Confirmed').length;
  const progressCount = bookings.filter(b => b.status === 'InProgress').length;
  const completedCount = bookings.filter(b => b.status === 'Completed').length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 font-sans">
      
      {/* CASE 1: NOT AN ADMIN (Auth Gate) */}
      {!isAdmin ? (
        <div className="mx-auto max-w-md my-12">
          <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
            <div className="text-center space-y-3 mb-8">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 border border-teal-100 shadow-xs">
                <Lock className="h-6 w-6" />
              </div>
              <h2 className="font-display text-2xl font-black text-gray-950">
                Admin Management Portal
              </h2>
              <p className="text-xs text-gray-500 leading-relaxed max-w-sm mx-auto">
                Authorized access restricted to system administration only. Please provide the administrator email and credentials below.
              </p>

              <div className="mt-4 p-3 bg-teal-50/60 border border-teal-100 rounded-2xl text-left">
                <p className="text-[11px] text-teal-800 leading-normal">
                  💡 <strong>Sandbox Collision Guard:</strong> If <code className="bg-white/90 px-1 rounded font-bold font-mono text-teal-900">admin@gmail.com</code> has already been registered on this shared global database with a different password, feel free to use the alternative dedicated admin email:
                </p>
                <div className="flex flex-col text-[11px] font-mono text-teal-950 mt-1.5 space-y-0.5 bg-white/60 p-2 rounded-lg border border-teal-100/50">
                  <span>Email: <strong className="select-all font-sans">admin.homemaid@gmail.com</strong></span>
                  <span>Password: <strong className="select-all font-sans">Admin@123</strong></span>
                </div>
              </div>
            </div>

            {authError && (
              <div className="mb-6 rounded-xl border border-rose-100 bg-rose-50/60 p-4 text-xs text-rose-700 font-medium flex items-start space-x-2.5">
                <AlertCircle className="h-4.5 w-4.5 text-rose-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">{authError}</div>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-gray-700 uppercase tracking-widest block">Admin Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    placeholder="admin@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 outline-hidden tracking-wide"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-gray-700 uppercase tracking-widest block font-sans">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full flex items-center justify-center space-x-2.5 rounded-xl bg-gray-950 hover:bg-teal-900 disabled:bg-gray-400 py-3.5 text-sm font-bold text-white shadow-md transition cursor-pointer active:scale-98"
                >
                  {loginLoading ? (
                    <>
                      <Loader2 className="h-4.5 w-4.5 animate-spin" />
                      <span>Verifying System Credentials...</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="h-4.5 w-4.5" />
                      <span>Authenticate Secure Login</span>
                    </>
                  )}
                </button>
              </div>
            </form>


          </div>
        </div>
      ) : (
        
        /* CASE 2: MAIN ADMIN VIEW PORTAL */
        <div className="space-y-8">
          
          {/* Dashboard Header Bar */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between p-6 bg-slate-900 rounded-3xl text-white shadow-xl space-y-4 md:space-y-0 relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-12 -translate-y-12">
              <Lock className="h-72 w-72" />
            </div>
            <div className="space-y-1.5 z-10">
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-teal-555 text-white/90 text-[10px] font-extrabold uppercase tracking-widest border border-white/10">
                <Sparkles className="h-3 w-3" />
                <span>Super Administrator Portal</span>
              </span>
              <h1 className="font-display text-2xl font-black tracking-tight sm:text-3xl">
                Home-Maid Control Room
              </h1>
              <p className="text-xs text-slate-300">
                Logged in securely as <span className="text-teal-400 font-bold">{currentUser?.email}</span>
              </p>
            </div>

            <div className="flex items-center space-x-3 z-10">
              <button
                onClick={() => {
                  setRefreshing(true);
                  fetchBookings();
                }}
                disabled={bookingsLoading}
                className="flex items-center space-x-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/5 px-4.5 py-2.5 text-xs font-bold text-white transition cursor-pointer"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Sync Data</span>
              </button>
              
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center space-x-2 rounded-xl bg-teal-550 hover:bg-teal-600 px-4.5 py-2.5 text-xs font-bold text-white shadow-xs transition cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add New Booking</span>
              </button>

              <button
                onClick={handleLogOut}
                className="flex items-center justify-center p-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 font-bold transition border border-rose-500/10 cursor-pointer"
                title="Log Out Admin"
              >
                <LogOut className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>

          {/* Quick Metrics Dashboard BENTO */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-gray-150 flex flex-col justify-between shadow-xs">
              <p className="text-[10px] uppercase font-black text-gray-400 tracking-wider">Gross Bookings</p>
              <div className="flex items-baseline space-x-1.5 mt-2">
                <span className="text-2xl font-extrabold text-gray-900 leading-none">{bookings.length}</span>
                <span className="text-[10px] text-gray-400 font-medium">Orders</span>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-5 border border-gray-150 flex flex-col justify-between shadow-xs">
              <p className="text-[10px] uppercase font-black text-amber-500 tracking-wider">Pending Hub</p>
              <div className="flex items-baseline space-x-1.5 mt-2">
                <span className="text-2xl font-extrabold text-amber-600 leading-none">{pendingCount}</span>
                <span className="text-[10px] text-amber-500 font-medium">Waiting</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-150 flex flex-col justify-between shadow-xs">
              <p className="text-[10px] uppercase font-black text-teal-600 tracking-wider font-sans">Active/Confirmed</p>
              <div className="flex items-baseline space-x-1.5 mt-2">
                <span className="text-2xl font-extrabold text-teal-600 leading-none">{confirmedCount + progressCount}</span>
                <span className="text-[10px] text-teal-500 font-medium">Approved</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-150 flex flex-col justify-between shadow-xs">
              <p className="text-[10px] uppercase font-black text-emerald-600 tracking-wider">Fulfilled Complete</p>
              <div className="flex items-baseline space-x-1.5 mt-2">
                <span className="text-2xl font-extrabold text-emerald-600 leading-none">{completedCount}</span>
                <span className="text-[10px] text-emerald-500 font-medium font-sans">Resolved</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-teal-100 bg-teal-50/10 col-span-2 lg:col-span-1 flex flex-col justify-between shadow-xs">
              <p className="text-[10px] uppercase font-black text-teal-700 tracking-wider">Aggregate Gross</p>
              <div className="flex items-baseline space-x-0.5 mt-2">
                <IndianRupee className="h-4 w-4 text-teal-650 shrink-0 self-center" />
                <span className="text-2xl font-black text-teal-650 leading-none font-mono">
                  {totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          </div>

          {/* ADD BOOKING MODAL (Admin End) */}
          <AnimatePresence>
            {showAddForm && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
              >
                <motion.div 
                  initial={{ scale: 0.95, y: 15 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.95, y: 15 }}
                  className="bg-white rounded-3xl border border-gray-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-extrabold uppercase text-teal-600 tracking-widest block">ADMIN END RESERVATION</span>
                      <h3 className="font-display text-xl font-bold text-gray-950">Add Booking Manually</h3>
                    </div>
                    <button 
                      onClick={() => setShowAddForm(false)}
                      className="p-1 px-2.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 font-bold text-sm transition"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {addError && (
                    <div className="rounded-xl border border-rose-100 bg-rose-50/60 p-4 text-xs text-rose-700 font-medium leading-relaxed flex items-start space-x-2.5">
                      <AlertCircle className="h-4.5 w-4.5 text-rose-600 shrink-0 mt-0.5" />
                      <span>{addError}</span>
                    </div>
                  )}

                  <form onSubmit={handleCreateAdminBooking} className="space-y-5">
                    
                    {/* CUSTOMER INFO SECTION */}
                    <div className="bg-slate-50 rounded-2xl p-4.5 border border-gray-150 space-y-4">
                      <h4 className="text-xs font-black uppercase text-gray-500 tracking-wider">1. Customer Identification</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest block">Customer Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="John Doe"
                            value={newCustName}
                            onChange={(e) => setNewCustName(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 outline-hidden"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest block">Phone Number *</label>
                          <input
                            type="tel"
                            required
                            placeholder="+91 99999 88888"
                            value={newPhone}
                            onChange={(e) => setNewPhone(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 outline-hidden"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest block font-sans">Email Address *</label>
                        <input
                          type="email"
                          required
                          placeholder="client@gmail.com"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 outline-hidden"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest block">Delivery Address *</label>
                        <input
                          type="text"
                          required
                          placeholder="Flat 14-B, Ocean Drive Penthouse"
                          value={newAddress}
                          onChange={(e) => setNewAddress(e.target.value)}
                          className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 outline-hidden"
                        />
                      </div>
                    </div>

                    {/* APPOINTMENT SPEC DETAILS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest block">Service Category</label>
                        <select
                          value={newServiceType}
                          onChange={(e) => setNewServiceType(e.target.value)}
                          className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 outline-hidden cursor-pointer"
                        >
                          {SERVICES.map(s => (
                            <option key={s.id} value={s.id}>
                              {s.title} (₹{s.pricePerHour}/hr)
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest block">Duration (Hours)</label>
                        <input
                          type="number"
                          min="1"
                          max="12"
                          required
                          value={newDuration}
                          onChange={(e) => setNewDuration(parseInt(e.target.value) || 3)}
                          className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 outline-hidden font-mono"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest block">Preferred Date</label>
                        <input
                          type="date"
                          required
                          value={newDate}
                          onChange={(e) => setNewDate(e.target.value)}
                          className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 outline-hidden"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest block">Preferred Kickoff Time</label>
                        <input
                          type="time"
                          required
                          value={newTime}
                          onChange={(e) => setNewTime(e.target.value)}
                          className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest block">Special Instructions (Optional)</label>
                      <textarea
                        rows={2}
                        placeholder="Specify household priorities, key directions..."
                        value={newInstructions}
                        onChange={(e) => setNewInstructions(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 outline-hidden"
                      />
                    </div>

                    <div className="space-y-1.5 col-span-2">
                      <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest block">Initial Order Status</label>
                      <div className="grid grid-cols-4 gap-2">
                        {(['Pending', 'Confirmed', 'InProgress', 'Completed'] as const).map(st => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => setNewInitialStatus(st)}
                            className={`px-3 py-2 text-xs font-bold rounded-xl border transition ${
                              newInitialStatus === st 
                                ? 'bg-gray-900 border-gray-900 text-white shadow-xs' 
                                : 'bg-white border-gray-200 text-gray-650 hover:bg-gray-50'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* LIVE CALCULATION COST */}
                    <div className="flex items-center justify-between border-t border-gray-100 pt-5 mt-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Total Calculated Cost</span>
                        <div className="flex items-baseline space-x-0.5">
                          <IndianRupee className="h-4.5 w-4.5 text-teal-600 self-center" />
                          <span className="text-2xl font-black font-mono text-teal-600">
                            {((SERVICES.find(s => s.id === newServiceType)?.pricePerHour || 22) * newDuration).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <button
                          type="button"
                          onClick={() => setShowAddForm(false)}
                          className="px-5 py-3 rounded-xl border border-gray-250 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer transition"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={addLoading}
                          className="flex items-center space-x-2 rounded-xl bg-teal-600 hover:bg-teal-700 px-6 py-3 text-xs font-extrabold text-white shadow-xs cursor-pointer transition"
                        >
                          {addLoading ? (
                            <>
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              <span>Saving...</span>
                            </>
                          ) : (
                            <>
                              <Check className="h-3.5 w-3.5" />
                              <span>Submit Booking</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* EDIT BOOKING MODAL */}
          <AnimatePresence>
            {editingBooking && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
              >
                <motion.div 
                  initial={{ scale: 0.95, y: 15 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.95, y: 15 }}
                  className="bg-white rounded-3xl border border-gray-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-extrabold uppercase text-amber-600 tracking-widest block">ADMIN EDIT UTILITY</span>
                      <h3 className="font-display text-xl font-bold text-gray-950">Modify Existing Booking</h3>
                    </div>
                    <button 
                      onClick={() => setEditingBooking(null)}
                      className="p-1 px-2.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 font-bold text-sm transition"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {editError && (
                    <div className="rounded-xl border border-rose-100 bg-rose-50/60 p-4 text-xs text-rose-700 font-medium leading-relaxed flex items-start space-x-2.5">
                      <AlertCircle className="h-4.5 w-4.5 text-rose-600 shrink-0 mt-0.5" />
                      <span>{editError}</span>
                    </div>
                  )}

                  <form onSubmit={handleSaveEdit} className="space-y-5">
                    
                    <div className="bg-slate-50 rounded-2xl p-4.5 border border-gray-150 space-y-4">
                      <h4 className="text-xs font-black uppercase text-gray-500 tracking-wider">1. Registered Customer Info</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest block">Customer Name</label>
                          <input
                            type="text"
                            required
                            value={editCustName}
                            onChange={(e) => setEditCustName(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 outline-hidden"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest block">Phone Number</label>
                          <input
                            type="tel"
                            required
                            value={editPhone}
                            onChange={(e) => setEditPhone(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 outline-hidden"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest block font-sans">Email Address</label>
                        <input
                          type="email"
                          required
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 outline-hidden"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest block">Home Core Address</label>
                        <input
                          type="text"
                          required
                          value={editAddress}
                          onChange={(e) => setEditAddress(e.target.value)}
                          className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest block">Service Type</label>
                        <select
                          value={editServiceType}
                          onChange={(e) => setEditServiceType(e.target.value)}
                          className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-teal-5ff/10 focus:border-teal-500 outline-hidden cursor-pointer"
                        >
                          {SERVICES.map(s => (
                            <option key={s.id} value={s.id}>
                              {s.title} (₹{s.pricePerHour}/hr)
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest block">Duration (Hours)</label>
                        <input
                          type="number"
                          min="1"
                          max="12"
                          required
                          value={editDuration}
                          onChange={(e) => setEditDuration(parseInt(e.target.value) || 3)}
                          className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 outline-hidden font-mono"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest block">Date Plan</label>
                        <input
                          type="date"
                          required
                          value={editDate}
                          onChange={(e) => setEditDate(e.target.value)}
                          className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 outline-hidden"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest block">Trigger Kickoff Time</label>
                        <input
                          type="time"
                          required
                          value={editTime}
                          onChange={(e) => setEditTime(e.target.value)}
                          className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest block">Special Instructions</label>
                      <textarea
                        rows={2}
                        value={editInstructions}
                        onChange={(e) => setEditInstructions(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 outline-hidden"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest block font-sans">Active Status</label>
                      <div className="grid grid-cols-4 gap-2">
                        {(['Pending', 'Confirmed', 'InProgress', 'Completed'] as const).map(st => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => setEditStatus(st)}
                            className={`px-3 py-2 text-xs font-bold rounded-xl border transition ${
                              editStatus === st 
                                ? 'bg-amber-600 border-amber-600 text-white shadow-xs' 
                                : 'bg-white border-gray-200 text-gray-650 hover:bg-gray-50'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-100 pt-5 mt-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Recalculated Cost</span>
                        <div className="flex items-baseline space-x-0.5">
                          <IndianRupee className="h-4.5 w-4.5 text-amber-600 self-center" />
                          <span className="text-2xl font-black font-mono text-amber-605">
                            {((SERVICES.find(s => s.id === editServiceType)?.pricePerHour || 22) * editDuration).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <button
                          type="button"
                          onClick={() => setEditingBooking(null)}
                          className="px-5 py-3 rounded-xl border border-gray-250 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer transition"
                        >
                          Discard
                        </button>
                        <button
                          type="submit"
                          disabled={editLoading}
                          className="flex items-center space-x-2 rounded-xl bg-amber-600 hover:bg-amber-700 px-6 py-3 text-xs font-extrabold text-white shadow-xs cursor-pointer transition"
                        >
                          {editLoading ? (
                            <>
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              <span>Saving...</span>
                            </>
                          ) : (
                            <>
                              <Check className="h-3.5 w-3.5" />
                              <span>Apply Changes</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Core Table Control & Filter Section */}
          <div className="bg-white rounded-3xl border border-gray-150 p-6 shadow-xs space-y-6">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              {/* Search input field */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Query customer name, code, email, location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white pl-10 px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 outline-hidden"
                />
              </div>

              {/* Advanced Filters */}
              <div className="flex flex-wrap items-center gap-3.5">
                
                {/* Status Selector */}
                <div className="flex items-center space-x-2">
                  <Filter className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold bg-white text-gray-700 outline-hidden cursor-pointer"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="inprogress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                {/* Sort selector */}
                <div className="flex items-center space-x-2">
                  <ChevronsUpDown className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold bg-white text-gray-700 outline-hidden cursor-pointer"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="value-high">Highest Amount</option>
                    <option value="value-low">Lowest Amount</option>
                  </select>
                </div>

              </div>
            </div>

            {/* ERROR INDICATOR */}
            {loadError && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-5 font-sans text-rose-950 space-y-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-bold text-rose-900 text-sm">Firestore Request Blocked (Permission Denied / Connection Failure)</h4>
                    <p className="text-xs text-rose-800 leading-relaxed">
                      Database return: <code className="bg-rose-100 px-1.5 py-0.5 rounded font-mono text-rose-900 font-bold">{loadError}</code>
                    </p>
                  </div>
                </div>

                <div className="bg-white/80 border border-rose-150/50 rounded-xl p-4 space-y-3">
                  <p className="text-xs text-rose-900 font-semibold">How to resolve this on your Firebase Console:</p>
                  <ol className="list-decimal pl-4 text-[11px] space-y-2 text-rose-800 leading-relaxed">
                    <li>
                      Visit the <a href="https://console.firebase.google.com/project/home-maid-9b643/firestore/rules" target="_blank" rel="noreferrer" className="underline font-bold text-rose-900 hover:text-rose-950">Cloud Firestore Rules Console</a>.
                    </li>
                    <li>
                      Ensure that both admin emails and your email <code className="bg-slate-100 px-1 py-0.5 rounded text-rose-900 font-mono">aarshpatel175@gmail.com</code> have read & write privileges. You can replace your Firestore Rules with:
                      <pre className="mt-2 text-[10px] font-mono leading-relaxed bg-slate-900 text-slate-100 rounded-lg p-2.5 overflow-x-auto select-all border border-slate-800">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() { return request.auth != null; }
    function isAdmin() {
      return isSignedIn() && (request.auth.token.email == 'admin@gmail.com' || request.auth.token.email == 'admin.homemaid@gmail.com' || request.auth.token.email == 'aarshpatel175@gmail.com');
    }
    match /users/{userId} {
      allow read, write: if isSignedIn() && (request.auth.uid == userId || isAdmin());
    }
    match /bookings/{bookingId} {
      allow read, create, delete: if isSignedIn();
      allow update: if isAdmin();
    }
  }
}`}
                      </pre>
                    </li>
                  </ol>
                  
                  <div className="border-t border-rose-100/60 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-bold text-rose-900">⚡ Fast-Track Sandbox Bypass:</p>
                      <p className="text-[10px] text-rose-700">Don't want to configure Firebase right now? Enable the Local Database Sandbox instead.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleLocalBackup(true)}
                      className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition self-start sm:self-center shadow-xs cursor-pointer"
                    >
                      Enable Local Database (Sandbox Mode)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SANDBOX BACKUP MODE NOTIFY */}
            {useLocalBackup && (
              <div className="rounded-xl border border-teal-200 bg-teal-50/60 p-4 text-xs text-teal-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start space-x-2.5">
                  <div className="h-5 w-5 bg-teal-100 text-teal-850 rounded-lg flex items-center justify-center font-bold font-mono shrink-0">ⓘ</div>
                  <div>
                    <strong className="text-teal-950 font-bold">Currently Running in Sandbox Mode (Local Storage)</strong>
                    <p className="text-[11px] text-teal-850 leading-relaxed">Your reservations are saved securely in your browser's local sandbox storage. Perfect for demonstration!</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleLocalBackup(false)}
                  className="text-xs font-bold text-teal-800 hover:text-teal-950 underline shrink-0 transition cursor-pointer"
                >
                  Switch back to Live Firestore
                </button>
              </div>
            )}

            {/* DATABASE ENTRIES */}
            {bookingsLoading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-3">
                <Loader2 className="h-9 w-9 text-teal-600 animate-spin" />
                <p className="text-xs text-gray-400 font-medium">Downloading live reservation registers...</p>
              </div>
            ) : sortedAndFilteredBookings.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center space-y-3">
                <ClipboardList className="h-10 w-10 text-gray-300" />
                <div>
                  <h4 className="font-bold text-gray-700 text-sm">No reservations found</h4>
                  <p className="text-xs text-gray-400 max-w-sm mt-1 leading-relaxed">
                    Zero items matched your criteria or search keywords. Try adjusting filters or click "Add New Booking" to initiate one.
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-slate-50/40">
                <table className="w-full text-left border-collapse text-xs">
                  
                  <thead>
                    <tr className="bg-slate-100 border-b border-gray-200 text-gray-500 uppercase tracking-widest font-extrabold text-[10px]">
                      <th className="p-4">Booking Code</th>
                      <th className="p-4">Customer Info</th>
                      <th className="p-4">Service Category</th>
                      <th className="p-4">Schedule</th>
                      <th className="p-4">Calculated Cost</th>
                      <th className="p-4 text-center">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-150">
                    {sortedAndFilteredBookings.map((b) => {
                      const sObj = SERVICES.find((s) => s.id === b.serviceType);
                      
                      // Status colors
                      let statusBadge = "";
                      switch (b.status) {
                        case "Pending":
                          statusBadge = "bg-amber-50 text-amber-700 border-amber-200";
                          break;
                        case "Confirmed":
                          statusBadge = "bg-teal-50 text-teal-700 border-teal-200";
                          break;
                        case "InProgress":
                          statusBadge = "bg-blue-50 text-blue-700 border-blue-250";
                          break;
                        case "Completed":
                          statusBadge = "bg-emerald-50 text-emerald-700 border-emerald-250";
                          break;
                        default:
                          statusBadge = "bg-gray-50 text-gray-700 border-gray-200";
                      }

                      return (
                        <tr key={b.id} className="hover:bg-teal-50/10 transition">
                          
                          {/* Code */}
                          <td className="p-4 whitespace-nowrap">
                            <span className="font-mono font-bold text-gray-800 bg-white border border-gray-200 px-2.5 py-1.5 rounded-lg shadow-2xs">
                              {b.bookingCode}
                            </span>
                            <div className="text-[9px] text-gray-400 mt-2">
                              {b.createdAt ? new Date(b.createdAt).toLocaleDateString('en-IN') : 'Custom Creator'}
                            </div>
                          </td>

                          {/* Customer */}
                          <td className="p-4">
                            <div className="font-bold text-gray-900 text-sm leading-normal">{b.customerName}</div>
                            <div className="space-y-1.5 mt-2 font-medium text-gray-500 text-[10px]">
                              <div className="flex items-center space-x-1.5">
                                <Mail className="h-3 w-3 text-gray-400 shrink-0" />
                                <span>{b.email}</span>
                              </div>
                              <div className="flex items-center space-x-1.5">
                                <Phone className="h-3 w-3 text-gray-400 shrink-0" />
                                <span>{b.phone}</span>
                              </div>
                              <div className="flex items-start space-x-1.5 line-clamp-1">
                                <MapPin className="h-3 w-3 text-gray-400 shrink-0 mt-0.5" />
                                <span>{b.address}</span>
                              </div>
                            </div>
                          </td>

                          {/* Service type */}
                          <td className="p-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <span className="text-base">{sObj?.id === 'house-cleaning' ? '✨' : sObj?.id === 'deep-cleaning' ? '🧼' : sObj?.id === 'child-care' ? '👶' : '💼'}</span>
                              <div>
                                <div className="font-bold text-gray-800">{sObj ? sObj.title : b.serviceType}</div>
                                <div className="text-[10px] text-gray-400 font-mono mt-0.5">₹{sObj?.pricePerHour || 22}/hr base</div>
                              </div>
                            </div>
                          </td>

                          {/* Schedule */}
                          <td className="p-4 whitespace-nowrap">
                            <div className="space-y-1 font-semibold text-gray-800">
                              <div className="flex items-center space-x-1.5">
                                <Calendar className="h-3 w-3 text-teal-600 shrink-0" />
                                <span>{formatDate(b.preferredDate)}</span>
                              </div>
                              <div className="flex items-center space-x-1.5 text-gray-400 text-[10px]">
                                <Clock className="h-3 w-3 shrink-0" />
                                <span>{b.preferredTime} ({b.duration} hrs Requested)</span>
                              </div>
                            </div>
                            {b.specialInstructions && (
                              <div className="text-[10px] italic text-gray-450 mt-1.5 max-w-xs truncate" title={b.specialInstructions}>
                                "{b.specialInstructions}"
                              </div>
                            )}
                          </td>

                          {/* Cost */}
                          <td className="p-4 whitespace-nowrap">
                            <div className="flex items-center space-x-0.5 font-bold">
                              <IndianRupee className="h-3 w-3 text-teal-650" />
                              <span className="font-mono text-sm text-teal-650">{(b.totalAmount || 0).toFixed(2)}</span>
                            </div>
                          </td>

                          {/* Status and status changer */}
                          <td className="p-4 whitespace-nowrap text-center">
                            <div className="flex flex-col items-center space-y-1.5">
                              <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusBadge}`}>
                                {b.status}
                              </span>
                              
                              <select
                                value={b.status}
                                onChange={(e) => handleUpdateStatus(b.id, e.target.value as any)}
                                className="rounded-md border border-gray-200 text-[10px] font-bold bg-white text-gray-650 p-1 cursor-pointer outline-hidden focus:ring-1 focus:ring-teal-500/10"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="InProgress">In Progress</option>
                                <option value="Completed">Completed</option>
                              </select>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="p-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end space-x-1.5">
                              <button
                                onClick={() => startEditBooking(b)}
                                className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                                title="Edit elements of booking"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteBooking(b.id)}
                                className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                title="Delete/Cancel completely"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>

                </table>
              </div>
            )}

            {/* Total count footer log */}
            <div className="flex justify-between items-center text-[10px] text-gray-400 font-medium">
              <span>Home-Maid Control Desk System v1.2</span>
              <span>Showing {sortedAndFilteredBookings.length} of {bookings.length} reservations</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
