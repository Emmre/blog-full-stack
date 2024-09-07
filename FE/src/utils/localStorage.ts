import { IUserInfoState } from '../context/type';

const LOCAL_STORAGE_KEY = 'userInfo';

export const loadUserInfoFromLocalStorage = (defaultData? : IUserInfoState) => {
  if (typeof window === 'undefined') {
    return {
      defaultData,
    };
  }

  const userInfo = localStorage.getItem(LOCAL_STORAGE_KEY);

  if (userInfo) {
    try {
      return JSON.parse(userInfo);
    } catch (error) {
      console.error('Failed to parse auth state from localStorage', error);
    }
  }

  return { defaultData };
};

export const saveUserInfoToLocalStorage = (userInfo: IUserInfoState) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userInfo));
  }
};
