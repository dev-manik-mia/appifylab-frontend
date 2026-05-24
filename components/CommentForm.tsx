'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import type { Comment } from '@/lib/types';

interface Props {
  postId: number;
  parentId?: number | null;
  onCommentAdded: (comment: Comment) => void;
  placeholder?: string;
}

export default function CommentForm({ postId, parentId = null, onCommentAdded, placeholder = 'Write a comment...' }: Props) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      const res = await api.createComment(postId, { content: content.trim(), parent_id: parentId });
      onCommentAdded(res.data);
      setContent('');
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="_comment_form" onSubmit={handleSubmit}>
      <div className="_comment_form_input">
        <input
          type="text"
          className="form-control"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          disabled={loading}
        />
      </div>
      <button type="submit" className="_comment_form_btn" disabled={loading || !content.trim()}>
        {loading ? '...' : 'Post'}
      </button>
    </form>
  );
}
