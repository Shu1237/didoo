'use client';

import { Heart, Share2, Bookmark } from 'lucide-react';
import { useGetMe } from '@/hooks/useUser';
import { useGetFavorites } from '@/hooks/useFavorite';
import { useGetInteractions } from '@/hooks/useInteraction';
import { useFavorite } from '@/hooks/useFavorite';
import { useInteraction } from '@/hooks/useInteraction';
import { InteractionType } from '@/utils/enum';
import { toast } from 'sonner';

interface EventActionsProps {
  eventId: string;
}

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
    pageSize: 50,
  });

  const { create: createFavorite, remove: removeFavorite } = useFavorite();
  const { create: createInteraction, remove: removeInteraction } = useInteraction();

  const isFavorited = (favoritesRes?.data?.items?.length ?? 0) > 0;
  const saved = (interactionsRes?.data?.items ?? []).some((i) => i.type === InteractionType.SAVE);

  const handleFavorite = () => {
    if (!userId) {
      toast.error('Vui lòng đăng nhập để thêm yêu thích');
      return;
    }
    if (isFavorited) {
      removeFavorite.mutate({ userId, eventId });
    } else {
      createFavorite.mutate({ userId, eventId });
    }
  };

  const handleSave = () => {
    if (!userId) {
      toast.error('Vui lòng đăng nhập để lưu');
      return;
    }
    if (saved) {
      removeInteraction.mutate({ userId, eventId, type: InteractionType.SAVE });
    } else {
      createInteraction.mutate({ type: InteractionType.SAVE, eventId, userId });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: document.title,
        url: window.location.href,
      }).catch(() => toast.info('Chia sẻ đã bị hủy'));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Đã sao chép link');
    }
  };

  const btnClass = 'h-16 w-16 flex items-center justify-center rounded-full border border-white/10 bg-white/5 text-white hover:bg-white hover:text-black transition-colors';
  const activeClass = 'bg-primary/20 border-primary/50 text-primary';

  return (
    <div className="flex gap-3">
      <button
        onClick={handleFavorite}
        className={`${btnClass} ${isFavorited ? activeClass : ''}`}
        title={isFavorited ? 'Bỏ yêu thích' : 'Thêm yêu thích'}
      >
        <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
      </button>
      <button
        onClick={handleSave}
        className={`${btnClass} ${saved ? activeClass : ''}`}
        title={saved ? 'Bỏ lưu' : 'Lưu'}
      >
        <Bookmark className={`w-5 h-5 ${saved ? 'fill-current' : ''}`} />
      </button>
      <button onClick={handleShare} className={btnClass} title="Chia sẻ">
        <Share2 className="w-5 h-5" />
      </button>
    </div>
  );
}
