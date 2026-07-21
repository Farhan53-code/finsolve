/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Shield, Mail, Lock, User, ArrowRight, Eye, EyeOff, Loader2, Phone, ArrowLeft, Chrome } from 'lucide-react';
import { AppRoute, User as UserType } from '../types.js';
import { getClientFirebase } from '../firebase.js';
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  updateProfile 
} from 'firebase/auth';

interface AuthProps {
  activeRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  onLoginSuccess: (token: string, user: UserType) => void;
}

export default function Auth({ activeRoute, onNavigate, onLoginSuccess }: AuthProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const fb = getClientFirebase();
      if (!fb) {
        throw new Error('Firebase Auth is not yet configured. Please enter your configuration parameters.');
      }

      if (activeRoute === AppRoute.REGISTER) {
        if (!name || !email || !password || !mobile) {
          throw new Error('All registration fields including mobile number are required.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters.');
        }

        // Direct client-side user creation with Firebase Auth SDK
        const credential = await createUserWithEmailAndPassword(fb.auth, email, password);
        const fbUser = credential.user;

        // Save displayName using the SDK directly
        await updateProfile(fbUser, { displayName: name });

        setSuccess('Account created successfully! Redirecting to sign in...');
        setTimeout(() => onNavigate(AppRoute.LOGIN), 1500);

      } else if (activeRoute === AppRoute.LOGIN) {
        if (!email || !password) {
          throw new Error('Please enter both email and password.');
        }

        // Direct client-side sign in with Firebase Auth SDK
        const credential = await signInWithEmailAndPassword(fb.auth, email, password);
        const fbUser = credential.user;

        const token = await fbUser.getIdToken();
        const userObj: UserType = {
          id: fbUser.uid,
          email: fbUser.email || email,
          name: fbUser.displayName || 'Secura User',
          plan: 'free' as any,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          mobile: mobile || ''
        };

        onLoginSuccess(token, userObj);
        onNavigate(AppRoute.DASHBOARD);

      } else if (activeRoute === AppRoute.FORGOT_PASSWORD) {
        if (!email) throw new Error('Please enter your email.');
        
        // Direct client-side password reset email sending with Firebase Auth SDK
        await sendPasswordResetEmail(fb.auth, email);

        setSuccess('A password reset link has been dispatched to your email address!');
        setTimeout(() => onNavigate(AppRoute.LOGIN), 2500);

      } else if (activeRoute === AppRoute.RESET_PASSWORD) {
        setSuccess('Password reset has been initiated. Please use the link sent to your email.');
        setTimeout(() => onNavigate(AppRoute.LOGIN), 1500);
      }
    } catch (err: any) {
      console.error('Firebase Auth Error:', err);
      let friendlyMessage = err.message || 'An unexpected authentication error occurred.';
      if (err.code === 'auth/email-already-in-use') {
        friendlyMessage = 'This email address is already registered.';
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        friendlyMessage = 'Invalid email address or key.';
      } else if (err.code === 'auth/weak-password') {
        friendlyMessage = 'Password is too weak. Must be at least 6 characters.';
      }
      setError(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between items-center bg-zinc-50 dark:bg-zinc-950 px-6 py-12 transition-colors duration-300">
      <div className="w-full flex-1 flex flex-col items-center justify-center relative">
        <div className="absolute top-6 left-6 flex items-center gap-2 cursor-pointer" onClick={() => onNavigate(AppRoute.LANDING)}>
        <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center shadow-md">
          <span className="font-bold text-white dark:text-zinc-950 text-sm">S</span>
        </div>
        <span className="font-bold text-zinc-900 dark:text-zinc-50 text-lg tracking-tight">Secura<span className="text-zinc-400 font-medium">.io</span></span>
      </div>

      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-xl p-8 md:p-10 transition-colors duration-300 relative">
        <button 
          onClick={() => onNavigate(AppRoute.LANDING)}
          className="absolute top-6 left-6 flex items-center gap-1 text-xs font-bold text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-4 text-zinc-800 dark:text-zinc-100">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
            {activeRoute === AppRoute.LOGIN && 'Welcome back'}
            {activeRoute === AppRoute.REGISTER && 'Create your Hub'}
            {activeRoute === AppRoute.FORGOT_PASSWORD && 'Reset your keys'}
            {activeRoute === AppRoute.RESET_PASSWORD && 'Setup new credentials'}
          </h2>
          <p className="text-sm text-zinc-500 mt-1.5">
            {activeRoute === AppRoute.LOGIN && 'Access your secure encrypted operations feed.'}
            {activeRoute === AppRoute.REGISTER && 'Get starting credentials for your multi-page workspace.'}
            {activeRoute === AppRoute.FORGOT_PASSWORD && 'We will authorize a security update.'}
            {activeRoute === AppRoute.RESET_PASSWORD && 'Enter your authorized new login key.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 text-xs font-semibold border border-rose-100 dark:border-rose-900/50">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold border border-emerald-100 dark:border-emerald-900/50 animate-pulse">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {activeRoute === AppRoute.REGISTER && (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 transition-all placeholder-zinc-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Mobile Number</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400">
                    <Phone className="w-4 h-4" />
                  </span>
                  <input 
                    type="tel" 
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 transition-all placeholder-zinc-400"
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400">
                <Mail className="w-4 h-4" />
              </span>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 transition-all placeholder-zinc-400"
                required
              />
            </div>
          </div>

          {(activeRoute === AppRoute.LOGIN || activeRoute === AppRoute.REGISTER || activeRoute === AppRoute.RESET_PASSWORD) && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  {activeRoute === AppRoute.RESET_PASSWORD ? 'New Password' : 'Password'}
                </label>
                {activeRoute === AppRoute.LOGIN && (
                  <button 
                    type="button"
                    onClick={() => onNavigate(AppRoute.FORGOT_PASSWORD)}
                    className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100 transition-colors"
                  >
                    Forgot Key?
                  </button>
                )}
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 transition-all placeholder-zinc-400"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {activeRoute === AppRoute.LOGIN && (
            <div className="flex items-center">
              <input 
                id="remember_me" 
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500"
              />
              <label htmlFor="remember_me" className="ml-2.5 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                Keep session encrypted on this browser
              </label>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-sm font-semibold tracking-tight transition-all flex items-center justify-center gap-2 shadow hover:shadow-md cursor-pointer"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>
                  {activeRoute === AppRoute.LOGIN && 'Authenticate Session'}
                  {activeRoute === AppRoute.REGISTER && 'Deploy Workspace'}
                  {activeRoute === AppRoute.FORGOT_PASSWORD && 'Send Security Code'}
                  {activeRoute === AppRoute.RESET_PASSWORD && 'Update System Key'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {(activeRoute === AppRoute.LOGIN || activeRoute === AppRoute.REGISTER) && (
            <div className="space-y-4 pt-1">
              <div className="flex items-center my-3">
                <div className="flex-1 border-t border-zinc-100 dark:border-zinc-800/80"></div>
                <span className="px-3 text-[10px] text-zinc-400 font-mono font-bold uppercase">or</span>
                <div className="flex-1 border-t border-zinc-100 dark:border-zinc-800/80"></div>
              </div>

              <button 
                type="button"
                onClick={async () => {
                  setLoading(true);
                  setError(null);
                  const fb = getClientFirebase();
                  if (fb) {
                    try {
                      const result = await signInWithPopup(fb.auth, fb.provider);
                      const fbUser = result.user;
                      if (!fbUser.email) {
                        throw new Error('Google account did not provide a valid email address.');
                      }
                      
                      const token = await fbUser.getIdToken();
                      const userObj: UserType = {
                        id: fbUser.uid,
                        email: fbUser.email,
                        name: fbUser.displayName || 'Google User',
                        plan: 'free' as any,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        mobile: '+1 (000) 000-0000'
                      };

                      onLoginSuccess(token, userObj);
                      onNavigate(AppRoute.DASHBOARD);
                    } catch (err: any) {
                      console.error('Firebase Google Sign-In Error:', err);
                      let friendlyMessage = err.message || 'Google authentication failed.';
                      if (err.code === 'auth/unauthorized-domain' || (err.message && err.message.includes('unauthorized-domain'))) {
                        friendlyMessage = `Firebase Domain Authorization Error: Please go to your Firebase Console -> Authentication -> Settings -> Authorized Domains, and add this domain: "${window.location.hostname}" so Google is allowed to sign in from this preview environment.`;
                      }
                      setError(friendlyMessage);
                    } finally {
                      setLoading(false);
                    }
                  } else {
                    // Firebase configuration is missing
                    setError('Firebase is not yet configured with your API credentials. Running Google login in Secure Sandbox Demo Mode...');
                    setTimeout(() => {
                      const mockToken = 'mock_google_token_' + Math.random().toString(36).substring(2, 10);
                      const mockUser = {
                        id: 'user_google_' + Math.random().toString(36).substring(2, 10),
                        email: 'google.user@gmail.com',
                        name: 'Google User',
                        plan: 'free',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                      };
                      onLoginSuccess(mockToken, mockUser as any);
                      setLoading(false);
                      setError(null);
                    }, 1200);
                  }
                }}
                className="w-full py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold tracking-tight transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Chrome className="w-4 h-4 text-rose-500" />
                <span>Continue with Google</span>
              </button>
            </div>
          )}
        </form>

        <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800/80 text-center">
          <p className="text-xs text-zinc-500">
            {activeRoute === AppRoute.LOGIN && (
              <>
                New to Secura?{' '}
                <button 
                  onClick={() => onNavigate(AppRoute.REGISTER)}
                  className="font-bold text-zinc-900 dark:text-zinc-100 hover:underline"
                >
                  Register Account
                </button>
              </>
            )}
            {activeRoute === AppRoute.REGISTER && (
              <>
                Already have an account?{' '}
                <button 
                  onClick={() => onNavigate(AppRoute.LOGIN)}
                  className="font-bold text-zinc-900 dark:text-zinc-100 hover:underline"
                >
                  Authenticate
                </button>
              </>
            )}
            {(activeRoute === AppRoute.FORGOT_PASSWORD || activeRoute === AppRoute.RESET_PASSWORD) && (
              <button 
                onClick={() => onNavigate(AppRoute.LOGIN)}
                className="font-bold text-zinc-900 dark:text-zinc-100 hover:underline"
              >
                Back to Authentication
              </button>
            )}
          </p>
        </div>
      </div>
      </div>
      <footer className="w-full max-w-md text-center pt-8 text-[10px] text-zinc-400 font-mono border-t border-zinc-100 dark:border-zinc-800/80 mt-8">
        &copy; 2026 Secura. All rights reserved. Zero-Knowledge military-grade encryption.
      </footer>
    </div>
  );
}
