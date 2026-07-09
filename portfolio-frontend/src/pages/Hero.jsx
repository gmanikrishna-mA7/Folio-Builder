import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Hero() {
  const canvasRef = useRef(null);
  const [typedText, setTypedText] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(null);
  
  // Typewriter options
  const roles = [
    'Seamless Portfolios',
    'Interactive Timelines',
    'Independent Deploys',
    'Student Guides',
    'Analyzing Fake Jobs'
  ];
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  // Review & Feedback State Variables
  const [reviewsActiveIndex, setReviewsActiveIndex] = useState(0);
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [reviewsList, setReviewsList] = useState([
    {
      name: "Aditya Vardhan",
      role: "Backend Engineer",
      text: "Folio Builder made my portfolio creation a breeze! The conversational builder is incredibly intuitive, and the project displays are exceptionally smooth.",
      rating: 5,
      avatar: "AV"
    },
    {
      name: "Meghana Reddy",
      role: "Frontend Developer",
      text: "The Student Resource Guide is gold. Did the layout check, and got my first interview callback within a week!",
      rating: 5,
      avatar: "MR"
    },
    {
      name: "Tushar Sen",
      role: "Full-Stack Student",
      text: "Deploying to Netlify directly from the build exporter saved me hours of configuration. Having a fully standalone HTML file is a lifesaver.",
      rating: 5,
      avatar: "TS"
    },
    {
      name: "Sneha Gupta",
      role: "UX/UI Specialist",
      text: "The glassmorphism aesthetic is beautiful. I changed my portfolio background to HSL indigo and all card colors adapted perfectly. Recieved so many compliments!",
      rating: 5,
      avatar: "SG"
    },
    {
      name: "Vikram Malhotra",
      role: "Spring Boot Engineer",
      text: "The integration between the Java REST API and the React frontend works flawlessly. Quick edits load instantly on my custom URL slug.",
      rating: 5,
      avatar: "VM"
    },
    {
      name: "Rohan Sharma",
      role: "DevOps Architect",
      text: "A must-use builder for college placements. Simple, professional, clean and zero fluff. Highly recommend Vercel CLI deployment route.",
      rating: 5,
      avatar: "RS"
    }
  ]);

  // Contact Form validated inputs
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);

  // Check auth on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  // 1. Typing effect
  useEffect(() => {
    let timer;
    const currentFullText = roles[roleIndex];

    const handleType = () => {
      if (!isDeleting) {
        setTypedText(currentFullText.substring(0, typedText.length + 1));
        setTypingSpeed(100);
        if (typedText === currentFullText) {
          timer = setTimeout(() => setIsDeleting(true), 1000);
          return;
        }
      } else {
        setTypedText(currentFullText.substring(0, typedText.length - 1));
        setTypingSpeed(50);
        if (typedText === '') {
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % roles.length);
          return;
        }
      }
      timer = setTimeout(handleType, typingSpeed);
    };

    timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [typedText, isDeleting, roleIndex]);

  // 2. Interactive Canvas Particles Constellation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    const particleCount = 90; // Standard 80-100 nodes
    const connectionDistance = 110;
    const mouse = { x: null, y: null, radius: 150 };

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
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
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
            this.x += (dx / dist) * force * 0.6;
            this.y += (dy / dist) * force * 0.6;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
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
            ctx.strokeStyle = `rgba(156, 163, 175, ${alpha})`; // Thin semi-transparent gray
            ctx.lineWidth = 0.5;
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
  }, []);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactEmail.trim() || !contactMsg.trim()) return;
    setContactSuccess(true);
    setContactEmail('');
    setContactMsg('');
    setTimeout(() => setContactSuccess(false), 4000);
  };

  // Rotating timer for the testimonials section
  useEffect(() => {
    const interval = setInterval(() => {
      setReviewsActiveIndex((prev) => (prev + 1) % reviewsList.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [reviewsList.length]);

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!feedbackName.trim() || !feedbackText.trim()) return;
    const newRev = {
      name: feedbackName.trim(),
      role: "Folio User",
      text: feedbackText.trim(),
      rating: 5,
      avatar: feedbackName.substring(0, 2).toUpperCase()
    };
    setReviewsList((prev) => [newRev, ...prev]);
    setReviewsActiveIndex(0);
    setFeedbackSuccess(true);
    setFeedbackName('');
    setFeedbackText('');
    setTimeout(() => setFeedbackSuccess(false), 4000);
  };

  return (
    <div className="relative min-h-screen bg-slate-950 overflow-hidden flex flex-col justify-start">
      {/* Background Canvas Particle Network */}
      <canvas ref={canvasRef} className="absolute inset-0 block pointer-events-none z-0 opacity-70" />

      {/* Hero Content Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full min-h-[80vh] flex items-center py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full">
          
          {/* Left Column content */}
          <div className="space-y-6 text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-medium text-indigo-300">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
              Folio Portfolio Builder
            </div>

            {/* Custom Heading with Gradient Naming */}
            <h1 className="text-6xl sm:text-7xl lg:text-8xl leading-tight select-none" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, letterSpacing: '-0.04em' }}>
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent filter drop-shadow-[0_4px_16px_rgba(129,140,248,0.2)]">
                Folio Builder
              </span>
            </h1>

            {/* Subtitle with increased font size */}
            <p className="text-lg sm:text-xl font-medium text-slate-200 leading-relaxed">
              Portfolio Developer - Analyzer - Guider
            </p>

            <div className="h-8 flex items-center">
              <p className="text-lg sm:text-xl text-slate-300 font-mono">
                I Build <span className="font-bold text-indigo-400 border-r-2 border-indigo-400 animate-pulse pr-1">{typedText}</span>
              </p>
            </div>

            <p className="text-base sm:text-lg text-slate-400 max-w-lg leading-relaxed">
              Experience the future of portfolio creation. Chat with our conversational AI, upload your PDF resume, and publish developer layouts instantly.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to={isAuthenticated ? "/dashboard" : "/register"}
                className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/30 border border-indigo-500/25"
              >
                {isAuthenticated ? "Explore Builder" : "Create Account"}
              </Link>
              <a
                href="#how-it-works"
                className="glass rounded-full px-6 py-2.5 text-sm font-semibold text-slate-200 hover:text-white transition"
              >
                Learn More &darr;
              </a>
            </div>
          </div>

          {/* Right Column illustration */}
          <div className="flex justify-center md:justify-end">
            <div className="relative group w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 opacity-20 blur-3xl animate-pulse-slow"></div>
              <div className="relative w-full h-full rounded-2xl border border-white/10 bg-slate-950/80 p-8 flex flex-col justify-between items-start">
                <div className="flex gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-red-500/60"></span>
                  <span className="w-3.5 h-3.5 rounded-full bg-yellow-500/60"></span>
                  <span className="w-3.5 h-3.5 rounded-full bg-green-500/60"></span>
                </div>
                <div className="space-y-4 w-full">
                  <div className="h-6 w-full rounded bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between px-3 text-[10px] text-indigo-300 font-mono">
                    <span>FOLIO_ENGINE: ACTIVE</span>
                    <span>ONLINE</span>
                  </div>
                  <div className="h-28 w-full rounded-lg bg-slate-900/60 border border-white/5 flex flex-col justify-center items-center text-center p-4 space-y-2">
                    <p className="text-xs text-slate-300 font-mono">"What are your core project stacks?"</p>
                    <span className="text-[10px] text-slate-500 font-mono">Conversational AI Engine</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof & Adoption Statistics Section */}
      <section className="relative z-10 py-12 border-y border-white/5 bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Used by thousands of students & developers</h3>
              <p className="text-sm text-slate-400">Trusted globally for creating high-fidelity portfolio sites instantly.</p>
            </div>
            
            {/* Interactive 5-Star Rating Visualizer */}
            <div className="flex flex-col items-center md:items-end gap-3">
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(null)}
                    className={`w-7 h-7 cursor-pointer transition-all duration-300 ${
                      (hoveredStar !== null ? star <= hoveredStar : true)
                        ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)] scale-110'
                        : 'text-slate-600 scale-100'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs font-semibold text-slate-300 bg-slate-900 border border-white/5 rounded-full px-3 py-1 font-mono">
                Rated <strong className="text-yellow-400">4.9 / 5</strong> by 2,400+ devs
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. How It Works Section */}
      <section id="how-it-works" className="relative z-10 py-24 bg-slate-950/40 border-b border-white/5 scroll-mt-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-3xl font-extrabold tracking-tight text-white">How It Works</h2>
            <p className="text-sm text-slate-400 max-w-lg mx-auto">Generate a professional, fully populated developer website in minutes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass rounded-xl p-6 border border-white/5 space-y-4 relative">
              <span className="absolute -top-5 left-6 h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow shadow-indigo-600/30">1</span>
              <h3 className="text-lg font-bold text-white pt-2">Register Session</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Sign up to claim your dashboard. Your initial profile URL is immediately claimed from your email prefix.</p>
            </div>

            <div className="glass rounded-xl p-6 border border-white/5 space-y-4 relative">
              <span className="absolute -top-5 left-6 h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow shadow-indigo-600/30">2</span>
              <h3 className="text-lg font-bold text-white pt-2">Conversational Wizard</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Answer questions about your stack, certificates, projects, and drag-and-drop your PDF resume to import data instantly.</p>
            </div>

            <div className="glass rounded-xl p-6 border border-white/5 space-y-4 relative">
              <span className="absolute -top-5 left-6 h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow shadow-indigo-600/30">3</span>
              <h3 className="text-lg font-bold text-white pt-2">Instant Generation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Configure your custom URL slug and publish! Your site is hosted live with floating canvas timelines and resume streaming.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. User Reviews & Feedback Carousel Section */}
      <section className="relative z-10 py-20 bg-slate-950/20 border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl font-extrabold tracking-tight text-white">User Reviews & Feedback</h2>
            <p className="text-sm text-slate-400 max-w-lg mx-auto">
              See what developers say about building their layout with Folio. Add your review to the board!
            </p>
          </div>

          {/* 3D Rotating Carousel Container */}
          <div className="relative h-[320px] w-full flex items-center justify-center overflow-visible py-4">
            <div className="relative w-full max-w-xl h-full flex items-center justify-center">
              {reviewsList.map((rev, idx) => {
                const count = reviewsList.length;
                let diff = idx - reviewsActiveIndex;
                if (diff < -count / 2) diff += count;
                if (diff > count / 2) diff -= count;

                const isCenter = diff === 0;
                const isLeft = diff === -1 || (diff === count - 1 && reviewsActiveIndex === 0);
                const isRight = diff === 1 || (diff === 1 - count && reviewsActiveIndex === count - 1);
                const isVisible = Math.abs(diff) <= 1;

                if (!isVisible) return null;

                let translateX = '0%';
                let scale = 1;
                let opacity = 0;
                let zIndex = 0;
                let rotateY = 0;

                if (isCenter) {
                  translateX = '0%';
                  scale = 1.05;
                  opacity = 1;
                  zIndex = 30;
                } else if (isLeft) {
                  translateX = '-55%';
                  scale = 0.85;
                  opacity = 0.55;
                  zIndex = 20;
                  rotateY = 25;
                } else if (isRight) {
                  translateX = '55%';
                  scale = 0.85;
                  opacity = 0.55;
                  zIndex = 20;
                  rotateY = -25;
                }

                return (
                  <div
                    key={idx}
                    onClick={() => setReviewsActiveIndex(idx)}
                    className="absolute w-[290px] sm:w-[380px] transition-all duration-700 ease-out cursor-pointer text-left"
                    style={{
                      transform: `translateX(${translateX}) scale(${scale}) rotateY(${rotateY}deg)`,
                      opacity: opacity,
                      zIndex: zIndex,
                      perspective: '1000px'
                    }}
                  >
                    <div className={`glass p-6 rounded-2xl border ${isCenter ? 'border-indigo-500/40 shadow-indigo-500/10' : 'border-white/5'} shadow-2xl space-y-4 bg-slate-900/80 backdrop-blur-lg`}>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 font-extrabold text-xs text-white">
                          {rev.avatar}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white leading-none">{rev.name}</h4>
                          <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">{rev.role}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed italic">
                        "{rev.text}"
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <div className="flex gap-1">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <span key={i} className="text-yellow-400 text-xs">★</span>
                          ))}
                        </div>
                        <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono">VERIFIED USER</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Nav dots */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 z-40">
              {reviewsList.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setReviewsActiveIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === reviewsActiveIndex ? 'w-5 bg-indigo-500' : 'w-1.5 bg-slate-700 hover:bg-slate-600'}`}
                />
              ))}
            </div>
          </div>

          {/* Inline Feedback Form */}
          <div className="max-w-xl mx-auto glass rounded-2xl border border-white/5 p-6 shadow-xl space-y-4 text-left">
            <h3 className="text-sm font-bold text-white text-center">Submit a Feedback Reply</h3>
            {feedbackSuccess && (
              <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-3 text-xs font-semibold text-green-400 text-center animate-pulse">
                🎉 Review added! Thank you for your feedback.
              </div>
            )}
            <form onSubmit={handleFeedbackSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] uppercase font-semibold text-slate-500 mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={feedbackName}
                    onChange={(e) => setFeedbackName(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase font-semibold text-slate-500 mb-1">Feedback</label>
                  <input
                    type="text"
                    required
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                    placeholder="How was your portfolio setup?"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 transition shadow-lg shadow-indigo-600/20"
              >
                Send Review
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 4. Contact Us Section */}
      <section id="contact-us" className="relative z-10 py-24 bg-slate-950/20">
        <div className="mx-auto max-w-xl px-4 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold tracking-tight text-white">Contact Us</h2>
            <p className="text-sm text-slate-400">Reach out for questions, feedback, or custom builder integration.</p>
          </div>
          
          <div className="glass rounded-2xl p-8 border border-white/5 space-y-6">
            {contactSuccess && (
              <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-4 text-xs font-semibold text-green-400 text-center">
                Message received! We will follow up soon.
              </div>
            )}

            <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] uppercase font-semibold text-slate-500 mb-1">Your Email</label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                  placeholder="name@domain.com"
                />
              </div>
              
              <div>
                <label className="block text-[10px] uppercase font-semibold text-slate-500 mb-1">Your Message</label>
                <textarea
                  required
                  value={contactMsg}
                  onChange={(e) => setContactMsg(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                  placeholder="Tell us what you think..."
                  rows={4}
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 transition shadow-lg shadow-indigo-600/20"
              >
                Submit Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
