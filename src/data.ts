import { Service, Testimonial, BranchLocation } from './types';

export const SERVICES: Service[] = [
  {
    id: 'house-cleaning',
    title: 'House Cleaning',
    iconName: 'Sparkles',
    shortDesc: 'Complete dusting, vacuuming, and general tidying up of living areas.',
    fullDesc: 'Keep your home in pristine condition with our standard house cleaning services. Our trained helpers will meticulously sweep, vacuum, dust, and tidy up your living rooms, bedrooms, and general spaces, leaving behind a fresh and comforting home environment.',
    pricePerHour: 180,
    popular: true,
    features: [
      'Dusting all accessible surfaces and ornaments',
      'Vacuuming carpets, rugs, and mopping floors',
      'Emptying trash bins & replacing liners',
      'Tidying and organizing general clutter'
    ]
  },
  {
    id: 'deep-cleaning',
    title: 'Deep Cleaning',
    iconName: 'Layers',
    shortDesc: 'Intense scrubbing of hard-to-reach surfaces, groutlines, and baseboards.',
    fullDesc: 'A comprehensive bottom-to-top sanitization designed to eliminate accumulated dust, dirt, and stubborn grime. We focus on baseboards, light fixtures, under furniture, window tracks, and other often-overlooked areas to restore absolute brilliance.',
    pricePerHour: 350,
    popular: true,
    features: [
      'Scrubbing baseboards, air vents, and door frames',
      'Wiping down interiors of ovens and microwaves',
      'Detailed grout cleaning and hard water removal',
      'Behind and under appliance cleaning'
    ]
  },
  {
    id: 'cooking-services',
    title: 'Cooking Services',
    iconName: 'ChefHat',
    shortDesc: 'Delicious, home-cooked family meals tailored to your dietary preferences.',
    fullDesc: 'Enjoy healthy, clean, and nutritious home-cooked meals without taking a step in the kitchen. Our culinary assistants specialize in preparation, light cooking, and food organization based strictly on your personal diet, allergies, or recipes.',
    pricePerHour: 220,
    features: [
      'Meal prep, ingredient washing, and chopping',
      'Cooking balanced, nutrition-focused family meals',
      'Dietary alignment (Keto, Vegan, Low-sodium, etc.)',
      'Post-cooking kitchen clean-up and container storage'
    ]
  },
  {
    id: 'lavatory-cleaning',
    title: 'Lavatory & Bathroom Cleaning',
    iconName: 'Bath',
    shortDesc: 'Disinfecting toilets, showers, mirrors, and deep tile sanitization.',
    fullDesc: 'Establish total hygiene, disinfection, and spark in your most private spaces. We thoroughly scrub down showers, bathtubs, sinks, vanity units, mirrors, and toilets to eliminate soap scum, mold, and hard water minerals.',
    pricePerHour: 240,
    features: [
      'Toilet bowl disinfection and exterior sanitizing',
      'Scrubbing wall tiles, bathtubs, and shower cubicles',
      'Streak-free mirror and chrome faucet polishing',
      'Bathroom floor sanitization and hair-trap clearing'
    ]
  },
  {
    id: 'child-care',
    title: 'Child Care assistance',
    iconName: 'Baby',
    shortDesc: 'Tender baby care, playing, and safe supervision of young children.',
    fullDesc: 'Caring for your children requires complete trust and professional qualification. Our trained child care helpers support you by organizing engaging playtime, reading books, bottle-feeding, supervisional support, and keeping kids safe.',
    pricePerHour: 280,
    popular: true,
    features: [
      'Supervised playtime, arts & crafts, and educational support',
      'Preparation of nourishing age-appropriate snacks',
      'Washing feeding bottles and organizing play spaces',
      'Safe accompaniment to neighborhood play parks'
    ]
  },
  {
    id: 'elder-care',
    title: 'Adult & Elder Care',
    iconName: 'HeartHandshake',
    shortDesc: 'Compassionate assistance for seniors, companionship, and support.',
    fullDesc: 'We provide specialized and empathetic elder care helpers who assist with companion care, lightweight physical guidance, medication reminders, preparing warm meals, and aiding with daily tasks for seniors who value their independence.',
    pricePerHour: 300,
    features: [
      'Compassionate conversational companion care',
      'Accurate and dependable medication reminders',
      'Gentle mobility assistance within the household',
      'Escort for light neighborhood walks and appointments'
    ]
  },
  {
    id: 'laundry-services',
    title: 'Laundry Services',
    iconName: 'Shirt',
    shortDesc: 'Machine washing, clothes sorting, drying, and neat closet folding.',
    fullDesc: 'Get back hours of your weekly schedule. Our domestic helpers will sort your fabrics, run washing cycles with tailored heat preferences, dry clothes carefully, steam or iron out wrinkles, and neatly fold your shirts, linens, and treasures.',
    pricePerHour: 150,
    features: [
      'Sorting darks, whites, delicates, and bedding',
      'Tailored fabric softener and detergent management',
      'Gentle tumble drying or natural hang drying',
      'Crisp ironing and neat drawer-ready folding'
    ]
  },
  {
    id: 'dish-washing',
    title: 'Dish Washing & Kitchen Care',
    iconName: 'UtensilsCrossed',
    shortDesc: 'Clearing sinks, hand-scrubbing pots, and loading/unloading dishwashers.',
    fullDesc: 'A tidy kitchen is the heart of a home. We clean sink areas, hand-wash complex pots and delicate glassware, load or unload dishwashers, and sanitize marble countertops and cooking hobs for an inviting, grease-free kitchen space.',
    pricePerHour: 140,
    features: [
      'Deep hand-scraping and washing oily pots & pans',
      'Loading, operating, and unloading the dishwasher',
      'Polishing delicate crystal wine glasses and cutlery',
      'Wiping down backsplashes, stove trim, and sink rims'
    ]
  },
  {
    id: 'floor-mopping',
    title: 'Floor Mopping & Care',
    iconName: 'Brush', // Fallback for Mopping
    shortDesc: 'Specialized deep scrubbing for tile, wood, vinyl, or marble floors.',
    fullDesc: 'Ditch the mop bucket. Our experts provide streak-free sanitizing mopping, selecting precise cleaning solutions safe for hardwood, engineered floors, ceramic marble, or composite vinyl to preserve shine and remove muddy marks.',
    pricePerHour: 150,
    features: [
      'Surface debris debris vacuuming / micro-sweeping',
      'Wood-safe high-end nourish-mopping systems',
      'Deep chemical-free sanitizing steam mopping',
      'Removal of stubborn heel scuff marks and sticky spots'
    ]
  },
  {
    id: 'home-assistance',
    title: 'Home Assistance Helper',
    iconName: 'Wrench',
    shortDesc: 'Handy support for local errands, light chores, and parcel organizing.',
    fullDesc: 'Get assistance for the random, unique chores of a busy household. From collecting packages and organizing messy garage cupboards, to watering indoor flower pots and walking domestic pets, our assistants adapt to your exact schedule.',
    pricePerHour: 160,
    features: [
      'Watering houseplants and checking plant health',
      'Receiving, unboxing, and organizing parcel packages',
      'Decluttering cupboards, spice racks, and clothing closets',
      'Walking active domestic pets and checking food bowls'
    ]
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    author: 'Elena Rostova',
    role: 'Working Mother of Two',
    rating: 5,
    content: "HOME-MAID's child care and laundry helpers have completely transformed our family routine. The maids are exceptionally kind, trained, and prompt. I feel totally secure leaving them with my kids during my calls.",
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
    serviceUsed: 'Child Care & Laundry'
  },
  {
    id: '2',
    author: 'David Harrison',
    role: 'Software Engineer',
    rating: 5,
    content: 'My partner and I work long hours, leaving very little energy for deep cleaning. The Home Cleaning helper visits every Saturday, and the results are consistently stunning. The booking system is very smooth and transparent.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
    serviceUsed: 'Regular House Cleaning'
  },
  {
    id: '3',
    author: 'Martha Vance',
    role: 'Retiree',
    rating: 5,
    content: 'The elder care assistance provided by HOME-MAID has allowed me to continue living in my beloved apartment comfortably. The caregiver is a beautiful soul, helping me with grocery shopping, medication, and cheerful walks.',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80',
    serviceUsed: 'Elder Care & Groceries'
  }
];

export const BRANCH_LOCATIONS: BranchLocation[] = [
  {
    id: 'branch-north',
    name: 'HOME-MAID North Hub',
    address: '742 Evergreens Blvd, Suite A, Northwood, NW 48201',
    lat: 37.785,
    lng: -122.420,
    phone: '+1 (555) 789-3210',
    email: 'north.hub@home-maid.com',
    hours: 'Mon - Sun: 7:00 AM - 10:00 PM'
  },
  {
    id: 'branch-downtown',
    name: 'HOME-MAID Central HQ',
    address: '101 Ocean Breeze Tower, Floor 4, Downtown City, DC 10005',
    lat: 37.774,
    lng: -122.411,
    phone: '+1 (555) 321-7890',
    email: 'downtown@home-maid.com',
    hours: 'Mon - Sun: 6:00 AM - 11:00 PM'
  },
  {
    id: 'branch-south',
    name: 'HOME-MAID South-Metro Clinic',
    address: '39 Pine Grove Road, Gateway District, South City, SC 92104',
    lat: 37.760,
    lng: -122.430,
    phone: '+1 (555) 456-1234',
    email: 'south.care@home-maid.com',
    hours: 'Mon - Sun: 8:00 AM - 9:00 PM'
  }
];
