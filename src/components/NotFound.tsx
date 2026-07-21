import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldAlert, ArrowLeft, Home, HelpCircle, Compass, LayoutGrid, Shield, 
  CreditCard, PieChart, Clock, Calendar, ChevronRight, Mail, BookOpen
} from 'lucide-react';
import { AppRoute } from '../types.js';

interface NotFoundProps {
  isLoggedIn: boolean;
  onNavigate: (route: AppRoute) => void;
  onGoBackHome: () => void;
}

export default function NotFound({ isLoggedIn, onNavigate, onGoBackHome }: NotFoundProps) {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  // Suggest different helpful pages based on auth status
  const suggestions = isLoggedIn 
    ? [
        { route: AppRoute.DASHBOARD, label: 'Dashboard Overview', icon: LayoutGrid, desc: 'Central stats & reports' },
        { route: AppRoute.PASSWORD_MANAGER, label: 'Credentials Vault', icon: Shield, desc: 'Secure decrypted logins' },
        { route: AppRoute.INVOICE_GENERATOR, label: 'Invoices Generator', icon: CreditCard, desc: 'Tax-ready billing sheets' },
        { route: AppRoute.BUDGET_PLANNER, label: 'Budget Planner', icon: PieChart, desc: 'Expense warning thresholds' },
        { route: AppRoute.EXPENSE_TRACKER, label: 'Expense Ledger', icon: Clock, desc: 'Receipts & payment logs' },
        { route: AppRoute.EXPIRY_REMINDER, label: 'Expiry Alerts', icon: Calendar, desc: 'Timeline alert triggers' }
      ]
    : [
        { route: AppRoute.LANDING, label: 'Home Page', icon: Home, desc: 'Return to Secura main page' },
        { route: AppRoute.LOGIN, label: 'Secure Login', icon: Shield, desc: 'Sign in to your private vault' },
        { route: AppRoute.REGISTER, label: 'Create Account', icon: Compass, desc: 'Register for military-grade protection' },
        { route: AppRoute.ABOUT_US, label: 'About Secura', icon: BookOpen, desc: 'Our mission and security values' },
        { route: AppRoute.CONTACT_US, label: 'Help Desk / Support', icon: Mail, desc: 'Get in touch with our team' },
        { route: AppRoute.HELP, label: 'FAQs & Help', icon: HelpCircle, desc: 'Security protocols explained' }
      ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col justify-between transition-colors duration-300 relative overflow-hidden font-sans">
      
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-zinc-400/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md z-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onGoBackHome}>
            <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center shadow-md">
              <span className="font-bold text-white dark:text-zinc-950 text-sm">S</span>
            </div>
            <span className="font-bold text-zinc-900 dark:text-zinc-50 text-lg tracking-tight">Secura</span>
          </div>

          <div className="text-xs text-zinc-400 dark:text-zinc-500 font-mono tracking-tight hidden sm:block">
            STATUS: <span className="text-red-500 font-bold">404_PAGE_NOT_FOUND</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 md:py-20 flex flex-col items-center justify-center z-10 text-center">
        
        {/* Animated Error Illustration */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="relative mb-8"
        >
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 flex items-center justify-center shadow-lg mx-auto relative group">
            <ShieldAlert className="w-12 h-12 md:w-16 md:h-16 text-red-500 dark:text-red-400 animate-pulse" />
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
              className="absolute -inset-1 border border-dashed border-red-500/30 dark:border-red-400/20 rounded-3xl pointer-events-none"
            />
          </div>
          
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-red-500 text-[10px] font-extrabold tracking-wider text-white uppercase shadow-sm">
            ERROR_404
          </span>
        </motion.div>

        {/* Text Headers */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="space-y-4 max-w-xl"
        >
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 font-sans">
            Oops! Page Not Found
          </h1>
          
          <h2 className="text-lg md:text-xl font-semibold text-zinc-700 dark:text-zinc-300 font-sans leading-relaxed">
            صفحہ دستیاب نہیں ہے
          </h2>

          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            The URL you entered might be incorrect, or the page has been moved. 
            آپ کا درج کردہ لنک درست نہیں ہے یا یہ صفحہ ہٹا دیا گیا ہے۔
          </p>
        </motion.div>

        {/* Core Quick Navigation Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex flex-col sm:flex-row items-center gap-4 mt-8 w-full max-w-md justify-center"
        >
          <button
            onClick={() => {
              if (window.history.length > 1) {
                window.history.back();
              } else {
                onGoBackHome();
              }
            }}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-sm font-bold text-zinc-700 dark:text-zinc-300 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back / پیچھے جائیں</span>
          </button>

          <button
            onClick={onGoBackHome}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-sm font-bold text-white dark:text-zinc-950 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Go to Home Page</span>
          </button>
        </motion.div>

        {/* Suggested Helpful Pages / Destination Modules */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-12 md:mt-16 w-full max-w-2xl text-left border-t border-zinc-200/60 dark:border-zinc-800/60 pt-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Compass className="w-4 h-4 text-zinc-400" />
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
              Popular & Correct Destinations / مقبول صفحات
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {suggestions.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => onNavigate(item.route)}
                  onMouseEnter={() => setHoveredLink(item.route)}
                  onMouseLeave={() => setHoveredLink(null)}
                  className="p-3.5 rounded-2xl border border-zinc-100 dark:border-zinc-900/50 bg-white dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-left transition-all flex items-center justify-between group cursor-pointer shadow-xs hover:border-zinc-300 dark:hover:border-zinc-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                        {item.label}
                      </h4>
                      <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                  <ChevronRight 
                    className={`w-4 h-4 text-zinc-300 group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-transform ${
                      hoveredLink === item.route ? 'translate-x-1' : ''
                    }`} 
                  />
                </button>
              );
            })}
          </div>
        </motion.div>

      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-zinc-100 dark:border-zinc-800/50 text-center text-[10px] text-zinc-400 font-mono flex flex-col sm:flex-row items-center justify-between px-8 gap-4 z-10 transition-colors duration-300">
        <div>
          &copy; 2026 Secura. Military-grade secure vault.
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate(AppRoute.PRIVACY)} className="hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer">Privacy Policy</button>
          <span>&bull;</span>
          <button onClick={() => onNavigate(AppRoute.TERMS)} className="hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer">Terms of Service</button>
        </div>
      </footer>

    </div>
  );
}
