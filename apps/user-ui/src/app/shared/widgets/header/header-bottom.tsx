'use client';

import {
  AlignLeft,
  ChevronDown,
  HeartIcon,
  Search,
  ShoppingCart,
  User,
} from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { navItems } from '../../../config/constants';
import useUser from 'apps/user-ui/src/hooks/useUser';

const HeaderBottom = () => {
  const [show, setShow] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const { user, isLoading } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      className={`w-full border-t border-[#99999938] bg-white transition-all duration-300 ${
        isSticky ? 'fixed left-0 top-0 z-[100] shadow-lg' : ''
      }`}
    >
      <div
        className={`relative m-auto flex w-[80%] items-center justify-between ${isSticky ? 'py-2' : 'py-0'}`}
      >
        <div
          className="flex h-[50px] w-[260px] cursor-pointer items-center justify-between bg-[#3489FF] px-5"
          onClick={() => setShow(!show)}
        >
          <div className="flex items-center gap-2">
            <AlignLeft color="white" />
            <span className="font-medium text-white">All Categories</span>
          </div>
          <ChevronDown color="white" />
        </div>

        {show && (
          <div className="absolute left-0 top-full h-[400px] w-[260px] bg-[#f5f5f5] shadow-md">
            {/* menu content */}
          </div>
        )}
        <div className="flex items-center">
          {navItems.map((i: NavItemsTypes, index: number) => (
            <Link className="px-5 font-medium" key={index} href={i.href}>
              {i.title}
            </Link>
          ))}
        </div>
        <div>
          {isSticky && (
            <div className="w-[80%] py-5 m-auto flex items-center justify-between">
              <div>
                <Link href="/">
                  <span className="text-2xl font-semibold">Eshop</span>
                </Link>
              </div>
              <div className="flex flex-1 justify-center">
                <div className="relative w-full max-w-150">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="h-[55px] w-full border-[2.5px] border-[#3489FF] px-4 pr-16 font-Poppins outline-none"
                  />
                  <button
                    type="button"
                    className="absolute right-0 top-0 flex h-[55px] w-[60px] cursor-pointer items-center justify-center bg-[#3489FF]"
                    aria-label="Search"
                  >
                    <Search color="white" size={20} />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  {!isLoading && user ? (
                    <>
                      <Link
                        href="/profile"
                        className="flex items-center justify-center"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-gray-100">
                          <User size={18} />
                        </div>
                      </Link>
                      <Link
                        href="/profile"
                        className="flex items-center justify-center"
                      >
                        <span className="block font-medium">Hello,</span>
                        <span className="font-medium">
                          {user?.data.user.name.split(' ')[0]}
                        </span>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="flex items-center justify-center"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-gray-100">
                          <User size={18} />
                        </div>
                      </Link>
                      <Link
                        href="/login"
                        className="flex items-center justify-center"
                      >
                        <span className="block font-medium">Hello,</span>
                        <span className="font-medium">Sign IN</span>
                      </Link>
                    </>
                  )}
                </div>
                <div className="relative flex items-center gap-5">
                  <Link
                    href="/wishlist"
                    className="relative flex items-center justify-center"
                  >
                    <HeartIcon />
                    <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-red-500 text-[10px] font-bold text-white">
                      3
                    </span>
                  </Link>
                </div>
                <div className="relative flex items-center gap-5">
                  <Link
                    href="/cart"
                    className="relative flex items-center justify-center"
                  >
                    <ShoppingCart />
                    <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-red-500 text-[10px] font-bold text-white">
                      3
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderBottom;
