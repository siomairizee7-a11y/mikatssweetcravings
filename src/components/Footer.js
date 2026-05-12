export default function Footer({ setPage }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3>🎂 Mikat's Sweet Cravings</h3>
            <p>
              Baking with love to make every celebration sweeter. Located in San Jose, Antique,
              we deliver fresh, custom cakes to your doorstep.
            </p>
            <div className="social-links" style={{ marginTop: '1rem' }}>
              <a
                className="social-link"
                href="https://facebook.com/glory mae caldera"
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook"
              >f</a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li style={{ cursor: 'pointer' }} onClick={() => setPage('home')}>🏠 Home</li>
              <li style={{ cursor: 'pointer' }} onClick={() => setPage('products')}>🎂 Products</li>
              <li style={{ cursor: 'pointer' }} onClick={() => setPage('order')}>🛒 Order Now</li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contact Us</h4>
            <ul>
              <li>📞 0930-225-0223</li>
              <li>💚 GCash: 0962-353-7072</li>
              <li>👤 Glory Mae</li>
              <li>📍 Calixto Zaldivar St, San Jose, Antique</li>
              <li>🕐 Mon–Sat, 8AM–5PM</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2024 Mikat's Sweet Cravings. All rights reserved.</p>
          <p style={{ color: '#6B7280', fontSize: '0.82rem' }}>
            Free delivery within San Jose, Antique
          </p>
        </div>
      </div>
    </footer>
  );
}
