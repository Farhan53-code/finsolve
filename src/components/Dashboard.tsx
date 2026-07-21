/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Shield, CreditCard, PieChart, Clock, Calendar, ChevronRight, Sparkles, LogOut, Loader2, ArrowRight, Check, Activity
} from 'lucide-react';
import { AppRoute, User, PasswordEntry, Invoice, Budget, Expense, DocumentReminder, SubscriptionPlan } from '../types.js';

interface DashboardProps {
  user: User | null;
  onNavigate: (route: AppRoute) => void;
  token: string | null;
}

export default function Dashboard({ user, onNavigate, token }: DashboardProps) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    passwords: 0,
    invoices: 0,
    budgets: 0,
    expenses: 0,
    documents: 0
  });
  const [recentExpenses, setRecentExpenses] = useState<Expense[]>([]);
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  const [expiryDocuments, setExpiryDocuments] = useState<DocumentReminder[]>([]);

  useEffect(() => {
    async function loadDashboardData() {
      if (!token) return;
      try {
        const headers = { 'Authorization': `Bearer ${token}` };
        
        const [passwordsRes, invoicesRes, budgetsRes, expensesRes, documentsRes] = await Promise.all([
          fetch('/api/passwords', { headers }),
          fetch('/api/invoices', { headers }),
          fetch('/api/budgets', { headers }),
          fetch('/api/expenses', { headers }),
          fetch('/api/documents', { headers })
        ]);

        if (passwordsRes.ok && invoicesRes.ok && budgetsRes.ok && expensesRes.ok && documentsRes.ok) {
          const passwords = await passwordsRes.json();
          const invoices = await invoicesRes.json();
          const budgets = await budgetsRes.json();
          const expenses = await expensesRes.json();
          const documents = await documentsRes.json();

          setStats({
            passwords: passwords.length,
            invoices: invoices.length,
            budgets: budgets.length,
            expenses: expenses.length,
            documents: documents.length
          });

          setRecentExpenses(expenses.slice(0, 3));
          setRecentInvoices(invoices.slice(0, 2));
          setExpiryDocuments(documents.filter((d: any) => d.status !== 'valid').slice(0, 2));
        }
      } catch (e) {
        console.error('Failed to load dashboard statistics:', e);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [token]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 text-zinc-900 dark:text-zinc-50 animate-spin" />
        <span className="text-sm font-medium text-zinc-400 font-mono">Syncing system logs...</span>
      </div>
    );
  }

  const moduleShortcuts = [
    {
      route: AppRoute.PASSWORD_MANAGER,
      title: 'Credentials Vault',
      desc: 'Encrypted login keys manager',
      icon: Shield,
      count: stats.passwords,
      color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30'
    },
    {
      route: AppRoute.INVOICE_GENERATOR,
      title: 'Invoice Engine',
      desc: 'Build tax-ready client billing',
      icon: CreditCard,
      count: stats.invoices,
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30'
    },
    {
      route: AppRoute.BUDGET_PLANNER,
      title: 'Budget Planner',
      desc: 'Configure category threshold spending',
      icon: PieChart,
      count: stats.budgets,
      color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/30'
    },
    {
      route: AppRoute.EXPENSE_TRACKER,
      title: 'Expense Tracker',
      desc: 'Log receipts and view ledger',
      icon: Clock,
      count: stats.expenses,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/30'
    },
    {
      route: AppRoute.EXPIRY_REMINDER,
      title: 'Expiry Alerts',
      desc: 'Passport & contract expiries',
      icon: Calendar,
      count: stats.documents,
      color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/30'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Welcome Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800/80 pb-6">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
            Hi, {user?.name || 'Workspace Lead'}
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Here is your daily operational report across all five Secura modules.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-xs font-bold text-emerald-700 dark:text-emerald-400 capitalize">
            Unlimited Free Account
          </span>
          {user?.plan === SubscriptionPlan.ADMIN && (
            <button 
              onClick={() => onNavigate(AppRoute.ADMIN_PANEL)}
              className="px-3.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all cursor-pointer"
            >
              Control Center
            </button>
          )}
        </div>
      </div>

      {/* Grid of Modules & Quick Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {moduleShortcuts.map((module, i) => {
          const Icon = module.icon;
          return (
            <div 
              key={i}
              onClick={() => onNavigate(module.route)}
              className="p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 duration-200 cursor-pointer flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-xl ${module.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-500 transition-colors" />
              </div>
              <div className="mt-5">
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{module.title}</div>
                <div className="text-2xl font-black text-zinc-900 dark:text-zinc-50 mt-1">{module.count}</div>
                <p className="text-[11px] text-zinc-500 mt-1 leading-normal line-clamp-1">{module.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Workspace Feed Layout */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left Side Feed Column */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Recent Invoices Feed */}
          <div className="p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-colors duration-300 shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-zinc-400" />
                <h3 className="font-bold text-zinc-900 dark:text-zinc-50 text-base">Active Invoices</h3>
              </div>
              <button 
                onClick={() => onNavigate(AppRoute.INVOICE_GENERATOR)}
                className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100 transition-colors cursor-pointer"
              >
                Invoicing Hub &rarr;
              </button>
            </div>

            {recentInvoices.length === 0 ? (
              <div className="py-8 text-center text-zinc-400 text-xs">
                No client invoices built yet. Click Invoicing Hub to create one.
              </div>
            ) : (
              <div className="divide-y divide-zinc-50 dark:divide-zinc-800/80">
                {recentInvoices.map((inv, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between text-sm">
                    <div>
                      <div className="font-semibold text-zinc-800 dark:text-zinc-200">{inv.clientName}</div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">{inv.invoiceNumber} • Due {inv.dueDate}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-zinc-950 dark:text-zinc-50">
                        {inv.currency === 'USD' ? '$' : inv.currency}
                        {inv.total.toFixed(2)}
                      </div>
                      <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-extrabold uppercase mt-1 ${
                        inv.status === 'paid' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400'
                      }`}>
                        {inv.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Expiring Reminders warnings */}
          <div className="p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-colors duration-300 shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-zinc-400" />
                <h3 className="font-bold text-zinc-900 dark:text-zinc-50 text-base">Security Expiry Warnings</h3>
              </div>
              <button 
                onClick={() => onNavigate(AppRoute.EXPIRY_REMINDER)}
                className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100 transition-colors cursor-pointer"
              >
                Tracking Board &rarr;
              </button>
            </div>

            {expiryDocuments.length === 0 ? (
              <div className="py-8 text-center text-zinc-400 text-xs">
                All registered documents are valid and safe.
              </div>
            ) : (
              <div className="divide-y divide-zinc-50 dark:divide-zinc-800/80">
                {expiryDocuments.map((doc, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between text-sm">
                    <div>
                      <div className="font-semibold text-zinc-800 dark:text-zinc-200">{doc.title}</div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">Expires on {doc.expiryDate}</div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950/40 text-[9px] font-bold text-rose-700 dark:text-rose-400 uppercase">
                      {doc.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Side Column (Recent Activities & Budget Stats) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Quick Expense Ledger Feed */}
          <div className="p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-colors duration-300 shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-zinc-400" />
                <h3 className="font-bold text-zinc-900 dark:text-zinc-50 text-sm">Recent Ledger Logs</h3>
              </div>
              <button 
                onClick={() => onNavigate(AppRoute.EXPENSE_TRACKER)}
                className="text-xs font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-100 transition-colors cursor-pointer"
              >
                Expenses
              </button>
            </div>

            {recentExpenses.length === 0 ? (
              <div className="py-6 text-center text-zinc-400 text-xs">
                No recent expenses logged.
              </div>
            ) : (
              <div className="space-y-4">
                {recentExpenses.map((exp, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-zinc-800 dark:text-zinc-200">{exp.description}</div>
                      <div className="text-[10px] text-zinc-400 mt-0.5">{exp.date} • {exp.category}</div>
                    </div>
                    <span className="font-bold text-zinc-900 dark:text-zinc-50">${exp.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Removed LIFEHUB SYSTEM META */}

        </div>

      </div>
    </div>
  );
}
