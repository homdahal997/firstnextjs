// hooks\useRegister.ts
import { useState, useCallback, useEffect, useMemo } from 'react';

export default function useRegisterHook() {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [err, setErr] = useState('');
    const [loading, setLoading] = useState(false);
    const [verifyEmailLoading, setVerifyEmailLoading] = useState(false);
    const [hasSuperAdmin, setHasSuperAdmin] = useState(true);
    const [confirmSuperAdmin, setConfirmSuperAdmin] = useState(false);
    const [hashedOtp, setHashedOtp] = useState('');
    const [otp, setOtp] = useState('');
    const [enableOTP, setEnableOTP] = useState(false);

    const imageSrc = {
        getLink: () => '/logo.png' // Update with your actual logo path
    };

    const isEmailValid = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleRegister = useCallback(async () => {
        if (!name) {
            return setErr('Name is required');
        }
    
        if (!username || !isEmailValid(username)) {
            return setErr('Valid email is required');
        }
    
        if (!password) {
            return setErr('Password is required');
        }
    
        setLoading(true);
        setErr('');
    
        try {
            // Verify OTP first
            const verifyResponse = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    otp,
                    hashedOtp
                }),
            });
    
            const verifyData = await verifyResponse.json();
    
            if (!verifyResponse.ok) {
                throw new Error(verifyData.error || 'OTP verification failed');
            }
    
            // If OTP is verified, proceed with registration
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    username,
                    password,
                    isSuperAdmin: !hasSuperAdmin
                }),
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }
    
            // Redirect based on role
            if (!hasSuperAdmin || data.isSuperAdmin) {
                window.location.replace('/admin/dashboard');
            } else {
                window.location.replace('/');
            }
        } catch (e: any) {
            setErr(e.message);
        } finally {
            setLoading(false);
        }
    }, [name, username, password, otp, hashedOtp, hasSuperAdmin]);

    const isVerifyButtonDisabled = useMemo(() => {
        if (verifyEmailLoading) return true;
        if (hasSuperAdmin === false && confirmSuperAdmin === false) return true;
        if (!name || !username || !password) return true;
        return false;
    }, [hasSuperAdmin, verifyEmailLoading, confirmSuperAdmin, name, username, password]);

    const isCreateButtonDisabled = useMemo(() => {
        if (loading) return true;
        if (hasSuperAdmin === false && confirmSuperAdmin === false) return true;
        if (!name || !username || !password) return true;
        if (enableOTP && !otp) return true; // Only check for OTP if enableOTP is true
        return false;
    }, [hasSuperAdmin, loading, confirmSuperAdmin, otp, enableOTP, name, username, password]);

    const checkHasSuperAdmin = useCallback(async () => {
        try {
            const response = await fetch('/api/auth/check-super-admin');
            const data = await response.json();
            setHasSuperAdmin(data.hasSuperAdmin);
        } catch (error) {
            console.error('Error checking super admin:', error);
        }
    }, []);

    const handleVerifyEmail = useCallback(async () => {
        if (!name) {
            return setErr('Name is required');
        }

        if (!username || !isEmailValid(username)) {
            return setErr('Valid email is required');
        }

        if (!password) {
            return setErr('Password is required');
        }

        setVerifyEmailLoading(true);
        setErr('');

        try {
            const response = await fetch('/api/auth/validate-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: username }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Email verification failed');
            }

            setHashedOtp(data.hashedOtp);
            setEnableOTP(true);
            setErr('');
        } catch (e: any) {
            setErr(e.message);
        } finally {
            setVerifyEmailLoading(false);
        }
    }, [name, username, password]);

    useEffect(() => {
        checkHasSuperAdmin();
    }, []);

    return {
        name,
        setName,
        username,
        setUsername,
        password,
        setPassword,
        loading,
        handleRegister,
        err,
        hasSuperAdmin,
        confirmSuperAdmin,
        setConfirmSuperAdmin,
        isVerifyButtonDisabled,
        handleVerifyEmail,
        otp,
        setOtp,
        enableOTP,
        verifyEmailLoading,
        isCreateButtonDisabled,
        imageSrc
    };
}