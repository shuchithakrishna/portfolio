import React, { useState, useEffect } from 'react';
import { 
  Mail, Phone, ExternalLink, Search, 
  BookOpen, Award, FileText, CheckCircle2, ChevronRight,
  Code, Database, Server, Smartphone, Cpu, Check, HelpCircle
} from 'lucide-react';

const Github = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
);

const Linkedin = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

// Statically defined fallbacks if backend has no data
const FALLBACK_PROJECTS = [
  {
    id: 'f1',
    title: 'E-Commerce Backend REST API',
    description: 'A robust and scalable e-commerce RESTful API featuring JWT authentication, product catalog filters, order workflow management, and payment gateway integration mockups.',
    tech_list: ['Django', 'Python', 'PostgreSQL', 'Git'],
    github_link: 'https://github.com',
    live_link: 'https://example.com',
    image_display_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=60'
  },
  {
    id: 'f2',
    title: 'Dynamic Task Planner Dashboard',
    description: 'An interactive task management web application with Kanban boards, customizable labels, deadlines tracking, task priority ordering, and local storage state persistence.',
    tech_list: ['React', 'JavaScript', 'HTML', 'CSS'],
    github_link: 'https://github.com',
    live_link: 'https://example.com',
    image_display_url: 'https://images.unsplash.com/photo-1611224885990-ab7363d1f2a9?w=600&auto=format&fit=crop&q=60'
  },
  {
    id: 'f3',
    title: 'Personal Dev Portfolio Website',
    description: 'A gorgeous, responsive portfolio web application utilizing Django REST Framework for content management, React for UI, and custom Vanilla CSS glassmorphic aesthetics.',
    tech_list: ['React', 'Django', 'PostgreSQL', 'CSS'],
    github_link: 'https://github.com',
    live_link: 'https://example.com',
    image_display_url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=60'
  }
];

const FALLBACK_CERTS = [
  {
    id: 'c1',
    title: 'Meta React Developer Certificate',
    issuing_organization: 'Meta Coursera',
    issue_date: '2025-05-15',
    credential_id: 'META-RX-98214',
    credential_url: 'https://coursera.org',
    file_display_url: 'https://coursera.org'
  },
  {
    id: 'c2',
    title: 'Python for Databases and Backend REST Systems',
    issuing_organization: 'Google Developer Academy',
    issue_date: '2025-02-10',
    credential_id: 'GG-PYDB-44912',
    credential_url: 'https://grow.google',
    file_display_url: 'https://grow.google'
  },
  {
    id: 'c3',
    title: 'PostgreSQL Relational Database Administration',
    issuing_organization: 'NPTEL / IIT Kharagpur',
    issue_date: '2024-11-20',
    credential_id: 'NPTEL-CS-5582',
    credential_url: 'https://nptel.ac.in',
    file_display_url: 'https://nptel.ac.in'
  }
];

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [allTags, setAllTags] = useState(['All']);

  // Contact Form State
  const [formFields, setFormFields] = useState({ name: '', email: '', subject: '', message: '' });
  const [formErrors, setFormErrors] = useState({});
  const [formStatus, setFormStatus] = useState(null); // { type: 'success'|'error', text: '' }
  const [submitting, setSubmitting] = useState(false);

  // Cert Modal State
  const [selectedCert, setSelectedCert] = useState(null);

  // Fetch portfolio resources
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [projRes, certRes] = await Promise.allSettled([
          fetch(`${API_BASE_URL}/projects/`),
          fetch(`${API_BASE_URL}/certificates/`)
        ]);

        let fetchedProjects = [];
        let fetchedCerts = [];

        if (projRes.status === 'fulfilled' && projRes.value.ok) {
          fetchedProjects = await projRes.value.json();
        }
        if (certRes.status === 'fulfilled' && certRes.value.ok) {
          fetchedCerts = await certRes.value.json();
        }

        // Apply fallback if empty
        const finalProjects = fetchedProjects.length > 0 ? fetchedProjects : FALLBACK_PROJECTS;
        const finalCerts = fetchedCerts.length > 0 ? fetchedCerts : FALLBACK_CERTS;

        setProjects(finalProjects);
        setCerts(finalCerts);

        // Gather all unique tags from projects
        const tags = new Set(['All']);
        finalProjects.forEach(p => {
          if (p.tech_list && Array.isArray(p.tech_list)) {
            p.tech_list.forEach(t => tags.add(t));
          } else if (p.tech_stack) {
            p.tech_stack.split(',').forEach(t => tags.add(t.trim()));
          }
        });
        setAllTags(Array.from(tags));

      } catch (error) {
        console.error('Error fetching API portfolio data:', error);
        setProjects(FALLBACK_PROJECTS);
        setCerts(FALLBACK_CERTS);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Form Validation
  const validateForm = () => {
    const errors = {};
    if (!formFields.name.trim()) errors.name = 'Name is required';
    if (!formFields.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formFields.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formFields.message.trim()) errors.message = 'Message body is required';
    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormFields(prev => ({ ...prev, [name]: value }));
    // Clear validation error when typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setSubmitting(true);
      setFormStatus(null);

      const res = await fetch(`${API_BASE_URL}/contact/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formFields)
      });

      if (res.ok) {
        setFormStatus({ type: 'success', text: 'Thank you! Your message was submitted successfully. I will get back to you shortly!' });
        setFormFields({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error('Server returned an error');
      }
    } catch (error) {
      console.error(error);
      setFormStatus({ type: 'error', text: 'Ops! Something went wrong while saving your message. Please try again or reach out directly.' });
    } finally {
      setSubmitting(false);
    }
  };

  // Filter project cards logic
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesTag = selectedTag === 'All';
    if (!matchesTag) {
      if (project.tech_list) {
        matchesTag = project.tech_list.includes(selectedTag);
      } else if (project.tech_stack) {
        matchesTag = project.tech_stack.split(',').map(s => s.trim()).includes(selectedTag);
      }
    }
    return matchesSearch && matchesTag;
  });

  return (
    <div>
      {/* Loading Animation */}
      {loading && (
        <div className="loader-container flex-center">
          <div className="spinner"></div>
          <p style={{ fontWeight: 'bold', color: 'var(--text-secondary)' }}>Loading Portfolio...</p>
        </div>
      )}

      {/* Hero Section */}
      <section id="home" className="hero-sec">
        <div className="container grid-2" style={{ alignItems: 'center' }}>
          <div className="hero-content animate-slide-up">
            <span className="hero-intro">Welcome to my space</span>
            <h1 className="hero-name">Your Name</h1>
            <h2 className="hero-title">Computer Science Engineering Student</h2>
            <p className="hero-desc">
              Passionate full-stack developer committed to creating modular, highly optimized APIs, and sleek user-friendly layouts. Specializing in Python, Django, React, and Database design.
            </p>
            <div className="hero-ctas">
              <a href="#projects" className="btn btn-primary">
                View My Projects <ChevronRight size={16} />
              </a>
              <a href="#contact" className="btn btn-secondary">
                Let's Talk
              </a>
            </div>
            
            <div className="hero-socials">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hero-social-link" title="GitHub">
                <Github size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hero-social-link" title="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="mailto:your.email@example.com" className="hero-social-link" title="Email">
                <Mail size={20} />
              </a>
            </div>
          </div>

          <div className="hero-image-container animate-fade-in">
            <div className="hero-img-backdrop"></div>
            <img src="/profile.png" alt="Developer Profile" className="hero-img animate-float" />
          </div>
        </div>
      </section>

      {/* About Me Section */}
      <section id="about" className="section" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header">
            <h2>About Me</h2>
            <p>Education, objective, and what drives me</p>
          </div>

          <div className="grid-2" style={{ alignItems: 'center' }}>
            <div className="about-img-box">
              <img 
                src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=80" 
                alt="Workspace desk with codes" 
                className="about-img" 
              />
            </div>

            <div className="about-info">
              <h3>Developing with Purpose</h3>
              <p className="about-objective">
                Career Objective: Eager to apply acquired software design, web frameworks, and scripting skills to solve critical engineering challenges, while designing clean, robust, and customer-focused web systems.
              </p>
              <p className="about-text">
                I am a Computer Science Engineering student currently pursuing my Bachelor's degree. I enjoy diving into complex system operations and architecting responsive web applications. I love leveraging technologies like Python, Django, and React to turn abstract ideas into fully operational software products.
              </p>

              <h4 style={{ fontWeight: '700', marginBottom: '1rem' }}>Education Timeline</h4>
              <div className="education-timeline">
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-year">2023 - 2027 (Expected)</div>
                  <div className="timeline-title">Bachelor of Engineering in Computer Science</div>
                  <div className="timeline-school">Visvesvaraya Technological University</div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-year">2021 - 2023</div>
                  <div className="timeline-title">Pre-University Education (PCMC)</div>
                  <div className="timeline-school">State Pre-University Board</div>
                </div>
              </div>

              <h4 style={{ fontWeight: '700', marginTop: '2.5rem', marginBottom: '1rem' }}>Interests & Hobbies</h4>
              <div className="interests-grid">
                <div className="interest-tag">Software Development</div>
                <div className="interest-tag">Full-Stack Architecture</div>
                <div className="interest-tag">Database Tuning</div>
                <div className="interest-tag">Open Source Coding</div>
                <div className="interest-tag">Machine Learning</div>
                <div className="interest-tag">Technical Writing</div>
              </div>
              
              <div style={{ marginTop: '2.5rem' }}>
                {/* Mock Resume Download */}
                <a 
                  href="/profile.png" 
                  download="Resume.png" 
                  className="btn btn-outline"
                >
                  <FileText size={18} /> Download Resume
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="section">
        <div className="container">
          <div className="section-header">
            <h2>My Skills</h2>
            <p>My core programming stack and tools</p>
          </div>

          <div className="skills-categories-grid">
            {/* Front-End Card */}
            <div className="skill-category-card">
              <h3 className="skill-category-title">
                <Code size={20} /> Frontend Development
              </h3>
              <div className="skills-list">
                <div>
                  <div className="skill-item-info"><span>React</span><span>90%</span></div>
                  <div className="skill-bar-bg"><div className="skill-bar-fill" style={{ width: '90%' }}></div></div>
                </div>
                <div>
                  <div className="skill-item-info"><span>JavaScript (ES6+)</span><span>85%</span></div>
                  <div className="skill-bar-bg"><div className="skill-bar-fill" style={{ width: '85%' }}></div></div>
                </div>
                <div>
                  <div className="skill-item-info"><span>HTML5 / CSS3</span><span>95%</span></div>
                  <div className="skill-bar-bg"><div className="skill-bar-fill" style={{ width: '95%' }}></div></div>
                </div>
              </div>
            </div>

            {/* Back-End Card */}
            <div className="skill-category-card">
              <h3 className="skill-category-title">
                <Server size={20} /> Backend & Scripting
              </h3>
              <div className="skills-list">
                <div>
                  <div className="skill-item-info"><span>Django / Django REST</span><span>85%</span></div>
                  <div className="skill-bar-bg"><div className="skill-bar-fill" style={{ width: '85%' }}></div></div>
                </div>
                <div>
                  <div className="skill-item-info"><span>Python</span><span>90%</span></div>
                  <div className="skill-bar-bg"><div className="skill-bar-fill" style={{ width: '90%' }}></div></div>
                </div>
                <div>
                  <div className="skill-item-info"><span>Java</span><span>80%</span></div>
                  <div className="skill-bar-bg"><div className="skill-bar-fill" style={{ width: '80%' }}></div></div>
                </div>
              </div>
            </div>

            {/* Database & Tools Card */}
            <div className="skill-category-card">
              <h3 className="skill-category-title">
                <Database size={20} /> Databases & Utilities
              </h3>
              <div className="skills-list">
                <div>
                  <div className="skill-item-info"><span>PostgreSQL / MySQL</span><span>85%</span></div>
                  <div className="skill-bar-bg"><div className="skill-bar-fill" style={{ width: '85%' }}></div></div>
                </div>
                <div>
                  <div className="skill-item-info"><span>SQL queries & design</span><span>88%</span></div>
                  <div className="skill-bar-bg"><div className="skill-bar-fill" style={{ width: '88%' }}></div></div>
                </div>
                <div>
                  <div className="skill-item-info"><span>Git / GitHub versioning</span><span>90%</span></div>
                  <div className="skill-bar-bg"><div className="skill-bar-fill" style={{ width: '90%' }}></div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="section" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header">
            <h2>Projects</h2>
            <p>Explore some of my works and application models</p>
          </div>

          <div className="projects-controls">
            {/* Search Box */}
            <div className="search-box">
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search projects..." 
                className="search-input" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter Tags */}
            <div className="filter-tags">
              {allTags.map(tag => (
                <button 
                  key={tag}
                  className={`filter-tag ${selectedTag === tag ? 'active' : ''}`}
                  onClick={() => setSelectedTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          {filteredProjects.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '1.1rem', margin: '4rem 0' }}>
              No projects found matching the criteria. Try adjusting the tag filter or search terms!
            </p>
          ) : (
            <div className="grid-3 animate-fade-in">
              {filteredProjects.map(project => (
                <div key={project.id} className="project-card">
                  <div className="project-img-box">
                    <img 
                      src={project.image_display_url || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=60'} 
                      alt={project.title} 
                      className="project-img" 
                    />
                  </div>
                  <div className="project-content">
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-desc">{project.description}</p>
                    
                    <div className="project-techs">
                      {(project.tech_list || (project.tech_stack ? project.tech_stack.split(',').map(t=>t.trim()) : [])).map(tech => (
                        <span key={tech} className="project-tech-pill">{tech}</span>
                      ))}
                    </div>

                    <div className="project-links">
                      {project.github_link && (
                        <a href={project.github_link} target="_blank" rel="noopener noreferrer" className="project-link">
                          <Github size={16} /> Code
                        </a>
                      )}
                      {project.live_link && (
                        <a href={project.live_link} target="_blank" rel="noopener noreferrer" className="project-link primary-link">
                          <ExternalLink size={16} /> Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Certifications Section */}
      <section id="certifications" className="section">
        <div className="container">
          <div className="section-header">
            <h2>Certifications</h2>
            <p>Verification credentials and training milestones</p>
          </div>

          <div className="grid-3 animate-fade-in">
            {certs.map(cert => (
              <div key={cert.id} className="cert-card">
                <div className="cert-badge">
                  <Award size={28} />
                </div>
                <h3 className="cert-title">{cert.title}</h3>
                <p className="cert-issuer">{cert.issuing_organization}</p>
                <p className="cert-date">Issued: {cert.issue_date}</p>
                {cert.credential_id && (
                  <span className="cert-id">Credential: {cert.credential_id}</span>
                )}

                <div className="cert-actions">
                  {cert.credential_url && (
                    <a 
                      href={cert.credential_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="cert-btn primary-btn"
                    >
                      Verify Link
                    </a>
                  )}
                  {cert.file_display_url && (
                    <button 
                      className="cert-btn"
                      onClick={() => setSelectedCert(cert)}
                    >
                      View File
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certificate Viewer Lightbox Modal */}
      {selectedCert && (
        <div className="modal-overlay" onClick={() => setSelectedCert(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px', width: '90%' }}>
            <div className="modal-header">
              <h3 className="modal-title">{selectedCert.title}</h3>
              <button className="modal-close" onClick={() => setSelectedCert(null)}>✕</button>
            </div>
            
            <p style={{ marginBottom: '1.5rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
              Issuing Organization: {selectedCert.issuing_organization}
            </p>

            <div style={{ width: '100%', height: '500px', border: '1px solid var(--card-border)', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'var(--bg-tertiary)' }} className="flex-center">
              {/* Show file view preview inside the modal */}
              {selectedCert.file_display_url.endsWith('.pdf') ? (
                <iframe 
                  src={selectedCert.file_display_url} 
                  title={selectedCert.title}
                  width="100%" 
                  height="100%" 
                  style={{ border: 'none' }}
                />
              ) : (
                <img 
                  src={selectedCert.file_display_url} 
                  alt={selectedCert.title} 
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              )}
            </div>

            <div className="modal-actions">
              <a href={selectedCert.file_display_url} download target="_blank" rel="noreferrer" className="btn btn-primary">
                Download File
              </a>
              <button className="btn btn-secondary" onClick={() => setSelectedCert(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Section */}
      <section id="contact" className="section" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header">
            <h2>Contact Me</h2>
            <p>Get in touch for projects, queries, or collaboration opportunities</p>
          </div>

          <div className="contact-grid">
            <div className="contact-info-panel">
              <div className="contact-card">
                <div className="contact-icon">
                  <Mail />
                </div>
                <div className="contact-details">
                  <h4>Email</h4>
                  <p><a href="mailto:your.email@example.com">your.email@example.com</a></p>
                </div>
              </div>

              <div className="contact-card">
                <div className="contact-icon">
                  <Linkedin />
                </div>
                <div className="contact-details">
                  <h4>LinkedIn</h4>
                  <p><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">linkedin.com/in/yourprofile</a></p>
                </div>
              </div>

              <div className="contact-card">
                <div className="contact-icon">
                  <Github />
                </div>
                <div className="contact-details">
                  <h4>GitHub</h4>
                  <p><a href="https://github.com" target="_blank" rel="noopener noreferrer">github.com/yourprofile</a></p>
                </div>
              </div>

              <div className="contact-card">
                <div className="contact-icon">
                  <Phone />
                </div>
                <div className="contact-details">
                  <h4>Phone</h4>
                  <p>+91 98765 43210</p>
                </div>
              </div>
            </div>

            <div className="contact-form-panel">
              <form onSubmit={handleFormSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      className="form-control" 
                      value={formFields.name}
                      onChange={handleInputChange}
                    />
                    {formErrors.name && <div className="error-msg">{formErrors.name}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      className="form-control" 
                      value={formFields.email}
                      onChange={handleInputChange}
                    />
                    {formErrors.email && <div className="error-msg">{formErrors.email}</div>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input 
                    type="text" 
                    id="subject" 
                    name="subject" 
                    className="form-control" 
                    value={formFields.subject}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message Body *</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows="5" 
                    className="form-control" 
                    style={{ resize: 'vertical' }}
                    value={formFields.message}
                    onChange={handleInputChange}
                  ></textarea>
                  {formErrors.message && <div className="error-msg">{formErrors.message}</div>}
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ width: '100%', justifyContent: 'center' }}
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Send Message'}
                </button>

                {formStatus && (
                  <div className={`form-status ${formStatus.type}`}>
                    {formStatus.type === 'success' && <CheckCircle2 size={16} style={{ marginRight: '0.5rem', display: 'inline-block', verticalAlign: 'middle' }} />}
                    {formStatus.text}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;
