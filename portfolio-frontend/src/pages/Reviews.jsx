import React, { useEffect, useState } from 'react';

export default function Reviews() {
  const [particles, setParticles] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  // 6 mock reviews representing real developers
  const [reviewsList, setReviewsList] = useState([
    {
      name: "Aditya Vardhan",
      role: "Backend Engineer",
      text: "Folio made my portfolio creation a breeze! The conversational builder is incredibly intuitive, and the resume stream is exceptionally smooth.",
      rating: 5,
      avatar: "AV"
    },
    {
      name: "Meghana Reddy",
      role: "Frontend Developer",
      text: "The ATS resume checking guide is gold. Followed the layout exactly, did the Notepad check, and got my first interview callback within a week!",
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

  // Generate background particle stars
  useEffect(() => {
    const dots = Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${12 + Math.random() * 18}s`
    }));
    setParticles(dots);
  }, []);

  // Automatic slow rotation timer for reviews carousel (transitions every 5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % reviewsList.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [reviewsList.length]);

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!feedbackName.trim() || !feedbackText.trim()) return;

    // Prepend user review to list with animated feedback response
    const newUserReview = {
      name: feedbackName.trim(),
      role: "Folio User",
      text: feedbackText.trim(),
      rating: 5,
      avatar: feedbackName.substring(0, 2).toUpperCase()
    };

    setReviewsList((prev) => [newUserReview, ...prev]);
    setActiveIndex(0);
    setFeedbackSuccess(true);
    setFeedbackName('');
    setFeedbackEmail('');
    setFeedbackText('');
    setTimeout(() => setFeedbackSuccess(false), 5000);
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full overflow-hidden bg-slate-950 text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      {/* Background canvas elements matching the main guide theme */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60"></div>
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none"></div>
        
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute h-1.5 w-1.5 rounded-full bg-indigo-400/20 animate-pulse"
            style={{
              left: p.left,
              top: p.top,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-12">
        {/* Page Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-indigo-400 to-pink-400 bg-clip-text text-transparent">
            User Feedback & Reviews
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            See how developers around the world are using Folio to elevate their career presentations, and share your own feedback with our community.
          </p>
        </div>

        {/* ── ROTATING 3D CAROUSEL WINDOW ── */}
        <div className="relative h-[280px] sm:h-[300px] w-full flex items-center justify-center overflow-visible py-8">
          <div className="relative w-full max-w-xl h-full flex items-center justify-center">
            {reviewsList.map((rev, idx) => {
              // Calculate relative offset for rotation alignment
              const count = reviewsList.length;
              let diff = idx - activeIndex;
              // Handle wrap-around diff
              if (diff < -count / 2) diff += count;
              if (diff > count / 2) diff -= count;

              const isCenter = diff === 0;
              const isLeft = diff === -1 || (diff === count - 1 && activeIndex === 0);
              const isRight = diff === 1 || (diff === 1 - count && activeIndex === count - 1);
              const isVisible = Math.abs(diff) <= 1;

              if (!isVisible) return null;

              // Compute positioning styles
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
                  onClick={() => setActiveIndex(idx)}
                  className="absolute w-[290px] sm:w-[380px] transition-all duration-700 ease-out cursor-pointer"
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
                      <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono">VERIFIED DEVELOPER</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Nav dots */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2 z-40">
            {reviewsList.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === activeIndex ? 'w-5 bg-indigo-500' : 'w-1.5 bg-slate-700 hover:bg-slate-600'}`}
              />
            ))}
          </div>
        </div>

        {/* ── USER REVIEW FORM ── */}
        <div className="max-w-xl mx-auto glass rounded-2xl border border-white/5 p-8 shadow-xl space-y-6">
          <div className="space-y-1 text-center">
            <h3 className="text-lg font-bold text-white">Share Your Feedback</h3>
            <p className="text-xs text-slate-400">Your experiences shape our tools. Leave a review below to add it to the rotating wall!</p>
          </div>

          {feedbackSuccess && (
            <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-4 text-xs font-semibold text-green-400 text-center animate-pulse">
              🎉 Thank you! Your review has been added to our rotation board.
            </div>
          )}

          <form onSubmit={handleFeedbackSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-semibold text-slate-500 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={feedbackName}
                  onChange={(e) => setFeedbackName(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                  placeholder="e.g. Priyan Bose"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-semibold text-slate-500 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={feedbackEmail}
                  onChange={(e) => setFeedbackEmail(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                  placeholder="e.g. priyan@domain.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-semibold text-slate-500 mb-1">Feedback Message</label>
              <textarea
                required
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                placeholder="Share your thoughts about building portfolios with Folio..."
                rows={4}
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 transition shadow-lg shadow-indigo-600/20"
            >
              Post Review
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
