import { useState } from 'react';
import { Lock, KeyRound, X, AlertCircle } from 'lucide-react';
import { api } from '../api/api';

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim() || submitting) return;

    setSubmitting(true);
    setError('');
    try {
      await api.login(password);
      setPassword('');
      onLoginSuccess();
    } catch (err) {
      setError(err.message || 'Incorrect password. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-login-title"
        className="relative w-full max-w-md glass-sheet animate-sheetIn rounded-3xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close login modal"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F5F5F7] hover:bg-black/[0.08] text-[#1D1D1F] flex items-center justify-center transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#F5F5F7] border border-black/[0.06] text-[#1D1D1F] flex items-center justify-center mx-auto mb-3">
            <Lock className="w-5 h-5" />
          </div>
          <h2 id="admin-login-title" className="text-xl font-semibold tracking-tight text-[#1D1D1F]">
            Administrator Access
          </h2>
          <p className="text-xs text-[#6E6E73] mt-1">
            Enter admin password to manage categories and products.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#1D1D1F] mb-1.5">
              Admin Password
            </label>
            <div className="relative">
              <input
                type="password"
                autoFocus
                placeholder="Enter password..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-[#F5F5F7] border border-black/[0.06] rounded-xl text-sm text-[#1D1D1F] placeholder-[#6E6E73] focus:outline-none focus:bg-white focus:border-black/25 transition"
              />
              <KeyRound className="w-4 h-4 text-[#6E6E73] absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-full bg-[#1D1D1F] hover:bg-[#000000] disabled:opacity-50 text-white font-medium text-sm transition shadow-apple"
          >
            {submitting ? 'Signing in...' : 'Continue to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}
