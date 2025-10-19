'use client';
import { useEffect } from 'react';
import { useAppDispatch } from '../../hook';
import { hydrate } from './authSlice';

export default function AuthInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Load credentials from localStorage on mount
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');

    if (token && refreshToken) {
      console.log('AuthInitializer: Hydrating tokens from localStorage');
      dispatch(hydrate({ access: token, refresh: refreshToken }));
    } else {
      console.log('AuthInitializer: No tokens found in localStorage');
    }
  }, [dispatch]);

  return null;
}