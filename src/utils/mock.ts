import { MapIcon, ShieldCheck, Users, Zap } from "lucide-react";
import { Category } from "../types/category";
import { Event } from "../types/event";
import { CategoryStatus, EventStatus, OrganizerStatus } from "./enum";


export const MockImage = [
  {
    id: "1",
    imageUrl: '/event1.jpg',
    title: "G-DRAGON 2025 World Tour",
  },
  {
    id: "2",
    imageUrl: '/event2.jpg',
    title: "G-DRAGON 2024 World Tour"
  },
  {
    id: "3",
    imageUrl: '/event3.jpg',
    title: "G-DRAGON 2023 World Tour"
  },
  {
    id: "4",
    imageUrl: '/event4.jpg',
    title: "G-DRAGON 2022 World Tour"
  }
]






export const CATEGORIES: Category[] = [
  { id: '1', name: 'Art', slug: 'art', status: CategoryStatus.ACTIVE },
  { id: '2', name: 'Tech', slug: 'tech', status: CategoryStatus.ACTIVE },
  { id: '3', name: 'Health', slug: 'health', status: CategoryStatus.ACTIVE },
  { id: '4', name: 'Music', slug: 'music', status: CategoryStatus.ACTIVE },
];

export const EVENTS: Event[] = [
  {
    id: '1',
    name: 'Neon Nights Music Festival',
    slug: 'neon-nights-music-festival',
    description: 'Experience the most vibrant electronic music festival of the year with top DJs from around the world.',
    startTime: '2024-08-15T20:00:00',
    endTime: '2024-08-15T23:00:00',
    status: EventStatus.DRAFT,
    locations: [{ name: 'Cyber City Arena', address: 'Cyber City Arena', latitude: 10.874772, longitude: 106.800659 }],
    thumbnailUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop',
    ageRestriction: 18,
    category: CATEGORIES[3],
    organizer: {
      id: 'org1',
      name: 'Electric Dreams',
      slug: 'electric-dreams',
      email: 'contact@electricdreams.com',
      logoUrl: 'https://i.pravatar.cc/150?u=1',
      isVerified: true,
      status: OrganizerStatus.ACTIVE,
    },
  },
  {
    id: '2',
    name: 'Abstract Art Exhibition',
    slug: 'abstract-art-exhibition',
    description: 'A journey through modern abstract art featuring upcoming local artists.',
    startTime: '2024-08-20T10:00:00',
    endTime: '2024-08-20T18:00:00',
    status: EventStatus.DRAFT,
    locations: [{ name: 'Modern Gallery', address: 'Modern Gallery', latitude: 10.878200, longitude: 106.800500 }],
    thumbnailUrl: 'https://images.unsplash.com/photo-1545989253-02cc26577f88?q=80&w=2070&auto=format&fit=crop',
    ageRestriction: 0,
    category: CATEGORIES[0],
    organizer: {
      id: 'org2',
      name: 'Art Collective',
      slug: 'art-collective',
      email: 'info@artcollective.com',
      logoUrl: 'https://i.pravatar.cc/150?u=2',
      isVerified: true,
      status: OrganizerStatus.ACTIVE,
    },
  },
  {
    id: '3',
    name: 'Tech Startup Summit',
    slug: 'tech-startup-summit',
    description: 'Network with innovators and investors at the biggest tech meetup in the region.',
    startTime: '2024-09-05T09:00:00',
    endTime: '2024-09-05T17:00:00',
    status: EventStatus.DRAFT,
    locations: [{ name: 'Innovation Hub', address: 'Innovation Hub', latitude: 10.871900, longitude: 106.803300 }],
    thumbnailUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop',
    ageRestriction: 16,
    category: CATEGORIES[1],
    organizer: {
      id: 'org3',
      name: 'Tech Ventures',
      slug: 'tech-ventures',
      email: 'hello@techventures.com',
      logoUrl: 'https://i.pravatar.cc/150?u=3',
      isVerified: true,
      status: OrganizerStatus.ACTIVE,
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