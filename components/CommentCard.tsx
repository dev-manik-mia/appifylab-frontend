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
  const [isLiked, setIsLiked] = useState(comment.is_liked);
  const [likeCount, setLikeCount] = useState(comment.likes_count);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [likeUsers, setLikeUsers] = useState<Array<{ id: number; user: { first_name: string; last_name: string } }>>([]);
  const [loadingLikes, setLoadingLikes] = useState(false);

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

  const handleLike = async () => {
    const prev = { isLiked, likeCount };
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    try {
      await api.toggleCommentReaction(comment.id, 1);
    } catch {
      setIsLiked(prev.isLiked);
      setLikeCount(prev.likeCount);
    }
  };

  const handleShowLikes = async () => {
    setShowLikesModal(true);
    if (likeUsers.length === 0) {
      setLoadingLikes(true);
      try {
        const res = await api.getCommentReactions(comment.id);
        setLikeUsers(res.data as Array<{ id: number; user: { first_name: string; last_name: string } }>);
      } catch {
        // ignore
      } finally {
        setLoadingLikes(false);
      }
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
            <button
              className={`_comment_action_btn ${isLiked ? '_comment_liked' : ''}`}
              onClick={handleLike}
            >
              {isLiked ? 'Unlike' : 'Like'}
            </button>
            {likeCount > 0 && (
              <button className="_comment_action_btn _comment_likes_count" onClick={handleShowLikes}>
                {likeCount} like{likeCount !== 1 ? 's' : ''}
              </button>
            )}
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

      {showLikesModal && (
        <div className="_modal_overlay" onClick={() => setShowLikesModal(false)}>
          <div className="_modal_content" onClick={(e) => e.stopPropagation()}>
            <div className="_modal_header">
              <h4>Likes ({likeCount})</h4>
              <button className="_modal_close" onClick={() => setShowLikesModal(false)}>&times;</button>
            </div>
            <div className="_modal_body">
              {loadingLikes ? (
                <p>Loading...</p>
              ) : likeUsers.length === 0 ? (
                <p>No likes yet.</p>
              ) : (
                likeUsers.map((r) => (
                  <div className="_reaction_item" key={r.id}>
                    <div className="_reaction_item_user">
                      <img src="/assets/images/post_img.png" alt="" className="_reaction_user_img" />
                      <span>{r.user.first_name} {r.user.last_name}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        ._modal_overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5); z-index: 1000;
          display: flex; align-items: center; justify-content: center;
        }
        ._modal_content {
          background: #fff; border-radius: 12px; width: 90%; max-width: 400px;
          max-height: 80vh; overflow-y: auto;
        }
        ._modal_header {
          display: flex; justify-content: space-between; align-items: center;
          padding: 16px 20px; border-bottom: 1px solid #eee;
        }
        ._modal_header h4 { margin: 0; font-size: 16px; font-weight: 600; }
        ._modal_close {
          background: none; border: none; font-size: 24px; cursor: pointer; color: #666;
        }
        ._modal_body { padding: 12px 20px; }
        ._reaction_item {
          display: flex; align-items: center; gap: 10px;
          padding: 8px 0; border-bottom: 1px solid #f5f5f5;
        }
        ._reaction_item:last-child { border-bottom: none; }
        ._reaction_item_user { display: flex; align-items: center; gap: 10px; }
        ._reaction_user_img { width: 36px; height: 36px; border-radius: 50%; }
        ._comment_liked { color: #377DFF; font-weight: 600; }
      `}</style>
    </div>
  );
}
