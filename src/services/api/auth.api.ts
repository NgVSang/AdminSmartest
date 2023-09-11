import {LoginData, LoginResponse} from '../../types';
import instance from '../api/axios';

const ENDPOINTS = {
  LOGIN_ADMIN: '/employee/auth/login',
};

const login = (data: any) => {
  return instance.post<LoginResponse>(ENDPOINTS.LOGIN_ADMIN, data);
};

export const AuthApi = {
  login,
};
