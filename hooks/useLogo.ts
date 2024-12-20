'use client';

import { useState, useCallback } from 'react';

export function useLogo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogo = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/settings/logo', {
        method: 'GET',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch logo');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      return url;
    } catch (e: any) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateLogo = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/settings/logo', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update logo');
      }

      // Force reload logo by adding timestamp to URL
      const logoElements = document.querySelectorAll('img[data-logo]');
      logoElements.forEach((img: HTMLImageElement) => {
        img.src = `/api/settings/logo?t=${Date.now()}`;
      });

      return true;
    } catch (e: any) {
      setError(e.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const replaceLogo = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/settings/logo', {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to replace logo');
      }

      // Force reload logo by adding timestamp to URL
      const logoElements = document.querySelectorAll('img[data-logo]');
      logoElements.forEach((img: HTMLImageElement) => {
        img.src = `/api/settings/logo?t=${Date.now()}`;
      });

      return true;
    } catch (e: any) {
      setError(e.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteLogo = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/settings/logo', {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete logo');
      }

      // Remove logo from the DOM
      const logoElements = document.querySelectorAll('img[data-logo]');
      logoElements.forEach((img: HTMLImageElement) => {
        img.src = '';
      });

      return true;
    } catch (e: any) {
      setError(e.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchLogo,
    updateLogo,
    replaceLogo,
    deleteLogo,
  };
}