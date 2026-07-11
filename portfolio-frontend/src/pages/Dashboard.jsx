import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import PortfolioChatBuilder from '../components/PortfolioChatBuilder';

export default function Dashboard() {
  const userEmail = localStorage.getItem('userEmail') || 'developer@gmail.com';
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // View states: 'list', 'create', 'edit'
  const [view, setView] = useState('list');
  const [selectedPortfolioId, setSelectedPortfolioId] = useState(null);

  const fetchPortfolios = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/api/profile/list');
      setPortfolios(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch portfolios. Please verify server connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const handleCreateNew = () => {
    setSelectedPortfolioId(null);
    setView('create');
  };

  const handleEdit = (id) => {
    setSelectedPortfolioId(id);
    setView('edit');
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this portfolio permanently? This cannot be undone.")) return;
    try {
      await api.delete(`/api/profile/${id}`);
      fetchPortfolios();
    } catch (err) {
      console.error(err);
      alert("Failed to delete portfolio. Please try again.");
    }
  };

  const handleBuilderComplete = () => {
    setView('list');
    fetchPortfolios();
  };

  const handleDownloadHtml = async (slug) => {
    if (!slug) {
      alert("Error: Portfolio slug is not available.");
      return;
    }
    try {
      const response = await api.get(`/api/public/portfolio/${slug}/export`, {
        responseType: 'blob'
      });
      const blob = new Blob([response.data], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${slug}-portfolio.html`);
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
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Top Console Banner */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-white/5 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Developer Console</h1>
            <p className="text-sm text-slate-400 mt-1">Design, edit, and publish multiple high-fidelity developer portfolios.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-slate-900 border border-white/5 px-4 py-2 text-right hidden sm:block">
              <span className="text-[9px] text-slate-500 font-mono block">Logged in as</span>
              <span className="text-xs font-semibold text-slate-300">{userEmail}</span>
            </div>
            
            {view === 'list' && (
              <button
                onClick={handleCreateNew}
                className="rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-5 py-2.5 transition shadow-lg shadow-indigo-600/20 border border-indigo-500/25"
              >
                + Create New Portfolio
              </button>
            )}

            {view !== 'list' && (
              <button
                onClick={() => setView('list')}
                className="rounded-full bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white text-sm font-semibold px-5 py-2.5 transition"
              >
                &larr; Back to List
              </button>
            )}
          </div>
        </div>

        {/* View Routing */}
        {view === 'list' ? (
          <div className="space-y-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[1, 2].map((n) => (
                  <div key={n} className="h-44 bg-slate-900/60 rounded-xl border border-white/5"></div>
                ))}
              </div>
            ) : error ? (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-xs font-semibold text-red-400">
                {error}
              </div>
            ) : portfolios.length === 0 ? (
              <div className="text-center py-16 rounded-2xl border border-dashed border-white/10 bg-slate-950">
                <svg className="w-12 h-12 text-slate-600 mx-auto mb-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="text-lg font-bold text-white mb-2">No Portfolios Found</h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">You haven't built any portfolios yet. Launch the builder to generate your first website.</p>
                <button
                  onClick={handleCreateNew}
                  className="rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-6 py-2.5 transition"
                >
                  Build Your First Portfolio
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolios.map((port) => (
                  <div
                    key={port.id}
                    className="relative group bg-slate-900/40 rounded-xl p-6 border border-white/5 flex flex-col justify-between hover:border-indigo-500/30 transition-all duration-300 shadow-xl shadow-slate-950/60 hover:shadow-indigo-500/5 hover:-translate-y-0.5"
                  >
                    {/* Glowing Accent */}
                    <div className="absolute inset-0 rounded-xl bg-indigo-500/5 opacity-0 group-hover:opacity-100 blur transition pointer-events-none"></div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="overflow-hidden max-w-[80%]">
                          <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition truncate">{port.name}</h3>
                          <p className="text-xs text-slate-500 font-mono mt-0.5 truncate">{port.title}</p>
                        </div>
                        <span className="text-[9px] bg-slate-950 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded font-mono shrink-0">
                          LIVE
                        </span>
                      </div>
                      
                      <div className="space-y-1.5 text-xs text-slate-400">
                        <p className="line-clamp-2 min-h-[2.5rem]">{port.bio || 'No bio entered.'}</p>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono pt-1">
                          <span>Slug:</span>
                          <span className="text-slate-300 truncate">/public/portfolio/{port.slug}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-6 border-t border-white/5 mt-4">
                      <button
                        onClick={() => handleEdit(port.id)}
                        className="rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/5 py-2 text-[11px] font-semibold text-slate-300 hover:text-white transition"
                      >
                        Edit
                      </button>
                      <a
                        href={`/public/portfolio/${port.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-center rounded-lg bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/30 py-2 text-[11px] font-semibold text-indigo-300 hover:text-white transition"
                      >
                        View
                      </a>
                      <button
                        onClick={() => handleDelete(port.id)}
                        className="rounded-lg bg-red-950/20 hover:bg-red-600 border border-red-500/30 py-2 text-[11px] font-semibold text-red-400 hover:text-white transition"
                      >
                        Delete
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <a
                        href={`${import.meta.env.VITE_API_URL || 'https://folio-backend-k6qf.onrender.com'}/api/public/portfolio/${port.slug}/export`}
                        download={`${port.slug}-portfolio.html`}
                        className="flex items-center justify-center gap-1.5 rounded-lg bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-500/30 py-2 text-[10px] font-semibold text-indigo-300 hover:text-white transition no-underline"
                      >
                        📥 HTML
                      </a>
                      <a
                        href="https://app.netlify.com/drop"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-1.5 text-center rounded-lg bg-teal-950/40 hover:bg-teal-900/60 border border-[#00ad9f]/30 py-2 text-[10px] font-semibold text-teal-300 hover:text-white transition no-underline"
                      >
                        🟢 Netlify
                      </a>
                      <a
                        href="https://vercel.com/new"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-1.5 text-center rounded-lg bg-slate-900/60 hover:bg-slate-800 border border-white/10 py-2 text-[10px] font-semibold text-slate-300 hover:text-white transition no-underline"
                      >
                        ▲ Vercel
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <p className="text-[10px] text-slate-400 font-sans tracking-wide text-center bg-slate-900/20 border border-white/5 py-2 px-4 rounded-lg mt-8 max-w-2xl mx-auto leading-relaxed">
              💡 <span className="font-semibold text-slate-300">Notice:</span> Sometimes image uploads or PDF documents might not process successfully due to temporary hosting or network constraints. If you notice any missing images, you can always click the <strong>Edit</strong> button on your portfolio card to re-upload them.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <PortfolioChatBuilder
              portfolioId={selectedPortfolioId}
              onComplete={handleBuilderComplete}
            />
          </div>
        )}
      </div>
    </div>
  );
}
