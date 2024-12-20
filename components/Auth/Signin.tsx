'use client';

import Link from 'next/link';
import Image from 'next/image';
import useLoginHook from '@/hooks/useLogin';
import useLogo from '@/hooks/useLogo'

export default function Login() {
    const hook = useLoginHook();

    return (
        <div className="relative flex min-h-full flex-col bg-white justify-center px-4 py-12 lg:px-8">
            <Link href="/" className="absolute top-[12px] sm:left-[118px] lg:left-[161px] h-10 w-32 sm:w-36 flex items-center">
                <img 
                    src="/api/settings/logo" 
                    data-logo 
                    alt="Logo" 
                    className="h-full w-full object-contain object-left"
                />
            </Link>

            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Sign in to your account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={(e) => {
                    e.preventDefault();
                    hook.handleLogin();
                }}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                            Email address
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                type="email"
                                value={hook.username}
                                onChange={(e) => hook.setUsername(e.target.value)}
                                required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                            Password
                        </label>
                        <div className="mt-2">
                            <input
                                id="password"
                                type="password"
                                value={hook.password}
                                onChange={(e) => hook.setPassword(e.target.value)}
                                required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                        <div className="h-5">
                            {hook.err && <p className="text-red-500 text-sm">{hook.err}</p>}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={hook.loading}
                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-300"
                    >
                        {hook.loading ? (
                            <div role="status" className="flex items-center">
                                <svg className="inline w-4 h-4 mr-2 animate-spin" viewBox="0 0 100 101" fill="none">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                </svg>
                                Signing in...
                            </div>
                        ) : (
                            "Sign in"
                        )}
                    </button>
                </form>

                <div className="flex justify-end mt-4">
                    <Link href="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-500">
                        Forgot password?
                    </Link>
                </div>

                <p className="mt-10 text-center text-sm text-gray-500">
                    Don't have an account?{' '}
                    <Link href="/auth/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}