import { useTranslation } from 'react-i18next';

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="hero animate-on-scroll">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <h1>
              {t('landing.heroTitle')}{' '}
              <span className="highlight">{t('landing.heroHighlight')}</span>
            </h1>
            <p>
              {t('landing.heroSubtitle')}
            </p>
            <div className="hero-buttons">
              <button className="btn btn-primary btn-lg">
                {t('landing.getStartedFree')}
              </button>
              <button className="btn btn-secondary btn-lg">
                {t('landing.tryAiBuddy')}
              </button>
            </div>
          </div>
          <div className="hero-image">
            <img 
              src="https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="Students using AI technology in modern classroom" 
            />
          </div>
        </div>
      </div>
    </section>
  );
}
