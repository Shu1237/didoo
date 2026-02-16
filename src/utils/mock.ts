
import { MapIcon, ShieldCheck, Users, Zap } from "lucide-react";
import { Category } from "../types/category";
import { Event } from "../types/event";


export const MockImage = [
  {
    id: 1,
    imageUrl: '/event1.jpg',
    title: "G-DRAGON 2025 World Tour",
  },
  {
    id: 2,
    imageUrl: '/event2.jpg',
    title: "G-DRAGON 2024 World Tour"
  },
  {
    id: 3,
    imageUrl: '/event3.jpg',
    title: "G-DRAGON 2023 World Tour"
  },
  {
    id: 4,
    imageUrl: '/event4.jpg',
    title: "G-DRAGON 2022 World Tour"
  }
]






export const CATEGORIES: Category[] = [
  { id: 1, name: 'Art' },
  { id: 2, name: 'Tech' },
  { id: 3, name: 'Health' },
  { id: 4, name: 'Music' },
];

export const EVENTS: Event[] = [
  {
    id: '1',
    title: 'Neon Nights Music Festival',
    description: 'Experience the most vibrant electronic music festival of the year with top DJs from around the world.',
    date: '2024-08-15T20:00:00',
    location: 'Cyber City Arena',
    status: 'pending',
    lat: 10.874772,
    lng: 106.800659,
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop',
    price: '$50',
    category: 'Music',
    organizer: {
      name: 'Electric Dreams',
      avatar: 'https://i.pravatar.cc/150?u=1',
    },
  },
  {
    id: '2',
    title: 'Abstract Art Exhibition',
    description: 'A journey through modern abstract art featuring upcoming local artists.',
    date: '2024-08-20T10:00:00',
    location: 'Modern Gallery',
    status: 'pending',
    lat: 10.878200,
    lng: 106.800500,
    image: 'https://images.unsplash.com/photo-1545989253-02cc26577f88?q=80&w=2070&auto=format&fit=crop',
    price: 'Free',
    category: 'Art',
    organizer: {
      name: 'Art Collective',
      avatar: 'https://i.pravatar.cc/150?u=2',
    },
  },
  {
    id: '3',
    title: 'Tech Startup Summit',
    description: 'Network with innovators and investors at the biggest tech meetup in the region.',
    date: '2024-09-05T09:00:00',
    location: 'Innovation Hub',
    status: 'draft',
    lat: 10.871900,
    lng: 106.803300,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop',
    price: '$120',
    category: 'Art',
    organizer: {
      name: 'Tech Ventures',
      avatar: 'https://i.pravatar.cc/150?u=3',
    },
  },
  {
    id: '4',
    title: 'Summer Food Carnival',
    description: 'Taste dishes from over 50 local vendors and enjoy live music.',
    status: 'completed',
    date: '2024-07-30T16:00:00',
    location: 'Central Park',
    lat: 10.879100,
    lng: 106.798300,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop',
    price: '$10',
    category: 'Art',
    organizer: {
      name: 'Foodie Group',
      avatar: 'https://i.pravatar.cc/150?u=4',
    },
  },
  {
    id: '5',
    title: 'Marathon for Charity',
    description: 'Run for a cause! Join us in this annual marathon to support local charities.',
    status: 'completed',
    date: '2024-10-12T06:00:00',
    location: 'City Stadium',
    lat: 10.872300,
    lng: 106.797800,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop',
    price: '$25',
    category: 'Art',
    organizer: {
      name: 'Runners Club',
      avatar: 'https://i.pravatar.cc/150?u=5',
    },
  },
  {
    id: '6',
    title: 'AI & Future Workshop',
    description: 'Learn about the future of AI in this interactive workshop.',
    date: '2024-11-15T14:00:00',
    location: 'Tech Hub',
    status: 'pending',
    lat: 10.875000,
    lng: 106.801000,
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop',
    price: '$80',
    category: 'Tech',
    organizer: {
      name: 'AI Labs',
      avatar: 'https://i.pravatar.cc/150?u=6',
    },
  },
  {
    id: '7',
    title: 'Jazz Night Live',
    description: 'Smooth jazz evening with saxophonist Kenny G tribute.',
    date: '2024-08-18T19:00:00',
    location: 'Blue Note Club',
    status: 'pending',
    lat: 10.876000,
    lng: 106.802000,
    image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?q=80&w=2070&auto=format&fit=crop',
    price: '$45',
    category: 'Music',
    organizer: {
      name: 'Jazz Lovers',
      avatar: 'https://i.pravatar.cc/150?u=7',
    },
  },
  {
    id: '8',
    title: 'Yoga in the Park',
    description: 'Morning yoga session for mindfulness and flexibility.',
    date: '2024-08-24T06:30:00',
    location: 'Green Park',
    status: 'pending',
    lat: 10.879500,
    lng: 106.799000,
    image: 'https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?q=80&w=2070&auto=format&fit=crop',
    price: '$15',
    category: 'Health',
    organizer: {
      name: 'Yoga Peace',
      avatar: 'https://i.pravatar.cc/150?u=8',
    },
  },
  {
    id: '9',
    title: 'Digital Marketing Mastery',
    description: 'Master the art of digital marketing in 2024.',
    date: '2024-09-10T09:00:00',
    location: 'Business Center',
    status: 'pending',
    lat: 10.873000,
    lng: 106.804000,
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop',
    price: '$200',
    category: 'Education',
    organizer: {
      name: 'Growth Hackers',
      avatar: 'https://i.pravatar.cc/150?u=9',
    },
  },
  {
    id: '10',
    title: 'Street Food Festival',
    description: 'Biggest street food gathering in the city.',
    date: '2024-08-25T17:00:00',
    location: 'Downtown Square',
    status: 'pending',
    lat: 10.877000,
    lng: 106.796000,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop',
    price: 'Free entry',
    category: 'Food',
    organizer: {
      name: 'City Events',
      avatar: 'https://i.pravatar.cc/150?u=10',
    },
  },
  {
    id: '11',
    title: 'Coding Bootcamp Open Day',
    description: 'Free introduction to coding and career advice.',
    date: '2024-08-31T10:00:00',
    location: 'Code Academy',
    status: 'pending',
    lat: 10.874000,
    lng: 106.800000,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop',
    price: 'Free',
    category: 'Tech',
    organizer: {
      name: 'Code Academy',
      avatar: 'https://i.pravatar.cc/150?u=11',
    },
  },
  {
    id: '12',
    title: 'Photography Walk',
    description: 'Join us for a guided photography walk through the historic district.',
    date: '2024-09-01T15:00:00',
    location: 'Old Quarter',
    status: 'pending',
    lat: 10.875500,
    lng: 106.802500,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop',
    price: '$20',
    category: 'Art',
    organizer: {
      name: 'Photo Club',
      avatar: 'https://i.pravatar.cc/150?u=12',
    },
  }
];

export const USERS = [
  {
    id: '1',
    name: 'Alice Johnson',
    avatar: 'https://i.pravatar.cc/150?u=alice',
  },
  {
    id: '2',
    name: 'Bob Smith',
    avatar: 'https://i.pravatar.cc/150?u=bob',
  },
];

export const features = [
  {
    icon: MapIcon,
    title: "Smart Discovery",
    description: "Real-time interactive map to find events near you instantly.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    colSpan: "col-span-1 lg:col-span-1",
  },
  {
    icon: Zap,
    title: "Instant Booking",
    description: "Book tickets in seconds with our seamless checkout process.",
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    colSpan: "col-span-1 lg:col-span-1",
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Join thousands of explorers. Share, review, and connect.",
    color: "text-pink-500",
    bg: "bg-pink-500/10",
    colSpan: "col-span-1 lg:col-span-2",
    className: "flex-row items-center gap-6",
  },
  {
    icon: ShieldCheck,
    title: "Verified & Secure",
    description: "100% verified events and secure payment gateways.",
    color: "text-green-500",
    bg: "bg-green-500/10",
    colSpan: "col-span-1 lg:col-span-2",
  }
];