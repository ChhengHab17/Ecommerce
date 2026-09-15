'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useMutation } from 'node_modules/@tanstack/react-query/build/modern/useMutation';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

type FormData = {
  email: string;
  password: string;
};

const ForgotPassword = () => {
  const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [canResend, setCanResend] = useState(true);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const startResendTimer = () => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  const requestOtpMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/forgot-password`,
        { email },
      );
      return response.data;
    },
    onSuccess: (_, email) => {
      setUserEmail(email);
      setStep('otp');
      setServerError(null);
      setCanResend(false);
      setTimer(60);
      startResendTimer();
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string }).message ||
        'Failed to send OTP';
      setServerError(errorMessage);
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      if (!userEmail) {
        return;
      }
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/verify-forgot-password-otp`,
        { email: userEmail, otp: otp.join('') },
      );
      return response.data;
    },
    onSuccess: () => {
      setStep('reset');
      setServerError(null);
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string }).message || 'Invalid OTP';
      setServerError(errorMessage);
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (password: string) => {
      if (!password) return;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/reset-password`,
        { email: userEmail, newPassword: password },
      );
      return response.data;
    },
    onSuccess: () => {
      setStep('email');
      toast.success(
        'Password reset successful. Please login with your new password.',
      );
      setServerError(null);
      router.push('/login');
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string }).message ||
        'Failed to reset password';
      setServerError(errorMessage);
    },
  });
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) {
      return;
    }
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  const handleOtpKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  const resendOtp = () => {
    if (userEmail) {
      requestOtpMutation.mutate(userEmail);
    }
  };
  const onSubmitEmail = ({ email }: { email: string }) => {
    requestOtpMutation.mutate(email);
  };
  const onSubmitPassword = ({ password }: { password: string }) => {
    resetPasswordMutation.mutate(password);
  };

  return (
    <div className="w-full py-10 min-h-[85vh] bg-[#f1f1f1]">
      <h1 className="text-2xl font-Poppins font-bold text-center text-black">
        Forgot Password
      </h1>
      <div className="w-full flex justify-center">
        <div className="md:w-[480px] p-8 bg-white shadow rounded-lg">
          {step === 'email' && (
            <>
              <h3 className="text-3xl font-semibold text-center mb-2">
                Login to Shopping
              </h3>
              <p className="text-center text-gray-500 mb-4">
                Go back to{' '}
                <Link href={'/login'} className="text-blue-500 hover:underline">
                  Login
                </Link>
              </p>

              <form onSubmit={handleSubmit(onSubmitEmail)}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="jonh@gmail.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Invalid email address',
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">
                    {String(errors.email.message)}
                  </p>
                )}
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {String(errors.password.message)}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={requestOtpMutation.isPending}
                  className="w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {requestOtpMutation.isPending ? 'Submitting...' : 'Submit'}
                </button>

                {serverError && (
                  <p className="text-red-500 text-sm mt-2">{serverError}</p>
                )}
              </form>
            </>
          )}
          {step === 'otp' && (
            <>
              <h3 className="text-xl font-semibold text-center mb-4">
                {' '}
                Enter OTP
              </h3>
              <div className="flex justify-center gap-6">
                {otp?.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    ref={(el) => {
                      if (el) inputRefs.current[index] = el;
                    }}
                    value={digit}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => {
                      handleOtpChange(index, e.target.value);
                    }}
                    onKeyDown={(e) => {
                      handleOtpKeyDown(index, e);
                    }}
                    className="w-12 h-12 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ))}
              </div>
              <button
                disabled={verifyOtpMutation.isPending}
                onClick={() => verifyOtpMutation.mutate()}
                className="w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {verifyOtpMutation.isPending ? 'Verifying...' : 'Verify OTP'}
              </button>
              <p className="text-center text-sm mt-4">
                {canResend ? (
                  <button
                    className="text-blue-500 cursor-pointer hover:underline"
                    onClick={resendOtp}
                  >
                    Resend OTP
                  </button>
                ) : (
                  `Resend OTP in ${timer} seconds`
                )}
              </p>
            </>
          )}
          {step === 'reset' && (
            <>
              <h3 className="text-xl font-semibold text-center mb-4">
                {' '}
                Reset Password
              </h3>
              <form onSubmit={handleSubmit(onSubmitPassword)}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                />
                <button
                  type="submit"
                  disabled={resetPasswordMutation.isPending}
                  className="w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {resetPasswordMutation.isPending
                    ? 'Resetting...'
                    : 'Reset Password'}
                </button>
                {serverError && (
                  <p className="text-red-500 text-sm mt-2">{serverError}</p>
                )}
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
