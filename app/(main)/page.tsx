'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import PostCard from '@/components/PostCard';
import PostForm from '@/components/PostForm';
import type { Post, PaginatedData } from '@/lib/types';
import { api } from '@/lib/api';

export default function HomeFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const fetchPosts = useCallback(async (pageNum: number, append: boolean = false) => {
    if (pageNum === 1 && !append) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    try {
      const res = await api.getPosts(pageNum);
      const paginated = res.data as PaginatedData<Post>;
      if (append) {
        setPosts((prev) => [...prev, ...paginated.data]);
      } else {
        setPosts(paginated.data);
      }
      setHasMore(paginated.current_page < paginated.last_page);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPosts(1);
  }, [fetchPosts]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
      setPage((prev) => {
            const next = prev + 1;
            fetchPosts(next, true);
            return next;
          });
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, loading, fetchPosts]);

  const handlePostCreated = () => {
    setPage(1);
    fetchPosts(1);
  };

  const handlePostDeleted = () => {
    setPage(1);
    fetchPosts(1);
  };

  return (
    <div className="_layout_middle_wrap">
      <div className="_layout_middle_inner">
        <PostForm onPostCreated={handlePostCreated} />

        {loading ? (
          <div>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  background: '#fff', borderRadius: 8, padding: 24, marginBottom: 16,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#e0e0e0' }} />
                  <div>
                    <div style={{ width: 120, height: 14, borderRadius: 4, background: '#e0e0e0', marginBottom: 6 }} />
                    <div style={{ width: 80, height: 12, borderRadius: 4, background: '#eee' }} />
                  </div>
                </div>
                <div style={{ width: '80%', height: 14, borderRadius: 4, background: '#e0e0e0', marginBottom: 8 }} />
                <div style={{ width: '60%', height: 14, borderRadius: 4, background: '#eee', marginBottom: 16 }} />
                <div style={{ width: '100%', height: 200, borderRadius: 8, background: '#f0f0f0' }} />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} onPostDeleted={handlePostDeleted} />
          ))
        )}

        {loadingMore && <p style={{ textAlign: 'center', padding: 16 }}>Loading more posts...</p>}

        {!hasMore && posts.length > 0 && (
          <p style={{ textAlign: 'center', padding: 16, color: '#888' }}>You&apos;ve reached the end.</p>
        )}

        <div ref={sentinelRef} style={{ height: 1 }} />
      </div>
    </div>
  );
}
