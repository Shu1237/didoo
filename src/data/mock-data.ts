
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
  price: string;
  lat: number;
  lng: number;
  status: string;
  category: string;
  organizer: {
    name: string;
    avatar: string;
  };
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Music', icon: '🎵', color: 'bg-purple-100 text-purple-600' },
  { id: '2', name: 'Art', icon: '🎨', color: 'bg-pink-100 text-pink-600' },
  { id: '3', name: 'Sports', icon: '⚽', color: 'bg-blue-100 text-blue-600' },
  { id: '4', name: 'Food', icon: '🍔', color: 'bg-orange-100 text-orange-600' },
  { id: '5', name: 'Tech', icon: '💻', color: 'bg-cyan-100 text-cyan-600' },
  { id: '6', name: 'Education', icon: '📚', color: 'bg-green-100 text-green-600' },
];

export const EVENTS: Event[] = [
  {
    id: '1',
    title: 'Neon Nights Music Festival',
    description: 'Experience the most vibrant electronic music festival of the year with top DJs from around the world.',
    date: '2024-08-15T20:00:00',
    location: 'Cyber City Arena',
    status: 'pending',
    lat: 10.842916,
    lng: 106.708161,
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
    lat: 10.870000, // +3km
    lng: 106.708161,
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
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop',
    status: 'draft',
    price: '$120',
    category: 'Tech',
    lat: 10.897000, // +6km
    lng: 106.708161,
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
    image: '/event1.jpg',
    price: '$10',
    category: 'Food',
    lat: 10.897000,
    lng: 106.735500, // +3km east
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
    lat: 10.870000,
    lng: 106.735500,
    image: '/event2.jpg',
    price: '$25',
    category: 'Sports',
    organizer: {
      name: 'Runners Club',
      avatar: 'https://i.pravatar.cc/150?u=5',
    },
  },
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
