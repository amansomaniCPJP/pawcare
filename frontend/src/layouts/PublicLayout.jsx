import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';
import { Menu, X, PawPrint } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function PublicLayout({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--color-cream)' }}>
      <Navbar />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  );
}

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Adopt a Pet', href: '/pets' },
    { label: 'Pet Care', href: '/care-guide' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 'var(--z-sticky)',
        background: scrolled ? 'rgba(250,247,240,0.96)' : 'var(--color-cream)',
        backdropFilter: scrolled ? 'blur(8px)' : 'none',
        borderBottom: `1px solid ${scrolled ? 'var(--color-gray-100)' : 'transparent'}`,
        transition: 'all var(--transition-base)',
      }}
    >
      <div
        className="container"
        style={{
          height: 'var(--navbar-height)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
        }}
      >
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PawPrint size={20} color="#fff" fill="#fff" />
          </div>
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: 'var(--text-xl)',
              color: 'var(--color-primary)',
            }}
          >
            Pawhaven
          </span>
        </Link>

        <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {navLinks.map((link) => {
            const active = link.href === '/' ? location.pathname === '/' : location.pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                to={link.href}
                style={{
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-lg)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-semibold)',
                  color: active ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                  background: active ? 'var(--color-mint)' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="desktop-auth" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          {isAuthenticated ? (
            <>
              <Link
                to={user?.role === 'admin' ? '/admin' : '/app'}
                style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-secondary)', textDecoration: 'none' }}
              >
                Dashboard
              </Link>
              <Link to="/pets">
                <Button size="sm">Adopt Now</Button>
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-secondary)', textDecoration: 'none' }}
              >
                Login
              </Link>
              <Link to="/pets">
                <Button size="sm">Adopt Now</Button>
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="mobile-toggle"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: 'var(--color-text-primary)', display: 'none' }}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div style={{ background: '#fff', borderTop: '1px solid var(--color-gray-100)', padding: '16px', boxShadow: 'var(--shadow-md)' }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              style={{
                display: 'block',
                padding: '12px 16px',
                borderRadius: 'var(--radius-lg)',
                color: 'var(--color-text-secondary)',
                fontWeight: 600,
                textDecoration: 'none',
                marginBottom: '2px',
              }}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--color-gray-100)' }}>
            {isAuthenticated ? (
              <Link to="/app" style={{ flex: 1 }}>
                <Button variant="secondary" fullWidth>
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/login" style={{ flex: 1 }}>
                <Button variant="outline" fullWidth>
                  Login
                </Button>
              </Link>
            )}
            <Link to="/pets" style={{ flex: 1 }}>
              <Button fullWidth>Adopt Now</Button>
            </Link>
          </div>
        </div>
      )}

      <style>{`@media(max-width:900px){.desktop-nav,.desktop-auth{display:none!important;}.mobile-toggle{display:flex!important;}}`}</style>
    </header>
  );
}

function Footer() {
  const links = {
    Explore: [
      ['Available Pets', '/pets'],
      ['Pet Care Guide', '/care-guide'],
      ['About Pawhaven', '/about'],
      ['Contact Us', '/contact'],
    ],
    Adopt: [
      ['How to Adopt', '/about'],
      ['Adoption FAQ', '/contact'],
      ['Responsible Ownership', '/care-guide'],
    ],
    Account: [
      ['Sign Up', '/register'],
      ['Log In', '/login'],
      ['Dashboard', '/app'],
      ['My Applications', '/app/applications'],
    ],
  };
  return (
    <footer style={{ background: 'var(--color-text-primary)', color: 'rgba(255,255,255,0.7)', paddingTop: '56px' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '40px', marginBottom: '48px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '8px',
                  background: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <PawPrint size={16} color="#fff" fill="#fff" />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, color: '#fff', fontSize: 'var(--text-xl)' }}>
                Pawhaven
              </span>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', lineHeight: '1.65', maxWidth: '240px' }}>
              Connecting loving homes with pets that need them — and helping you care for them every day after.
            </p>
            <p style={{ fontSize: '11px', marginTop: '14px', color: 'rgba(255,255,255,0.35)', fontStyle: 'italic' }}>
              ⚠ Demo app — not a real adoption service.
            </p>
          </div>
          {Object.entries(links).map(([title, cols]) => (
            <div key={title}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: '#fff', fontSize: 'var(--text-base)', marginBottom: '14px' }}>
                {title}
              </h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                {cols.map(([label, href]) => (
                  <li key={label}>
                    <Link to={href} style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            padding: '22px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <p style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.35)' }}>
            © 2025 Pawhaven. Demo application — not a real adoption service.
          </p>
          <div style={{ display: 'flex', gap: '18px' }}>
            {['Privacy', 'Terms', 'Contact'].map((l) => (
              <a key={l} href="#" style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
