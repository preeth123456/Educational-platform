import { useTranslation } from 'react-i18next';

export default function Features() {
  const { t } = useTranslation();

  const features = [
    {
      icon: 'fas fa-robot',
      titleKey: 'landing.aiBuddyTitle',
      descKey: 'landing.aiBuddyDesc',
      color: 'blue'
    },
    {
      icon: 'fas fa-cube',
      titleKey: 'landing.arLearningTitle',
      descKey: 'landing.arLearningDesc',
      color: 'green'
    },
    {
      icon: 'fas fa-gamepad',
      titleKey: 'landing.gamifiedTitle',
      descKey: 'landing.gamifiedDesc',
      color: 'purple'
    },
    {
      icon: 'fas fa-user-cog',
      titleKey: 'landing.personalizedTitle',
      descKey: 'landing.personalizedDesc',
      color: 'orange'
    },
    {
      icon: 'fas fa-chart-line',
      titleKey: 'landing.analyticsTitle',
      descKey: 'landing.analyticsDesc',
      color: 'pink'
    },
    {
      icon: 'fas fa-cloud',
      titleKey: 'landing.learnAnywhereTitle',
      descKey: 'landing.learnAnywhereDesc',
      color: 'teal'
    }
  ];

  return (
    <section id="features" className="features animate-on-scroll">
      <div className="container">
        <div className="section-header">
          <h2>{t('landing.whyChoose')}</h2>
          <p>{t('landing.whyChooseDesc')}</p>
        </div>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className={`feature-card ${feature.color}`}>
              <div className={`feature-icon ${feature.color}`}>
                <i className={feature.icon}></i>
              </div>
              <h3>{t(feature.titleKey)}</h3>
              <p>{t(feature.descKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
