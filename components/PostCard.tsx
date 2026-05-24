'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import type { Post, Comment } from '@/lib/types';
import CommentCard from './CommentCard';
import CommentForm from './CommentForm';

interface Props {
  post: Post;
}

export default function PostCard({ post }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);

  const fetchComments = useCallback(async () => {
    setLoadingComments(true);
    try {
      const res = await api.getComments(post.id);
      setComments(res.data);
    } catch {
      // ignore
    } finally {
      setLoadingComments(false);
    }
  }, [post.id]);

  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments, fetchComments]);

  const handleCommentAdded = (comment: Comment) => {
    if (!comment.parent_id) {
      setComments((prev) => [comment, ...prev]);
    } else {
      setComments((prev) => addReplyToComment(prev, comment));
    }
  };

  const addReplyToComment = (items: Comment[], newReply: Comment): Comment[] => {
    return items.map((c) => {
      if (c.id === newReply.parent_id) {
        return { ...c, replies: [...(c.replies || []), newReply] };
      }
      if (c.replies && c.replies.length > 0) {
        return { ...c, replies: addReplyToComment(c.replies, newReply) };
      }
      return c;
    });
  };

  const handleCommentDeleted = (commentId: number) => {
    setComments((prev) => removeComment(prev, commentId));
  };

  const removeComment = (items: Comment[], id: number): Comment[] => {
    return items.filter((c) => {
      if (c.id === id) return false;
      if (c.replies && c.replies.length > 0) {
        c.replies = removeComment(c.replies, id);
      }
      return true;
    });
  };

  return (
    <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
      <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
        <div className="_feed_inner_timeline_post_top">
          <div className="_feed_inner_timeline_post_box">
            <div className="_feed_inner_timeline_post_box_image">
              <img src="/assets/images/post_img.png" alt="" className="_post_img" />
            </div>
            <div className="_feed_inner_timeline_post_box_txt">
              <h4 className="_feed_inner_timeline_post_box_title">
                {post.user.first_name} {post.user.last_name}
              </h4>
              <p className="_feed_inner_timeline_post_box_para">
                {new Date(post.created_at).toLocaleDateString()} .
                <a href="#0">{post.visibility}</a>
              </p>
            </div>
          </div>
          <div className="_feed_inner_timeline_post_box_dropdown">
            <div className="_feed_timeline_post_dropdown">
              <button className="_feed_timeline_post_dropdown_link">
                <svg xmlns="http://www.w3.org/2000/svg" width="4" height="17" fill="none" viewBox="0 0 4 17">
                  <circle cx="2" cy="2" r="2" fill="#C4C4C4" />
                  <circle cx="2" cy="8" r="2" fill="#C4C4C4" />
                  <circle cx="2" cy="15" r="2" fill="#C4C4C4" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <h4 className="_feed_inner_timeline_post_title">{post.content}</h4>
        {post.image && (
          <div className="_feed_inner_timeline_image">
            <img src={post.image} alt="" className="_time_img" />
          </div>
        )}
      </div>
      <div className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24 _mar_b26">
        <div className="_feed_inner_timeline_total_reacts_image">
          {[1, 2, 3, 4, 5].map((i) => (
            <img
              key={i}
              src={`/assets/images/react_img${i}.png`}
              alt="Image"
              className={i === 1 ? '_react_img1' : '_react_img'}
            />
          ))}
          <p className="_feed_inner_timeline_total_reacts_para">{post.likes_count}+</p>
        </div>
        <div className="_feed_inner_timeline_total_reacts_txt">
          <p className="_feed_inner_timeline_total_reacts_para1">
            <a href="#0" onClick={(e) => { e.preventDefault(); setShowComments(!showComments); }}>
              <span>{post.comments_count}</span> Comment
            </a>
          </p>
          <p className="_feed_inner_timeline_total_reacts_para2"><span>0</span> Share</p>
        </div>
      </div>
      <div className="_feed_inner_timeline_reaction">
        <button className="_feed_inner_timeline_reaction_emoji _feed_reaction _feed_reaction_active">
          <span className="_feed_inner_timeline_reaction_link">
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="none" viewBox="0 0 19 19">
                <path fill="#FFCC4D" d="M9.5 19a9.5 9.5 0 100-19 9.5 9.5 0 000 19z" />
                <path fill="#664500" d="M9.5 11.083c-1.912 0-3.181-.222-4.75-.527-.358-.07-1.056 0-1.056 1.055 0 2.111 2.425 4.75 5.806 4.75 3.38 0 5.805-2.639 5.805-4.75 0-1.055-.697-1.125-1.055-1.055-1.57.305-2.838.527-4.75.527z" />
                <path fill="#fff" d="M4.75 11.611s1.583.528 4.75.528 4.75-.528 4.75-.528-1.056 2.111-4.75 2.111-4.75-2.11-4.75-2.11z" />
                <path fill="#664500" d="M6.333 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847zM12.667 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847z" />
              </svg>
              Haha
            </span>
          </span>
        </button>
        <button
          className="_feed_inner_timeline_reaction_comment _feed_reaction"
          onClick={() => setShowComments(!showComments)}
        >
          <span className="_feed_inner_timeline_reaction_link">
            <span>
              <svg className="_reaction_svg" xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="none" viewBox="0 0 21 21">
                <path stroke="#000" d="M1 10.5c0-.464 0-.696.009-.893A9 9 0 019.607 1.01C9.804 1 10.036 1 10.5 1v0c.464 0 .696 0 .893.009a9 9 0 018.598 8.598c.009.197.009.429.009.893v6.046c0 1.36 0 2.041-.317 2.535a2 2 0 01-.602.602c-.494.317-1.174.317-2.535.317H10.5c-.464 0-.696 0-.893-.009a9 9 0 01-8.598-8.598C1 11.196 1 10.964 1 10.5v0z" />
                <path stroke="#000" strokeLinecap="round" strokeLinejoin="round" d="M6.938 9.313h7.125M10.5 14.063h3.563" />
              </svg>
              Comment
            </span>
          </span>
        </button>
        <button className="_feed_inner_timeline_reaction_share _feed_reaction">
          <span className="_feed_inner_timeline_reaction_link">
            <span>
              <svg className="_reaction_svg" xmlns="http://www.w3.org/2000/svg" width="24" height="21" fill="none" viewBox="0 0 24 21">
                <path stroke="#000" strokeLinejoin="round" d="M23 10.5L12.917 1v5.429C3.267 6.429 1 13.258 1 20c2.785-3.52 5.248-5.429 11.917-5.429V20L23 10.5z" />
              </svg>
              Share
            </span>
          </span>
        </button>
      </div>

      {showComments && (
        <div className="_comment_section _padd_r24 _padd_l24 _mar_t16">
          <CommentForm
            postId={post.id}
            onCommentAdded={handleCommentAdded}
          />

          {loadingComments ? (
            <p className="_comment_loading">Loading comments...</p>
          ) : comments.length === 0 ? (
            <p className="_comment_empty">No comments yet.</p>
          ) : (
            <div className="_comment_list">
              {comments.map((comment) => (
                <CommentCard
                  key={comment.id}
                  comment={comment}
                  postId={post.id}
                  onCommentAdded={handleCommentAdded}
                  onCommentDeleted={handleCommentDeleted}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
