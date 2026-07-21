/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Shield, Loader2, RefreshCw, Server, AlertTriangle, Check, Play, PlayCircle, Eye, FileText, Info
} from 'lucide-react';
import { AuditLog } from '../types.js';

interface AdminPanelProps {
  token: string | null;
}

export default function AdminPanel({ token }: AdminPanelProps) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);

  const loadLogs = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/audit-logs', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (e) {
      console.error('Failed to load audit logs:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [token]);

  // Seeding simulation databases
  const handleSeedSimulation = async () => {
    if (!token) return;
    setStatus('Seeding simulation...');
    try {
      const res = await fetch('/api/admin/seed', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setStatus('SaaS Simulation databases seeded successfully! Refreshing feed...');
        setTimeout(() => setStatus(null), 3000);
        loadLogs();
      }
    } catch (e) {
      console.error('Seeding simulation error:', e);
      setStatus('Seeding failed.');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-6">
        <div>
          <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">Admin Control Center</h2>
          <p className="text-zinc-500 text-sm mt-1">SaaS operational cockpit, relational audit log trail, and simulation parameters.</p>
        </div>
        <button 
          onClick={loadLogs}
          className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 transition-colors cursor-pointer"
          title="Reload system trail"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {status && (
        <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900 text-xs font-semibold animate-pulse">
          {status}
        </div>
      )}

      {/* Control panel bento grids */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-4">
          <h3 className="font-bold text-zinc-900 dark:text-zinc-50 text-sm flex items-center gap-1.5">
            <Server className="w-4 h-4 text-zinc-400" />
            <span>SaaS Sandbox Simulator</span>
          </h3>
          <p className="text-xs text-zinc-500 leading-normal">
            Instantly populate the active accounts with compliant dummy invoices, budget caps, expense logs, and credentials for demonstration audits.
          </p>
          <button 
            onClick={handleSeedSimulation}
            className="w-full py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs font-bold transition-all shadow"
          >
            Deploy Seed Parameters
          </button>
        </div>

        <div className="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-3">
          <h3 className="font-bold text-zinc-900 dark:text-zinc-50 text-sm flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-zinc-400" />
            <span>Operational Integrity</span>
          </h3>
          <div className="space-y-2 text-xs font-mono text-zinc-500">
            <div className="flex justify-between border-b border-zinc-50 pb-1.5">
              <span>Database Sync:</span>
              <span className="text-emerald-500 font-bold">ONLINE</span>
            </div>
            <div className="flex justify-between border-b border-zinc-50 pb-1.5">
              <span>Schema Integrity:</span>
              <span className="text-emerald-500 font-bold">SECURE (SHA256)</span>
            </div>
            <div className="flex justify-between">
              <span>Soft Delete Policy:</span>
              <span className="text-indigo-500 font-bold">ACTIVE</span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-3">
          <h3 className="font-bold text-zinc-900 dark:text-zinc-50 text-sm flex items-center gap-1.5">
            <Info className="w-4 h-4 text-zinc-400" />
            <span>Encryption Summary</span>
          </h3>
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            All user credentials undergo full server-side encryption via AES-256-CBC with localized password hashing keys. Actions are logged to prevent tampering.
          </p>
        </div>
      </div>

      {/* System Audit logs lists */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/30">
          <h3 className="font-bold text-zinc-900 dark:text-zinc-50 text-sm">System Audit Trail</h3>
          <p className="text-[11px] text-zinc-400 mt-1">Real-time unmodifiable log of credential decryption calls, deleted elements, budget breaches, and auth sessions.</p>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-zinc-400">Loading audit trail...</div>
        ) : logs.length === 0 ? (
          <div className="py-12 text-center text-xs text-zinc-400">No logs captured yet in this current workspace.</div>
        ) : (
          <div className="divide-y divide-zinc-50 dark:divide-zinc-800/60 font-mono text-[11px]">
            {logs.map((log, i) => (
              <div key={i} className="p-4 flex items-start justify-between hover:bg-zinc-50/50 dark:hover:bg-zinc-950/20 transition-colors">
                <div className="space-y-1 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-400">[{log.timestamp}]</span>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">{log.action}</span>
                  </div>
                  <p className="text-zinc-500">{log.details}</p>
                </div>
                <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[10px] text-zinc-400">
                  ID: {log.id.slice(0, 8)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
