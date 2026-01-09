"use client";

import { useQuery } from "@tanstack/react-query";
import { EventCardData } from "@/utils/type";
import CardEvent from "@/components/ui/CardEvent";
import { Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// TODO: Replace with actual API call
async function fetchUserTickets(): Promise<EventCardData[]> {
  // Mock data for now
  return [];
}

export default function TicketsList() {
  const { data: tickets, isLoading } = useQuery({
    queryKey: ["user-tickets"],
    queryFn: fetchUserTickets,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!tickets || tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 bg-white dark:bg-card rounded-3xl border border-dashed border-border/50 p-8 md:p-16">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
          <Ticket className="w-10 h-10 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold">No tickets found</h3>
          <p className="text-muted-foreground max-w-sm mx-auto">
            You haven't purchased any tickets yet. Explore events and book your first experience!
          </p>
        </div>
        <Button asChild size="lg" className="rounded-full px-8">
          <Link href="/events">
            Explore Events
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
      {tickets.map((ticket) => (
        <div key={ticket.id} className="flex justify-center">
          <CardEvent {...ticket} />
        </div>
      ))}
    </div>
  );
}
