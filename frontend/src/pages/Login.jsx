// frontend/src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login, register, switchDemoAccount } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    let res;
    if (isRegister) {
      res = await register(name, email, password);
    } else {
      res = await login(email, password);
    }

    if (res.success) {
      navigate('/account');
    } else {
      setError(res.error || 'Authentication failed.');
    }
    setLoading(false);
  };

  const handleDemo = async (role) => {
    setLoading(true);
    const res = await switchDemoAccount(role);
    if (res.success) {
      navigate(role === 'admin' ? '/admin' : '/account');
    } else {
      setError(res.error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-black tracking-tight">
          {isRegister ? 'Create Account' : 'Sign In'}
        </h1>
        <p className="text-xs text-neutral-500">
          {isRegister ? 'Join Nexora Tech' : 'Access your orders and account'}
        </p>
      </div>

      <div className="p-8 rounded-3xl border border-neutral-200 space-y-6 bg-white">
        {error && (
          <div className="p-3.5 rounded-xl bg-neutral-100 border border-black text-black text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isRegister && (
            <div>
              <label className="block text-neutral-600 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Jordan Lee"
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-100 text-black focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-neutral-600 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="customer@nexoratech.com"
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-100 text-black focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-neutral-600 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-100 text-black focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-black hover:bg-neutral-800 text-white font-medium text-xs transition-colors"
          >
            {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className="text-xs text-neutral-500 hover:text-black underline"
          >
            {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Register"}
          </button>
        </div>

        <div className="pt-5 border-t border-neutral-100 space-y-2.5">
          <p className="text-[10px] text-neutral-400 uppercase tracking-widest text-center">
            1-Click Demo Login
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleDemo('customer')}
              className="py-2.5 px-3 rounded-full border border-neutral-300 hover:border-black text-black text-xs font-medium transition-colors"
            >
              Demo Customer
            </button>
            <button
              onClick={() => handleDemo('admin')}
              className="py-2.5 px-3 rounded-full bg-black hover:bg-neutral-800 text-white text-xs font-medium transition-colors"
            >
              Demo Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
