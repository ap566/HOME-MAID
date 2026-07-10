import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Star, Award, Sparkles, ArrowRight, Clock, Users, HeartHandshake } from 'lucide-react';
import { TESTIMONIALS } from '../data';
import heroImageSrc from '../assets/images/home_maid_hero_1781612033391.jpg';

interface HomeViewProps {
  setActiveTab: (tab: string) => void;
}

export default function HomeView({ setActiveTab }: HomeViewProps) {
  // Let us refer to the generated image accurately!

  const trustBadges = [
    {
      icon: ShieldCheck,
      title: 'Background Verified',
      desc: '100% of our domestic helpers undergo strict multi-layered criminal & reference checks.',
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
    {
      icon: Award,
      title: 'Certified & Trained',
      desc: 'Each maid is trained in modern sanitation, hygiene, child safety, or culinary arts.',
      color: 'bg-teal-50 text-teal-600 border-teal-100',
    },
    {
      icon: HeartHandshake,
      title: '100% Bliss Guarantee',
      desc: 'Not fully satisfied with your helpers? We will coordinate a direct replacement with no fees.',
      color: 'bg-amber-50 text-amber-600 border-amber-100',
    },
  ];

  const statistics = [
    { number: '15,000+', label: 'Delighted Homes Cleaned' },
    { number: '480+', label: 'Certified Helper Staff' },
    { number: '4.9/5', label: 'Customer Trust Rating' },
    { number: '100%', label: 'Vetted & Safe' },
  ];

  return (
    <div id="home-view" className="bg-slate-50/50 font-sans">
      
      {/* Hero Section */}
      <section id="hero-section" className="relative overflow-hidden bg-gradient-to-br from-teal-50/30 via-white to-sky-50/40 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            
            {/* Left Content Column */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center space-x-2 rounded-full bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-800 border border-teal-100 shadow-xs">
                <Sparkles className="h-4 w-4 animate-pulse text-teal-600" />
                <span>Premier Domestic Service Platform</span>
              </div>
              
              <h1 className="font-display text-4.5xl font-black tracking-tight text-gray-900 sm:text-5.5xl leading-[1.12]">
                Your Trusted Partner for <span className="text-teal-600">Home Care</span> Services
              </h1>
              
              <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                Reclaim your weekends and secure absolute peace of mind. We connect busy households with verified, reliable, and professionally trained specialists in home cleaning, elder care, cooking, child supervision, and home chores.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <button
                  id="hero-cta-primary"
                  onClick={() => setActiveTab('booking')}
                  className="flex items-center justify-center space-x-2 rounded-xl bg-teal-600 px-7 py-4 text-base font-bold text-white shadow-lg shadow-teal-600/30 hover:bg-teal-700 hover:shadow-teal-700/40 transition-all cursor-pointer"
                >
                  <span>Book helper instantly</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
                <button
                  id="hero-cta-secondary"
                  onClick={() => setActiveTab('services')}
                  className="flex items-center justify-center space-x-2 rounded-xl bg-white border border-gray-200 px-7 py-4 text-base font-semibold text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm cursor-pointer"
                >
                  <span>Browse 10 Services</span>
                </button>
              </div>

              {/* Fast trust checklist */}
              <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <ShieldCheck className="h-5 w-5 text-teal-600" />
                  <span>Fully insured staff</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock className="h-5 w-5 text-teal-600" />
                  <span>Flexible hourly bookings</span>
                </div>
              </div>
            </motion.div>

            {/* Right Media Column - Displaying the generated hero image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative"
            >
              {/* Outer decorative backgrounds */}
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-teal-500 to-sky-400 opacity-20 blur-xl" />
              <div className="relative aspect-16/9 overflow-hidden rounded-3xl border border-white bg-gray-100 shadow-2xl">
                <img
                  src={heroImageSrc}
                  alt="HOME-MAID Professional Domestic Cleaning and Care"
                  className="h-full w-full object-cover shadow-sm select-none"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              {/* Overlay card for visual richness */}
              <div 
                id="hero-badge-overlay"
                className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-xs flex items-center space-x-3.5 rounded-2xl border border-white/40 bg-white/95 p-4 shadow-xl backdrop-blur-xs"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Active Staff</p>
                  <p className="font-display text-sm font-bold text-gray-900">480+ pre-vetted vetted helpers</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Core Trust Badges Grid */}
      <section id="trust-benefits-section" className="py-16 bg-white border-y border-gray-105">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-3xl font-bold tracking-tight text-gray-900">
              Why Homeowners Trust HOME-MAID
            </h2>
            <p className="mt-2 text-md text-gray-600">
              We uphold the strict guidelines in domestic recruitment, ensuring every specialist crossing your doorway is safe, respectful, and highly competent.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {trustBadges.map((badge, idx) => {
              const Icon = badge.icon;
              return (
                <div 
                  key={idx}
                  id={`trust-badge-${idx}`}
                  className="flex flex-col items-center text-center p-6 rounded-2xl border border-gray-150 bg-slate-50/50 transition-all hover:shadow-md hover:bg-white"
                >
                  <div className={`p-4 rounded-xl border ${badge.color} mb-4 shadow-xs`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-gray-800 mb-2">{badge.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{badge.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Core Services */}
      <section id="featured-services" className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div className="max-w-xl">
              <h2 className="font-display text-3xl font-bold tracking-tight text-gray-900">
                Popular Care Services
              </h2>
              <p className="mt-2 text-md text-gray-600">
                Discover the services chosen daily by busy families to bring structure, freshness, and ease back into their lifestyles.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('services')}
              className="mt-4 md:mt-0 flex items-center space-x-1.5 text-sm font-semibold text-teal-600 hover:text-teal-700 transition self-start cursor-pointer"
            >
              <span>Explore all 10 services</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Pick three popular ones dynamically */}
            {[
              {
                id: 'house-cleaning',
                title: 'Regular House Cleaning',
                price: '₹180/hr',
                icon: '✨',
                desc: 'Thorough dusting, vacuuming, waste management, and neat arranging to preserve daily home radiance.',
              },
              {
                id: 'child-care',
                title: 'Child Care assistance',
                price: '₹280/hr',
                icon: '👶',
                desc: 'Loving supervision, homework backing, nutrition-focused meal prepping, and creative playtime guidance.',
              },
              {
                id: 'deep-cleaning',
                title: 'Detailed Deep Cleaning',
                price: '₹350/hr',
                icon: '🧼',
                desc: 'Precision baseboard scrubbing, stubborn oven grease cleaning, tile descaling, and high-standard disinfection.',
              },
            ].map((f) => (
              <div
                key={f.id}
                id={`featured-card-${f.id}`}
                className="group relative flex flex-col justify-between rounded-2xl border border-gray-150 bg-white p-6 shadow-sm hover:shadow-lg transition-all"
              >
                <div>
                  <div className="text-4xl mb-4 select-none">{f.icon}</div>
                  <h3 className="font-display text-lg font-bold text-gray-900 group-hover:text-teal-600 transition">
                    {f.title}
                  </h3>
                  <div className="text-xs font-semibold text-teal-600 mt-1 mb-3">
                    Starts at {f.price}
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
                    {f.desc}
                  </p>
                </div>
                <div className="border-t border-gray-50 mt-6 pt-4 flex items-center justify-between">
                  <button
                    onClick={() => setActiveTab('booking')}
                    className="text-xs font-bold text-gray-800 hover:text-teal-600 transition cursor-pointer"
                  >
                    Book Helper Now
                  </button>
                  <button
                    onClick={() => setActiveTab('services')}
                    className="text-xs text-gray-400 hover:text-gray-600 transition cursor-pointer"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Numerical Metrics Section */}
      <section id="metrics-section" className="py-12 bg-slate-900 text-white select-none">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-center">
            {statistics.map((stat, idx) => (
              <div key={idx} id={`statistic-${idx}`} className="space-y-1">
                <p className="font-display text-3xl font-black tracking-tight text-teal-400 sm:text-4xl">
                  {stat.number}
                </p>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <section id="testimonials-section" className="py-16 sm:py-20 bg-emerald-50/15 border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-display text-3xl font-bold tracking-tight text-gray-900">
              Heartfelt Praise from Local Families
            </h2>
            <p className="mt-2 text-md text-gray-600">
              Read how our dedicated caretakers and cleaning ladies bring comfort, organization, and relief to beautiful homes everyday.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                id={`testimonial-card-${t.id}`}
                className="flex flex-col justify-between rounded-3xl bg-white p-7 border border-gray-100 shadow-xs hover:shadow-md transition-all relative"
              >
                <div>
                  {/* Rating Stars */}
                  <div className="flex space-x-1.5 mb-4 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="h-4.5 w-4.5 fill-amber-400" />
                    ))}
                  </div>

                  <p className="text-sm text-gray-600 italic leading-relaxed mb-6 font-medium">
                    "{t.content}"
                  </p>
                </div>

                <div className="border-t border-gray-100 pt-4 mt-auto flex items-center space-x-3.5">
                  <img
                    src={t.avatarUrl}
                    alt={t.author}
                    className="h-10 w-10 rounded-full object-cover border border-gray-100 shadow-inner"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="font-display text-sm font-bold text-gray-900 leading-none">{t.author}</h4>
                    <p className="text-xs text-gray-400 mt-1">{t.role}</p>
                    <span className="inline-block mt-2 rounded bg-teal-50 text-[10px] font-bold text-teal-700 px-1.5 py-0.5">
                      Used {t.serviceUsed}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Conversion Banner */}
      <section id="cta-conversion-banner" className="py-16 bg-gradient-to-tr from-teal-600 to-teal-800 text-white text-center sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4.5xl leading-tight">
            Ready to Experience the Perfect Clean Home?
          </h2>
          <p className="text-lg text-teal-100 leading-relaxed max-w-2xl mx-auto">
            Book certified helpers for chores, laundry, food prep or caregiver support within 2 minutes. Transparent hourly pricing, cancel or adjust anytime.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setActiveTab('booking')}
              className="w-full sm:w-auto rounded-xl bg-white px-8 py-4 text-base font-bold text-teal-800 shadow-lg hover:bg-gray-50 transition cursor-pointer"
            >
              Book Service Now
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className="w-full sm:w-auto rounded-xl border border-teal-400/80 px-8 py-4 text-base font-semibold text-white hover:bg-teal-500/30 transition cursor-pointer"
            >
              Contact Support Phone
            </button>
          </div>
        </div>
      </section>
      
    </div>
  );
}
