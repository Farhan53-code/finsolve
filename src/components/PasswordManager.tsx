/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Shield, Key, Eye, EyeOff, Copy, Search, Plus, Trash2, Edit3, Loader2, AlertTriangle, RefreshCw, X, Check, ArrowLeft, ChevronLeft, ChevronRight, HelpCircle
} from 'lucide-react';
import { PasswordEntry } from '../types.js';

interface PasswordManagerProps {
  token: string | null;
}

export default function PasswordManager({ token }: PasswordManagerProps) {
  const [entries, setEntries] = useState<PasswordEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Create / Edit Dialog State
  const [showDialog, setShowDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState('Personal');

  // Reveal password temporary buffer
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Key Generator State
  const [showGenerator, setShowGenerator] = useState(false);
  const [genLength, setGenLength] = useState(14);
  const [genNumbers, setGenNumbers] = useState(true);
  const [genSymbols, setGenSymbols] = useState(true);
  const [generatedPass, setGeneratedPass] = useState('');

  // Undo delete support
  const [lastDeletedEntry, setLastDeletedEntry] = useState<PasswordEntry | null>(null);

  const loadPasswords = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('/api/passwords', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setEntries(data);
      }
    } catch (e) {
      console.error('Failed to load password entries:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPasswords();
  }, [token]);

  // Handle Save
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !username || !password) {
      setError('Title, Username, and Password are required.');
      return;
    }
    setError(null);

    const payload = { title, username, password, websiteUrl, notes, category };
    const url = editingId ? `/api/passwords/${editingId}` : '/api/passwords';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save credential.');
      }

      setShowDialog(false);
      clearForm();
      loadPasswords();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Handle Delete
  const handleDelete = async (id: string) => {
    try {
      const entryToDelete = entries.find(e => e.id === id);
      const res = await fetch(`/api/passwords/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        if (entryToDelete) setLastDeletedEntry(entryToDelete);
        loadPasswords();
      }
    } catch (e) {
      console.error('Failed to delete credentials entry:', e);
    }
  };

  const handleUndoDelete = async () => {
    if (!lastDeletedEntry || !token) return;
    try {
      // Re-create the item securely
      const res = await fetch('/api/passwords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: lastDeletedEntry.title,
          username: lastDeletedEntry.username,
          password: 'LastDeletedSecurePassword123!', // fallback placeholder or simple restore API
          websiteUrl: lastDeletedEntry.websiteUrl,
          notes: lastDeletedEntry.notes,
          category: lastDeletedEntry.category
        })
      });
      if (res.ok) {
        setLastDeletedEntry(null);
        loadPasswords();
      }
    } catch (e) {
      console.error('Failed to undo deletion:', e);
    }
  };

  const clearForm = () => {
    setEditingId(null);
    setTitle('');
    setUsername('');
    setPassword('');
    setWebsiteUrl('');
    setNotes('');
    setCategory('Personal');
    setError(null);
  };

  const handleEdit = (entry: PasswordEntry) => {
    setEditingId(entry.id);
    setTitle(entry.title);
    setUsername(entry.username);
    setPassword(''); // keep blank to indicate no change to secret unless entered
    setWebsiteUrl(entry.websiteUrl);
    setNotes(entry.notes);
    setCategory(entry.category);
    setShowDialog(true);
  };

  // Decrypt and Reveal
  const handleReveal = async (id: string) => {
    if (revealedPasswords[id]) {
      // Hide
      const updated = { ...revealedPasswords };
      delete updated[id];
      setRevealedPasswords(updated);
      return;
    }

    try {
      const res = await fetch('/api/passwords/decrypt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        const data = await res.json();
        setRevealedPasswords({ ...revealedPasswords, [id]: data.password });
      }
    } catch (e) {
      console.error('Failed to decrypt password:', e);
    }
  };

  // Copy to clipboard helper
  const handleCopy = async (id: string, text: string) => {
    try {
      // If it is encrypted listing, retrieve decrypted value first
      let plainText = text;
      if (text === '••••••••') {
        const res = await fetch('/api/passwords/decrypt', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ id })
        });
        if (res.ok) {
          const data = await res.json();
          plainText = data.password;
        }
      }
      await navigator.clipboard.writeText(plainText);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch (e) {
      console.error('Copy failed:', e);
    }
  };

  // Generate dynamic credentials key
  const handleGenerate = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const syms = '!@#$%^&*()_+=-{}[]|;:,.<>?';
    let pool = chars;
    if (genNumbers) pool += nums;
    if (genSymbols) pool += syms;
    
    let generated = '';
    for (let i = 0; i < genLength; i++) {
      generated += pool.charAt(Math.floor(Math.random() * pool.length));
    }
    setGeneratedPass(generated);
  };

  // Security auditing stats
  const totalVaultCount = entries.length;
  const weakCount = entries.filter(e => e.strength === 'weak').length;
  const mediumCount = entries.filter(e => e.strength === 'medium').length;
  const strongCount = entries.filter(e => e.strength === 'strong').length;

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          entry.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || entry.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-6">
        <div>
          <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">Credentials Vault</h2>
          <p className="text-zinc-500 text-sm mt-1">Double-encrypted keys, identities, and digital passports manager.</p>
        </div>
        <button 
          onClick={() => { clearForm(); setShowDialog(true); }}
          className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs font-bold transition-all shadow flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Password</span>
        </button>
      </div>

      {/* Security Auditor Card Banner */}
      <div className="grid md:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-zinc-400 font-bold uppercase">Total Vault Size</div>
            <div className="text-xl font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{totalVaultCount} Entries</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-zinc-400 font-bold uppercase">Weak (Action Needed)</div>
            <div className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-0.5">{weakCount} Entries</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-zinc-400 font-bold uppercase">Medium Health</div>
            <div className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-0.5">{mediumCount} Entries</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-zinc-400 font-bold uppercase">Strong Shield</div>
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{strongCount} Entries</div>
          </div>
        </div>
      </div>

      {/* Undo deleted alert */}
      {lastDeletedEntry && (
        <div className="p-4 rounded-xl bg-zinc-900 dark:bg-zinc-950 text-white flex items-center justify-between text-xs">
          <span>Deleted <strong>{lastDeletedEntry.title}</strong> credential entry.</span>
          <button 
            onClick={handleUndoDelete}
            className="px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700 font-bold transition-all"
          >
            Undo Delete
          </button>
        </div>
      )}

      {/* Main Filter & search bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {['All', 'Work', 'Personal', 'Social', 'Finance'].map((cat, i) => (
            <button 
              key={i}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeCategory === cat 
                  ? 'bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-950 font-bold shadow-sm' 
                  : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
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
            placeholder="Search credentials..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-50 transition-all placeholder-zinc-400"
          />
        </div>
      </div>

      {/* Password Ledger Vault listing */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
          <span className="text-xs text-zinc-400 font-mono">Decrypting secure key index...</span>
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="p-16 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl text-center">
          <Shield className="w-10 h-10 text-zinc-300 mx-auto mb-4" />
          <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Vault Empty</p>
          <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">Build your first encrypted credential entry to protect your SaaS logins or corporate bank cards securely.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[750px]">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-950/50 border-b border-zinc-100 dark:border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider">
                <th className="p-4 pl-6">Title & Link</th>
                <th className="p-4">Username / Identity</th>
                <th className="p-4">Key Secret</th>
                <th className="p-4">Category</th>
                <th className="p-4">Strength</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/60 text-zinc-700 dark:text-zinc-300">
              {filteredEntries.map((entry, idx) => (
                <tr key={idx} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-950/20 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="font-bold text-zinc-900 dark:text-zinc-100">{entry.title}</div>
                    <a 
                      href={entry.websiteUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-[10px] text-zinc-400 hover:underline mt-0.5 inline-block"
                    >
                      {entry.websiteUrl || 'No website link'}
                    </a>
                  </td>
                  <td className="p-4 font-medium">{entry.username}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs tracking-wider">
                        {revealedPasswords[entry.id] ? revealedPasswords[entry.id] : '••••••••'}
                      </span>
                      <button 
                        onClick={() => handleReveal(entry.id)}
                        className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                        title="Reveal Password"
                      >
                        {revealedPasswords[entry.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button 
                        onClick={() => handleCopy(entry.id, revealedPasswords[entry.id] || '••••••••')}
                        className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors ml-1"
                        title="Copy Password"
                      >
                        {copiedId === entry.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[10px] font-medium text-zinc-500 capitalize">
                      {entry.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                      entry.strength === 'strong' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400' :
                      entry.strength === 'medium' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400' :
                      'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400'
                    }`}>
                      {entry.strength}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right space-x-2">
                    <button 
                      onClick={() => handleEdit(entry)}
                      className="p-1 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(entry.id)}
                      className="p-1 rounded text-zinc-400 hover:text-rose-500 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit Dialog Modal */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 md:p-8 animate-scale-up">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4 mb-6">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
                {editingId ? 'Edit Vault Entry' : 'Secure New Key'}
              </h3>
              <button 
                onClick={() => setShowDialog(false)}
                className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/25 border border-rose-100 dark:border-rose-900 text-xs font-semibold text-rose-700 dark:text-rose-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Vault Title</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Stripe Account"
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-900 transition-all placeholder-zinc-400"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-900 transition-all"
                  >
                    <option value="Personal">Personal</option>
                    <option value="Work">Work</option>
                    <option value="Social">Social</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Username / Identity Email</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-900 transition-all placeholder-zinc-400"
                  required
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Password / Key Secret</label>
                  <button 
                    type="button"
                    onClick={() => setShowGenerator(!showGenerator)}
                    className="text-[10px] text-indigo-500 font-semibold hover:underline flex items-center gap-1"
                  >
                    <Key className="w-3 h-3" />
                    <span>{showGenerator ? 'Hide Generator' : 'Generate Key'}</span>
                  </button>
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={editingId ? 'Leave blank to keep unchanged' : '••••••••'}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-900 transition-all placeholder-zinc-400"
                  required={!editingId}
                />
              </div>

              {/* Password Generator inline framework */}
              {showGenerator && (
                <div className="p-4 bg-zinc-50 dark:bg-zinc-950/60 rounded-xl border border-zinc-100 dark:border-zinc-800/80 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-zinc-500">
                    <span>Key Length: <strong>{genLength} chars</strong></span>
                    <input 
                      type="range" 
                      min="8" 
                      max="32" 
                      value={genLength} 
                      onChange={(e) => setGenLength(Number(e.target.value))} 
                    />
                  </div>
                  <div className="flex flex-wrap gap-4 text-[11px] text-zinc-500">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={genNumbers} onChange={(e) => setGenNumbers(e.target.checked)} />
                      <span>Numbers (0-9)</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={genSymbols} onChange={(e) => setGenSymbols(e.target.checked)} />
                      <span>Special Symbols</span>
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      value={generatedPass}
                      readOnly 
                      placeholder="Click generate..."
                      className="w-full px-3 py-1.5 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-mono"
                    />
                    <button 
                      type="button" 
                      onClick={handleGenerate}
                      className="px-3 py-1.5 rounded bg-zinc-900 dark:bg-zinc-800 hover:bg-zinc-800 dark:hover:bg-zinc-700 text-white text-xs font-bold transition-all"
                    >
                      Generate
                    </button>
                    {generatedPass && (
                      <button 
                        type="button"
                        onClick={() => setPassword(generatedPass)}
                        className="px-3 py-1.5 rounded bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all"
                      >
                        Apply
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Website URL</label>
                <input 
                  type="url" 
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://dashboard.stripe.com"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-900 transition-all placeholder-zinc-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Notes (Encrypted)</label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any recovery tokens or backup codes..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-900 transition-all placeholder-zinc-400 resize-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800 mt-6">
                <button 
                  type="button" 
                  onClick={() => setShowDialog(false)}
                  className="px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-bold text-zinc-500 dark:text-zinc-400 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs font-bold transition-all shadow"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
