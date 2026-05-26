'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';
import type { Post, Comment, Reaction, ReactionType } from '@/lib/types';
import { useAuth } from '@/app/context/AuthContext';
import CommentCard from './CommentCard';
import ReactionAvatars from './ReactionAvatars';
import PostEditModal from './PostEditModal';
import Avatar from './Avatar';

const REACTION_IDS: Record<ReactionType, number> = {
  like: 1,
  love: 2,
  haha: 3,
  wow: 4,
  sad: 5,
  care: 6,
  angry: 7,
};

interface Props {
  post: Post;
  onPostDeleted?: () => void;
}

export default function PostCard({ post, onPostDeleted }: Props) {
  const { user } = useAuth();
  const [postContent, setPostContent] = useState(post.content);
  const [postImage, setPostImage] = useState<string | null>(post.image);
  const [postVisibility, setPostVisibility] = useState<'public' | 'private'>(post.visibility);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [commentText, setCommentText] = useState('');
  const [commentsCount, setCommentsCount] = useState(post.comments_count);
  const [reactions, setReactions] = useState<Reaction[]>(post.reactions || []);
  const [myReaction, setMyReaction] = useState<ReactionType | null>(post.my_reaction || null);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const hidePickerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showReactionsModal, setShowReactionsModal] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const isOwner = user?.id === post.user_id;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const toggleComments = () => {
    const next = !showComments;
    setShowComments(next);
    if (next) {
      setLoadingComments(true);
      api.getComments(post.id).then((res) => {
        setComments(res.data);
        setShowAllComments(false);
      }).catch((err) => {
        console.error('Failed to fetch comments:', err);
      }).finally(() => {
        setLoadingComments(false);
      });
    }
  };

  const handleDeletePost = async () => {
    if (!confirm('Delete this post?')) return;
    try {
      await api.delete(`/posts/${post.id}`);
      onPostDeleted?.();
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  };

  const handleCommentAdded = (comment: Comment) => {
    if (!comment.parent_id) {
      setComments((prev) => [comment, ...prev]);
      setCommentsCount((prev) => prev + 1);
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

  const handleCommentDeleted = (commentId: number, parentId: number | null) => {
    setComments((prev) => removeComment(prev, commentId));
    if (!parentId) {
      setCommentsCount((prev) => Math.max(0, prev - 1));
    }
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

  const showPicker = () => {
    if (hidePickerTimer.current) clearTimeout(hidePickerTimer.current);
    setShowReactionPicker(true);
  };

  const hidePicker = () => {
    hidePickerTimer.current = setTimeout(() => setShowReactionPicker(false), 300);
  };

  const handleReaction = async (type: ReactionType) => {
    setShowReactionPicker(false);
    const prev = myReaction;
    if (myReaction === type) {
      setMyReaction(null);
    } else {
      setMyReaction(type);
    }
    try {
      const res = await api.toggleReaction(post.id, REACTION_IDS[type]);
      setMyReaction(res.data.my_reaction as ReactionType | null);
      setReactions(res.data.reactions as Reaction[]);
    } catch (err) {
      console.error('Failed to toggle reaction:', err);
      setMyReaction(prev);
    }
  };

  const handleQuickComment = async () => {
    if (!commentText.trim()) return;
    try {
      const res = await api.createComment(post.id, { content: commentText.trim() });
      handleCommentAdded(res.data);
      setCommentText('');
    } catch (err) {
      console.error('Failed to quick comment:', err);
    }
  };

  const openEditModal = () => {
    setShowEditModal(true);
  };

  return (
    <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
      <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
        <div className="_feed_inner_timeline_post_top">
          <div className="_feed_inner_timeline_post_box">
            <div className="_feed_inner_timeline_post_box_image">
              <Avatar
                profile_image={post.user.profile_image}
                first_name={post.user.first_name}
                last_name={post.user.last_name}
                size={44}
                className="_post_img"
                alt={`${post.user.first_name} ${post.user.last_name}`}
              />
            </div>
            <div className="_feed_inner_timeline_post_box_txt">
              <h4 className="_feed_inner_timeline_post_box_title">
                {post.user.first_name} {post.user.last_name}
              </h4>
              <p className="_feed_inner_timeline_post_box_para">
                {new Date(post.created_at).toLocaleDateString()} .
                <span className="_visibility_badge">{postVisibility === 'private' ? 'Private' : 'Public'}</span>
              </p>
            </div>
          </div>
          <div className="_feed_inner_timeline_post_box_dropdown" ref={dropdownRef}>
            <div className="_feed_timeline_post_dropdown">
              <button
                id="_timeline_show_drop_btn"
                className="_feed_timeline_post_dropdown_link"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="4" height="17" fill="none" viewBox="0 0 4 17">
                  <circle cx="2" cy="2" r="2" fill="#C4C4C4" />
                  <circle cx="2" cy="8" r="2" fill="#C4C4C4" />
                  <circle cx="2" cy="15" r="2" fill="#C4C4C4" />
                </svg>
              </button>
            </div>
            {showDropdown && (
              <div id="_timeline_drop" className="_feed_timeline_dropdown _timeline_dropdown show">
                <ul className="_feed_timeline_dropdown_list">
                  <li className="_feed_timeline_dropdown_item">
                    <a href="#0" className="_feed_timeline_dropdown_link" onClick={(e) => { e.preventDefault(); setShowDropdown(false); }}>
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
                          <path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M14.25 15.75L9 12l-5.25 3.75v-12a1.5 1.5 0 011.5-1.5h7.5a1.5 1.5 0 011.5 1.5v12z" />
                        </svg>
                      </span>
                      Save Post
                    </a>
                  </li>
                  <li className="_feed_timeline_dropdown_item">
                    <a href="#0" className="_feed_timeline_dropdown_link" onClick={(e) => { e.preventDefault(); setShowDropdown(false); }}>
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="22" fill="none" viewBox="0 0 20 22">
                          <path fill="#377DFF" fillRule="evenodd" d="M7.547 19.55c.533.59 1.218.915 1.93.915.714 0 1.403-.324 1.938-.916a.777.777 0 011.09-.056c.318.284.344.77.058 1.084-.832.917-1.927 1.423-3.086 1.423h-.002c-1.155-.001-2.248-.506-3.077-1.424a.762.762 0 01.057-1.083.774.774 0 011.092.057zM9.527 0c4.58 0 7.657 3.543 7.657 6.85 0 1.702.436 2.424.899 3.19.457.754.976 1.612.976 3.233-.36 4.14-4.713 4.478-9.531 4.478-4.818 0-9.172-.337-9.528-4.413-.003-1.686.515-2.544.973-3.299l.161-.27c.398-.679.737-1.417.737-2.918C1.871 3.543 4.948 0 9.528 0zm0 1.535c-3.6 0-6.11 2.802-6.11 5.316 0 2.127-.595 3.11-1.12 3.978-.422.697-.755 1.247-.755 2.444.173 1.93 1.455 2.944 7.986 2.944 6.494 0 7.817-1.06 7.988-3.01-.003-1.13-.336-1.681-.757-2.378-.526-.868-1.12-1.851-1.12-3.978 0-2.514-2.51-5.316-6.111-5.316z" clipRule="evenodd" />
                        </svg>
                      </span>
                      Turn On Notification
                    </a>
                  </li>
                  <li className="_feed_timeline_dropdown_item">
                    <a href="#0" className="_feed_timeline_dropdown_link" onClick={(e) => { e.preventDefault(); setShowDropdown(false); }}>
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
                          <path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M14.25 2.25H3.75a1.5 1.5 0 00-1.5 1.5v10.5a1.5 1.5 0 001.5 1.5h10.5a1.5 1.5 0 001.5-1.5V3.75a1.5 1.5 0 00-1.5-1.5zM6.75 6.75l4.5 4.5M11.25 6.75l-4.5 4.5" />
                        </svg>
                      </span>
                      Hide
                    </a>
                  </li>
                  {isOwner && (
                    <li className="_feed_timeline_dropdown_item">
                      <a href="#0" className="_feed_timeline_dropdown_link" onClick={(e) => { e.preventDefault(); setShowDropdown(false); openEditModal(); }}>
                        <span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
                            <path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M8.25 3H3a1.5 1.5 0 00-1.5 1.5V15A1.5 1.5 0 003 16.5h10.5A1.5 1.5 0 0015 15V9.75" />
                            <path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M13.875 1.875a1.591 1.591 0 112.25 2.25L9 11.25 6 12l.75-3 7.125-7.125z" />
                          </svg>
                        </span>
                        Edit Post
                      </a>
                    </li>
                  )}
                  {isOwner && (
                    <li className="_feed_timeline_dropdown_item">
                      <a href="#0" className="_feed_timeline_dropdown_link" onClick={(e) => { e.preventDefault(); handleDeletePost(); }}>
                        <span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
                            <path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M2.25 4.5h13.5M6 4.5V3a1.5 1.5 0 011.5-1.5h3A1.5 1.5 0 0112 3v1.5m2.25 0V15a1.5 1.5 0 01-1.5 1.5h-7.5a1.5 1.5 0 01-1.5-1.5V4.5h10.5zM7.5 8.25v4.5M10.5 8.25v4.5" />
                          </svg>
                        </span>
                        Delete Post
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
        <h4 className="_feed_inner_timeline_post_title">{postContent}</h4>
        {postImage && (
          <div className="_feed_inner_timeline_image" style={{ marginBottom: 16 }}>
            <Image
              src={postImage}
              alt="Post image"
              className="_time_img"
              width={1200}
              height={800}
              unoptimized
              style={{ maxHeight: 400, objectFit: 'cover', borderRadius: 8, width: '100%', height: 'auto' }}
            />
          </div>
        )}
      </div>
      <div className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24 _mar_b26">
        <div
          className="_feed_inner_timeline_total_reacts_image"
          style={{ cursor: reactions.length > 0 ? 'pointer' : undefined }}
          onClick={reactions.length > 0 ? () => setShowReactionsModal(true) : undefined}
        >
          <ReactionAvatars reactions={reactions} onClick={() => setShowReactionsModal(true)} />
        </div>
        <div className="_feed_inner_timeline_total_reacts_txt">
            <p className="_feed_inner_timeline_total_reacts_para1">
              <button onClick={toggleComments} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(0,0,0,0.46)', padding: 0, font: 'inherit' }}>
                <span>{commentsCount}</span> Comment{commentsCount !== 1 ? 's' : ''}
              </button>
            </p>
            <p className="_feed_inner_timeline_total_reacts_para2"><span>{post.shares_count ?? 0}</span> Share</p>
          </div>
      </div>
      <div className="_feed_inner_timeline_reaction" onMouseLeave={hidePicker}>
        <div style={{ flex: 1, position: 'relative', display: 'flex' }}>
          <button
            className={`_feed_inner_timeline_reaction_emoji _feed_reaction ${myReaction ? '_feed_reaction_active' : ''}`}
            onMouseEnter={showPicker}
            onClick={() => { if (!myReaction) handleReaction('like'); }}
            style={{ flex: 1 }}
          >
            <span className="_feed_inner_timeline_reaction_link">
              <span>
                {myReaction && <ReactionIcon type={myReaction} />}
                {myReaction ? myReaction.charAt(0).toUpperCase() + myReaction.slice(1) : 'Like'}
              </span>
            </span>
          </button>
      {showReactionPicker && (
            <div className="_feed_reaction_picker" onMouseEnter={showPicker} onMouseLeave={hidePicker}>
              {(['like', 'love', 'haha', 'wow', 'sad', 'care', 'angry'] as ReactionType[]).map((type) => (
                <button
                  key={type}
                  className={`_feed_reaction_picker_btn ${myReaction === type ? '_active' : ''}`}
                  onClick={() => handleReaction(type)}
                >
                  <ReactionIcon type={type} />
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          className="_feed_inner_timeline_reaction_comment _feed_reaction"
          onClick={toggleComments}
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
        <>
          <div className="_feed_inner_timeline_cooment_area">
            <div className="_feed_inner_comment_box">
              <form className="_feed_inner_comment_box_form" onSubmit={(e) => { e.preventDefault(); handleQuickComment(); }}>
                <div className="_feed_inner_comment_box_content">
                  <div className="_feed_inner_comment_box_content_image">
                    <Avatar
                      profile_image={user?.profile_image || null}
                      first_name={user?.first_name}
                      last_name={user?.last_name}
                      size={40}
                      className="_comment_img"
                      alt="Commenter avatar"
                    />
                  </div>
                  <div className="_feed_inner_comment_box_content_txt">
                    <textarea
                      className="form-control _comment_textarea"
                      placeholder="Write a comment"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleQuickComment();
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
          </div>

          {loadingComments ? (
            <p className="_comment_loading">Loading comments...</p>
          ) : comments.length === 0 ? (
            <p className="_comment_empty">No comments yet.</p>
          ) : (
            <div className="_timline_comment_main">
              {comments.length > 1 && !showAllComments && (
                <div className="_previous_comment">
                  <button
                    type="button"
                    className="_previous_comment_txt"
                    onClick={() => setShowAllComments(true)}
                  >
                    View {comments.length - 1} previous {comments.length - 1 === 1 ? 'comment' : 'comments'}
                  </button>
                </div>
              )}
              {(showAllComments ? comments : [comments[0]]).map((comment) => (
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
        </>
      )}

      <style>{`
        ._feed_reaction_picker {
          position: absolute;
          bottom: 100%;
          left: 70%;
          transform: translateX(-50%);
          display: flex;
          background: #fff;
          border-radius: 30px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.15);
          padding: 6px 8px;
          gap: 2px;
          z-index: 100;
          margin-bottom: 8px;
        }
        ._feed_reaction_picker::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border: 8px solid transparent;
          border-top-color: #fff;
        }
        ._feed_reaction_picker_btn {
          width: 38px;
          height: 38px;
          border: none;
          background: transparent;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.15s ease;
        }
        ._feed_reaction_picker_btn:hover {
          transform: scale(1.3);
        }
        ._feed_reaction_picker_btn._active {
          background: #e4f1fd;
        }
        ._feed_reaction_picker_btn svg {
          width: 28px;
          height: 28px;
        }
      `}</style>

      {showReactionsModal && (
        <div className="_modal_overlay" onClick={() => setShowReactionsModal(false)}>
          <div className="_modal_content" onClick={(e) => e.stopPropagation()}>
            <div className="_modal_header">
              <h4>Reactions ({reactions.length})</h4>
              <button className="_modal_close" onClick={() => setShowReactionsModal(false)}>&times;</button>
            </div>
            <div className="_modal_body">
              {reactions.length === 0 ? (
                <p>No reactions yet.</p>
              ) : (
                reactions.map((r) => (
                  <div className="_reaction_item" key={r.id}>
                    <div className="_reaction_item_user">
                      <Avatar
                        profile_image={r.user?.profile_image || null}
                        first_name={r.user?.first_name}
                        last_name={r.user?.last_name}
                        size={36}
                        className="_reaction_user_img"
                        alt="User avatar"
                      />
                      <span>{r.user ? `${r.user.first_name} ${r.user.last_name}` : `User #${r.user_id}`}</span>
                    </div>
                    <ReactionIcon type={r.type as ReactionType} />
                  </div>
                ))
              )}
            </div>
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
                display: flex; justify-content: space-between; align-items: center;
                padding: 8px 0; border-bottom: 1px solid #f5f5f5;
              }
              ._reaction_item:last-child { border-bottom: none; }
              ._reaction_item_user { display: flex; align-items: center; gap: 10px; }
              ._reaction_user_img { width: 36px; height: 36px; border-radius: 50%; }
              ._reaction_item svg { width: 24px; height: 24px; }
            `}</style>
          </div>
        </div>
      )}

      {showEditModal && (
        <PostEditModal
          post={{
            id: post.id,
            content: postContent,
            visibility: postVisibility,
            image: postImage,
          }}
          onClose={() => setShowEditModal(false)}
          onUpdated={(updatedPost) => {
            setPostContent(updatedPost.content);
            setPostVisibility(updatedPost.visibility);
            setPostImage(updatedPost.image);
          }}
        />
      )}
    </div>
  );
}

const reactionSvgs: Record<ReactionType, React.ReactNode> = {
  like: (
    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="none" viewBox="0 0 19 19">
      <path fill="#377DFF" d="M9.5 19a9.5 9.5 0 100-19 9.5 9.5 0 000 19z" />
      <path fill="#fff" d="M5.5 8.5h-1v6h1a1 1 0 001-1v-4a1 1 0 00-1-1zM12.5 7.5h-3l.5-2a1.5 1.5 0 00-1.5-1.5l-1 4v5.5h5.5a1 1 0 001-.8l.5-3a1 1 0 00-1-1.2z" />
    </svg>
  ),
  love: (
    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="none" viewBox="0 0 19 19">
      <path fill="#F33E58" d="M9.5 19a9.5 9.5 0 100-19 9.5 9.5 0 000 19z" />
      <path fill="#fff" d="M9.5 14.5c-2 0-3.5-1.5-3.5-3.5s1.5-3.5 3.5-3.5 3.5 1.5 3.5 3.5-1.5 3.5-3.5 3.5zM6.5 8a1 1 0 100-2 1 1 0 000 2zM12.5 8a1 1 0 100-2 1 1 0 000 2z" />
    </svg>
  ),
  haha: (
    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="none" viewBox="0 0 19 19">
      <path fill="#FFCC4D" d="M9.5 19a9.5 9.5 0 100-19 9.5 9.5 0 000 19z" />
      <path fill="#664500" d="M9.5 11.083c-1.912 0-3.181-.222-4.75-.527-.358-.07-1.056 0-1.056 1.055 0 2.111 2.425 4.75 5.806 4.75 3.38 0 5.805-2.639 5.805-4.75 0-1.055-.697-1.125-1.055-1.055-1.57.305-2.838.527-4.75.527z" />
      <path fill="#fff" d="M4.75 11.611s1.583.528 4.75.528 4.75-.528 4.75-.528-1.056 2.111-4.75 2.111-4.75-2.11-4.75-2.11z" />
      <path fill="#664500" d="M6.333 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847zM12.667 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847z" />
    </svg>
  ),
  wow: (
    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="none" viewBox="0 0 19 19">
      <path fill="#FFCC4D" d="M9.5 19a9.5 9.5 0 100-19 9.5 9.5 0 000 19z" />
      <path fill="#664500" d="M9.5 14.5c-1.5 0-3-.5-3.5-1-.3-.2-.5-.5-.3-.8.2-.3.5-.4.8-.2 0 0 1.5.5 3 .5s3-.5 3-.5c.3-.2.6 0 .8.2.2.3 0 .6-.3.8-.5.5-2 1-3.5 1zM6.5 8.5a1 1 0 100-2 1 1 0 000 2zM12.5 8.5a1 1 0 100-2 1 1 0 000 2z" />
    </svg>
  ),
  sad: (
    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="none" viewBox="0 0 19 19">
      <path fill="#FFCC4D" d="M9.5 19a9.5 9.5 0 100-19 9.5 9.5 0 000 19z" />
      <path fill="#664500" d="M9.5 11.5c-1.5 0-3-.5-3.5-1-.3-.2-.3-.6-.1-.9.2-.3.6-.3.9-.1 0 0 1.5.5 2.7.5s2.7-.5 2.7-.5c.3-.2.7-.1.9.1.2.3.1.7-.1.9-.5.5-2 1-3.5 1zM6.5 7.5a1 1 0 100-2 1 1 0 000 2zM12.5 7.5a1 1 0 100-2 1 1 0 000 2z" />
    </svg>
  ),
  care: (
    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="none" viewBox="0 0 19 19">
      <path fill="#FF6B9D" d="M9.5 19a9.5 9.5 0 100-19 9.5 9.5 0 000 19z" />
      <path fill="#fff" d="M5.5 7.5c-1 0-1.5.5-1.5 1.5 0 1.5 3 4 5 4s5-2.5 5-4c0-1-.5-1.5-1.5-1.5-1 0-1.5.5-2 1-.5-.5-1-1-2-1s-1 .5-2 1c-.5-.5-1-1-2-1z" />
    </svg>
  ),
  angry: (
    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="none" viewBox="0 0 19 19">
      <path fill="#F4900C" d="M9.5 19a9.5 9.5 0 100-19 9.5 9.5 0 000 19z" />
      <path fill="#fff" d="M6.5 8l-2-1.5M12.5 8l2-1.5M9.5 14.5c-1.5 0-2.5-1-2.5-2h5c0 1-1 2-2.5 2z" />
    </svg>
  ),
};

function ReactionIcon({ type }: { type: ReactionType }) {
  return reactionSvgs[type] || reactionSvgs.haha;
}
