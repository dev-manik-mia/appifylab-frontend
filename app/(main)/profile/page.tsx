'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { api } from '@/lib/api';
import PostCard from '@/components/PostCard';
import type { Post, PaginatedData } from '@/lib/types';

export default function ProfilePage() {
  const { user: authUser } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    if (!authUser) return;
    api.getUserPosts(authUser.id, 1).then((res) => {
      const paginated = res.data as PaginatedData<Post>;
      setPosts(paginated.data);
      setHasMore(paginated.current_page < paginated.last_page);
    }).catch(console.error).finally(() => setLoading(false));
  }, [authUser]);

  const loadMore = useCallback(async () => {
    if (!authUser || loadingMore || !hasMore) return;
    setLoadingMore(true);
    const next = page + 1;
    try {
      const res = await api.getUserPosts(authUser.id, next);
      const paginated = res.data as PaginatedData<Post>;
      setPosts((prev) => [...prev, ...paginated.data]);
      setPage(next);
      setHasMore(paginated.current_page < paginated.last_page);
    } catch (err) {
      console.error('Failed to load more posts:', err);
    } finally {
      setLoadingMore(false);
    }
  }, [authUser, page, loadingMore, hasMore]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const el = document.getElementById('_profile_sentinel');
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  if (!authUser) {
    return <p>Loading profile...</p>;
  }

  return (
    <div>
      <div style={{ background: '#fff', borderRadius: 8, padding: 24, marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <img
            src="/assets/images/profile.png"
            alt="Profile"
            style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }}
          />
          <div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>{authUser.first_name} {authUser.last_name}</h2>
            <p style={{ margin: '4px 0 0', color: '#666' }}>{authUser.email}</p>
          </div>
        </div>
      </div>

      <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Posts</h3>

      {loading ? (
        <p>Loading posts...</p>
      ) : posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
          {loadingMore && <p style={{ textAlign: 'center', padding: 16 }}>Loading more posts...</p>}
          {!hasMore && posts.length > 0 && (
            <p style={{ textAlign: 'center', padding: 16, color: '#888' }}>You&apos;ve reached the end.</p>
          )}
          <div id="_profile_sentinel" style={{ height: 1 }} />
        </>
      )}
    </div>
  );
}
