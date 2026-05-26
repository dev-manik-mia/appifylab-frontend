'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { api } from '@/lib/api';
import type { Comment } from '@/lib/types';

interface Props {
  comment: Comment;
  postId: number;
  depth?: number;
  onCommentAdded: (comment: Comment) => void;
  onCommentDeleted: (commentId: number, parentId: number | null) => void;
}

export default function CommentCard({ comment, postId, depth = 1, onCommentAdded, onCommentDeleted }: Props) {
  const { user } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(comment.likes_count);

  const isOwner = user?.id === comment.user_id;
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  const handleDelete = async () => {
    if (!confirm('Delete this comment?')) return;
    try {
      await api.deleteComment(comment.id);
      onCommentDeleted(comment.id, comment.parent_id);
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  const formatTime = (dateStr: string) => {
    const then = new Date(dateStr).getTime();
    const diff = now - then;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return '.just now';
    if (mins < 60) return `.${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `.${hours}h`;
    const days = Math.floor(hours / 24);
    return `.${days}d`;
  };

  const handleLike = async () => {
    setLiked((prev) => !prev);
    setLikesCount((prev) => prev + (liked ? -1 : 1));
    try {
      await api.toggleCommentReaction(comment.id, 1);
    } catch (err) {
      console.error('Failed to toggle like:', err);
      setLiked((prev) => !prev);
      setLikesCount((prev) => prev + (liked ? 1 : -1));
    }
  };

  const handleHeart = async () => {
    setLiked((prev) => !prev);
    setLikesCount((prev) => prev + (liked ? -1 : 1));
    try {
      await api.toggleCommentReaction(comment.id, 2);
    } catch (err) {
      console.error('Failed to toggle heart:', err);
      setLiked((prev) => !prev);
      setLikesCount((prev) => prev + (liked ? 1 : -1));
    }
  };

  return (
    <div className="_comment_main">
      <div className="_comment_image">
        <Link href={`/profile/${comment.user_id}`} className="_comment_image_link">
          <img
            src={comment.user.profile_image || '/assets/images/txt_img.png'}
            alt={`${comment.user.first_name} ${comment.user.last_name}`}
            className="_comment_img1"
          />
        </Link>
      </div>
      <div className="_comment_area">
        <div className="_comment_details">
          <div className="_comment_details_top">
            <div className="_comment_name">
              <Link href={`/profile/${comment.user_id}`}>
                <h4 className="_comment_name_title">
                  {comment.user.first_name} {comment.user.last_name}
                </h4>
              </Link>
            </div>
          </div>
          <div className="_comment_status">
            <p className="_comment_status_text">
              <span>{comment.content}</span>
            </p>
          </div>
          <div className="_total_reactions">
            <div className="_total_react">
              <span className="_reaction_like" onClick={handleLike} style={{ cursor: 'pointer' }}>
                <svg className="feather feather-thumbs-up" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={liked ? '#377DFF' : 'none'} stroke={liked ? '#377DFF' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                </svg>
              </span>
              <span className="_reaction_heart" onClick={handleHeart} style={{ cursor: 'pointer' }}>
                <svg className="feather feather-heart" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={liked ? '#F33E58' : 'none'} stroke={liked ? '#F33E58' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </span>
            </div>
            <span className="_total">{likesCount}</span>
          </div>
          <div className="_comment_reply">
            <div className="_comment_reply_num">
              <ul className="_comment_reply_list">
                <li><span onClick={handleLike} style={{ color: liked ? '#377DFF' : undefined, cursor: 'pointer' }}>Like.</span></li>
                <li><span onClick={() => setShowReplyForm(!showReplyForm)} style={{ cursor: 'pointer' }}>Reply.</span></li>
                <li><span style={{ cursor: 'pointer' }}>Share</span></li>
                <li><span className="_time_link">{formatTime(comment.created_at)}</span></li>
                {isOwner && (
                  <li><span onClick={handleDelete} style={{ cursor: 'pointer' }}>Delete</span></li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {showReplyForm && (
          <div className="_feed_inner_comment_box">
            <form
              className="_feed_inner_comment_box_form"
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const textarea = form.querySelector('textarea');
                if (!textarea || !textarea.value.trim()) return;
                try {
                  const res = await api.createComment(postId, {
                    content: textarea.value.trim(),
                    parent_id: comment.id,
                  });
                  onCommentAdded(res.data);
                  textarea.value = '';
                  setShowReplyForm(false);
                } catch (err) {
                  console.error('Failed to create reply:', err);
                }
              }}
            >
              <div className="_feed_inner_comment_box_content">
                <div className="_feed_inner_comment_box_content_image">
                  <img src="/assets/images/comment_img.png" alt="Commenter avatar" className="_comment_img" />
                </div>
                <div className="_feed_inner_comment_box_content_txt">
                  <textarea
                    className="form-control _comment_textarea"
                    placeholder="Write a comment"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        e.currentTarget.form?.requestSubmit();
                      }
                    }}
                  />
                </div>
              </div>
              <div className="_feed_inner_comment_box_icon">
                <button type="button" className="_feed_inner_comment_box_icon_btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
                    <path fill="#000" fillOpacity=".46" fillRule="evenodd" d="M13.167 6.534a.5.5 0 01.5.5c0 3.061-2.35 5.582-5.333 5.837V14.5a.5.5 0 01-1 0v-1.629C4.35 12.616 2 10.096 2 7.034a.5.5 0 011 0c0 2.679 2.168 4.859 4.833 4.859 2.666 0 4.834-2.18 4.834-4.86a.5.5 0 01.5-.5zM7.833.667a3.218 3.218 0 013.208 3.22v3.126c0 1.775-1.439 3.22-3.208 3.22a3.218 3.218 0 01-3.208-3.22V3.887c0-1.776 1.44-3.22 3.208-3.22zm0 1a2.217 2.217 0 00-2.208 2.22v3.126c0 1.223.991 2.22 2.208 2.22a2.217 2.217 0 002.208-2.22V3.887c0-1.224-.99-2.22-2.208-2.22z" clipRule="evenodd" />
                  </svg>
                </button>
                <button type="button" className="_feed_inner_comment_box_icon_btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
                    <path fill="#000" fillOpacity=".46" fillRule="evenodd" d="M10.867 1.333c2.257 0 3.774 1.581 3.774 3.933v5.435c0 2.352-1.517 3.932-3.774 3.932H5.101c-2.254 0-3.767-1.58-3.767-3.932V5.266c0-2.352 1.513-3.933 3.767-3.933h5.766zm0 1H5.101c-1.681 0-2.767 1.152-2.767 2.933v5.435c0 1.782 1.086 2.932 2.767 2.932h5.766c1.685 0 2.774-1.15 2.774-2.932V5.266c0-1.781-1.089-2.933-2.774-2.933zm.426 5.733l.017.015.013.013.009.008.037.037c.12.12.453.46 1.443 1.477a.5.5 0 11-.716.697S10.73 8.91 10.633 8.816a.614.614 0 00-.433-.118.622.622 0 00-.421.225c-1.55 1.88-1.568 1.897-1.594 1.922a1.456 1.456 0 01-2.057-.021s-.62-.63-.63-.642c-.155-.143-.43-.134-.594.04l-1.02 1.076a.498.498 0 01-.707.018.499.499 0 01-.018-.706l1.018-1.075c.54-.573 1.45-.6 2.025-.06l.639.647c.178.18.467.184.646.008l1.519-1.843a1.618 1.618 0 011.098-.584c.433-.038.854.088 1.19.363zM5.706 4.42c.921 0 1.67.75 1.67 1.67 0 .92-.75 1.67-1.67 1.67-.92 0-1.67-.75-1.67-1.67 0-.921.75-1.67 1.67-1.67zm0 1a.67.67 0 10.001 1.34.67.67 0 00-.002-1.34z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && depth < 5 && (
          <div className="_comment_replies" style={{ paddingLeft: 48 }}>
            {comment.replies.map((reply) => (
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
    </div>
  );
}
