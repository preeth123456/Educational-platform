import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Modules from '@/components/Modules';
import Testimonials from '@/components/Testimonials';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import Login from '@/pages/Login';

export default function LandingPage() {
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    // Scroll reveal animation
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(el => {
      observer.observe(el);
    });

    return () => {
      elements.forEach(el => {
        observer.unobserve(el);
      });
    };
  }, []);

  return (
    <div className="landing-page">
      <Header onLoginClick={() => setLoginOpen(true)} />
      <Hero />
      <Features />
      <Modules />
      <Testimonials />
      <CTA />
      <Footer />
      {loginOpen && (
        <div className="login-modal-overlay" onClick={() => setLoginOpen(false)}>
          <div className="login-modal" onClick={e => e.stopPropagation()}>
            <button className="login-modal-close" onClick={() => setLoginOpen(false)}>&times;</button>
            <Login />
          </div>
        </div>
      )}
    </div>
  );
}
