import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FolderGit2, Award, MailOpen, Plus, Trash2, Edit2, 
  Save, X, LogOut, Check, CheckSquare, MessageSquare, AlertCircle
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('projects');
  
  // Data States
  const [projects, setProjects] = useState([]);
  const [certs, setCerts] = useState([]);
  const [messages, setMessages] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [actionError, setActionError] = useState('');

  // Modals States
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [currentProject, setCurrentProject] = useState(null); // null for create, object for edit
  const [projectForm, setProjectForm] = useState({
    title: '', description: '', tech_stack: '', github_link: '', live_link: '', image_url: ''
  });
  const [projectFile, setProjectFile] = useState(null);

  const [showCertModal, setShowCertModal] = useState(false);
  const [currentCert, setCurrentCert] = useState(null); // null for create, object for edit
  const [certForm, setCertForm] = useState({
    title: '', issuing_organization: '', issue_date: '', credential_id: '', credential_url: '', file_url: ''
  });
  const [certFile, setCertFile] = useState(null);

  // Authenticated fetch wrapper with automatic JWT token refreshing
  const fetchWithAuth = async (url, options = {}) => {
    let token = localStorage.getItem('access_token');
    if (!options.headers) options.headers = {};
    
    // Set headers
    if (!(options.body instanceof FormData)) {
      options.headers['Content-Type'] = 'application/json';
    }
    options.headers['Authorization'] = `Bearer ${token}`;

    let res = await fetch(url, options);

    if (res.status === 401) {
      // Access token expired, attempt token refresh
      const refresh = localStorage.getItem('refresh_token');
      if (refresh) {
        try {
          const refreshRes = await fetch(`${API_BASE_URL}/token/refresh/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh })
          });

          if (refreshRes.ok) {
            const refreshData = await refreshRes.json();
            localStorage.setItem('access_token', refreshData.access);
            
            // Retry original request
            options.headers['Authorization'] = `Bearer ${refreshData.access}`;
            res = await fetch(url, options);
            return res;
          }
        } catch (err) {
          console.error('Refresh token failed:', err);
        }
      }

      // If refresh fails, log out
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      navigate('/admin/login', { replace: true });
      throw new Error('Authentication expired. Please log in again.');
    }

    return res;
  };

  // Fetch resource data based on active tab
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setActionError('');
      try {
        if (activeTab === 'projects') {
          const res = await fetch(`${API_BASE_URL}/projects/`);
          if (res.ok) {
            const data = await res.json();
            setProjects(data);
          }
        } else if (activeTab === 'certs') {
          const res = await fetch(`${API_BASE_URL}/certificates/`);
          if (res.ok) {
            const data = await res.json();
            setCerts(data);
          }
        } else if (activeTab === 'messages') {
          const res = await fetchWithAuth(`${API_BASE_URL}/contact/`);
          if (res.ok) {
            const data = await res.json();
            setMessages(data);
          }
        }
      } catch (err) {
        console.error(err);
        setActionError('Failed to fetch data from the server. Check logs.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/');
  };

  // ================= PROJECT CRUD ACTIONS =================

  const openProjectModal = (proj = null) => {
    setCurrentProject(proj);
    if (proj) {
      setProjectForm({
        title: proj.title || '',
        description: proj.description || '',
        tech_stack: proj.tech_stack || '',
        github_link: proj.github_link || '',
        live_link: proj.live_link || '',
        image_url: proj.image_url || ''
      });
    } else {
      setProjectForm({
        title: '', description: '', tech_stack: '', github_link: '', live_link: '', image_url: ''
      });
    }
    setProjectFile(null);
    setShowProjectModal(true);
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setActionError('');
    
    // Create FormData body
    const formData = new FormData();
    formData.append('title', projectForm.title);
    formData.append('description', projectForm.description);
    formData.append('tech_stack', projectForm.tech_stack);
    formData.append('github_link', projectForm.github_link);
    formData.append('live_link', projectForm.live_link);
    formData.append('image_url', projectForm.image_url);
    if (projectFile) {
      formData.append('image', projectFile);
    }

    try {
      const url = currentProject 
        ? `${API_BASE_URL}/projects/${currentProject.id}/` 
        : `${API_BASE_URL}/projects/`;
      const method = currentProject ? 'PUT' : 'POST';

      const res = await fetchWithAuth(url, {
        method,
        body: formData
      });

      if (res.ok) {
        const savedProject = await res.json();
        if (currentProject) {
          setProjects(prev => prev.map(p => p.id === currentProject.id ? savedProject : p));
        } else {
          setProjects(prev => [savedProject, ...prev]);
        }
        setShowProjectModal(false);
      } else {
        const errorData = await res.json();
        setActionError(JSON.stringify(errorData) || 'Failed to submit project data.');
      }
    } catch (err) {
      console.error(err);
      setActionError('Error submitting project.');
    }
  };

  const deleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    setActionError('');
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/projects/${id}/`, { method: 'DELETE' });
      if (res.ok) {
        setProjects(prev => prev.filter(p => p.id !== id));
      } else {
        setActionError('Failed to delete project.');
      }
    } catch (err) {
      console.error(err);
      setActionError('Error deleting project.');
    }
  };

  // ================= CERTIFICATE CRUD ACTIONS =================

  const openCertModal = (cert = null) => {
    setCurrentCert(cert);
    if (cert) {
      setCertForm({
        title: cert.title || '',
        issuing_organization: cert.issuing_organization || '',
        issue_date: cert.issue_date || '',
        credential_id: cert.credential_id || '',
        credential_url: cert.credential_url || '',
        file_url: cert.file_url || ''
      });
    } else {
      setCertForm({
        title: '', issuing_organization: '', issue_date: '', credential_id: '', credential_url: '', file_url: ''
      });
    }
    setCertFile(null);
    setShowCertModal(true);
  };

  const handleCertSubmit = async (e) => {
    e.preventDefault();
    setActionError('');

    const formData = new FormData();
    formData.append('title', certForm.title);
    formData.append('issuing_organization', certForm.issuing_organization);
    formData.append('issue_date', certForm.issue_date);
    formData.append('credential_id', certForm.credential_id);
    formData.append('credential_url', certForm.credential_url);
    formData.append('file_url', certForm.file_url);
    if (certFile) {
      formData.append('file', certFile);
    }

    try {
      const url = currentCert 
        ? `${API_BASE_URL}/certificates/${currentCert.id}/` 
        : `${API_BASE_URL}/certificates/`;
      const method = currentCert ? 'PUT' : 'POST';

      const res = await fetchWithAuth(url, {
        method,
        body: formData
      });

      if (res.ok) {
        const savedCert = await res.json();
        if (currentCert) {
          setCerts(prev => prev.map(c => c.id === currentCert.id ? savedCert : c));
        } else {
          setCerts(prev => [savedCert, ...prev]);
        }
        setShowCertModal(false);
      } else {
        const errorData = await res.json();
        setActionError(JSON.stringify(errorData) || 'Failed to submit certificate data.');
      }
    } catch (err) {
      console.error(err);
      setActionError('Error submitting certificate.');
    }
  };

  const deleteCert = async (id) => {
    if (!window.confirm('Are you sure you want to delete this certificate?')) return;
    setActionError('');
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/certificates/${id}/`, { method: 'DELETE' });
      if (res.ok) {
        setCerts(prev => prev.filter(c => c.id !== id));
      } else {
        setActionError('Failed to delete certificate.');
      }
    } catch (err) {
      console.error(err);
      setActionError('Error deleting certificate.');
    }
  };

  // ================= MESSAGES ACTIONS =================

  const deleteMessage = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    setActionError('');
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/contact/${id}/`, { method: 'DELETE' });
      if (res.ok) {
        setMessages(prev => prev.filter(m => m.id !== id));
      } else {
        setActionError('Failed to delete message.');
      }
    } catch (err) {
      console.error(err);
      setActionError('Error deleting message.');
    }
  };

  const toggleMessageRead = async (msg) => {
    setActionError('');
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/contact/${msg.id}/`, {
        method: 'PATCH',
        body: JSON.stringify({ read_status: !msg.read_status })
      });
      if (res.ok) {
        const updated = await res.json();
        setMessages(prev => prev.map(m => m.id === msg.id ? updated : m));
      } else {
        setActionError('Failed to toggle read status.');
      }
    } catch (err) {
      console.error(err);
      setActionError('Error changing read status.');
    }
  };

  return (
    <div className="admin-layout">
      {/* Admin Header */}
      <header className="admin-header">
        <div className="admin-title">
          <FolderGit2 size={24} style={{ color: 'var(--primary-color)' }} />
          <span>Portfolio Admin Portal</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <button className="btn btn-secondary" onClick={() => navigate('/')}>
            View Website
          </button>
          <button 
            onClick={handleLogout} 
            className="btn btn-danger" 
            style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', borderRadius: '8px' }}
          >
            <LogOut size={16} /> Log Out
          </button>
        </div>
      </header>

      {/* Admin Body Content */}
      <main className="admin-body">
        <div className="container">
          
          {actionError && (
            <div className="form-status error" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={18} />
              <span>{actionError}</span>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="admin-nav" style={{ marginBottom: '2rem' }}>
            <button 
              className={`admin-nav-btn ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => setActiveTab('projects')}
            >
              <FolderGit2 size={16} style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} /> Projects
            </button>
            <button 
              className={`admin-nav-btn ${activeTab === 'certs' ? 'active' : ''}`}
              onClick={() => setActiveTab('certs')}
            >
              <Award size={16} style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} /> Certifications
            </button>
            <button 
              className={`admin-nav-btn ${activeTab === 'messages' ? 'active' : ''}`}
              onClick={() => setActiveTab('messages')}
            >
              <MailOpen size={16} style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} /> Inbound Messages
            </button>
          </div>

          {/* Loading status */}
          {loading && (
            <div style={{ textAlign: 'center', margin: '3rem 0', color: 'var(--text-muted)' }}>
              <p>Loading database resources...</p>
            </div>
          )}

          {/* ================= TAB: PROJECTS ================= */}
          {!loading && activeTab === 'projects' && (
            <div className="admin-card animate-fade-in">
              <div className="admin-toolbar">
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800' }}>Projects Directory</h3>
                <button className="btn btn-primary" onClick={() => openProjectModal(null)}>
                  <Plus size={16} /> Add New Project
                </button>
              </div>

              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Project Title</th>
                      <th>Tech Stack</th>
                      <th>URLs</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.length === 0 ? (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No projects found in database. Click Add Project to register one!</td>
                      </tr>
                    ) : (
                      projects.map(proj => (
                        <tr key={proj.id}>
                          <td>
                            <img 
                              src={proj.image_display_url || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=100'} 
                              alt={proj.title} 
                              style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                            />
                          </td>
                          <td style={{ fontWeight: '700' }}>{proj.title}</td>
                          <td>
                            {proj.tech_stack}
                          </td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', fontSize: '0.8rem' }}>
                              {proj.github_link && <a href={proj.github_link} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-color)' }}>Github ↗</a>}
                              {proj.live_link && <a href={proj.live_link} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-color)' }}>Live Demo ↗</a>}
                            </div>
                          </td>
                          <td>
                            <div className="admin-actions">
                              <button className="admin-icon-btn edit" onClick={() => openProjectModal(proj)} title="Edit">
                                <Edit2 size={16} />
                              </button>
                              <button className="admin-icon-btn delete" onClick={() => deleteProject(proj.id)} title="Delete">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= TAB: CERTIFICATIONS ================= */}
          {!loading && activeTab === 'certs' && (
            <div className="admin-card animate-fade-in">
              <div className="admin-toolbar">
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800' }}>Certifications Log</h3>
                <button className="btn btn-primary" onClick={() => openCertModal(null)}>
                  <Plus size={16} /> Add Certificate
                </button>
              </div>

              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Organization</th>
                      <th>Date</th>
                      <th>Credential ID</th>
                      <th>File Link</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {certs.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No certifications registered yet.</td>
                      </tr>
                    ) : (
                      certs.map(cert => (
                        <tr key={cert.id}>
                          <td style={{ fontWeight: '700' }}>{cert.title}</td>
                          <td>{cert.issuing_organization}</td>
                          <td>{cert.issue_date}</td>
                          <td><span className="cert-id" style={{ margin: 0 }}>{cert.credential_id || 'N/A'}</span></td>
                          <td>
                            {cert.file_display_url ? (
                              <a href={cert.file_display_url} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-color)' }}>View File ↗</a>
                            ) : 'None'}
                          </td>
                          <td>
                            <div className="admin-actions">
                              <button className="admin-icon-btn edit" onClick={() => openCertModal(cert)} title="Edit">
                                <Edit2 size={16} />
                              </button>
                              <button className="admin-icon-btn delete" onClick={() => deleteCert(cert.id)} title="Delete">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= TAB: MESSAGES ================= */}
          {!loading && activeTab === 'messages' && (
            <div className="admin-card animate-fade-in">
              <div className="admin-toolbar">
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800' }}>Inbound Inquiries Inbox</h3>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>
                  Total Submissions: {messages.length}
                </span>
              </div>

              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Sender</th>
                      <th>Subject</th>
                      <th>Message Body</th>
                      <th>Date Received</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No contact inquiries found. Form submissions from the landing page will show up here.</td>
                      </tr>
                    ) : (
                      messages.map(msg => (
                        <tr key={msg.id} style={{ opacity: msg.read_status ? 0.7 : 1, backgroundColor: msg.read_status ? 'transparent' : 'var(--primary-glow)' }}>
                          <td>
                            <button 
                              className="admin-icon-btn" 
                              onClick={() => toggleMessageRead(msg)} 
                              title={msg.read_status ? "Mark Unread" : "Mark Read"}
                              style={{ color: msg.read_status ? 'var(--text-muted)' : 'var(--success)', borderColor: msg.read_status ? 'var(--card-border)' : 'var(--success)' }}
                            >
                              <CheckSquare size={16} />
                            </button>
                          </td>
                          <td>
                            <div style={{ fontWeight: '700' }}>{msg.name}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{msg.email}</div>
                          </td>
                          <td style={{ fontWeight: '600' }}>{msg.subject || '(No Subject)'}</td>
                          <td style={{ maxWidth: '300px', whiteSpace: 'normal', wordBreak: 'break-word', fontSize: '0.9rem' }}>
                            {msg.message}
                          </td>
                          <td style={{ fontSize: '0.8rem' }}>{new Date(msg.created_at).toLocaleString()}</td>
                          <td>
                            <button className="admin-icon-btn delete" onClick={() => deleteMessage(msg.id)} title="Delete message">
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ================= MODAL: ADD/EDIT PROJECT ================= */}
      {showProjectModal && (
        <div className="modal-overlay" onClick={() => setShowProjectModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{currentProject ? 'Modify Project' : 'Create New Project'}</h3>
              <button className="modal-close" onClick={() => setShowProjectModal(false)}>✕</button>
            </div>

            <form onSubmit={handleProjectSubmit}>
              <div className="form-group">
                <label>Project Title *</label>
                <input 
                  type="text" 
                  required
                  className="form-control"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea 
                  required
                  rows="4"
                  className="form-control"
                  value={projectForm.description}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
                ></textarea>
              </div>

              <div className="form-group">
                <label>Technologies Stack * (comma separated)</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. React, Django, PostgreSQL"
                  className="form-control"
                  value={projectForm.tech_stack}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, tech_stack: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label>GitHub Code URL</label>
                <input 
                  type="url" 
                  placeholder="https://github.com/..."
                  className="form-control"
                  value={projectForm.github_link}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, github_link: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label>Live Demo URL</label>
                <input 
                  type="url" 
                  placeholder="https://..."
                  className="form-control"
                  value={projectForm.live_link}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, live_link: e.target.value }))}
                />
              </div>

              <div className="form-group" style={{ border: '1px solid var(--card-border)', padding: '1rem', borderRadius: '8px', marginTop: '1.5rem' }}>
                <label style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>Project Cover Banner</label>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label htmlFor="proj_file" style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Upload Local File</label>
                  <input 
                    type="file" 
                    id="proj_file"
                    accept="image/*"
                    onChange={(e) => setProjectFile(e.target.files[0])}
                  />
                  {currentProject?.image && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Currently: {currentProject.image.split('/').pop()}</div>}
                </div>

                <div style={{ textAlign: 'center', margin: '0.5rem 0', fontWeight: 'bold', fontSize: '0.8rem', color: 'var(--text-muted)' }}>— OR —</div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Paste External Image URL</label>
                  <input 
                    type="url" 
                    placeholder="https://images.unsplash.com/..."
                    className="form-control"
                    value={projectForm.image_url}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, image_url: e.target.value }))}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">
                  <Save size={16} /> Save Changes
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowProjectModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD/EDIT CERTIFICATE ================= */}
      {showCertModal && (
        <div className="modal-overlay" onClick={() => setShowCertModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{currentCert ? 'Modify Certificate' : 'Create Certificate'}</h3>
              <button className="modal-close" onClick={() => setShowCertModal(false)}>✕</button>
            </div>

            <form onSubmit={handleCertSubmit}>
              <div className="form-group">
                <label>Certificate Title *</label>
                <input 
                  type="text" 
                  required
                  className="form-control"
                  value={certForm.title}
                  onChange={(e) => setCertForm(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label>Issuing Organization *</label>
                <input 
                  type="text" 
                  required
                  className="form-control"
                  value={certForm.issuing_organization}
                  onChange={(e) => setCertForm(prev => ({ ...prev, issuing_organization: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label>Issue Date *</label>
                <input 
                  type="date" 
                  required
                  className="form-control"
                  value={certForm.issue_date}
                  onChange={(e) => setCertForm(prev => ({ ...prev, issue_date: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label>Credential ID</label>
                <input 
                  type="text" 
                  placeholder="e.g. UC-xxx"
                  className="form-control"
                  value={certForm.credential_id}
                  onChange={(e) => setCertForm(prev => ({ ...prev, credential_id: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label>Credential Verification URL</label>
                <input 
                  type="url" 
                  placeholder="https://..."
                  className="form-control"
                  value={certForm.credential_url}
                  onChange={(e) => setCertForm(prev => ({ ...prev, credential_url: e.target.value }))}
                />
              </div>

              <div className="form-group" style={{ border: '1px solid var(--card-border)', padding: '1rem', borderRadius: '8px', marginTop: '1.5rem' }}>
                <label style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>Certificate File / Image</label>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label htmlFor="cert_file" style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Upload Local File (PDF or Image)</label>
                  <input 
                    type="file" 
                    id="cert_file"
                    onChange={(e) => setCertFile(e.target.files[0])}
                  />
                  {currentCert?.file && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Currently: {currentCert.file.split('/').pop()}</div>}
                </div>

                <div style={{ textAlign: 'center', margin: '0.5rem 0', fontWeight: 'bold', fontSize: '0.8rem', color: 'var(--text-muted)' }}>— OR —</div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Paste External File URL</label>
                  <input 
                    type="url" 
                    placeholder="https://..."
                    className="form-control"
                    value={certForm.file_url}
                    onChange={(e) => setCertForm(prev => ({ ...prev, file_url: e.target.value }))}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">
                  <Save size={16} /> Save Changes
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowCertModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
