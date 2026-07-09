import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/5 bg-slate-950/80 py-8 text-center text-xs text-slate-500">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-center sm:text-left">
          &copy; {new Date().getFullYear()} Folio. All rights reserved.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-slate-400">
          <a href="#" className="hover:text-white transition">Terms of Service</a>
          <span>&middot;</span>
          <a href="#" className="hover:text-white transition">Privacy Policy</a>
          <span>&middot;</span>
          <a href="#" className="hover:text-white transition">Status</a>
        </div>
      </div>
    </footer>
  );
}
