'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import GoogleButton from '../../shared/components/googleButton';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { useMutation } from 'node_modules/@tanstack/react-query/build/modern/useMutation';
import axios, { AxiosError } from 'axios';

type FormData = {
  email: string;
  password: string;
};

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const onLoginMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/login`,
        data,
        {withCredentials: true}
      );
      return response.data;
    },
    onSuccess: (data) => {
      setServerError(null);
      router.push('/');
    },
    onError: (error: AxiosError) => {
      const errorMessage = (error.response?.data as {message?: string}).message || 'Invalid Credentials';
      setServerError(errorMessage);
    }
  });
  const onSubmit = (data: FormData) => {
    onLoginMutation.mutate(data);
  };

  return (
    <div className="w-full py-10 min-h-[85vh] bg-[#f1f1f1]">
      <h1 className="text-2x font-Poppins font-bold text-center text-black">
        Login{' '}
      </h1>
      <p className="text-center text-lg font-medium py-3 text-black">
        {' '}
        Home . Login
      </p>
      <div className="w-full flex justify-center">
        <div className="md:w-[480px] p-8 bg-white shadow rounded-lg">
          <h3 className="text-3xl font-semibold text-center mb-2">
            Login to Shopping
          </h3>
          <p className="text-center text-gray-500 mb-4">
            Don't have an account?{' '}
            <Link href={'/signup'} className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </p>
          <GoogleButton />
          <div className="flex items-center my-5 text-gray-400 text-sm">
            <div className="flex-1 border-t border-gray-300" />
            <span className="px-3">or</span>
            <div className="flex-1 border-t border-gray-300" />
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
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
            <div className="flex justify-between items-center my-4">
              <label className="flex items-center text-gray-600">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-blue-500"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <span className="ml-2">Remember me</span>
              </label>
              <Link
                href={'/forgot-password'}
                className="text-blue-500 hover:underline text-sm"
                >
                  Forgot your password?
                </Link>
            </div>
            <button type="submit" disabled={onLoginMutation.isPending} className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              {onLoginMutation.isPending ? 'Logging in...' : 'Login'}
            </button>

            {serverError && (
              <p className="text-red-500 text-sm mt-2">{serverError}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
