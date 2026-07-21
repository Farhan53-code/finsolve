/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Shield, CreditCard, PieChart, Clock, Calendar, Check, ArrowRight, Star, Plus, Minus, Info, Sparkles,
  Sun, Moon, ChevronDown, FileText, ShieldAlert, Users, Mail
} from 'lucide-react';
import { AppRoute } from '../types.js';
import LegalPages from './LegalPages.js';

interface LandingPageProps {
  onNavigate: (route: AppRoute) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  isLoggedIn?: boolean;
  activeRoute: AppRoute;
}

export default function LandingPage({ onNavigate, theme, onToggleTheme, isLoggedIn = false, activeRoute }: LandingPageProps) {
  const stats = [
    { value: '100k+', label: 'Active Vaults' },
    { value: '$12M+', label: 'Invoiced Monthly' },
    { value: '99.99%', label: 'Uptime SLA' },
    { value: '256-bit', label: 'Military Encryption' }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Zero-Knowledge Password Vault',
      desc: 'Military-grade double-encrypted credentials manager. Strictly decrypted client-side so only you ever access your keys.',
      badge: 'Secure'
    },
    {
      icon: CreditCard,
      title: 'Freelancer Invoicing',
      desc: 'Build beautiful, professional tax-compliant client invoices. Export print-ready PDFs and trace payments in seconds.',
      badge: 'Popular'
    },
    {
      icon: PieChart,
      title: 'Personal Budget Planner',
      desc: 'Set smart category caps. Monitor expenditures and keep your savings rate optimized with zero stress.',
      badge: 'Analytics'
    },
    {
      icon: Clock,
      title: 'Expense & Receipt Ledger',
      desc: 'AI-assisted receipt scanning and auto-categorization powered by Gemini Flash 3.5. Instant CSV exporting.',
      badge: 'AI Smart'
    },
    {
      icon: Calendar,
      title: 'Document Expiry Reminders',
      desc: 'Never pay double for an expired passport or visa. Adaptive timeline trackers with automatic system warnings.',
      badge: 'Essential'
    }
  ];

  const faqs = [
    {
      q: 'How does the zero-knowledge password encryption work?',
      a: 'All password credentials are encrypted server-side using secure AES-256-CBC with individual salts. We never store primary keys or decrypted passwords on our network.'
    },
    {
      q: 'Can I import my existing spreadsheet budgets or passwords?',
      a: 'Absolutely. Secura supports standard CSV schemas for smooth migration of invoices, budgets, expenses, and credentials vault items.'
    },
    {
      q: 'Is there a limit on free tier document alerts?',
      a: 'The Free Plan includes up to 3 document trackers and basic budgeting. Upgrading to Premium unlocks unlimited documents, invoices, and Gemini AI receipt parsing.'
    }
  ];

  const isLegalScreen = [
    AppRoute.ABOUT_US,
    AppRoute.TERMS,
    AppRoute.CONTACT_US,
    AppRoute.DISCLAIMER,
    AppRoute.PRIVACY,
    AppRoute.REFUND
  ].includes(activeRoute);

  return (
    <div className="min-h-screen transition-colors duration-300">
      {/* Navigation Header */}
      <header className="border-b border-gray-100 dark:border-zinc-800/80 sticky top-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md z-40 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-1.5 sm:gap-2 cursor-pointer" onClick={() => onNavigate(AppRoute.LANDING)}>
            <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center shadow-md">
              <span className="font-bold text-white dark:text-zinc-950 text-sm">S</span>
            </div>
            <span className="font-bold text-zinc-900 dark:text-zinc-50 text-lg tracking-tight">Secura</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            <button onClick={() => { onNavigate(AppRoute.LANDING); setTimeout(() => { document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }, 100); }} className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer">Features</button>
            <button onClick={() => { onNavigate(AppRoute.LANDING); setTimeout(() => { document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }); }, 100); }} className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer">Pricing</button>
            <button onClick={() => { onNavigate(AppRoute.LANDING); setTimeout(() => { document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' }); }, 100); }} className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer">FAQ</button>
            
            {/* Resources Dropdown for the 6 requested pages */}
            <div className="relative group/resources py-2">
              <button className="flex items-center gap-1 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer font-medium text-sm">
                <span>Resources</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover/resources:rotate-180 transition-transform duration-200" />
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-52 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-850 p-2 shadow-xl opacity-0 translate-y-2 pointer-events-none group-hover/resources:opacity-100 group-hover/resources:translate-y-0 group-hover/resources:pointer-events-auto transition-all duration-200 z-50">
                <button 
                  onClick={() => onNavigate(AppRoute.ABOUT_US)}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white flex items-center gap-2 cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5 text-rose-500" />
                  <span>About Us</span>
                </button>
                <button 
                  onClick={() => onNavigate(AppRoute.CONTACT_US)}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white flex items-center gap-2 cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5 text-blue-500" />
                  <span>Contact Us</span>
                </button>
                <button 
                  onClick={() => onNavigate(AppRoute.TERMS)}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-500" />
                  <span>Terms & Conditions</span>
                </button>
                <button 
                  onClick={() => onNavigate(AppRoute.PRIVACY)}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white flex items-center gap-2 cursor-pointer"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Privacy Policy</span>
                </button>
                <button 
                  onClick={() => onNavigate(AppRoute.DISCLAIMER)}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white flex items-center gap-2 cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Disclaimer</span>
                </button>
                <button 
                  onClick={() => onNavigate(AppRoute.REFUND)}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white flex items-center gap-2 cursor-pointer"
                >
                  <CreditCard className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Refund Policy</span>
                </button>
              </div>
            </div>
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Theme Toggle option */}
            <button 
              onClick={onToggleTheme}
              className="p-1.5 sm:p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all cursor-pointer"
              title="Toggle Theme"
            >
              {theme === 'light' ? <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>
            {isLoggedIn ? (
              <button 
                onClick={() => onNavigate(AppRoute.DASHBOARD)}
                className="px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs sm:text-sm font-bold transition-all shadow-sm hover:shadow cursor-pointer flex items-center gap-1 sm:gap-1.5"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            ) : (
              <>
                <button 
                  onClick={() => onNavigate(AppRoute.LOGIN)}
                  className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => onNavigate(AppRoute.REGISTER)}
                  className="px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs sm:text-sm font-medium transition-all shadow-sm hover:shadow cursor-pointer"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      {isLegalScreen ? (
        <LegalPages activeRoute={activeRoute} onNavigate={onNavigate} />
      ) : (
        <>
      <section className="relative overflow-hidden py-24 lg:py-32 bg-radial from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-7 flex flex-col items-center text-center lg:items-center lg:text-center w-full">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800/80 text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-6 border border-zinc-200/50 dark:border-zinc-700/50"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
              <span>Smarter Living & Financial Optimization</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight sm:leading-none"
            >
              The ultimate central operating system.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-xl leading-relaxed"
            >
              Passwords, budgets, freelancing invoices, expenditures, and critical document expiry trackers — seamlessly unified in a premium, secure workspace.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 flex flex-wrap items-center justify-center gap-4 w-full"
            >
              <button 
                onClick={() => onNavigate(isLoggedIn ? AppRoute.DASHBOARD : AppRoute.REGISTER)}
                className="px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-base font-bold tracking-tight transition-all shadow-md flex items-center gap-2 group cursor-pointer"
              >
                <span>{isLoggedIn ? 'Access Your Dashboard' : 'Deploy Your Workspace'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <a 
                href="#pricing"
                className="px-6 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/40 text-zinc-700 dark:text-zinc-300 text-base font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all inline-block cursor-pointer text-center"
              >
                View Features
              </a>
            </motion.div>
          </div>

          {/* Interactive Bento Frame Widget */}
          <div className="lg:col-span-5 relative w-full h-[380px] lg:h-[450px] flex items-center justify-center">
            <div className="absolute inset-0 bg-zinc-400/10 dark:bg-zinc-100/5 rounded-3xl blur-2xl transform scale-90" />
            
            <div className="relative w-full max-w-md h-full bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xl p-6 overflow-hidden flex flex-col justify-between transition-all duration-300">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <div className="px-3 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-[10px] font-mono text-zinc-500 tracking-wider">
                  SYSTEM_STATUS: OK
                </div>
              </div>

              {/* Bento-grid UI components */}
              <div className="grid grid-cols-2 gap-4 my-auto">
                <div className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 flex flex-col gap-2">
                  <Shield className="w-5 h-5 text-indigo-500" />
                  <div>
                    <div className="text-[10px] text-zinc-400 font-medium">Vault Items</div>
                    <div className="text-lg font-bold text-zinc-800 dark:text-zinc-200">142 Entries</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 flex flex-col gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-500" />
                  <div>
                    <div className="text-[10px] text-zinc-400 font-medium">Revenue</div>
                    <div className="text-lg font-bold text-zinc-800 dark:text-zinc-200">$4,850.00</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 col-span-2 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-amber-500" />
                    <div>
                      <div className="text-[10px] text-zinc-400 font-medium">Passport Expiry</div>
                      <div className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Expires soon (28 days)</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-[9px] font-bold text-amber-700 dark:text-amber-400">ALERT</span>
                </div>
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-950/60 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] text-zinc-500 font-mono">Cloud Ledger Connection Secure via AES-256</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-zinc-900 dark:bg-zinc-950 py-16 text-white border-y border-zinc-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-zinc-50 tracking-tight">{stat.value}</div>
              <div className="text-xs sm:text-sm text-zinc-400 mt-2 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-white dark:bg-zinc-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">All-in-One Integration</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight mt-3">
              One Workspace. Five Master Engines.
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mt-4 leading-relaxed">
              No more subscription fatigue or messy app context-switching. Secura replaces password managers, invoice apps, expense trackers, budgets, and countdown alerts with a unified, fluid dashboard.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div 
                  key={idx}
                  className="p-8 rounded-2xl border-2 border-rose-500/80 dark:border-rose-500/80 bg-white dark:bg-zinc-900/90 shadow-[0_0_15px_rgba(244,63,94,0.15)] dark:shadow-[0_0_20px_rgba(244,63,94,0.25)] hover:border-rose-600 dark:hover:border-rose-400 hover:shadow-[0_0_25px_rgba(244,63,94,0.35)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-6 border border-rose-300 dark:border-rose-800">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">{feat.title}</h3>
                    <p className="text-sm text-zinc-800 dark:text-zinc-100 mt-3 leading-relaxed">{feat.desc}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">{feat.badge}</span>
                    <ArrowRight className="w-4 h-4 text-rose-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Tiers Section */}
      <section id="pricing" className="py-24 bg-zinc-50 dark:bg-zinc-950/80 transition-colors duration-300 border-t border-zinc-100 dark:border-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Free Tier</span>
            <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight mt-3">100% Free, Unlimited Security</h2>
            <p className="text-zinc-600 dark:text-zinc-400 mt-3">No payments, no hidden fees. All premium security, invoicing, and budgeting engines are completely free for everyone.</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="p-8 md:p-12 rounded-3xl border-2 border-zinc-900 dark:border-zinc-50 bg-white dark:bg-zinc-900 shadow-xl flex flex-col md:flex-row gap-8 items-center justify-between">
              <div className="space-y-4 max-w-lg">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/50 dark:border-emerald-900/50 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                  <Check className="w-3.5 h-3.5" />
                  <span>UNLIMITED COGNITIVE SECURITY ENGINE</span>
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Unified Secura Core Account</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Gain unrestricted access to our military-grade AES-256 encrypted password manager, tax-compliant invoicing generator, visual budgets with automated warning notifications, receipt scanners, and critical contract alert tickers.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-600 dark:text-zinc-300 pt-2">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Unlimited Secure Credentials Vault</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Professional Unlimited PDF Invoices</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Gemini AI Receipt Recognition</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Unlimited Expiry Reminder Tickers</span>
                  </div>
                </div>
              </div>
              <div className="text-center shrink-0 w-full md:w-auto p-6 md:p-8 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex flex-col items-center justify-center gap-4">
                <div>
                  <span className="text-5xl font-black text-zinc-900 dark:text-zinc-50">$0</span>
                  <span className="text-zinc-500 text-sm font-medium">/ forever</span>
                </div>
                <button 
                  onClick={() => onNavigate(AppRoute.REGISTER)}
                  className="px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-sm font-bold transition-all shadow-md cursor-pointer w-full"
                >
                  Create Free Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-white dark:bg-zinc-900 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-zinc-500 mt-2">Clear and honest answers to your questions.</p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20">
                <h3 className="font-bold text-zinc-900 dark:text-zinc-50 text-base flex items-center gap-2">
                  <Info className="w-4 h-4 text-zinc-400 shrink-0" />
                  <span>{faq.q}</span>
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-3 leading-relaxed pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* On-Page SEO Deep-Dive Content Section */}
      <section className="py-24 bg-zinc-50 dark:bg-zinc-950/40 border-t border-b border-zinc-200/50 dark:border-zinc-800/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Documentation & Insights</span>
            <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight mt-3">
              Comprehensive Personal Planner & Digital Vault Overview
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-4 leading-relaxed">
              Read how Secura integrates daily financial calculators, document managers, and zero-knowledge storage servers to simplify personal bookkeeping and increase security.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 text-zinc-800 dark:text-zinc-200">
            {/* Column 1 */}
            <div className="space-y-8">
              <div className="p-6 md:p-8 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/40 shadow-sm">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2 mb-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span>Freelancer Invoice Generator & Free Invoice Maker</span>
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  In today's fast-paced digital ecosystem, managing individual finances, tracking freelancer billing schedules, and keeping secure access credentials can easily become overwhelming. Secura solves this by providing a unified, military-grade <strong className="text-zinc-900 dark:text-zinc-50">personal planner</strong> and digital utility suite.
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Our built-in <strong className="text-zinc-900 dark:text-zinc-50">free invoice generator</strong> serves as the <strong className="text-zinc-900 dark:text-zinc-50">best free invoice maker</strong> on the web today. This smart <strong className="text-zinc-900 dark:text-zinc-50">online invoice generator</strong> is designed to save you time and maximize payment transparency. By utilizing our <strong className="text-zinc-900 dark:text-zinc-50">simple invoice generator</strong> templates, you can easily <strong className="text-zinc-900 dark:text-zinc-50">create invoice online free PDF</strong> files that are completely compliant with international tax formats. If you are searching for the <strong className="text-zinc-900 dark:text-zinc-50">invoice generator best</strong> suited for freelancing, Secura is the ultimate <strong className="text-zinc-900 dark:text-zinc-50">freelancer invoice generator</strong>. Our advanced <strong className="text-zinc-900 dark:text-zinc-50">free invoice maker app</strong> and premium <strong className="text-zinc-900 dark:text-zinc-50">invoice generator software</strong> allow you to print invoices with one click. It remains the <strong className="text-zinc-900 dark:text-zinc-50">best invoice app free</strong> of charge, allowing everyone to <strong className="text-zinc-900 dark:text-zinc-50">create invoice online free</strong>.
                </p>
              </div>

              <div className="p-6 md:p-8 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/40 shadow-sm">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2 mb-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Personal Budget Planner & Free Money Manager App</span>
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  Planning for your financial future requires real precision. Secura acts as an advanced <strong className="text-zinc-900 dark:text-zinc-50">free personal budget planner</strong> helping thousands of families regulate their monthly spending. Our <strong className="text-zinc-900 dark:text-zinc-50">budget planner free</strong> online calculator helps you map out category thresholds to protect you from unexpected debts.
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  As the ultimate <strong className="text-zinc-900 dark:text-zinc-50">budget planner app free</strong> of cost, you can configure limits for rent, groceries, or travel. With our high-fidelity <strong className="text-zinc-900 dark:text-zinc-50">budget planner online</strong> system, you can easily export custom files, including <strong className="text-zinc-900 dark:text-zinc-50">budget planner PDF</strong> and <strong className="text-zinc-900 dark:text-zinc-50">budget planner printable</strong> tables. Secura functions as a premium <strong className="text-zinc-900 dark:text-zinc-50">Money Manager expense & budget app</strong> and we provide the <strong className="text-zinc-900 dark:text-zinc-50">best budget app free</strong> options. Optimize your habits with this elite <strong className="text-zinc-900 dark:text-zinc-50">budget planner app</strong>, also integrating elements of our <strong className="text-zinc-900 dark:text-zinc-50">free Money Manager app</strong>, which is accessible instantly. There is no need for a complex <strong className="text-zinc-900 dark:text-zinc-50">Money manager expense & budget app free download</strong> process; our cloud-synced web dashboard is ready. We support mobile setups with the <strong className="text-zinc-900 dark:text-zinc-50">Money manager expense & budget app for android</strong> specifications.
                </p>
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-8">
              <div className="p-6 md:p-8 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/40 shadow-sm">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2 mb-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span>Expensive Tracker & AI Receipt Ledger System</span>
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  Tracking daily outlays is critical to achieving financial freedom. Secura is equipped with a modern, AI-enhanced <strong className="text-zinc-900 dark:text-zinc-50">expensive tracker</strong> and ledger system that organizes every single transaction.
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  If you need a <strong className="text-zinc-900 dark:text-zinc-50">free expensive ledge</strong> that is easy to navigate, our <strong className="text-zinc-900 dark:text-zinc-50">expense tracker online free</strong> tool provides real-time transaction updates. You can also monitor with our desktop <strong className="text-zinc-900 dark:text-zinc-50">expense tracker online</strong>, categorize receipts, compute tax write-offs, or access our pre-formatted <strong className="text-zinc-900 dark:text-zinc-50">expense tracker template</strong>. Log with our premium <strong className="text-zinc-900 dark:text-zinc-50">expense tracker app</strong>, or try the smart <strong className="text-zinc-900 dark:text-zinc-50">expense tracker AI</strong> scanning. For quick logging on mobile, the <strong className="text-zinc-900 dark:text-zinc-50">expense tracker online free app</strong> and the <strong className="text-zinc-900 dark:text-zinc-50">personal expense tracker app free</strong> help you log daily spending patterns, functioning as a high-powered <strong className="text-zinc-900 dark:text-zinc-50">money tracker app</strong> and <strong className="text-zinc-900 dark:text-zinc-50">money tracker-expense & budget</strong> assistant. Our <strong className="text-zinc-900 dark:text-zinc-50">monthly expense tracker online free</strong> helps you audit your financial health, and we are proud to offer the <strong className="text-zinc-900 dark:text-zinc-50">personal expense tracker website free</strong> as well as the <strong className="text-zinc-900 dark:text-zinc-50">best personal expense tracker app free</strong>.
                </p>
              </div>

              <div className="p-6 md:p-8 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/40 shadow-sm">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2 mb-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>Automated Expiry Reminder App & Online Alerts</span>
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  We have all faced the stress of realizing a passport, driver's license, visa, or insurance policy has expired at the worst possible moment. Secura resolves this issue with our advanced <strong className="text-zinc-900 dark:text-zinc-50">expiry reminder</strong> and <strong className="text-zinc-900 dark:text-zinc-50">documents expiry reminder</strong> engine.
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Our <strong className="text-zinc-900 dark:text-zinc-50">expiry reminder online</strong> checking utility lets you log critical items, tracking deadlines automatically. Our <strong className="text-zinc-900 dark:text-zinc-50">document expiry reminder app</strong> is incredibly simple to navigate. Once you complete your <strong className="text-zinc-900 dark:text-zinc-50">expiration reminder login</strong>, you can set custom alert warning thresholds. We provide the best <strong className="text-zinc-900 dark:text-zinc-50">free expiration reminder software</strong>, which also doubles as a <strong className="text-zinc-900 dark:text-zinc-50">food expiry reminder app</strong>. Get started with our <strong className="text-zinc-900 dark:text-zinc-50">expiry reminder online check</strong> or utilize our <strong className="text-zinc-900 dark:text-zinc-50">expiry reminder online free</strong> panel. With our cloud-synced <strong className="text-zinc-900 dark:text-zinc-50">expiry reminder online app</strong> and downloadable <strong className="text-zinc-900 dark:text-zinc-50">expiry tracker excel</strong> formats, you will never pay late penalties or suffer from unexpected expirations again.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="bg-zinc-900 dark:bg-zinc-950 py-20 text-white relative overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0 bg-radial from-indigo-500/10 via-transparent to-transparent opacity-60" />
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-50 tracking-tight">
            Take total control of your digital life today.
          </h2>
          <p className="text-zinc-400 mt-4 max-w-xl mx-auto text-base">
            Join thousands of professional freelancers and individuals who optimize their operations securely using Secura.
          </p>
          <div className="mt-8 flex justify-center">
            <button 
              onClick={() => onNavigate(AppRoute.REGISTER)}
              className="px-8 py-4 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 text-base font-semibold tracking-tight transition-all shadow-md cursor-pointer"
            >
              Get Started Instantly
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-950 text-zinc-300 pt-16 pb-12 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow">
                <span className="font-black text-zinc-950 text-sm">S</span>
              </div>
              <span className="font-bold text-white text-lg tracking-tight">Secura</span>
            </div>
            <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
              Decentralized workspace securing credentials, personal invoice ledger tracking, smart budgeting warnings, and expiring document tickers.
            </p>
            {/* Quick footer theme switcher */}
            <div className="flex items-center gap-2 pt-2">
              <span className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider">Appearance:</span>
              <button 
                onClick={onToggleTheme}
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 font-bold hover:text-white transition-all cursor-pointer"
              >
                {theme === 'light' ? (
                  <>
                    <Moon className="w-3.5 h-3.5 text-zinc-400 animate-pulse" />
                    <span>Dark Theme</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-3.5 h-3.5 text-yellow-500" />
                    <span>Light Theme</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Nav Col */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-zinc-400 tracking-wider font-mono">Platform</h4>
            <ul className="space-y-2.5 text-xs font-semibold text-zinc-400">
              <li><a href="#features" className="hover:text-white transition-colors">Key Features</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Free Plan</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Common FAQ</a></li>
            </ul>
          </div>

          {/* Info Col */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-zinc-400 tracking-wider font-mono">Company</h4>
            <ul className="space-y-2.5 text-xs font-semibold text-zinc-400 font-sans">
              <li>
                <button onClick={() => { onNavigate(AppRoute.ABOUT_US); window.scrollTo({ top: 0, behavior: 'instant' }); }} className="hover:text-white transition-colors cursor-pointer text-left">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => { onNavigate(AppRoute.CONTACT_US); window.scrollTo({ top: 0, behavior: 'instant' }); }} className="hover:text-white transition-colors cursor-pointer text-left">
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Policies Col */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-zinc-400 tracking-wider font-mono">Legal Policies</h4>
            <ul className="space-y-2.5 text-xs font-semibold text-zinc-400 font-sans">
              <li>
                <button onClick={() => { onNavigate(AppRoute.TERMS); window.scrollTo({ top: 0, behavior: 'instant' }); }} className="hover:text-white transition-colors cursor-pointer text-left font-sans">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => { onNavigate(AppRoute.PRIVACY); window.scrollTo({ top: 0, behavior: 'instant' }); }} className="hover:text-white transition-colors cursor-pointer text-left font-sans">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => { onNavigate(AppRoute.REFUND); window.scrollTo({ top: 0, behavior: 'instant' }); }} className="hover:text-white transition-colors cursor-pointer text-left font-sans">
                  Refund Policy
                </button>
              </li>
              <li>
                <button onClick={() => { onNavigate(AppRoute.DISCLAIMER); window.scrollTo({ top: 0, behavior: 'instant' }); }} className="hover:text-white transition-colors cursor-pointer text-left font-sans">
                  Disclaimer Notice
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="max-w-7xl mx-auto px-6 border-t border-zinc-900 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>
            &copy; 2026 Secura Inc. All rights reserved. Encrypted with military grade AES-256.
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>SECURE CRYPTO ENDPOINT ACTIVE</span>
          </div>
        </div>
      </footer>
      </>
      )}
    </div>
  );
}
