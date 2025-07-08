'use client';

import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import UserDropdown from './UserDropdown';
import { useDarkModeContext } from '@/contexts/DarkModeContext';
import { getCookie } from '@/lib/cookies';

import { 
  Menu, ChevronDown, LogIn, User, Sun, Moon, Activity, Clock
} from 'lucide-react';





interface UserData {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export default function Header() {
  const router = useRouter();
  const { darkMode, mounted, toggleDarkMode } = useDarkModeContext();
  const [user, setUser] = useState<UserData | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newEventsCount, setNewEventsCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);
  const desktopButtonRef = useRef<HTMLButtonElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);

  const fetchUserData = async () => {
    try {
      console.log('[Safari Debug] Fetching user data from API...');
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      console.log('[Safari Debug] API Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('[Safari Debug] API Response data:', data);
        
        if (data.user) {
          setUser(data.user);
          try {
            localStorage.setItem('user', JSON.stringify(data.user));
          } catch (e) {
            console.error('[Safari Debug] localStorage error:', e);
          }
        }
      }
    } catch (error) {
      console.error('[Safari Debug] Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserData = async () => {
    console.log('[Safari Debug] Starting to load user data...');
    
    try {
      const userDataFromStorage = localStorage.getItem('user');
      if (userDataFromStorage) {
        console.log('[Safari Debug] Found user in localStorage');
        const parsedUser = JSON.parse(userDataFromStorage);
        setUser(parsedUser);
        setIsLoading(false);
        return;
      }
    } catch (error) {
      console.error('[Safari Debug] localStorage error:', error);
    }
    
    try {
      const userCookie = getCookie('user');
      console.log('[Safari Debug] User cookie exists:', !!userCookie);
      
      if (userCookie) {
        const userData = JSON.parse(userCookie);
        console.log('[Safari Debug] Parsed user from cookie:', userData);
        setUser(userData);
        try {
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (e) {
          console.error('[Safari Debug] localStorage save error:', e);
        }
        setIsLoading(false);
        return;
      }
    } catch (error) {
      console.error('[Safari Debug] Cookie parsing error:', error);
    }
    
    console.log('[Safari Debug] No cached data found, fetching from API...');
    await fetchUserData();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadUserData();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // فحص الأحداث الجديدة
  useEffect(() => {
    const checkNewEvents = async () => {
      try {
        const response = await fetch('/api/articles?status=published&limit=10');
        const data = await response.json();
        
        if (data.articles) {
          const newEvents = data.articles.filter((article: any) => 
            new Date(article.created_at).getTime() > Date.now() - 3600000 // آخر ساعة
          );
          setNewEventsCount(newEvents.length);
        }
      } catch (error) {
        console.error('Error checking new events:', error);
      }
    };

    checkNewEvents();
    
    // فحص كل 5 دقائق
    const interval = setInterval(checkNewEvents, 300000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      console.log('[Safari Debug] No user found after loading, retrying...');
      const retryTimer = setTimeout(() => {
        fetchUserData();
      }, 1000);
      
      return () => clearTimeout(retryTimer);
    }
  }, [isLoading, user]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      
      // تجاهل النقرات على الروابط داخل القائمة
      if ((target as HTMLElement).closest('a') || (target as HTMLElement).closest('button')) {
        return;
      }
      
      // للديسكتوب
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setShowDropdown(false);
      }
      
      // للموبايل
      if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(target)) {
        setShowDropdown(false);
      }
    }

    // استخدام click بدلاً من mousedown لتجنب التداخل مع النقرات
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        localStorage.clear();
        sessionStorage.clear();
        
        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
        
        setUser(null);
        toast.success('تم تسجيل الخروج بنجاح');
        
        setTimeout(() => {
          window.location.href = '/'; // العودة للصفحة الرئيسية بدلاً من صفحة تسجيل الدخول
        }, 500);
      } else {
        toast.error('حدث خطأ في تسجيل الخروج');
      }
    } catch (error) {
      console.error('خطأ في تسجيل الخروج:', error);
      toast.error('حدث خطأ في تسجيل الخروج');
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const navigationItems = [
    { label: 'الرئيسية', url: '/', order: 1 },
    { label: 'لحظة بلحظة', url: '/moment-by-moment', order: 2, highlight: true },
    { label: 'الأخبار', url: '/news', order: 3 },
    { label: 'مقالات الرأي', url: '/opinion', order: 4 },
    { label: 'التصنيفات', url: '/categories', order: 5 },
    { label: 'التحليلات العميقة', url: '/insights/deep', order: 6 },
    { label: 'تواصل معنا', url: '/contact', order: 7 }
  ];

  return (
    <div className="bg-white dark:bg-gray-900 shadow-lg dark:shadow-black/50 sticky top-0 z-50 transition-colors duration-300 h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Mobile Layout */}
          <div className="flex lg:hidden items-center justify-between w-full">
            {/* زر المينيو على اليمين */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              aria-label="القائمة الرئيسية"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* الشعار في المنتصف */}
            <Link href="/" className="flex-shrink-0">
              <span className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">سبق</span>
            </Link>

            {/* أزرار التحكم على اليسار */}
            <div className="flex items-center gap-2">
              {mounted && (
                <button
                  onClick={toggleDarkMode}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  aria-label="تبديل الوضع الليلي"
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              )}
              
              {isLoading ? (
                <div className="w-8 h-8" />
              ) : user ? (
                <div ref={mobileDropdownRef}>
                  <button
                    ref={mobileButtonRef}
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label="قائمة المستخدم"
                  >
                    {user.avatar ? (
                      <Image 
                        src={user.avatar} 
                        alt={user.name} 
                        width={32} 
                        height={32} 
                        className="w-8 h-8 rounded-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-xs shadow-md">
                        {getInitials(user.name)}
                      </div>
                    )}
                  </button>

                  {showDropdown && (
                    <UserDropdown 
                      user={user}
                      onClose={() => setShowDropdown(false)}
                      onLogout={handleLogout}
                      anchorElement={mobileButtonRef.current}
                    />
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  aria-label="تسجيل الدخول"
                >
                  <User className="w-6 h-6" />
                </Link>
              )}
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:flex items-center justify-between w-full">
            <Link href="/" className="flex-shrink-0 min-w-[120px]">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">سبق</span>
            </Link>

            <nav className="flex items-center gap-8 flex-1 justify-center">
              {navigationItems.map((item) => (
                <Link 
                  key={item.url}
                  href={item.url} 
                  className={`flex items-center gap-2 transition-all font-medium text-lg ${
                    item.highlight 
                      ? 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 relative' 
                      : 'text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400'
                  } hover:font-semibold`}
                >
                  {item.label === 'لحظة بلحظة' && (
                    <Activity className="w-5 h-5 animate-pulse" />
                  )}
                  <span>{item.label}</span>
                  {item.highlight && (
                    <span className="absolute -top-1 -right-2 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                  )}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4 flex-shrink-0">
              {/* رابط اللحظة بلحظة مع تنبيه */}
              <Link
                href="/moment-by-moment"
                className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                {newEventsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {newEventsCount > 9 ? '9+' : newEventsCount}
                  </span>
                )}
              </Link>

              {mounted && (
                <button
                  onClick={toggleDarkMode}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  aria-label="تبديل الوضع الليلي"
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              )}

              {isLoading ? (
                <div className="w-10 h-10" />
              ) : user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    ref={desktopButtonRef}
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label="قائمة المستخدم"
                  >
                    {user.avatar ? (
                      <Image 
                        src={user.avatar} 
                        alt={user.name} 
                        width={40} 
                        height={40} 
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm shadow-md ${user.avatar ? 'hidden' : ''}`}>
                      {getInitials(user.name)}
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${
                      showDropdown ? 'rotate-180' : ''
                    }`} />
                  </button>

                  {showDropdown && (
                    <UserDropdown 
                      user={user}
                      onClose={() => setShowDropdown(false)}
                      onLogout={handleLogout}
                      anchorElement={desktopButtonRef.current}
                    />
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-[1.02] shadow-md text-base"
                >
                  <LogIn className="w-5 h-5" />
                  <span>تسجيل الدخول</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {showMobileMenu && (
          <div className="lg:hidden py-4 border-t border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 absolute top-full left-0 right-0 shadow-lg">
            <nav className="flex flex-col gap-2 px-6">
              {navigationItems.map((item) => (
                <Link
                  key={item.url}
                  href={item.url}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium ${
                    item.highlight
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  {item.label === 'لحظة بلحظة' && (
                    <Activity className="w-5 h-5 animate-pulse" />
                  )}
                  <span className="flex-1">{item.label}</span>
                  {item.highlight && (
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                  )}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}