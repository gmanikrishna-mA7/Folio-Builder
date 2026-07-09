import React, { useEffect, useState } from 'react';

export default function ResumeGuide() {
  const [particles, setParticles] = useState([]);
  const [activeSection, setActiveSection] = useState('resume'); // 'resume' or 'deploy'

  // Generate particle coordinate dots matching the Guide page background
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
      {/* Background canvas elements matching Guide page */}
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

      <div className="relative z-10 max-w-5xl mx-auto space-y-10">
        {/* Page Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Resume & Deploy Guide
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg">
            Master the art of creating ATS-friendly resumes and launching your portfolio to production with Netlify & Vercel.
          </p>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setActiveSection('resume')}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold border transition duration-300 ${
              activeSection === 'resume'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/25'
                : 'bg-slate-900/60 text-slate-400 border-white/5 hover:text-white'
            }`}
          >
            📄 Resume Building Path
          </button>
          <button
            onClick={() => setActiveSection('deploy')}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold border transition duration-300 ${
              activeSection === 'deploy'
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/25'
                : 'bg-slate-900/60 text-slate-400 border-white/5 hover:text-white'
            }`}
          >
            🚀 Portfolio Deployment
          </button>
        </div>

        {/* Dynamic Section Contents */}
        {activeSection === 'resume' ? (
          <div className="space-y-8 animate-fade-in">
            {/* Guide Introduction */}
            <div className="glass p-8 rounded-2xl border border-white/5 shadow-xl space-y-6">
              <h2 className="text-2xl font-extrabold text-white flex items-center gap-3">
                <span className="text-emerald-400">Step 1:</span> Understanding ATS & Structure
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Applicant Tracking Systems (ATS) are used by over 98% of Fortune 500 companies to filter resumes. To ensure your resume gets seen by a recruiter, it needs to follow a standard structure with clean formatting.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="bg-slate-950/60 border border-white/5 p-5 rounded-xl space-y-3">
                  <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Required Section Headers (Bold)</h3>
                  <div className="space-y-2 text-sm text-slate-400">
                    <p className="flex items-center gap-2"><span className="text-emerald-400 font-bold">•</span> <strong>Summary (or Profile)</strong></p>
                    <p className="flex items-center gap-2"><span className="text-emerald-400 font-bold">•</span> <strong>Skills</strong></p>
                    <p className="flex items-center gap-2"><span className="text-emerald-400 font-bold">•</span> <strong>Work Experience (or Professional Experience)</strong></p>
                    <p className="flex items-center gap-2"><span className="text-emerald-400 font-bold">•</span> <strong>Education</strong></p>
                    <p className="flex items-center gap-2"><span className="text-emerald-400 font-bold">•</span> <strong>Projects</strong></p>
                  </div>
                </div>

                <div className="bg-slate-950/60 border border-white/5 p-5 rounded-xl space-y-3">
                  <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Bullet Points & Dates</h3>
                  <div className="space-y-3 text-sm text-slate-400 leading-relaxed">
                    <div>
                      <span className="text-slate-300 font-semibold block">Step 4: Write Clean Bullet Points</span>
                      <p>Under experience and projects, use standard round bullet points (•) rather than complex icons or symbols.</p>
                    </div>
                    <div>
                      <span className="text-slate-300 font-semibold block">Date Formatting</span>
                      <p>Write out dates plainly using the format: <strong>Month Year – Month Year</strong> (e.g., <em>Jan 2025 – Dec 2025</em>).</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Formatting Dos and Don'ts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass p-6 rounded-2xl border border-white/5 shadow-xl space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> Formatting Skills
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Always write your skills as a plain list separated by commas.
                </p>
                <div className="bg-slate-950/40 p-4 rounded-xl border border-emerald-500/20">
                  <code className="text-xs text-emerald-300 block">
                    Python, Java, JavaScript, React.js, Spring Boot, PostgreSQL, Docker, Git
                  </code>
                </div>
                <p className="text-xs text-slate-500">
                  ⚠️ <strong>Rule:</strong> Never use progress bars, percentage meters, stars, or visual rating graphics. ATS engines cannot read visual grids and will fail to extract your competencies.
                </p>
              </div>

              <div className="glass p-6 rounded-2xl border border-white/5 shadow-xl space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="text-indigo-400">💾</span> Step 5: Save & Share format
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  When you have completed your resume, output it in the correct document format to guarantee compatibility.
                </p>
                <div className="bg-slate-950/40 p-4 rounded-xl border border-indigo-500/20 text-xs space-y-2 text-slate-300">
                  <p className="flex items-center gap-2"><span className="text-indigo-400">✓</span> <strong>Microsoft Word (.docx)</strong> — Optimal for ATS parsers</p>
                  <p className="flex items-center gap-2"><span className="text-indigo-400">✓</span> <strong>Portable Document Format (.pdf)</strong> — Preserves styling</p>
                  <p className="flex items-center gap-2 text-red-400"><span className="text-red-500">✕</span> <strong>Images (.png, .jpg)</strong> — Completely unreadable by ATS</p>
                </div>
              </div>
            </div>

            {/* ATS Test & Verifications */}
            <div className="glass p-8 rounded-2xl border border-white/5 shadow-xl space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <span>🔍</span> The Quick "Notepad" Test
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Test if your resume is readable by bots without uploading to a third-party website using this quick local check:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 space-y-1">
                  <div className="text-lg">📄</div>
                  <div className="text-xs font-bold text-slate-300">1. Open File</div>
                  <div className="text-[10px] text-slate-500">Open your PDF or Word document</div>
                </div>
                <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 space-y-1">
                  <div className="text-lg">⌨️</div>
                  <div className="text-xs font-bold text-slate-300">2. Highlight All</div>
                  <div className="text-[10px] text-slate-500">Press Ctrl + A (Cmd + A on Mac)</div>
                </div>
                <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 space-y-1">
                  <div className="text-lg">📋</div>
                  <div className="text-xs font-bold text-slate-300">3. Copy Text</div>
                  <div className="text-[10px] text-slate-500">Press Ctrl + C to copy</div>
                </div>
                <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 space-y-1">
                  <div className="text-lg">📝</div>
                  <div className="text-xs font-bold text-slate-300">4. Paste in Notepad</div>
                  <div className="text-[10px] text-slate-500">Press Ctrl + V into Notepad</div>
                </div>
              </div>

              <div className="bg-indigo-950/20 border border-indigo-500/20 p-4 rounded-xl text-xs text-indigo-200 leading-relaxed">
                <strong>Result Analysis:</strong> If the pasted text reads in a normal, logical order from top to bottom without sentences mixing together, text overlapping, or details disappearing, your resume is correctly structured and ATS-friendly!
              </div>

              {/* Tools & Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div className="p-4 rounded-xl border border-white/5 bg-slate-950/50 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 font-mono">Verify ATS Compatibility</span>
                    <h4 className="text-sm font-bold text-white">Enhancv Resume Checker</h4>
                    <p className="text-xs text-slate-400">Score your resume format, identify mistakes, and improve your structure.</p>
                  </div>
                  <a
                    href="https://enhancv.com/resources/resume-checker/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold rounded-lg transition"
                  >
                    Check ATS Score ↗
                  </a>
                </div>

                <div className="p-4 rounded-xl border border-white/5 bg-slate-950/50 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 font-mono">Professional Optimization</span>
                    <h4 className="text-sm font-bold text-white">Career Zenith AI</h4>
                    <p className="text-xs text-slate-400 font-medium">Use specialized AI tools to write descriptions and optimize experience.</p>
                  </div>
                  <a
                    href="https://careerzenith.ai/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold rounded-lg transition"
                  >
                    Optimize with Career Zenith ↗
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            {/* Netlify Deploy methods */}
            <div className="glass p-8 rounded-2xl border border-white/5 shadow-xl space-y-6">
              <h2 className="text-2xl font-extrabold text-white flex items-center gap-3">
                <span className="text-[#00ad9f]">Netlify:</span> Deploying Your Static Site
              </h2>
              
              <div className="space-y-6">
                {/* Method 1 */}
                <div className="border-l-4 border-[#00ad9f] pl-4 space-y-2">
                  <h3 className="text-base font-bold text-white">Method 1: Netlify Drop (Easiest No-Code / No-GitHub Way)</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    If you have a compiled folder containing your frontend build assets (like the downloaded file or a <code>dist</code> directory), you can host it live instantly in your web browser.
                  </p>
                  <ol className="list-decimal list-inside text-xs text-slate-300 space-y-1">
                    <li>Log in to your <strong>Netlify Dashboard</strong>.</li>
                    <li>Navigate to the <strong>Sites</strong> tab.</li>
                    <li>Scroll to the bottom dropzone box: <em>"Want to deploy a new site without connecting to Git? Drag and drop your site folder here"</em>.</li>
                    <li>Drag your build folder directly into the box. Netlify compiles, uploads, and hosts it instantly!</li>
                  </ol>
                </div>

                {/* Method 2 */}
                <div className="border-l-4 border-slate-600 pl-4 space-y-2">
                  <h3 className="text-base font-bold text-white">Method 2: Netlify CLI (From Terminal)</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Deploy your code straight from your terminal command line interface. Requires Node.js installed locally.
                  </p>
                  <div className="bg-slate-950 p-4 rounded-xl font-mono text-xs text-cyan-300 space-y-3">
                    <div>
                      <p className="text-slate-500"># Install the CLI globally</p>
                      <p>npm install netlify-cli -g</p>
                    </div>
                    <div>
                      <p className="text-slate-500"># Authenticate your account</p>
                      <p>netlify login</p>
                    </div>
                    <div>
                      <p className="text-slate-500"># Deploy draft version (Specify dist or build directory when prompted)</p>
                      <p>netlify deploy</p>
                    </div>
                    <div>
                      <p className="text-slate-500"># Push to live production</p>
                      <p>netlify deploy --prod</p>
                    </div>
                  </div>
                </div>

                {/* Method 3 */}
                <div className="border-l-4 border-[#818cf8] pl-4 space-y-2">
                  <h3 className="text-base font-bold text-white">Method 3: GitHub Sync (Continuous Deployment)</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Netlify watches your GitHub repository and updates your site automatically every time you commit code.
                  </p>
                  <ol className="list-decimal list-inside text-xs text-slate-300 space-y-1">
                    <li>On the dashboard, click <strong>Add new site</strong> → <strong>Import an existing project</strong>.</li>
                    <li>Connect your <strong>GitHub</strong> account and choose your portfolio repository.</li>
                    <li>Select the branch to deploy. Netlify auto-detects build commands. Click <strong>Deploy</strong>.</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Vercel Deploy methods */}
            <div className="glass p-8 rounded-2xl border border-white/5 shadow-xl space-y-6">
              <h2 className="text-2xl font-extrabold text-white flex items-center gap-3">
                <span className="text-white">▲ Vercel:</span> High Performance Hosting
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-950/60 p-5 rounded-xl space-y-3 border border-white/5">
                  <h3 className="text-sm font-bold text-white">Vercel Git Integration</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Connect your project repository directly. Vercel builds and hosts your app on push.
                  </p>
                  <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                    <li>Login to <strong>vercel.com</strong> dashboard.</li>
                    <li>Click <strong>Add New</strong> → <strong>Project</strong>.</li>
                    <li>Import your GitHub repository.</li>
                    <li>Configure build options and click <strong>Deploy</strong>.</li>
                  </ul>
                </div>

                <div className="bg-slate-950/60 p-5 rounded-xl space-y-3 border border-white/5">
                  <h3 className="text-sm font-bold text-white">Vercel CLI Deployment</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Deploy straight from your local shell in seconds.
                  </p>
                  <div className="bg-slate-900 p-3 rounded-lg font-mono text-[11px] text-indigo-300 space-y-2">
                    <p className="text-slate-500"># Install CLI</p>
                    <p>npm install -g vercel</p>
                    <p className="text-slate-500"># Trigger deployment</p>
                    <p>vercel</p>
                    <p className="text-slate-500"># Deploy to production</p>
                    <p>vercel --prod</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Platform Comparison */}
            <div className="glass p-8 rounded-2xl border border-white/5 shadow-xl space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                ⚖️ Netlify vs. Vercel: Comparison
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="bg-slate-950/60 p-5 rounded-xl border border-white/5 space-y-3">
                  <h3 className="font-bold text-[#00ad9f] flex items-center gap-2">🟢 Choose Netlify if:</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    You have a purely static site (HTML, CSS, JS) or a standard single-page app framework (React, Vue, Vite) and want the absolute simplest drag-and-drop workflow without Git pipelines.
                  </p>
                </div>

                <div className="bg-slate-950/60 p-5 rounded-xl border border-white/5 space-y-3">
                  <h3 className="font-bold text-indigo-400 flex items-center gap-2">▲ Choose Vercel if:</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    You are utilizing heavy server-side rendering (SSR), API routes, or frameworks like Next.js, Nuxt.js, or SvelteKit, as Vercel is highly optimized for serverless functions and dynamic routing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
