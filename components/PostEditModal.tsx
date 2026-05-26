'use client';

import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { api } from '@/lib/api';
import type { Post } from '@/lib/types';

interface Props {
  post: Pick<Post, 'id' | 'content' | 'visibility' | 'image'>;
  onClose: () => void;
  onUpdated: (updatedPost: Post) => void;
}

export default function PostEditModal({ post, onClose, onUpdated }: Props) {
  const [content, setContent] = useState(post.content);
  const [visibility, setVisibility] = useState<'public' | 'private'>(post.visibility);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(post.image);
  const [removeImage, setRemoveImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
    setRemoveImage(false);
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    setRemoveImage(true);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!content.trim()) {
      setError('Post content is required.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const res = await api.updatePost(post.id, {
        content: content.trim(),
        visibility,
        image: image || undefined,
        remove_image: removeImage,
      });
      onUpdated(res.data as Post);
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update post.';
      setError(message);
      console.error('Failed to update post:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="_modal_overlay" onClick={onClose}>
      <div className="_modal_content" onClick={(e) => e.stopPropagation()}>
        <div className="_modal_header">
          <h4>Edit Post</h4>
          <button className="_modal_close" onClick={onClose}>&times;</button>
        </div>

        <div className="_feed_inner_text_area _b_radious6 _padd_b24 _padd_t24 _padd_r24 _padd_l24" style={{ boxShadow: 'none', marginBottom: 0 }}>
          <form onSubmit={handleSubmit}>
            <div className="_feed_inner_text_area_box" style={{ position: 'relative' }}>
              <div className="_feed_inner_text_area_box_image">
                <img src="/assets/images/txt_img.png" alt="User avatar" className="_txt_img" />
              </div>
              <div className="form-floating _feed_inner_text_area_box_form">
                <textarea
                  className="form-control _textarea"
                  placeholder=" "
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  disabled={saving}
                  maxLength={5000}
                />
              </div>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as 'public' | 'private')}
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  border: '1px solid #377DFF',
                  borderRadius: 6,
                  padding: '3px 8px',
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#fff',
                  background: '#377DFF',
                  cursor: 'pointer',
                  outline: 'none',
                  zIndex: 2,
                }}
              >
                <option value="public" style={{ color: '#112032', background: '#fff' }}>Public</option>
                <option value="private" style={{ color: '#112032', background: '#fff' }}>Private</option>
              </select>
            </div>

            {imagePreview && (
              <div className="_feed_image_preview _mar_b16" style={{ position: 'relative', display: 'inline-block' }}>
                <img src={imagePreview} alt="Preview" style={{ maxHeight: 200, borderRadius: 8 }} />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  style={{
                    position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.6)',
                    color: '#fff', border: 'none', borderRadius: '50%', width: 24, height: 24,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  &times;
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />

            <div className="_feed_inner_text_area_bottom">
              <div className="_feed_inner_text_area_item">
                <div className="_feed_inner_text_area_bottom_photo _feed_common">
                  <button type="button" className="_feed_inner_text_area_bottom_photo_link" onClick={() => fileInputRef.current?.click()}>
                    <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20">
                        <path fill="#666" d="M13.916 0c3.109 0 5.18 2.429 5.18 5.914v8.17c0 3.486-2.072 5.916-5.18 5.916H5.999C2.89 20 .827 17.572.827 14.085v-8.17C.827 2.43 2.897 0 6 0h7.917zm0 1.504H5.999c-2.321 0-3.799 1.735-3.799 4.41v8.17c0 2.68 1.472 4.412 3.799 4.412h7.917c2.328 0 3.807-1.734 3.807-4.411v-8.17c0-2.678-1.478-4.411-3.807-4.411zm.65 8.68l.12.125 1.9 2.147a.803.803 0 01-.016 1.063.642.642 0 01-.894.058l-.076-.074-1.9-2.148a.806.806 0 00-1.205-.028l-.074.087-2.04 2.717c-.722.963-2.02 1.066-2.86.26l-.111-.116-.814-.91a.562.562 0 00-.793-.07l-.075.073-1.4 1.617a.645.645 0 01-.97.029.805.805 0 01-.09-.977l.064-.086 1.4-1.617c.736-.852 1.95-.897 2.734-.137l.114.12.81.905a.587.587 0 00.861.033l.07-.078 2.04-2.718c.81-1.08 2.27-1.19 3.205-.275zM6.831 4.64c1.265 0 2.292 1.125 2.292 2.51 0 1.386-1.027 2.511-2.292 2.511S4.54 8.537 4.54 7.152c0-1.386 1.026-2.51 2.291-2.51zm0 1.504c-.507 0-.918.451-.918 1.007 0 .555.411 1.006.918 1.006.507 0 .919-.451.919-1.006 0-.556-.412-1.007-.919-1.007z" />
                      </svg>
                    </span>
                    Photo
                  </button>
                </div>
                <div className="_feed_inner_text_area_bottom_video _feed_common">
                  <button type="button" className="_feed_inner_text_area_bottom_photo_link">
                    <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">Video</span>
                  </button>
                </div>
                <div className="_feed_inner_text_area_bottom_event _feed_common">
                  <button type="button" className="_feed_inner_text_area_bottom_photo_link">
                    <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">Event</span>
                  </button>
                </div>
                <div className="_feed_inner_text_area_bottom_article _feed_common">
                  <button type="button" className="_feed_inner_text_area_bottom_photo_link">
                    <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">Article</span>
                  </button>
                </div>
              </div>
              <div className="_feed_inner_text_area_btn">
                <button type="submit" className="_feed_inner_text_area_btn_link" disabled={saving || !content.trim()}>
                  <svg className="_mar_img" xmlns="http://www.w3.org/2000/svg" width="14" height="13" fill="none" viewBox="0 0 14 13">
                    <path fill="#fff" fillRule="evenodd" d="M6.37 7.879l2.438 3.955a.335.335 0 00.34.162c.068-.01.23-.05.289-.247l3.049-10.297a.348.348 0 00-.09-.35.341.341 0 00-.34-.088L1.75 4.03a.34.34 0 00-.247.289.343.343 0 00.16.347L5.666 7.17 9.2 3.597a.5.5 0 01.712.703L6.37 7.88zM9.097 13c-.464 0-.89-.236-1.14-.641L5.372 8.165l-4.237-2.65a1.336 1.336 0 01-.622-1.331c.074-.536.441-.96.957-1.112L11.774.054a1.347 1.347 0 011.67 1.682l-3.05 10.296A1.332 1.332 0 019.098 13z" clipRule="evenodd" />
                  </svg>
                  <span>{saving ? 'Updating...' : 'Update'}</span>
                </button>
              </div>
            </div>

            {error && <p style={{ color: '#dc3545', marginTop: 12, marginBottom: 0 }}>{error}</p>}
          </form>
        </div>
      </div>
      <style>{`
        ._modal_overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5); z-index: 1000;
          display: flex; align-items: center; justify-content: center;
        }
        ._modal_content {
          background: #fff; border-radius: 12px; width: 92%; max-width: 760px;
          max-height: 88vh; overflow-y: auto;
        }
        ._modal_header {
          display: flex; justify-content: space-between; align-items: center;
          padding: 16px 20px; border-bottom: 1px solid #eee;
        }
        ._modal_header h4 { margin: 0; font-size: 16px; font-weight: 600; }
        ._modal_close {
          background: none; border: none; font-size: 24px; cursor: pointer; color: #666;
        }
      `}</style>
    </div>
  );
}
