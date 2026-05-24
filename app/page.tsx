'use client';

import { AuthProvider } from '@/app/context/AuthContext';
import Navbar from '@/components/Navbar';
import MobileNavigation from '@/components/MobileNavigation';
import Sidebar from '@/components/Sidebar';
import PostCard from '@/components/PostCard';
import PostForm from '@/components/PostForm';
import type { Post } from '@/lib/types';
import { api } from '@/lib/api';
import { useState, useEffect } from 'react';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const res = await api.getPosts();
      setPosts(res.data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <AuthProvider>
      <div className="_layout _layout_main_wrapper">
        <div className="_main_layout">
          <Navbar />
          <div className="container _custom_container">
            <div className="_layout_inner_wrap">
              <div className="row">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                  <div className="_layout_inner_wrap_area">
                    <div className="row">
                      <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
                        <Sidebar />
                      </div>
                      <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                        <div className="_layout_middle_wrap">
                          <div className="_layout_middle_inner">
                            <div className="_feed_inner_ppl_card _mar_b16">
                              <div className="row">
                                <div className="col-xl-3 col-lg-3 col-md-4 col-sm-4 col-3">
                                  <div className="_feed_inner_profile_story _b_radious6">
                                    <div className="_feed_inner_profile_story_image">
                                      <img src="/assets/images/card_ppl1.png" alt="Image" className="_profile_story_img" />
                                      <div className="_feed_inner_story_txt">
                                        <div className="_feed_inner_story_btn">
                                          <button className="_feed_inner_story_btn_link">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10">
                                              <path stroke="#fff" strokeLinecap="round" d="M.5 4.884h9M4.884 9.5v-9" />
                                            </svg>
                                          </button>
                                        </div>
                                        <p className="_feed_inner_story_para">Your Story</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {[2, 3, 4].map((i) => (
                                  <div className="col-xl-3 col-lg-3 col-md-4 col-sm-4 col-3" key={i}>
                                    <div className="_feed_inner_public_story _b_radious6">
                                      <div className="_feed_inner_public_story_image">
                                        <img src={`/assets/images/card_ppl${i}.png`} alt="Image" className="_public_story_img" />
                                        <div className="_feed_inner_pulic_story_txt">
                                          <p className="_feed_inner_pulic_story_para">Ryan Roslansky</p>
                                        </div>
                                        <div className="_feed_inner_public_mini">
                                          <img src="/assets/images/mini_pic.png" alt="Image" className="_public_mini_img" />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <PostForm onPostCreated={fetchPosts} />

                            {loading ? (
                              <p>Loading posts...</p>
                            ) : posts.length === 0 ? (
                              <p>No posts yet.</p>
                            ) : (
                              posts.map((post) => (
                                <PostCard key={post.id} post={post} />
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
                        <div className="_layout_right_sidebar_wrap">
                          <div className="_layout_right_sidebar_inner">
                            <div className="_feed_inner_area _padd_t24 _padd_b6 _padd_r24 _padd_l24 _b_radious6">
                              <div className="_feed_right_inner_area_card">
                                <div className="_feed_right_inner_area_card_form">
                                  <form>
                                    <svg className="_feed_right_inner_area_card_form_svg" xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 17 17">
                                      <circle cx="7" cy="7" r="6" stroke="#666" />
                                      <path stroke="#666" strokeLinecap="round" d="M16 16l-3-3" />
                                    </svg>
                                    <input className="_feed_right_inner_area_card_form_inpt" type="search" placeholder="input search text" />
                                  </form>
                                </div>
                                {[
                                  { name: 'Steve Jobs', role: 'CEO of Apple', img: 'f1.png' },
                                  { name: 'Sundar Pichai', role: 'CEO of Google', img: 'f2.png' },
                                  { name: 'Elon Musk', role: 'CEO of Tesla', img: 'f3.png' },
                                  { name: 'Mark Zuckberg', role: 'CEO of Meta', img: 'f4.png' },
                                  { name: 'Tim Cook', role: 'CEO of Apple', img: 'f5.png' },
                                ].map((person) => (
                                  <div className="_feed_right_inner_area_card_ppl" key={person.name}>
                                    <div className="_feed_right_inner_area_card_ppl_box">
                                      <div className="_feed_right_inner_area_card_ppl_image">
                                        <img src={`/assets/images/${person.img}`} alt="Image" className="_box_ppl_img" />
                                      </div>
                                      <div className="_feed_right_inner_area_card_ppl_txt">
                                        <h4 className="_feed_right_inner_area_card_ppl_title">{person.name}</h4>
                                        <p className="_feed_right_inner_area_card_ppl_para">{person.role}</p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <MobileNavigation />
        </div>
      </div>
    </AuthProvider>
  );
}
