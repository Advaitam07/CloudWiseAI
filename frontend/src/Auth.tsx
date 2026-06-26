import React, { useState } from 'react';

import {
  signIn,
  signUp,
  resetPassword,
  fetchUserAttributes,
} from "aws-amplify/auth";

import { Cloud, Lock, Mail, User, ShieldCheck } from 'lucide-react';
interface AuthProps {
  onAuthSuccess: (user: { email: string; name: string }) => void;
  onBack: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onAuthSuccess, onBack }) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setSuccessMsg('');

  try {
    if (mode === 'signin') {
      if (!email || !password) {
        setError('Please enter both email and password.');
        return;
      }

      await signIn({
        username: email,
        password,
      });

      const attributes = await fetchUserAttributes();

      onAuthSuccess({
        email,
        name: attributes.name || email.split('@')[0],
      });
    }

    else if (mode === 'signup') {
      if (!email || !password || !name) {
        setError('All fields are required.');
        return;
      }

      await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            name,
          },
        },
      });

      setSuccessMsg(
        'Account created successfully! Please check your email for the verification code.'
      );
    }

    else {
      if (!email) {
        setError('Please enter your email.');
        return;
      }

      await resetPassword({
        username: email,
      });

      setSuccessMsg(
        'Password reset instructions have been sent.'
      );
    }
  } catch (err: any) {
    setError(err.message || 'Authentication failed.');
  }
};

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-100 font-sans relative">
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      <button
        onClick={onBack}
        className="absolute top-6 left-6 text-xs text-slate-400 hover:text-purple-400 border border-slate-800 rounded-lg px-3 py-1.5 hover:bg-slate-900 transition-colors"
      >
        ← Back to Home
      </button>

      <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-2xl relative">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gradient-to-tr from-purple-600 to-indigo-500 p-3 rounded-2xl shadow-lg shadow-purple-500/20 mb-4">
            <Cloud className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold bg-gradient-to-r from-white to-slate-355 bg-clip-text text-transparent">
            {mode === 'signin' && 'Sign In to CloudWise'}
            {mode === 'signup' && 'Create Your Account'}
            {mode === 'forgot' && 'Reset Password'}
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            {mode === 'signin' && 'Access cloud design and optimization analytics'}
            {mode === 'signup' && 'Get started with AWS optimization recommendations'}
            {mode === 'forgot' && 'Provide your registered email to request a reset'}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/40 border border-red-800 text-red-400 text-xs rounded-xl mb-4">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-950/40 border border-emerald-800 text-emerald-400 text-xs rounded-xl mb-4">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-xs text-purple-400 hover:text-purple-300 hover:underline"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg shadow-purple-500/20 transition-all hover:scale-[1.02] active:scale-95 duration-200 mt-6"
          >
            {mode === 'signin' && 'Sign In'}
            {mode === 'signup' && 'Register Account'}
            {mode === 'forgot' && 'Request Reset'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center text-sm text-slate-400">
          {mode === 'signin' ? (
            <p>
              New to CloudWise?{' '}
              <button onClick={() => setMode('signup')} className="text-purple-400 hover:text-purple-300 font-semibold">
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button onClick={() => setMode('signin')} className="text-purple-400 hover:text-purple-300 font-semibold font-sans">
                Sign In
              </button>
            </p>
          )}
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5" /> Secure authentication verified via AWS Cognito simulator.
        </div>
      </div>
    </div>
  );
};
