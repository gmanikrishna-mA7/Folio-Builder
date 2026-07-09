import React, { useEffect, useState } from 'react';

export default function JobAnalyzer() {
  const [particles, setParticles] = useState([]);
  
  // Form state
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [salary, setSalary] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');
  const [feeAsked, setFeeAsked] = useState('no');

  // Analysis result state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

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

  const handleAnalyze = (e) => {
    e.preventDefault();
    if (!jobTitle.trim() || !companyName.trim()) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);

    // Simulate AI model analysis latency
    setTimeout(() => {
      let score = 0;
      const reasons = [];

      // Risk rules calculation
      // 1. Fee Asked: Automatic high risk
      if (feeAsked === 'yes') {
        score += 65;
        reasons.push("Legitimate employers never ask for registration fees, training fees, or deposit checks.");
      }

      // 2. Email domain mismatch with company website
      const emailDomain = email.split('@')[1] || '';
      const isPublicEmail = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'rediffmail.com'].some(domain => 
        emailDomain.toLowerCase().includes(domain)
      );
      if (isPublicEmail && email.trim() !== '') {
        score += 20;
        reasons.push(`Official recruitment from ${companyName} would not originate from a public domain (${emailDomain}).`);
      }

      // 3. Website check
      if (website.trim() !== '') {
        const hasProtocol = website.startsWith('http://') || website.startsWith('https://');
        const cleanWeb = hasProtocol ? website.split('//')[1] : website;
        if (emailDomain && !cleanWeb.toLowerCase().includes(emailDomain.toLowerCase()) && !isPublicEmail) {
          score += 15;
          reasons.push("Email contact domain does not match the company website domain.");
        }
      }

      // 4. Description checks (scam words)
      const descLower = description.toLowerCase();
      const suspiciousWords = ['work from home daily payout', 'no experience required', 'deposit', 'earn 5000 daily', 'telegram link', 'whatsapp recruitment'];
      const foundWords = suspiciousWords.filter(word => descLower.includes(word));
      if (foundWords.length > 0) {
        score += 15 * foundWords.length;
        reasons.push(`Suspicious phrases detected in job description: "${foundWords.join(', ')}".`);
      }

      // Cap score
      score = Math.min(score, 100);

      // Determine risk tier
      let riskLevel = 'Safe';
      let colorClass = 'text-green-400 border-green-500/30 bg-green-500/10';
      if (score >= 60) {
        riskLevel = 'High Risk / Suspicious';
        colorClass = 'text-red-400 border-red-500/30 bg-red-500/10';
      } else if (score > 15) {
        riskLevel = 'Caution / Moderate Risk';
        colorClass = 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
      }

      setAnalysisResult({
        score,
        riskLevel,
        colorClass,
        reasons: reasons.length > 0 ? reasons : ["No immediate red flags detected. Standard verification guidelines still apply."]
      });
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full overflow-hidden bg-slate-950 text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      {/* Background canvas elements matching the Guide page */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60"></div>
        <div className="absolute top-1/4 left-1/10 w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/10 w-[500px] h-[500px] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none"></div>
        
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

      <div className="relative z-10 max-w-4xl mx-auto space-y-8 animate-fade-in">
        {/* Page Header */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-red-400 via-amber-400 to-indigo-400 bg-clip-text text-transparent">
            Job Analyzer
          </h1>
          
          {/* Disclaimer tag */}
          <div className="inline-block rounded-full border border-red-500/25 bg-red-500/10 px-4 py-1 text-xs text-red-300 font-semibold">
            ⚠️ Note: HireSpectrix is AI. Sometimes it may make mistakes.
          </div>

          <div className="space-y-1 pt-2">
            <p className="text-slate-200 text-lg sm:text-xl font-bold">
              Protect yourself from online job scams.
            </p>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
              Analyze job postings and identify suspicious offers instantly.
            </p>
          </div>
        </div>

        {/* ── ATTRACTIVE ANIMATED BOX / BANNER LINK ── */}
        <a
          href="https://hire-spectrix-nu.vercel.app/"
          target="_blank"
          rel="noreferrer"
          className="block relative group overflow-hidden rounded-2xl border border-indigo-500/30 p-6 bg-slate-900/60 backdrop-blur shadow-2xl hover:border-indigo-400 transition-all duration-300 animate-pulse-slow"
        >
          {/* Flowing background accents */}
          <div className="absolute -inset-y-12 -inset-x-24 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rotate-12 blur-2xl group-hover:scale-110 transition duration-500" />
          
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-mono font-semibold block">INTELLIGENT VERIFICATION PORTAL</span>
              <h3 className="text-base font-extrabold text-white">Access HireSpectrix System</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect directly to our full-scale AI analysis engine to cross-reference company directories and domains.
              </p>
            </div>
            <span className="rounded-lg bg-indigo-600 group-hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2.5 shadow-md shadow-indigo-600/30 shrink-0 transition">
              Launch Engine ↗
            </span>
          </div>
        </a>

        {/* ── JOB ANALYSIS FORM ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Column: Form */}
          <div className="glass p-6 sm:p-8 rounded-2xl border border-white/5 shadow-xl md:col-span-7 space-y-6">
            <div className="space-y-1 border-b border-white/5 pb-4">
              <span className="text-[9px] uppercase tracking-wider text-slate-500 font-mono">HOME / ANALYSIS</span>
              <h2 className="text-xl font-bold text-white">Job Analysis Form</h2>
              <p className="text-xs text-slate-400">Enter job details to check if the job is safe or suspicious.</p>
            </div>

            <form onSubmit={handleAnalyze} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Job Title</label>
                  <input
                    type="text"
                    required
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-slate-950 px-3.5 py-2 text-white focus:border-indigo-500 focus:outline-none"
                    placeholder="e.g. Software Engineer"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-slate-950 px-3.5 py-2 text-white focus:border-indigo-500 focus:outline-none"
                    placeholder="e.g. TCS"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Salary (per month)</label>
                  <div className="relative rounded-lg bg-slate-950 border border-white/10 flex items-center px-3">
                    <span className="text-slate-500 font-mono mr-2">₹ INR</span>
                    <input
                      type="text"
                      required
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                      className="w-full bg-transparent py-2 text-white focus:outline-none"
                      placeholder="e.g. 50,000"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Registration Fee Asked?</label>
                  <div className="flex gap-4 items-center h-9">
                    <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
                      <input
                        type="radio"
                        name="feeAsked"
                        checked={feeAsked === 'yes'}
                        onChange={() => setFeeAsked('yes')}
                        className="h-4 w-4 rounded border-white/10 text-indigo-600 bg-slate-950 focus:outline-none"
                      />
                      Yes
                    </label>
                    <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
                      <input
                        type="radio"
                        name="feeAsked"
                        checked={feeAsked === 'no'}
                        onChange={() => setFeeAsked('no')}
                        className="h-4 w-4 rounded border-white/10 text-indigo-600 bg-slate-950 focus:outline-none"
                      />
                      No
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Contact Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-slate-950 px-3.5 py-2 text-white focus:border-indigo-500 focus:outline-none"
                    placeholder="e.g. hr@company.com"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Company Website</label>
                  <input
                    type="text"
                    required
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-slate-950 px-3.5 py-2 text-white focus:border-indigo-500 focus:outline-none"
                    placeholder="e.g. company.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Job Description</label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-slate-950 px-3.5 py-2 text-white focus:border-indigo-500 focus:outline-none"
                  placeholder="Enter details about responsibilities, location, or communication details..."
                  rows={4}
                />
              </div>

              <button
                type="submit"
                disabled={isAnalyzing}
                className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 transition shadow-lg shadow-indigo-600/20 disabled:opacity-50"
              >
                {isAnalyzing ? 'Analyzing Job Details...' : 'Analyze Job'}
              </button>
            </form>
          </div>

          {/* Right Column: Analysis Output Display */}
          <div className="md:col-span-5 flex flex-col justify-start">
            {analysisResult ? (
              <div className="glass p-6 rounded-2xl border border-white/5 shadow-xl space-y-5 animate-fade-in">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-wider text-slate-500 font-mono">MODEL PREDICTION</span>
                  <h3 className="text-base font-bold text-white">Risk Evaluation</h3>
                </div>

                {/* Score bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-400">Risk Score</span>
                    <span className={analysisResult.score > 50 ? 'text-red-400' : 'text-green-400'}>
                      {analysisResult.score}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-950 border border-white/5 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ${
                        analysisResult.score > 60
                          ? 'bg-red-500 shadow-md shadow-red-500/25'
                          : analysisResult.score > 15
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${analysisResult.score}%` }}
                    />
                  </div>
                </div>

                {/* Status tag */}
                <div className={`p-3.5 rounded-xl border text-center font-bold text-xs ${analysisResult.colorClass}`}>
                  {analysisResult.riskLevel}
                </div>

                {/* Explanations */}
                <div className="space-y-2 text-xs">
                  <p className="font-bold text-slate-300 uppercase tracking-wide text-[9px]">Indicators Found:</p>
                  <ul className="space-y-2 text-slate-400 leading-relaxed">
                    {analysisResult.reasons.map((reason, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-indigo-400 font-bold">•</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="glass p-8 rounded-2xl border border-dashed border-white/10 text-center space-y-3 flex flex-col items-center justify-center min-h-[300px]">
                <span className="text-3xl animate-bounce">🔬</span>
                <h3 className="text-sm font-bold text-slate-300">Ready for Scan</h3>
                <p className="text-xs text-slate-500 leading-relaxed max-w-[220px] mx-auto">
                  Fill out the form and click Analyze to review the risk indicators and security prediction.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
