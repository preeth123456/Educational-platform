export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>
              <i className="fas fa-graduation-cap"></i> Eduyata
            </h3>
            <p>
              Revolutionizing education through AI-powered learning experiences that adapt to every student's needs.
            </p>
            <div className="social-links">
              <a href="#"><i className="fab fa-facebook-f"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-linkedin-in"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#">Home</a></li>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Features</a></li>
              <li><a href="#">Pricing</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Documentation</a></li>
              <li><a href="#">Community</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Contact</h4>
            <div>
              <p>
                <i className="fas fa-envelope"></i> support@eduyata.com
              </p>
              <p>
                <i className="fas fa-phone"></i> +1 (555) 123-4567
              </p>
              <p>
                <i className="fas fa-map-marker-alt"></i> 123 Education St, Learning City, LC 12345
              </p>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2024 Eduyata. All rights reserved. | Made with ❤️ for learners everywhere</p>
        </div>
      </div>
    </footer>
  );
}
