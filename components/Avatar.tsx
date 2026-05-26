'use client';

import Image from 'next/image';

interface Props {
  profile_image?: string | null;
  size: number;
  first_name?: string;
  last_name?: string;
  className?: string;
  alt?: string;
}

function getInitials(firstName?: string, lastName?: string) {
  const first = firstName?.trim().charAt(0) || '';
  const last = lastName?.trim().charAt(0) || '';
  const initials = `${first}${last}`.toUpperCase();
  return initials || 'U';
}

function colorFromName(firstName?: string, lastName?: string) {
  const seed = `${firstName || ''}${lastName || ''}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const palette = ['#377DFF', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'];
  return palette[Math.abs(hash) % palette.length];
}

export default function Avatar({
  profile_image,
  size,
  first_name,
  last_name,
  className,
  alt,
}: Props) {
  if (profile_image) {
    return (
      <Image
        src={profile_image}
        alt={alt || 'User avatar'}
        width={size}
        height={size}
        className={className}
        unoptimized
        style={{
          width: size,
          height: size,
          minWidth: size,
          minHeight: size,
          maxWidth: size,
          maxHeight: size,
          aspectRatio: '1 / 1',
          borderRadius: '50%',
          objectFit: 'cover',
          flexShrink: 0,
        }}
      />
    );
  }

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        maxWidth: size,
        maxHeight: size,
        aspectRatio: '1 / 1',
        borderRadius: '50%',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: colorFromName(first_name, last_name),
        color: '#fff',
        fontWeight: 700,
        fontSize: Math.max(10, Math.floor(size * 0.38)),
        lineHeight: 1,
        textTransform: 'uppercase',
        flexShrink: 0,
        overflow: 'hidden',
      }}
      aria-label={alt || 'User avatar'}
    >
      {getInitials(first_name, last_name)}
    </div>
  );
}
