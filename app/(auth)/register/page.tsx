'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/app/context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [agree, setAgree] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();
    setError('');

    if (password !== repeatPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register(firstName, lastName, email, password);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      const fieldErrors = (err as Error & { errors?: Record<string, string[]> }).errors;
      if (fieldErrors) {
        const messages = Object.values(fieldErrors).flat();
        setError(messages.join('. '));
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="_social_registration_wrapper _layout_main_wrapper">
      <div className="_shape_one">
        <Image src="/assets/images/shape1.svg" alt="" className="_shape_img" width={176} height={540} />
        <Image src="/assets/images/dark_shape.svg" alt="" className="_dark_shape" width={176} height={540} />
      </div>
      <div className="_shape_two">
        <Image src="/assets/images/shape2.svg" alt="" className="_shape_img" width={568} height={400} />
        <Image src="/assets/images/dark_shape1.svg" alt="" className="_dark_shape _dark_shape_opacity" width={576} height={408} />
      </div>
      <div className="_shape_three">
        <Image src="/assets/images/shape3.svg" alt="" className="_shape_img" width={568} height={548} />
        <Image src="/assets/images/dark_shape2.svg" alt="" className="_dark_shape _dark_shape_opacity" width={568} height={548} />
      </div>
      <div className="_social_registration_wrap">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
              <div className="_social_registration_right">
                <div className="_social_registration_right_image">
                  <Image src="/assets/images/registration.png" alt="Image" width={1928} height={1422} />
                </div>
                <div className="_social_registration_right_image_dark">
                  <Image src="/assets/images/registration1.png" alt="Image" width={1928} height={1422} />
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
              <div className="_social_registration_content">
                <div className="_social_registration_right_logo _mar_b28">
                  <Image src="/assets/images/logo.svg" alt="Image" className="_right_logo" width={158} height={33} />
                </div>
                <p className="_social_registration_content_para _mar_b8">Get Started Now</p>
                <h4 className="_social_registration_content_title _titl4 _mar_b28">Registration</h4>
                <button type="button" className="_social_registration_content_btn _mar_b24">
                  <Image src="/assets/images/google.svg" alt="Image" className="_google_img" width={20} height={20} /> <span>Register with google</span>
                </button>
                <div className="_social_registration_content_bottom_txt _mar_b24"> <span>Or</span>
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="_social_registration_form">
                  <div className="row">
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8">First Name</label>
                        <input
                          type="text"
                          className="form-control _social_registration_input"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(e as unknown as React.FormEvent); }}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8">Last Name</label>
                        <input
                          type="text"
                          className="form-control _social_registration_input"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(e as unknown as React.FormEvent); }}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8">Email</label>
                        <input
                          type="email"
                          className="form-control _social_registration_input"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(e as unknown as React.FormEvent); }}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8">Password</label>
                        <input
                          type="password"
                          className="form-control _social_registration_input"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(e as unknown as React.FormEvent); }}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8">Repeat Password</label>
                        <input
                          type="password"
                          className="form-control _social_registration_input"
                          value={repeatPassword}
                          onChange={(e) => setRepeatPassword(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(e as unknown as React.FormEvent); }}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12">
                      <div className="form-check _social_registration_form_check">
                        <input
                          className="form-check-input _social_registration_form_check_input"
                          type="radio"
                          checked={agree}
                          onChange={() => setAgree(!agree)}
                        />
                        <label className="form-check-label _social_registration_form_check_label">I agree to terms & conditions</label>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12 col-md-12 col-xl-12 col-sm-12">
                      <div className="_social_registration_form_btn _mar_t24 _mar_b32">
                        <button type="button" className="_social_registration_form_btn_link _btn1" disabled={loading} onClick={handleSubmit}>
                          {loading ? 'Registering...' : 'Register now'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                    <div className="_social_registration_bottom_txt">
                      <p className="_social_registration_bottom_txt_para">Already have an account? <a href="/login">Login</a></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
