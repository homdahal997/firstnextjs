// hooks\useAdmin.ts
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useState, useRef, useCallback, useEffect, useMemo } from 'react';

export default function useAdminHook() {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const openSidebarButtonRef = useRef<HTMLButtonElement>(null);

  const handleLogout = useCallback(async () => {
    setLoading(true);
    try {
      await logout();
      setIsLogoutModalOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  }, [logout]);

  
  const mounts = useRef<any[]>([]); // Replace with actual type

  const navigations = useMemo(() => {
    return mounts.current.filter((n) => n.link === true).sort((a, b) => {
      if ((a as any).sortOrder < (b as any).sortOrder) {
        return -1;
      } else if ((a as any).sortOrder > (b as any).sortOrder) {
        return 1;
      } else {
        return 0;
      }
    });
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target as Node) &&
        openSidebarButtonRef.current &&
        !openSidebarButtonRef.current.contains(e.target as Node)
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (window.location.pathname === "/admin") {
      const userNav: any = navigations.find((nav) => nav.appletId.includes("dashboard"));
      if (userNav) {
        window.location.replace(`/admin/${userNav.path}`);
      }
    }
  }, [navigations]);

  const toggleSidebar = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsSidebarOpen((prevState) => !prevState);
  };

  return {
    isLogoutModalOpen,
    loading,
    setIsLogoutModalOpen,
    handleLogout,
    isSidebarOpen,
    sidebarRef,
    openSidebarButtonRef,
    toggleSidebar,
  };
}