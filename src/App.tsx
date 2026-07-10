import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import AboutView from './components/AboutView';
import ServicesView from './components/ServicesView';
import BookingView from './components/BookingView';
import ContactView from './components/ContactView';
import AdminPortal from './components/AdminPortal';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { UserProfile } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [preselectedServiceId, setPreselectedServiceId] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState<boolean>(true);

  // Monitor Authentication State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setLoadingProfile(true);
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setProfile(userDocSnap.data() as UserProfile);
          } else {
            setProfile(null);
          }
        } catch (error) {
          console.warn("Profile retrieval notice (Rules may require publishing):", error);
          setProfile(null);
        } finally {
          setLoadingProfile(false);
        }
      } else {
        setProfile(null);
        setLoadingProfile(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Handle Log Out
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setProfile(null);
      setUser(null);
      setActiveTab('home');
    } catch (error) {
      console.error("Error signing out user:", error);
    }
  };

  // Handle service card click on catalogue view redirecting straight to reservation form
  const handleSelectBooking = (serviceId: string) => {
    setPreselectedServiceId(serviceId);
    setActiveTab('booking');
    // Scroll smoothly to the top of the body frame
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Nav redirection helper
  const handleActiveTabChange = (tabId: string) => {
    setActiveTab(tabId);
    // When navigating to booking through other channels, reset pre-condition
    if (tabId !== 'booking') {
      setPreselectedServiceId('');
    }
    window.scrollTo({ top: 0 });
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView setActiveTab={handleActiveTabChange} />;
      case 'about':
        return <AboutView />;
      case 'services':
        return <ServicesView onSelectBooking={handleSelectBooking} />;
      case 'booking':
        return (
          <BookingView 
            preselectedServiceId={preselectedServiceId} 
            user={user}
            profile={profile}
            onBookingSubmitted={() => setPreselectedServiceId('')} 
          />
        );
      case 'contact':
        return <ContactView />;
      case 'admin':
        return <AdminPortal />;
      default:
        return <HomeView setActiveTab={handleActiveTabChange} />;
    }
  };

  return (
    <div id="app-root-frame" className="min-h-screen flex flex-col bg-slate-50 text-gray-900 font-sans antialiased selection:bg-teal-100 selection:text-teal-900">
      
      {/* Brand Header */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={handleActiveTabChange} 
        user={user} 
        profile={profile} 
        onLogout={handleLogout} 
      />

      {/* Main Container with smooth fade transition triggers */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Brand Footer */}
      <Footer setActiveTab={handleActiveTabChange} />

    </div>
  );
}
