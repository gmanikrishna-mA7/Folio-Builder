import React, { useEffect, useState } from 'react';

export default function Guide() {
  const [particles, setParticles] = useState([]);

  // Generate particle coordinate dots for the moving axis points look
  useEffect(() => {
    const dots = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${10 + Math.random() * 15}s`
    }));
    setParticles(dots);
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full overflow-hidden bg-slate-950 text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      {/* Background canvas elements matching home page */}
      <div className="absolute inset-0 z-0">
        {/* Gridded background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60"></div>
        {/* Large blur accent nodes */}
        <div className="absolute top-1/4 left-1/10 w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/10 w-[500px] h-[500px] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none"></div>
        
        {/* Particle nodes */}
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute h-1 w-1 rounded-full bg-indigo-400/25 animate-pulse"
            style={{
              left: p.left,
              top: p.top,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto space-y-12">
        {/* Page Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
            Student Resource Guide
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg">
            Curated pathways, essential sheets, and roadmap guidelines to master programming, CS concepts, and technical placements.
          </p>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Core Programming */}
          <div className="glass p-6 rounded-2xl border border-white/5 shadow-xl hover:border-indigo-500/25 transition duration-300 transform hover:-translate-y-1 flex flex-col justify-between">
            <div>
              <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-400 text-2xl font-bold mb-5">
                💻
              </div>
              <h2 className="text-xl font-bold text-white mb-3">Core Programming & DSA</h2>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                Practice makes permanent. Build strong foundations with competitive platforms and structured sheets.
              </p>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Practice Platforms</h4>
                  <ul className="space-y-1.5 text-sm text-indigo-300">
                    <li><a href="https://leetcode.com/" target="_blank" rel="noreferrer" className="hover:underline hover:text-white transition">LeetCode</a></li>
                    <li><a href="https://www.hackerrank.com/" target="_blank" rel="noreferrer" className="hover:underline hover:text-white transition">HackerRank</a></li>
                    <li><a href="https://www.codechef.com/" target="_blank" rel="noreferrer" className="hover:underline hover:text-white transition">CodeChef</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">DSA Sheets</h4>
                  <ul className="space-y-1.5 text-sm text-indigo-300">
                    <li><a href="https://takeuforward.org/strivers-a2z-dsa-course-sheet-instructions/" target="_blank" rel="noreferrer" className="hover:underline hover:text-white transition font-medium">Strivers A to Z DSA Sheet</a></li>
                    <li><a href="https://neetcode.io/practice" target="_blank" rel="noreferrer" className="hover:underline hover:text-white transition font-medium">NeetCode.io Sheet</a></li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-white/5 pt-4 bg-indigo-950/20 -mx-6 -mb-6 p-6 rounded-b-2xl">
              <p className="text-xs font-semibold text-indigo-200 italic leading-snug">
                "Consistency is your defining metric in development and technical learning."
              </p>
            </div>
          </div>

          {/* Card 2: Extended Learning */}
          <div className="glass p-6 rounded-2xl border border-white/5 shadow-xl hover:border-purple-500/25 transition duration-300 transform hover:-translate-y-1 flex flex-col justify-between">
            <div>
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-purple-400 text-2xl font-bold mb-5">
                📚
              </div>
              <h2 className="text-xl font-bold text-white mb-3">Extended Learning</h2>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                Supplement your curriculum with top documentation, courses, and artificial intelligence copilots.
              </p>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Reference & AI</h4>
                  <ul className="space-y-1.5 text-sm text-purple-300">
                    <li><a href="https://www.geeksforgeeks.org/" target="_blank" rel="noreferrer" className="hover:underline hover:text-white transition">GeeksforGeeks</a></li>
                    <li><a href="https://chatgpt.com/" target="_blank" rel="noreferrer" className="hover:underline hover:text-white transition">ChatGPT</a></li>
                    <li><a href="https://gemini.google.com/" target="_blank" rel="noreferrer" className="hover:underline hover:text-white transition">Gemini</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Video Creators & Courses</h4>
                  <ul className="space-y-1.5 text-sm text-purple-300">
                    <li><a href="https://www.youtube.com/@takeuforward" target="_blank" rel="noreferrer" className="hover:underline hover:text-white transition">takeUforward (Striver)</a></li>
                    <li><a href="https://www.youtube.com/@NeetCode" target="_blank" rel="noreferrer" className="hover:underline hover:text-white transition">NeetCode</a></li>
                    <li><a href="https://www.youtube.com/@Telusko" target="_blank" rel="noreferrer" className="hover:underline hover:text-white transition">Telusko</a></li>
                    <li><a href="https://www.youtube.com/@CodeWithHarry" target="_blank" rel="noreferrer" className="hover:underline hover:text-white transition">Code With Harry</a></li>
                    <li><a href="https://www.youtube.com/@ApnaCollegeOfficial" target="_blank" rel="noreferrer" className="hover:underline hover:text-white transition">Apna College</a></li>
                    <li><a href="https://www.udemy.com/" target="_blank" rel="noreferrer" className="hover:underline hover:text-white transition">Udemy Courses</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Placements & Guides */}
          <div className="glass p-6 rounded-2xl border border-white/5 shadow-xl hover:border-pink-500/25 transition duration-300 transform hover:-translate-y-1 flex flex-col justify-between">
            <div>
              <div className="h-12 w-12 rounded-xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20 text-pink-400 text-2xl font-bold mb-5">
                💼
              </div>
              <h2 className="text-xl font-bold text-white mb-3">Placement Prep</h2>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                Cracking the interview requires aptitude, key computer science core subjects, and detailed roadmaps.
              </p>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Aptitude & Logical</h4>
                  <ul className="space-y-1.5 text-sm text-pink-300">
                    <li><a href="https://prepinsta.com/" target="_blank" rel="noreferrer" className="hover:underline hover:text-white transition">PrepInsta</a></li>
                    <li><a href="https://www.indiabix.com/" target="_blank" rel="noreferrer" className="hover:underline hover:text-white transition">IndiaBIX</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Core CS Subjects</h4>
                  <ul className="space-y-1.5 text-sm text-pink-300">
                    <li><span className="text-slate-300">Operating Systems (OS)</span></li>
                    <li><span className="text-slate-300">DBMS & SQL Queries</span></li>
                    <li><span className="text-slate-300">Computer Networks (CN)</span></li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-white/5 pt-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Beginner Guides</h4>
              <a
                href="https://builtforstudents.in/category/beginners-guides"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-between w-full p-3 rounded-lg bg-pink-600/10 border border-pink-500/20 text-xs font-semibold text-pink-300 hover:bg-pink-600 hover:text-white transition duration-300 animate-pulse"
              >
                <span>Built for Students Guides</span>
                <span>➔</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
