'use client';

import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';

export default function Navbar() {
  const { user } = useAuth();

  return (
    <div className="_header_wrapper">
      <div className="_header_wrap">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-2 col-lg-2 col-md-2 col-sm-2 col-3">
              <div className="_header_logo">
                <Link href="/feed">
                  <img src="/assets/images/logo.svg" alt="logo" className="_header_logo_img" />
                  <img src="/assets/images/logo.svg" alt="logo" className="_header_dark_logo_img" />
                </Link>
              </div>
            </div>
            <div className="col-xl-7 col-lg-7 col-md-7 _desktop_none">
              <div className="_header_form">
                <form action="#">
                  <svg className="_header_svg" xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 17 17">
                    <circle cx="7" cy="7" r="6" stroke="#666" />
                    <path stroke="#666" strokeLinecap="round" d="M16 16l-3-3" />
                  </svg>
                  <input type="search" className="_header_search" placeholder="Search here" />
                </form>
              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-10 col-sm-10 col-9">
              <div className="_header_right_wrap">
                <div className="_header_message _header_icon">
                  <Link href="#0">
                    <svg className="_dark_svg" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 22 22">
                      <path fill="#000" fillOpacity=".6" d="M11 0c6.075 0 11 4.925 11 11s-4.925 11-11 11S0 17.075 0 11 4.925 0 11 0zm0 20c4.963 0 9-4.038 9-9s-4.037-9-9-9-9 4.038-9 9 4.037 9 9 9zm4.9-11.4a.999.999 0 11-2 0c0-.4.2-.7.5-.9.2-.1.5-.2.7-.2.6 0 1 .4 1 1v.1h.1zm-9.8 0a.999.999 0 111-1c.4 0 .7.2.9.5.1.2.2.5.2.7 0 .6-.4 1-1 1h-.1v-.2h-1zM11 16c-2.4 0-4.5-1.6-5.1-3.8-.1-.4.1-.9.5-1 .4-.1.9.1 1 .5.4 1.5 1.9 2.5 3.5 2.5s3.1-1 3.5-2.5c.1-.4.6-.6 1-.5.4.1.6.6.5 1-.5 2.3-2.6 3.8-5 3.8h.1z" />
                    </svg>
                  </Link>
                </div>
                <div className="_header_notification _header_icon">
                  <Link href="#0">
                    <svg className="_dark_svg" xmlns="http://www.w3.org/2000/svg" width="20" height="22" fill="none" viewBox="0 0 20 22">
                      <path fill="#000" fillOpacity=".6" d="M10 22c-1.1 0-2-.9-2-2h4c0 1.1-.9 2-2 2zm9-3H1c-.6 0-1-.4-1-1s.4-1 1-1c.5 0 1-.5 1-1V9c0-3.9 3.1-7.1 7-7.4V1c0-.6.4-1 1-1s1 .4 1 1v.6c3.9.3 7 3.5 7 7.4v7c0 .5.5 1 1 1s1 .4 1 1-.4 1-1 1zM3 8v6h14V8c0-3.3-2.7-6-6-6S3 4.7 3 8z" />
                    </svg>
                    <span className="_counting">6</span>
                  </Link>
                </div>
                <div className="_header_profile _header_icon">
                  <Link href="#0">
                    <div className="_header_profile_box">
                      <div className="_header_profile_image">
                        <img src="/assets/images/post_img.png" alt="Image" className="_header_profile_img" />
                      </div>
                      <div className="_header_profile_txt">
                        <p className="_header_profile_para">
                          {user ? `${user.first_name} ${user.last_name}` : 'Loading...'}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="_header_bar _header_icon">
                  <div className="_header_bar_icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path fill="#000" fillOpacity=".6" d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
