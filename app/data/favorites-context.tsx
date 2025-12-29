import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '@api/client';

const FAVORITES_KEY = '@favorites';

interface FavoritesContextType {
  favorites: string[];
  addToFavorites: (productId: string) => Promise<void>;
  removeFromFavorites: (productId: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (productId: string) => Promise<void>;
  syncFavoritesWithBackend: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      // First, try to get favorites from backend if user is logged in
      const backendFavorites = await loadFavoritesFromBackend();

      if (backendFavorites) {
        // User is logged in, use backend favorites
        setFavorites(backendFavorites);
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(backendFavorites));
      } else {
        // User is not logged in, use local storage
        const stored = await AsyncStorage.getItem(FAVORITES_KEY);
        if (stored) {
          setFavorites(JSON.parse(stored));
        }
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      // Fallback to local storage
      const stored = await AsyncStorage.getItem(FAVORITES_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    }
  };

  const loadFavoritesFromBackend = async (): Promise<string[] | null> => {
    try {
      const { customer } = await apiClient.store.customer.retrieve();
      if (customer && customer.metadata && customer.metadata.favorites) {
        return customer.metadata.favorites as string[];
      }
      return null;
    } catch (error) {
      // User is not logged in or error occurred
      return null;
    }
  };

  const syncFavoritesWithBackend = async () => {
    if (isSyncing) return;

    try {
      setIsSyncing(true);
      const { customer } = await apiClient.store.customer.retrieve();

      if (customer) {
        // Merge local favorites with backend favorites
        const backendFavorites = (customer.metadata?.favorites as string[]) || [];
        const mergedFavorites = Array.from(new Set([...favorites, ...backendFavorites]));

        // Update backend
        await apiClient.store.customer.update({
          metadata: {
            ...customer.metadata,
            favorites: mergedFavorites,
          },
        });

        // Update local state and storage
        setFavorites(mergedFavorites);
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(mergedFavorites));
      }
    } catch (error) {
      console.error('Error syncing favorites with backend:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const saveFavorites = async (newFavorites: string[]) => {
    try {
      // Save to local storage
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      setFavorites(newFavorites);

      // Try to sync with backend if user is logged in
      try {
        const { customer } = await apiClient.store.customer.retrieve();
        if (customer) {
          await apiClient.store.customer.update({
            metadata: {
              ...customer.metadata,
              favorites: newFavorites,
            },
          });
        }
      } catch (error) {
        // User is not logged in or error occurred, ignore
        console.log('Could not sync favorites to backend:', error);
      }
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const addToFavorites = async (productId: string) => {
    if (!favorites.includes(productId)) {
      const newFavorites = [...favorites, productId];
      await saveFavorites(newFavorites);
    }
  };

  const removeFromFavorites = async (productId: string) => {
    const newFavorites = favorites.filter(id => id !== productId);
    await saveFavorites(newFavorites);
  };

  const isFavorite = (productId: string) => {
    return favorites.includes(productId);
  };

  const toggleFavorite = async (productId: string) => {
    if (isFavorite(productId)) {
      await removeFromFavorites(productId);
    } else {
      await addToFavorites(productId);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        toggleFavorite,
        syncFavoritesWithBackend,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
};
