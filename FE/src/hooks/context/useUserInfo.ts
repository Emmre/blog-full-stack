import { UserInfoContextType } from '@/src/context/type';
import { UserInfoContext } from '../../context/UserInfoContext';
import { useContext } from 'react';

export const useUserInfo = (): UserInfoContextType => {
  const context = useContext(UserInfoContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
