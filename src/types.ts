export interface Service {
  id: string;
  title: string;
  iconName: string; // Dynamic mapping in Components
  shortDesc: string;
  fullDesc: string;
  pricePerHour: number;
  popular?: boolean;
  features: string[];
}

export interface Booking {
  id: string;
  userId?: string; // Associated logged-in user ID
  customerName: string;
  phone: string;
  email: string;
  address: string;
  serviceType: string;
  preferredDate: string;
  preferredTime: string;
  duration: number; // in hours
  specialInstructions: string;
  bookingCode: string;
  status: 'Pending' | 'Confirmed' | 'InProgress' | 'Completed';
  totalAmount: number;
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  rating: number;
  content: string;
  avatarUrl: string;
  serviceUsed: string;
}

export interface BranchLocation {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  email: string;
  hours: string;
}
