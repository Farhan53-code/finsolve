/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  PieChart, Plus, Trash2, Edit3, Loader2, AlertTriangle, AlertCircle, Check, X, DollarSign, ChevronDown
} from 'lucide-react';
import { collection, addDoc, getDocs, delete, doc, updateDoc, query, where, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase.js';

interface BudgetPlannerProps {
  token: string | null;
}

interface Budget {
  id: string;
  category: string;
  amountLimit: number;
  spentAmount: number;
  period: 'monthly' | 'yearly';
  userId?: string;
}

export default function BudgetPlanner({ token }: BudgetPlannerProps) {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqData = [
    {
      q: "How much does the average single person spend a month?",
      a: "According to recent economic indicators, the average single person in the United States spends roughly $3,000 to $4,200 per month on living costs, including housing, utilities, food, transport, and insurance."
    },
    {
      q: "How much money should you have at 30?",
      a: "A general financial guideline is to have an amount equivalent to your annual salary saved by age 30. Utilizing a disciplined personal planner and automated budget tracker early on makes reaching this milestone highly achievable."
    },
    {
      q: "How much of your monthly income should go to groceries?",
      a: "Generally, food and grocery expenses should ideally occupy 10% to 15% of your monthly take-home income. Setting clear warning thresholds using a free personal budget planner helps keep these targets secure."
    },
    {
      q: "How to budget money for beginners?",
      a: "Beginners should adopt the classic 50/30/20 budget framework: allocate 50% of monthly income to absolute needs, 30% to personal wants, and 20% to savings or debt clearance. Monitor this online in our free budget planner app."
    }
  ];

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(item => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": `<p>${item.a}</p>`
      }
    }))
  };

  // Form Fields
  const [formError, setFormError] = useState<string | null>(null);
  const [category, setCategory] = useState('Food & Dining');
  const [limitAmount, setLimitAmount] = useState<number>(500);
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [customCategoryName, setCustomCategoryName] = useState('');

  const defaultCategories = [
    "Food & Dining",
    "Subscriptions & SaaS",
    "Travel & Transport",
    "Office & Supplies",
    "Personal Care",
    "Utilities & Bills"
  ];

  useEffect(() => {
    const saved = localStorage.getItem('secura_custom_categories');
    if (saved) {
      try {
        setCustomCategories(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse custom categories:', e);
      }
    }
  }, []);

  const loadBudgets = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'budgets'));
      const list: Budget[] = [];
      querySnapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as Budget);
      });
      setBudgets(list);
    } catch (e) {
      console.error('Failed to load budgets:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBudgets();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || limitAmount <= 0) {
      setFormError('Please select a category and enter a valid limit amount.');
      return;
    }
    setFormError(null);

    let finalCategory = category;
    if (category === '__custom__') {
      if (!customCategoryName.trim()) {
        setFormError('Please enter a valid custom category name.');
        return;
      }
      finalCategory = customCategoryName.trim();
      if (!customCategories.includes(finalCategory) && !defaultCategories.includes(finalCategory)) {
        const updated = [...customCategories, finalCategory];
        setCustomCategories(updated);
        localStorage.setItem('secura_custom_categories', JSON.stringify(updated));
      }
    }

    try {
      if (editingId) {
        const docRef = doc(db, 'budgets', editingId);
        await updateDoc(docRef, {
          category: finalCategory,
          amountLimit: limitAmount,
          period
        });
      } else {
        await addDoc(collection(db, 'budgets'), {
          category: finalCategory,
          amountLimit: limitAmount,
          spentAmount: 0,
          period,
          createdAt: new Date().toISOString()
        });
      }
      setShowModal(false);
      resetForm();
      loadBudgets();
    } catch (e: any) {
      console.error('Failed to save budget:', e);
      setFormError('Failed to save budget: ' + e.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'budgets', id));
      loadBudgets();
    } catch (e) {
      console.error('Failed to delete budget:', e);
    }
  };

  const handleEdit = (b: Budget) => {
    setEditingId(b.id);
    setCategory(b.category);
    setLimitAmount(b.amountLimit);
    setPeriod(b.period);
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setCategory('Food & Dining');
    setCustomCategoryName('');
    setLimitAmount(500);
    setPeriod('monthly');
    setFormError(null);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top action bar */}
      <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-6">
        <div>
          <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">Budget Planner</h2>
          <p className="text-zinc-500 text-sm mt-1">Configure limits and active percentage thresholds across target categories.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs font-bold transition-all shadow flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Category Limit</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
          <span className="text-xs text-zinc-400 font-mono">Syncing category calculations...</span>
        </div>
      ) : budgets.length === 0 ? (
        <div className="p-16 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl text-center">
          <PieChart className="w-10 h-10 text-zinc-300 mx-auto mb-4" />
          <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">No Budget Caps Set</p>
          <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">Configure a dining, subscriptions, or office budget limit to trigger warnings when spending accelerates.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {budgets.map((b, idx) => {
            const spent = b.spentAmount || 0;
            const percent = Math.min(Math.round((spent / b.amountLimit) * 100), 200);
            const isExceeded = spent >= b.amountLimit;
            const isWarning = spent >= b.amountLimit * 0.8 && spent < b.amountLimit;

            return (
              <div 
                key={b.id || idx}
                className={`p-6 rounded-2xl border bg-white dark:bg-zinc-900 shadow-sm transition-all flex flex-col justify-between ${
                  isExceeded ? 'border-rose-200 dark:border-rose-950/40' : 
                  isWarning ? 'border-amber-200 dark:border-amber-950/40' : 
                  'border-zinc-100 dark:border-zinc-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-zinc-900 dark:text-zinc-50 text-base">{b.category}</h3>
                      <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">{b.period} limit</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleEdit(b)}
                        className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400"
                        title="Edit Limit"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(b.id)}
                        className="p-1 rounded hover:bg-rose-50 text-zinc-400 hover:text-rose-600"
                        title="Delete Budget"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Calculations and state widgets */}
                  <div className="mt-6 flex items-baseline justify-between text-xs">
                    <div>
                      <span className="text-2xl font-black text-zinc-900 dark:text-zinc-50">${spent.toFixed(2)}</span>
                      <span className="text-zinc-400 font-medium"> / ${b.amountLimit.toFixed(2)}</span>
                    </div>
                    <span className={`font-bold text-xs ${
                      isExceeded ? 'text-rose-600 dark:text-rose-400' :
                      isWarning ? 'text-amber-600 dark:text-amber-400' :
                      'text-zinc-500'
                    }`}>
                      {percent}%
                    </span>
                  </div>

                  {/* Progress bar container */}
                  <div className="mt-3 w-full bg-zinc-100 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        isExceeded ? 'bg-rose-500' :
                        isWarning ? 'bg-amber-500' :
                        'bg-emerald-500'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                {/* Warnings overlay message banner */}
                <div className="mt-5 pt-4 border-t border-zinc-50 dark:border-zinc-800/80 flex items-center justify-between text-[11px]">
                  {isExceeded ? (
                    <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-bold">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>CAP EXCEEDED BY ${(spent - b.amountLimit).toFixed(2)}</span>
                    </div>
                  ) : isWarning ? (
                    <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold">
                      <AlertTriangle className="w-4 h-4 shrink-0 animate-pulse" />
                      <span>CRITICAL THRESHOLD REACHED (&gt;80%)</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>BUDGET SAFE AND STABLE</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Setup Category Cap Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 md:p-8 animate-scale-up">
            
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4 mb-6">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                {editingId ? 'Configure Budget Cap' : 'Establish Budget Cap'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 rounded text-zinc-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-900 transition-all"
                >
                  {Array.from(new Set([...defaultCategories, ...customCategories, ...(category !== '__custom__' ? [category] : [])])).map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option value="__custom__">+ Add Custom Category...</option>
                </select>
              </div>

              {category === '__custom__' && (
                <div className="space-y-1 animate-scale-up">
                  <label className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">Custom Category Name</label>
                  <input 
                    type="text" 
                    value={customCategoryName}
                    onChange={(e) => setCustomCategoryName(e.target.value)}
                    placeholder="e.g. Fitness, Education"
                    className="w-full px-3 py-2 rounded-lg border border-indigo-200 dark:border-indigo-900/50 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-bold"
                    required
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Spending Limit Amount ($)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                    <DollarSign className="w-4 h-4" />
                  </span>
                  <input 
                    type="number" 
                    value={limitAmount}
                    onChange={(e) => setLimitAmount(Number(e.target.value) || 0)}
                    placeholder="500"
                    className="w-full pl-8 pr-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 text-xs focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Period</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer">
                    <input 
                      type="radio" 
                      name="period" 
                      value="monthly" 
                      checked={period === 'monthly'} 
                      onChange={() => setPeriod('monthly')} 
                    />
                    <span>Monthly Limit</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer">
                    <input 
                      type="radio" 
                      name="period" 
                      value="yearly" 
                      checked={period === 'yearly'} 
                      onChange={() => setPeriod('yearly')} 
                    />
                    <span>Yearly Limit</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800 mt-6">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-xs font-bold text-zinc-500 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs font-bold transition-all shadow"
                >
                  Save Limit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SEO FAQ Section */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />
      <div className="mt-16 border-t border-zinc-100 dark:border-zinc-800/80 pt-12 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h3 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Frequently Asked Questions (FAQ)
          </h3>
        </div>
        <div className="space-y-3">
          {faqData.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="rounded-2xl border border-zinc-100 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/30 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left font-bold text-zinc-800 dark:text-zinc-100 text-xs cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs text-zinc-600 dark:text-zinc-400 border-t border-zinc-50 dark:border-zinc-800/30">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
