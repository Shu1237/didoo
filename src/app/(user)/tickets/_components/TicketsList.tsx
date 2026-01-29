"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Download, MapPin, QrCode } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Mock Data for Design
const MOCK_TICKETS = [
  {
    id: "1",
    title: "Neon Nights Music Festival 2026",
    date: "2026-03-15T19:00:00",
    location: "Saigon Exhibition Center, D7",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop",
    price: "500.000đ",
    status: "upcoming",
    seat: "Zone A, Row 12, Seat 45",
    ticketId: "8934-2394-2342"
  },
  {
    id: "2",
    title: "Tech Summit Vietnam 2026",
    date: "2026-04-10T08:30:00",
    location: "Gem Center, D1",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
    price: "Free",
    status: "upcoming",
    seat: "General Admission",
    ticketId: "1234-5678-9012"
  },
  {
    id: "3",
    title: "Art Gallery Opening: Future Visions",
    date: "2026-02-20T18:00:00",
    location: "The Factory Contemporary Arts Centre",
    image: "https://images.unsplash.com/photo-1544911845-1f34a3eb46b1?q=80&w=2070&auto=format&fit=crop",
    price: "150.000đ",
    status: "past",
    seat: "Gate 1",
    ticketId: "9876-5432-1098"
  }
];

export default function TicketsList() {
  const tickets = MOCK_TICKETS;

  if (!tickets || tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 glass-card rounded-3xl border-dashed p-8 md:p-16">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
          <QrCode className="w-10 h-10 text-primary" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">Chưa có vé nào</h3>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Bạn chưa mua vé cho sự kiện nào. Hãy khám phá các sự kiện thú vị ngay!
          </p>
        </div>
        <Button asChild size="lg" className="rounded-full px-8 bg-gradient-to-r from-primary to-accent hover:opacity-90">
          <Link href="/events">
            Khám phá sự kiện
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {tickets.map((ticket) => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
}

function TicketCard({ ticket }: { ticket: any }) {
  const isPast = ticket.status === "past";

  return (
    <div className={`group relative flex flex-col md:flex-row bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-lg border border-border/50 hover:shadow-2xl hover:border-primary/30 transition-all duration-300 ${isPast ? 'opacity-70 grayscale-[0.8] hover:grayscale-0 hover:opacity-100' : ''}`}>
      {/* Left Section: Image & Basic Info */}
      <div className="md:w-2/5 relative h-48 md:h-auto overflow-hidden">
        <Image
          src={ticket.image}
          alt={ticket.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/50" />

        <Badge className={`absolute top-4 left-4 ${isPast ? 'bg-zinc-500' : 'bg-green-500'} text-white border-0 backdrop-blur-md`}>
          {isPast ? 'Đã diễn ra' : 'Sắp diễn ra'}
        </Badge>

        <div className="absolute bottom-4 left-4 text-white md:hidden">
          <p className="font-bold text-lg leading-tight line-clamp-2">{ticket.title}</p>
        </div>
      </div>

      {/* Right Section: Details & Action */}
      <div className="flex-1 p-6 flex flex-col justify-between relative bg-card/50 backdrop-blur-sm">
        {/* Cutout circles for abstract "ticket" look */}
        <div className="absolute -left-3 top-1/2 w-6 h-6 bg-background rounded-full z-10 hidden md:block" />
        <div className="absolute -right-3 top-1/2 w-6 h-6 bg-background rounded-full z-10 hidden md:block" />

        <div className="space-y-4">
          <div className="hidden md:block">
            <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">{ticket.title}</h3>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-muted-foreground flex items-center gap-1.5 font-medium text-xs uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5" /> Ngày
              </p>
              <p className="font-semibold">
                {new Date(ticket.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground flex items-center gap-1.5 font-medium text-xs uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5" /> Giờ
              </p>
              <p className="font-semibold">
                {new Date(ticket.date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <div className="col-span-2 space-y-1">
              <p className="text-muted-foreground flex items-center gap-1.5 font-medium text-xs uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5" /> Địa điểm
              </p>
              <p className="font-semibold line-clamp-1">{ticket.location}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-dashed border-border flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Mã vé</span>
            <span className="font-mono text-sm font-bold tracking-wider">{ticket.ticketId}</span>
          </div>

          <Button variant="outline" size="sm" className="gap-2 hover:bg-primary hover:text-primary-foreground group/btn rounded-xl">
            <QrCode className="w-4 h-4" />
            <span className="sr-only sm:not-sr-only">Xem QR</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
