import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, X, LogOut, LayoutDashboard, User } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [activeSection, setActiveSection] = useState('home');
  
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  const isLoggedIn = !!localStorage.getItem('access_token');

  // Sync theme with DOM on mount and changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Handle scroll event for styling and scroll spying
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Simple scroll spy logic for portfolio sections
      if (!isAdminPage) {
        const sections = ['home', 'about', 'skills', 'projects', 'certifications', 'contact'];
        const scrollPosition = window.scrollY + 200;

        for (const section of sections) {
          const el = document.getElementById(section);
          if (el) {
            const top = el.offsetTop;
            const height = el.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
              setActiveSection(section);
              break;
            }
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAdminPage]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsMenuOpen(false);
    navigate('/');
  };

  const scrollToSection = (id) => {
    setIsMenuOpen(false);
    if (isAdminPage) {
      navigate('/', { replace: true });
      // Wait for navigation before scrolling
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <Link to="/" className="logo" onClick={() => scrollToSection('home')}>
          Portfolio
        </Link>

        {/* Desktop and Mobile Menu links */}
        {!isAdminPage ? (
          <ul className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
            <li>
              <button 
                onClick={() => scrollToSection('home')} 
                className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Home
              </button>
            </li>
            <li>
              <button 
                onClick={() => scrollToSection('about')} 
                className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                About
              </button>
            </li>
            <li>
              <button 
                onClick={() => scrollToSection('skills')} 
                className={`nav-link ${activeSection === 'skills' ? 'active' : ''}`}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Skills
              </button>
            </li>
            <li>
              <button 
                onClick={() => scrollToSection('projects')} 
                className={`nav-link ${activeSection === 'projects' ? 'active' : ''}`}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Projects
              </button>
            </li>
            <li>
              <button 
                onClick={() => scrollToSection('certifications')} 
                className={`nav-link ${activeSection === 'certifications' ? 'active' : ''}`}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Certifications
              </button>
            </li>
            <li>
              <button 
                onClick={() => scrollToSection('contact')} 
                className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Contact
              </button>
            </li>
          </ul>
        ) : (
          <ul className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
            <li>
              <Link 
                to="/" 
                className="nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Back to Site
              </Link>
            </li>
            {isLoggedIn && (
              <li>
                <Link 
                  to="/admin/dashboard" 
                  className={`nav-link ${location.pathname === '/admin/dashboard' ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </li>
            )}
          </ul>
        )}

        <div className="nav-actions">
          {/* Light/Dark Toggle */}
          <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle Theme">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {/* User / Logout */}
          {isLoggedIn ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {!isAdminPage && (
                <Link to="/admin/dashboard" className="theme-toggle-btn" title="Dashboard">
                  <LayoutDashboard size={20} />
                </Link>
              )}
              <button className="theme-toggle-btn" onClick={handleLogout} title="Logout">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            !isAdminPage && (
              <Link to="/admin/login" className="theme-toggle-btn" title="Admin Login">
                <User size={20} />
              </Link>
            )
          )}

          {/* Hamburger Menu Icon */}
          <button className="menu-btn" onClick={() => setIsMenuOpen(prev => !prev)} aria-label="Toggle Menu">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
