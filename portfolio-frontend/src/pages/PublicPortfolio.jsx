import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axiosConfig';

// Explicit URL resolver to fetch file assets from the backend server
const getImageUrl = (url) => {
  if (!url) return null;
  const backendUrl = import.meta.env.VITE_API_URL || 'https://folio-backend-k6qf.onrender.com';
  return url.startsWith('http') ? url : `${backendUrl}/api/files/download/${url}`;
};

export default function PublicPortfolio() {
  const { slug } = useParams();
  const canvasRef = useRef(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [activeTab, setActiveTab] = useState('experience');

  // Typing effect state
  const [roleIndex, setRoleIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  // Contact form state
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);

  // 1. Role Switching Effect (No character typing/deleting)
  useEffect(() => {
    if (!profile) return;
    
    const rolesList = profile.roles && profile.roles.trim() !== ''
      ? profile.roles.split(',').map((r) => r.trim()).filter((r) => r.length > 0)
      : [profile.title || 'Full Stack Engineer'];

    if (rolesList.length <= 1) return;

    let timer;
    let fadeTimer;

    const switchRole = () => {
      setIsFading(true);
      fadeTimer = setTimeout(() => {
        setRoleIndex((prev) => (prev + 1) % rolesList.length);
        setIsFading(false);
      }, 300);
    };

    timer = setInterval(switchRole, 3000);

    return () => {
      clearInterval(timer);
      clearTimeout(fadeTimer);
    };
  }, [roleIndex, profile]);

  // 2. Fetch Portfolio details by Slug
  useEffect(() => {
    api.get(`/api/public/portfolio/${slug}`)
      .then((response) => {
        setProfile(response.data);
      })
      .catch((err) => {
        console.error(err);
        setError('Portfolio not found. Make sure the URL slug is correct and published.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  // 3. Interactive Floating Particle Network
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    const particleCount = 75;
    const connectionDistance = 120;
    const mouse = { x: null, y: null, radius: 120 };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 1.5 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x += (dx / dist) * force * 0.7;
            this.y += (dy / dist) * force * 0.7;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(129, 140, 248, 0.4)';
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.update();
        p1.draw();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.12;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(129, 140, 248, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [loading]);

  // 4. PDF Resume Downloader
  const handleDownloadResume = async () => {
    if (!profile || !profile.resumeUrl) return;

    setDownloading(true);
    try {
      const response = await api.get(`/api/files/download/${profile.resumeUrl}`, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const downloadUrl = window.URL.createObjectURL(blob);

      const anchor = document.createElement('a');
      anchor.href = downloadUrl;
      anchor.setAttribute('download', `${profile.name}_Resume.pdf`);
      document.body.appendChild(anchor);
      anchor.click();

      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error(err);
      alert('Could not download PDF resume.');
    } finally {
      setDownloading(false);
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactEmail.trim()) return;
    setContactSuccess(true);
    setContactEmail('');
    setContactMsg('');
    setTimeout(() => setContactSuccess(false), 4000);
  };

  const scrollToSection = (id) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  // Returns the official Devicon SVG URL for standard skills
  const getSkillDeviconUrl = (skillName) => {
    const name = (skillName || '').toLowerCase().trim();
    
    // Normalizations dictionary for devicons
    const mappings = {
      'python': 'python/python-original.svg',
      'java': 'java/java-original.svg',
      'java script': 'javascript/javascript-original.svg',
      'javascript': 'javascript/javascript-original.svg',
      'js': 'javascript/javascript-original.svg',
      'typescript': 'typescript/typescript-original.svg',
      'ts': 'typescript/typescript-original.svg',
      'c++': 'cplusplus/cplusplus-original.svg',
      'cpp': 'cplusplus/cplusplus-original.svg',
      'c#': 'csharp/csharp-original.svg',
      'csharp': 'csharp/csharp-original.svg',
      'c': 'c/c-original.svg',
      'go': 'go/go-original.svg',
      'golang': 'go/go-original.svg',
      'rust': 'rust/rust-original-for-dark.svg',
      'ruby': 'ruby/ruby-original.svg',
      'php': 'php/php-original.svg',
      'html': 'html5/html5-original.svg',
      'html5': 'html5/html5-original.svg',
      'css': 'css3/css3-original.svg',
      'css3': 'css3/css3-original.svg',
      
      'react': 'react/react-original.svg',
      'reactjs': 'react/react-original.svg',
      'react.js': 'react/react-original.svg',
      'angular': 'angularjs/angularjs-original.svg',
      'vue': 'vuejs/vuejs-original.svg',
      'vuejs': 'vuejs/vuejs-original.svg',
      'node': 'nodejs/nodejs-original.svg',
      'nodejs': 'nodejs/nodejs-original.svg',
      'spring': 'spring/spring-original.svg',
      'spring boot': 'spring/spring-original.svg',
      'springboot': 'spring/spring-original.svg',
      'express': 'express/express-original.svg',
      'expressjs': 'express/express-original.svg',
      'django': 'django/django-plain.svg',
      'flask': 'flask/flask-original.svg',
      'tailwind': 'tailwindcss/tailwindcss-original.svg',
      'tailwindcss': 'tailwindcss/tailwindcss-original.svg',
      'bootstrap': 'bootstrap/bootstrap-original.svg',
      
      'mysql': 'mysql/mysql-original.svg',
      'postgresql': 'postgresql/postgresql-original.svg',
      'postgres': 'postgresql/postgresql-original.svg',
      'mongodb': 'mongodb/mongodb-original.svg',
      'mongo': 'mongodb/mongodb-original.svg',
      'redis': 'redis/redis-original.svg',
      'oracle': 'oracle/oracle-original.svg',
      'sqlite': 'sqlite/sqlite-original.svg',
      'mariadb': 'mariadb/mariadb-original.svg',
      
      'git': 'git/git-original.svg',
      'github': 'github/github-original.svg',
      'docker': 'docker/docker-original.svg',
      'kubernetes': 'kubernetes/kubernetes-original.svg',
      'k8s': 'kubernetes/kubernetes-original.svg',
      'aws': 'amazonwebservices/amazonwebservices-original-wordmark.svg',
      'gcp': 'googlecloud/googlecloud-original.svg',
      'azure': 'azure/azure-original.svg',
      'jenkins': 'jenkins/jenkins-original.svg',
      'jira': 'jira/jira-original.svg',
      'postman': 'postman/postman-original.svg',
      'vscode': 'vscode/vscode-original.svg',
      'maven': 'maven/maven-original.svg',
      'npm': 'npm/npm-original-wordmark.svg'
    };

    let path = mappings[name];
    if (!path) {
      const sortedKeys = Object.keys(mappings).sort((a, b) => b.length - a.length);
      const cleanKey = sortedKeys.find(key => name === key || name.includes(key));
      if (cleanKey) {
        path = mappings[cleanKey];
      }
    }

    if (path) {
      return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${path}`;
    }
    return null;
  };

  // Classifies skills into Programming Languages, Database, Tools, and generic Skills
  const getSkillCategoryAndIcon = (skillName) => {
    let cleanName = (skillName || '').trim();
    let category = 'Skills';

    if (cleanName.includes('::')) {
      const parts = cleanName.split('::');
      cleanName = parts[0].trim();
      category = parts[1].trim();
    } else {
      const nameLower = cleanName.toLowerCase();
      // Programming Languages check
      if (['python', 'java', 'javascript', 'js', 'typescript', 'ts', 'c++', 'cpp', 'c#', 'csharp', 'ruby', 'go', 'golang', 'php', 'swift', 'kotlin', 'rust', 'c', 'html', 'css'].some(lang => nameLower === lang || nameLower.startsWith(lang + ' ') || nameLower.endsWith(' ' + lang))) {
        category = 'Programming Languages';
      }
      // Database check
      else if (['mysql', 'postgresql', 'postgres', 'mongodb', 'mongo', 'oracle', 'redis', 'sqlite', 'mariadb', 'sql', 'nosql', 'db'].some(db => nameLower.includes(db))) {
        category = 'Database';
      }
      // Tools check
      else if (['git', 'github', 'docker', 'kubernetes', 'k8s', 'aws', 'gcp', 'azure', 'jenkins', 'jira', 'postman', 'vscode', 'maven', 'gradle', 'npm', 'yarn'].some(tool => nameLower.includes(tool))) {
        category = 'Tools';
      }
    }

    let iconUrl = getSkillDeviconUrl(cleanName);
    return { cleanName, category, iconUrl };
  };

  const getFontClass = (family) => {
    switch (family) {
      case 'serif': return 'font-serif';
      case 'mono': return 'font-mono';
      case 'sans':
      default: return 'font-sans';
    }
  };

  // Converts a hex color to an rgb triplet string e.g. "2, 6, 23"
  const hexToRgbParts = (hex) => {
    const h = (hex || '#020617').replace('#', '');
    const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
    const r = parseInt(full.substring(0, 2), 16);
    const g = parseInt(full.substring(2, 4), 16);
    const b = parseInt(full.substring(4, 6), 16);
    return `${r},${g},${b}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-slate-300">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-mono text-slate-500">BOOTING_PORTFOLIO_SYSTEM...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-slate-300 px-4">
        <div className="max-w-md w-full glass rounded-xl border border-red-500/20 p-6 text-center space-y-4">
          <svg className="w-12 h-12 text-red-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-lg font-bold text-white">Profile Inaccessible</h3>
          <p className="text-xs text-slate-400 leading-relaxed">{error}</p>
        </div>
      </div>
    );
  const renderAvatar = () => {
    const img = profile.profileImageUrl || profile.profile_image_url;
    const hasImage = img && img.trim() !== '' && img !== 'null' && img !== 'undefined';
    const content = hasImage ? (
      <img
        src={getImageUrl(img)}
        alt={profile.name}
        className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
        style={{ objectPosition: 'center 15%' }}
        onError={(e) => {
          e.target.onerror = null;
          e.target.style.display = 'none';
        }}
      />
    ) : (
      <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-5xl font-extrabold text-slate-500 select-none">
        {profile.name ? profile.name.substring(0, 2).toUpperCase() : 'GT'}
      </div>
    );

    const anim = profile.avatarAnimation ? profile.avatarAnimation.trim().toLowerCase() : 'morphing-rings';

    switch (anim) {
      case 'glow-pulse':
        return (
          <>
            {/* Ambient glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full glow-pulse-glow" />
            
            {/* Image container */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 overflow-hidden border-4 border-cyan-400 shadow-2xl glow-pulse-avatar z-10">
              {content}
            </div>
          </>
        );
      case 'spin-portal':
        return (
          <>
            {/* Glow */}
            <div className="absolute inset-0 bg-purple-500/15 blur-2xl rounded-full z-0 pointer-events-none" />
            
            {/* Spinning portal rings */}
            <div className="absolute -inset-4 border-[3px] border-double border-transparent border-t-purple-400 border-b-indigo-400 rounded-full animate-[spin_10s_linear_infinite] z-0 pointer-events-none" />
            <div className="absolute -inset-2 border border-dashed border-transparent border-l-cyan-400 border-r-emerald-400 rounded-full animate-[spin_6s_linear_infinite_reverse] z-0 pointer-events-none" />
            
            {/* Image container */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 overflow-hidden border-4 border-purple-500/40 group-hover:border-purple-500 shadow-2xl rounded-full transition-colors duration-500 z-10">
              {content}
            </div>
          </>
        );
      case 'float-bounce':
        return (
          <>
            {/* Glow */}
            <div className="absolute inset-0 bg-emerald-500/15 blur-2xl rounded-full z-0 float-avatar pointer-events-none" />
            
            {/* Image container */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 overflow-hidden border-4 border-white/15 shadow-2xl rounded-full float-avatar z-10">
              {content}
            </div>
            
            {/* Bottom shadow */}
            <div className="absolute -bottom-5 left-[10%] right-[10%] h-2.5 bg-black/50 blur-sm rounded-full shadow-shrink pointer-events-none" />
          </>
        );
      case 'square-rotate':
        return (
          <>
            {/* Glow */}
            <div className="absolute inset-0 bg-indigo-500/25 blur-3xl rounded-[40%] squircle-glow pointer-events-none" />
            
            {/* Image container */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 overflow-hidden border-4 border-indigo-500/40 group-hover:border-indigo-400 group-hover:rotate-[15deg] group-hover:shadow-indigo-500/40 shadow-2xl squircle-avatar transition-all duration-500 z-10">
              {content}
            </div>
          </>
        );
      case 'morphing-rings':
      default:
        return (
          <>
            {/* Ambient glow behind morphing blob */}
            <div className="absolute inset-0 bg-[#10b981]/25 blur-3xl scale-110 pointer-events-none group-hover:bg-[#10b981]/35 transition-colors duration-500 morphing-avatar" />

            {/* Morphing image container */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 overflow-hidden border-4 border-white/10 shadow-2xl shadow-black/50 group-hover:border-[#10b981]/40 transition-all duration-500 z-10 morphing-avatar">
              {content}
            </div>

            {/* Outer concentric dashed ring (Slow clockwise spin + morph) */}
            <div className="absolute -inset-4 border-2 border-dashed border-[#10b981]/30 pointer-events-none z-0 group-hover:border-[#10b981]/50 transition-colors morphing-ring-outer" />

            {/* Inner concentric dotted ring (Fast counter-clockwise spin + morph) */}
            <div className="absolute -inset-2.5 border border-dotted border-cyan-400/40 pointer-events-none z-0 group-hover:border-cyan-400/60 transition-colors morphing-ring-inner" />
          </>
        );
    }
  };

  }

  return (
    <div
      className={`relative min-h-screen text-white scroll-smooth transition-all duration-500 ${getFontClass(profile.fontFamily)}`}
      style={{
        backgroundColor: profile.backgroundColor || '#020617',
        '--bg-rgb': hexToRgbParts(profile.backgroundColor || '#020617')
      }}
    >
      {/* Background Interactive Particle Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 block pointer-events-none z-0" />

      {/* 1. Header Navigation — tinted with the user's background color */}
      <header
        className="sticky top-0 z-50 w-full border-b border-white/10 backdrop-blur-md"
        style={{ backgroundColor: `rgba(${hexToRgbParts(profile.backgroundColor || '#020617')},0.88)` }}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <span className="text-base font-extrabold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent cursor-pointer" onClick={() => scrollToSection('home')}>
            {profile.name}
          </span>
          <nav className="flex gap-5 text-xs font-semibold">
            {[
              'home', 'about', 'skills', 'projects', 'timeline',
              ...(profile.certificates && profile.certificates.length > 0 ? ['certificates'] : []),
              ...(profile.achievements && profile.achievements.length > 0 ? ['achievements'] : []),
              'contact'
            ].map((sec) => (
              <button
                key={sec}
                onClick={() => scrollToSection(sec)}
                className={`capitalize transition ${
                  activeSection === sec ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {sec === 'timeline' ? 'Education' : sec}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-32 py-16">
        
        {/* 2. Home Hero Section */}
        <section id="home" className="min-h-[75vh] flex items-center pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full">

            {/* Left Column — Name, Bio, CTA */}
            <div className="space-y-6 text-left">

              {/* Name Heading — clamp keeps it proportional at every screen size */}
              <h1 className="text-white font-extrabold tracking-tight leading-tight" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 3rem)' }}>
                <span className="text-sm uppercase tracking-widest text-slate-500 font-mono block mb-2">Hello, I'm</span>
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  {profile.name}
                </span>
              </h1>

              {/* Animated Role Typewriter */}
              <div className="h-8 flex items-center">
                <p className="text-lg sm:text-xl text-slate-300 font-mono">
                  {(() => {
                    const rolesList = profile && profile.roles && profile.roles.trim() !== ''
                      ? profile.roles.split(',').map((r) => r.trim()).filter((r) => r.length > 0)
                      : profile ? [profile.title || 'Full Stack Engineer'] : ['Full Stack Engineer'];
                    return (
                      <>
                        I am a <span className={`font-bold text-[#22d3ee] font-mono transition-opacity duration-300 ${isFading ? 'opacity-0' : 'opacity-100'}`}>{rolesList[roleIndex]}</span><span className="text-[#22d3ee] font-bold custom-cursor">|</span>
                      </>
                    );
                  })()}
                </p>
              </div>



              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => scrollToSection('contact')}
                  className="rounded-lg bg-[#10b981] hover:bg-[#059669] text-white text-sm font-bold px-7 py-3 transition-all shadow-lg shadow-[#10b981]/25 active:scale-[0.98]"
                >
                  Let's get started &rarr;
                </button>
                <button
                  onClick={() => scrollToSection('projects')}
                  className="glass rounded-lg px-6 py-3 text-sm font-semibold text-slate-300 hover:text-white transition border border-white/10"
                >
                  Explore Projects
                </button>
              </div>
            </div>

            {/* Right Column — Profile Image Container */}
            <div className="flex justify-center md:justify-end">
              <div className="relative group">
                {renderAvatar()}
              </div>
            </div>

          </div>
        </section>

        {/* 3. About Section */}
        <section id="about" className="space-y-6 scroll-mt-20">
          <h2 className="text-xl font-bold text-white border-l-2 border-indigo-500 pl-3">About Me</h2>
          
          <div className="glass rounded-2xl p-8 border border-white/5 space-y-6">
            <div className="space-y-4">
              <p className="text-sm leading-relaxed text-slate-400 whitespace-pre-line leading-relaxed">
                {profile.bio || 'No biography details provided.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/5">
              <div className="flex gap-4 text-xs font-semibold">
                {profile.githubLink && (
                  <a href={profile.githubLink} target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300 hover:underline transition">
                    GitHub Profile
                  </a>
                )}
                {profile.linkedinLink && (
                  <a href={profile.linkedinLink} target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300 hover:underline transition">
                    LinkedIn Profile
                  </a>
                )}
              </div>

            </div>
          </div>
        </section>

        {/* 4. Technical Toolkit (Skills Categorized) */}
        {profile.skills && profile.skills.length > 0 && (() => {
          const categorized = {
            'Programming Languages': [],
            'Skills / Frameworks': [],
            'Database': [],
            'Tools': []
          };
          profile.skills.forEach(s => {
            let { cleanName, category, iconUrl } = getSkillCategoryAndIcon(s.name);
            if (category === 'Skills') category = 'Skills / Frameworks';
            categorized[category].push({ ...s, name: cleanName, iconUrl });
          });

          return (
            <section id="skills" className="space-y-8 scroll-mt-20">
              <h2 className="text-xl font-bold text-white border-l-2 border-indigo-500 pl-3">Technical Toolkit</h2>
              
              <div className="space-y-6">
                {Object.entries(categorized).map(([catName, list]) => {
                  if (list.length === 0) return null;
                  return (
                    <div key={catName} className="space-y-3">
                      <h3 className="text-xs uppercase font-bold tracking-widest text-indigo-400 font-mono pl-1">
                        {catName}
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {list.map((skill) => (
                          <div
                            key={skill.id}
                            className="glass rounded-xl p-4 border border-white/5 hover:border-indigo-500/20 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/5 flex items-center justify-center gap-3"
                          >
                            {skill.iconUrl ? (
                              <img
                                src={skill.iconUrl}
                                alt={skill.name}
                                className="w-5 h-5 object-contain select-none filter brightness-95"
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            ) : (
                              // Generic Terminal Code Icon SVG fallback
                              <svg className="w-4 h-4 text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            )}
                            <span className="text-xs font-semibold text-slate-200 block">{skill.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })()}

        {/* 5. Projects Section */}
        {profile.projects && profile.projects.length > 0 && (
          <section id="projects" className="space-y-6 scroll-mt-20">
            <h2 className="text-xl font-bold text-white border-l-2 border-indigo-500 pl-3">Featured Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.projects.map((proj) => (
                <div
                  key={proj.id}
                  className="glass ending-edge-animate rounded-xl p-6 border border-white/5 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-white">{proj.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{proj.description}</p>
                  </div>
                  
                  <div className="space-y-3 pt-4 border-t border-white/5">
                    <div className="flex flex-wrap gap-1">
                      {proj.techStack.split(',').map((tech, idx) => (
                        <span key={idx} className="border border-white/10 text-[9px] text-white/50 px-2 py-0.5 rounded font-mono" style={{ background: 'rgba(0,0,0,0.30)' }}>
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-4 text-xs font-semibold pt-1">
                      {proj.githubLink && (
                        <a href={proj.githubLink} target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300 transition">
                          Source Code &rarr;
                        </a>
                      )}
                      {proj.liveLink && (
                        <a href={proj.liveLink} target="_blank" rel="noreferrer" className="text-cyan-400 hover:text-cyan-300 transition">
                          Live Demo &rarr;
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. Education & Experience Split Timelines */}
        <section id="timeline" className="space-y-6 scroll-mt-20">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-xl font-bold text-white border-l-2 border-indigo-500 pl-3">Timeline History</h2>
            
            {/* Navigational Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('experience')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition ${
                  activeTab === 'experience'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/25'
                    : 'text-white/60 border-white/10 hover:text-white'
                }`}
                style={activeTab !== 'experience' ? { background: 'rgba(0,0,0,0.25)' } : {}}
              >
                Work Experience
              </button>
              <button
                onClick={() => setActiveTab('education')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition ${
                  activeTab === 'education'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/25'
                    : 'text-white/60 border-white/10 hover:text-white'
                }`}
                style={activeTab !== 'education' ? { background: 'rgba(0,0,0,0.25)' } : {}}
              >
                Education
              </button>
            </div>
          </div>
          
          <div className="glass ending-edge-animate rounded-2xl p-8 border border-white/5 min-h-[250px]">
            {activeTab === 'experience' ? (
              <div className="space-y-6">
                <h3 className="text-base font-bold uppercase tracking-wider text-indigo-300 font-mono">Professional History</h3>
                {profile.experiences && profile.experiences.length > 0 ? (
                  <div className="relative border-l border-dashed border-indigo-500/30 pl-6 ml-3 space-y-8">
                    {profile.experiences.map((exp) => (
                      <div key={exp.id} className="relative">
                        {/* Timeline Dot */}
                        <span className="absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full bg-indigo-500 border-2 border-white/20 shadow-lg shadow-indigo-500/50"></span>
                        <div className="space-y-2">
                          <span className="text-xs border border-white/10 px-3 py-1 rounded font-mono text-indigo-300" style={{ background: 'rgba(0,0,0,0.30)' }}>
                            {exp.startDate} - {exp.endDate || 'Present'}
                          </span>
                          <h4 className="text-lg font-extrabold text-white leading-tight">{exp.role}</h4>
                          <p className="text-sm text-slate-300 font-bold">{exp.company}</p>
                          <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-line">{exp.description}</p>
                          {exp.mediaUrl && (
                            <div className="mt-3">
                              {exp.mediaUrl.toLowerCase().endsWith('.pdf') ? (
                                <a
                                  href={getImageUrl(exp.mediaUrl)}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-2 rounded bg-indigo-600/20 border border-indigo-500/30 px-3 py-1.5 text-xs text-indigo-300 hover:bg-indigo-600 hover:text-white transition duration-200"
                                >
                                  <span>📄 View Work Certificate/Proof</span>
                                </a>
                              ) : (
                                <a
                                  href={getImageUrl(exp.mediaUrl)}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-block group overflow-hidden rounded-lg border border-white/5 hover:border-indigo-500/30 transition max-w-xs"
                                >
                                  <img
                                    src={getImageUrl(exp.mediaUrl)}
                                    alt={`${exp.company} Certificate`}
                                    className="max-h-36 object-cover rounded-lg group-hover:scale-105 transition duration-300"
                                  />
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 italic">No professional history entries added.</p>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <h3 className="text-base font-bold uppercase tracking-wider text-cyan-300 font-mono">Academic Timeline</h3>
                {profile.educations && profile.educations.length > 0 ? (
                  <div className="relative border-l border-dashed border-cyan-500/30 pl-6 ml-3 space-y-8">
                    {profile.educations.map((ed) => (
                      <div key={ed.id} className="relative">
                        {/* Timeline Dot */}
                        <span className="absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full bg-cyan-500 border-2 border-white/20 shadow-lg shadow-cyan-500/50"></span>
                        <div className="space-y-2">
                          <span className="text-xs border border-white/10 px-3 py-1 rounded font-mono text-cyan-300" style={{ background: 'rgba(0,0,0,0.30)' }}>
                            {ed.timeline}
                          </span>
                          <h4 className="text-lg font-extrabold text-white leading-tight">{ed.degreeName}</h4>
                          <p className="text-sm text-white/80 font-bold">{ed.institution}</p>
                          {ed.gradeOrCgpa && (
                            <span className="inline-block text-xs border border-cyan-500/30 text-cyan-400 px-3 py-1 rounded mt-1 font-mono font-semibold" style={{ background: 'rgba(0,0,0,0.30)' }}>
                              Grade / CGPA: {ed.gradeOrCgpa}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 italic">No academic timeline credentials added.</p>
                )}
              </div>
            )}
          </div>
        </section>
        {/* 7. Certificates Dashboard Grid */}
        {profile.certificates && profile.certificates.length > 0 && (
          <section id="certificates" className="space-y-6 scroll-mt-20">
            {/* Custom Header with sub-label */}
            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#10b981] font-mono block">
                / Credentials
              </span>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                Certifications
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {profile.certificates.map((cert) => {
                const nameLower = (cert.name || '').toLowerCase();
                const isCyber = nameLower.includes('cyber') || nameLower.includes('security') || nameLower.includes('hacking') || nameLower.includes('penetration');

                return (
                  <div
                    key={cert.id}
                    className={`border ending-edge-animate p-5 rounded-2xl relative overflow-hidden backdrop-blur-md transition-all duration-300 flex flex-col justify-between gap-4 group ${
                      isCyber 
                        ? 'border-emerald-500/30 hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] animate-[pulse-slow_4s_infinite]' 
                        : 'border-white/10'
                    }`}
                    style={{ background: 'rgba(0,0,0,0.28)' }}
                  >
                    <div className="flex items-start gap-4">
                      {/* Badge Wrapper with custom animation */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                        isCyber 
                          ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400' 
                          : 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500/20'
                      }`}>
                        {isCyber ? (
                          // Cyber Security Shield Icon
                          <svg className="w-6 h-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        ) : (
                          // Standard Certificate Medal Icon
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4" />
                          </svg>
                        )}
                      </div>

                      {/* Content Container */}
                      <div className="min-w-0 flex-1 space-y-1">
                        <h3 className="text-sm font-bold text-white leading-tight group-hover:text-indigo-300 transition-colors">
                          {cert.name}
                        </h3>
                        <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                          {cert.issuingOrganization}
                        </p>
                        {cert.issueDate && (
                          <p className="text-[9px] text-slate-500 font-mono">Issued: {cert.issueDate}</p>
                        )}
                      </div>
                    </div>

                    {/* Image / File Preview (Always visible on mobile & desktop) */}
                    {cert.filePath && (
                      <div className="w-full h-32 rounded-xl overflow-hidden border border-white/10 relative group-hover:border-indigo-500/30 transition duration-300">
                        <img
                          src={getImageUrl(cert.filePath)}
                          alt={cert.name}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      </div>
                    )}

                    {/* Action Links */}
                    {(cert.credentialUrl || cert.filePath) && (
                      <div className="flex gap-3 pt-2 border-t border-white/5 text-right justify-end">
                        {cert.credentialUrl && (
                          <a
                            href={cert.credentialUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 transition"
                          >
                            Verify Link ↗
                          </a>
                        )}
                        {cert.filePath && (
                          <a
                            href={getImageUrl(cert.filePath)}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 transition"
                          >
                            View File ↗
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 8. Achievements Volumetric Timeline */}
        {profile.achievements && profile.achievements.length > 0 && (
          <section id="achievements" className="space-y-6 scroll-mt-20">
            {/* Custom Header with line indicator */}
            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#10b981] font-mono block">
                / Recognition
              </span>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                Achievements
              </h2>
              {/* Amethyst-to-Cyan underline banner */}
              <div className="w-16 h-1 bg-gradient-to-r from-[#a78bfa] via-[#c084fc] to-[#22d3ee] rounded-full mt-2" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
              {profile.achievements.map((ach, idx) => {
                // Alternating tag themes for mockup alignment
                const isEven = idx % 2 === 0;
                const tagText = isEven ? "Major Achievement" : "Selected Cohort";
                const tagClass = isEven 
                  ? "border border-white/10 text-white/50"
                  : "bg-[#22d3ee]/10 border border-[#22d3ee]/20 text-[#22d3ee]";

                return (
                  <div
                    key={ach.id}
                    className="border border-white/10 ending-edge-animate p-6 rounded-2xl backdrop-blur-md relative overflow-hidden flex flex-col md:flex-row justify-between items-start gap-6 group min-h-[180px]"
                    style={{ background: 'rgba(0,0,0,0.28)' }}
                  >
                    {/* Top gradient highlight strip */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#22d3ee]/30 to-transparent" />

                    {/* Content: text and labels */}
                    <div className="flex-1 space-y-3 min-w-0">
                      <span className={`inline-block text-[9px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full ${tagClass}`}>
                        {tagText}
                      </span>
                      
                      <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-[#22d3ee] transition-colors leading-snug">
                        {ach.title}
                      </h3>

                      {ach.description && (
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {ach.description}
                        </p>
                      )}
                    </div>

                    {/* Right graphics area */}
                    <div className="flex flex-col items-end gap-3 flex-shrink-0 w-full md:w-auto">
                      {/* Recognition Date/Event Badge */}
                      {ach.associatedDate && (
                        <div className="border border-white/10 px-3 py-1.5 rounded-xl font-mono text-[9px] text-white/50 uppercase tracking-widest text-right" style={{ background: 'rgba(0,0,0,0.30)' }}>
                          <span className="text-[7px] text-slate-600 block">RECOGNITION</span>
                          {ach.associatedDate}
                        </div>
                      )}

                      {/* Optional proof image preview */}
                      {ach.mediaUrl && (
                        <div className="w-full md:w-48 h-36 md:h-24 rounded-xl overflow-hidden border border-white/10 shadow-lg group-hover:shadow-[0_0_15px_rgba(34,211,238,0.15)] transition duration-300">
                          <img
                            src={getImageUrl(ach.mediaUrl)}
                            alt={ach.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 9. Contact & Hire Me — Premium Asymmetric 12-Column Grid */}
        <section id="contact" className="scroll-mt-20 relative">

          {/* Subtle ambient glow backdrop */}
          <div className="absolute -inset-x-20 inset-y-0 bg-gradient-to-b from-[#10b981]/3 via-transparent to-transparent blur-3xl pointer-events-none -z-10" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-7xl mx-auto px-6 py-20">

            {/* ── LEFT COLUMN: Call-to-Action & Hero Focus ── */}
            <div className="lg:col-span-7 space-y-8">

              {/* Available-for-work pill badge */}
              <span className="inline-flex items-center gap-2 bg-[#10b981]/10 border border-[#10b981]/20 text-[#10b981] text-xs font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full">
                {/* Briefcase icon */}
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Available for work
              </span>

              {/* Main bold CTA headline — reduced scale */}
              <h2 className="text-white font-extrabold text-3xl md:text-4xl tracking-tight leading-tight">
                Let's build something<br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#10b981] via-[#00cc96] to-[#22d3ee]">useful.</span>
              </h2>

              {/* Descriptive sub-paragraph — reduced scale */}
              <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl">
                {profile.bio
                  ? profile.bio.split('.').slice(0, 2).join('.') + '.'
                  : "I engineer performant, scalable full-stack systems — from pixel-perfect interfaces to robust backend APIs. If you have a role, contract, or product idea that needs execution, let's talk."}
              </p>

              {/* CTA Action Buttons Row */}
              <div className="flex flex-wrap gap-4">

                {/* Email Me — Emerald solid block */}
                {profile.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="bg-[#00cc96] hover:bg-[#00b383] text-black font-bold px-6 py-3.5 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-[0_4px_20px_rgba(0,204,150,0.3)] no-underline"
                  >
                    {/* Paper-plane / send icon */}
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Email me
                  </a>
                )}

                {/* Resume — Ghost bordered anchor */}
                {profile.resumeUrl && (
                  <button
                    onClick={handleDownloadResume}
                    disabled={downloading}
                    className="border border-white/10 hover:border-white/20 text-white font-semibold px-6 py-3.5 rounded-xl transition-all duration-200 flex items-center gap-2"
                    style={{ background: 'rgba(0,0,0,0.22)' }}
                  >
                    {downloading ? 'Downloading…' : 'Resume'}
                    {/* Diagonal arrow ↗ */}
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  </button>
                )}

              </div>
            </div>

            {/* ── RIGHT COLUMN: Direct Contact Stack ── */}
            <div className="lg:col-span-5 flex flex-col gap-4">

              {/* Primary DIRECT CONTACT card */}
              <div className="border border-white/10 rounded-2xl p-6 backdrop-blur-md" style={{ background: 'rgba(0,0,0,0.28)' }}>
                {/* Mono label */}
                <p className="text-xs tracking-[0.2em] text-slate-500 uppercase font-mono mb-3">Direct Contact</p>

                {/* Email anchor — icon fixed, text truncates inside box */}
                {profile.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="hover:text-[#00cc96] transition-colors flex items-center gap-3 mb-3 no-underline group min-w-0 overflow-hidden"
                  >
                    {/* Glowing green mail icon — never shrinks */}
                    <span className="w-9 h-9 rounded-lg bg-[#00cc96]/10 border border-[#00cc96]/20 flex items-center justify-center text-[#00cc96] flex-shrink-0 group-hover:bg-[#00cc96]/20 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </span>
                    {/* Email text — truncates when too long, never overflows card */}
                    <span className="text-white font-bold text-base md:text-lg group-hover:text-[#00cc96] truncate min-w-0 transition-colors">
                      {profile.email}
                    </span>
                  </a>
                )}

                {/* Micro description */}
                <p className="text-xs text-slate-500 leading-relaxed">
                  Send the role, project idea, timeline, and what outcome you need. I'll reply with a clear next step.
                </p>
              </div>

              {/* Social Network Action Bars */}
              <div className="flex flex-col gap-3">

                {/* Phone */}
                {profile.phone && (
                  <a
                    href={`tel:${profile.phone}`}
                    className="w-full border border-white/10 hover:border-white/20 p-4 rounded-xl flex items-center justify-between text-white/80 hover:text-white transition-all duration-200 group no-underline"
                    style={{ background: 'rgba(0,0,0,0.22)' }}
                  >
                    <span className="font-semibold flex items-center gap-3 min-w-0">
                      {/* Phone icon */}
                      <svg className="w-5 h-5 text-indigo-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="truncate">{profile.phone}</span>
                    </span>
                    <svg className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  </a>
                )}

                {/* LinkedIn */}
                {profile.linkedinLink && (
                  <a
                    href={profile.linkedinLink}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full border border-white/10 hover:border-white/20 p-4 rounded-xl flex items-center justify-between text-white/80 hover:text-white transition-all duration-200 group no-underline"
                    style={{ background: 'rgba(0,0,0,0.22)' }}
                  >
                    <span className="font-semibold flex items-center gap-3">
                      {/* LinkedIn icon */}
                      <svg className="w-5 h-5 text-[#0a66c2]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      LinkedIn
                    </span>
                    <svg className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  </a>
                )}

                {/* GitHub */}
                {profile.githubLink && (
                  <a
                    href={profile.githubLink}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full border border-white/10 hover:border-white/20 p-4 rounded-xl flex items-center justify-between text-white/80 hover:text-white transition-all duration-200 group no-underline"
                    style={{ background: 'rgba(0,0,0,0.22)' }}
                  >
                    <span className="font-semibold flex items-center gap-3">
                      {/* GitHub icon */}
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                      GitHub
                    </span>
                    <svg className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  </a>
                )}

                {/* Instagram — always shown as a fallback social link */}
                {profile.instagramLink ? (
                  <a
                    href={profile.instagramLink}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full border border-white/10 hover:border-white/20 p-4 rounded-xl flex items-center justify-between text-white/80 hover:text-white transition-all duration-200 group no-underline"
                    style={{ background: 'rgba(0,0,0,0.22)' }}
                  >
                    <span className="font-semibold flex items-center gap-3">
                      {/* Instagram gradient icon */}
                      <svg className="w-5 h-5" fill="url(#igGrad)" viewBox="0 0 24 24">
                        <defs>
                          <linearGradient id="igGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#f09433" />
                            <stop offset="25%" stopColor="#e6683c" />
                            <stop offset="50%" stopColor="#dc2743" />
                            <stop offset="75%" stopColor="#cc2366" />
                            <stop offset="100%" stopColor="#bc1888" />
                          </linearGradient>
                        </defs>
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                      </svg>
                      Instagram
                    </span>
                    <svg className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  </a>
                ) : (
                  /* Fallback email bar if no instagram */
                  profile.email && (
                    <a
                      href={`mailto:${profile.email}`}
                      className="w-full border border-white/10 hover:border-white/20 p-4 rounded-xl flex items-center justify-between text-white/80 hover:text-white transition-all duration-200 group no-underline"
                      style={{ background: 'rgba(0,0,0,0.22)' }}
                    >
                      <span className="font-semibold flex items-center gap-3">
                        <svg className="w-5 h-5 text-[#00cc96]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Email
                      </span>
                      <svg className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                      </svg>
                    </a>
                  )
                )}

              </div>
            </div>

          </div>
        </section>
      </div>

      <footer
        className="py-12 border-t border-white/10 text-center text-xs text-white/40 mt-20 relative z-10 backdrop-blur-sm"
        style={{ background: `rgba(${hexToRgbParts(profile.backgroundColor || '#020617')},0.80)` }}
      >
        <p>&copy; {new Date().getFullYear()} {profile.name}. Powered by Folio.</p>
      </footer>
    </div>
  );
}
