"use client";

import { Bookmark, Heart, Share2 } from "lucide-react";
import { toast } from "sonner";
import { useGetMe } from "@/hooks/useUser";
import { useFavorite, useGetFavorites } from "@/hooks/useFavorite";
import { useGetInteractions, useInteraction } from "@/hooks/useInteraction";
import { InteractionType } from "@/utils/enum";

interface EventActionsProps {
  eventId: string;
}

const baseButtonClass =
  "inline-flex h-12 md:h-14 items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white/80 backdrop-blur-md px-5 text-sm font-bold uppercase tracking-widest text-slate-700 shadow-sm transition-all hover:border-slate-400 hover:bg-white hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60";

export default function EventActions({ eventId }: EventActionsProps) {
  const { data: userData } = useGetMe();
  const userId = userData?.data?.id;

  const { data: favoritesRes } = useGetFavorites({
    userId: userId || undefined,
    eventId,
    pageSize: 1,
  });

  const { data: interactionsRes } = useGetInteractions({
    userId: userId || undefined,
    eventId,
    pageSize: 20,
  });

  const { create: createFavorite, remove: removeFavorite } = useFavorite();
  const { create: createInteraction, remove: removeInteraction } = useInteraction();

  const isFavorited = (favoritesRes?.data?.items?.length ?? 0) > 0;
  const isSaved = (interactionsRes?.data?.items ?? []).some(
    (item) => item.type === InteractionType.SAVE,
  );

  const favoriteBusy = createFavorite.isPending || removeFavorite.isPending;
  const saveBusy = createInteraction.isPending || removeInteraction.isPending;

  const requireLogin = () => {
    toast.error("Please log in to use this feature");
  };

  const handleFavorite = () => {
    if (!userId) {
      requireLogin();
      return;
    }

    if (isFavorited) {
      removeFavorite.mutate({ userId, eventId });
      return;
    }

    createFavorite.mutate({ userId, eventId });
  };

  const handleSave = () => {
    if (!userId) {
      requireLogin();
      return;
    }

    if (isSaved) {
      removeInteraction.mutate({ userId, eventId, type: InteractionType.SAVE });
      return;
    }

    createInteraction.mutate({ type: InteractionType.SAVE, eventId, userId });
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Event link copied to clipboard");
      }
    } catch {
      toast.info("Share cancelled");
    }
  };

  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-3">
      <button
        type="button"
        onClick={handleFavorite}
        disabled={favoriteBusy}
        className={`${baseButtonClass} w-full sm:w-auto ${isFavorited ? "border-rose-200 bg-rose-50 text-rose-600" : ""}`}
        title={isFavorited ? "Unfavorite" : "Favorite"}
      >
        <Heart className={`h-4 w-4 md:h-5 md:w-5 ${isFavorited ? "fill-current" : ""}`} />
        <span>{isFavorited ? "Favorited" : "Favorite"}</span>
      </button>

      <button
        type="button"
        onClick={handleSave}
        disabled={saveBusy}
        className={`${baseButtonClass} w-full sm:w-auto ${isSaved ? "border-sky-200 bg-sky-50 text-sky-700" : ""}`}
        title={isSaved ? "Unsave" : "Save Event"}
      >
        <Bookmark className={`h-4 w-4 md:h-5 md:w-5 ${isSaved ? "fill-current" : ""}`} />
        <span>{isSaved ? "Saved" : "Save"}</span>
      </button>

      <button
        type="button"
        onClick={handleShare}
        className={`${baseButtonClass} w-full sm:w-auto`}
        title="Share Event"
      >
        <Share2 className="h-4 w-4 md:h-5 md:w-5" />
        <span>Share</span>
      </button>
    </div>
  );
}
