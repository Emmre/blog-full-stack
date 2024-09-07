const STORAGE_KEY = 'categories';
const EXPIRATION_TIME = 1000 * 60 * 1;

export const setCachedCategories = (categories: any) => {
  const now = Date.now();
  const dataToStore = {
    categories,
    timestamp: now,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
};

export const getCachedCategories = () => {
  const item = localStorage.getItem(STORAGE_KEY);
  if (!item) return null;

  const { categories, timestamp } = JSON.parse(item);
  const now = Date.now();

  if (now - timestamp > EXPIRATION_TIME) {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }

  return categories;
};
