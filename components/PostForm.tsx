'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

interface Props {
  onPostCreated?: () => void;
}

export default function PostForm({ onPostCreated }: Props) {
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      await api.createPost({ content: content.trim(), visibility });
      setContent('');
      onPostCreated?.();
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="_feed_inner_text_area _b_radious6 _padd_b24 _padd_t24 _padd_r24 _padd_l24 _mar_b16">
      <div className="_feed_inner_text_area_box">
        <div className="_feed_inner_text_area_box_image">
          <img src="/assets/images/txt_img.png" alt="Image" className="_txt_img" />
        </div>
        <div className="form-floating _feed_inner_text_area_box_form">
          <textarea
            className="form-control _textarea"
            placeholder="Write something..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
          />
          <label className="_feed_textarea_label" htmlFor="floatingTextarea">
            Write something ...
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
              <path fill="#000" fillOpacity=".4" d="M1.99 13.652L.074 17.744a.375.375 0 00.182.182l4.092-1.916 11.36-11.36-2.358-2.358L1.99 13.652zM17.492 2.68l-2.172-2.172a.75.75 0 00-1.06 0l-1.7 1.7 3.232 3.232 1.7-1.7a.75.75 0 000-1.06z" />
            </svg>
          </label>
        </div>
      </div>
      <div className="_feed_inner_text_area_bottom">
        <div className="_feed_inner_text_area_item">
          <div className="_feed_inner_text_area_bottom_photo _feed_common">
            <button type="button">Photo</button>
          </div>
          <div className="_feed_inner_text_area_bottom_video _feed_common">
            <button type="button">Video</button>
          </div>
          <div className="_feed_inner_text_area_bottom_event _feed_common">
            <button type="button">Event</button>
          </div>
          <div className="_feed_inner_text_area_bottom_article _feed_common">
            <button type="button">Article</button>
          </div>
        </div>
        <div className="_feed_inner_text_area_btn">
          <button type="submit" className="_feed_inner_text_area_btn_link" disabled={loading || !content.trim()}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
              <path fill="#fff" d="M16.5 1.5L7.5 10.5M16.5 1.5l-5.25 15L7.5 10.5M16.5 1.5l-15 5.25 5.25 3.75" />
            </svg>
            <span>{loading ? 'Posting...' : 'Post'}</span>
          </button>
        </div>
      </div>
    </form>
  );
}
