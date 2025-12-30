import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>MERN Todo App</h3>
          <p>Your personal productivity companion. Manage tasks, collaborate with others, and stay organized.</p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#help">Help</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Support</h4>
          <div className="support-info">
            <p>
              <span className="support-icon">📞</span>
              <a href="tel:0538817404">0538817404</a>
            </p>
            <p>
              <span className="support-icon">✉️</span>
              <a href="mailto:gilmazor1@outlook.com">gilmazor1@outlook.com</a>
            </p>
          </div>
        </div>

        <div className="footer-section">
          <h4>Legal</h4>
          <ul>
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#terms">Terms of Service</a></li>
            <li><a href="#cookies">Cookie Policy</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} MERN Todo App. All rights reserved.</p>
        <p className="footer-credits">Built with ❤️ using MERN Stack</p>
      </div>
    </footer>
  );
};

export default Footer;

