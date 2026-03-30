import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../contexts/StoreContext';
import { Lock, Eye, EyeOff } from 'lucide-react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { loginAdmin, isAdminAuth } = useStore();

  React.useEffect(() => {
    if (isAdminAuth) {
      navigate('/admin/dashboard');
    }
  }, [isAdminAuth, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const success = await loginAdmin(password);
    if (success) {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid admin password.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-zinc-50 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-10 shadow-xl border border-zinc-100">
        <div className="flex justify-center mb-8">
          <div className="h-16 w-16 bg-indigo-50 rounded-2xl flex items-center justify-center">
            <Lock className="h-8 w-8 text-indigo-600" />
          </div>
        </div>
        
        <h2 className="text-center text-2xl font-bold text-slate-900 mb-8">Admin Access</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Master Password</label>
            <div className="relative">
              <input 
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all pr-12"
                placeholder="Enter password..."
                required
              />
              <button 
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPwd ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          </div>

          <button 
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-xl transition-colors duration-200"
          >
            Authenticate
          </button>
        </form>
      </div>
    </div>
  );
}
