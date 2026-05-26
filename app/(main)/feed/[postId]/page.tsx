'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PostCard from '@/components/PostCard';
import { api } from '@/lib/api';
import type { Post } from '@/lib/types';

export default function PostDetailPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = use(params);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ success: boolean; data: Post }>(`/posts/${postId}`)
      .then((res) => setPost(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [postId]);

  if (loading || !post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="_layout_inner_wrap_area">
      <div className="row">
        <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
          <div className="_layout_left_sidebar_wrap">
            <div className="_layout_left_sidebar_inner">
              <div className="_back_btn_area">
                <Link href="/" className="_back_btn_link">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="#666" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 12H4m0 0l6-6m-6 6l6 6" />
                  </svg>
                  Back to Feed
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
          <div className="_layout_middle_wrap">
            <div className="_layout_middle_inner">
              <PostCard post={post} />

              <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
                <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
                  <h4 className="_feed_inner_timeline_post_title _mar_b20">Comments</h4>

                  <div className="_feed_comment_input_area _mar_b20">
                    <div className="_feed_comment_input_box">
                      <div className="_feed_comment_input_image">
                        <Image src="/assets/images/post_img.png" alt="User" className="_comment_user_img" width={88} height={88} />
                      </div>
                      <div className="_feed_comment_input_form">
                        <input type="text" className="form-control _feed_comment_input" placeholder="Write a comment..." />
                      </div>
                    </div>
                  </div>

                  {[1, 2, 3].map((i) => (
                    <div className="_feed_comment_item _mar_b16" key={i}>
                      <div className="_feed_comment_item_box">
                        <div className="_feed_comment_item_image">
                          <Image src="/assets/images/post_img.png" alt="User" className="_comment_item_img" width={88} height={88} />
                        </div>
                        <div className="_feed_comment_item_txt">
                          <div className="_feed_comment_item_top">
                            <h5 className="_feed_comment_item_name">Karim Saif</h5>
                            <span className="_feed_comment_item_time">2 min ago</span>
                          </div>
                          <p className="_feed_comment_item_para">
                            Great post! This is really helpful for tracking health metrics.
                          </p>
                          <div className="_feed_comment_item_actions">
                            <button className="_feed_comment_item_like">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
                                <path fill="#666" d="M8 14.5S1.5 10 1.5 5.5 4 1.5 8 5c4-3.5 6.5 0 6.5 4.5S8 14.5 8 14.5z" />
                              </svg>
                              Like
                            </button>
                            <button className="_feed_comment_item_reply">Reply</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
          <div className="_layout_right_sidebar_wrap">
            <div className="_layout_right_sidebar_inner">
              <div className="_feed_inner_area _padd_t24 _padd_b6 _padd_r24 _padd_l24 _b_radious6">
                <h4 className="_feed_sidebar_title _mar_b16">Trending Topics</h4>
                {['#HealthTracking', '#Fitness', '#Wellness', '#Technology', '#AI'].map((topic) => (
                  <div className="_feed_trending_item _mar_b12" key={topic}>
                    <Link href="#0" className="_feed_trending_link">{topic}</Link>
                    <p className="_feed_trending_count">1,234 posts</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
