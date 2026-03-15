import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function CTA() {
  const [email, setEmail] = useState('');
  const { t } = useTranslation();

  const handleSubscribe = () => {
    if (email) {
      alert('Thank you for subscribing to our newsletter!');
      setEmail('');
    }
  };

  return (
    <section className="cta animate-on-scroll">
      <div className="container">
        <h2>{t('landing.readyToLearn')}</h2>
        <p>{t('landing.joinStudents')}</p>
        
        <div className="cta-buttons">
          <button className="btn btn-white btn-lg">
            {t('landing.getStartedFree')}
          </button>
          <button className="btn btn-secondary btn-lg" style={{ borderColor: 'white', color: 'white' }}>
            {t('landing.scheduleDemo')}
          </button>
        </div>
        
        <div className="newsletter">
          <p>{t('landing.stayUpdated')}</p>
          <div className="newsletter-form">
            <input 
              type="email" 
              placeholder={t('landing.enterEmail')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="newsletter-input"
            />
            <button 
              onClick={handleSubscribe}
              className="newsletter-button"
            >
              {t('landing.subscribe')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
