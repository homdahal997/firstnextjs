'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function useLoginHook() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = useCallback(async () => {
    if (!username) {
      return setErr('Username is required');
    }

    if (!password) {
      return setErr('Password is required');
    }

    setLoading(true);
    setErr('');

    try {
      const { isSuperAdmin } = await login(username, password);
      if (isSuperAdmin) {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (e: any) {
      setErr(e.message);
      setLoading(false);
    }
  }, [username, password, router, login]);

  return {
    username,
    setUsername,
    password,
    setPassword,
    loading,
    handleLogin,
    err,
  };
}