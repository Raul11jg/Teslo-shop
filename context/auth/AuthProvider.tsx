import { useSession, signOut } from 'next-auth/react';
import { FC, PropsWithChildren, useEffect, useReducer } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { teslaApi } from '../../api';
import { IUser } from '../../interfaces';
import { AuthContext, authReducer } from './';
import axios from 'axios';

export interface AuthState {
  isLoggedIn: boolean;
  user?: IUser;
}

const AUTH_INITIAL_STATE: AuthState = {
  isLoggedIn: false,
  user: undefined,
};

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE);
  const router = useRouter();

  const { data, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      console.log('data', data.user);
      dispatch({ type: '[Auth] - Login', payload: data.user as IUser });
    }
  }, [status, data]);

  /*   useEffect(() => {
    checkToken();
  }, []); */

  const checkToken = async () => {
    if (!Cookies.get('token')) {
      return;
    }
    try {
      const { data } = await teslaApi.post('/user/validate-token');
      const { token, user } = data;
      Cookies.set('token', token);
      dispatch({ type: '[Auth] - Login', payload: user });
    } catch (error) {
      Cookies.remove('token');
      dispatch({ type: '[Auth] - Logout' });
    }
    //dispatch login
  };

  const loginUser = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data } = await teslaApi.post('/user/login', { email, password });
      const { token, user } = data;
      Cookies.set('token', token);
      dispatch({ type: '[Auth] - Login', payload: user });
      return true;
    } catch (error) {
      return false;
    }
  };

  const registerUser = async (name: string, email: string, password: string): Promise<{ hasError: boolean; message?: string }> => {
    try {
      const { data } = await teslaApi.post('/user/register', { name, email, password });
      const { token, user } = data;
      Cookies.set('token', token);
      dispatch({ type: '[Auth] - Login', payload: user });
      return {
        hasError: false,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          hasError: true,
          message: error.response?.data.message,
        };
      }
      return {
        hasError: true,
        message: 'No se pudo crear el usuario, intente más tarde',
      };
    }
  };

  const logoutUser = () => {
    Cookies.remove('token');
    Cookies.remove('cart');

    Cookies.remove('firstName');
    Cookies.remove('lastName');
    Cookies.remove('address');
    Cookies.remove('address2');
    Cookies.remove('postalCode');
    Cookies.remove('city');
    Cookies.remove('country');
    Cookies.remove('phone');
    signOut();

    //refresh page
    //router.reload();
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,

        loginUser,
        registerUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
