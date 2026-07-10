import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, Phone, MapPin, Sparkles, LogIn, UserPlus, AlertCircle, Loader2 } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

interface AuthViewProps {
  onSuccess?: () => void;
  titleText?: string;
  subTitleText?: string;
}

export default function AuthView({ onSuccess, titleText = "Identify Yourself", subTitleText = "Please log in or sign up below to continue with booking your home care helper." }: AuthViewProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        // Sign Up Flow
        if (!name.trim()) throw new Error('Please enter your full name.');
        if (!phone.trim()) throw new Error('Please enter your phone number.');
        if (!address.trim()) throw new Error('Please enter your home address.');

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save Custom User Attributes to Firestore
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          address: address.trim(),
          createdAt: new Date().toISOString()
        });

      } else {
        // Sign In Flow
        await signInWithEmailAndPassword(auth, email, password);
      }

      // Trigger OnSuccess handler if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.warn("Authentication notification:", err);
      const msg = err.message || '';
      // Map Firebase Errors to readable text
      if (err.code === 'auth/email-already-in-use') {
        setErrorMessage('This email is already registered. Please sign in instead.');
      } else if (err.code === 'auth/invalid-credential') {
        setErrorMessage('Invalid email or password combination. Please try again.');
      } else if (err.code === 'auth/weak-password' || msg.includes('weak-password') || msg.includes('at least 6 characters')) {
        setErrorMessage('Password must be at least 6 characters long.');
      } else if (msg.includes('permission') || msg.includes('Permission') || err.code === 'permission-denied') {
        setErrorMessage("Firestore Permission Denied. Your personal Firebase security rules are currently restricting access. In your Firebase Console for the project 'home-maid-9b643', navigate to Cloud Firestore -> 'Rules' and deploy the rules defined in the project's 'firestore.rules' file to allow authenticated users to read/write profiles and bookings.");
      } else {
        setErrorMessage(err.message || 'An error occurred during authentication.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="auth-panel-wrapper" className="mx-auto max-w-md w-full bg-white rounded-3xl border border-gray-150 p-6 sm:p-8 shadow-md font-sans">
      <div className="text-center space-y-2.5 mb-6">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600 border border-teal-100">
          <Sparkles className="h-5.5 w-5.5 animate-pulse" />
        </div>
        <h3 id="auth-title" className="font-display text-xl font-bold text-gray-950 sm:text-2xl">
          {isSignUp ? "Create Care Account" : titleText}
        </h3>
        <p id="auth-subtitle" className="text-xs text-gray-400 leading-relaxed">
          {isSignUp ? "Register a free account to manage your maid schedules, customized chores, and securely coordinate helper visits." : subTitleText}
        </p>
      </div>

      {/* Success/Error Alert banner */}
      <AnimatePresence mode="wait">
        {errorMessage && (
          <motion.div
            key="error-banner"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-5 rounded-xl border border-rose-100 bg-rose-50/60 p-3.5 text-xs text-rose-700 flex items-start space-x-2.5"
          >
            <AlertCircle className="h-4.5 w-4.5 text-rose-600 shrink-0 mt-0.5" />
            <span className="font-medium leading-relaxed">{errorMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Area */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Sign-Up Only Fields */}
        <AnimatePresence mode="popLayout">
          {isSignUp && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-4 overflow-hidden"
            >
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-750 uppercase tracking-wide">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 h-4.5 w-4.5 text-gray-400" />
                  <input
                    id="signup-name"
                    type="text"
                    required={isSignUp}
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white pl-10.5 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-hidden"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-750 uppercase tracking-wide">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 h-4.5 w-4.5 text-gray-400" />
                  <input
                    id="signup-phone"
                    type="tel"
                    required={isSignUp}
                    placeholder="+1 (555) 789-3210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white pl-10.5 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-hidden"
                  />
                </div>
              </div>

              {/* Default Delivery Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-750 uppercase tracking-wide">Default Home Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3 h-4.5 w-4.5 text-gray-400" />
                  <input
                    id="signup-address"
                    type="text"
                    required={isSignUp}
                    placeholder="Suite 3B, Downtown Tower, DC 10005"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white pl-10.5 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-hidden"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Core Credentials Fields */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-750 uppercase tracking-wide">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3 h-4.5 w-4.5 text-gray-400" />
            <input
              id="auth-email"
              type="email"
              required
              placeholder="care.customer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white pl-10.5 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-hidden"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-750 uppercase tracking-wide">Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3 h-4.5 w-4.5 text-gray-400" />
            <input
              id="auth-password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white pl-10.5 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-hidden"
            />
          </div>
        </div>

        {/* Submit Operations */}
        <div className="pt-2">
          <button
            id="auth-submit-btn"
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center space-x-2 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 px-5 py-3 text-sm font-bold text-white shadow-xs transition cursor-pointer active:scale-98"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Synchronizing profile...</span>
              </>
            ) : (
              <>
                {isSignUp ? <UserPlus className="h-4.5 w-4.5" /> : <LogIn className="h-4.5 w-4.5" />}
                <span>{isSignUp ? "Complete Free Registration" : "Sign In & Access Bookings"}</span>
              </>
            )}
          </button>
        </div>

      </form>

      {/* Switch Form Trigger */}
      <div className="pt-5 mt-4 border-t border-gray-100 text-center">
        <button
          id="auth-toggle-view"
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp);
            setErrorMessage('');
          }}
          className="text-xs font-semibold text-teal-600 hover:text-teal-700 transition cursor-pointer"
        >
          {isSignUp 
            ? "Already have a care account? Sign In" 
            : "First time booking? Click here to register instantly"}
        </button>
      </div>

    </div>
  );
}
