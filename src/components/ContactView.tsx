import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, Mail, MapPin, Send, Facebook, Twitter, Instagram, Linkedin, Search, Compass, Info, CheckCircle2 } from 'lucide-react';
import { BRANCH_LOCATIONS } from '../data';

export default function ContactView() {
  // Contact Form Inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  // Map States
  const [selectedBranchId, setSelectedBranchId] = useState(BRANCH_LOCATIONS[1].id); // Central HQ default
  const [mapSearch, setMapSearch] = useState('');

  // Find currently selected branch object
  const activeBranch = BRANCH_LOCATIONS.find(b => b.id === selectedBranchId) || BRANCH_LOCATIONS[1];

  // Submit Inquiry handling
  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    setTimeout(() => {
      setSending(false);
      setSentSuccess(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');

      // Fade out success banner after some seconds
      setTimeout(() => setSentSuccess(false), 5000);
    }, 1200);
  };

  // Filter branches based on query
  const filteredBranches = BRANCH_LOCATIONS.filter(b => 
    b.name.toLowerCase().includes(mapSearch.toLowerCase()) ||
    b.address.toLowerCase().includes(mapSearch.toLowerCase())
  );

  return (
    <div id="contact-view" className="bg-slate-50/50 font-sans select-none">
      
      {/* Page Title */}
      <section className="bg-gradient-to-b from-teal-50/40 via-teal-50/10 to-transparent py-14 border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-widest bg-teal-50/80 px-2.5 py-1 rounded-full border border-teal-100 shadow-3xs">
            Connect With Our Concierge
          </span>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Contact <span className="text-teal-600">HOME-MAID</span>
          </h1>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Have questions about maid background vetting, pricing structures, or customized care hours? Submit an inquiry below, or track our regional service clinics on our interactive network map.
          </p>
        </div>
      </section>

      {/* Main Form + Info Content Grid */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
            
            {/* Left Column: Direct info nodes & Socials (Content Span: 5) */}
            <div className="space-y-8 lg:col-span-5 bg-slate-50/50 p-6 sm:p-8 rounded-2xl border border-gray-150 shadow-inner">
              <div className="space-y-2">
                <h3 className="font-display text-xl font-bold text-gray-900">Direct Care Channels</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Call our live operators or stop by our Central headquarters downtown during business hours.
                </p>
              </div>

              {/* info links list */}
              <div className="space-y-5">
                {/* Phone */}
                <div className="flex items-start space-x-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600 border border-teal-100">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Call Support</h5>
                    <p className="text-sm font-bold text-gray-900 mt-0.5">+1 (555) HOME-MAID</p>
                    <p className="text-xs text-gray-400">Available Daily: 7 AM - 10 PM EST</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600 border border-teal-100">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Direct Email</h5>
                    <p className="text-sm font-bold text-gray-900 mt-0.5">care@home-maid.com</p>
                    <p className="text-xs text-gray-400">Inbox response inside 2 business hours</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start space-x-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600 border border-teal-100">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Central HQ</h5>
                    <p className="text-xs font-bold text-gray-900 mt-0.5">101 Ocean Breeze Tower, Floor 4,</p>
                    <p className="text-xs text-gray-400 mt-0.5 leading-tight">Downtown City, DC 10005</p>
                  </div>
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Social Connections */}
              <div className="space-y-3">
                <h5 className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Stay Socially Connected</h5>
                <div className="flex space-x-3">
                  {[
                    { id: 'f', icon: Facebook, color: 'hover:bg-blue-600/10 hover:text-blue-600' },
                    { id: 't', icon: Twitter, color: 'hover:bg-sky-600/10 hover:text-sky-605' },
                    { id: 'i', icon: Instagram, color: 'hover:bg-gradient-to-tr hover:from-amber-500/10 hover:to-purple-600/15 hover:text-rose-600' },
                    { id: 'l', icon: Linkedin, color: 'hover:bg-indigo-600/10 hover:text-indigo-606' }
                  ].map((s, idx) => {
                    const Icon = s.icon;
                    return (
                      <a
                        key={idx}
                        href="#"
                        className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-500 transition shadow-3xs ${s.color}`}
                      >
                        <Icon className="h-4.5 w-4.5" />
                      </a>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Right Column: Interactive support inquiry form (Content Span: 7) */}
            <div className="lg:col-span-7">
              <form 
                id="contact-support-form" 
                onSubmit={handleInquirySubmit}
                className="space-y-5 rounded-2xl border border-gray-150 p-6 sm:p-8"
              >
                <div className="space-y-1">
                  <h3 className="font-display text-lg font-bold text-gray-950">Inquiry Message Box</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">Required fields are marked, we response carefully to all messages.</p>
                </div>

                {/* Success alert banner */}
                <AnimatePresence>
                  {sentSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-4.5 text-xs text-emerald-800 font-medium flex items-start space-x-2"
                    >
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                      <div>
                        <p className="font-bold">Inquiry Sent Successfully!</p>
                        <p className="mt-0.5 text-emerald-700 font-normal">Our customer care concierge will review your message and reply via email inside 2 hours.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-750 uppercase tracking-wide">Your Name</label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-3.5 py-3 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-hidden"
                    />
                  </div>

                  {/* Email field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-750 uppercase tracking-wide">Your Email</label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      placeholder="jane@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-3.5 py-3 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-hidden"
                    />
                  </div>
                </div>

                {/* Subject field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-750 uppercase tracking-wide">Subject Option</label>
                  <input
                    id="contact-subject"
                    type="text"
                    required
                    placeholder="Regular Maid Rates, Specialized Elder Care options, etc."
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-3 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-hidden"
                  />
                </div>

                {/* Message text container */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-750 uppercase tracking-wide">Your Message Details</label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    placeholder="Type detail notes here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-hidden"
                  />
                </div>

                {/* Submit element */}
                <div>
                  <button
                    id="contact-submit-button"
                    type="submit"
                    disabled={sending}
                    className="flex w-full items-center justify-center space-x-2 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition active:scale-98 cursor-pointer"
                  >
                    {sending ? (
                      <span>Dispatching message info...</span>
                    ) : (
                      <>
                        <Send className="h-4.5 w-4.5" />
                        <span>Dispatch Support Request</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>

          </div>
        </div>
      </section>

      {/* Styled Interactive SVG Map Section representing Google Map Integration */}
      <section id="google-map-integration-container" className="py-16 sm:py-20 bg-slate-50 border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-3xl font-bold tracking-tight text-gray-900 flex items-center justify-center space-x-2">
              <Compass className="h-7 w-7 text-teal-600 animate-spin-slow" />
              <span>Interactive Service Area Map</span>
            </h2>
            <p className="mt-2 text-md text-gray-600">
              Interactive coverage grid. Click branch nodes on the live vector map below to filter contacts and hours for our nearest domestic dispatch offices.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
            
            {/* Interactive Vector Map Left (Col size: 8) */}
            <div className="lg:col-span-8 overflow-hidden rounded-3xl border border-gray-200 bg-teal-50/15 p-4.5 relative shadow-inner">
              
              {/* Floating Map Helper Search */}
              <div className="absolute top-8 left-8 z-10 w-64 max-w-xs shadow-md">
                <div className="relative">
                  <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                  <input
                    id="branch-search-bar"
                    type="text"
                    placeholder="Search regional branches..."
                    value={mapSearch}
                    onChange={(e) => setMapSearch(e.target.value)}
                    className="w-full bg-white/95 rounded-xl border border-gray-10% py-2 pl-9 pr-4 text-xs focus:ring-1 focus:ring-teal-500 outline-hidden"
                  />
                </div>
              </div>

              {/* Styled Vector SVG Map Representation */}
              <div className="relative aspect-16/10 rounded-2xl bg-white border border-gray-100 flex items-center justify-center overflow-hidden p-2 select-none">
                
                {/* SVG Abstract City Grid Background */}
                <svg className="absolute inset-0 h-full w-full opacity-35" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                  <defs>
                    <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
                    </pattern>
                  </defs>
                  
                  {/* Grid overlay */}
                  <rect width="100%" height="100%" fill="url(#grid-pattern)" />

                  {/* Decorative diagonal road trails */}
                  <path d="M-100,-100 L900,600" stroke="#f1f5f9" strokeWidth="32" fill="none" />
                  <path d="M600,-50 L200,600" stroke="#f1f5f9" strokeWidth="18" fill="none" />
                  <path d="M100,500 L800,200" stroke="#f1f5f9" strokeWidth="24" fill="none" />

                  {/* River line water decoration */}
                  <path d="M-50,320 CQ 200,200 450,380 T 900,290" stroke="#ccfbf1" strokeWidth="48" strokeLinecap="round" fill="none" />
                  <path d="M-50,320 CQ 200,200 450,380 T 900,290" stroke="#99f6e4" strokeWidth="12" strokeLinecap="round" fill="none" fillOpacity="0.1" />
                </svg>

                {/* Coverages Circles */}
                <div className="absolute inset-0 w-full h-full pointer-events-none">
                  {BRANCH_LOCATIONS.map((br) => {
                    // Map generic coords to percentage layouts for absolute visual precision in SVG
                    const pos = 
                      br.id === 'branch-north' ? { top: '30%', left: '38%' } :
                      br.id === 'branch-downtown' ? { top: '55%', left: '50%' } :
                      { top: '72%', left: '62%' };

                    const isSelected = br.id === selectedBranchId;

                    return (
                      <div 
                        key={br.id} 
                        style={{ top: pos.top, left: pos.left }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-auto"
                      >
                        {/* Dynamic radar rings */}
                        <div className={`absolute rounded-full transition-all duration-500 bg-teal-500/10 pointer-events-none ${
                          isSelected ? 'h-32 w-32 animate-ping opacity-20' : 'h-16 w-16 opacity-0'
                        }`} />

                        {/* Interactive Branch pin icon */}
                        <button
                          type="button"
                          onClick={() => setSelectedBranchId(br.id)}
                          className={`flex h-10 w-10 items-center justify-center rounded-full border shadow-md active:scale-90 transition-all ${
                            isSelected 
                              ? 'bg-teal-600 text-white border-teal-700 scale-125 z-20' 
                              : 'bg-white text-teal-600 border-gray-200 hover:border-teal-500 hover:scale-110 z-10'
                          }`}
                        >
                          <MapPin className="h-5 w-5" />
                        </button>

                        {/* Hover Name Tag banner */}
                        <div className={`absolute top-11 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-xs pointer-events-none transition-opacity duration-300 block min-w-[120px] text-center ${
                          isSelected ? 'opacity-100' : 'opacity-0'
                        }`}>
                          {br.name}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Floating compass element */}
                <div className="absolute bottom-6 right-6 flex items-center space-x-2 rounded-lg bg-white/90 px-3 py-1.5 border border-gray-100 text-gray-400 text-[10px] uppercase font-bold tracking-wider shadow">
                  <Compass className="h-4 w-4 animate-spin-slow text-teal-550" />
                  <span>Interactive Map Nodes</span>
                </div>

              </div>
            </div>

            {/* Info details display panel Right (Col Size: 4) */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="rounded-2xl border border-gray-150 bg-white p-6 shadow-sm space-y-5">
                <div className="flex items-center space-x-2 text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-100 w-fit">
                  <Info className="h-4 w-4 text-teal-600" />
                  <span>Selected Node details</span>
                </div>

                <div className="space-y-1">
                  <h4 className="font-display text-lg font-bold text-gray-950">{activeBranch.name}</h4>
                  <p className="text-xs text-gray-500 leading-tight">{activeBranch.address}</p>
                </div>

                <hr className="border-gray-100" />

                <div className="space-y-3.5 text-xs text-gray-600">
                  <div>
                    <h5 className="font-semibold text-[10px] uppercase tracking-wider text-gray-400">Branch Hours:</h5>
                    <p className="font-medium text-gray-800 mt-0.5">{activeBranch.hours}</p>
                  </div>

                  <div>
                    <h5 className="font-semibold text-[10px] uppercase tracking-wider text-gray-400">Dispatch Support phone:</h5>
                    <p className="font-mono font-bold text-gray-800 mt-0.5">{activeBranch.phone}</p>
                  </div>

                  <div>
                    <h5 className="font-semibold text-[10px] uppercase tracking-wider text-gray-400">Hub Email:</h5>
                    <p className="font-bold text-gray-850 mt-0.5">{activeBranch.email}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-50">
                  <p className="text-[10px] text-gray-400 leading-relaxed italic">
                    Coordinates match: {activeBranch.lat.toFixed(4)} N, {activeBranch.lng.toFixed(4)} W. Standard city coverage radiates up to 25km.
                  </p>
                </div>
              </div>

              {/* branch Selector Buttons */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Quick Center Focus:</label>
                <div className="flex flex-col gap-2">
                  {filteredBranches.map((br) => {
                    const isSelected = br.id === selectedBranchId;
                    return (
                      <button
                        key={br.id}
                        onClick={() => setSelectedBranchId(br.id)}
                        className={`flex w-full text-left items-center justify-between rounded-xl p-3 border transition cursor-pointer text-xs ${
                          isSelected 
                            ? 'bg-teal-50 border-teal-500 text-teal-800 font-bold' 
                            : 'bg-white border-gray-150 text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <span>{br.name}</span>
                        <span>➔</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
