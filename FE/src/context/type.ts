export interface IAuthState {
  isAuthenticated: boolean;
}

export type AuthContextType = {
  isAuthenticated: boolean;
  setUserCredentials: (userCredentials?: IAuthState | null) => void;
};

export interface IUserInfoState {
  id: string;
  image: string;
  username: string;
  fullname: string;
}

export type UserInfoContextType = {
  userInfo: IUserInfoState;
  setUserInfoCredentials: (userInfo?: IUserInfoState | null) => void;
};
