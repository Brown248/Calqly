import { create } from 'zustand';
import { persist, StateStorage, createJSONStorage } from 'zustand/middleware';

// IndexedDB Storage Engine for larger data and persistence
const idbStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return new Promise((resolve) => {
      const request = indexedDB.open('CalqlyDB', 1);
      request.onupgradeneeded = () => {
        request.result.createObjectStore('store');
      };
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction('store', 'readonly');
        const store = transaction.objectStore('store');
        const getRequest = store.get(name);
        getRequest.onsuccess = () => resolve(getRequest.result || localStorage.getItem(name)); // Fallback to localStorage during migration
      };
      request.onerror = () => resolve(localStorage.getItem(name));
    });
  },
  setItem: async (name: string, value: string): Promise<void> => {
    return new Promise((resolve) => {
      const request = indexedDB.open('CalqlyDB', 1);
      request.onupgradeneeded = () => {
        request.result.createObjectStore('store');
      };
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction('store', 'readwrite');
        const store = transaction.objectStore('store');
        store.put(value, name);
        transaction.oncomplete = () => resolve();
      };
      request.onerror = () => {
        localStorage.setItem(name, value);
        resolve();
      };
    });
  },
  removeItem: async (name: string): Promise<void> => {
    return new Promise((resolve) => {
      const request = indexedDB.open('CalqlyDB', 1);
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction('store', 'readwrite');
        const store = transaction.objectStore('store');
        store.delete(name);
        transaction.oncomplete = () => {
          localStorage.removeItem(name);
          resolve();
        };
      };
      request.onerror = () => {
        localStorage.removeItem(name);
        resolve();
      };
    });
  },
};

export interface SavedProject {
  id: string;
  type: 'loan' | 'tax' | 'retirement' | 'roi' | 'credit-card' | 'real-cost';
  name: string;
  timestamp: number;
  input: Record<string, unknown>;
  result: Record<string, unknown>;
}

// 🌐 Global Life Metrics for Cross-Calculator Sync
interface LifeMetrics {
  monthlyIncome: number;
  monthlyEssentialExpenses: number;
  monthlyDebtPayments: number;
  monthlyInvestments: number;
  currentNetWorth: number;
  taxBracket: number;
}

interface FinancialState {
  // Global Shared State
  metrics: LifeMetrics;

  // Saved Projects
  projects: SavedProject[];

  // Actions
  updateMetrics: (newMetrics: Partial<LifeMetrics>) => void;
  syncFromLoan: (monthlyPayment: number) => void;
  syncFromTax: (netIncome: number, taxBracket: number) => void;

  // Project Actions
  saveProject: (project: Omit<SavedProject, 'id' | 'timestamp'>) => void;
  removeProject: (id: string) => void;
  updateProjectName: (id: string, name: string) => void;
  importProjects: (projects: SavedProject[]) => void;
  clearProjects: () => void;
  updateFields: (fields: Partial<FinancialState>) => void;
}

export const useFinancialStore = create<FinancialState>()(
  persist(
    (set) => ({
      metrics: {
        monthlyIncome: 0,
        monthlyEssentialExpenses: 0,
        monthlyDebtPayments: 0,
        monthlyInvestments: 0,
        currentNetWorth: 0,
        taxBracket: 0,
      },
      projects: [],

      updateMetrics: (newMetrics) => set((state) => ({
        metrics: { ...state.metrics, ...newMetrics }
      })),

      syncFromLoan: (monthlyPayment) => set((state) => ({
        metrics: { ...state.metrics, monthlyDebtPayments: monthlyPayment }
      })),

      syncFromTax: (netIncome, taxBracket) => set((state) => ({
        metrics: { ...state.metrics, monthlyIncome: netIncome / 12, taxBracket }
      })),

      saveProject: (project) => set((state) => ({
        projects: [
          {
            ...project,
            id: Math.random().toString(36).substring(2, 9),
            timestamp: Date.now(),
          },
          ...state.projects,
        ].slice(0, 50),
      })),

      removeProject: (id) => set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
      })),

      updateProjectName: (id, name) => set((state) => ({
        projects: state.projects.map((p) => p.id === id ? { ...p, name } : p),
      })),
      
      importProjects: (newProjects) => set((state) => {
        // Merge and deduplicate by ID, prioritizing new projects
        const existingIds = new Set(newProjects.map(p => p.id));
        const merged = [
          ...newProjects,
          ...state.projects.filter(p => !existingIds.has(p.id))
        ];
        return { projects: merged.slice(0, 100) }; // Increased limit to 100 for imports
      }),

      clearProjects: () => set({ projects: [] }),
      
      updateFields: (fields) => set((state) => ({ ...state, ...fields })),
    }),

    {
      name: 'calqly-financial-storage',
      storage: createJSONStorage(() => idbStorage),
    }
  )
);
