/* --- Advanced Developer Portfolio Builder JavaScript Logic --- */

document.addEventListener('DOMContentLoaded', () => {

  // --- MOCK DATABASE AND AUTHENTICATION SERVICES ---
  
  const getUsersDb = () => {
    const db = localStorage.getItem('devfolio_users_db');
    return db ? JSON.parse(db) : {};
  };

  const saveUsersDb = (db) => {
    localStorage.setItem('devfolio_users_db', JSON.stringify(db));
  };

  const getSession = () => {
    return localStorage.getItem('devfolio_active_session');
  };

  const saveSession = (email) => {
    localStorage.setItem('devfolio_active_session', email);
  };

  const clearSession = () => {
    localStorage.removeItem('devfolio_active_session');
  };

  // --- DEFAULT DATA FOR NEW DRAFTS ---
  const DEFAULT_PORTFOLIO_DRAFT = {
    fullName: 'Jane Doe',
    professionalTitle: 'Full Stack Developer',
    avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Jane',
    bio: 'Passionate software engineer focused on building clean, accessible, and high-performance web applications using modern web standards.',
    email: 'jane.doe@example.com',
    github: 'janedoe',
    linkedin: 'jane-doe',
    twitter: 'janedoe',
    skills: ['JavaScript', 'HTML5', 'CSS3', 'React', 'Node.js', 'Git', 'Responsive Design'],
    projects: [
      {
        title: 'Project Alpha',
        tech: 'React, CSS Modules',
        description: 'A performance-oriented productivity tool designed to help developers manage time tracking.',
        link: 'https://github.com/janedoe/project-alpha'
      },
      {
        title: 'API Gateway Microservice',
        tech: 'Node.js, Express, Redis',
        description: 'High-throughput microservices gateway featuring client-rate limiting and request caching mechanisms.',
        link: 'https://github.com/janedoe/api-gateway'
      }
    ],
    experience: [
      {
        role: 'Frontend Engineer',
        company: 'WebSolutions Inc.',
        period: '2024 - Present',
        description: 'Led implementation of responsive, accessible user interfaces, improving Lighthouse scores by 25%.'
      },
      {
        role: 'Junior Web Developer',
        company: 'CodeForge Labs',
        period: '2022 - 2024',
        description: 'Developed and maintained dynamic client web applications, collaborated with design and product teams.'
      }
    ],
    layoutTheme: 'minimalist',
    accentColor: '#3B82F6',
    fontFamily: "'Plus Jakarta Sans', sans-serif"
  };

  let currentUserEmail = null;
  let portfolioDraft = {};

  // --- DOM Element references ---
  const authView = document.getElementById('authView');
  const dashboardView = document.getElementById('dashboardView');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const loginTabBtn = document.getElementById('loginTabBtn');
  const signupTabBtn = document.getElementById('signupTabBtn');
  const loginError = document.getElementById('loginError');
  const signupError = document.getElementById('signupError');
  const logoutBtn = document.getElementById('logoutBtn');
  
  const userNameLabel = document.getElementById('userNameLabel');
  const userInitial = document.getElementById('userInitial');
  const bannerUser = document.getElementById('bannerUser');
  const tabTitle = document.getElementById('tabTitle');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const moonIcon = document.getElementById('moonIcon');
  const sunIcon = document.getElementById('sunIcon');

  const statProjectsCount = document.getElementById('statProjectsCount');
  const statSkillsCount = document.getElementById('statSkillsCount');

  // Input bindings
  const inputFullName = document.getElementById('fullName');
  const inputTitle = document.getElementById('professionalTitle');
  const inputAvatar = document.getElementById('avatarUrl');
  const inputAvatarUpload = document.getElementById('avatarUpload');
  const inputBio = document.getElementById('bio');
  const inputEmail = document.getElementById('email');
  const inputGithub = document.getElementById('github');
  const inputLinkedin = document.getElementById('linkedin');
  const inputTwitter = document.getElementById('twitter');
  const newSkillInput = document.getElementById('newSkillInput');
  const addSkillBtn = document.getElementById('addSkillBtn');
  const skillsContainer = document.getElementById('skillsContainer');
  const addProjectBtn = document.getElementById('addProjectBtn');
  const projectsList = document.getElementById('projectsList');
  const addExperienceBtn = document.getElementById('addExperienceBtn');
  const experienceList = document.getElementById('experienceList');
  const accentColorInput = document.getElementById('accentColor');
  const colorHexDisplay = document.getElementById('colorHex');
  const fontFamilySelect = document.getElementById('fontFamily');
  
  const changePasswordForm = document.getElementById('changePasswordForm');
  const newPasswordInput = document.getElementById('newPasswordInput');
  const passwordSuccessMsg = document.getElementById('passwordSuccessMsg');
  const clearBtn = document.getElementById('clearBtn');
  const deleteAccountBtn = document.getElementById('deleteAccountBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const downloadPdfBtn = document.getElementById('downloadPdfBtn');
  const downloadWordBtn = document.getElementById('downloadWordBtn');
  const iframe = document.getElementById('previewIframe');

  // --- WORKSPACE & AUTH STATE ROUTING ---

  const initSession = (email) => {
    currentUserEmail = email;
    const db = getUsersDb();
    const name = db[email].name || 'User';

    userNameLabel.textContent = name;
    userInitial.textContent = name.substring(0, 2).toUpperCase();
    bannerUser.textContent = name;

    // Load active draft
    const draftKey = `devfolio_draft_${email}`;
    const storedDraft = localStorage.getItem(draftKey);
    portfolioDraft = storedDraft ? JSON.parse(storedDraft) : JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO_DRAFT));

    authView.classList.add('hidden');
    dashboardView.classList.remove('hidden');

    syncFormInputsFromState();
    updatePreview();
    updateStatsCounters();
  };

  const terminateSession = () => {
    clearSession();
    currentUserEmail = null;
    dashboardView.classList.add('hidden');
    authView.classList.remove('hidden');
  };

  // Switch between Login and Signup Tab
  loginTabBtn.addEventListener('click', () => {
    loginTabBtn.classList.add('active');
    signupTabBtn.classList.remove('active');
    loginForm.classList.add('active');
    signupForm.classList.remove('active');
    loginError.textContent = '';
    signupError.textContent = '';
  });

  signupTabBtn.addEventListener('click', () => {
    signupTabBtn.classList.add('active');
    loginTabBtn.classList.remove('active');
    signupForm.classList.add('active');
    loginForm.classList.remove('active');
    loginError.textContent = '';
    signupError.textContent = '';
  });

  // Auth Handling
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const db = getUsersDb();

    if (db[email] && db[email].password === password) {
      saveSession(email);
      initSession(email);
    } else {
      loginError.textContent = 'Invalid email or password.';
    }
  });

  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const db = getUsersDb();

    if (db[email]) {
      signupError.textContent = 'An account with this email already exists.';
      return;
    }
    if (password.length < 6) {
      signupError.textContent = 'Password must be at least 6 characters.';
      return;
    }

    db[email] = { name, password };
    saveUsersDb(db);

    saveSession(email);
    initSession(email);
  });

  logoutBtn.addEventListener('click', terminateSession);

  // --- WORKSPACE VIEW/ROUTING AND UI NAVIGATION ---

  document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));

      item.classList.add('active');
      const target = item.getAttribute('data-target');
      document.getElementById(target).classList.add('active');

      tabTitle.textContent = item.textContent.trim();
    });
  });

  // Workspace light/dark mode switcher
  themeToggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'light');
      moonIcon.classList.add('hidden');
      sunIcon.classList.remove('hidden');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      sunIcon.classList.add('hidden');
      moonIcon.classList.remove('hidden');
    }
  });

  // Update statistics values
  const updateStatsCounters = () => {
    statProjectsCount.textContent = portfolioDraft.projects.length;
    statSkillsCount.textContent = portfolioDraft.skills.length;
  };

  // --- STATE AND TEMPLATE RENDERING COMPILER ---

  const saveActiveDraft = () => {
    if (currentUserEmail) {
      localStorage.setItem(`devfolio_draft_${currentUserEmail}`, JSON.stringify(portfolioDraft));
      updateStatsCounters();
    }
  };

  const syncFormInputsFromState = () => {
    inputFullName.value = portfolioDraft.fullName;
    inputTitle.value = portfolioDraft.professionalTitle;
    inputAvatar.value = portfolioDraft.avatarUrl;
    inputBio.value = portfolioDraft.bio;
    inputEmail.value = portfolioDraft.email;
    inputGithub.value = portfolioDraft.github;
    inputLinkedin.value = portfolioDraft.linkedin;
    inputTwitter.value = portfolioDraft.twitter;
    accentColorInput.value = portfolioDraft.accentColor;
    colorHexDisplay.textContent = portfolioDraft.accentColor.toUpperCase();
    fontFamilySelect.value = portfolioDraft.fontFamily;

    // Apply layout theme radio status
    const radio = document.querySelector(`input[name="layoutTheme"][value="${portfolioDraft.layoutTheme}"]`);
    if (radio) radio.checked = true;

    renderSkillsList();
    renderProjectsList();
    renderExperienceList();
  };

  // --- Dynamic Skills tags layout ---
  const renderSkillsList = () => {
    skillsContainer.innerHTML = '';
    portfolioDraft.skills.forEach((skill, index) => {
      const tag = document.createElement('span');
      tag.className = 'skill-tag';
      tag.textContent = skill;

      const removeBtn = document.createElement('button');
      removeBtn.className = 'skill-tag-remove';
      removeBtn.textContent = '×';
      removeBtn.addEventListener('click', () => {
        portfolioDraft.skills.splice(index, 1);
        saveActiveDraft();
        renderSkillsList();
        updatePreview();
      });

      tag.appendChild(removeBtn);
      skillsContainer.appendChild(tag);
    });
  };

  const addSkill = () => {
    const text = newSkillInput.value.trim();
    if (text) {
      const skillsToAdd = text.split(',').map(s => s.trim()).filter(Boolean);
      skillsToAdd.forEach(s => {
        if (!portfolioDraft.skills.includes(s)) {
          portfolioDraft.skills.push(s);
        }
      });
      newSkillInput.value = '';
      saveActiveDraft();
      renderSkillsList();
      updatePreview();
    }
  };

  addSkillBtn.addEventListener('click', addSkill);
  newSkillInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  });

  // --- Dynamic Projects configuration ---
  const renderProjectsList = () => {
    projectsList.innerHTML = '';
    portfolioDraft.projects.forEach((proj, idx) => {
      const card = document.createElement('div');
      card.className = 'dynamic-item-card';

      card.innerHTML = `
        <button type="button" class="card-remove-btn" title="Delete Project">×</button>
        <div class="form-group">
          <label>Project Title</label>
          <input type="text" data-field="title" value="${proj.title}">
        </div>
        <div class="form-group">
          <label>Tech Stack</label>
          <input type="text" data-field="tech" value="${proj.tech}">
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea rows="2" data-field="description">${proj.description}</textarea>
        </div>
        <div class="form-group">
          <label>Project Link</label>
          <input type="text" data-field="link" value="${proj.link}">
        </div>
      `;

      card.querySelectorAll('input, textarea').forEach(el => {
        el.addEventListener('input', (e) => {
          const field = e.target.getAttribute('data-field');
          portfolioDraft.projects[idx][field] = e.target.value;
          saveActiveDraft();
          updatePreview();
        });
      });

      card.querySelector('.card-remove-btn').addEventListener('click', () => {
        portfolioDraft.projects.splice(idx, 1);
        saveActiveDraft();
        renderProjectsList();
        updatePreview();
      });

      projectsList.appendChild(card);
    });
  };

  addProjectBtn.addEventListener('click', () => {
    portfolioDraft.projects.push({
      title: 'New Project',
      tech: 'HTML, CSS, JS',
      description: 'Describe details of your dynamic project here.',
      link: ''
    });
    saveActiveDraft();
    renderProjectsList();
    updatePreview();
  });

  // --- Dynamic Experience configuration ---
  const renderExperienceList = () => {
    experienceList.innerHTML = '';
    portfolioDraft.experience.forEach((exp, idx) => {
      const card = document.createElement('div');
      card.className = 'dynamic-item-card';

      card.innerHTML = `
        <button type="button" class="card-remove-btn" title="Delete Experience">×</button>
        <div class="form-group">
          <label>Role</label>
          <input type="text" data-field="role" value="${exp.role}">
        </div>
        <div class="form-group">
          <label>Company</label>
          <input type="text" data-field="company" value="${exp.company}">
        </div>
        <div class="form-group">
          <label>Period</label>
          <input type="text" data-field="period" value="${exp.period}">
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea rows="2" data-field="description">${exp.description}</textarea>
        </div>
      `;

      card.querySelectorAll('input, textarea').forEach(el => {
        el.addEventListener('input', (e) => {
          const field = e.target.getAttribute('data-field');
          portfolioDraft.experience[idx][field] = e.target.value;
          saveActiveDraft();
          updatePreview();
        });
      });

      card.querySelector('.card-remove-btn').addEventListener('click', () => {
        portfolioDraft.experience.splice(idx, 1);
        saveActiveDraft();
        renderExperienceList();
        updatePreview();
      });

      experienceList.appendChild(card);
    });
  };

  addExperienceBtn.addEventListener('click', () => {
    portfolioDraft.experience.push({
      role: 'Software Engineer',
      company: 'Freelance Tech',
      period: '2025 - Present',
      description: 'Worked on modern applications using clean web designs.'
    });
    saveActiveDraft();
    renderExperienceList();
    updatePreview();
  });

  // --- Template Styles Compiler logic ---

  const getThemeStyles = (themeName, accentColor, fontFamily) => {
    const defaultStyles = `
      :root {
        --accent: ${accentColor};
        --accent-rgb: ${hexToRgb(accentColor)};
        --font-family: ${fontFamily};
      }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        font-family: var(--font-family);
        line-height: 1.6;
        color: var(--text);
        background-color: var(--bg);
        padding: 40px 20px;
        min-height: 100vh;
      }
      @media print {
        body {
          background-color: var(--bg) !important;
          color: var(--text) !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .card {
          page-break-inside: avoid;
        }
        @page {
          margin: 15mm;
        }
      }
      .container {
        max-width: 800px;
        margin: 0 auto;
      }
      header {
        display: flex;
        align-items: center;
        gap: 24px;
        margin-bottom: 40px;
      }
      .avatar {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        object-fit: cover;
        border: 4px solid var(--accent);
        box-shadow: 0 4px 12px rgba(var(--accent-rgb), 0.15);
      }
      .header-info h1 {
        font-size: 2.3rem;
        font-weight: 800;
        margin-bottom: 6px;
      }
      .title {
        font-size: 1.15rem;
        color: var(--accent);
        font-weight: 700;
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }
      .section {
        margin-bottom: 44px;
      }
      .section-title {
        font-size: 1.3rem;
        font-weight: 800;
        margin-bottom: 20px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        border-bottom: 2px solid #e2e8f0;
        padding-bottom: 8px;
        color: var(--title-color);
      }
      .bio-text {
        font-size: 1.1rem;
        color: var(--text-muted);
      }
      .skills-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }
      .skill-badge {
        font-size: 0.85rem;
        font-weight: 600;
        padding: 6px 16px;
        border-radius: 20px;
        background-color: var(--badge-bg);
        color: var(--badge-text);
        border: 1px solid var(--badge-border);
      }
      .grid-list {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }
      .card {
        padding: 24px;
        border-radius: 12px;
        background-color: var(--card-bg);
        border: 1px solid var(--card-border);
        box-shadow: var(--shadow);
        transition: transform 0.25s, border-color 0.25s;
      }
      .card:hover {
        transform: translateY(-2px);
      }
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        margin-bottom: 10px;
      }
      .card-title {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--title-color);
      }
      .card-subtitle {
        font-size: 0.95rem;
        color: var(--accent);
        font-weight: 600;
      }
      .card-meta {
        font-size: 0.85rem;
        color: var(--text-muted);
        font-family: monospace;
      }
      .card-desc {
        color: var(--text-muted);
        font-size: 0.95rem;
      }
      .card-link {
        display: inline-block;
        margin-top: 14px;
        color: var(--accent);
        text-decoration: none;
        font-weight: 700;
        font-size: 0.9rem;
      }
      .card-link:hover {
        text-decoration: underline;
      }
      .contact-links {
        display: flex;
        flex-wrap: wrap;
        gap: 24px;
      }
      .contact-link {
        color: var(--text);
        text-decoration: none;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .contact-link:hover {
        color: var(--accent);
      }
    `;

    switch (themeName) {
      case 'dark-modern':
        return defaultStyles + `
          :root {
            --bg: #0b0f19;
            --text: #cbd5e1;
            --text-muted: #94a3b8;
            --title-color: #f8fafc;
            --badge-bg: #1e293b;
            --badge-text: #f1f5f9;
            --badge-border: #334155;
            --card-bg: #111827;
            --card-border: #1f2937;
            --shadow: 0 4px 20px rgba(0,0,0,0.25);
          }
          .section-title {
            border-bottom-color: #1f2937;
          }
        `;
      case 'glassmorphic':
        return defaultStyles + `
          :root {
            --bg: #0b0f19;
            --text: #e2e8f0;
            --text-muted: #cbd5e1;
            --title-color: #ffffff;
            --badge-bg: rgba(255, 255, 255, 0.08);
            --badge-text: #ffffff;
            --badge-border: rgba(255, 255, 255, 0.15);
            --card-bg: rgba(255, 255, 255, 0.03);
            --card-border: rgba(255, 255, 255, 0.08);
            --shadow: 0 8px 32px rgba(0,0,0,0.3);
          }
          body {
            background: radial-gradient(circle at top right, rgba(var(--accent-rgb), 0.15), transparent 450px),
                        radial-gradient(circle at bottom left, rgba(139, 92, 246, 0.15), transparent 450px),
                        #0b0f19;
          }
          .card {
            backdrop-filter: blur(12px);
          }
          .section-title {
            border-bottom-color: rgba(255, 255, 255, 0.1);
          }
        `;
      case 'cyberpunk':
        return defaultStyles + `
          :root {
            --bg: #030303;
            --text: #00ffcc;
            --text-muted: #8dfce6;
            --title-color: #ff007f;
            --badge-bg: #0a0a0a;
            --badge-text: #00ffcc;
            --badge-border: #00ffcc;
            --card-bg: #080808;
            --card-border: 2px solid #ff007f;
            --shadow: 3px 3px 0px #00ffcc;
          }
          body {
            font-family: 'Fira Code', monospace;
          }
          .avatar {
            border-radius: 0;
            border: 3px solid #ff007f;
          }
          .card {
            border-radius: 0;
            border: 2px solid #ff007f;
          }
          .card:hover {
            transform: translate(-2px, -2px);
            box-shadow: 5px 5px 0px #ff007f;
          }
          .section-title {
            border-bottom: 2px dashed #ff007f;
          }
        `;
      case 'neo-brutalist':
        return defaultStyles + `
          :root {
            --bg: #fbeed6;
            --text: #1e1e1e;
            --text-muted: #3a3a3a;
            --title-color: #000000;
            --badge-bg: #ffd166;
            --badge-text: #000000;
            --badge-border: #000000;
            --card-bg: #ffffff;
            --card-border: #000000;
            --shadow: 6px 6px 0px #000000;
          }
          .avatar {
            border-radius: 12px;
            border: 3px solid #000000;
            box-shadow: 4px 4px 0 #000000;
          }
          .card {
            border: 3px solid #000000;
            border-radius: 0px;
          }
          .card:hover {
            transform: translate(-3px, -3px);
            box-shadow: 9px 9px 0px #000000;
          }
          .section-title {
            border-bottom: 4px solid #000000;
            border-radius: 0;
          }
          .skill-badge {
            border: 2px solid #000000;
            border-radius: 4px;
            box-shadow: 2px 2px 0px #000000;
          }
        `;
      case 'minimalist':
      default:
        return defaultStyles + `
          :root {
            --bg: #ffffff;
            --text: #334155;
            --text-muted: #64748b;
            --title-color: #0f172a;
            --badge-bg: #f8fafc;
            --badge-text: #475569;
            --badge-border: #e2e8f0;
            --card-bg: #ffffff;
            --card-border: #e2e8f0;
            --shadow: 0 1px 3px rgba(0,0,0,0.02);
          }
        `;
    }
  };

  // Helper parsing Hex to RGB string representation
  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 0, 0';
  }

  // Generate complete Portfolio document string code
  const generatePortfolioHTML = () => {
    const skillsHTML = portfolioDraft.skills.map(s => `<span class="skill-badge">${s}</span>`).join('\n      ');
    
    const projectsHTML = portfolioDraft.projects.map(p => `
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">${p.title}</h3>
            <span class="card-meta">${p.tech}</span>
          </div>
          <p class="card-desc">${p.description}</p>
          ${p.link ? `<a class="card-link" href="${p.link}" target="_blank" rel="noopener noreferrer">View Repository &rarr;</a>` : ''}
        </div>`).join('\n      ');

    const expHTML = portfolioDraft.experience.map(e => `
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">${e.role}</h3>
            <span class="card-meta">${e.period}</span>
          </div>
          <div class="card-subtitle" style="margin-bottom: 8px;">${e.company}</div>
          <p class="card-desc">${e.description}</p>
        </div>`).join('\n      ');

    let socialHTML = '';
    if (portfolioDraft.email) {
      socialHTML += `<a class="contact-link" href="mailto:${portfolioDraft.email}">✉ ${portfolioDraft.email}</a>`;
    }
    if (portfolioDraft.github) {
      socialHTML += `<a class="contact-link" href="https://github.com/${portfolioDraft.github}" target="_blank" rel="noopener noreferrer">🐙 GitHub</a>`;
    }
    if (portfolioDraft.linkedin) {
      socialHTML += `<a class="contact-link" href="https://linkedin.com/in/${portfolioDraft.linkedin}" target="_blank" rel="noopener noreferrer">💼 LinkedIn</a>`;
    }
    if (portfolioDraft.twitter) {
      socialHTML += `<a class="contact-link" href="https://twitter.com/${portfolioDraft.twitter}" target="_blank" rel="noopener noreferrer">🐦 Twitter</a>`;
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${portfolioDraft.fullName} - Portfolio</title>
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
  <style>
    ${getThemeStyles(portfolioDraft.layoutTheme, portfolioDraft.accentColor, portfolioDraft.fontFamily)}
  </style>
</head>
<body>
  <div class="container">
    <header>
      ${portfolioDraft.avatarUrl ? `<img class="avatar" src="${portfolioDraft.avatarUrl}" alt="${portfolioDraft.fullName}">` : ''}
      <div class="header-info">
        <h1>${portfolioDraft.fullName}</h1>
        <div class="title">${portfolioDraft.professionalTitle}</div>
      </div>
    </header>

    ${portfolioDraft.bio ? `
    <section class="section">
      <h2 class="section-title">About Me</h2>
      <p class="bio-text">${portfolioDraft.bio}</p>
    </section>` : ''}

    ${portfolioDraft.skills.length > 0 ? `
    <section class="section">
      <h2 class="section-title">Skills</h2>
      <div class="skills-grid">
        ${skillsHTML}
      </div>
    </section>` : ''}

    ${portfolioDraft.projects.length > 0 ? `
    <section class="section">
      <h2 class="section-title">Projects</h2>
      <div class="grid-list">
        ${projectsHTML}
      </div>
    </section>` : ''}

    ${portfolioDraft.experience.length > 0 ? `
    <section class="section">
      <h2 class="section-title">Experience</h2>
      <div class="grid-list">
        ${expHTML}
      </div>
    </section>` : ''}

    <section class="section">
      <h2 class="section-title">Get in Touch</h2>
      <div class="contact-links">
        ${socialHTML}
      </div>
    </section>
  </div>
</body>
</html>`;
  };

  const updatePreview = () => {
    const html = generatePortfolioHTML();
    iframe.srcdoc = html;
  };

  // --- Dynamic Inputs Event listeners ---

  // Accent color Picker
  accentColorInput.addEventListener('input', (e) => {
    const val = e.target.value;
    portfolioDraft.accentColor = val;
    colorHexDisplay.textContent = val.toUpperCase();
    saveActiveDraft();
    updatePreview();
  });

  // Fonts Selector
  fontFamilySelect.addEventListener('change', (e) => {
    portfolioDraft.fontFamily = e.target.value;
    saveActiveDraft();
    updatePreview();
  });

  // Layout Radios
  document.querySelectorAll('input[name="layoutTheme"]').forEach(rad => {
    rad.addEventListener('change', (e) => {
      portfolioDraft.layoutTheme = e.target.value;
      saveActiveDraft();
      updatePreview();
    });
  });

  // File upload reader for Profile Picture
  inputAvatarUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        portfolioDraft.avatarUrl = dataUrl;
        inputAvatar.value = dataUrl;
        saveActiveDraft();
        updatePreview();
      };
      reader.readAsDataURL(file);
    }
  });

  // Simple static form inputs
  [inputFullName, inputTitle, inputAvatar, inputBio, inputEmail, inputGithub, inputLinkedin, inputTwitter].forEach(el => {
    el.addEventListener('input', () => {
      portfolioDraft.fullName = inputFullName.value;
      portfolioDraft.professionalTitle = inputTitle.value;
      portfolioDraft.avatarUrl = inputAvatar.value;
      portfolioDraft.bio = inputBio.value;
      portfolioDraft.email = inputEmail.value;
      portfolioDraft.github = inputGithub.value;
      portfolioDraft.linkedin = inputLinkedin.value;
      portfolioDraft.twitter = inputTwitter.value;
      saveActiveDraft();
      updatePreview();
    });
  });

  // Toggle preview viewport widths
  document.querySelectorAll('.viewport-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.viewport-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      iframe.style.width = btn.getAttribute('data-width');
    });
  });

  // Reset Draft trigger
  clearBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear this portfolio draft?')) {
      portfolioDraft = JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO_DRAFT));
      saveActiveDraft();
      syncFormInputsFromState();
      updatePreview();
    }
  });

  // Change password trigger
  changePasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newPass = newPasswordInput.value;
    if (newPass.length < 6) {
      alert('Password must be at least 6 characters.');
      return;
    }
    const db = getUsersDb();
    if (db[currentUserEmail]) {
      db[currentUserEmail].password = newPass;
      saveUsersDb(db);
      newPasswordInput.value = '';
      passwordSuccessMsg.textContent = 'Password updated successfully!';
      setTimeout(() => {
        passwordSuccessMsg.textContent = '';
      }, 3000);
    }
  });

  // Delete account trigger
  deleteAccountBtn.addEventListener('click', () => {
    if (confirm('CAUTION: Are you sure you want to delete your account? All draft configurations will be lost permanently.')) {
      const db = getUsersDb();
      delete db[currentUserEmail];
      saveUsersDb(db);
      localStorage.removeItem(`devfolio_draft_${currentUserEmail}`);
      terminateSession();
    }
  });

  // Exporter Download HTML
  downloadBtn.addEventListener('click', () => {
    const finalHTML = generatePortfolioHTML();
    const blob = new Blob([finalHTML], { type: 'text/html;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${portfolioDraft.fullName.replace(/\s+/g, '_')}_Portfolio.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  // Exporter PDF (via system print of active iframe)
  downloadPdfBtn.addEventListener('click', () => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  });

  const generateWordPortfolioHTML = () => {
    // Determine colors based on active theme
    let bg = '#ffffff';
    let text = '#334155';
    let titleColor = '#0f172a';
    let cardBg = '#ffffff';
    let cardBorder = '#e2e8f0';
    let badgeBg = '#f1f5f9';
    let badgeText = '#334155';
    let badgeBorder = '#e2e8f0';
    let accent = portfolioDraft.accentColor;
    let fontFamily = portfolioDraft.fontFamily || "'Plus Jakarta Sans', sans-serif";

    if (portfolioDraft.layoutTheme === 'dark-modern') {
      bg = '#0b0f19';
      text = '#cbd5e1';
      titleColor = '#f8fafc';
      cardBg = '#111827';
      cardBorder = '#1f2937';
      badgeBg = '#1e293b';
      badgeText = '#f1f5f9';
      badgeBorder = '#334155';
    } else if (portfolioDraft.layoutTheme === 'glassmorphic') {
      bg = '#0b0f19';
      text = '#e2e8f0';
      titleColor = '#ffffff';
      cardBg = '#151c2e';
      cardBorder = '#1e293b';
      badgeBg = '#1e293b';
      badgeText = '#ffffff';
      badgeBorder = '#334155';
    } else if (portfolioDraft.layoutTheme === 'cyberpunk') {
      bg = '#030303';
      text = '#00ffcc';
      titleColor = '#ff007f';
      cardBg = '#080808';
      cardBorder = '#ff007f';
      badgeBg = '#0a0a0a';
      badgeText = '#00ffcc';
      badgeBorder = '#00ffcc';
      fontFamily = "'Fira Code', monospace";
    } else if (portfolioDraft.layoutTheme === 'neo-brutalist') {
      bg = '#fbeed6';
      text = '#1e1e1e';
      titleColor = '#000000';
      cardBg = '#ffffff';
      cardBorder = '#000000';
      badgeBg = '#ffd166';
      badgeText = '#000000';
      badgeBorder = '#000000';
    }

    const skillsHTML = portfolioDraft.skills.map(s => 
      `<span style="display: inline-block; padding: 6px 14px; margin: 4px; font-size: 13px; font-weight: 600; border-radius: 20px; background-color: ${badgeBg}; color: ${badgeText}; border: 1px solid ${badgeBorder};">${s}</span>`
    ).join(' ');

    const projectsHTML = portfolioDraft.projects.map(p => `
      <div style="margin-bottom: 20px; padding: 20px; border-radius: 12px; background-color: ${cardBg}; border: 1px solid ${cardBorder};">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="left" style="font-size: 18px; font-weight: 700; color: ${titleColor};">${p.title}</td>
            <td align="right" style="font-size: 13px; font-family: monospace; color: ${text};">${p.tech}</td>
          </tr>
        </table>
        <p style="margin-top: 10px; margin-bottom: 10px; font-size: 15px; color: ${text};">${p.description}</p>
        ${p.link ? `<a href="${p.link}" style="color: ${accent}; font-weight: 700; text-decoration: none; font-size: 14px;">View Repository &rarr;</a>` : ''}
      </div>
    `).join('\n');

    const expHTML = portfolioDraft.experience.map(e => `
      <div style="margin-bottom: 20px; padding: 20px; border-radius: 12px; background-color: ${cardBg}; border: 1px solid ${cardBorder};">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="left" style="font-size: 18px; font-weight: 700; color: ${titleColor};">${e.role}</td>
            <td align="right" style="font-size: 13px; font-family: monospace; color: ${text};">${e.period}</td>
          </tr>
        </table>
        <div style="color: ${accent}; font-weight: 600; font-size: 15px; margin-top: 4px; margin-bottom: 8px;">${e.company}</div>
        <p style="font-size: 15px; color: ${text};">${e.description}</p>
      </div>
    `).join('\n');

    let socialHTML = [];
    if (portfolioDraft.email) socialHTML.push(`<a href="mailto:${portfolioDraft.email}" style="color: ${text}; text-decoration: none; font-weight: 600; margin-right: 20px;">✉ ${portfolioDraft.email}</a>`);
    if (portfolioDraft.github) socialHTML.push(`<a href="https://github.com/${portfolioDraft.github}" style="color: ${text}; text-decoration: none; font-weight: 600; margin-right: 20px;">🐙 GitHub</a>`);
    if (portfolioDraft.linkedin) socialHTML.push(`<a href="https://linkedin.com/in/${portfolioDraft.linkedin}" style="color: ${text}; text-decoration: none; font-weight: 600; margin-right: 20px;">💼 LinkedIn</a>`);
    if (portfolioDraft.twitter) socialHTML.push(`<a href="https://twitter.com/${portfolioDraft.twitter}" style="color: ${text}; text-decoration: none; font-weight: 600; margin-right: 20px;">🐦 Twitter</a>`);

    return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>${portfolioDraft.fullName} - Portfolio</title>
      <style>
        body {
          font-family: ${fontFamily};
          background-color: ${bg};
          color: ${text};
          padding: 40px;
          margin: 0;
        }
        h2 {
          font-size: 20px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 2px solid ${portfolioDraft.layoutTheme === 'cyberpunk' || portfolioDraft.layoutTheme === 'neo-brutalist' ? '#ff007f' : '#e2e8f0'};
          padding-bottom: 8px;
          margin-bottom: 20px;
          color: ${titleColor};
        }
      </style>
    </head>
    <body>
      <div style="max-width: 800px; margin: 0 auto;">
        
        <!-- Header -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 40px;">
          <tr>
            ${portfolioDraft.avatarUrl ? `
            <td width="120" valign="middle">
              <img src="${portfolioDraft.avatarUrl}" width="100" height="100" style="border-radius: 50%; border: 4px solid ${accent}; display: block;" alt="avatar">
            </td>` : ''}
            <td valign="middle" style="padding-left: 20px;">
              <h1 style="font-size: 32px; font-weight: 800; margin: 0; color: ${titleColor};">${portfolioDraft.fullName}</h1>
              <div style="font-size: 18px; color: ${accent}; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 4px;">${portfolioDraft.professionalTitle}</div>
            </td>
          </tr>
        </table>

        <!-- About section -->
        ${portfolioDraft.bio ? `
        <div style="margin-bottom: 40px;">
          <h2>About Me</h2>
          <p style="font-size: 16px; line-height: 1.6; color: ${text};">${portfolioDraft.bio}</p>
        </div>` : ''}

        <!-- Skills section -->
        ${portfolioDraft.skills.length > 0 ? `
        <div style="margin-bottom: 40px;">
          <h2>Skills</h2>
          <div style="line-height: 2;">
            ${skillsHTML}
          </div>
        </div>` : ''}

        <!-- Projects section -->
        ${portfolioDraft.projects.length > 0 ? `
        <div style="margin-bottom: 40px;">
          <h2>Projects</h2>
          <div>
            ${projectsHTML}
          </div>
        </div>` : ''}

        <!-- Experience section -->
        ${portfolioDraft.experience.length > 0 ? `
        <div style="margin-bottom: 40px;">
          <h2>Experience</h2>
          <div>
            ${expHTML}
          </div>
        </div>` : ''}

        <!-- Contact section -->
        <div>
          <h2>Get in Touch</h2>
          <div style="font-size: 15px; margin-top: 10px;">
            ${socialHTML.join(' ')}
          </div>
        </div>

      </div>
    </body>
    </html>`;
  };

  // Exporter Word Document (.doc format)
  downloadWordBtn.addEventListener('click', () => {
    const finalHTML = generateWordPortfolioHTML();
    const header = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">\n<head>\n<meta charset="utf-8">\n</head>\n<body>\n`;
    const footer = `\n</body>\n</html>`;
    const docContent = header + finalHTML + footer;
    const blob = new Blob([docContent], { type: 'application/msword;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${portfolioDraft.fullName.replace(/\s+/g, '_')}_Portfolio.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  // --- Initial check for active session or router redirection ---
  const activeEmail = getSession();
  if (activeEmail) {
    initSession(activeEmail);
  } else {
    terminateSession();
  }
});
