'use client';

import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { api } from '@/lib/api';
import type { Comment } from '@/lib/types';
import CommentForm from './CommentForm';

interface Props {
  comment: Comment;
  postId: number;
  depth?: number;
  onCommentAdded: (comment: Comment) => void;
  onCommentDeleted: (commentId: number) => void;
}

export default function CommentCard({ comment, postId, depth = 1, onCommentAdded, onCommentDeleted }: Props) {
  const { user } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(true);

  const isOwner = user?.id === comment.user_id;

  const handleDelete = async () => {
    if (!confirm('Delete this comment?')) return;
    try {
      await api.deleteComment(comment.id);
      onCommentDeleted(comment.id);
    } catch {
      // ignore
    }
  };

  return (
    <div className="_comment_card" style={{ marginLeft: depth > 1 ? 48 : 0 }}>
      <div className="_comment_card_inner">
        <div className="_comment_avatar">
          <img src="/assets/images/post_img.png" alt="" className="_comment_avatar_img" />
        </div>
        <div className="_comment_body">
          <div className="_comment_header">
            <h5 className="_comment_author">{comment.user.first_name} {comment.user.last_name}</h5>
            <span className="_comment_time">{new Date(comment.created_at).toLocaleDateString()}</span>
          </div>
          <p className="_comment_text">{comment.content}</p>
          <div className="_comment_actions">
            <button className="_comment_action_btn" onClick={() => setShowReplyForm(!showReplyForm)}>
              Reply
            </button>
            {isOwner && (
              <button className="_comment_action_btn _comment_delete" onClick={handleDelete}>
                Delete
              </button>
            )}
          </div>

          {showReplyForm && (
            <div className="_comment_reply_form">
              <CommentForm
                postId={postId}
                parentId={comment.id}
                onCommentAdded={(newComment) => {
                  onCommentAdded(newComment);
                  setShowReplyForm(false);
                }}
                placeholder="Write a reply..."
              />
            </div>
          )}
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 && depth < 4 && (
        <div className="_comment_replies">
          <button className="_comment_toggle_replies" onClick={() => setShowReplies(!showReplies)}>
            {showReplies ? 'Hide' : 'Show'} replies ({comment.replies.length})
          </button>
          {showReplies && comment.replies.map((reply) => (
            <CommentCard
              key={reply.id}
              comment={reply}
              postId={postId}
              depth={depth + 1}
              onCommentAdded={onCommentAdded}
              onCommentDeleted={onCommentDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
}
