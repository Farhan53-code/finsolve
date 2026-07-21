/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as fs from 'fs';
import * as path from 'path';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, collection, getDocs, doc, setDoc, deleteDoc 
} from 'firebase/firestore';
import { 
  User, PasswordEntry, Invoice, Budget, Expense, DocumentReminder, AuditLog, SystemNotification 
} from './src/types.js';

// Firebase Client Configuration provided by user
const firebaseConfig = {
  apiKey: "AIzaSyC31Z3auemmmhEQbQ_IPdseW0sncObjCtk",
  authDomain: "invoice-generator-653a2.firebaseapp.com",
  databaseURL: "https://invoice-generator-653a2-default-rtdb.firebaseio.com",
  projectId: "invoice-generator-653a2",
  storageBucket: "invoice-generator-653a2.firebasestorage.app",
  messagingSenderId: "429543997108",
  appId: "1:429543997108:web:4468a19d307ef50dcc61e1",
  measurementId: "G-CH298M7BYG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestoreDb = getFirestore(app);

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

interface Schema {
  users: User[];
  passwords: PasswordEntry[];
  invoices: Invoice[];
  budgets: Budget[];
  expenses: Expense[];
  documents: DocumentReminder[];
  auditLogs: AuditLog[];
  notifications: SystemNotification[];
}

// Initial default state
const initialSchema: Schema = {
  users: [],
  passwords: [],
  invoices: [],
  budgets: [],
  expenses: [],
  documents: [],
  auditLogs: [],
  notifications: []
};

// Thread-safe-ish memory cache
let dbCache: Schema = { ...initialSchema };

// Initialize directories and file
function initDb() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialSchema, null, 2));
    dbCache = { ...initialSchema };
  } else {
    try {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      dbCache = JSON.parse(data);
    } catch (e) {
      console.error('Error loading database, resetting to safe initial state:', e);
      dbCache = { ...initialSchema };
    }
  }
}

// Persist current state to disk
function saveDb() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(dbCache, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to save database to disk:', e);
  }
}

// Clean data for Firestore by removing any fields with 'undefined' values recursively
function cleanForFirestore(obj: any): any {
  if (obj === null || obj === undefined) return null;
  if (Array.isArray(obj)) {
    return obj.map(cleanForFirestore);
  }
  if (typeof obj === 'object') {
    const cleaned: any = {};
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      if (val !== undefined) {
        cleaned[key] = cleanForFirestore(val);
      }
    }
    return cleaned;
  }
  return obj;
}

// Write helper for Firestore (Async fire-and-forget)
function writeToFirestore(collectionName: string, docId: string, data: any) {
  const cleanedData = cleanForFirestore(data);
  setDoc(doc(firestoreDb, collectionName, docId), cleanedData, { merge: true })
    .then(() => {
      console.log(`[Firestore Sync] Successfully written ${collectionName}/${docId}`);
    })
    .catch((err) => {
      console.error(`[Firestore Error] Failed to write ${collectionName}/${docId}:`, err);
    });
}

// Connect to Firestore and Sync/Migrate on server bootup
async function syncAndMigrateWithFirestore() {
  try {
    console.log("[Firestore Sync] Connecting and loading from Firestore cloud database...");
    const collections = ['users', 'passwords', 'invoices', 'budgets', 'expenses', 'documents', 'auditLogs', 'notifications'];
    
    // First read what's in local JSON
    initDb();
    
    for (const collName of collections) {
      const collRef = collection(firestoreDb, collName);
      const snapshot = await getDocs(collRef);
      
      if (snapshot.empty) {
        // Migrate local items to Firestore if cloud collection is empty
        const localItems = (dbCache as any)[collName] || [];
        if (localItems.length > 0) {
          console.log(`[Firestore Migrate] Uploading ${localItems.length} local items to empty Firestore collection '${collName}'...`);
          for (const item of localItems) {
            const docId = item.id || Math.random().toString(36).substring(2, 11);
            const cleanedItem = cleanForFirestore(item);
            await setDoc(doc(firestoreDb, collName, docId), cleanedItem, { merge: true });
          }
        }
      } else {
        // Load data from Firestore to local cache
        const cloudDocs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        (dbCache as any)[collName] = cloudDocs;
        console.log(`[Firestore Sync] Loaded ${cloudDocs.length} items from cloud collection '${collName}'`);
      }
    }
    
    console.log("[Firestore Sync] Complete. Local database cache is synchronized with cloud.");
    saveDb();
  } catch (error) {
    console.error("[Firestore Sync Error] Sync failed, operating with local backup JSON:", error);
  }
}

// Start async synchronization
syncAndMigrateWithFirestore();

// Relational Operations Engine with Indexing support
export const db = {
  // Read operations
  getUsers: () => dbCache.users,
  getPasswords: (userId: string) => {
    return dbCache.passwords.filter(p => p.userId === userId && !p.deletedAt);
  },
  getInvoices: (userId: string) => {
    return dbCache.invoices.filter(i => i.userId === userId && !i.deletedAt);
  },
  getBudgets: (userId: string) => {
    return dbCache.budgets.filter(b => b.userId === userId && !b.deletedAt);
  },
  getExpenses: (userId: string) => {
    return dbCache.expenses.filter(e => e.userId === userId && !e.deletedAt);
  },
  getDocuments: (userId: string) => {
    return dbCache.documents.filter(d => d.userId === userId && !d.deletedAt);
  },
  getAuditLogs: (userId?: string) => {
    if (userId) {
      return dbCache.auditLogs.filter(l => l.userId === userId);
    }
    return dbCache.auditLogs;
  },
  getNotifications: (userId: string) => {
    return dbCache.notifications.filter(n => n.userId === userId);
  },

  // Write operations (Transactional-style)
  createUser: (user: Omit<User, 'createdAt' | 'updatedAt'>): User => {
    const now = new Date().toISOString();
    const newUser: User = {
      ...user,
      createdAt: now,
      updatedAt: now
    };
    dbCache.users.push(newUser);
    saveDb();
    
    // Save to Firestore
    writeToFirestore('users', newUser.id, newUser);
    
    db.logAudit(newUser.id, newUser.email, 'USER_REGISTERED', 'User registered their profile.');
    return newUser;
  },

  updateUserPlan: (userId: string, plan: any) => {
    const user = dbCache.users.find(u => u.id === userId);
    if (user) {
      user.plan = plan;
      user.updatedAt = new Date().toISOString();
      saveDb();
      
      // Save to Firestore
      writeToFirestore('users', userId, user);
      
      db.logAudit(userId, user.email, 'SUBSCRIPTION_UPGRADED', `Upgraded to ${plan} plan.`);
      return user;
    }
    return null;
  },

  // Passwords
  addPassword: (userId: string, entry: Omit<PasswordEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'strength'> & { encryptedPassword: string, strength: 'weak' | 'medium' | 'strong' }): PasswordEntry => {
    const now = new Date().toISOString();
    const newEntry: PasswordEntry = {
      ...entry,
      id: Math.random().toString(36).substring(2, 11),
      userId,
      createdAt: now,
      updatedAt: now
    };
    dbCache.passwords.push(newEntry);
    saveDb();
    
    // Save to Firestore
    writeToFirestore('passwords', newEntry.id, newEntry);

    const u = dbCache.users.find(x => x.id === userId);
    db.logAudit(userId, u?.email || 'unknown', 'PASSWORD_CREATED', `Added credential: ${entry.title}`);
    return newEntry;
  },

  updatePassword: (userId: string, id: string, fields: Partial<PasswordEntry>): PasswordEntry | null => {
    const index = dbCache.passwords.findIndex(p => p.id === id && p.userId === userId);
    if (index !== -1) {
      const now = new Date().toISOString();
      dbCache.passwords[index] = {
        ...dbCache.passwords[index],
        ...fields,
        updatedAt: now
      };
      saveDb();
      
      // Save to Firestore
      writeToFirestore('passwords', id, dbCache.passwords[index]);

      const u = dbCache.users.find(x => x.id === userId);
      db.logAudit(userId, u?.email || 'unknown', 'PASSWORD_UPDATED', `Updated credential: ${dbCache.passwords[index].title}`);
      return dbCache.passwords[index];
    }
    return null;
  },

  deletePassword: (userId: string, id: string) => {
    const index = dbCache.passwords.findIndex(p => p.id === id && p.userId === userId);
    if (index !== -1) {
      // Soft Delete
      dbCache.passwords[index].deletedAt = new Date().toISOString();
      saveDb();
      
      // Save to Firestore
      writeToFirestore('passwords', id, dbCache.passwords[index]);

      const u = dbCache.users.find(x => x.id === userId);
      db.logAudit(userId, u?.email || 'unknown', 'PASSWORD_DELETED', `Deleted credential (soft-delete): ${dbCache.passwords[index].title}`);
      return true;
    }
    return false;
  },

  // Invoices
  addInvoice: (userId: string, invoice: Omit<Invoice, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Invoice => {
    const now = new Date().toISOString();
    const newInvoice: Invoice = {
      ...invoice,
      id: Math.random().toString(36).substring(2, 11),
      userId,
      createdAt: now,
      updatedAt: now
    };
    dbCache.invoices.push(newInvoice);
    saveDb();
    
    // Save to Firestore
    writeToFirestore('invoices', newInvoice.id, newInvoice);

    const u = dbCache.users.find(x => x.id === userId);
    db.logAudit(userId, u?.email || 'unknown', 'INVOICE_CREATED', `Created invoice ${invoice.invoiceNumber} to ${invoice.clientName}`);
    return newInvoice;
  },

  updateInvoice: (userId: string, id: string, fields: Partial<Invoice>): Invoice | null => {
    const index = dbCache.invoices.findIndex(i => i.id === id && i.userId === userId);
    if (index !== -1) {
      const now = new Date().toISOString();
      dbCache.invoices[index] = {
        ...dbCache.invoices[index],
        ...fields,
        updatedAt: now
      };
      saveDb();
      
      // Save to Firestore
      writeToFirestore('invoices', id, dbCache.invoices[index]);

      const u = dbCache.users.find(x => x.id === userId);
      db.logAudit(userId, u?.email || 'unknown', 'INVOICE_UPDATED', `Updated invoice ${dbCache.invoices[index].invoiceNumber}`);
      return dbCache.invoices[index];
    }
    return null;
  },

  deleteInvoice: (userId: string, id: string) => {
    const index = dbCache.invoices.findIndex(i => i.id === id && i.userId === userId);
    if (index !== -1) {
      dbCache.invoices[index].deletedAt = new Date().toISOString();
      saveDb();
      
      // Save to Firestore
      writeToFirestore('invoices', id, dbCache.invoices[index]);

      const u = dbCache.users.find(x => x.id === userId);
      db.logAudit(userId, u?.email || 'unknown', 'INVOICE_DELETED', `Deleted invoice (soft-delete): ${dbCache.invoices[index].invoiceNumber}`);
      return true;
    }
    return false;
  },

  // Budgets
  addBudget: (userId: string, budget: Omit<Budget, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'spentAmount'>): Budget => {
    const now = new Date().toISOString();
    const activeExpenses = dbCache.expenses.filter(e => e.userId === userId && e.category === budget.category && !e.deletedAt);
    const spentAmount = activeExpenses.reduce((sum, e) => sum + e.amount, 0);

    const newBudget: Budget = {
      ...budget,
      id: Math.random().toString(36).substring(2, 11),
      userId,
      spentAmount,
      createdAt: now,
      updatedAt: now
    };
    dbCache.budgets.push(newBudget);
    saveDb();
    
    // Save to Firestore
    writeToFirestore('budgets', newBudget.id, newBudget);

    const u = dbCache.users.find(x => x.id === userId);
    db.logAudit(userId, u?.email || 'unknown', 'BUDGET_CREATED', `Set budget for ${budget.category}: $${budget.amountLimit}`);
    return newBudget;
  },

  updateBudget: (userId: string, id: string, fields: Partial<Budget>): Budget | null => {
    const index = dbCache.budgets.findIndex(b => b.id === id && b.userId === userId);
    if (index !== -1) {
      const now = new Date().toISOString();
      dbCache.budgets[index] = {
        ...dbCache.budgets[index],
        ...fields,
        updatedAt: now
      };
      saveDb();
      
      // Save to Firestore
      writeToFirestore('budgets', id, dbCache.budgets[index]);

      const u = dbCache.users.find(x => x.id === userId);
      db.logAudit(userId, u?.email || 'unknown', 'BUDGET_UPDATED', `Updated budget for ${dbCache.budgets[index].category}`);
      return dbCache.budgets[index];
    }
    return null;
  },

  deleteBudget: (userId: string, id: string) => {
    const index = dbCache.budgets.findIndex(b => b.id === id && b.userId === userId);
    if (index !== -1) {
      dbCache.budgets[index].deletedAt = new Date().toISOString();
      saveDb();
      
      // Save to Firestore
      writeToFirestore('budgets', id, dbCache.budgets[index]);

      const u = dbCache.users.find(x => x.id === userId);
      db.logAudit(userId, u?.email || 'unknown', 'BUDGET_DELETED', `Deleted budget (soft-delete) for ${dbCache.budgets[index].category}`);
      return true;
    }
    return false;
  },

  // Expenses
  addExpense: (userId: string, expense: Omit<Expense, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Expense => {
    const now = new Date().toISOString();
    const budget = dbCache.budgets.find(b => b.userId === userId && b.category === expense.category && !b.deletedAt);
    
    const newExpense: Expense = {
      ...expense,
      id: Math.random().toString(36).substring(2, 11),
      userId,
      budgetId: budget?.id,
      createdAt: now,
      updatedAt: now
    };
    dbCache.expenses.push(newExpense);

    // Relational sync: Update spentAmount in corresponding budget
    if (budget) {
      budget.spentAmount += expense.amount;
      budget.updatedAt = now;
      
      // Auto-trigger budget warning if exceeded
      if (budget.spentAmount > budget.amountLimit) {
        db.addNotification(userId, {
          title: `Budget Limit Exceeded: ${budget.category}`,
          message: `Your expenses of $${budget.spentAmount.toFixed(2)} have exceeded the budget limit of $${budget.amountLimit.toFixed(2)}.`,
          type: 'warning'
        });
      }
      // Save updated budget
      writeToFirestore('budgets', budget.id, budget);
    }

    saveDb();
    
    // Save to Firestore
    writeToFirestore('expenses', newExpense.id, newExpense);

    const u = dbCache.users.find(x => x.id === userId);
    db.logAudit(userId, u?.email || 'unknown', 'EXPENSE_TRACKED', `Logged expense: $${expense.amount} to ${expense.category}`);
    return newExpense;
  },

  updateExpense: (userId: string, id: string, fields: Partial<Expense>): Expense | null => {
    const index = dbCache.expenses.findIndex(e => e.id === id && e.userId === userId);
    if (index !== -1) {
      const now = new Date().toISOString();
      const oldExpense = { ...dbCache.expenses[index] };
      dbCache.expenses[index] = {
        ...dbCache.expenses[index],
        ...fields,
        updatedAt: now
      };

      // Sync budget calculations if category or amount changed
      if (oldExpense.category !== dbCache.expenses[index].category || oldExpense.amount !== dbCache.expenses[index].amount) {
        dbCache.budgets.forEach(b => {
          if (b.userId === userId && !b.deletedAt) {
            const activeExpenses = dbCache.expenses.filter(e => e.userId === userId && e.category === b.category && !e.deletedAt);
            b.spentAmount = activeExpenses.reduce((sum, e) => sum + e.amount, 0);
            b.updatedAt = now;
            
            // Save updated budget to Firestore
            writeToFirestore('budgets', b.id, b);
          }
        });
      }

      saveDb();
      
      // Save to Firestore
      writeToFirestore('expenses', id, dbCache.expenses[index]);

      const u = dbCache.users.find(x => x.id === userId);
      db.logAudit(userId, u?.email || 'unknown', 'EXPENSE_UPDATED', `Updated expense: $${dbCache.expenses[index].amount}`);
      return dbCache.expenses[index];
    }
    return null;
  },

  deleteExpense: (userId: string, id: string) => {
    const index = dbCache.expenses.findIndex(e => e.id === id && e.userId === userId);
    if (index !== -1) {
      const deletedExpense = dbCache.expenses[index];
      dbCache.expenses[index].deletedAt = new Date().toISOString();

      const now = new Date().toISOString();
      dbCache.budgets.forEach(b => {
        if (b.userId === userId && b.category === deletedExpense.category && !b.deletedAt) {
          const activeExpenses = dbCache.expenses.filter(e => e.userId === userId && e.category === b.category && !e.deletedAt);
          b.spentAmount = activeExpenses.reduce((sum, e) => sum + e.amount, 0);
          b.updatedAt = now;
          
          // Save updated budget to Firestore
          writeToFirestore('budgets', b.id, b);
        }
      });

      saveDb();
      
      // Save to Firestore
      writeToFirestore('expenses', id, dbCache.expenses[index]);

      const u = dbCache.users.find(x => x.id === userId);
      db.logAudit(userId, u?.email || 'unknown', 'EXPENSE_DELETED', `Deleted expense: $${deletedExpense.amount}`);
      return true;
    }
    return false;
  },

  // Documents
  addDocument: (userId: string, docEntry: Omit<DocumentReminder, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'status'>): DocumentReminder => {
    const now = new Date().toISOString();
    const expiry = new Date(docEntry.expiryDate).getTime();
    const today = new Date().getTime();
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    
    let status: 'valid' | 'expiring_soon' | 'expired' = 'valid';
    if (diffDays < 0) {
      status = 'expired';
    } else if (diffDays <= docEntry.alertDaysBefore) {
      status = 'expiring_soon';
    }

    const newDoc: DocumentReminder = {
      ...docEntry,
      id: Math.random().toString(36).substring(2, 11),
      userId,
      status,
      createdAt: now,
      updatedAt: now
    };
    dbCache.documents.push(newDoc);
    saveDb();
    
    // Save to Firestore
    writeToFirestore('documents', newDoc.id, newDoc);

    const u = dbCache.users.find(x => x.id === userId);
    db.logAudit(userId, u?.email || 'unknown', 'DOCUMENT_CREATED', `Registered document: ${docEntry.title}`);
    
    if (status !== 'valid') {
      db.addNotification(userId, {
        title: status === 'expired' ? `Document Expired: ${docEntry.title}` : `Document Expiring Soon: ${docEntry.title}`,
        message: status === 'expired' 
          ? `Your ${docEntry.documentType} has expired on ${docEntry.expiryDate}.` 
          : `Your ${docEntry.documentType} expires in ${diffDays} days on ${docEntry.expiryDate}.`,
        type: status === 'expired' ? 'alert' : 'warning'
      });
    }

    return newDoc;
  },

  updateDocument: (userId: string, id: string, fields: Partial<DocumentReminder>): DocumentReminder | null => {
    const index = dbCache.documents.findIndex(d => d.id === id && d.userId === userId);
    if (index !== -1) {
      const now = new Date().toISOString();
      dbCache.documents[index] = {
        ...dbCache.documents[index],
        ...fields,
        updatedAt: now
      };

      const expiry = new Date(dbCache.documents[index].expiryDate).getTime();
      const today = new Date().getTime();
      const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
      
      let status: 'valid' | 'expiring_soon' | 'expired' = 'valid';
      if (diffDays < 0) {
        status = 'expired';
      } else if (diffDays <= dbCache.documents[index].alertDaysBefore) {
        status = 'expiring_soon';
      }
      dbCache.documents[index].status = status;

      saveDb();
      
      // Save to Firestore
      writeToFirestore('documents', id, dbCache.documents[index]);

      const u = dbCache.users.find(x => x.id === userId);
      db.logAudit(userId, u?.email || 'unknown', 'DOCUMENT_UPDATED', `Updated document ${dbCache.documents[index].title}`);
      return dbCache.documents[index];
    }
    return null;
  },

  deleteDocument: (userId: string, id: string) => {
    const index = dbCache.documents.findIndex(d => d.id === id && d.userId === userId);
    if (index !== -1) {
      dbCache.documents[index].deletedAt = new Date().toISOString();
      saveDb();
      
      // Save to Firestore
      writeToFirestore('documents', id, dbCache.documents[index]);

      const u = dbCache.users.find(x => x.id === userId);
      db.logAudit(userId, u?.email || 'unknown', 'DOCUMENT_DELETED', `Deleted document (soft-delete): ${dbCache.documents[index].title}`);
      return true;
    }
    return false;
  },

  // Notifications
  addNotification: (userId: string, notif: Omit<SystemNotification, 'id' | 'userId' | 'read' | 'createdAt'>): SystemNotification => {
    const newNotif: SystemNotification = {
      ...notif,
      id: Math.random().toString(36).substring(2, 11),
      userId,
      read: false,
      createdAt: new Date().toISOString()
    };
    dbCache.notifications.unshift(newNotif);
    saveDb();
    
    // Save to Firestore
    writeToFirestore('notifications', newNotif.id, newNotif);

    return newNotif;
  },

  markNotificationsRead: (userId: string) => {
    dbCache.notifications.forEach(n => {
      if (n.userId === userId) {
        n.read = true;
        writeToFirestore('notifications', n.id, n);
      }
    });
    saveDb();
    return true;
  },

  // Audit Logging (Immutably appends to cache)
  logAudit: (userId: string, email: string, action: string, details: string) => {
    const log: AuditLog = {
      id: Math.random().toString(36).substring(2, 11),
      userId,
      email,
      action,
      details,
      ipAddress: '127.0.0.1',
      timestamp: new Date().toISOString()
    };
    dbCache.auditLogs.unshift(log);
    if (dbCache.auditLogs.length > 500) {
      dbCache.auditLogs = dbCache.auditLogs.slice(0, 500);
    }
    saveDb();
    
    // Save to Firestore
    writeToFirestore('auditLogs', log.id, log);

    return log;
  }
};
