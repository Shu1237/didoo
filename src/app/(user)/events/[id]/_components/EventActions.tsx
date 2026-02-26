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
  "inline-flex h-12 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60";

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
    toast.error("Vui long dang nhap de su dung tinh nang nay");
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
        toast.success("Da sao chep lien ket su kien");
      }
    } catch {
      toast.info("Da huy chia se");
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={handleFavorite}
        disabled={favoriteBusy}
        className={`${baseButtonClass} ${isFavorited ? "border-rose-200 bg-rose-50 text-rose-600" : ""}`}
        title={isFavorited ? "Bo yeu thich" : "Them yeu thich"}
      >
        <Heart className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`} />
        <span>{isFavorited ? "Da yeu thich" : "Yeu thich"}</span>
      </button>

      <button
        type="button"
        onClick={handleSave}
        disabled={saveBusy}
        className={`${baseButtonClass} ${isSaved ? "border-sky-200 bg-sky-50 text-sky-700" : ""}`}
        title={isSaved ? "Bo luu" : "Luu su kien"}
      >
        <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
        <span>{isSaved ? "Da luu" : "Luu"}</span>
      </button>

      <button
        type="button"
        onClick={handleShare}
        className={baseButtonClass}
        title="Chia se su kien"
      >
        <Share2 className="h-4 w-4" />
        <span>Chia se</span>
      </button>
    </div>
  );
}
