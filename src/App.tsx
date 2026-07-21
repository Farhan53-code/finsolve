/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Shield, CreditCard, PieChart, Clock, Calendar, LogOut, Sun, Moon, Sparkles, User, HelpCircle, Activity, LayoutGrid, X, Command, ChevronDown, Menu
} from 'lucide-react';
import { AppRoute, User as UserType } from './types.js';

// Modular Workspace Imports
import LandingPage from './components/LandingPage.js';
import Auth from './components/Auth.js';
import Dashboard from './components/Dashboard.js';
import PasswordManager from './components/PasswordManager.js';
import InvoiceGenerator from './components/InvoiceGenerator.js';
import BudgetPlanner from './components/BudgetPlanner.js';
import ExpenseTracker from './components/ExpenseTracker.js';
import ExpiryReminder from './components/ExpiryReminder.js';
import AdminPanel from './components/AdminPanel.js';
import LegalPages from './components/LegalPages.js';
import NotFound from './components/NotFound.js';

export default function App() {
  const [activeRoute, setActiveRoute] = useState<AppRoute>(AppRoute.LANDING);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isNotFound, setIsNotFound] = useState(false);
  
  // Shortcuts panel state
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Auto-close header dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (menuOpen && !target.closest('.menu-dropdown-container')) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [menuOpen]);

  // Helper to map pathname to route
  const getRouteFromPath = (path: string): { route: AppRoute | null; isNotFound: boolean } => {
    const cleanPath = path.replace(/^\/|\/$/g, ''); // strip leading/trailing slashes
    if (cleanPath === '') {
      return { route: AppRoute.LANDING, isNotFound: false };
    }
    const matchedRoute = Object.values(AppRoute).find(r => r === cleanPath);
    if (matchedRoute) {
      return { route: matchedRoute, isNotFound: false };
    }
    return { route: null, isNotFound: true };
  };

  // Initialize Auth & Theme sessions
  useEffect(() => {
    const savedToken = localStorage.getItem('secura_token');
    const savedUser = localStorage.getItem('secura_user');
    const savedTheme = localStorage.getItem('secura_theme') as 'light' | 'dark';

    let initialRoute = AppRoute.LANDING;
    let notFoundDetected = false;

    // Parse the initial pathname from URL deep link
    const { route, isNotFound: pathNotFound } = getRouteFromPath(window.location.pathname);
    if (pathNotFound) {
      notFoundDetected = true;
    } else if (route) {
      initialRoute = route;
    }

    if (savedToken && savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setToken(savedToken);
      setUser(parsedUser);
      
      if (notFoundDetected) {
        setIsNotFound(true);
      } else {
        // If logged in but initialRoute is landing/auth, default to DASHBOARD
        if ([AppRoute.LANDING, AppRoute.LOGIN, AppRoute.REGISTER, AppRoute.FORGOT_PASSWORD, AppRoute.RESET_PASSWORD].includes(initialRoute)) {
          setActiveRoute(AppRoute.DASHBOARD);
          window.history.replaceState(null, '', '/' + AppRoute.DASHBOARD);
        } else {
          setActiveRoute(initialRoute);
          window.history.replaceState(null, '', '/' + initialRoute);
        }
      }
    } else {
      if (notFoundDetected) {
        setIsNotFound(true);
      } else {
        // If not logged in, only allow landing, auth or legal routes
        const isAllowedOffline = [
          AppRoute.LANDING, AppRoute.LOGIN, AppRoute.REGISTER, AppRoute.FORGOT_PASSWORD, AppRoute.RESET_PASSWORD,
          AppRoute.ABOUT_US, AppRoute.TERMS, AppRoute.CONTACT_US, AppRoute.DISCLAIMER, AppRoute.PRIVACY, AppRoute.REFUND
        ].includes(initialRoute);

        if (isAllowedOffline) {
          setActiveRoute(initialRoute);
          window.history.replaceState(null, '', initialRoute === AppRoute.LANDING ? '/' : '/' + initialRoute);
        } else {
          setActiveRoute(AppRoute.LANDING);
          window.history.replaceState(null, '', '/');
        }
      }
    }

    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      // default light
      setTheme('light');
      localStorage.setItem('secura_theme', 'light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Listen for browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const { route, isNotFound: pathNotFound } = getRouteFromPath(window.location.pathname);
      if (pathNotFound) {
        setIsNotFound(true);
      } else if (route) {
        setIsNotFound(false);
        const currentToken = localStorage.getItem('secura_token');
        if (!currentToken && ![
          AppRoute.LANDING, AppRoute.LOGIN, AppRoute.REGISTER, AppRoute.FORGOT_PASSWORD, AppRoute.RESET_PASSWORD,
          AppRoute.ABOUT_US, AppRoute.TERMS, AppRoute.CONTACT_US, AppRoute.DISCLAIMER, AppRoute.PRIVACY, AppRoute.REFUND
        ].includes(route)) {
          setActiveRoute(AppRoute.LANDING);
        } else {
          setActiveRoute(route);
        }
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [token]);

  // Dynamically update document title & meta tags for perfect On-Page SEO
  useEffect(() => {
    let title = "Secura | Free Personal Planner, Invoice Generator & Budget Tracker";
    let desc = "Optimize your life with Secura. Use our free invoice generator, personal planner, secure budget planner app, and documents expiry reminder tool in one military-grade vault.";
    let keywords = "invoice generator, free invoice generator, budget planner, free budget planner, expensive tracker, free expensive ledge, expiry reminder, documents expiry reminder, personal planner, free personal budget planner, Secura";
    let ogTitle = "Secura | Free Personal Planner & Secure Vault";
    let ogDesc = "Manage your passwords, budgets, freelancer invoice sheets, expenses, and expirations in a single, secure zero-knowledge environment.";

    if (isNotFound) {
      title = "404 - Page Not Found | Secura";
      desc = "Page not found. The URL you entered might be incorrect, or the page has been moved on Secura.";
    } else {
      switch (activeRoute) {
        case AppRoute.LANDING:
          title = "Secura | Free Personal Planner, Invoice Generator & Budget Tracker";
          desc = "Optimize your personal and freelance workflow with Secura. Access our free invoice generator, free budget planner, expense tracker, and documents expiry reminders in one military-grade vault.";
          keywords = "invoice generator, free invoice generator, budget planner, free budget planner, expensive tracker, free expensive ledge, expiry reminder, documents expiry reminder, personal planner, free personal budget planner, Secura";
          ogTitle = "Secura | Free Personal Planner, Invoice Generator & Budget Tracker";
          ogDesc = "Access military-grade password safety, simple invoice maker tools, free budget templates, and expiry trackers in a unified dashboard.";
          break;
        case AppRoute.INVOICE_GENERATOR:
          title = "Free Invoice Generator & PDF Maker | Secura Invoice Creator";
          desc = "Best free invoice maker and freelancer invoice generator software. Create invoice online free PDF documents in seconds using our simple invoice generator.";
          keywords = "invoice generator, free invoice generator, simple invoice generator, online invoice generator, freelancer invoice generator, Best free invoice maker, Invoice generator best, Create invoice online free PDF, Best invoice app free, Create invoice online free, Invoice generator software, Free invoice maker app, Secura";
          ogTitle = "Free Invoice Generator & Simple Invoice Maker | Secura";
          ogDesc = "Create invoice online free PDF files. Use the best free invoice maker and freelancer invoice generator software. Simple, fast, tax-compliant.";
          break;
        case AppRoute.BUDGET_PLANNER:
          title = "Free Budget Planner Online & Smart Personal Planner | Secura";
          desc = "Download the best budget app free of cost. Our free budget planner online helps you manage family budgets with PDF and printable export options.";
          keywords = "budget planner, free budget planner, personal planner, free personal budget planner, Budget planner free, Budget planner online, Budget planner PDF, Budget planner Printable, Budget planner app, Best budget app free, Budget planner app free, Money Manager expense & budget app, Money Manager expense tracker, Free Money Manager app, Money manager expense & budget app for android, Money manager expense & budget app free download, Secura";
          ogTitle = "Free Budget Planner & Personal Planner App | Secura";
          ogDesc = "Track expenditures with the best budget app free. Printable, PDF, online budgeting with smart warning thresholds.";
          break;
        case AppRoute.EXPENSE_TRACKER:
          title = "Expense Tracker Online Free & AI Receipt Ledger | Secura";
          desc = "Manage payments with our expense tracker online free. Use our AI expense tracker app, template, and personal expense tracker website free to log receipts.";
          keywords = "expensive tracker, free expensive ledge, Expense tracker online free, Expense tracker online, Expense tracker AI, Expense tracker app, Expense tracker template, Expense tracker online free app, Personal expense tracker app free, Money tracker app, Money tracker-expense & budget, Monthly expense tracker online free, Personal expense tracker website free, Best personal expense tracker app free, Secura";
          ogTitle = "Expense Tracker Online & AI Receipt Ledger | Secura";
          ogDesc = "Optimize your spendings with the best expense tracker online free app. Log, trace, and categorize receipts with Gemini AI instantly.";
          break;
        case AppRoute.EXPIRY_REMINDER:
          title = "Document Expiry Reminder App & Online Alerts | Secura";
          desc = "Best document expiry reminder app & expiry reminder online check tool. Get expiration reminder software alerts for visas, passports, food, or contracts.";
          keywords = "expiry reminder, documents expiry reminder, Expiry reminder online, Document expiry reminder app, Free expiration Reminder software, Expiration Reminder login, Food expiry reminder app, Expiry reminder online check, Expiry reminder online free, Expiry reminder online app, Expiry tracker excel, Secura";
          ogTitle = "Document Expiry Reminder App & Tracker | Secura";
          ogDesc = "Track passports, visas, insurance, and food dates online. Expiry reminder online free with automated warning alert trigger points.";
          break;
        case AppRoute.PASSWORD_MANAGER:
          title = "Secure Credentials Vault & Zero-Knowledge Password Manager | Secura";
          desc = "Protect your login credentials using the absolute secure zero-knowledge credentials vault. Double encrypted and decrypted purely in-browser.";
          keywords = "credentials vault, password manager, secure passwords, AES-256 password manager, offline password protector, zero knowledge encryption, Secura";
          ogTitle = "Secure Credentials Vault & Password Manager | Secura";
          ogDesc = "Safeguard your logins. Military-grade secure credentials vault decrypted client-side so only you have access.";
          break;
        case AppRoute.LOGIN:
          title = "Secure Portal Login | Secura Credentials Vault";
          desc = "Sign in to your private Secura vault to access the free invoice generator, budget planner, and expense ledger.";
          break;
        case AppRoute.REGISTER:
          title = "Create a Free Secura Account | Start Secure Budgeting & Planning";
          desc = "Get started with Secura in 10 seconds. Create your account and deploy your personal planner, invoice generator, and secure credentials vault.";
          break;
        case AppRoute.ABOUT_US:
          title = "About Secura | Mission & Military-Grade Privacy Values";
          desc = "Read our history, safety protocols, and vision. Secura offers completely free personal planners, invoice generators, and zero-knowledge tools for everyone.";
          break;
        case AppRoute.CONTACT_US:
          title = "Contact Secura Support | Help Desk & Technical FAQs";
          desc = "Need assistance with your budget planner or invoice creator? Reach out to the Secura safety team for immediate support.";
          break;
        case AppRoute.TERMS:
          title = "Terms & Conditions | Secura Personal Planner";
          desc = "Legal terms and service parameters governing your usage of Secura's free online tools.";
          break;
        case AppRoute.PRIVACY:
          title = "Privacy Policy & Zero-Knowledge Security Standards | Secura";
          desc = "How Secura safeguards your credentials, invoices, and expense files with client-side encryption.";
          break;
        default:
          title = `Secura | ${activeRoute.replace('-', ' ').toUpperCase()}`;
          break;
      }
    }

    document.title = title;

    // Update or create meta tags helper
    const updateOrCreateMeta = (name: string, content: string, isProperty = false) => {
      const attrName = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attrName}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    updateOrCreateMeta('description', desc);
    updateOrCreateMeta('keywords', keywords);
    updateOrCreateMeta('og:title', ogTitle, true);
    updateOrCreateMeta('og:description', ogDesc, true);
    updateOrCreateMeta('og:url', window.location.href, true);
    updateOrCreateMeta('og:type', 'website', true);
    updateOrCreateMeta('og:site_name', 'Secura', true);
  }, [activeRoute, isNotFound]);

  // Keyboard Shortcuts Listener
  useEffect(() => {
    let keysPressed: Record<string, boolean> = {};

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e || !e.key) return;

      // Don't trigger when user is writing in forms/inputs
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'SELECT')) {
        return;
      }

      const keyLower = e.key.toLowerCase();
      keysPressed[keyLower] = true;

      // "g" + key shortcuts
      if (keysPressed['g']) {
        if (keysPressed['d']) {
          e.preventDefault();
          handleNavigate(AppRoute.DASHBOARD);
        } else if (keysPressed['p']) {
          e.preventDefault();
          handleNavigate(AppRoute.PASSWORD_MANAGER);
        } else if (keysPressed['i']) {
          e.preventDefault();
          handleNavigate(AppRoute.INVOICE_GENERATOR);
        } else if (keysPressed['b']) {
          e.preventDefault();
          handleNavigate(AppRoute.BUDGET_PLANNER);
        } else if (keysPressed['e']) {
          e.preventDefault();
          handleNavigate(AppRoute.EXPENSE_TRACKER);
        } else if (keysPressed['a']) {
          e.preventDefault();
          handleNavigate(AppRoute.EXPIRY_REMINDER);
        } else if (keysPressed['s']) {
          e.preventDefault();
          handleNavigate(AppRoute.ADMIN_PANEL);
        }
      }

      // "t" + "t" => Toggle Theme
      if (keysPressed['t'] && keyLower === 't') {
        // if user pressed 't' twice or holds 't'
        e.preventDefault();
        toggleTheme();
      }

      // "?" => Open Shortcuts Modal
      if (e.key === '?') {
        e.preventDefault();
        setShowShortcuts(prev => !prev);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e && e.key) {
        delete keysPressed[e.key.toLowerCase()];
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [token, theme]);

  const handleLoginSuccess = (newToken: string, newUser: UserType) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('secura_token', newToken);
    localStorage.setItem('secura_user', JSON.stringify(newUser));
    setActiveRoute(AppRoute.DASHBOARD);
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('secura_token');
    localStorage.removeItem('secura_user');
    setActiveRoute(AppRoute.LANDING);
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('secura_theme', nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
  };

  const handleNavigate = (route: AppRoute) => {
    const currentToken = token || localStorage.getItem('secura_token');
    // If not logged in, redirect auth screens or landing
    if (!currentToken && ![
      AppRoute.LANDING, AppRoute.LOGIN, AppRoute.REGISTER, AppRoute.FORGOT_PASSWORD, AppRoute.RESET_PASSWORD,
      AppRoute.ABOUT_US, AppRoute.TERMS, AppRoute.CONTACT_US, AppRoute.DISCLAIMER, AppRoute.PRIVACY, AppRoute.REFUND
    ].includes(route)) {
      setActiveRoute(AppRoute.LANDING);
      window.history.pushState(null, '', '/');
      setIsNotFound(false);
      return;
    }
    setActiveRoute(route);
    window.history.pushState(null, '', route === AppRoute.LANDING ? '/' : '/' + route);
    setIsNotFound(false);
    setSidebarOpen(false);
  };

  const isAuthScreen = [AppRoute.LOGIN, AppRoute.REGISTER, AppRoute.FORGOT_PASSWORD, AppRoute.RESET_PASSWORD].includes(activeRoute);
  const isLegalScreen = [AppRoute.ABOUT_US, AppRoute.TERMS, AppRoute.CONTACT_US, AppRoute.DISCLAIMER, AppRoute.PRIVACY, AppRoute.REFUND].includes(activeRoute);
  const isWorkspaceScreen = token && !isAuthScreen && activeRoute !== AppRoute.LANDING;

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-300">
      
      {isNotFound ? (
        <NotFound 
          isLoggedIn={!!token} 
          onNavigate={handleNavigate} 
          onGoBackHome={() => handleNavigate(token ? AppRoute.DASHBOARD : AppRoute.LANDING)} 
        />
      ) : (
        <>
          {/* 1. Landing Page / Public Legal Screen */}
          {(activeRoute === AppRoute.LANDING || (!token && isLegalScreen)) && (
            <LandingPage onNavigate={handleNavigate} theme={theme} onToggleTheme={toggleTheme} isLoggedIn={!!token} activeRoute={activeRoute} />
          )}

          {/* 2. Authentication Flow Screen */}
          {isAuthScreen && (
            <Auth 
              activeRoute={activeRoute} 
              onNavigate={handleNavigate} 
              onLoginSuccess={handleLoginSuccess} 
            />
          )}

          {/* 3. Logged-in Core App Shell */}
          {isWorkspaceScreen && (
        <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
          
          {/* Mobile backdrop overlay for sidebar */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-fade-in"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Collapsible Sidebar for Desktop & Mobile Overlay */}
          <aside className={`fixed inset-y-0 left-0 w-64 border-r border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 z-50 transform md:transform-none transition-transform duration-300 flex flex-col justify-between ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}>
            <div className="p-6 space-y-8">
              {/* Brand Logo */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavigate(AppRoute.DASHBOARD)}>
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center shadow">
                    <span className="font-bold text-white dark:text-zinc-950 text-sm">S</span>
                  </div>
                  <span className="font-bold text-zinc-900 dark:text-zinc-50 text-base tracking-tight">Secura</span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Menu Links */}
              <nav className="space-y-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                <span className="block px-3 py-1 text-[10px] text-zinc-400 dark:text-zinc-600 font-bold">Workspace Core</span>
                {[
                  { route: AppRoute.DASHBOARD, label: 'Dashboard', icon: LayoutGrid },
                  { route: AppRoute.PASSWORD_MANAGER, label: 'Credentials Vault', icon: Shield }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  const isActive = activeRoute === item.route;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleNavigate(item.route)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all capitalize text-left cursor-pointer ${
                        isActive 
                          ? 'bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-950 font-bold shadow-sm' 
                          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/60'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}

                <div className="pt-4 space-y-1.5">
                  <span className="block px-3 py-1 text-[10px] text-zinc-400 dark:text-zinc-600 font-bold">Personal Hub</span>
                  {[
                    { route: AppRoute.INVOICE_GENERATOR, label: 'Invoices Generator', icon: CreditCard },
                    { route: AppRoute.BUDGET_PLANNER, label: 'Budget Planner', icon: PieChart },
                    { route: AppRoute.EXPENSE_TRACKER, label: 'Expense Tracker', icon: Clock },
                    { route: AppRoute.EXPIRY_REMINDER, label: 'Expiry Alerts', icon: Calendar }
                  ].map((item, idx) => {
                    const Icon = item.icon;
                    const isActive = activeRoute === item.route;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleNavigate(item.route)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all capitalize text-left cursor-pointer ${
                          isActive 
                            ? 'bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-950 font-bold shadow-sm' 
                            : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/60'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>

                {user?.plan === 'admin' && (
                  <div className="pt-4 space-y-1.5">
                    <span className="block px-3 py-1 text-[10px] text-zinc-400 dark:text-zinc-600 font-bold">Admin Panel</span>
                    <button
                      onClick={() => handleNavigate(AppRoute.ADMIN_PANEL)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all capitalize text-left cursor-pointer ${
                        activeRoute === AppRoute.ADMIN_PANEL 
                          ? 'bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-950 font-bold shadow animate-scale-up' 
                          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/60'
                      }`}
                    >
                      <Activity className="w-4 h-4 shrink-0" />
                      <span>Control Center</span>
                    </button>
                  </div>
                )}

                {/* Sidebar Resources / Legal Pages section */}
                <div className="pt-4 space-y-1.5 border-t border-zinc-100 dark:border-zinc-800">
                  <span className="block px-3 py-1 text-[10px] text-zinc-400 dark:text-zinc-600 font-bold">Resources</span>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 px-3 py-1 text-[10px] font-semibold text-zinc-500">
                    <button onClick={() => handleNavigate(AppRoute.ABOUT_US)} className="hover:text-zinc-900 dark:hover:text-zinc-100 text-left transition-colors cursor-pointer py-0.5">About Us</button>
                    <button onClick={() => handleNavigate(AppRoute.CONTACT_US)} className="hover:text-zinc-900 dark:hover:text-zinc-100 text-left transition-colors cursor-pointer py-0.5">Contact Us</button>
                    <button onClick={() => handleNavigate(AppRoute.TERMS)} className="hover:text-zinc-900 dark:hover:text-zinc-100 text-left transition-colors cursor-pointer py-0.5">Terms</button>
                    <button onClick={() => handleNavigate(AppRoute.PRIVACY)} className="hover:text-zinc-900 dark:hover:text-zinc-100 text-left transition-colors cursor-pointer py-0.5">Privacy</button>
                    <button onClick={() => handleNavigate(AppRoute.REFUND)} className="hover:text-zinc-900 dark:hover:text-zinc-100 text-left transition-colors cursor-pointer py-0.5">Refunds</button>
                    <button onClick={() => handleNavigate(AppRoute.DISCLAIMER)} className="hover:text-zinc-900 dark:hover:text-zinc-100 text-left transition-colors cursor-pointer py-0.5">Disclaimer</button>
                  </div>
                </div>
              </nav>
            </div>

            {/* Profile Summary & Logout */}
            <div className="p-6 border-t border-zinc-100 dark:border-zinc-800/80 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-zinc-800 dark:text-zinc-200">
                  {user?.name.charAt(0) || 'U'}
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{user?.name}</div>
                  <div className="text-[10px] text-zinc-400 truncate">{user?.email}</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button 
                  onClick={() => setShowShortcuts(true)}
                  className="p-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  title="Keyboard Shortcuts Guide"
                >
                  <Command className="w-4 h-4" />
                </button>
                <button 
                  onClick={toggleTheme}
                  className="p-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  title="Toggle Theme"
                >
                  {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </button>
                <button 
                  onClick={handleLogout}
                  className="p-1.5 rounded hover:bg-rose-50 text-zinc-400 hover:text-rose-600"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </aside>

          {/* Main workspace layout content wrapper */}
          <div className="flex-1 md:pl-64 flex flex-col min-h-screen w-full max-w-full overflow-x-hidden">
            
            {/* Horizontal Header bar */}
            <header className="h-16 border-b border-zinc-100 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md px-6 md:px-8 flex items-center justify-between sticky top-0 z-40 transition-colors duration-300">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setSidebarOpen(true)}
                  className="md:hidden p-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>

                {/* Explore Modules Dropdown Menu Option (dashboard ka header ma menus Wala option) */}
                <div className="relative menu-dropdown-container">
                  <button 
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-bold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Menu className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span className="hidden sm:inline font-bold">Workspace Navigation</span>
                    <span className="sm:hidden font-bold">Menu</span>
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-400 transition-transform duration-200" style={{ transform: menuOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
                  </button>

                  {menuOpen && (
                    <div className="absolute left-0 mt-2 w-64 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 shadow-xl p-2 z-50 animate-scale-up">
                      <span className="block px-3 py-1.5 text-[10px] text-zinc-400 dark:text-zinc-500 font-bold tracking-wider uppercase">Active Engines</span>
                      <div className="space-y-0.5 mt-1">
                        {[
                          { route: AppRoute.DASHBOARD, label: 'Dashboard Overview', icon: LayoutGrid, desc: 'Central stats & control' },
                          { route: AppRoute.PASSWORD_MANAGER, label: 'Credentials Vault', icon: Shield, desc: 'Secure decrypted login keys' },
                          { route: AppRoute.INVOICE_GENERATOR, label: 'Invoices Generator', icon: CreditCard, desc: 'Tax-ready billing bills' },
                          { route: AppRoute.BUDGET_PLANNER, label: 'Budget Planner', icon: PieChart, desc: 'Threshold warning tracker' },
                          { route: AppRoute.EXPENSE_TRACKER, label: 'Expense Ledger', icon: Clock, desc: 'Receipts & expenditures logs' },
                          { route: AppRoute.EXPIRY_REMINDER, label: 'Expiry Alerts', icon: Calendar, desc: 'Passport & contract triggers' }
                        ].map((item) => {
                          const Icon = item.icon;
                          return (
                            <button
                              key={item.route}
                              onClick={() => {
                                handleNavigate(item.route);
                                setMenuOpen(false);
                              }}
                              className={`w-full flex items-start gap-3 p-2 rounded-xl text-left transition-all cursor-pointer ${
                                activeRoute === item.route 
                                  ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold' 
                                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
                              }`}
                            >
                              <div className={`p-1.5 rounded-lg ${activeRoute === item.route ? 'bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-950' : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400'}`}>
                                <Icon className="w-3.5 h-3.5 shrink-0" />
                              </div>
                              <div className="leading-none py-0.5">
                                <span className="text-xs font-bold block">{item.label}</span>
                                <span className="text-[9px] text-zinc-400 block mt-0.5">{item.desc}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      <span className="block px-3 py-1.5 mt-2 border-t border-zinc-100 dark:border-zinc-900/50 pt-2 text-[10px] text-zinc-400 dark:text-zinc-500 font-bold tracking-wider uppercase">Legal & Resources</span>
                      <div className="grid grid-cols-2 gap-1 px-3 py-1 text-[10px] font-semibold text-zinc-500">
                        <button onClick={() => { handleNavigate(AppRoute.ABOUT_US); setMenuOpen(false); }} className="hover:text-zinc-900 dark:hover:text-zinc-100 text-left transition-colors cursor-pointer py-1">About Us</button>
                        <button onClick={() => { handleNavigate(AppRoute.CONTACT_US); setMenuOpen(false); }} className="hover:text-zinc-900 dark:hover:text-zinc-100 text-left transition-colors cursor-pointer py-1">Contact Us</button>
                        <button onClick={() => { handleNavigate(AppRoute.TERMS); setMenuOpen(false); }} className="hover:text-zinc-900 dark:hover:text-zinc-100 text-left transition-colors cursor-pointer py-1">Terms</button>
                        <button onClick={() => { handleNavigate(AppRoute.PRIVACY); setMenuOpen(false); }} className="hover:text-zinc-900 dark:hover:text-zinc-100 text-left transition-colors cursor-pointer py-1">Privacy</button>
                        <button onClick={() => { handleNavigate(AppRoute.REFUND); setMenuOpen(false); }} className="hover:text-zinc-900 dark:hover:text-zinc-100 text-left transition-colors cursor-pointer py-1">Refunds</button>
                        <button onClick={() => { handleNavigate(AppRoute.DISCLAIMER); setMenuOpen(false); }} className="hover:text-zinc-900 dark:hover:text-zinc-100 text-left transition-colors cursor-pointer py-1">Disclaimer</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-xs text-zinc-400 hidden lg:flex items-center gap-1 font-mono">
                <span>SYSTEM_ENCRYPTION:</span>
                <span className="text-emerald-500 font-bold uppercase">AES-256-CBC ACTIVE</span>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowShortcuts(true)}
                  className="text-[11px] font-mono text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 border border-zinc-100 dark:border-zinc-800 rounded px-2 py-0.5"
                >
                  Press ? for Shortcuts
                </button>
              </div>
            </header>

            {/* Dynamic workspace router container */}
            <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto pb-16">
              {/* Personal Hub Quick Switch Navigation Tab Bar */}
              {[AppRoute.INVOICE_GENERATOR, AppRoute.BUDGET_PLANNER, AppRoute.EXPENSE_TRACKER, AppRoute.EXPIRY_REMINDER].includes(activeRoute) && (
                <div className="mb-6 p-2 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between px-3 py-1.5 border-b border-zinc-100 dark:border-zinc-800 mb-2 gap-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                      Personal Hub Navigation Menu
                    </span>
                    <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-medium">Quick switch dashboard</span>
                  </div>
                  <div className="flex overflow-x-auto gap-1 pb-1 scrollbar-none snap-x scroll-smooth">
                    {[
                      { route: AppRoute.INVOICE_GENERATOR, label: 'Invoice Generator', icon: CreditCard },
                      { route: AppRoute.BUDGET_PLANNER, label: 'Budget Planner', icon: PieChart },
                      { route: AppRoute.EXPENSE_TRACKER, label: 'Expense Tracker', icon: Clock },
                      { route: AppRoute.EXPIRY_REMINDER, label: 'Expiry Alerts', icon: Calendar }
                    ].map((item, idx) => {
                      const Icon = item.icon;
                      const isActive = activeRoute === item.route;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleNavigate(item.route)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer snap-start ${
                            isActive 
                              ? 'bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-950 font-bold shadow-sm' 
                              : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-850'
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400 dark:text-indigo-500' : 'text-zinc-400'}`} />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeRoute === AppRoute.DASHBOARD && <Dashboard user={user} onNavigate={handleNavigate} token={token} />}
              {activeRoute === AppRoute.PASSWORD_MANAGER && <PasswordManager token={token} />}
              {activeRoute === AppRoute.INVOICE_GENERATOR && <InvoiceGenerator token={token} user={user} />}
              {activeRoute === AppRoute.BUDGET_PLANNER && <BudgetPlanner token={token} />}
              {activeRoute === AppRoute.EXPENSE_TRACKER && <ExpenseTracker token={token} />}
              {activeRoute === AppRoute.EXPIRY_REMINDER && <ExpiryReminder token={token} />}
              {activeRoute === AppRoute.ADMIN_PANEL && <AdminPanel token={token} />}
              {isLegalScreen && <LegalPages activeRoute={activeRoute} onNavigate={handleNavigate} />}
            </main>

            {/* Elegant Workspace Footer */}
            <footer className="py-6 border-t border-zinc-100 dark:border-zinc-800/80 px-6 md:px-8 text-center text-[11px] text-zinc-400 font-mono flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                &copy; 2026 Secura. All rights reserved. Encrypted via TLS and AES-256-CBC.
              </div>
            </footer>

          </div>
        </div>
      )}
        </>
      )}

      {/* 4. Keyboard Shortcuts Modal Overlay */}
      {showShortcuts && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 md:p-8 animate-scale-up">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Command className="w-5 h-5 text-indigo-500" />
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">Keyboard Shortcuts Cheat Sheet</h3>
              </div>
              <button onClick={() => setShowShortcuts(false)} className="p-1 rounded text-zinc-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-2 border-b border-zinc-50 dark:border-zinc-800/40">
                <span className="text-zinc-500">Go to Dashboard</span>
                <span className="font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-600 dark:text-zinc-300 font-bold">g + d</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-zinc-50 dark:border-zinc-800/40">
                <span className="text-zinc-500">Go to Credentials Vault</span>
                <span className="font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-600 dark:text-zinc-300 font-bold">g + p</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-zinc-50 dark:border-zinc-800/40">
                <span className="text-zinc-500">Go to Invoice Engine</span>
                <span className="font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-600 dark:text-zinc-300 font-bold">g + i</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-zinc-50 dark:border-zinc-800/40">
                <span className="text-zinc-500">Go to Budget Planner</span>
                <span className="font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-600 dark:text-zinc-300 font-bold">g + b</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-zinc-50 dark:border-zinc-800/40">
                <span className="text-zinc-500">Go to Expense Ledger</span>
                <span className="font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-600 dark:text-zinc-300 font-bold">g + e</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-zinc-50 dark:border-zinc-800/40">
                <span className="text-zinc-500">Go to Document Alerts</span>
                <span className="font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-600 dark:text-zinc-300 font-bold">g + a</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-zinc-50 dark:border-zinc-800/40">
                <span className="text-zinc-500">Go to System Control Center</span>
                <span className="font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-600 dark:text-zinc-300 font-bold">g + s</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-zinc-50 dark:border-zinc-800/40">
                <span className="text-zinc-500">Toggle Theme Dark / Light</span>
                <span className="font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-600 dark:text-zinc-300 font-bold">t + t</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-zinc-500">Show Shortcuts panel</span>
                <span className="font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-600 dark:text-zinc-300 font-bold">?</span>
              </div>
            </div>

            <button 
              onClick={() => setShowShortcuts(false)}
              className="mt-6 w-full py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-bold transition-all text-xs"
            >
              Close Guide
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
