/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Shield, Mail, FileText, CheckCircle, ArrowLeft, Info, 
  HelpCircle, Send, MessageSquare, AlertTriangle, CreditCard, 
  Building, MapPin, Phone, Globe, User, ExternalLink
} from 'lucide-react';
import { AppRoute } from '../types.js';

interface LegalPagesProps {
  activeRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
}

export default function LegalPages({ activeRoute, onNavigate }: LegalPagesProps) {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('Support');
  const [contactMessage, setContactMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setContactName('');
      setContactEmail('');
      setContactMessage('');
    }, 4000);
  };

  const getPageConfig = () => {
    switch (activeRoute) {
      case AppRoute.ABOUT_US:
        return {
          title: 'About Secura',
          subtitle: 'The mission to establish the world\'s most integrated, private, and powerful cognitive dashboard.',
          icon: <Building className="w-8 h-8 text-indigo-500" />
        };
      case AppRoute.TERMS:
        return {
          title: 'Terms & Conditions',
          subtitle: 'Operational protocols, user responsibilities, and legally binding agreements.',
          icon: <FileText className="w-8 h-8 text-indigo-500" />
        };
      case AppRoute.CONTACT_US:
        return {
          title: 'Contact Secura Support',
          subtitle: 'Get in touch with our security compliance and engineering helpdesks.',
          icon: <Mail className="w-8 h-8 text-indigo-500" />
        };
      case AppRoute.DISCLAIMER:
        return {
          title: 'Legal Disclaimer',
          subtitle: 'Limitation of liability, operational simulations, and service boundaries.',
          icon: <AlertTriangle className="w-8 h-8 text-rose-500" />
        };
      case AppRoute.PRIVACY:
        return {
          title: 'Privacy Policy',
          subtitle: 'Zero-Knowledge operations, metadata minimization, and encrypted storage keys.',
          icon: <Shield className="w-8 h-8 text-emerald-500" />
        };
      case AppRoute.REFUND:
        return {
          title: 'Refund & Subscription Policy',
          subtitle: 'Transparent return rules, billing cycles, and customer satisfaction agreements.',
          icon: <CreditCard className="w-8 h-8 text-amber-500" />
        };
      default:
        return {
          title: 'Information Portal',
          subtitle: 'Authorized Secura documentation guidelines.',
          icon: <Info className="w-8 h-8 text-zinc-500" />
        };
    }
  };

  const config = getPageConfig();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100 font-sans transition-colors duration-300">
      
      {/* Page Header */}
      <div className="relative overflow-hidden bg-white dark:bg-zinc-900 border-b border-zinc-200/80 dark:border-zinc-800/80 py-16 md:py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-50/20 to-zinc-100/10 dark:from-zinc-950/20 dark:to-zinc-900/10"></div>
        
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <button 
            onClick={() => onNavigate(AppRoute.LANDING)}
            className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors mb-6 uppercase tracking-wider font-mono cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Workspace Home</span>
          </button>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-5 mt-2">
            <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/60 dark:border-zinc-700/60 shadow-sm shrink-0">
              {config.icon}
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                {config.title}
              </h1>
              <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 mt-1.5 max-w-3xl leading-relaxed">
                {config.subtitle}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* Main Document Body */}
          <div className="lg:col-span-8 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm p-8 md:p-10 transition-colors">
            
            {activeRoute === AppRoute.ABOUT_US && (
              <div className="space-y-6 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                <p className="text-base font-medium text-zinc-900 dark:text-zinc-100">
                  Secura is an architectural response to the rising complexity of digital survival.
                </p>
                <p>
                  Today, we use dozens of distinct web tools to manage essential facets of our daily operations—passwords, customer invoicing, expenditure streams, budget limits, and contract renewals. This tool-sprawl causes visual friction, high licensing costs, and unsafe credential leaks.
                </p>
                <p>
                  Secura unifies these key features into a single, cohesive, zero-knowledge workspace. By pairing client-side military-grade AES-256 local hashing models with backend synchronization, we guarantee that your passwords, finances, and invoices remain completely yours, yet instantly accessible on all of your devices.
                </p>

                <div className="border-t border-zinc-100 dark:border-zinc-800 pt-6 mt-6">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-3 tracking-tight">Our Strategic Vision</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                      <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-xs uppercase tracking-wider font-mono">1. Absolute Zero-Trust</h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">We utilize advanced server-side PBKDF2 hashing techniques so that your master system passphrase is never transmitted or compromised.</p>
                    </div>
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                      <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-xs uppercase tracking-wider font-mono">2. Cognitive Efficiency</h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Every interface is engineered to load in milliseconds, eliminating cognitive fatigue and improving task speed.</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-zinc-100 dark:border-zinc-800 pt-6">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-3 tracking-tight">Meet the Secura Lab</h3>
                  <p className="mb-4">
                    Secura was built by an independent consortium of cybersecurity engineers, visual minimalists, and developers committed to personal information autonomy.
                  </p>
                  <p>
                    For inquiries, partnerships, or enterprise integrations, please visit our helpdesk or submit a priority inquiry via our Contact form.
                  </p>
                </div>
              </div>
            )}

            {activeRoute === AppRoute.TERMS && (
              <div className="space-y-6 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                <p className="text-xs font-mono font-bold text-zinc-400">LAST REVISED: JULY 20, 2026</p>
                
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-2">1. Operating Agreement</h3>
                  <p>
                    By activating a Secura account ("Workspace"), you agree to follow these Terms & Conditions. If you do not accept these conditions in full, you are prohibited from utilizing our dashboard tools, API nodes, and storage backends.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-2">2. Master Credentials Safeguard</h3>
                  <p>
                    Secura operates a Zero-Knowledge local storage protocol. We do not store, copy, or maintain copies of your password manager master passphrase. You are completely and solely responsible for maintaining the absolute confidentiality of your master authorization keys. Lost master passphrases cannot be retrieved by our engineering team.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-2">3. Commercial Use & Invoicing Protocols</h3>
                  <p>
                    Secura's Invoice Generator provides standardized layouts for billing. You represent and warrant that all invoicing metadata (including sales taxes, company registration details, and bank routing instructions) conforms strictly with your local tax jurisdiction and corporate laws. Secura assumes zero liability for audit complications arising from incorrect invoices.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-2">4. Service Uptime Limits</h3>
                  <p>
                    Secura offers its workspace tools on an "as-is" and "as-available" basis. While we strive to maintain a 99.9% network API uptime, we do not guarantee continuous, uninterrupted access to cloud storage nodes or Google Calendar integrations.
                  </p>
                </div>
              </div>
            )}

            {activeRoute === AppRoute.CONTACT_US && (
              <div className="space-y-6">
                {submitted ? (
                  <div className="p-8 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/60 rounded-3xl text-center space-y-3">
                    <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
                    <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-400">Operational Log Dispatched</h3>
                    <p className="text-sm text-emerald-600 dark:text-emerald-500/90 max-w-md mx-auto">
                      Thank you for contacting Secura. Your technical support ticket has been encrypted and queued. An operations engineer will review and respond within 12-24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-5">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Submit a direct support log or compliance request below. All incoming signals are routed to our live engineering team.
                    </p>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-mono">Full Name</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400">
                            <User className="w-4 h-4" />
                          </span>
                          <input 
                            type="text" 
                            required
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            placeholder="John Doe"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 transition-all placeholder-zinc-400"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-mono">Secure Email</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400">
                            <Mail className="w-4 h-4" />
                          </span>
                          <input 
                            type="email" 
                            required
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            placeholder="you@domain.com"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 transition-all placeholder-zinc-400"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-mono">Ticket Classification</label>
                      <select 
                        value={contactSubject}
                        onChange={(e) => setContactSubject(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 transition-all"
                      >
                        <option value="Support">Engineering & Bug Reports</option>
                        <option value="Security">Security & Encrypted Data Compliance</option>
                        <option value="Billing">Billing & Subscription Changes</option>
                        <option value="Partnership">Partnership or Custom Node Requests</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-mono">Detailed Request</label>
                      <textarea 
                        required
                        rows={6}
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="Please detail your request or technical issue..."
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 transition-all placeholder-zinc-400"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-bold text-sm tracking-tight transition-all flex items-center justify-center gap-2 cursor-pointer shadow"
                    >
                      <Send className="w-4 h-4" />
                      <span>Transmit Priority Ticket</span>
                    </button>
                  </form>
                )}
              </div>
            )}

            {activeRoute === AppRoute.DISCLAIMER && (
              <div className="space-y-6 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/60 rounded-2xl flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-rose-700 dark:text-rose-400 font-medium">
                    This document limits our liability and defines the boundaries of our operational tools. Please read carefully.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-2">1. No Financial or Investment Advice</h3>
                  <p>
                    The Budget Planner and Expense Tracker tools are intended for personal structural tracking. They do not calculate tax liabilities, predict financial markets, or serve as authorized investment advisory channels. Any visual charts are strictly illustrative.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-2">2. Local Data Synchronization</h3>
                  <p>
                    Secura implements an asynchronous local database model sync to Firebase Firestore. We are not responsible for direct data discrepancies or sync delays due to bad user internet connections, browser local cache overrides, or local device format triggers.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-2">3. Accuracy of Invoice Calculators</h3>
                  <p>
                    While we test our invoice generators against strict double-entry ledger algorithms, you must manually audit generated invoices to ensure all tax configurations, currency multipliers, and billing statements are legally compliant. Secura does not certify that invoice PDFs conform to legal requirements.
                  </p>
                </div>
              </div>
            )}

            {activeRoute === AppRoute.PRIVACY && (
              <div className="space-y-6 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                <p className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">Zero-Trust Architecture Standard Active</p>
                
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-2">1. Absolute Local-First Encryption</h3>
                  <p>
                    Your passwords, secure card details, and personal notes are hashed locally inside your browser cache before they are synchronized with our Firebase cloud database. Secura engineers and third-party hosting partners do not possess access to your local private encryption keys.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-2">2. Information Collection & Utilization</h3>
                  <p>
                    To run our unified engines, we collect and store minimum user account details: your registered full name, encrypted email address, mobile number (used for emergency auth tokens), and workspace settings. This data is strictly used to run the platform.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-2">3. Zero Tracker Policy</h3>
                  <p>
                    We do not deploy marketing trackers, invasive ad pixels, or behavioral cookies. Your workspace is an intimate productivity zone. We only place technical authentication sessions required to keep your portal active.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-2">4. User Rights</h3>
                  <p>
                    You retain full ownership over your operational data. You can delete individual credentials, reset entire ledgers, or completely terminate and scrub your Secura account from our database nodes instantly via your account Control Center.
                  </p>
                </div>
              </div>
            )}

            {activeRoute === AppRoute.REFUND && (
              <div className="space-y-6 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-2">1. 30-Day Money-Back Guarantee</h3>
                  <p>
                    If you upgrade your Secura account to our Premium workspace tier, you are backed by our 30-day money-back guarantee. If you are unsatisfied with our five unified engines, you can submit a billing support ticket within 30 days of the charge to receive a full refund, no questions asked.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-2">2. Billing & Cycles</h3>
                  <p>
                    Subscription cycles are billed either monthly or annually, based on your selection during the checkout flow. All billing events are fully transparent, with downloadable PDF invoices generated directly inside your secure Billing settings.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-2">3. Direct Termination</h3>
                  <p>
                    You can cancel your Premium subscription tier at any time. Upon termination, your account will remain Premium until the end of the current billing cycle, at which point it will gracefully revert to our Free operational account tier without data loss.
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* Right Sidebar - Sticky Contact Details */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Navigation Card */}
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm transition-colors">
              <h3 className="font-extrabold text-zinc-900 dark:text-zinc-50 text-sm tracking-tight mb-4 uppercase tracking-wider font-mono">
                Legal Portal
              </h3>
              <div className="space-y-1 text-xs">
                {[
                  { route: AppRoute.ABOUT_US, label: 'About Us' },
                  { route: AppRoute.TERMS, label: 'Terms & Conditions' },
                  { route: AppRoute.CONTACT_US, label: 'Contact Us' },
                  { route: AppRoute.DISCLAIMER, label: 'Disclaimer' },
                  { route: AppRoute.PRIVACY, label: 'Privacy Policy' },
                  { route: AppRoute.REFUND, label: 'Refund Policy' },
                ].map((item) => (
                  <button
                    key={item.route}
                    onClick={() => onNavigate(item.route)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl font-bold transition-all flex items-center justify-between cursor-pointer ${
                      activeRoute === item.route
                        ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950'
                        : 'text-zinc-500 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 hover:text-zinc-950 dark:hover:text-zinc-100'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                  </button>
                ))}
              </div>
            </div>

            {/* Support Details Card */}
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm transition-colors text-xs space-y-4">
              <h3 className="font-extrabold text-zinc-900 dark:text-zinc-50 text-sm tracking-tight uppercase tracking-wider font-mono">
                Support Channels
              </h3>
              <div className="space-y-3 font-mono text-zinc-500 dark:text-zinc-400">
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-zinc-400 shrink-0" />
                  <span>San Francisco, CA</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-zinc-400 shrink-0" />
                  <span>ops@secura.io</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-zinc-400 shrink-0" />
                  <span>https://secura.io</span>
                </div>
              </div>
              <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 text-[10px] leading-relaxed text-zinc-400 font-mono">
                Secura is fully GDPR, CCPA, and SOC2 compliant. All customer tickets are handled by human operational support staff.
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
