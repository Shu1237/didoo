"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  CalendarDays,
  Facebook,
  Globe,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Ticket,
} from "lucide-react";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import TicketCard from "@/components/ui/TicketCard";
import { useGetEvents } from "@/hooks/useEvent";
import { useGetOrganizer } from "@/hooks/useOrganizer";

const FALLBACK_BANNER =
  "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2070&auto=format&fit=crop";
const FALLBACK_LOGO = "https://i.pravatar.cc/240?u=organizer";

export default function OrganizerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { data: organizerResponse, isLoading: isOrganizerLoading } = useGetOrganizer(id);
  const organizer = organizerResponse?.data;

  const { data: eventsResponse, isLoading: isEventsLoading } = useGetEvents({
    organizerId: id,
    pageSize: 12,
    isDescending: true,
  });
  const events = eventsResponse?.data.items || [];

  if (isOrganizerLoading) return <Loading />;

  if (!organizer) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-slate-600">Organizer not found.</p>
          <Button asChild className="mt-4 rounded-full px-6">
            <Link href="/events">Back to events</Link>
          </Button>
        </div>
      </main>
    );
  }

  const socials = [
    { label: "Facebook", icon: Facebook, url: organizer.facebookUrl },
    { label: "Instagram", icon: Instagram, url: organizer.instagramUrl },
    { label: "TikTok", icon: Globe, url: organizer.tiktokUrl },
    { label: "Email", icon: Mail, url: organizer.email ? `mailto:${organizer.email}` : null },
    { label: "Phone", icon: Phone, url: organizer.phone ? `tel:${organizer.phone}` : null },
  ].filter((item) => item.url);

  const createdAtLabel = organizer.createdAt
    ? new Date(organizer.createdAt).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    : "Updating";

  return (
    <main className="relative min-h-screen bg-slate-50 pb-24">
      {/* Immersive Header Banner */}
      <section className="relative w-full h-[350px] md:h-[450px]">
        <Image
          src={organizer.bannerUrl || FALLBACK_BANNER}
          alt={organizer.name}
          fill
          className="object-cover"
          priority
        />
        {/* Soft gradient into the page background */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-900/40 to-slate-900/20" />
      </section>

      {/* Main Content Container lifted up */}
      <div className="relative z-10 w-full px-4 md:px-8 lg:px-12 xl:px-16 mx-auto -mt-32 md:-mt-40 space-y-12 pb-24">
        {/* Profile Card (Glassmorphism) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="rounded-[2.5rem] bg-white/80 backdrop-blur-xl p-6 md:p-10 shadow-2xl shadow-slate-200/50 border border-white/50 w-full"
        >
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start md:items-center justify-between">
            {/* Logo & Name */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative h-32 w-32 md:h-40 md:w-40 shrink-0 overflow-hidden rounded-[2rem] border-4 border-white shadow-xl bg-white"
              >
                <Image
                  src={organizer.logoUrl || FALLBACK_LOGO}
                  alt={organizer.name}
                  fill
                  className="object-cover"
                />
              </motion.div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-none">
                    {organizer.name}
                  </h1>
                  {organizer.isVerified && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-emerald-600 border border-emerald-100">
                      <BadgeCheck className="h-4 w-4" />
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-sm md:text-base font-medium text-slate-500 uppercase tracking-widest">
                  Premier Event Curator
                </p>

                {/* Rapid Info Chips */}
                <div className="flex flex-wrap gap-2 pt-3">
                  {organizer.address && <InfoChip icon={MapPin} value={organizer.address} />}
                  {organizer.email && <InfoChip icon={Mail} value={organizer.email} />}
                  {organizer.phone && <InfoChip icon={Phone} value={organizer.phone} />}
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col w-full md:w-auto gap-3 shrink-0">
              {organizer.websiteUrl && (
                <Button
                  asChild
                  variant="outline"
                  className="h-12 w-full md:w-auto rounded-xl border-slate-200 bg-white/50 hover:bg-white text-slate-700 font-bold uppercase tracking-widest text-xs"
                >
                  <a href={organizer.websiteUrl} target="_blank" rel="noopener noreferrer">
                    <Globe className="h-4 w-4 mr-2" />
                    Website
                  </a>
                </Button>
              )}
              <Button asChild className="h-12 w-full md:w-auto rounded-xl px-8 font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                <Link href="/events">Explore Events</Link>
              </Button>
            </div>
          </div>
        </motion.div>


        {/* Main Content Split */}
        <section className="flex flex-col lg:flex-row gap-12 lg:gap-16 w-full">

          {/* LEFT COLUMN: Info & Stats */}
          <div className="w-full lg:w-[350px] xl:w-[400px] space-y-12 shrink-0">
            {/* Bio */}
            <motion.article
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-sm font-black text-slate-400 tracking-[0.2em] uppercase mb-4">About</h2>
              <p className="text-base leading-relaxed text-slate-700 font-medium">
                {organizer.description ||
                  "Event organizer specializing in cultural, entertainment, and community events with practical, clear, and professional experiences."}
              </p>
            </motion.article>

            {/* Socials */}
            <motion.article
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-sm font-black text-slate-400 tracking-[0.2em] uppercase mb-4">Connect</h3>
              {socials.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {socials.map((social) => (
                    <a
                      key={social.label}
                      href={social.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex h-12 w-12 items-center justify-center rounded-full bg-white border border-slate-100 shadow-sm text-slate-400 transition-all hover:border-primary hover:text-primary hover:shadow-md hover:-translate-y-1"
                      title={social.label}
                    >
                      <social.icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-sm font-medium text-slate-500">No contact information provided.</p>
              )}
            </motion.article>

            {/* Stats */}
            <motion.article
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 gap-4"
            >
              <StatCard
                icon={Ticket}
                label="Events"
                value={events.length.toString()}
                tone="sky"
              />
              <StatCard
                icon={CalendarDays}
                label="Joined"
                value={organizer.createdAt ? new Date(organizer.createdAt).getFullYear().toString() : "2024"}
                tone="amber"
              />
            </motion.article>
          </div>

          {/* RIGHT COLUMN: Events */}
          <div className="w-full flex-1 min-w-0">
            <section className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 md:p-8 lg:p-10 border border-slate-200/50 shadow-sm w-full h-full">
              <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6 w-full">
                <div>
                  <h2 className="text-3xl font-black tracking-tight text-slate-900 leading-none">
                    Hosted Events
                  </h2>
                  <p className="mt-2 text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Explore Portfolio
                  </p>
                </div>
                <span className="rounded-full bg-slate-900 px-5 py-2 text-xs font-bold uppercase tracking-widest text-white shadow-md">
                  {events.length} events
                </span>
              </div>

              {isEventsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 min-[1600px]:grid-cols-5 gap-6 w-full">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                    <div
                      key={item}
                      className="h-[400px] animate-pulse rounded-[2rem] bg-slate-100"
                    />
                  ))}
                </div>
              ) : events.length > 0 ? (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.1 } }
                  }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 min-[1600px]:grid-cols-5 gap-6 w-full"
                >
                  {events.map((event, index) => (
                    <motion.div
                      key={event.id}
                      variants={{
                        hidden: { opacity: 0, y: 30, scale: 0.95 },
                        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } }
                      }}
                      className="h-[400px] lg:h-[450px] w-full"
                    >
                      <Link href={`/events/${event.id}`} className="block relative w-full h-full rounded-[2rem] overflow-hidden group shadow-lg hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500">
                        <Image
                          src={event.thumbnailUrl || event.bannerUrl || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070'}
                          alt={event.name}
                          fill
                          className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Content */}
                        <div className="absolute inset-0 p-6 flex flex-col justify-end">
                          <div className="translate-y-6 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                            <span className="inline-block px-3 py-1 mb-3 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest border border-white/20">
                              {event.category?.name || "Event"}
                            </span>
                            <h3 className="text-xl lg:text-2xl font-black text-white mb-2 leading-[1.1] line-clamp-3">
                              {event.name}
                            </h3>

                            {/* Reveal on hover details */}
                            <div className="flex flex-col gap-2 mt-4 text-slate-300 text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                  <CalendarDays className="w-3 h-3 text-white" />
                                </div>
                                {new Date(event.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                  <MapPin className="w-3 h-3 text-white" />
                                </div>
                                <span className="line-clamp-1">{event.locations?.[0]?.name || "Online / TBA"}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="rounded-[2rem] border border-dashed border-slate-300 bg-slate-50 p-16 text-center shadow-inner">
                  <div className="mx-auto w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center mb-4">
                    <Ticket className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">No events found</h3>
                  <p className="text-slate-500 font-medium">This organizer has not published any events yet.</p>
                </div>
              )}
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

function InfoChip({
  icon: Icon,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-lg bg-slate-100/50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-600 backdrop-blur-sm">
      <Icon className="h-3.5 w-3.5 text-slate-400" />
      <span className="line-clamp-1">{value}</span>
    </span>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone: "sky" | "amber";
}) {
  const toneClasses =
    tone === "sky"
      ? "text-sky-600"
      : "text-amber-600";

  return (
    <div className="rounded-[1.5rem] bg-white border border-slate-100 shadow-sm p-6 flex flex-col items-start gap-4 hover:shadow-md transition-shadow">
      <div className={`p-3 rounded-2xl bg-slate-50 ${toneClasses}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
          {label}
        </p>
        <p className="text-3xl font-black text-slate-900 leading-none">{value}</p>
      </div>
    </div>
  );
}
