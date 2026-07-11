import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axiosConfig';

export default function PortfolioChatBuilder({ portfolioId, onComplete }) {
  const chatEndRef = useRef(null);
  const [activePortfolioId, setActivePortfolioId] = useState(portfolioId);

  // Default state matching ProfileDTO & extended fields
  const [portfolioData, setPortfolioData] = useState({
    name: '',
    title: '',
    bio: '',
    profileImageUrl: '',
    resumeUrl: '',
    githubLink: '',
    linkedinLink: '',
    slug: '',
    backgroundColor: '#020617',
    roles: '',
    email: '',
    phone: '',
    fontFamily: 'sans',
    avatarAnimation: 'morphing-rings',
    skills: [],
    projects: [],
    experiences: [],
    certificates: [],
    educations: [],
    achievements: []
  });

  const [messages, setMessages] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [textInput, setTextInput] = useState('');
  
  // Custom states for specialized steps
  const [skillInputs, setSkillInputs] = useState({
    languages: '',
    skills: '',
    databases: '',
    tools: ''
  });
  const [editSkillInput, setEditSkillInput] = useState('');
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    techStack: '',
    githubLink: '',
    liveLink: ''
  });

  // Experience form state
  const [experienceForm, setExperienceForm] = useState({
    company: '',
    role: '',
    startDate: '',
    endDate: '',
    description: '',
    mediaUrl: ''
  });

  // Education form state
  const [educationForm, setEducationForm] = useState({
    degreeName: '',
    institution: '',
    timeline: '',
    gradeOrCgpa: ''
  });

  // Certificate form state (Step 7)
  const [certificateForm, setCertificateForm] = useState({
    name: '',
    issuingOrganization: '',
    issueDate: '',
    description: '',
    credentialUrl: '',
    filePath: ''
  });
  const [isCertUploading, setIsCertUploading] = useState(false);

  // Achievement form state (Step 8)
  const [achievementForm, setAchievementForm] = useState({
    title: '',
    associatedDate: '',
    description: '',
    mediaUrl: ''
  });
  const [isAchUploading, setIsAchUploading] = useState(false);
  const [isExpUploading, setIsExpUploading] = useState(false);
  
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  // Deployment panel success modal states
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    setActivePortfolioId(portfolioId);
    if (portfolioId) {
      // 1. Edit Mode: Load details and jump directly to review summary
      api.get(`/api/profile/${portfolioId}`)
        .then((response) => {
          const data = response.data;
          setPortfolioData({
            ...data,
            backgroundColor: data.backgroundColor || '#020617',
            roles: data.roles || '',
            email: data.email || '',
            phone: data.phone || '',
            fontFamily: data.fontFamily || 'sans',
            avatarAnimation: data.avatarAnimation || 'morphing-rings',
            skills: data.skills || [],
            projects: data.projects || [],
            experiences: data.experiences || [],
            certificates: data.certificates || [],
            educations: data.educations || [],
            achievements: data.achievements || []
          });
          if (data.profileImageUrl) {
            setImagePreview(`/api/files/download/${data.profileImageUrl}`);
          }
          setCurrentStep(10); // Jump to summary editor (Step 10)
          setMessages([
            {
              id: 1,
              sender: 'bot',
              text: `Welcome back! I have loaded your portfolio details for "${data.name}". You can modify any section below (including Theme, Font Family, Roles, Contact Details, Projects, and Timeline) and click 'Save & Publish Portfolio' to save changes.`,
              type: 'summary'
            }
          ]);
        })
        .catch((err) => {
          console.error(err);
          alert("Failed to load portfolio. Returning to console.");
          onComplete?.();
        });
    } else {
      // 2. Create Mode: Run conversational chatbot flow
      setCurrentStep(0);
      setMessages([
        {
          id: 1,
          sender: 'bot',
          text: "Welcome to your conversational Folio Builder! I'm here to help you publish a premium developer portfolio. First, what is your Full Name?",
          type: 'text'
        }
      ]);
    }
  }, [portfolioId]);

  // Auto Scroll Chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (sender, text, type = 'text') => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender,
        text,
        type
      }
    ]);
  };

  const nextStep = (userAnswer, updatedData) => {
    const nextIdx = currentStep + 1;
    setCurrentStep(nextIdx);

    setTimeout(() => {
      if (nextIdx === 1) {
        addMessage('bot', `Nice to meet you, ${userAnswer}! What are your professional roles? (Enter them as comma-separated tags, e.g., Full-Stack Developer, UI Designer, DevOps Engineer)`);
      } else if (nextIdx === 2) {
        addMessage('bot', "Excellent. Now tell me a bit about yourself in a short, compelling bio summary.");
      } else if (nextIdx === 3) {
        addMessage('bot', "Great bio. Let's add your core tech skills. Type a skill (e.g. React, Java, Docker) and hit Enter. Click 'Proceed' when done.", 'skills-input');
      } else if (nextIdx === 4) {
        addMessage('bot', "Fantastic! Let's build your Projects list. I have added template choices to guide you. Fill out the details and click 'Add Project'. Click 'Proceed' when finished.", 'project-form');
      } else if (nextIdx === 5) {
        addMessage('bot', "Perfect! Let's upload your media assets. In this step, you can upload both your professional PDF Resume and your profile avatar image.", 'file-upload');
      } else if (nextIdx === 6) {
        addMessage('bot', "Awesome. Let's record your Work Experience or Internships. Fill out each job entry and click 'Add Experience'. Click 'Proceed' when done.", 'experience-form');
      } else if (nextIdx === 7) {
        addMessage('bot', "Great. Let's add your Certificates & Credentials. Fill out each certificate entry below and click 'Add Certificate'. Upload the file if available. Click 'Proceed' when done.", 'certificate-form');
      } else if (nextIdx === 8) {
        addMessage('bot', "Excellent! Now let's capture your Achievements & Awards. Add each milestone below. You can upload a proof image/photo. Click 'Proceed' when done.", 'achievement-form');
      } else if (nextIdx === 9) {
        addMessage('bot', "Almost there! Let's add your Academic Timeline. Fill out your degree details below and click 'Add Education'. Click 'Proceed' when finished.", 'education-form');
      } else if (nextIdx === 10) {
        addMessage('bot', "Superb! We have collected your full profile. Review your information below, set your theme color, select font typography, and click 'Save & Publish Portfolio'!", 'summary');
      }
    }, 600);
  };

  // Handles standard text submission from bottom input bar
  const handleSendText = (e) => {
    e?.preventDefault();
    if (!textInput.trim()) return;

    const answer = textInput.trim();
    addMessage('user', answer);
    setTextInput('');

    let updated = { ...portfolioData };

    if (currentStep === 0) {
      updated.name = answer;
      setPortfolioData(updated);
      nextStep(answer, updated);
    } else if (currentStep === 1) {
      updated.roles = answer;
      // Derive first role as title fallback
      updated.title = answer.split(',')[0].trim();
      setPortfolioData(updated);
      nextStep(answer, updated);
    } else if (currentStep === 2) {
      updated.bio = answer;
      setPortfolioData(updated);
      nextStep(answer, updated);
    }
  };

  // Skills input handler
  const handleAddSkillCategorized = (e, catKey) => {
    e.preventDefault();
    const val = skillInputs[catKey]?.trim();
    if (!val) return;
    
    // Map internal key to database category suffix
    let dbCategory = 'Skills / Frameworks';
    if (catKey === 'languages') dbCategory = 'Programming Languages';
    else if (catKey === 'databases') dbCategory = 'Database';
    else if (catKey === 'tools') dbCategory = 'Tools';

    const newSkill = { name: `${val}::${dbCategory}` };
    const updatedSkills = [...portfolioData.skills, newSkill];
    
    setPortfolioData((prev) => ({ ...prev, skills: updatedSkills }));
    setSkillInputs(prev => ({ ...prev, [catKey]: '' }));
  };
  
  const handleEditAddSkill = (e) => {
    e.preventDefault();
    if (!editSkillInput.trim()) return;
    
    const newSkill = { name: editSkillInput.trim() };
    const updatedSkills = [...portfolioData.skills, newSkill];
    
    setPortfolioData((prev) => ({ ...prev, skills: updatedSkills }));
    setEditSkillInput('');
  };

  const handleRemoveSkill = (indexToRemove) => {
    const updatedSkills = portfolioData.skills.filter((_, idx) => idx !== indexToRemove);
    setPortfolioData((prev) => ({ ...prev, skills: updatedSkills }));
  };

  const handleSkillsSubmit = () => {
    const hasUnsaved = Object.values(skillInputs).some(val => val?.trim());
    if (hasUnsaved) {
      const confirmProceed = window.confirm(
        "⚠️ You have typed skills but haven't added them.\n\n" +
        "Click OK to discard these skills and proceed, or Cancel to go back and add them."
      );
      if (!confirmProceed) return;
    }
    addMessage('user', `Skills added: ${portfolioData.skills.map(s => s.name).join(', ')}`);
    nextStep('', portfolioData);
  };

  // Projects input handler
  const handleAddProject = (e) => {
    e.preventDefault();
    if (!projectForm.title.trim()) return;

    const newProject = { ...projectForm };
    const updatedProjects = [...portfolioData.projects, newProject];
    
    setPortfolioData((prev) => ({ ...prev, projects: updatedProjects }));
    addMessage('bot', `Project added: "${projectForm.title}"`);
    
    setProjectForm({
      title: '',
      description: '',
      techStack: '',
      githubLink: '',
      liveLink: ''
    });
  };

  const handlePreFillProject = (type) => {
    if (type === 'quiz') {
      setProjectForm({
        title: 'Intelligent Quiz Management System',
        description: 'An AI-powered quiz generator utilizing NLP engines and microservices to dynamically scale and grade exams.',
        techStack: 'Spring Boot, React, Tailwind CSS, PostgreSQL, OpenAI API',
        githubLink: 'https://github.com/example/quiz-system',
        liveLink: 'https://quiz-system.live'
      });
    } else if (type === 'ecowipe') {
      setProjectForm({
        title: 'EcoWipe Sustainability Platform',
        description: 'A resource monitoring dashboard tracking manufacturing carbon footprints with high-performance visualizations.',
        techStack: 'React, Node.js, Chart.js, Tailwind, MongoDB',
        githubLink: 'https://github.com/example/ecowipe',
        liveLink: 'https://ecowipe-eco.org'
      });
    } else if (type === 'passport') {
      setProjectForm({
        title: 'Skill Passport 360',
        description: 'A decentralized verifiable credentials profile database allowing engineers to display certified credentials.',
        techStack: 'Java, Spring Security, JWT, JPA, Docker',
        githubLink: 'https://github.com/example/skillpassport',
        liveLink: 'https://skill-passport.net'
      });
    }
  };

  const handleProjectsSubmit = () => {
    if (projectForm.title.trim() || projectForm.description.trim()) {
      const confirmProceed = window.confirm(
        "⚠️ You have filled out project details but haven't clicked '+ Add Project'.\n\n" +
        "Click OK to discard these details and proceed, or Cancel to go back and add the project."
      );
      if (!confirmProceed) return;
    }
    addMessage('user', `Added ${portfolioData.projects.length} project(s).`);
    nextStep('', portfolioData);
  };

  // Media upload handler - Slot A (PDF Resume)
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert("Please upload a PDF file only.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/api/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      const fileName = response.data.fileName;
      
      setPortfolioData(prev => ({ ...prev, resumeUrl: fileName }));
      addMessage('user', `Uploaded resume: ${file.name}`);
      addMessage('bot', "Resume uploaded and secured successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to upload PDF resume.");
    } finally {
      setIsUploading(false);
    }
  };

  // Media upload handler - Slot B (Profile Avatar Image)
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validImageTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validImageTypes.includes(file.type)) {
      alert('Invalid image type. Please select a PNG or JPG/JPEG file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File is too large. Image size must be less than 5MB.');
      return;
    }

    // Show instant local thumbnail preview
    setImagePreview(URL.createObjectURL(file));
    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/api/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const fileName = response.data.fileName;
      setPortfolioData(prev => ({ ...prev, profileImageUrl: fileName }));
      addMessage('user', `Uploaded avatar: ${file.name}`);
      addMessage('bot', 'Profile avatar uploaded successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to upload profile image.');
    } finally {
      setIsUploading(false);
    }
  };

  // Experience input handler
  const handleExperienceMediaUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsExpUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await api.post('/api/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const fileName = response.data.fileName;
      setExperienceForm(prev => ({ ...prev, mediaUrl: fileName }));
      addMessage('bot', `Experience document/proof uploaded: ${file.name}`);
    } catch (err) {
      console.error(err);
      alert('Failed to upload experience document.');
    } finally {
      setIsExpUploading(false);
    }
  };

  const handleAddExperience = (e) => {
    e.preventDefault();
    if (!experienceForm.company.trim() || !experienceForm.role.trim()) return;

    const newExp = { ...experienceForm };
    const updatedExperiences = [...portfolioData.experiences, newExp];

    setPortfolioData((prev) => ({ ...prev, experiences: updatedExperiences }));
    addMessage('bot', `Experience added: "${experienceForm.role}" at ${experienceForm.company}`);

    setExperienceForm({
      company: '',
      role: '',
      startDate: '',
      endDate: '',
      description: '',
      mediaUrl: ''
    });
  };

  const handleExperienceSubmit = () => {
    if (experienceForm.company.trim() || experienceForm.role.trim()) {
      const confirmProceed = window.confirm(
        "⚠️ You have filled out work experience details but haven't clicked 'Add Experience'.\n\n" +
        "Click OK to discard these details and proceed, or Cancel to go back and add the experience."
      );
      if (!confirmProceed) return;
    }
    addMessage('user', `Added ${portfolioData.experiences.length} work experience entries.`);
    nextStep('', portfolioData);
  };

  // Education input handler
  const handleAddEducation = (e) => {
    e.preventDefault();
    if (!educationForm.degreeName.trim() || !educationForm.institution.trim()) return;

    const newEd = { ...educationForm };
    const updatedEducations = [...portfolioData.educations, newEd];

    setPortfolioData((prev) => ({ ...prev, educations: updatedEducations }));
    addMessage('bot', `Education added: "${educationForm.degreeName}" from ${educationForm.institution}`);

    setEducationForm({
      degreeName: '',
      institution: '',
      timeline: '',
      gradeOrCgpa: ''
    });
  };

  const handleEducationSubmit = () => {
    if (educationForm.degreeName.trim() || educationForm.institution.trim()) {
      const confirmProceed = window.confirm(
        "⚠️ You have filled out education details but haven't clicked 'Add Education'.\n\n" +
        "Click OK to discard these details and proceed, or Cancel to go back and add the education."
      );
      if (!confirmProceed) return;
    }
    addMessage('user', `Added ${portfolioData.educations.length} academic credential(s).`);
    nextStep('', portfolioData);
  };

  // Certificates input handler (Step 7)
  const handleCertFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsCertUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await api.post('/api/files/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setCertificateForm(prev => ({ ...prev, filePath: response.data.fileName }));
      addMessage('bot', `Certificate file uploaded: ${file.name}`);
    } catch (err) {
      console.error(err);
      alert('Failed to upload certificate file.');
    } finally {
      setIsCertUploading(false);
    }
  };

  const handleAddCertificate = (e) => {
    e.preventDefault();
    if (!certificateForm.name.trim() || !certificateForm.issuingOrganization.trim()) return;
    const newCert = { ...certificateForm };
    setPortfolioData(prev => ({ ...prev, certificates: [...prev.certificates, newCert] }));
    addMessage('bot', `Certificate added: "${certificateForm.name}"`);
    setCertificateForm({ name: '', issuingOrganization: '', issueDate: '', description: '', credentialUrl: '', filePath: '' });
  };

  const handleCertificatesSubmit = () => {
    if (certificateForm.name.trim() || certificateForm.issuingOrganization.trim()) {
      const confirmProceed = window.confirm(
        "⚠️ You have filled out certificate details but haven't clicked 'Add Certificate'.\n\n" +
        "Click OK to discard these details and proceed, or Cancel to go back and add the certificate."
      );
      if (!confirmProceed) return;
    }
    addMessage('user', `Added ${portfolioData.certificates.length} certificate(s).`);
    nextStep('', portfolioData);
  };

  // Achievements input handler (Step 8)
  const handleAchievementMediaUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) { alert('Please upload a PNG or JPG image.'); return; }
    if (file.size > 5 * 1024 * 1024) { alert('Image must be under 5MB.'); return; }
    setIsAchUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await api.post('/api/files/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setAchievementForm(prev => ({ ...prev, mediaUrl: response.data.fileName }));
      addMessage('bot', `Achievement proof uploaded: ${file.name}`);
    } catch (err) {
      console.error(err);
      alert('Failed to upload achievement proof.');
    } finally {
      setIsAchUploading(false);
    }
  };

  const handleAddAchievement = (e) => {
    e.preventDefault();
    if (!achievementForm.title.trim()) return;
    const newAch = { ...achievementForm };
    setPortfolioData(prev => ({ ...prev, achievements: [...prev.achievements, newAch] }));
    addMessage('bot', `Achievement added: "${achievementForm.title}"`);
    setAchievementForm({ title: '', associatedDate: '', description: '', mediaUrl: '' });
  };

  const handleAchievementsSubmit = () => {
    if (achievementForm.title.trim()) {
      const confirmProceed = window.confirm(
        "⚠️ You have filled out achievement details but haven't clicked 'Add Achievement'.\n\n" +
        "Click OK to discard these details and proceed, or Cancel to go back and add the achievement."
      );
      if (!confirmProceed) return;
    }
    addMessage('user', `Added ${portfolioData.achievements.length} achievement(s).`);
    nextStep('', portfolioData);
  };

  // Submit DTO to backend (POST for new, PUT for edits)
  const handlePublish = async () => {
    setIsSaving(true);
    setSaveStatus('');
    
    // Validate unsaved sub-forms
    const unsavedSections = [];
    if (projectForm.title.trim() || projectForm.description.trim()) unsavedSections.push("Projects");
    if (experienceForm.company.trim() || experienceForm.role.trim()) unsavedSections.push("Work Experience");
    if (educationForm.degreeName.trim() || educationForm.institution.trim()) unsavedSections.push("Education");
    if (certificateForm.name.trim() || certificateForm.issuingOrganization.trim()) unsavedSections.push("Certificates");
    if (achievementForm.title.trim()) unsavedSections.push("Achievements");
    if (Object.values(skillInputs).some(val => val?.trim()) || editSkillInput.trim()) unsavedSections.push("Skills");

    if (unsavedSections.length > 0) {
      const confirmSave = window.confirm(
        `⚠️ WARNING: You have filled out details in the following sections but did not click their "Add" or "+ Add" button:\n\n` +
        unsavedSections.map(s => `• ${s}`).join('\n') +
        `\n\nThese details will NOT be saved to your portfolio. Do you want to proceed and discard these unsaved details?`
      );
      if (!confirmSave) {
        setIsSaving(false);
        return;
      }
    }

    // Validate missing contact details
    const missing = [];
    if (!portfolioData.email?.trim()) missing.push("Email Address");
    if (!portfolioData.phone?.trim()) missing.push("Contact Number");
    if (!portfolioData.githubLink?.trim()) missing.push("GitHub Profile Link");
    if (!portfolioData.linkedinLink?.trim()) missing.push("LinkedIn Profile Link");

    if (missing.length > 0) {
      const confirmPublish = window.confirm(
        `⚠️ WARNING: Your portfolio is missing the following key contact details:\n\n` +
        missing.map(m => `• ${m}`).join('\n') +
        `\n\nIt is highly recommended to fill these out so employers can reach you. Do you want to publish anyway?`
      );
      if (!confirmPublish) {
        setIsSaving(false);
        return;
      }
    }

    // Fallback title to first role tag if title is empty
    const finalData = {
      ...portfolioData,
      title: portfolioData.title || (portfolioData.roles ? portfolioData.roles.split(',')[0].trim() : 'Developer')
    };

    try {
      let response;
      if (activePortfolioId) {
        response = await api.put(`/api/profile/${activePortfolioId}`, finalData);
      } else {
        response = await api.post('/api/profile', finalData);
      }
      const savedProfile = response.data;
      if (savedProfile) {
        setPortfolioData(savedProfile);
        if (savedProfile.id) {
          setActivePortfolioId(savedProfile.id);
        }
      }
      setSaveStatus('success');
      
      // Delay to show Deploy Modal instead of returning instantly
      setTimeout(() => {
        setShowDeployModal(true);
      }, 800);

    } catch (err) {
      console.error(err);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/public/portfolio/${portfolioData.slug}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadHtml = async (e) => {
    e.preventDefault();
    if (!portfolioData.slug) {
      alert("Error: Portfolio slug is not available. Please save your portfolio first.");
      return;
    }
    try {
      const response = await api.get(`/api/public/portfolio/${portfolioData.slug}/export`, {
        responseType: 'blob'
      });
      const blob = new Blob([response.data], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${portfolioData.slug}-portfolio.html`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download HTML:', err);
      alert('Failed to download the HTML portfolio file. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto glass rounded-2xl border border-white/10 flex flex-col h-[650px] overflow-hidden shadow-2xl shadow-indigo-500/5 relative">
      
      {/* SUCCESS DEPLOYMENT MODAL OVERLAY */}
      {showDeployModal && (
        <div className="absolute inset-0 bg-slate-950/95 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="bg-[#070a13] border border-slate-800 rounded-3xl p-7 max-w-2xl w-full text-center space-y-5 shadow-2xl shadow-indigo-500/10 my-auto">

            {/* ── Header ── */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-3xl animate-bounce">
                🎉
              </div>
              <h2 className="text-2xl font-extrabold text-white">Portfolio Ready!</h2>
              <p className="text-xs text-slate-400 max-w-md">
                Your portfolio is live on Folio. You can also <span className="text-indigo-400 font-semibold">download it as a standalone HTML file</span> and deploy to Netlify, Vercel, or GitHub Pages — no backend needed.
              </p>
            </div>

            {/* ── Hosted link ── */}
            <div className="text-left space-y-1">
              <label className="text-[10px] text-slate-500 uppercase font-mono tracking-wider font-semibold block">
                🌐 Folio Hosted URL (share this link)
              </label>
              <div className="flex gap-2 items-center bg-[#0c101f] border border-slate-800 p-2.5 rounded-xl">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/public/portfolio/${portfolioData.slug}`}
                  className="flex-grow bg-transparent text-xs text-slate-300 font-mono focus:outline-none truncate select-all"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shrink-0"
                >
                  {copiedLink ? '✓ Copied!' : 'Copy'}
                </button>
              </div>
              <p className="text-[10px] text-slate-600">Works as long as your Folio backend is running / deployed.</p>
            </div>

            {/* ── Deploy options ── */}
            <div className="text-left space-y-2">
              <p className="text-[10px] text-slate-400 uppercase font-mono tracking-wider font-semibold">
                🚀 Deploy Independently (no Folio backend required)
              </p>

              {/* Step instructions */}
              <div className="bg-slate-950/60 border border-white/5 rounded-xl p-3 space-y-1 text-[11px] text-slate-400">
                <p className="font-bold text-slate-300 mb-1">How to deploy in 30 seconds:</p>
                <p><span className="text-indigo-400 font-bold">1.</span> Click <span className="text-white font-semibold">Download HTML</span> below → saves <code className="bg-slate-800 px-1 rounded text-[10px]">{portfolioData.slug}-portfolio.html</code></p>
                <p><span className="text-indigo-400 font-bold">2a. Netlify:</span> Open <span className="text-cyan-400">app.netlify.com/drop</span> → drag-and-drop the file → get your link ✓</p>
                <p><span className="text-indigo-400 font-bold">2b. Vercel:</span> Put the file in a folder → <code className="bg-slate-800 px-1 rounded text-[10px]">vercel --prod</code> → get your link ✓</p>
                <p><span className="text-indigo-400 font-bold">2c. GitHub Pages:</span> Rename to <code className="bg-slate-800 px-1 rounded text-[10px]">index.html</code> → push to repo → enable Pages ✓</p>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">

                {/* Download HTML */}
                <a
                  href={`${import.meta.env.VITE_API_URL || 'https://folio-backend-k6qf.onrender.com'}/api/public/portfolio/${portfolioData.slug}/export`}
                  download={`${portfolioData.slug}-portfolio.html`}
                  className="flex flex-col items-center gap-1.5 py-3 px-3 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white font-semibold text-xs transition shadow-lg shadow-indigo-700/20 text-center w-full no-underline"
                >
                  <span className="text-xl">📥</span>
                  <span>Download HTML</span>
                  <span className="text-[9px] font-normal text-indigo-200">Self-contained file</span>
                </a>

                {/* Netlify Drop */}
                <a
                  href="https://app.netlify.com/drop"
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center gap-1.5 py-3 px-3 rounded-xl bg-[#00ad9f] hover:bg-[#00bfae] text-white font-semibold text-xs transition shadow-lg shadow-emerald-500/10 no-underline text-center"
                >
                  <span className="text-xl">🟢</span>
                  <span>Deploy to Netlify</span>
                  <span className="text-[9px] font-normal text-teal-100">Drag-drop site ↗</span>
                </a>

                {/* Vercel */}
                <a
                  href="https://vercel.com/new"
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center gap-1.5 py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-xs transition no-underline text-center"
                >
                  <span className="text-xl">▲</span>
                  <span>Deploy to Vercel</span>
                  <span className="text-[9px] font-normal text-slate-400">Upload project ↗</span>
                </a>

              </div>
            </div>

            {/* ── Footer buttons ── */}
            <div className="grid grid-cols-2 gap-3 pt-1 border-t border-white/5">
              <button
                onClick={() => {
                  const slug = portfolioData.slug || 'mani';
                  window.open(`${window.location.origin}/public/portfolio/${slug}`, '_blank');
                }}
                className="w-full text-center py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-500/20 transition-all"
              >
                View Portfolio ↗
              </button>
              <button
                onClick={() => {
                  setShowDeployModal(false);
                  onComplete?.();
                }}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs transition"
              >
                Back to Website
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Top Banner */}
      <div className="px-6 py-4 border-b border-white/10 bg-slate-950/40 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-indigo-400 animate-ping"></span>
          <p className="text-sm font-semibold text-slate-200">
            {activePortfolioId ? 'Folio Editor Console' : 'Folio Design Engine'}
          </p>
        </div>
        <p className="text-xs text-slate-500 font-mono">
          {activePortfolioId ? 'Review Mode' : `Step ${currentStep} / 10`}
        </p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className="space-y-2">
            
            <div className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-lg transition duration-300 ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-slate-900 text-slate-200 border border-white/5 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>

            {/* Technical Skills input UI inside chat */}
            {msg.sender === 'bot' && msg.type === 'skills-input' && currentStep === 3 && (
              <div className="ml-4 mt-2 max-w-[95%] rounded-xl bg-slate-900/60 p-4 sm:p-5 border border-white/5 space-y-4 shadow-xl">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Languages */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-slate-500 font-bold uppercase font-mono">1. Programming Languages</label>
                    <form onSubmit={(e) => handleAddSkillCategorized(e, 'languages')} className="flex gap-1.5">
                      <input
                        type="text"
                        value={skillInputs.languages}
                        onChange={(e) => setSkillInputs(prev => ({ ...prev, languages: e.target.value }))}
                        className="flex-1 rounded-lg border border-white/10 bg-slate-950 px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                        placeholder="e.g. Python"
                      />
                      <button type="submit" className="rounded-lg bg-indigo-600 px-3 py-1.5 font-bold text-white hover:bg-indigo-500 transition">Add</button>
                    </form>
                  </div>

                  {/* Skills/Frameworks */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-slate-500 font-bold uppercase font-mono">2. Frameworks & Skills</label>
                    <form onSubmit={(e) => handleAddSkillCategorized(e, 'skills')} className="flex gap-1.5">
                      <input
                        type="text"
                        value={skillInputs.skills}
                        onChange={(e) => setSkillInputs(prev => ({ ...prev, skills: e.target.value }))}
                        className="flex-1 rounded-lg border border-white/10 bg-slate-950 px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                        placeholder="e.g. React"
                      />
                      <button type="submit" className="rounded-lg bg-indigo-600 px-3 py-1.5 font-bold text-white hover:bg-indigo-500 transition">Add</button>
                    </form>
                  </div>

                  {/* Databases */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-slate-500 font-bold uppercase font-mono">3. Databases</label>
                    <form onSubmit={(e) => handleAddSkillCategorized(e, 'databases')} className="flex gap-1.5">
                      <input
                        type="text"
                        value={skillInputs.databases}
                        onChange={(e) => setSkillInputs(prev => ({ ...prev, databases: e.target.value }))}
                        className="flex-1 rounded-lg border border-white/10 bg-slate-950 px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                        placeholder="e.g. Postgres"
                      />
                      <button type="submit" className="rounded-lg bg-indigo-600 px-3 py-1.5 font-bold text-white hover:bg-indigo-500 transition">Add</button>
                    </form>
                  </div>

                  {/* Tools */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-slate-500 font-bold uppercase font-mono">4. Tools</label>
                    <form onSubmit={(e) => handleAddSkillCategorized(e, 'tools')} className="flex gap-1.5">
                      <input
                        type="text"
                        value={skillInputs.tools}
                        onChange={(e) => setSkillInputs(prev => ({ ...prev, tools: e.target.value }))}
                        className="flex-1 rounded-lg border border-white/10 bg-slate-950 px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                        placeholder="e.g. Git"
                      />
                      <button type="submit" className="rounded-lg bg-indigo-600 px-3 py-1.5 font-bold text-white hover:bg-indigo-500 transition">Add</button>
                    </form>
                  </div>
                </div>

                {/* Combined flat list display */}
                {portfolioData.skills.length > 0 && (
                  <div className="space-y-1.5 border-t border-white/5 pt-3">
                    <span className="text-[9px] uppercase font-bold text-slate-500 font-mono block">Added Skills Deck</span>
                    <div className="flex flex-wrap gap-1.5">
                      {portfolioData.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 rounded bg-slate-800 border border-slate-700 px-2 py-0.5 text-xs text-indigo-300"
                        >
                          {skill.name.split('::')[0]}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(index)}
                            className="text-slate-400 hover:text-white text-[10px]"
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <button
                  onClick={handleSkillsSubmit}
                  className="w-full rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 py-1.5 text-xs font-semibold hover:bg-indigo-600 hover:text-white transition"
                >
                  Proceed
                </button>
              </div>
            )}

            {/* Projects input UI inside chat */}
            {msg.sender === 'bot' && msg.type === 'project-form' && currentStep === 4 && (
              <div className="ml-4 mt-2 max-w-[90%] rounded-xl bg-slate-900/60 p-4 border border-white/5 space-y-4 shadow-xl">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-[10px] text-slate-500 font-mono">Sample ideas:</span>
                  <button
                    type="button"
                    onClick={() => handlePreFillProject('quiz')}
                    className="rounded bg-slate-950 border border-white/5 hover:border-indigo-500/50 text-[10px] text-slate-300 px-2 py-0.5 transition"
                  >
                    Quiz System
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePreFillProject('ecowipe')}
                    className="rounded bg-slate-950 border border-white/5 hover:border-indigo-500/50 text-[10px] text-slate-300 px-2 py-0.5 transition"
                  >
                    EcoWipe
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePreFillProject('passport')}
                    className="rounded bg-slate-950 border border-white/5 hover:border-indigo-500/50 text-[10px] text-slate-300 px-2 py-0.5 transition"
                  >
                    Skill Passport
                  </button>
                </div>

                <form onSubmit={handleAddProject} className="space-y-2 text-xs">
                  <input
                    type="text"
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-1.5 text-white placeholder-slate-600 focus:outline-none"
                    placeholder="Project Title (Required)"
                    required
                  />
                  <textarea
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-1.5 text-white placeholder-slate-600 focus:outline-none"
                    placeholder="Project Description"
                    rows={2}
                  />
                  <input
                    type="text"
                    value={projectForm.techStack}
                    onChange={(e) => setProjectForm({ ...projectForm, techStack: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-1.5 text-white placeholder-slate-600 focus:outline-none"
                    placeholder="Tech Stack (e.g. React, Node.js)"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="url"
                      value={projectForm.githubLink}
                      onChange={(e) => setProjectForm({ ...projectForm, githubLink: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-1.5 text-white placeholder-slate-600 focus:outline-none"
                      placeholder="GitHub URL"
                    />
                    <input
                      type="url"
                      value={projectForm.liveLink}
                      onChange={(e) => setProjectForm({ ...projectForm, liveLink: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-1.5 text-white placeholder-slate-600 focus:outline-none"
                      placeholder="Live Demo URL"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-indigo-600 py-2 font-semibold text-white hover:bg-indigo-500 transition"
                  >
                    Add Project
                  </button>
                </form>

                {portfolioData.projects.length > 0 && (
                  <div className="border-t border-white/5 pt-2">
                    <p className="text-[10px] text-slate-500 mb-1.5">Added Projects:</p>
                    <div className="space-y-1">
                      {portfolioData.projects.map((proj, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-slate-950 px-2 py-1 rounded text-[11px] text-slate-300">
                          <span>{proj.title}</span>
                          <button
                            onClick={() => {
                              const updated = portfolioData.projects.filter((_, pIdx) => pIdx !== idx);
                              setPortfolioData((prev) => ({ ...prev, projects: updated }));
                            }}
                            className="text-red-400 hover:text-red-300 text-[10px]"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={handleProjectsSubmit}
                  className="w-full rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 py-1.5 text-xs font-semibold hover:bg-indigo-600 hover:text-white transition"
                >
                  Proceed
                </button>
              </div>
            )}

            {/* Media Uploads UI inside chat (Step 5 - Dual-Slot media uploader) */}
            {msg.sender === 'bot' && msg.type === 'file-upload' && currentStep === 5 && (
              <div className="ml-4 mt-2 max-w-[90%] rounded-xl bg-slate-900/60 p-5 border border-white/5 space-y-4 shadow-xl">
                <span className="text-[10px] text-indigo-400 uppercase font-bold block">Media Asset Upload Pipeline</span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Slot A: PDF Resume */}
                  <div className="rounded-xl bg-slate-950 p-4 border border-white/5 flex flex-col items-center justify-center border-dashed border-2 border-slate-800 hover:border-indigo-500/50 transition">
                    <input
                      type="file"
                      id="pdf-upload"
                      accept=".pdf"
                      onChange={handleResumeUpload}
                      className="hidden"
                    />
                    <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center gap-2 text-center w-full">
                      <span className="text-xl">📄</span>
                      <span className="text-[11px] text-slate-300 font-semibold">
                        {portfolioData.resumeUrl ? '✓ Resume Selected' : 'Upload Resume (.pdf)'}
                      </span>
                      <span className="text-[9px] text-slate-500">Max size 10MB</span>
                    </label>
                  </div>

                  {/* Slot B: Profile Avatar Image */}
                  <div className="rounded-xl bg-slate-950 p-4 border border-white/5 flex flex-col items-center justify-center border-dashed border-2 border-slate-800 hover:border-indigo-500/50 transition">
                    <input
                      type="file"
                      id="avatar-upload"
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                    <label htmlFor="avatar-upload" className="cursor-pointer flex flex-col items-center gap-2 text-center w-full">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Avatar Preview" className="w-10 h-10 rounded-full object-cover border border-indigo-500/30" />
                      ) : (
                        <span className="text-xl">🖼️</span>
                      )}
                      <span className="text-[11px] text-slate-300 font-semibold">
                        {portfolioData.profileImageUrl ? '✓ Avatar Selected' : 'Upload Avatar (PNG/JPG)'}
                      </span>
                      <span className="text-[9px] text-slate-500">Max size 5MB</span>
                    </label>
                  </div>
                </div>

                <button
                  onClick={() => nextStep('', portfolioData)}
                  className="w-full rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 py-1.5 text-xs font-semibold hover:bg-indigo-600 hover:text-white transition"
                >
                  Proceed
                </button>
              </div>
            )}

            {/* Work Experience Form inside chat (Step 6) */}
            {msg.sender === 'bot' && msg.type === 'experience-form' && currentStep === 6 && (
              <div className="ml-4 mt-2 max-w-[90%] rounded-xl bg-slate-900/60 p-4 border border-white/5 space-y-4 shadow-xl">
                <form onSubmit={handleAddExperience} className="space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={experienceForm.company}
                      onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-1.5 text-white placeholder-slate-600 focus:outline-none"
                      placeholder="Company Name (Required)"
                      required
                    />
                    <input
                      type="text"
                      value={experienceForm.role}
                      onChange={(e) => setExperienceForm({ ...experienceForm, role: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-1.5 text-white placeholder-slate-600 focus:outline-none"
                      placeholder="Job Title (Required)"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={experienceForm.startDate}
                      onChange={(e) => setExperienceForm({ ...experienceForm, startDate: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-1.5 text-white placeholder-slate-600 focus:outline-none"
                      placeholder="Start Date (e.g. Jan 2024)"
                      required
                    />
                    <input
                      type="text"
                      value={experienceForm.endDate}
                      onChange={(e) => setExperienceForm({ ...experienceForm, endDate: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-1.5 text-white placeholder-slate-600 focus:outline-none"
                      placeholder="End Date (e.g. Present)"
                    />
                  </div>
                  <textarea
                    value={experienceForm.description}
                    onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-1.5 text-white placeholder-slate-600 focus:outline-none"
                    placeholder="Core Contributions & Accomplishments"
                    rows={2}
                  />
                  <div className="flex items-center gap-2">
                    <label className="flex-1 cursor-pointer flex items-center justify-between rounded-lg border border-white/10 bg-slate-950 px-3 py-1.5 text-slate-400 hover:text-white transition">
                      <span>{experienceForm.mediaUrl ? '✓ Certificate/Proof Uploaded' : 'Upload Certificate / Proof (Optional)'}</span>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleExperienceMediaUpload}
                        className="hidden"
                      />
                      <span className="text-xs">📂</span>
                    </label>
                    {isExpUploading && (
                      <span className="text-[10px] text-indigo-400 animate-pulse">Uploading...</span>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-indigo-600 py-2 font-semibold text-white hover:bg-indigo-500 transition"
                  >
                    Add Experience
                  </button>
                </form>

                {portfolioData.experiences.length > 0 && (
                  <div className="border-t border-white/5 pt-2">
                    <p className="text-[10px] text-slate-500 mb-1.5">Added Experience:</p>
                    <div className="space-y-1">
                      {portfolioData.experiences.map((exp, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-slate-950 px-2 py-1 rounded text-[11px] text-slate-300">
                          <span>{exp.role} at {exp.company}</span>
                          <button
                            onClick={() => {
                              const updated = portfolioData.experiences.filter((_, pIdx) => pIdx !== idx);
                              setPortfolioData((prev) => ({ ...prev, experiences: updated }));
                            }}
                            className="text-red-400 hover:text-red-300 text-[10px]"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={handleExperienceSubmit}
                  className="w-full rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 py-1.5 text-xs font-semibold hover:bg-indigo-600 hover:text-white transition"
                >
                  Proceed
                </button>
              </div>
            )}

            {/* Certificate Pipeline Form inside chat (Step 7) */}
            {msg.sender === 'bot' && msg.type === 'certificate-form' && currentStep === 7 && (
              <div className="ml-4 mt-2 max-w-[90%] rounded-xl bg-slate-900/60 p-4 border border-white/5 space-y-4 shadow-xl">
                <span className="text-[10px] text-indigo-400 uppercase font-bold block">Certificates & Credentials</span>
                <form onSubmit={handleAddCertificate} className="space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={certificateForm.name}
                      onChange={(e) => setCertificateForm({ ...certificateForm, name: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-1.5 text-white placeholder-slate-600 focus:outline-none"
                      placeholder="Certificate Title (Required)"
                      required
                    />
                    <input
                      type="text"
                      value={certificateForm.issuingOrganization}
                      onChange={(e) => setCertificateForm({ ...certificateForm, issuingOrganization: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-1.5 text-white placeholder-slate-600 focus:outline-none"
                      placeholder="Issuing Organization (Required)"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={certificateForm.issueDate}
                      onChange={(e) => setCertificateForm({ ...certificateForm, issueDate: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-1.5 text-white placeholder-slate-600 focus:outline-none"
                      placeholder="Issue Date (e.g. Mar 2024)"
                    />
                    <input
                      type="url"
                      value={certificateForm.credentialUrl}
                      onChange={(e) => setCertificateForm({ ...certificateForm, credentialUrl: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-1.5 text-white placeholder-slate-600 focus:outline-none"
                      placeholder="Credential URL (optional)"
                    />
                  </div>
                  <textarea
                    value={certificateForm.description}
                    onChange={(e) => setCertificateForm({ ...certificateForm, description: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-1.5 text-white placeholder-slate-600 focus:outline-none"
                    placeholder="Short description of what this certifies..."
                    rows={2}
                  />
                  {/* File upload slot */}
                  <div className="rounded-xl bg-slate-950 p-3 border-2 border-dashed border-slate-800 hover:border-indigo-500/50 transition flex items-center gap-3">
                    <input
                      type="file"
                      id="cert-file-upload"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={handleCertFileUpload}
                      className="hidden"
                    />
                    <label htmlFor="cert-file-upload" className="cursor-pointer flex items-center gap-2 text-[11px]">
                      <span className="text-base">📎</span>
                      <span className="text-slate-300 font-semibold">
                        {isCertUploading ? 'Uploading...' : (certificateForm.filePath ? `✓ ${certificateForm.filePath}` : 'Upload Certificate File (PDF/PNG/JPG)')}
                      </span>
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-indigo-600 py-2 font-semibold text-white hover:bg-indigo-500 transition"
                  >
                    Add Certificate
                  </button>
                </form>

                {portfolioData.certificates.length > 0 && (
                  <div className="border-t border-white/5 pt-2">
                    <p className="text-[10px] text-slate-500 mb-1.5">Added Certificates:</p>
                    <div className="space-y-1">
                      {portfolioData.certificates.map((cert, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-slate-950 px-2 py-1 rounded text-[11px] text-slate-300">
                          <span>{cert.name} — {cert.issuingOrganization}</span>
                          <button
                            onClick={() => {
                              const updated = portfolioData.certificates.filter((_, i) => i !== idx);
                              setPortfolioData(prev => ({ ...prev, certificates: updated }));
                            }}
                            className="text-red-400 hover:text-red-300 text-[10px]"
                          >Remove</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={handleCertificatesSubmit}
                  className="w-full rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 py-1.5 text-xs font-semibold hover:bg-indigo-600 hover:text-white transition"
                >
                  Proceed
                </button>
              </div>
            )}

            {/* Achievement Hub Form inside chat (Step 8) */}
            {msg.sender === 'bot' && msg.type === 'achievement-form' && currentStep === 8 && (
              <div className="ml-4 mt-2 max-w-[90%] rounded-xl bg-slate-900/60 p-4 border border-white/5 space-y-4 shadow-xl">
                <span className="text-[10px] text-emerald-400 uppercase font-bold block">Achievements & Awards</span>
                <form onSubmit={handleAddAchievement} className="space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={achievementForm.title}
                      onChange={(e) => setAchievementForm({ ...achievementForm, title: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-1.5 text-white placeholder-slate-600 focus:outline-none"
                      placeholder="Achievement Title (Required)"
                      required
                    />
                    <input
                      type="text"
                      value={achievementForm.associatedDate}
                      onChange={(e) => setAchievementForm({ ...achievementForm, associatedDate: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-1.5 text-white placeholder-slate-600 focus:outline-none"
                      placeholder="Date / Event (e.g. Hackathon 2024)"
                    />
                  </div>
                  <textarea
                    value={achievementForm.description}
                    onChange={(e) => setAchievementForm({ ...achievementForm, description: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-1.5 text-white placeholder-slate-600 focus:outline-none"
                    placeholder="Describe what you won or accomplished..."
                    rows={2}
                  />
                  {/* Proof image upload */}
                  <div className="rounded-xl bg-slate-950 p-3 border-2 border-dashed border-slate-800 hover:border-emerald-500/50 transition flex items-center gap-3">
                    <input
                      type="file"
                      id="ach-proof-upload"
                      accept="image/png,image/jpeg,image/jpg"
                      onChange={handleAchievementMediaUpload}
                      className="hidden"
                    />
                    <label htmlFor="ach-proof-upload" className="cursor-pointer flex items-center gap-2 text-[11px]">
                      <span className="text-base">🖼️</span>
                      <span className="text-slate-300 font-semibold">
                        {isAchUploading ? 'Uploading...' : (achievementForm.mediaUrl ? `✓ Proof uploaded` : 'Upload Proof Photo (PNG/JPG, max 5MB)')}
                      </span>
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-emerald-700 py-2 font-semibold text-white hover:bg-emerald-600 transition"
                  >
                    Add Achievement
                  </button>
                </form>

                {portfolioData.achievements.length > 0 && (
                  <div className="border-t border-white/5 pt-2">
                    <p className="text-[10px] text-slate-500 mb-1.5">Added Achievements:</p>
                    <div className="space-y-1">
                      {portfolioData.achievements.map((ach, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-slate-950 px-2 py-1 rounded text-[11px] text-slate-300">
                          <span>{ach.title}{ach.associatedDate ? ` — ${ach.associatedDate}` : ''}</span>
                          <button
                            onClick={() => {
                              const updated = portfolioData.achievements.filter((_, i) => i !== idx);
                              setPortfolioData(prev => ({ ...prev, achievements: updated }));
                            }}
                            className="text-red-400 hover:text-red-300 text-[10px]"
                          >Remove</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={handleAchievementsSubmit}
                  className="w-full rounded-lg bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 py-1.5 text-xs font-semibold hover:bg-emerald-600 hover:text-white transition"
                >
                  Proceed
                </button>
              </div>
            )}

            {/* Academic Details Form inside chat (Step 9) */}
            {msg.sender === 'bot' && msg.type === 'education-form' && currentStep === 9 && (
              <div className="ml-4 mt-2 max-w-[90%] rounded-xl bg-slate-900/60 p-4 border border-white/5 space-y-4 shadow-xl">
                <form onSubmit={handleAddEducation} className="space-y-2 text-xs">
                  <input
                    type="text"
                    value={educationForm.degreeName}
                    onChange={(e) => setEducationForm({ ...educationForm, degreeName: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-1.5 text-white placeholder-slate-600 focus:outline-none"
                    placeholder="Degree Name (e.g. Bachelor of Technology) (Required)"
                    required
                  />
                  <input
                    type="text"
                    value={educationForm.institution}
                    onChange={(e) => setEducationForm({ ...educationForm, institution: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-1.5 text-white placeholder-slate-600 focus:outline-none"
                    placeholder="Institution / College Name (Required)"
                    required
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={educationForm.timeline}
                      onChange={(e) => setEducationForm({ ...educationForm, timeline: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-1.5 text-white placeholder-slate-600 focus:outline-none"
                      placeholder="Timeline (e.g. 2022 - 2026)"
                      required
                    />
                    <input
                      type="text"
                      value={educationForm.gradeOrCgpa}
                      onChange={(e) => setEducationForm({ ...educationForm, gradeOrCgpa: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-1.5 text-white placeholder-slate-600 focus:outline-none"
                      placeholder="Grade / CGPA (e.g. 9.1 CGPA)"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-indigo-600 py-2 font-semibold text-white hover:bg-indigo-500 transition"
                  >
                    Add Academic Timeline
                  </button>
                </form>

                {portfolioData.educations.length > 0 && (
                  <div className="border-t border-white/5 pt-2">
                    <p className="text-[10px] text-slate-500 mb-1.5">Added Credentials:</p>
                    <div className="space-y-1">
                      {portfolioData.educations.map((ed, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-slate-950 px-2 py-1 rounded text-[11px] text-slate-300">
                          <span>{ed.degreeName} ({ed.institution})</span>
                          <button
                            onClick={() => {
                              const updated = portfolioData.educations.filter((_, pIdx) => pIdx !== idx);
                              setPortfolioData((prev) => ({ ...prev, educations: updated }));
                            }}
                            className="text-red-400 hover:text-red-300 text-[10px]"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={handleEducationSubmit}
                  className="w-full rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 py-1.5 text-xs font-semibold hover:bg-indigo-600 hover:text-white transition"
                >
                  Proceed
                </button>
              </div>
            )}

            {/* Summary / Edit Panel inside chat (Step 10) */}
            {msg.sender === 'bot' && msg.type === 'summary' && currentStep === 10 && (
              <div className="ml-4 mt-2 max-w-[95%] rounded-xl bg-slate-900/60 p-6 border border-white/5 space-y-5 shadow-2xl">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {activePortfolioId ? '✏️ Edit Portfolio' : 'Review & Publish Portfolio'}
                </h3>

                <div className="space-y-5 text-xs">

                  {/* ── Theme, Font & Animation ── */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 rounded-lg bg-slate-950 border border-white/5">
                    <div>
                      <label className="block text-[9px] text-slate-500 uppercase font-semibold mb-1">Background Theme Color</label>
                      <div className="flex gap-2 items-center">
                        <input type="color" value={portfolioData.backgroundColor}
                          onChange={(e) => setPortfolioData({ ...portfolioData, backgroundColor: e.target.value })}
                          className="h-8 w-12 rounded border border-white/10 bg-slate-950 cursor-pointer p-0.5" />
                        <input type="text" value={portfolioData.backgroundColor}
                          onChange={(e) => setPortfolioData({ ...portfolioData, backgroundColor: e.target.value })}
                          className="w-24 rounded bg-slate-900 border border-white/10 px-2 py-1 text-xs text-white font-mono" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] text-slate-500 uppercase font-semibold mb-1">Typography (Font)</label>
                      <select value={portfolioData.fontFamily}
                        onChange={(e) => setPortfolioData({ ...portfolioData, fontFamily: e.target.value })}
                        className="w-full rounded bg-slate-900 border border-white/10 px-3 py-1.5 text-xs text-white focus:outline-none">
                        <option value="sans">Inter / Sans (Tech Minimalist)</option>
                        <option value="serif">Playfair Display / Serif (Editorial)</option>
                        <option value="mono">Fira Code / Mono (Developer)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] text-slate-500 uppercase font-semibold mb-1">Avatar Image Animation</label>
                      <select value={portfolioData.avatarAnimation || 'morphing-rings'}
                        onChange={(e) => setPortfolioData({ ...portfolioData, avatarAnimation: e.target.value })}
                        className="w-full rounded bg-slate-900 border border-white/10 px-3 py-1.5 text-xs text-white focus:outline-none">
                        <option value="morphing-rings">Morphing Rings (Recommended)</option>
                        <option value="glow-pulse">Ambient Glowing Pulse</option>
                        <option value="spin-portal">Glowing Spin Portal</option>
                        <option value="float-bounce">Floating Bounce Avatar</option>
                        <option value="square-rotate">Interactive Rotating Squircle</option>
                      </select>
                    </div>
                  </div>

                  {/* ── Basic Info ── */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] text-slate-500 uppercase font-semibold mb-1">Full Name</label>
                      <input type="text" value={portfolioData.name}
                        onChange={(e) => setPortfolioData({ ...portfolioData, name: e.target.value })}
                        className="w-full rounded bg-slate-950 border border-white/10 px-2 py-1.5 text-white focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-[9px] text-slate-500 uppercase font-semibold mb-1">Roles (comma-separated)</label>
                      <input type="text" value={portfolioData.roles}
                        onChange={(e) => { const v = e.target.value; setPortfolioData({ ...portfolioData, roles: v, title: v.split(',')[0].trim() }); }}
                        placeholder="Full-Stack Developer, UI Designer"
                        className="w-full rounded bg-slate-950 border border-white/10 px-2 py-1.5 text-white focus:outline-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] text-slate-500 uppercase font-semibold mb-1">Bio Summary</label>
                    <textarea value={portfolioData.bio}
                      onChange={(e) => setPortfolioData({ ...portfolioData, bio: e.target.value })}
                      className="w-full rounded bg-slate-950 border border-white/10 px-2 py-1.5 text-white focus:outline-none" rows={2} />
                  </div>

                  {/* ── Contact ── */}
                  <div className="p-3 rounded-lg bg-slate-950 border border-white/5 space-y-2">
                    <span className="text-[9px] text-indigo-400 uppercase font-bold block">Contact Information</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[8px] text-slate-500 uppercase font-semibold mb-0.5">Email</label>
                        <input type="email" value={portfolioData.email}
                          onChange={(e) => setPortfolioData({ ...portfolioData, email: e.target.value })}
                          placeholder="professional@domain.com"
                          className="w-full rounded bg-slate-900 border border-white/5 px-2 py-1 text-white focus:outline-none text-[11px]" />
                      </div>
                      <div>
                        <label className="block text-[8px] text-slate-500 uppercase font-semibold mb-0.5">Phone</label>
                        <input type="text" value={portfolioData.phone}
                          onChange={(e) => setPortfolioData({ ...portfolioData, phone: e.target.value })}
                          placeholder="+91 9876543210"
                          className="w-full rounded bg-slate-900 border border-white/5 px-2 py-1 text-white focus:outline-none text-[11px]" />
                      </div>
                      <div>
                        <label className="block text-[8px] text-slate-500 uppercase font-semibold mb-0.5">GitHub URL</label>
                        <input type="url" value={portfolioData.githubLink}
                          onChange={(e) => setPortfolioData({ ...portfolioData, githubLink: e.target.value })}
                          placeholder="https://github.com/user"
                          className="w-full rounded bg-slate-900 border border-white/5 px-2 py-1 text-white focus:outline-none text-[11px]" />
                      </div>
                      <div>
                        <label className="block text-[8px] text-slate-500 uppercase font-semibold mb-0.5">LinkedIn URL</label>
                        <input type="url" value={portfolioData.linkedinLink}
                          onChange={(e) => setPortfolioData({ ...portfolioData, linkedinLink: e.target.value })}
                          placeholder="https://linkedin.com/in/user"
                          className="w-full rounded bg-slate-900 border border-white/5 px-2 py-1 text-white focus:outline-none text-[11px]" />
                      </div>
                    </div>
                  </div>

                  {/* ── URL Slug ── */}
                  <div>
                    <label className="block text-[9px] text-slate-500 uppercase font-semibold mb-1">URL Slug</label>
                    <div className="flex items-center gap-1.5 bg-slate-950 border border-white/10 rounded px-2">
                      <span className="text-[10px] text-slate-500 font-mono">/public/portfolio/</span>
                      <input type="text" value={portfolioData.slug}
                        onChange={(e) => setPortfolioData({ ...portfolioData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                        placeholder="my-portfolio-slug"
                        className="flex-1 bg-transparent py-1.5 text-white focus:outline-none text-xs font-mono" />
                    </div>
                  </div>

                  {/* ── Avatar & Resume Upload ── */}
                  <div className="p-3 rounded-lg bg-slate-950 border border-white/5 space-y-2">
                    <span className="text-[9px] text-indigo-400 uppercase font-bold block">Media Assets</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Avatar */}
                      <div className="rounded-xl bg-slate-900 p-4 border-2 border-dashed border-slate-800 hover:border-indigo-500/50 transition flex flex-col items-center gap-2">
                        <input type="file" id="edit-avatar-upload" accept="image/png,image/jpeg,image/jpg"
                          onChange={handleAvatarUpload} className="hidden" />
                        <label htmlFor="edit-avatar-upload" className="cursor-pointer flex flex-col items-center gap-2 text-center w-full">
                          {imagePreview ? (
                            <img src={imagePreview} alt="Avatar" className="w-14 h-14 rounded-full object-cover border-2 border-indigo-500/40" />
                          ) : (
                            <span className="text-2xl">🖼️</span>
                          )}
                          <span className="text-[11px] text-slate-300 font-semibold">
                            {isUploading ? 'Uploading...' : portfolioData.profileImageUrl ? `✓ Avatar: ${portfolioData.profileImageUrl}` : 'Upload New Avatar (PNG/JPG)'}
                          </span>
                          <span className="text-[9px] text-indigo-400 underline">Click to change</span>
                        </label>
                      </div>
                      {/* Resume */}
                      <div className="rounded-xl bg-slate-900 p-4 border-2 border-dashed border-slate-800 hover:border-indigo-500/50 transition flex flex-col items-center gap-2">
                        <input type="file" id="edit-resume-upload" accept=".pdf"
                          onChange={handleResumeUpload} className="hidden" />
                        <label htmlFor="edit-resume-upload" className="cursor-pointer flex flex-col items-center gap-2 text-center w-full">
                          <span className="text-2xl">📄</span>
                          <span className="text-[11px] text-slate-300 font-semibold">
                            {isUploading ? 'Uploading...' : portfolioData.resumeUrl ? `✓ Resume: ${portfolioData.resumeUrl}` : 'Upload New Resume (.pdf)'}
                          </span>
                          <span className="text-[9px] text-indigo-400 underline">Click to change</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* ── Skills Categorized ── */}
                  <div className="p-4 rounded-lg bg-slate-950 border border-white/5 space-y-4">
                    <span className="text-[9px] text-indigo-400 uppercase font-bold block">Skills (By Category)</span>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Languages */}
                      <div className="space-y-1">
                        <label className="block text-[8px] text-slate-500 uppercase font-semibold">1. Programming Languages</label>
                        <form onSubmit={(e) => handleAddSkillCategorized(e, 'languages')} className="flex gap-1.5">
                          <input type="text" value={skillInputs.languages} onChange={(e) => setSkillInputs(prev => ({ ...prev, languages: e.target.value }))}
                            placeholder="e.g. Java" className="flex-1 rounded bg-slate-900 border border-white/5 px-2.5 py-1 text-xs text-white focus:outline-none" />
                          <button type="submit" className="rounded bg-indigo-600 px-3 py-1 text-[11px] font-bold text-white hover:bg-indigo-500 transition">Add</button>
                        </form>
                      </div>

                      {/* Frameworks / Skills */}
                      <div className="space-y-1">
                        <label className="block text-[8px] text-slate-500 uppercase font-semibold">2. Frameworks & Skills</label>
                        <form onSubmit={(e) => handleAddSkillCategorized(e, 'skills')} className="flex gap-1.5">
                          <input type="text" value={skillInputs.skills} onChange={(e) => setSkillInputs(prev => ({ ...prev, skills: e.target.value }))}
                            placeholder="e.g. React" className="flex-1 rounded bg-slate-900 border border-white/5 px-2.5 py-1 text-xs text-white focus:outline-none" />
                          <button type="submit" className="rounded bg-indigo-600 px-3 py-1 text-[11px] font-bold text-white hover:bg-indigo-500 transition">Add</button>
                        </form>
                      </div>

                      {/* Databases */}
                      <div className="space-y-1">
                        <label className="block text-[8px] text-slate-500 uppercase font-semibold">3. Databases</label>
                        <form onSubmit={(e) => handleAddSkillCategorized(e, 'databases')} className="flex gap-1.5">
                          <input type="text" value={skillInputs.databases} onChange={(e) => setSkillInputs(prev => ({ ...prev, databases: e.target.value }))}
                            placeholder="e.g. Postgres" className="flex-1 rounded bg-slate-900 border border-white/5 px-2.5 py-1 text-xs text-white focus:outline-none" />
                          <button type="submit" className="rounded bg-indigo-600 px-3 py-1 text-[11px] font-bold text-white hover:bg-indigo-500 transition">Add</button>
                        </form>
                      </div>

                      {/* Tools */}
                      <div className="space-y-1">
                        <label className="block text-[8px] text-slate-500 uppercase font-semibold">4. Tools</label>
                        <form onSubmit={(e) => handleAddSkillCategorized(e, 'tools')} className="flex gap-1.5">
                          <input type="text" value={skillInputs.tools} onChange={(e) => setSkillInputs(prev => ({ ...prev, tools: e.target.value }))}
                            placeholder="e.g. Docker" className="flex-1 rounded bg-slate-900 border border-white/5 px-2.5 py-1 text-xs text-white focus:outline-none" />
                          <button type="submit" className="rounded bg-indigo-600 px-3 py-1 text-[11px] font-bold text-white hover:bg-indigo-500 transition">Add</button>
                        </form>
                      </div>
                    </div>

                    <div className="border-t border-white/5 pt-3 space-y-2">
                      <span className="text-[8px] text-slate-500 uppercase font-bold block">Current Skills Deck:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {portfolioData.skills.map((skill, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1 rounded bg-slate-800 border border-slate-700 px-2 py-0.5 text-xs text-indigo-300">
                            {skill.name.split('::')[0]}
                            <button type="button" onClick={() => handleRemoveSkill(idx)} className="text-slate-400 hover:text-red-400">&times;</button>
                          </span>
                        ))}
                        {portfolioData.skills.length === 0 && <span className="text-slate-600 text-[11px]">No skills yet.</span>}
                      </div>
                    </div>
                  </div>

                  {/* ── Projects ── */}
                  <div className="p-3 rounded-lg bg-slate-950 border border-white/5 space-y-3">
                    <span className="text-[9px] text-indigo-400 uppercase font-bold block">Projects</span>
                    <form onSubmit={handleAddProject} className="space-y-2">
                      <input type="text" value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                        placeholder="Project Title (Required)" required
                        className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-1.5 text-xs text-white focus:outline-none" />
                      <textarea value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                        placeholder="Description" rows={2}
                        className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-1.5 text-xs text-white focus:outline-none" />
                      <input type="text" value={projectForm.techStack} onChange={(e) => setProjectForm({ ...projectForm, techStack: e.target.value })}
                        placeholder="Tech Stack (e.g. React, Spring Boot)"
                        className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-1.5 text-xs text-white focus:outline-none" />
                      <div className="grid grid-cols-2 gap-2">
                        <input type="url" value={projectForm.githubLink} onChange={(e) => setProjectForm({ ...projectForm, githubLink: e.target.value })}
                          placeholder="GitHub URL"
                          className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-1.5 text-xs text-white focus:outline-none" />
                        <input type="url" value={projectForm.liveLink} onChange={(e) => setProjectForm({ ...projectForm, liveLink: e.target.value })}
                          placeholder="Live Demo URL"
                          className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-1.5 text-xs text-white focus:outline-none" />
                      </div>
                      <button type="submit" className="w-full rounded-lg bg-indigo-600 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition">+ Add Project</button>
                    </form>
                    <div className="space-y-1">
                      {portfolioData.projects.map((proj, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-slate-900 px-2 py-1.5 rounded text-[11px] text-slate-300">
                          <span className="truncate">{proj.title}</span>
                          <button onClick={() => setPortfolioData(prev => ({ ...prev, projects: prev.projects.filter((_, i) => i !== idx) }))}
                            className="text-red-400 hover:text-red-300 shrink-0 ml-2">Remove</button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ── Work Experience ── */}
                  <div className="p-3 rounded-lg bg-slate-950 border border-white/5 space-y-3">
                    <span className="text-[9px] text-indigo-400 uppercase font-bold block">Work Experience</span>
                    <form onSubmit={handleAddExperience} className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <input type="text" value={experienceForm.company} onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })}
                          placeholder="Company Name (Required)" required
                          className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-1.5 text-xs text-white focus:outline-none" />
                        <input type="text" value={experienceForm.role} onChange={(e) => setExperienceForm({ ...experienceForm, role: e.target.value })}
                          placeholder="Job Title (Required)" required
                          className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-1.5 text-xs text-white focus:outline-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input type="text" value={experienceForm.startDate} onChange={(e) => setExperienceForm({ ...experienceForm, startDate: e.target.value })}
                          placeholder="Start Date (e.g. Jan 2024)"
                          className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-1.5 text-xs text-white focus:outline-none" />
                        <input type="text" value={experienceForm.endDate} onChange={(e) => setExperienceForm({ ...experienceForm, endDate: e.target.value })}
                          placeholder="End Date (e.g. Present)"
                          className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-1.5 text-xs text-white focus:outline-none" />
                      </div>
                      <textarea value={experienceForm.description} onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })}
                        placeholder="Contributions & Accomplishments" rows={2}
                        className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-1.5 text-xs text-white focus:outline-none" />
                      <div className="flex items-center gap-2">
                        <label className="flex-1 cursor-pointer flex items-center justify-between rounded-lg border border-white/10 bg-slate-900 px-3 py-1.5 text-slate-400 hover:text-white transition text-xs">
                          <span>{experienceForm.mediaUrl ? '✓ Certificate/Proof Uploaded' : 'Upload Certificate / Proof (Optional)'}</span>
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={handleExperienceMediaUpload}
                            className="hidden"
                          />
                          <span className="text-xs">📂</span>
                        </label>
                        {isExpUploading && (
                          <span className="text-[10px] text-indigo-400 animate-pulse">Uploading...</span>
                        )}
                      </div>
                      <button type="submit" className="w-full rounded-lg bg-indigo-600 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition">+ Add Experience</button>
                    </form>
                    <div className="space-y-1">
                      {portfolioData.experiences.map((exp, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-slate-900 px-2 py-1.5 rounded text-[11px] text-slate-300">
                          <span className="truncate">{exp.role} @ {exp.company} {exp.mediaUrl ? '(📎 Proof)' : ''}</span>
                          <button onClick={() => setPortfolioData(prev => ({ ...prev, experiences: prev.experiences.filter((_, i) => i !== idx) }))}
                            className="text-red-400 hover:text-red-300 shrink-0 ml-2">Remove</button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ── Certificates ── */}
                  <div className="p-3 rounded-lg bg-slate-950 border border-white/5 space-y-3">
                    <span className="text-[9px] text-amber-400 uppercase font-bold block">Certificates</span>
                    <form onSubmit={handleAddCertificate} className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <input type="text" value={certificateForm.name} onChange={(e) => setCertificateForm({ ...certificateForm, name: e.target.value })}
                          placeholder="Certificate Title (Required)" required
                          className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-1.5 text-xs text-white focus:outline-none" />
                        <input type="text" value={certificateForm.issuingOrganization} onChange={(e) => setCertificateForm({ ...certificateForm, issuingOrganization: e.target.value })}
                          placeholder="Issuing Organization (Required)" required
                          className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-1.5 text-xs text-white focus:outline-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input type="text" value={certificateForm.issueDate} onChange={(e) => setCertificateForm({ ...certificateForm, issueDate: e.target.value })}
                          placeholder="Issue Date (e.g. Mar 2024)"
                          className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-1.5 text-xs text-white focus:outline-none" />
                        <input type="url" value={certificateForm.credentialUrl} onChange={(e) => setCertificateForm({ ...certificateForm, credentialUrl: e.target.value })}
                          placeholder="Credential URL (optional)"
                          className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-1.5 text-xs text-white focus:outline-none" />
                      </div>
                      <textarea value={certificateForm.description} onChange={(e) => setCertificateForm({ ...certificateForm, description: e.target.value })}
                        placeholder="Short description..." rows={2}
                        className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-1.5 text-xs text-white focus:outline-none" />
                      <div className="rounded-xl bg-slate-800 p-2 border-2 border-dashed border-slate-700 hover:border-amber-500/50 transition flex items-center gap-3">
                        <input type="file" id="edit-cert-upload" accept=".pdf,.png,.jpg,.jpeg" onChange={handleCertFileUpload} className="hidden" />
                        <label htmlFor="edit-cert-upload" className="cursor-pointer flex items-center gap-2 text-[11px]">
                          <span>📎</span>
                          <span className="text-slate-300 font-semibold">
                            {isCertUploading ? 'Uploading...' : certificateForm.filePath ? `✓ ${certificateForm.filePath}` : 'Upload Certificate File (PDF/PNG/JPG)'}
                          </span>
                        </label>
                      </div>
                      <button type="submit" className="w-full rounded-lg bg-amber-700 py-1.5 text-xs font-semibold text-white hover:bg-amber-600 transition">+ Add Certificate</button>
                    </form>
                    <div className="space-y-1">
                      {portfolioData.certificates.map((cert, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-slate-900 px-2 py-1.5 rounded text-[11px] text-slate-300">
                          <span className="truncate">{cert.name} — {cert.issuingOrganization}</span>
                          <button onClick={() => setPortfolioData(prev => ({ ...prev, certificates: prev.certificates.filter((_, i) => i !== idx) }))}
                            className="text-red-400 hover:text-red-300 shrink-0 ml-2">Remove</button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ── Achievements ── */}
                  <div className="p-3 rounded-lg bg-slate-950 border border-white/5 space-y-3">
                    <span className="text-[9px] text-emerald-400 uppercase font-bold block">Achievements</span>
                    <form onSubmit={handleAddAchievement} className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <input type="text" value={achievementForm.title} onChange={(e) => setAchievementForm({ ...achievementForm, title: e.target.value })}
                          placeholder="Achievement Title (Required)" required
                          className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-1.5 text-xs text-white focus:outline-none" />
                        <input type="text" value={achievementForm.associatedDate} onChange={(e) => setAchievementForm({ ...achievementForm, associatedDate: e.target.value })}
                          placeholder="Date / Event (e.g. Hackathon 2024)"
                          className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-1.5 text-xs text-white focus:outline-none" />
                      </div>
                      <textarea value={achievementForm.description} onChange={(e) => setAchievementForm({ ...achievementForm, description: e.target.value })}
                        placeholder="Describe your achievement..." rows={2}
                        className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-1.5 text-xs text-white focus:outline-none" />
                      <div className="rounded-xl bg-slate-800 p-2 border-2 border-dashed border-slate-700 hover:border-emerald-500/50 transition flex items-center gap-3">
                        <input type="file" id="edit-ach-upload" accept="image/png,image/jpeg,image/jpg" onChange={handleAchievementMediaUpload} className="hidden" />
                        <label htmlFor="edit-ach-upload" className="cursor-pointer flex items-center gap-2 text-[11px]">
                          <span>🖼️</span>
                          <span className="text-slate-300 font-semibold">
                            {isAchUploading ? 'Uploading...' : achievementForm.mediaUrl ? '✓ Proof uploaded' : 'Upload Proof Photo (PNG/JPG, max 5MB)'}
                          </span>
                        </label>
                      </div>
                      <button type="submit" className="w-full rounded-lg bg-emerald-700 py-1.5 text-xs font-semibold text-white hover:bg-emerald-600 transition">+ Add Achievement</button>
                    </form>
                    <div className="space-y-1">
                      {portfolioData.achievements.map((ach, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-slate-900 px-2 py-1.5 rounded text-[11px] text-slate-300">
                          <span className="truncate">{ach.title}{ach.associatedDate ? ` — ${ach.associatedDate}` : ''}</span>
                          <button onClick={() => setPortfolioData(prev => ({ ...prev, achievements: prev.achievements.filter((_, i) => i !== idx) }))}
                            className="text-red-400 hover:text-red-300 shrink-0 ml-2">Remove</button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ── Education / Academic Timeline ── */}
                  <div className="p-3 rounded-lg bg-slate-950 border border-white/5 space-y-3">
                    <span className="text-[9px] text-sky-400 uppercase font-bold block">Academic Timeline</span>
                    <form onSubmit={handleAddEducation} className="space-y-2">
                      <input type="text" value={educationForm.degreeName} onChange={(e) => setEducationForm({ ...educationForm, degreeName: e.target.value })}
                        placeholder="Degree Name (Required)" required
                        className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-1.5 text-xs text-white focus:outline-none" />
                      <input type="text" value={educationForm.institution} onChange={(e) => setEducationForm({ ...educationForm, institution: e.target.value })}
                        placeholder="Institution / College Name (Required)" required
                        className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-1.5 text-xs text-white focus:outline-none" />
                      <div className="grid grid-cols-2 gap-2">
                        <input type="text" value={educationForm.timeline} onChange={(e) => setEducationForm({ ...educationForm, timeline: e.target.value })}
                          placeholder="Timeline (e.g. 2022 - 2026)"
                          className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-1.5 text-xs text-white focus:outline-none" />
                        <input type="text" value={educationForm.gradeOrCgpa} onChange={(e) => setEducationForm({ ...educationForm, gradeOrCgpa: e.target.value })}
                          placeholder="Grade / CGPA (e.g. 9.1)"
                          className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-1.5 text-xs text-white focus:outline-none" />
                      </div>
                      <button type="submit" className="w-full rounded-lg bg-sky-700 py-1.5 text-xs font-semibold text-white hover:bg-sky-600 transition">+ Add Education</button>
                    </form>
                    <div className="space-y-1">
                      {portfolioData.educations.map((ed, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-slate-900 px-2 py-1.5 rounded text-[11px] text-slate-300">
                          <span className="truncate">{ed.degreeName} — {ed.institution}</span>
                          <button onClick={() => setPortfolioData(prev => ({ ...prev, educations: prev.educations.filter((_, i) => i !== idx) }))}
                            className="text-red-400 hover:text-red-300 shrink-0 ml-2">Remove</button>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>{/* end space-y-5 */}

                {/* ── Save Button ── */}
                <div className="pt-2 border-t border-white/5">
                  <button
                    onClick={handlePublish}
                    disabled={isSaving || !portfolioData.name || (!portfolioData.title && !portfolioData.roles)}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 text-xs transition disabled:opacity-50 shadow-lg shadow-indigo-600/25"
                  >
                    {isSaving ? 'Saving...' : activePortfolioId ? '💾 Save Changes' : '🚀 Save & Publish Portfolio'}
                  </button>
                </div>

                {saveStatus === 'success' && (
                  <p className="text-[11px] text-green-400 font-semibold text-center mt-1">Successfully saved!</p>
                )}
                {saveStatus === 'error' && (
                  <p className="text-[11px] text-red-400 font-semibold text-center mt-1">Failed to save. Make sure your slug is unique.</p>
                )}
              </div>
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Bottom Text Input Bar */}
      <div className="px-6 py-4 border-t border-white/10 bg-slate-950/40">
        <form onSubmit={handleSendText} className="flex gap-2">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            disabled={currentStep > 2}
            className="flex-1 rounded-lg border border-white/10 bg-slate-900 px-4 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder={
              currentStep <= 2
                ? 'Type your message here...'
                : 'Please use the interactive form inside the chat stream above'
            }
          />
          <button
            type="submit"
            disabled={currentStep > 2 || !textInput.trim()}
            className="rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 text-sm font-semibold transition disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
