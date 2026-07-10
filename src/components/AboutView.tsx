import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Heart, Award, Sparkles, Building2, UserCheck, Milestone } from 'lucide-react';
import staffImg from '../assets/images/professional_staff_1781612050365.jpg';
import familyImg from '../assets/images/happy_family_1781612069450.jpg';

export default function AboutView() {
  const highlights = [
    {
      icon: UserCheck,
      title: 'Reliable & Trained Helpers',
      desc: 'All domestic helpers undergo extensive in-clinic training modules, covering professional cleaning techniques, sanitation checklists, elderly physical assistance, and customer service.'
    },
    {
      icon: ShieldCheck,
      title: 'Uncompromised Integrity',
      desc: 'We operate with total accountability. All background reports are accessible to clients upon matchmaking, establishing maximum reassurance.'
    },
    {
      icon: Heart,
      title: 'Empathetic Approach',
      desc: 'Caregiving and custom cooking are not just checklists; they require deep human emotional intelligence. We select staff based on warmth, honesty, and empathy.'
    }
  ];

  return (
    <div id="about-us-view" className="bg-slate-50/50 font-sans">
      
      {/* Title Header */}
      <section className="bg-gradient-to-b from-teal-50/40 via-teal-50/10 to-transparent py-14 border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            About <span className="text-teal-600">HOME-MAID</span>
          </h1>
          <p className="text-md text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Pioneering a safer, more reliable standard for household support. We design platforms that connect qualified local domestic care experts directly with beautiful families.
          </p>
        </div>
      </section>

      {/* Core Platform Intro (Reliable Helpers + Professional Staff Image) */}
      <section id="our-story-section" className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            
            {/* Left Column: Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="absolute -inset-2 rounded-2xl bg-teal-500/10 blur-lg" />
              <div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-gray-100 shadow-lg">
                <img
                  src={staffImg}
                  alt="HOME-MAID Certified Domestic Staff Team"
                  className="h-full w-full object-cover select-none"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <div className="absolute top-4 left-4 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow">
                ★ Fully Licensed & Insured
              </div>
            </motion.div>

            {/* Right Column: Platform Intro */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center space-x-1.5 rounded-full bg-teal-50 p-1.5 pr-3 text-xs font-semibold text-teal-800 border border-teal-100">
                <span className="rounded-full bg-teal-600 px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-wider">NEW STANDARD</span>
                <span>The HOME-MAID Promise</span>
              </div>

              <h2 className="font-display text-3xl font-bold tracking-tight text-gray-900 leading-tight">
                Empowering Households with Qualified, Trained Helpers
              </h2>
              
              <p className="text-sm text-gray-600 leading-relaxed">
                Finding dependable household support should not be a gamble. At HOME-MAID, we have spent years designing a modern, digital-first marketplace where domestic specialists are vetted, trained, and matched with families who value high standards.
              </p>
              
              <p className="text-sm text-gray-600 leading-relaxed">
                Whether you need a full-time senior caregiver, a Saturday deep cleaning lady, a reliable laundry support system, or someone to prepare clean keto meals, we guarantee a professional who handles your spaces with safety, respect, and mastery.
              </p>

              <div className="border-t border-gray-100 pt-6 grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-display text-sm font-bold text-gray-950 mb-1">Rigorous Screening</h4>
                  <p className="text-xs text-gray-500">Multilayer criminal, reference, and medical certifications.</p>
                </div>
                <div>
                  <h4 className="font-display text-sm font-bold text-gray-950 mb-1">Ongoing Training</h4>
                  <p className="text-xs text-gray-500">Regular skills assessments and modern care certifications.</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Mission, Vision, Commitment (Bento or Dual Layout with Happy Fam image) */}
      <section id="mission-values-section" className="py-16 sm:py-20 bg-slate-50 border-y border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            
            {/* Text blocks: Mission / Vision / Commitment */}
            <div className="space-y-8 lg:col-span-7">
              <div className="max-w-xl space-y-2">
                <h2 className="font-display text-3xl font-bold tracking-tight text-gray-900">
                  Mission, Vision & Commitment
                </h2>
                <p className="text-sm text-gray-500">
                  Designed step-by-step to uplift household livelihoods and deliver absolute tranquility.
                </p>
              </div>

              {/* Mission Blocks */}
              <div className="space-y-6">
                {/* Mission */}
                <div className="flex items-start space-x-4 p-5 rounded-2xl bg-white border border-gray-200 shadow-xs">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                    <Milestone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-gray-900 mb-1">Our Mission</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      To empower home care specialists with fair income, professional respect, and comprehensive skills training, while offering homeowners a safe, tech-enabled platform to secure dependable domestic service support seamlessly.
                    </p>
                  </div>
                </div>

                {/* Vision */}
                <div className="flex items-start space-x-4 p-5 rounded-2xl bg-white border border-gray-200 shadow-xs">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-gray-900 mb-1">Our Vision</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      To build the world’s most trusted full-stack domestic infrastructure, where modern tech and human empathy converge to reduce household fatigue and raise domestic service safety to global professional benchmarks.
                    </p>
                  </div>
                </div>

                {/* Commitment */}
                <div className="flex items-start space-x-4 p-5 rounded-2xl bg-white border border-gray-200 shadow-xs">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-gray-900 mb-1">Our Customer Satisfaction Commitment</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      If any domestic booking fails to meet your household requirements or strict standards, we commit to coordinating prompt re-cleaning or helper replacement immediately, ensuring continuous care without additional overhead costs.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Happy family Portrait */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-5 relative"
            >
              <div className="absolute -inset-2 rounded-3xl bg-teal-500/10 blur-lg" />
              <div className="relative aspect-4/3 overflow-hidden rounded-3xl border border-white bg-white shadow-xl">
                <img
                  src={familyImg}
                  alt="A happy family living in a clean modern apartment"
                  className="h-full w-full object-cover select-none"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Core Highlights Grid */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-display text-3xl font-bold tracking-tight text-gray-900">
              Upholding Total Peace of Mind
            </h2>
            <p className="mt-2 text-md text-gray-600">
              The metrics that guarantee our domestic platform remains safe, compliant, and exceptional.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {highlights.map((h, i) => {
              const Icon = h.icon;
              return (
                <div
                  key={i}
                  className="flex flex-col p-6 rounded-2xl border border-gray-150 bg-white shadow-inner hover:shadow-md transition-all"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600 mb-4 shadow-xs">
                    <Icon className="h-5 /5" />
                  </div>
                  <h3 className="font-display text-base font-bold text-gray-900 mb-2">{h.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed leading-[1.62]">{h.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}
