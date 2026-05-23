'use client';

import { AuthProvider } from '@/app/context/AuthContext';
import Navbar from '@/components/Navbar';
import MobileNavigation from '@/components/MobileNavigation';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="_layout _layout_main_wrapper">
        <div className="_main_layout">
          <Navbar />
          <div className="container _custom_container">
            <div className="_layout_inner_wrap">
              <div className="row">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                  {children}
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
