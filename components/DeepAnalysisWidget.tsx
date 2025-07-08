'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Clock3, Brain, Share2, Eye, TrendingUp, Award, BookOpen, ChevronLeft, Heart, BookmarkPlus, ExternalLink, User } from "lucide-react";
import toast from 'react-hot-toast';
import AnalysisTypeIcon from './deep-analysis/AnalysisTypeIcon';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface DeepInsight {
  id: string;
  title: string;
  summary: string;
  author: string;
  createdAt: string;
  readTime: number;
  views: number;
  aiConfidence: number;
  tags: string[];
  type: 'AI' | 'تحليل عميق';
  analysisType?: 'manual' | 'ai' | 'mixed';
  url: string;
  isNew?: boolean;
  qualityScore?: number;
  category?: string;
}

interface DeepAnalysisWidgetProps {
  insights: DeepInsight[];
}

export default function DeepAnalysisWidget({ insights }: DeepAnalysisWidgetProps) {
  const [readItems, setReadItems] = useState<string[]>([]);
  const { resolvedTheme, mounted } = useTheme();
  const darkMode = resolvedTheme === 'dark';
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  // بيانات افتراضية للعرض
  const defaultInsights: DeepInsight[] = [
    {
      id: 'default-1',
      title: 'تحليل عميق: مستقبل الذكاء الاصطناعي في المملكة',
      summary: 'دراسة شاملة حول تطور تقنيات الذكاء الاصطناعي وتأثيرها على الاقتصاد السعودي',
      author: 'فريق التحليل',
      createdAt: new Date().toISOString(),
      readTime: 15,
      views: 1250,
      aiConfidence: 95,
      tags: ['ذكاء اصطناعي', 'اقتصاد', 'تقنية'],
      type: 'AI',
      analysisType: 'ai',
      url: '/insights/deep/ai-future-ksa',
      isNew: true,
      qualityScore: 92,
      category: 'تقنية'
    },
    {
      id: 'default-2',
      title: 'رؤية 2030: تحليل التقدم والإنجازات',
      summary: 'تقييم شامل للمشاريع المنجزة والأهداف المحققة في إطار رؤية المملكة 2030',
      author: 'د. عبدالله السالم',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      readTime: 20,
      views: 3200,
      aiConfidence: 88,
      tags: ['رؤية 2030', 'اقتصاد', 'تنمية'],
      type: 'تحليل عميق',
      analysisType: 'manual',
      url: '/insights/deep/vision-2030-progress',
      qualityScore: 89,
      category: 'اقتصاد'
    },
    {
      id: 'default-3',
      title: 'التحول الرقمي في القطاع الحكومي',
      summary: 'كيف تسهم التقنيات الحديثة في تطوير الخدمات الحكومية وتحسين تجربة المواطن',
      author: 'م. سارة الأحمد',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      readTime: 12,
      views: 890,
      aiConfidence: 91,
      tags: ['حكومة رقمية', 'تقنية', 'خدمات'],
      type: 'AI',
      analysisType: 'mixed',
      url: '/insights/deep/digital-transformation',
      qualityScore: 87,
      category: 'تقنية'
    }
  ];

  // استخدام البيانات الافتراضية إذا لم تكن هناك insights
  const displayInsights = insights.length > 0 ? insights : defaultInsights;

  useEffect(() => {
    // قراءة العناصر المقروءة من localStorage
    const read = localStorage.getItem('readAnalysis');
    if (read) {
      setReadItems(JSON.parse(read));
    }
  }, []);

  const handleShare = (item: DeepInsight) => {
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: item.summary,
        url: window.location.origin + item.url
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.origin + item.url);
      toast.success('تم نسخ الرابط');
    }
  };

  const markAsRead = (id: string) => {
    const newReadItems = [...readItems, id];
    setReadItems(newReadItems);
    localStorage.setItem('readAnalysis', JSON.stringify(newReadItems));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `منذ ${diffInMinutes} دقيقة`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `منذ ${hours} ${hours === 1 ? 'ساعة' : 'ساعات'}`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `منذ ${days} ${days === 1 ? 'يوم' : 'أيام'}`;
    }
  };

  // تحديد ما إذا كان التحليل جديد (خلال آخر 24 ساعة)
  const isNewInsight = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    return diffInHours < 24;
  };

  // اختيار الأيقونة بناءً على نوع التحليل
  const getInsightIcon = (category?: string) => {
    switch(category?.toLowerCase()) {
      case 'research':
      case 'أبحاث':
        return <Brain className="w-4 h-4" />;
      case 'report':
      case 'تقارير':
        return <TrendingUp className="w-4 h-4" />;
      case 'global':
      case 'عالمي':
        return <Eye className="w-4 h-4" />;
      case 'tech':
      case 'تقنية':
        return <Award className="w-4 h-4" />;
      case 'economy':
      case 'اقتصاد':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Brain className="w-4 h-4" />;
    }
  };

  // التعامل مع التمرير
  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320; // عرض البطاقة + المسافة
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const targetScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  // تتبع التمرير الحالي
  useEffect(() => {
    const handleScrollUpdate = () => {
      if (scrollContainerRef.current) {
        const scrollLeft = scrollContainerRef.current.scrollLeft;
        const cardWidth = 320; // عرض البطاقة + المسافة
        const index = Math.round(scrollLeft / cardWidth);
        setCurrentIndex(index);
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScrollUpdate);
      return () => scrollContainer.removeEventListener('scroll', handleScrollUpdate);
    }
  }, []);

  return (
    <div id="deep-analysis-highlight" className="py-6 relative overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* العنوان والوصف */}
        <div className="text-center mb-6 max-w-3xl mx-auto">
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 bg-white/20 rounded-full shadow-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
              التحليل العميق من سبق
            </h2>
          </div>
          <p className="text-base sm:text-lg text-white/90 drop-shadow mt-2">
            رؤى استراتيجية ودراسات معمقة بالذكاء الاصطناعي
          </p>
        </div>

        {/* البطاقات - صف أفقي قابل للتمرير ومتوسط */}
        <div className="relative mb-4 flex justify-center">
          <div ref={scrollContainerRef} className="overflow-x-auto scrollbar-hide max-w-full">
            <div className="flex gap-4 pb-4 px-4" style={{ 
              width: 'max-content',
              minWidth: '100%',
              justifyContent: displayInsights.length <= 3 ? 'center' : 'flex-start'
            }}>
              {displayInsights.slice(0, 6).map((item, index) => {
                const isUnread = !readItems.includes(item.id);
                const isAI = item.type === 'AI';
                const isNew = isNewInsight(item.createdAt);
                
                return (
                  <div 
                    key={item.id} 
                    onClick={() => { markAsRead(item.id); router.push(item.url); }}
                    className={`cursor-pointer w-80 flex-shrink-0 ${
                      darkMode 
                        ? 'bg-gradient-to-br from-gray-800 to-gray-850 hover:from-gray-750 hover:to-gray-800 border-gray-700' 
                        : 'bg-white hover:shadow-xl border-gray-200'
                    } rounded-2xl shadow-lg overflow-hidden border transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 group relative`}
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: 'fadeInUp 0.5s ease-out forwards'
                    }}
                  >
                    <div className="p-4">
                      {/* نوع التحليل مع badge محسّن وأيقونة */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                            darkMode 
                              ? isAI ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                              : isAI ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {isAI ? (
                              <>
                                <span className="text-sm">🧠</span>
                                <span>تحليل AI</span>
                              </>
                            ) : (
                              <>
                                <span className="text-sm">🤔</span>
                                <span>تحليل عميق</span>
                              </>
                            )}
                          </span>
                          {item.category && (
                            <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                              • {item.category}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* العنوان مع تأثير hover - مكبر */}
                      <h3 className={`text-base font-bold line-clamp-3 mb-3 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      } group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r ${
                        isAI ? 'group-hover:from-purple-600 group-hover:to-purple-700' : 'group-hover:from-blue-600 group-hover:to-blue-700'
                      } transition-all duration-300`}>
                        {item.title}
                      </h3>

                      {/* التاقات */}
                      <div className="flex gap-1 mb-3 overflow-x-auto scrollbar-hide">
                        <div className="flex gap-1 flex-nowrap">
                          {item.tags.slice(0, 3).map((tag, idx) => (
                            <span 
                              key={idx} 
                              className={`text-xs px-2 py-0.5 rounded-md whitespace-nowrap ${
                                darkMode 
                                  ? 'bg-gray-700/50 text-gray-400 border-gray-600' 
                                  : 'bg-gray-100 text-gray-600 border-gray-200'
                              } border`}
                            >
                              #{tag}
                            </span>
                          ))}
                          {item.tags.length > 3 && (
                            <span className={`text-xs whitespace-nowrap ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                              +{item.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* أزرار التفاعل محسّنة */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1">
                          <a 
                            href={item.url} 
                            onClick={(e) => { e.stopPropagation(); markAsRead(item.id); }}
                            className={`p-1.5 rounded-full transition-all duration-300 transform hover:scale-110 ${
                              darkMode 
                                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            } group/link shadow-sm hover:shadow-md`}
                            title="قراءة المزيد"
                          >
                            <ExternalLink className="w-3 h-3 group-hover/link:rotate-12 transition-transform" />
                          </a>

                          {/* أزرار إضافية للتفاعل */}
                          <button
                            onClick={(e) => { e.stopPropagation(); handleShare(item); }}
                            className={`p-1.5 rounded-full transition-all duration-300 transform hover:scale-110 opacity-0 group-hover:opacity-100 ${
                              darkMode 
                                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            } shadow-sm hover:shadow-md`}
                            title="مشاركة"
                          >
                            <Share2 className="w-3 h-3" />
                          </button>

                          <button
                            className={`p-1.5 rounded-full transition-all duration-300 transform hover:scale-110 opacity-0 group-hover:opacity-100 ${
                              darkMode 
                                ? 'bg-gray-700 hover:bg-red-600 text-gray-300 hover:text-white' 
                                : 'bg-gray-100 hover:bg-red-500 text-gray-700 hover:text-white'
                            } shadow-sm hover:shadow-md`}
                            title="إعجاب"
                          >
                            <Heart className="w-3 h-3" />
                          </button>

                          <button
                            className={`p-1.5 rounded-full transition-all duration-300 transform hover:scale-110 opacity-0 group-hover:opacity-100 ${
                              darkMode 
                                ? 'bg-gray-700 hover:bg-blue-600 text-gray-300 hover:text-white' 
                                : 'bg-gray-100 hover:bg-blue-500 text-gray-700 hover:text-white'
                            } shadow-sm hover:shadow-md`}
                            title="حفظ"
                          >
                            <BookmarkPlus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className={`flex items-center gap-2 text-xs ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {/* مؤشر مميز للبطاقة الأولى */}
                          {index === 0 && (
                            <span className="flex items-center gap-0.5 text-amber-500">
                              <Award className="w-3 h-3 fill-current" />
                              <span className="font-bold">مميز</span>
                            </span>
                          )}
                          <div className="flex items-center gap-1">
                            <Clock3 className="w-2.5 h-2.5" />
                            <span className="font-medium">{item.readTime} د</span>
                          </div>
                        </div>
                      </div>

                      {/* زر عرض التحليل الكامل */}
                      <div className="mt-3 pt-2 pb-4">
                        <a 
                          href={item.url} 
                          onClick={(e) => { e.stopPropagation(); markAsRead(item.id); }}
                          className={`
                            w-fit max-w-[180px] mx-auto flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-all
                            ${isAI 
                              ? darkMode 
                                ? 'bg-slate-100 hover:bg-purple-100 text-gray-900 hover:text-purple-900' 
                                : 'bg-slate-100 hover:bg-purple-100 text-gray-900 hover:text-purple-900'
                              : darkMode 
                                ? 'bg-slate-100 hover:bg-blue-100 text-gray-900 hover:text-blue-900' 
                                : 'bg-slate-100 hover:bg-blue-100 text-gray-900 hover:text-blue-900'
                            }
                            hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] border border-transparent hover:border-opacity-50
                            ${isAI ? 'hover:border-purple-200' : 'hover:border-blue-200'}
                          `}
                        >
                          <Brain className="w-4 h-4" />
                          <span>عرض التحليل الكامل</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* مؤشرات التمرير - مرئية على الشاشات الكبيرة */}
          <div className="hidden md:block absolute left-2 top-1/2 -translate-y-1/2">
            <button 
              onClick={() => handleScroll('left')}
              className="p-2 bg-white/10 backdrop-blur-sm rounded-full shadow-lg hover:bg-white/20 transition-all duration-300 hover:scale-110"
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="w-5 h-5 text-white rotate-180" />
            </button>
          </div>
          <div className="hidden md:block absolute right-2 top-1/2 -translate-y-1/2">
            <button 
              onClick={() => handleScroll('right')}
              className="p-2 bg-white/10 backdrop-blur-sm rounded-full shadow-lg hover:bg-white/20 transition-all duration-300 hover:scale-110"
              disabled={currentIndex >= displayInsights.length - 3}
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* زر استكشاف المزيد - محسّن */}
        <div className="text-center">
          <Link 
            href="/insights/deep" 
            className="inline-flex items-center gap-2 px-5 py-2 bg-white/20 hover:bg-white/30 text-white font-medium text-sm rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-white/30 backdrop-blur-sm group relative overflow-hidden"
          >
            {/* تأثير موجة عند hover */}
            <span className="absolute inset-0 w-full h-full bg-white/20 scale-0 group-hover:scale-100 rounded-full transition-transform duration-500 ease-out"></span>
            
            <BookOpen className="w-4 h-4 relative z-10" />
            <span className="relative z-10">جميع التحليلات</span>
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform relative z-10" />
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* إخفاء شريط التمرير */
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}