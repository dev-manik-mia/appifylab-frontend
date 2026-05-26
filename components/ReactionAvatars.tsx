'use client';

import type { Reaction } from '@/lib/types';

const AVATAR_COLORS = [
  '#377DFF', '#F33E58', '#10B981', '#F59E0B',
  '#8B5CF6', '#EC4899', '#06B6D4', '#F97316',
];

interface Props {
  reactions: Reaction[];
  onClick?: () => void;
}

export default function ReactionAvatars({ reactions, onClick }: Props) {
  const total = reactions.length;
  if (total === 0) return null;

  const limit = 5;
  const visible = Math.min(total, limit);
  const remaining = total - visible;

  if (total === 0) return null;

  return (
    <>
      {reactions.slice(0, visible).map((r, i) => {
        const cls = i === 0 ? '_react_img1' : i >= 3 ? '_react_img _rect_img_mbl_none' : '_react_img';
        const color = AVATAR_COLORS[i % AVATAR_COLORS.length];
        const key = r.id ?? `reaction-${i}`;
        if (!r.user) {
          return <div key={key} className={cls} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, fontSize: 11, fontWeight: 700, color: '#fff', background: color }} />;
        }
        return r.user.profile_image ? (
          <img key={key} src={r.user.profile_image} alt="" className={cls} />
        ) : (
          <div
            key={key}
            className={cls}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 32, height: 32, fontSize: 11, fontWeight: 700,
              color: '#fff', background: color,
            }}
          >
            {r.user.first_name.charAt(0)}{r.user.last_name.charAt(0)}
          </div>
        );
      })}
      {remaining > 0 && (
        <p className="_feed_inner_timeline_total_reacts_para">{remaining}+</p>
      )}
    </>
  );
}
