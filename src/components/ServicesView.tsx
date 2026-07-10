import React from 'react';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { SERVICES } from '../data';

interface ServicesViewProps {
  onSelectBooking: (serviceId: string) => void;
}

export default function ServicesView({ onSelectBooking }: ServicesViewProps) {
  
  // Custom router helper to associate icon names to Lucide icons dynamically
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Icons.Sparkles className="h-6 w-6 text-teal-600" />;
      case 'Layers':
        return <Icons.Layers className="h-6 w-6 text-teal-600" />;
      case 'ChefHat':
        return <Icons.ChefHat className="h-6 w-6 text-teal-600" />;
      case 'Bath':
        return <Icons.Bath className="h-6 w-6 text-teal-600" />;
      case 'Baby':
        return <Icons.Baby className="h-6 w-6 text-teal-600" />;
      case 'HeartHandshake':
        return <Icons.HeartHandshake className="h-6 w-6 text-teal-600" />;
      case 'Shirt':
        return <Icons.Shirt className="h-6 w-6 text-teal-600" />;
      case 'UtensilsCrossed':
        return <Icons.UtensilsCrossed className="h-6 w-6 text-teal-600" />;
      case 'Brush':
        return <Icons.Brush className="h-6 w-6 text-teal-600" />;
      case 'Wrench':
        return <Icons.Wrench className="h-6 w-6 text-teal-600" />;
      default:
        return <Icons.HelpCircle className="h-6 w-6 text-teal-600" />;
    }
  };

  return (
    <div id="services-view" className="bg-slate-50/50 font-sans">
      
      {/* Page Title */}
      <section className="bg-gradient-to-b from-teal-50/40 via-teal-50/10 to-transparent py-14 border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-widest bg-teal-50/80 px-2.5 py-1 rounded-full border border-teal-100 shadow-3xs">
            10 Tailored Domestic Care Offerings
          </span>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Our Certified <span className="text-teal-600">Home Services</span>
          </h1>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Every service is handled by skilled, vetted domestic specialists. Browse our curated options below and select the perfect helper package for your household.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services-card-grid-container" className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((serv, index) => (
              <motion.div
                key={serv.id}
                id={`service-card-${serv.id}`}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
                className={`relative flex flex-col justify-between rounded-2xl border bg-white p-6.5 shadow-sm transition-all hover:shadow-lg hover:border-teal-100 ${
                  serv.popular ? 'ring-2 ring-teal-500/10 border-teal-100 bg-teal-50/5' : 'border-gray-150'
                }`}
              >
                {/* Popular Ribbon overlay */}
                {serv.popular && (
                  <div className="absolute top-4 right-4 inline-flex items-center space-x-1 rounded-full bg-teal-50 border border-teal-100 px-2.5 py-0.5 text-[10px] font-bold text-teal-700 uppercase tracking-wider">
                    <Icons.Star className="h-3 w-3 fill-teal-500 text-teal-500" />
                    <span>Highly Popular</span>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Icon Frame */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 shadow-3xs border border-teal-100/50">
                    {renderIcon(serv.iconName)}
                  </div>

                  {/* Header Title & Pricing */}
                  <div>
                    <h3 className="font-display text-lg font-bold text-gray-950 transition hover:text-teal-600">
                      {serv.title}
                    </h3>
                    <div className="flex items-baseline space-x-1.5 mt-1.5">
                      <span className="font-mono text-sm font-bold text-teal-600">₹{serv.pricePerHour}</span>
                      <span className="text-gray-400 text-[11px] font-medium uppercase tracking-wider">/ Hour standard</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-gray-500 leading-relaxed leading-[1.62]">
                    {serv.fullDesc}
                  </p>

                  <hr className="border-gray-100 my-1" />

                  {/* Key Features List */}
                  <div className="space-y-2">
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Included Duties:</h5>
                    <ul className="space-y-1.5 text-xs text-gray-600">
                      {serv.features.map((feat, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <Icons.Check className="h-4 w-4 text-teal-500 mt-0.5 shrink-0" />
                          <span className="leading-tight">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Booking Button */}
                <div className="pt-6 border-t border-gray-50 mt-6 md:pt-4">
                  <button
                    onClick={() => onSelectBooking(serv.id)}
                    className="flex w-full items-center justify-center space-x-1.5 rounded-xl bg-teal-600/5 hover:bg-teal-600 hover:text-white px-4 py-2.5 text-xs font-bold text-teal-700 transition"
                  >
                    <span>Book {serv.title}</span>
                    <Icons.ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>

              </motion.div>
            ))}
          </div>

          {/* Quick FAQ info banner */}
          <div className="mt-16 rounded-3xl bg-slate-900 text-slate-100 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2 max-w-2xl">
              <h4 className="font-display text-lg font-bold">Need custom corporate or daily recurrences?</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                We design custom daily schedules, corporate janitorial options, and senior live-in helpers. Feel free to contact our customer concierge at care@home-maid.com for tailor-made long-term discount rates.
              </p>
            </div>
            <button
              onClick={() => onSelectBooking('house-cleaning')}
              className="rounded-xl bg-teal-500 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-teal-600 transition tracking-wide cursor-pointer text-center shrink-0 w-full md:w-auto"
            >
              Get Custom Quote Now
            </button>
          </div>

        </div>
      </section>

    </div>
  );
}
