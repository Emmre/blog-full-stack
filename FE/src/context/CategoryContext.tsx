import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { fetchAllCategories } from '../services/post';
import { getCachedCategories, setCachedCategories } from '../utils/cache';

interface Category {
  id: number;
  name: string;
}

interface CategoryContextProps {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

export const CategoryContext = createContext<CategoryContextProps | undefined>(undefined);

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cached = getCachedCategories();
        if (cached) {
          setCategories(cached);
          setLoading(false);
          return;
        }

        const response = await fetchAllCategories(true);
        setCategories(response);
        setCachedCategories(response);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories.');
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  return (
    <CategoryContext.Provider value={{ categories, loading, error }}>
      {children}
    </CategoryContext.Provider>
  );
};
