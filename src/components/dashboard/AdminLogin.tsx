import { useState } from 'react';
import { LockKeyhole, ShieldCheck, UserCircle2 } from 'lucide-react';
import { adminBackend } from '../../db/adminBackend';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState('mkshopzone2@gmail.com');
  const [password, setPassword] = useState('Admin@123');
  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await adminBackend.login(email, password);
      if (!result.success) {
        setError(result.message || 'Login failed');
        setLoading(false);
        return;
      }
      onLoginSuccess();
    } catch (err) {
      setError('Connection to backend failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl shadow-black/30">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600/15 text-indigo-400">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h1 className="mt-5 text-2xl font-black text-white">MK ShopZone Admin Login</h1>
          <p className="mt-2 text-sm text-slate-400">Secure dashboard access with JWT-style session and password hashing simulation.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Admin email</label>
            <div className="relative">
              <UserCircle2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Password</label>
            <div className="relative">
              <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
            </div>
          </div>
          {error && <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-400">{error}</p>}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-950/30 hover:opacity-95 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in to admin panel'}
          </button>
          <p className="text-center text-[11px] text-slate-500">Demo credentials prefilled for review.</p>
        </form>
      </div>
    </div>
  );
}
