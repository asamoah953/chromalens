import React from 'react';
import { Link } from 'react-router-dom';
import { Sun, Glasses, Lock } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Glasses className="h-8 w-8 text-slate-900" />
            <span className="font-bold text-xl tracking-tight text-slate-900">AuraOptics</span>
          </Link>
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
              Collection
            </Link>
            <Link to="/admin" className="text-slate-400 hover:text-indigo-600 transition-colors" title="Admin Portal">
              <Lock className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
