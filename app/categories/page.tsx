'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tag, BookOpen, Loader2, Search, TrendingUp, Trophy, Building2, Heart, Leaf, Globe, Activity, Code, Sparkles, Palette, Users } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  name_ar: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  cover_image?: string;
  articles_count?: number;
  is_active: boolean;
  metadata?: {
    cover_image?: string;
    [key: string]: any;
  };
}

// بيانات التصنيفات مع الألوان والأيقونات
const categoryData = {
  'تقنية': { 
    icon: Code, 
    color: 'purple',
    bgColor: 'bg-purple-500',
    hoverColor: 'hover:bg-purple-600',
    lightBg: 'bg-purple-50',
    darkBg: 'dark:bg-purple-900/20',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
  },
  'رياضة': { 
    icon: Trophy, 
    color: 'blue',
    bgColor: 'bg-blue-500',
    hoverColor: 'hover:bg-blue-600',
    lightBg: 'bg-blue-50',
    darkBg: 'dark:bg-blue-900/20',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80'
  },
  'اقتصاد': { 
    icon: TrendingUp, 
    color: 'green',
    bgColor: 'bg-green-500',
    hoverColor: 'hover:bg-green-600',
    lightBg: 'bg-green-50',
    darkBg: 'dark:bg-green-900/20',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80'
  },
  'سياسة': { 
    icon: Building2, 
    color: 'red',
    bgColor: 'bg-red-500',
    hoverColor: 'hover:bg-red-600',
    lightBg: 'bg-red-50',
    darkBg: 'dark:bg-red-900/20',
    image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=800&q=80'
  },
  'ثقافة': { 
    icon: Palette, 
    color: 'yellow',
    bgColor: 'bg-yellow-500',
    hoverColor: 'hover:bg-yellow-600',
    lightBg: 'bg-yellow-50',
    darkBg: 'dark:bg-yellow-900/20',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'
  },
  'صحة': { 
    icon: Heart, 
    color: 'pink',
    bgColor: 'bg-pink-500',
    hoverColor: 'hover:bg-pink-600',
    lightBg: 'bg-pink-50',
    darkBg: 'dark:bg-pink-900/20',
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80'
  },
  'محلي': { 
    icon: Users, 
    color: 'indigo',
    bgColor: 'bg-indigo-500',
    hoverColor: 'hover:bg-indigo-600',
    lightBg: 'bg-indigo-50',
    darkBg: 'dark:bg-indigo-900/20',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80'
  },
  'دولي': { 
    icon: Globe, 
    color: 'cyan',
    bgColor: 'bg-cyan-500',
    hoverColor: 'hover:bg-cyan-600',
    lightBg: 'bg-cyan-50',
    darkBg: 'dark:bg-cyan-900/20',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80'
  },
  'منوعات': { 
    icon: Activity, 
    color: 'orange',
    bgColor: 'bg-orange-500',
    hoverColor: 'hover:bg-orange-600',
    lightBg: 'bg-orange-50',
    darkBg: 'dark:bg-orange-900/20',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80'
  },
  'بيئة': { 
    icon: Leaf, 
    color: 'teal',
    bgColor: 'bg-teal-500',
    hoverColor: 'hover:bg-teal-600',
    lightBg: 'bg-teal-50',
    darkBg: 'dark:bg-teal-900/20',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80'
  },
  'تعليم': { 
    icon: BookOpen, 
    color: 'emerald',
    bgColor: 'bg-emerald-500',
    hoverColor: 'hover:bg-emerald-600',
    lightBg: 'bg-emerald-50',
    darkBg: 'dark:bg-emerald-900/20',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80'
  },
  'فنون': { 
    icon: Palette, 
    color: 'rose',
    bgColor: 'bg-rose-500',
    hoverColor: 'hover:bg-rose-600',
    lightBg: 'bg-rose-50',
    darkBg: 'dark:bg-rose-900/20',
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8a?auto=format&fit=crop&w=800&q=80'
  },
  'سفر': { 
    icon: Globe, 
    color: 'sky',
    bgColor: 'bg-sky-500',
    hoverColor: 'hover:bg-sky-600',
    lightBg: 'bg-sky-50',
    darkBg: 'dark:bg-sky-900/20',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'
  },
  'علوم': { 
    icon: Code, 
    color: 'violet',
    bgColor: 'bg-violet-500',
    hoverColor: 'hover:bg-violet-600',
    lightBg: 'bg-violet-50',
    darkBg: 'dark:bg-violet-900/20',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80'
  },
  'تكنولوجيا': { 
    icon: Code, 
    color: 'purple',
    bgColor: 'bg-purple-500',
    hoverColor: 'hover:bg-purple-600',
    lightBg: 'bg-purple-50',
    darkBg: 'dark:bg-purple-900/20',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=800&q=80'
  },
  'أخبار': { 
    icon: Activity, 
    color: 'blue',
    bgColor: 'bg-blue-500',
    hoverColor: 'hover:bg-blue-600',
    lightBg: 'bg-blue-50',
    darkBg: 'dark:bg-blue-900/20',
    image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80'
  }
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const categoriesData = data.categories || data.data || [];
          console.log('Categories page - Categories with images:', categoriesData.filter((cat: any) => cat.cover_image).map((cat: any) => ({
            name: cat.name_ar,
            cover_image: cat.cover_image
          })));
          const activeCategories = categoriesData.filter((cat: Category) => cat.is_active);
          setCategories(activeCategories);
        } else {
          console.error('Error fetching categories:', data.message || 'Unknown error');
          setCategories([]);
        }
      } else {
        console.error('Error fetching categories:', response.status, response.statusText);
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name_ar.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryData = (name: string) => {
    // البحث المباشر في البيانات المعرفة
    const directMatch = categoryData[name as keyof typeof categoryData];
    if (directMatch) return directMatch;
    
    // البحث الجزئي في الكلمات المفتاحية
    const keywords = {
      'تقني': categoryData['تقنية'],
      'تكنولوجي': categoryData['تكنولوجيا'],
      'رياضي': categoryData['رياضة'],
      'اقتصادي': categoryData['اقتصاد'],
      'سياسي': categoryData['سياسة'],
      'ثقافي': categoryData['ثقافة'],
      'صحي': categoryData['صحة'],
      'محلي': categoryData['محلي'],
      'دولي': categoryData['دولي'],
      'منوع': categoryData['منوعات'],
      'بيئي': categoryData['بيئة'],
      'تعليمي': categoryData['تعليم'],
      'فني': categoryData['فنون'],
      'سفر': categoryData['سفر'],
      'علمي': categoryData['علوم'],
      'خبر': categoryData['أخبار']
    };
    
    for (const [keyword, data] of Object.entries(keywords)) {
      if (name.includes(keyword)) return data;
    }
    
    // إرجاع بيانات افتراضية جذابة
    const defaultImages = [
      'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80'
    ];
    
    const randomImage = defaultImages[Math.floor(Math.random() * defaultImages.length)];
    
    return {
      icon: Tag,
      color: 'gray',
      bgColor: 'bg-gray-500',
      hoverColor: 'hover:bg-gray-600',
      lightBg: 'bg-gray-50',
      darkBg: 'dark:bg-gray-900/20',
      image: randomImage
    };
  };

  const getCategoryImage = (category: Category) => {
    // استخدام الصورة المرفوعة من لوحة التحكم إذا كانت موجودة
    const coverImage = category.cover_image || 
                      (category.metadata && typeof category.metadata === 'object' && 
                       'cover_image' in category.metadata ? 
                       (category.metadata as any).cover_image : null);
    
    if (coverImage) {
      // إذا كانت الصورة محلية، أضف URL الأساسي
      if (coverImage.startsWith('/')) {
        return `${process.env.NEXT_PUBLIC_SITE_URL || ''}${coverImage}`;
      }
      return coverImage;
    }
    
    // استخدام الصورة الافتراضية من categoryData
    const data = getCategoryData(category.name_ar);
    return data.image;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <Header />
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">جاري تحميل التصنيفات</h3>
            <p className="text-gray-500 dark:text-gray-400">نحضر لك أفضل المحتوى المصنف...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-1">
        {/* Hero Section with Animated Gradient */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-black opacity-20"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0di00aC0ydjRoLTR2Mmg0djRoMnYtNGg0di0yaC00em0wLTMwVjBoLTJ2NGgtNHYyaDR2NGgyVjZoNFY0aC00ek02IDM0di00SDR2NEgwdjJoNHY0aDJ2LTRoNHYtMkg2ek02IDRWMEG0NHY0SDB2Mmg0djRoMlY2aDRWNEg2eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
          </div>
          <div className="relative max-w-7xl mx-auto px-6 py-20">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-6 shadow-2xl">
                <Sparkles className="w-10 h-10 text-white animate-pulse drop-shadow-lg" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
                مكتبة التصنيفات
              </h1>
              <p className="text-xl md:text-2xl text-white text-opacity-90 max-w-3xl mx-auto mb-12 drop-shadow">
                اكتشف عالماً من المعرفة المنظمة في تصنيفات متنوعة تناسب جميع اهتماماتك
              </p>
              {/* Stats with Black Background and White Border */}
              <div className="inline-flex items-center gap-6 md:gap-8 bg-black backdrop-blur-md rounded-2xl px-6 md:px-8 py-4 shadow-2xl border-2 border-white">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">{categories.length}</div>
                  <div className="text-xs md:text-sm text-white font-medium">تصنيف نشط</div>
                </div>
                <div className="w-px h-10 md:h-12 bg-white"></div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                    {categories.reduce((acc, cat) => acc + (cat.articles_count || 0), 0)}
                  </div>
                  <div className="text-xs md:text-sm text-white font-medium">مقال متنوع</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-10 shadow-md">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="relative w-full max-w-md mx-auto">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث في التصنيفات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-12 pl-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50 focus:border-transparent transition-all text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </section>

        {/* Categories Grid with Improved Spacing */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-20">
              <Tag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">لا توجد تصنيفات</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm ? 'لا توجد تصنيفات تطابق البحث' : 'لا توجد تصنيفات متاحة حالياً'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredCategories.map((category) => {
                const categorySlug = category.slug || category.name_ar.toLowerCase().replace(/\s+/g, '-');
                const data = getCategoryData(category.name_ar);
                const Icon = data.icon;
                const imageSrc = getCategoryImage(category);
                
                return (
                  <Link
                    key={category.id}
                    href={`/categories/${categorySlug}`}
                    className="group block"
                  >
                    <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 h-80 transition-shadow duration-300">
                      {/* Background Image with Overlay */}
                      <div className="absolute inset-0">
                        <Image 
                          src={imageSrc} 
                          alt={category.name_ar}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          onError={(e) => {
                            console.error(`Failed to load image for ${category.name_ar}:`, imageSrc);
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                      </div>
                      {/* Content */}
                      <div className="relative p-4 md:p-6 h-full flex flex-col justify-end">
                        {/* Bottom Content Container */}
                        <div className="flex items-end justify-between gap-3 md:gap-4">
                          {/* Right Side: Icon + Text */}
                          <div className="flex items-center gap-2 md:gap-3">
                            {/* Small Icon with Circular Background */}
                            <div className="w-12 h-12 md:w-14 md:h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                              {category.icon ? (
                                <span className="text-xl md:text-2xl">{category.icon}</span>
                              ) : (
                                <Icon className={`w-6 h-6 md:w-7 md:h-7 ${data.bgColor.replace('bg-', 'text-')}`} />
                              )}
                            </div>
                            {/* Title and Description */}
                            <div className="flex-1">
                              <h3 className="text-lg md:text-xl font-bold text-white mb-1 drop-shadow-lg">
                                {category.name_ar}
                              </h3>
                              {(() => {
                                let desc = category.description;
                                // إذا كان الوصف عبارة عن JSON، استخرج القيمة الفعلية
                                if (desc && desc.startsWith('{')) {
                                  try {
                                    const parsed = JSON.parse(desc);
                                    desc = parsed.ar || parsed.description || desc;
                                  } catch (e) {
                                    // استخدم النص كما هو إذا فشل التحليل
                                  }
                                }
                                return desc ? (
                                  <p className="text-white/80 text-xs md:text-sm line-clamp-2 drop-shadow">
                                    {desc}
                                  </p>
                                ) : null;
                              })()}
                            </div>
                          </div>
                          {/* Left Side: Articles Count */}
                          <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 md:py-2 rounded-full border border-white/30 flex-shrink-0">
                            <BookOpen className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                            <span className="text-xs md:text-sm font-medium text-white whitespace-nowrap">{category.articles_count || 0} مقال</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}