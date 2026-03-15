import { useTranslation } from 'react-i18next';

export default function Testimonials() {
  const { t } = useTranslation();

  const testimonials = [
    {
      quoteKey: 'landing.testimonial1',
      author: {
        name: 'Emma Thompson',
        roleKey: 'landing.testimonial1Role',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b77c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100'
      },
      color: 'blue'
    },
    {
      quoteKey: 'landing.testimonial2',
      author: {
        name: 'Marcus Johnson',
        roleKey: 'landing.testimonial2Role',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100'
      },
      color: 'green'
    },
    {
      quoteKey: 'landing.testimonial3',
      author: {
        name: 'Sofia Rodriguez',
        roleKey: 'landing.testimonial3Role',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100'
      },
      color: 'purple'
    }
  ];

  return (
    <section className="testimonials animate-on-scroll">
      <div className="container">
        <div className="section-header">
          <h2>{t('landing.whatStudentsSay')}</h2>
          <p>{t('landing.testimonialsDesc')}</p>
        </div>
        
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className={`testimonial-card ${testimonial.color}`}>
              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="fas fa-star"></i>
                ))}
              </div>
              <p className="testimonial-quote">"{t(testimonial.quoteKey)}"</p>
              <div className="testimonial-author">
                <img 
                  src={testimonial.author.avatar} 
                  alt={testimonial.author.name}
                  className="author-avatar"
                />
                <div className="author-info">
                  <h4>{testimonial.author.name}</h4>
                  <p>{t(testimonial.author.roleKey)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
