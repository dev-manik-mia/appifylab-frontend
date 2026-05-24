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
      setPosts(res.data as Post[]);
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
        <div className="_layout_mode_swithing_btn">
          <button type="button" className="_layout_swithing_btn_link">
            <div className="_layout_swithing_btn">
              <div className="_layout_swithing_btn_round"></div>
            </div>
            <div className="_layout_change_btn_ic1">
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="16" fill="none" viewBox="0 0 11 16">
                <path fill="#fff" d="M2.727 14.977l.04-.498-.04.498zm-1.72-.49l.489-.11-.489.11zM3.232 1.212L3.514.8l-.282.413zM9.792 8a6.5 6.5 0 00-6.5-6.5v-1a7.5 7.5 0 017.5 7.5h-1zm-6.5 6.5a6.5 6.5 0 006.5-6.5h1a7.5 7.5 0 01-7.5 7.5v-1zm-.525-.02c.173.013.348.02.525.02v1c-.204 0-.405-.008-.605-.024l.08-.997zm-.261-1.83A6.498 6.498 0 005.792 7h1a7.498 7.498 0 01-3.791 6.52l-.495-.87zM5.792 7a6.493 6.493 0 00-2.841-5.374L3.514.8A7.493 7.493 0 016.792 7h-1zm-3.105 8.476c-.528-.042-.985-.077-1.314-.155-.316-.075-.746-.242-.854-.726l.977-.217c-.028-.124-.145-.09.106-.03.237.056.6.086 1.165.131l-.08.997zm.314-1.956c-.622.354-1.045.596-1.31.792a.967.967 0 00-.204.185c-.01.013.027-.038.009-.12l-.977.218a.836.836 0 01.144-.666c.112-.162.27-.3.433-.42.324-.24.814-.519 1.41-.858L3 13.52zM3.292 1.5a.391.391 0 00.374-.285A.382.382 0 003.514.8l-.563.826A.618.618 0 012.702.95a.609.609 0 01.59-.45v1z" />
              </svg>
            </div>
            <div className="_layout_change_btn_ic2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="4.389" stroke="#fff" transform="rotate(-90 12 12)" />
                <path stroke="#fff" strokeLinecap="round" d="M3.444 12H1M23 12h-2.444M5.95 5.95L4.222 4.22M19.778 19.779L18.05 18.05M12 3.444V1M12 23v-2.445M18.05 5.95l1.728-1.729M4.222 19.779L5.95 18.05" />
              </svg>
            </div>
          </button>
        </div>
        <div className="_main_layout">
          <Navbar />
          <div className="_header_mobile_menu">
            <div className="_header_mobile_menu_wrap">
              <div className="container">
                <div className="_header_mobile_menu">
                  <div className="row">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_header_mobile_menu_top_inner">
                        <div className="_header_mobile_menu_logo">
                          <a href="/" className="_mobile_logo_link">
                            <img src="/assets/images/logo.svg" alt="Image" className="_nav_logo" />
                          </a>
                        </div>
                        <div className="_header_mobile_menu_right">
                          <form className="_header_form_grp">
                            <a href="#0" className="_header_mobile_search">
                              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 17 17">
                                <circle cx="7" cy="7" r="6" stroke="#666" />
                                <path stroke="#666" strokeLinecap="round" d="M16 16l-3-3" />
                              </svg>
                            </a>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
                              <div className="_feed_inner_story_arrow">
                                <button type="button" className="_feed_inner_story_arrow_btn">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="9" height="8" fill="none" viewBox="0 0 9 8">
                                    <path fill="#fff" d="M8 4l.366-.341.318.341-.318.341L8 4zm-7 .5a.5.5 0 010-1v1zM5.566.659l2.8 3-.732.682-2.8-3L5.566.66zm2.8 3.682l-2.8 3-.732-.682 2.8-3 .732.682zM8 4.5H1v-1h7v1z" />
                                  </svg>
                                </button>
                              </div>
                              <div className="row">
                                <div className="col-xl-3 col-lg-3 col-md-4 col-sm-4 col">
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
                                {[
                                  { i: 2, cls: 'col' },
                                  { i: 3, cls: '_custom_mobile_none' },
                                  { i: 4, cls: '_custom_none' },
                                ].map(({ i, cls }) => (
                                  <div className={`col-xl-3 col-lg-3 col-md-4 col-sm-4 ${cls}`} key={i}>
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

                            <div className="_feed_inner_ppl_card_mobile _mar_b16">
                              <div className="_feed_inner_ppl_card_area">
                                <ul className="_feed_inner_ppl_card_area_list">
                                  <li className="_feed_inner_ppl_card_area_item">
                                    <a href="#0" className="_feed_inner_ppl_card_area_link">
                                      <div className="_feed_inner_ppl_card_area_story">
                                        <img src="/assets/images/mobile_story_img.png" alt="Image" className="_card_story_img" />
                                        <div className="_feed_inner_ppl_btn">
                                          <button className="_feed_inner_ppl_btn_link" type="button">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 12 12">
                                              <path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" d="M6 2.5v7M2.5 6h7" />
                                            </svg>
                                          </button>
                                        </div>
                                      </div>
                                      <p className="_feed_inner_ppl_card_area_link_txt">Your Story</p>
                                    </a>
                                  </li>
                                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                                    <li className="_feed_inner_ppl_card_area_item" key={i}>
                                      <a href="#0" className="_feed_inner_ppl_card_area_link">
                                        <div className={i % 2 === 0 ? '_feed_inner_ppl_card_area_story_active' : '_feed_inner_ppl_card_area_story_inactive'}>
                                          <img src={`/assets/images/mobile_story_img${(i % 3) + 1}.png`} alt="Image" className="_card_story_img1" />
                                        </div>
                                        <p className="_feed_inner_ppl_card_area_txt">Ryan...</p>
                                      </a>
                                    </li>
                                  ))}
                                </ul>
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
                            <div className="_right_inner_area_info _padd_t24 _padd_b24 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
                              <div className="_right_inner_area_info_content _mar_b24">
                                <h4 className="_right_inner_area_info_content_title _title5">You Might Like</h4>
                                <span className="_right_inner_area_info_content_txt">
                                  <a className="_right_inner_area_info_content_txt_link" href="#0">See All</a>
                                </span>
                              </div>
                              <hr className="_underline" />
                              {[
                                { name: 'Radovan SkillArena', role: 'Founder & CEO at Trophy', img: 'Avatar.png' },
                              ].map((person) => (
                                <div className="_right_inner_area_info_ppl" key={person.name}>
                                  <div className="_right_inner_area_info_box">
                                    <div className="_right_inner_area_info_box_image">
                                      <a href="profile.html">
                                        <img src={`/assets/images/${person.img}`} alt="Image" className="_ppl_img" />
                                      </a>
                                    </div>
                                    <div className="_right_inner_area_info_box_txt">
                                      <a href="profile.html">
                                        <h4 className="_right_inner_area_info_box_title">{person.name}</h4>
                                      </a>
                                      <p className="_right_inner_area_info_box_para">{person.role}</p>
                                    </div>
                                  </div>
                                  <div className="_right_info_btn_grp">
                                    <button type="button" className="_right_info_btn_link">Ignore</button>
                                    <button type="button" className="_right_info_btn_link _right_info_btn_link_active">Follow</button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="_layout_right_sidebar_inner">
                            <div className="_feed_right_inner_area_card _padd_t24 _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
                              <div className="_feed_top_fixed">
                                <div className="_feed_right_inner_area_card_content _mar_b24">
                                  <h4 className="_feed_right_inner_area_card_content_title _title5">Your Friends</h4>
                                  <span className="_feed_right_inner_area_card_content_txt">
                                    <a className="_feed_right_inner_area_card_content_txt_link" href="find-friends.html">See All</a>
                                  </span>
                                </div>
                                <form className="_feed_right_inner_area_card_form">
                                  <svg className="_feed_right_inner_area_card_form_svg" xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 17 17">
                                    <circle cx="7" cy="7" r="6" stroke="#666" />
                                    <path stroke="#666" strokeLinecap="round" d="M16 16l-3-3" />
                                  </svg>
                                  <input className="form-control me-2 _feed_right_inner_area_card_form_inpt" type="search" placeholder="input search text" aria-label="Search" />
                                </form>
                              </div>
                              <div className="_feed_bottom_fixed">
                                {[
                                  { name: 'Steve Jobs', role: 'CEO of Apple', img: 'people1.png', status: 'inactive', time: '5 minute ago' },
                                  { name: 'Ryan Roslansky', role: 'CEO of Linkedin', img: 'people2.png', status: 'online' },
                                  { name: 'Dylan Field', role: 'CEO of Figma', img: 'people3.png', status: 'online' },
                                  { name: 'Steve Jobs', role: 'CEO of Apple', img: 'people1.png', status: 'inactive', time: '5 minute ago' },
                                  { name: 'Ryan Roslansky', role: 'CEO of Linkedin', img: 'people2.png', status: 'online' },
                                  { name: 'Dylan Field', role: 'CEO of Figma', img: 'people3.png', status: 'online' },
                                  { name: 'Dylan Field', role: 'CEO of Figma', img: 'people3.png', status: 'online' },
                                  { name: 'Steve Jobs', role: 'CEO of Apple', img: 'people1.png', status: 'inactive', time: '5 minute ago' },
                                ].map((person, i) => (
                                  <div className={`_feed_right_inner_area_card_ppl ${person.status === 'inactive' ? '_feed_right_inner_area_card_ppl_inactive' : ''}`} key={i}>
                                    <div className="_feed_right_inner_area_card_ppl_box">
                                      <div className="_feed_right_inner_area_card_ppl_image">
                                        <a href="profile.html">
                                          <img src={`/assets/images/${person.img}`} alt="" className="_box_ppl_img" />
                                        </a>
                                      </div>
                                      <div className="_feed_right_inner_area_card_ppl_txt">
                                        <a href="profile.html">
                                          <h4 className="_feed_right_inner_area_card_ppl_title">{person.name}</h4>
                                        </a>
                                        <p className="_feed_right_inner_area_card_ppl_para">{person.role}</p>
                                      </div>
                                    </div>
                                    <div className="_feed_right_inner_area_card_ppl_side">
                                      {person.status === 'online' ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 14 14">
                                          <rect width="12" height="12" x="1" y="1" fill="#0ACF83" stroke="#fff" strokeWidth="2" rx="6" />
                                        </svg>
                                      ) : (
                                        <span>{person.time}</span>
                                      )}
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
