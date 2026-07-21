/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum AppRoute {
  LANDING = 'landing',
  LOGIN = 'login',
  REGISTER = 'register',
  FORGOT_PASSWORD = 'forgot-password',
  RESET_PASSWORD = 'reset-password',
  DASHBOARD = 'dashboard',
  PASSWORD_MANAGER = 'password-manager',
  INVOICE_GENERATOR = 'invoice-generator',
  BUDGET_PLANNER = 'budget-planner',
  EXPENSE_TRACKER = 'expense-tracker',
  EXPIRY_REMINDER = 'expiry-reminder',
  SETTINGS = 'settings',
  ADMIN_PANEL = 'admin-panel',
  PRICING = 'pricing',
  HELP = 'help',
  ABOUT_US = 'about-us',
  TERMS = 'terms',
  CONTACT_US = 'contact-us',
  DISCLAIMER = 'disclaimer',
  PRIVACY = 'privacy',
  REFUND = 'refund'
}

export enum SubscriptionPlan {
  FREE = 'free',
  PREMIUM = 'premium',
  ADMIN = 'admin'
}

export interface User {
  id: string;
  email: string;
  name: string;
  plan: SubscriptionPlan;
  createdAt: string;
  updatedAt: string;
  rememberMe?: boolean;
  mobile?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  email: string;
  action: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

// Password Manager Entity
export interface PasswordEntry {
  id: string;
  userId: string;
  title: string;
  username: string;
  encryptedPassword?: string; // Stored server-side
  passwordLength?: number; // Visual placeholder for UI
  websiteUrl: string;
  notes: string;
  category: string; // e.g. Work, Personal, Social, Finance
  strength: 'weak' | 'medium' | 'strong';
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

// Invoice Generator Entities
export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  userId: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  clientAddress?: string;
  createdDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number; // Percentage
  taxAmount: number;
  discountRate: number; // Percentage
  discountAmount: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  currency: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

// Budget Planner Entity
export interface Budget {
  id: string;
  userId: string;
  category: string; // e.g. Food, Utilities, Rent, Travel, Entertainment
  amountLimit: number;
  period: 'monthly' | 'yearly';
  spentAmount: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

// Expense Tracker Entity
export interface Expense {
  id: string;
  userId: string;
  budgetId?: string; // Optional relation to Budget
  category: string;
  amount: number;
  description: string;
  date: string;
  paymentMethod: 'cash' | 'card' | 'bank_transfer' | 'crypto' | 'other';
  merchantName?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

// Document Expiry Reminder Entity
export interface DocumentReminder {
  id: string;
  userId: string;
  title: string;
  documentType: 'passport' | 'visa' | 'driver_license' | 'insurance' | 'national_id' | 'other';
  documentNumber: string;
  expiryDate: string;
  notes: string;
  alertDaysBefore: number; // e.g. 30, 60, 90
  status: 'valid' | 'expiring_soon' | 'expired';
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

// Common System Notification
export interface SystemNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  read: boolean;
  createdAt: string;
}

// Client Side Context State
export interface AppState {
  user: User | null;
  activeRoute: AppRoute;
  theme: 'light' | 'dark';
  notifications: SystemNotification[];
  auditLogs: AuditLog[];
  searchQuery: string;
}
