'use client';

import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';
import { Disclosure } from '@headlessui/react';
import useAdminHook from '@/hooks/useAdmin';
import { useAuth } from '@/hooks/useAuth';
import Protected from '../Protected';

const navigation = [
  {
    path: 'dashboard',
    label: 'Dashboard',
    appletId: 'dashboard',
    link: true,
    sortOrder: 1,
  },
  {
    path: 'userListing',
    label: 'Users',
    appletId: 'userListing',
    link: true,
    sortOrder: 2,
  },
  {
    path: 'settings',
    label: 'Settings',
    appletId: 'settings',
    link: true,
    sortOrder: 3,
  },
  // Add more navigation items as needed
];

export default function AdminConsole({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const cancelButtonRef = useRef(null);
  const hook = useAdminHook();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Render nothing on the server
  }

  return (
    <Protected>
      <div className="w-screen h-screen">
        <div className="min-h-full">
          <Disclosure as="nav" className="bg-[#F9FAFB]">
            <>
              <aside id="default-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full lg:translate-x-0" aria-label="default-sidebar">
                <div className="h-full flex justify-between flex-col px-6 py-4 bg-[#F9FAFB]">
                  <ul className="font-medium text-[15px] mt-3">
                    <Link href={'/'} className="w-fit h-7 flex items-center mb-9">
                      <img
                        src={hook.imageSrc.getLink()}
                        className="h-full w-full object-contain object-left"
                      />
                    </Link>
                    <div className='overflow-y-auto h-[60vh]'>
                      {
                        navigation.map((item) => {
                          const selected = window.location.pathname.includes(item.path);
                          return (
                            <Link key={item.path} href={`/admin/${item.path}`}>
                              <a className={`h-10 px-2 mb-1 flex items-center text-[14px] text-[#363A43] text-medium rounded-[5px] ${selected ? "bg-[#EFF0FA] text-[#4F3BF3]" : ""} group`}>
                                <span className="flex-1 whitespace-nowrap truncate">{item.label}</span>
                              </a>
                            </Link>
                          );
                        })
                      }
                    </div>
                  </ul>
                  <ul className='mt-[11px]'>
                    <Link href='/'>
                      <a target="_blank" className='flex items-center justify-center gap-2 bg-[#FFFFFF] text-[13px] font-medium rounded-[5px] px-3 py-2 text-[#363A43] w-full h-[38px] mb-5 hover:opacity-80 border border-[#E7E4F5]'>
                        Open App
                        <svg className="h-4 w-4 text-[#363A43]" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path stroke="none" d="M0 0h24v24H0z" />
                          <line x1="17" y1="7" x2="7" y2="17" />
                          <polyline points="8 7 17 7 17 16" />
                        </svg>
                      </a>
                    </Link>
                    <div className="flex items-center border-b border-slate-300 mb-3 pb-3">
                      <div className="ml-3 w-full">
                        <div className="text-base w-4/6 truncate font-medium leading-none text-gray-400">{user?.name}</div>
                        <div className="text-[12px] w-4/6 truncate mt-1 font-medium leading-none text-gray-400">{user?.username}</div>
                      </div>
                    </div>
                    <li>
                      <a
                        className="h-10 px-2 flex items-center font-medium text-[15px] text-[#363A43] rounded-[5px] hover:bg-[#EFF0FA] hover:text-[#4F3BF3] group cursor-pointer"
                        onClick={() => hook.setIsLogoutModalOpen(true)}
                      >
                        <span className="flex-1 whitespace-nowrap">Log Out</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </aside>

              {/* Mobile screen */}
              <div className="lg:hidden bg-gray-100">
                <div className="flex overflow-hidden bg-gray-200">
                  <div
                    className={`fixed z-20 bg-[#F9FAFB] text-white w-56 min-h-screen overflow-y-auto transition-transform ${hook.isSidebarOpen ? '' : 'transform -translate-x-full'
                      } ease-in-out duration-300`}
                    id="sidebar"
                  >
                    <div className="p-4 h-screen flex flex-col justify-between">
                      <ul className="font-medium text-[15px] pt-1">
                        <button
                          className="px-2 mb-3 text-[#363A43] hover:text-[#363A43]"
                          id="open-sidebar"
                          ref={hook.openSidebarButtonRef}
                          onClick={hook.toggleSidebar}
                        >
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4 6h16M4 12h16M4 18h16"
                            ></path>
                          </svg>
                        </button>
                        <div className='overflow-y-auto h-[66vh] pt-5'>
                          <Link href="/admin/userListing">
                            <a className={`h-10 px-2 mb-1 flex items-center text-[14px] text-[#363A43] text-medium rounded-[5px] group`}>
                              <span className="flex-1 whitespace-nowrap truncate">Users</span>
                            </a>
                          </Link>
                          {
                            navigation.map((item) => {
                              const selected = window.location.pathname.includes(item.path);
                              return (
                                <Link key={item.path} href={`/admin/${item.path}`}>
                                  <a className={`h-10 px-2 mb-1 flex items-center text-[14px] text-[#363A43] text-medium rounded-[5px] ${selected ? "bg-[#EFF0FA] text-[#4F3BF3]" : ""} group`}>
                                    <span className="flex-1 whitespace-nowrap truncate">{item.label}</span>
                                  </a>
                                </Link>
                              );
                            })
                          }
                        </div>
                      </ul>
                      <ul className='mt-[11px]'>
                        <Link href='/'>
                          <a target="_blank" className='flex items-center justify-center gap-2 bg-[#FFFFFF] text-[13px] font-medium rounded-[5px] px-3 py-2 text-[#363A43] w-full h-[38px] mb-5 hover:opacity-80 border border-[#E7E4F5]'>
                            Open App
                            <svg className="h-4 w-4 text-[#363A43]" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                              <path stroke="none" d="M0 0h24v24H0z" />
                              <line x1="17" y1="7" x2="7" y2="17" />
                              <polyline points="8 7 17 7 17 16" />
                            </svg>
                          </a>
                        </Link>
                        <div className="flex items-center border-b border-slate-300 mb-3 pb-3">
                          <div className="ml-3 w-full">
                            <div className="text-base w-4/6 truncate font-medium leading-none text-gray-400">{user?.name}</div>
                            <div className="text-[12px] w-4/6 truncate mt-1 font-medium leading-none text-gray-400">{user?.username}</div>
                          </div>
                        </div>
                        <a
                          className="h-10 px-2 flex items-center font-medium mt-3 text-[15px] text-[#363A43] rounded-[5px] hover:bg-[#EFF0FA] hover:text-[#4F3BF3] group"
                          onClick={() => hook.setIsLogoutModalOpen(true)}
                        >
                          <span className="flex-1 whitespace-nowrap">Log Out</span>
                        </a>
                      </ul>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="bg-[#F9FAFB] shadow fixed left-0 right-0 z-20">
                      <div className="w-full mx-auto">
                        <div className="flex justify-between items-center py-4 px-5">
                          <button
                            className="text-[#363A43]"
                            id="open-sidebar"
                            ref={hook.openSidebarButtonRef}
                            onClick={hook.toggleSidebar}
                          >
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h16"
                              ></path>
                            </svg>
                          </button>
                          <Link href={'/'} className="w-fit h-7 flex items-center">
                            <img
                              src={hook.imageSrc.getLink()}
                              className="h-full w-full object-contain object-right"
                            />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          </Disclosure>
          <div className="ml-0 lg:ml-64">
            {children} {/* Replace <Mount /> with children */}
          </div>
        </div>
      </div>

      {/* Logout modal remains the same */}
    </Protected>
  );
}