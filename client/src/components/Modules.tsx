import { useTranslation } from 'react-i18next';

export default function Modules() {
  const { t } = useTranslation();

  const modules = [
    {
      titleKey: 'nav.aiBuddy',
      descKey: 'landing.aiBuddyModuleDesc',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=300'
    },
    {
      titleKey: 'nav.gamification',
      descKey: 'landing.gamificationModuleDesc',
      image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=300'
    },
    {
      titleKey: 'nav.arScienceLab',
      descKey: 'landing.arLabModuleDesc',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=300'
    }
  ];

  return (
    <section className="modules animate-on-scroll">
      <div className="container">
        <div className="section-header">
          <h2>{t('landing.popularModules')}</h2>
          <p>{t('landing.modulesDesc')}</p>
        </div>
        
        <div className="modules-grid">
          {modules.map((module, index) => (
            <div key={index} className="module-card">
              <img src={module.image} alt={t(module.titleKey)} />
              <div className="module-card-content">
                <h3>{t(module.titleKey)}</h3>
                <p>{t(module.descKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
