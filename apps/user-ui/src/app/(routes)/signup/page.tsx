'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import GoogleButton from '../../shared/components/googleButton';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { useMutation } from 'node_modules/@tanstack/react-query/build/modern/useMutation';
import axios, { AxiosError } from 'axios';

type FormData = {
  name: string;
  email: string;
  password: string;
};

const Signup = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [timer, setTimer] = useState(60);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [userData, setUserData] = useState<FormData | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

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

  const onSignupMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/register`,
        data,
      );
      return response.data;
    },
    onSuccess: (_, formData) => {
      setUserData(formData);
      setShowOtp(true);
      setCanResend(false);
      setTimer(60);
      startResendTimer();
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      if (!userData) {
        return;
      }
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/verify`,
        {
          ...userData,
          otp: otp.join(''),
        },
      );
      return response.data;
    },
    onSuccess: () => {
      router.push('/login');
    },
  });

  const onSubmit = (data: FormData) => {
    onSignupMutation.mutate(data);
  };
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
    if (userData) {
      onSignupMutation.mutate(userData);
    }
  };

  return (
    <div className="w-full py-10 min-h-[85vh] bg-[#f1f1f1]">
      <h1 className="text-2x font-Poppins font-bold text-center text-black">
        Sign up{' '}
      </h1>
      <p className="text-center text-lg font-medium py-3 text-black">
        {' '}
        Home . Sign up
      </p>
      <div className="w-full flex justify-center">
        <div className="md:w-120 p-8 bg-white shadow rounded-lg">
          <h3 className="text-3xl font-semibold text-center mb-2">
            Sign up to Shopping
          </h3>
          <p className="text-center text-gray-500 mb-4">
            Already have an account?{' '}
            <Link href={'/login'} className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
          <GoogleButton />
          <div className="flex items-center my-5 text-gray-400 text-sm">
            <div className="flex-1 border-t border-gray-300" />
            <span className="px-3">or</span>
            <div className="flex-1 border-t border-gray-300" />
          </div>
          {!showOtp ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                placeholder="jonh"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                {...register('name', {
                  required: 'Name is required',
                })}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">
                  {String(errors.name.message)}
                </p>
              )}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  placeholder="••••••••"
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
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? <Eye /> : <EyeOff />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {String(errors.password.message)}
                </p>
              )}

              <button
                type="submit"
                disabled={onSignupMutation.isPending}
                className="w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {onSignupMutation.isPending ? 'Signing up...' : 'Sign up'}
              </button>

              {verifyOtpMutation.isError && (
                <p className="text-red-500 text-sm mt-2">
                  {verifyOtpMutation.error.message}
                </p>
              )}

            </form>
          ) : (
            <div>
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
              {
                verifyOtpMutation.isError && verifyOtpMutation.error instanceof AxiosError && (
                    <p className="text-red-500 text-sm mt-2">
                      {verifyOtpMutation.error.response?.data.message || verifyOtpMutation.error.message}
                    </p>
                )
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
