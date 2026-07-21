/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Calendar, Plus, Trash2, Search, Filter, Loader2, AlertTriangle, Check, X, Shield, Clock, BookOpen, AlertCircle, ChevronDown
} from 'lucide-react';
import { DocumentReminder } from '../types.js';

const getCategoryName = (type: string) => {
  switch (type) {
    case 'passport': return 'Passport';
    case 'visa': return 'Visa';
    case 'driver_license': return 'Driving License';
    case 'insurance': return 'Insurance';
    case 'national_id': return 'National ID';
    default: return 'Other';
  }
};

const getDaysRemaining = (expiryDateStr: string) => {
  const expiry = new Date(expiryDateStr).getTime();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffTime = expiry - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

interface ExpiryReminderProps {
  token: string | null;
}

export default function ExpiryReminder({ token }: ExpiryReminderProps) {
  const [documents, setDocuments] = useState<DocumentReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Modal Fields
  const [showModal, setShowModal] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqData = [
    {
      q: "How to track expiry date?",
      a: "The most efficient way to track an expiry date is to use a dedicated document expiry reminder app like Secura. You simply enter the document name (such as passport, visa, or driving license) and the expiry date. The app keeps track of the remaining days and sends timely alert warning notifications before the deadline."
    },
    {
      q: "How to set reminder in Excel for expiry date?",
      a: "To set an expiry reminder in Excel, you can use conditional formatting. Select your expiry date column, click 'Conditional Formatting' > 'New Rule', and use a formula like '=A2-TODAY()<=30' to highlight rows that expire within 30 days. For an automated, no-code, and cloud-synced solution, using Secura is far easier and more secure."
    },
    {
      q: "How much does expiration reminder cost?",
      a: "Secura provides high-quality expiration and document tracking software absolutely free of charge. There are no registration fees, monthly subscription rates, or hidden charges."
    },
    {
      q: "How do you write an expiry date?",
      a: "An expiry date is typically formatted clearly to prevent misinterpretation, such as writing out the full month or using standard international notations (e.g., 'YYYY-MM-DD' or 'DD MMM YYYY' like '20 Oct 2026')."
    },
    {
      q: "How to write expiry date in short?",
      a: "The most common short notations for expiry dates on consumer products or official files are 'EXP' followed by the month and year (e.g., 'EXP 12/28' or 'EXP: YYYY-MM-DD')."
    },
    {
      q: "How to use expiry date?",
      a: "Use expiry dates to plan ahead and initiate renewals early (such as starting passport or visa applications 3-6 months before they expire). This protects you from sudden travel disruptions or late fees."
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
  const [title, setTitle] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [category, setCategory] = useState('Passport');
  const [notes, setNotes] = useState('');

  const loadDocuments = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('/api/documents', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
      }
    } catch (e) {
      console.error('Failed to load documents list:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !expiryDate) {
      setFormError('Title and expiry date are required.');
      return;
    }
    setFormError(null);

    let docType: 'passport' | 'visa' | 'driver_license' | 'insurance' | 'national_id' | 'other' = 'other';
    const catLower = category.toLowerCase();
    if (catLower.includes('passport')) {
      docType = 'passport';
    } else if (catLower.includes('visa')) {
      docType = 'visa';
    } else if (catLower.includes('license') || catLower.includes('driving')) {
      docType = 'driver_license';
    } else if (catLower.includes('contract')) {
      docType = 'insurance';
    }

    const payload = { 
      title, 
      documentType: docType, 
      documentNumber: documentNumber.trim() || 'N/A', 
      expiryDate, 
      notes: notes || '',
      alertDaysBefore: 30
    };

    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setShowModal(false);
        resetForm();
        loadDocuments();
      } else {
        const errData = await res.json().catch(() => ({}));
        setFormError(errData.error || 'Failed to save document reminder.');
      }
    } catch (e) {
      console.error('Failed to create document notification:', e);
      setFormError('Network error. Failed to save document reminder.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        loadDocuments();
      }
    } catch (e) {
      console.error('Failed to delete document tracker:', e);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDocumentNumber('');
    setExpiryDate('');
    setCategory('Passport');
    setNotes('');
    setFormError(null);
  };

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (doc.documentNumber || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    // Map backend documentType to category names for filter check
    const mappedCatName = getCategoryName(doc.documentType);
    const matchesCategory = activeCategory === 'All' || mappedCatName.toLowerCase() === activeCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-6">
        <div>
          <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">Document Expiry Reminders</h2>
          <p className="text-zinc-500 text-sm mt-1">Real-time alerts and days countdowns for passports, visas, licenses, and contracts.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs font-bold transition-all shadow flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Track Document</span>
        </button>
      </div>

      {/* Categories select & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {['All', 'Passport', 'Visa', 'Driving License', 'Contract'].map((cat, i) => (
            <button 
              key={i}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeCategory === cat 
                  ? 'bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-950 font-bold shadow-sm' 
                  : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
            <Search className="w-4 h-4" />
          </span>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search document names..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 text-xs focus:outline-none placeholder-zinc-400"
          />
        </div>
      </div>

      {/* Grid count cards */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
          <span className="text-xs text-zinc-400 font-mono">Syncing calendar alerts...</span>
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="p-16 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl text-center">
          <Calendar className="w-10 h-10 text-zinc-300 mx-auto mb-4" />
          <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Tracking Board Empty</p>
          <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">Create a document expiration checklist. Secura will notify you 30 days before any document expires so you never pay extra.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc, idx) => {
            const daysRemaining = getDaysRemaining(doc.expiryDate);
            const isExpired = doc.status === 'expired' || daysRemaining <= 0;
            const isCritical = doc.status === 'expiring_soon' || (daysRemaining > 0 && daysRemaining <= 30);

            return (
              <div 
                key={idx}
                className={`p-6 rounded-2xl border bg-white dark:bg-zinc-900 transition-all flex flex-col justify-between hover:shadow-md ${
                  isExpired ? 'border-rose-200 dark:border-rose-950/40 bg-rose-50/5' :
                  isCritical ? 'border-amber-200 dark:border-amber-950/40 bg-amber-50/5 animate-pulse' :
                  'border-zinc-100 dark:border-zinc-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold text-zinc-500 capitalize">
                      {getCategoryName(doc.documentType)}
                    </span>
                    <button 
                      onClick={() => handleDelete(doc.id)}
                      className="p-1 rounded text-zinc-400 hover:text-rose-500 cursor-pointer"
                      title="Stop Tracking"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="font-bold text-zinc-900 dark:text-zinc-50 text-base mt-4 tracking-tight">{doc.title}</h3>
                  {doc.documentNumber && (
                    <p className="text-[10px] text-zinc-400 font-mono mt-0.5">ID: {doc.documentNumber}</p>
                  )}

                  <div className="mt-6 flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-[10px] text-zinc-400 font-semibold uppercase">Days Left</div>
                      <div className={`text-2xl font-black ${
                        isExpired ? 'text-rose-600 dark:text-rose-400' :
                        isCritical ? 'text-amber-600 dark:text-amber-400' :
                        'text-emerald-600 dark:text-emerald-400'
                      }`}>
                        {daysRemaining <= 0 ? 'Expired' : `${daysRemaining}d`}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-zinc-50 dark:border-zinc-800 flex items-center justify-between text-[11px]">
                  <span className="text-zinc-400">Expires: <strong>{doc.expiryDate}</strong></span>
                  <span className={`inline-block px-2.5 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                    isExpired ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400' :
                    isCritical ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400' :
                    'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
                  }`}>
                    {isExpired ? 'expired' : isCritical ? 'expiring soon' : 'valid'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Setup track document Alert Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 md:p-8 animate-scale-up">
            
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4 mb-6">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Track Expiration Reminders</h3>
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
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Document Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Schengen Visa"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 text-xs focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Document number / ID</label>
                  <input 
                    type="text" 
                    value={documentNumber}
                    onChange={(e) => setDocumentNumber(e.target.value)}
                    placeholder="e.g. TX123456"
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Expiry Date</label>
                  <input 
                    type="date" 
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 text-xs focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 text-xs focus:outline-none"
                >
                  <option value="Passport">Passport</option>
                  <option value="Visa">Visa</option>
                  <option value="Driving License">Driving License</option>
                  <option value="Contract">SaaS Contract / Agreement</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Additional memo</label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Needs physical renewal at consulate."
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 text-xs focus:outline-none resize-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800">
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
                  Schedule Track
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SEO-Optimized FAQ Section with JSON-LD Schema */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />
      <div className="mt-16 border-t border-zinc-100 dark:border-zinc-800/80 pt-12 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h3 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Frequently Asked Questions (FAQ)
          </h3>
          <p className="text-zinc-500 text-xs mt-2">
            Have questions about tracking expiry dates, setting alert thresholds, or document management? Find answers here.
          </p>
        </div>

        <div className="space-y-3">
          {faqData.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx} 
                className="rounded-2xl border border-zinc-100 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/30 overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left font-bold text-zinc-800 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors text-xs cursor-pointer select-none"
                >
                  <span>{faq.q}</span>
                  <ChevronDown 
                    className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-zinc-700 dark:text-zinc-200' : ''}`} 
                  />
                </button>
                
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-zinc-50 dark:border-zinc-800/30 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 600+ Words SEO-Optimized Article Section */}
      <article className="mt-20 border-t border-zinc-100 dark:border-zinc-800/80 pt-16 max-w-4xl mx-auto text-zinc-700 dark:text-zinc-300">
        <header className="mb-8">
          <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">SEO Insights & Guide</span>
          <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 mt-1 leading-none tracking-tight">
            Automated Deadline Management: Why Secura is the Best Free Expiry Reminder App
          </h3>
        </header>

        <div className="space-y-6 text-xs leading-relaxed">
          <p>
            Forgetting critical deadlines like passport renewals, vehicle registration periods, professional certifications, or insurance policies is incredibly stressful and can lead to expensive penalties. Secura acts as a reliable <strong className="text-zinc-900 dark:text-zinc-100">personal planner</strong> that integrates an elegant <strong className="text-zinc-900 dark:text-zinc-100">expiry reminder</strong> and deadline checker. By taking control of your essential files using our automated <strong className="text-zinc-900 dark:text-zinc-100">documents expiry reminder</strong> engine, you eliminate the threat of late-fee penalties and passport lapses forever.
          </p>

          <p>
            While many people rely on paper calendars, phone widgets, or basic spreadsheet tables, these static trackers are hard to keep up-to-date and fail to deliver automated notification alerts. Switching to a secure, interactive <strong className="text-zinc-900 dark:text-zinc-100">expiry reminder online</strong> utility means your deadlines are monitored automatically in a unified digital vault. Secura functions as an easy <strong className="text-zinc-900 dark:text-zinc-100">document expiry reminder app</strong> that tracks how many days are left on your credentials. Rather than getting locked out of standard features or facing late fees, our interface provides custom visual indicators (like warning colors and status badges) that trigger well before the actual renewal deadlines are reached.
          </p>

          <p>
            With Secura, you get full, unrestricted access to the best <strong className="text-zinc-900 dark:text-zinc-100">free expiration reminder software</strong> on the web. Once you complete your secure, zero-knowledge <strong className="text-zinc-900 dark:text-zinc-100">expiration reminder login</strong>, you can register unlimited critical items—ranging from official government documents to domestic subscriptions. You can even use it as a highly responsive <strong className="text-zinc-900 dark:text-zinc-100">food expiry reminder app</strong> to avoid kitchen waste and track domestic inventory dates. Secura provides a completely <strong className="text-zinc-900 dark:text-zinc-100">expiry reminder online free</strong> platform that does not require monthly premium packages or forced subscription sign-ups.
          </p>

          <div className="my-8 p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/60">
            <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider mb-3">
              Key Advantages over Expiry Tracker Excel Sheets
            </h4>
            <ul className="space-y-2 list-disc list-inside text-zinc-600 dark:text-zinc-400">
              <li>
                <strong className="text-zinc-800 dark:text-zinc-200">Instant Cloud Access</strong>: Easily check and update your logs from any browser using our <strong className="text-zinc-900 dark:text-zinc-100">expiry reminder online app</strong>, removing the limitations of local <strong className="text-zinc-900 dark:text-zinc-100">expiry tracker excel</strong> files.
              </li>
              <li>
                <strong className="text-zinc-800 dark:text-zinc-200">Automated Warning Thresholds</strong>: Define custom warning alerts (e.g., 30, 60, or 90 days prior to expiry) to start renewal processes early.
              </li>
              <li>
                <strong className="text-zinc-800 dark:text-zinc-200">Unified Document Vault</strong>: Save document numbers, registration identifiers, and expiry dates side-by-side inside your private portfolio.
              </li>
              <li>
                <strong className="text-zinc-800 dark:text-zinc-200">Client-Side Security</strong>: Protect private government credential details using our verified zero-knowledge structure.
              </li>
            </ul>
          </div>

          <p>
            Manual calendars and paper planners suffer from a single fatal flaw: they require active inspection. If you do not open your journal on the exact day a renewal is due, the window passes unnoticed. By migrating your records to an active <strong className="text-zinc-900 dark:text-zinc-100">expiry reminder online check</strong> utility, you move from reactive worry to proactive automation. Secura's dashboard performs real-time daily comparison calculations against the current date, dynamically shifting color statuses from safe green to urgent red as deadlines close in. This provides an instantly recognizable visual hierarchy.
          </p>

          <p>
            Whether you are conducting a quick <strong className="text-zinc-900 dark:text-zinc-100">expiry reminder online check</strong> on your phone or organizing your professional office certifications on a laptop, Secura provides the perfect solution. You can schedule timely notifications, view remaining durations down to the specific day, and maintain structured records of visas, driving licenses, and corporate compliance forms. Pair your daily budget limits and freelancer invoices with a secure, proactive expiry tracker to create a stress-free administrative workflow. Join thousands of users who trust Secura to safeguard their critical timelines and experience the peace of mind that comes with automated deadline checking.
          </p>
        </div>
      </article>

    </div>
  );
}
