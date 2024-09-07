import React, { createContext, useState, useContext, useEffect } from 'react';
import { loadUserInfoFromLocalStorage, saveUserInfoToLocalStorage } from '../utils/localStorage';
import { UserInfoContextType, IUserInfoState } from './type';

export const UserInfoContext = createContext<UserInfoContextType | undefined>(undefined);

export const defaultUserState: IUserInfoState = {
  fullname: '',
  id: '',
  image: '',
  username: '',
};

export const UserInfoProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState<IUserInfoState>(
    loadUserInfoFromLocalStorage(defaultUserState)
  );

  useEffect(() => {
    setUserInfo(loadUserInfoFromLocalStorage());
  }, []);

  useEffect(() => {
    saveUserInfoToLocalStorage(userInfo);
  }, [userInfo]);

  const setUserInfoCredentials = (userCredentials?: IUserInfoState | null) => {
    if (userCredentials === null) {
      setUserInfo(defaultUserState);
    } else if (userCredentials) {
      setUserInfo(userCredentials);
    }
  };

  return (
    <UserInfoContext.Provider value={{ userInfo, setUserInfoCredentials }}>
      {children}
    </UserInfoContext.Provider>
  );
};

