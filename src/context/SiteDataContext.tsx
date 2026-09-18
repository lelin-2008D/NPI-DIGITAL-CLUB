import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { SiteDatabase } from '../types/site';
import { StorageService } from '../services/storageService';

interface SiteDataContextType {
  data: SiteDatabase | null;
  loading: boolean;
  error: string | null;
  updateData: (updater: (prev: SiteDatabase) => SiteDatabase) => Promise<void>;
  saveData: (newData: SiteDatabase) => Promise<void>;
  resetData: () => Promise<void>;
  refreshData: () => Promise<void>;
}

const SiteDataContext = createContext<SiteDataContextType | undefined>(undefined);

export const SiteDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<SiteDatabase | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const db = await StorageService.initialize();
      setData(db);
    } catch (err: any) {
      console.error('Error initializing site data:', err);
      setError(err?.message || 'Failed to load site data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();

    const handleStorageChange = () => {
      const updated = StorageService.getData();
      if (updated) {
        setData(updated);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadData]);

  const saveData = async (newData: SiteDatabase) => {
    setData(newData);
    await StorageService.saveData(newData);
  };

  const updateData = async (updater: (prev: SiteDatabase) => SiteDatabase) => {
    if (!data) return;
    const updated = updater(data);
    await saveData(updated);
  };

  const resetData = async () => {
    setLoading(true);
    try {
      const reset = await StorageService.resetData();
      setData(reset);
    } catch (err: any) {
      setError(err?.message || 'Failed to reset data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteDataContext.Provider
      value={{
        data,
        loading,
        error,
        updateData,
        saveData,
        resetData,
        refreshData: loadData,
      }}
    >
      {children}
    </SiteDataContext.Provider>
  );
};

export const useSiteData = (): SiteDataContextType => {
  const context = useContext(SiteDataContext);
  if (!context) {
    throw new Error('useSiteData must be used within a SiteDataProvider');
  }
  return context;
};
