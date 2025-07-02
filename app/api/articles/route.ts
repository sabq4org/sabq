import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { filterTestContent, rejectTestContent } from '@/lib/data-protection'

// دالة مساعدة لإضافة CORS headers
function addCorsHeaders(response: NextResponse): NextResponse {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization, Accept');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  return response;
}

// دالة لإنشاء response مع CORS headers
function corsResponse(data: any, status: number = 200): NextResponse {
  const response = NextResponse.json(data, { status });
  return addCorsHeaders(response);
}

// دالة لمعالجة طلبات OPTIONS
function handleOptions(): NextResponse {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization, Accept',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400',
    },
  });
}

// معالجة طلبات OPTIONS للـ CORS
export async function OPTIONS() {
  return handleOptions();
}

export const runtime = 'nodejs'

// جلب المقالات
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 بدء معالجة طلب المقالات...')
    const { searchParams } = new URL(request.url)
    
    // بناء شروط البحث
    const where: any = {}
    
    // فلترة حسب الحالة
    const status = searchParams.get('status')
    if (status) {
      where.status = status
    } else {
      // استبعاد المقالات المحذوفة بشكل افتراضي
      where.status = { not: 'deleted' }
    }

    // فلترة حسب التصنيف
    const categoryId = searchParams.get('category_id')
    if (categoryId) {
      where.categoryId = categoryId
    }

    // فلترة حسب المؤلف
    const authorId = searchParams.get('author_id')
    if (authorId) {
      where.authorId = authorId
    }

    // البحث في العنوان والمحتوى
    const search = searchParams.get('search')
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } },
        { excerpt: { contains: search } }
      ]
    }

    // فلترة المقالات المميزة
    const featured = searchParams.get('featured')
    if (featured === 'true') {
      where.featured = true
    }

    // فلترة الأخبار العاجلة
    const breaking = searchParams.get('breaking')
    if (breaking === 'true') {
      where.breaking = true
    }

    // الترتيب
    const sortField = searchParams.get('sort') || 'created_at'
    const order = (searchParams.get('order') || 'desc') as 'asc' | 'desc'
    
    let orderBy: any = {}
    switch (sortField) {
      case 'title':
        orderBy = { title: order }
        break
      case 'views':
        orderBy = { views: order }
        break
      case 'published_at':
        orderBy = { publishedAt: order }
        break
      default:
        orderBy = { createdAt: order }
    }

    // التقسيم (Pagination)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '6')
    const skip = (page - 1) * limit

    // جلب المقالات من الملف المحلي
    console.time('🔍 جلب المقالات من الملف المحلي')
    const articlesFilePath = path.join(process.cwd(), 'data', 'articles.json')
    const articlesData = JSON.parse(await fs.readFile(articlesFilePath, 'utf-8'))
    let articles = articlesData.articles || []
    
    // تطبيق الفلاتر
    if (status) {
      articles = articles.filter((article: any) => article.status === status)
    }
    
    if (categoryId) {
      articles = articles.filter((article: any) => article.category_id === categoryId)
    }
    
    if (authorId) {
      articles = articles.filter((article: any) => article.author_id === authorId)
    }
    
    if (search) {
      articles = articles.filter((article: any) => 
        article.title?.includes(search) || 
        article.content?.includes(search) || 
        article.summary?.includes(search)
      )
    }
    
    if (featured === 'true') {
      articles = articles.filter((article: any) => article.is_featured)
    }
    
    if (breaking === 'true') {
      articles = articles.filter((article: any) => article.is_breaking)
    }
    
    // الترتيب
    articles.sort((a: any, b: any) => {
      let aValue, bValue
      switch (sortField) {
        case 'title':
          aValue = a.title || ''
          bValue = b.title || ''
          break
        case 'views':
          aValue = a.views_count || 0
          bValue = b.views_count || 0
          break
        case 'published_at':
          aValue = a.published_at || a.created_at
          bValue = b.published_at || b.created_at
          break
        default:
          aValue = a.created_at
          bValue = b.created_at
      }
      
      if (order === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
    
    const total = articles.length
    articles = articles.slice(skip, skip + limit)
    console.timeEnd('🔍 جلب المقالات من الملف المحلي')

    // تحويل البيانات للتوافق مع الواجهة
    console.time('🔄 تحويل وتنسيق البيانات')
    const formattedArticles = articles.map((article: any) => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      content: article.content,
      summary: article.summary || article.excerpt,
      author_id: article.author_id,
      author: article.author || null,
      category_id: article.category_id,
      category_name: article.category_name || 'غير مصنف',
      status: article.status,
      featured_image: article.featured_image,
      is_breaking: article.is_breaking,
      is_featured: article.is_featured,
      views_count: article.views_count || 0,
      reading_time: article.reading_time || calculateReadingTime(article.content),
      created_at: article.created_at,
      updated_at: article.updated_at,
      published_at: article.published_at,
      seo_keywords: article.seo_keywords || [],
      tags: article.tags || [],
      interactions_count: 0,
      comments_count: 0
    }))
    console.timeEnd('🔄 تحويل وتنسيق البيانات')

    // تصفية المحتوى التجريبي في الإنتاج
    console.time('🚫 تصفية المحتوى التجريبي')
    const filteredArticles = filterTestContent(formattedArticles)
    console.timeEnd('🚫 تصفية المحتوى التجريبي')

    // إحصائيات التقسيم
    const stats = {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: skip + limit < total,
      hasPrev: page > 1
    }

    console.log(`✅ تم جلب ${filteredArticles.length} مقال من أصل ${total}`)

    return corsResponse({
      success: true,
      articles: filteredArticles,
      data: filteredArticles,
      pagination: stats,
      filters: {
        status: searchParams.get('status'),
        category_id: searchParams.get('category_id'),
        search: searchParams.get('search'),
        featured: searchParams.get('featured'),
        breaking: searchParams.get('breaking')
      }
    })
  } catch (error) {
    console.error('خطأ في جلب المقالات:', error)
    return corsResponse({
      success: false,
      error: 'فشل في استرجاع المقالات',
      message: error instanceof Error ? error.message : 'خطأ غير معروف'
    }, 500)
  }
}

// إنشاء مقال جديد
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      content,
      excerpt,
      category_id,
      status = 'draft',
      featured_image,
      metadata = {}
    } = body

    // التحقق من البيانات المطلوبة
    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: 'العنوان والمحتوى مطلوبان' },
        { status: 400 }
      )
    }

    // إنشاء مقال جديد في الملف المحلي
    const articlesFilePath = path.join(process.cwd(), 'data', 'articles.json')
    const articlesData = JSON.parse(await fs.readFile(articlesFilePath, 'utf-8'))
    
    const newArticle = {
      id: Date.now().toString(),
      title,
      content,
      summary: excerpt || content.substring(0, 200) + '...',
      category_id: category_id || null,
      status,
      featured_image,
      author_id: 'default-author-id',
      slug: generateSlug(title),
      views_count: 0,
      reading_time: Math.ceil(content.split(' ').length / 200),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: status === 'published' ? new Date().toISOString() : null,
      is_breaking: false,
      is_featured: false,
      seo_keywords: [],
      tags: [],
      metadata: {
        ...metadata,
        createdAt: new Date().toISOString(),
        isSmartDraft: metadata.isSmartDraft || false,
        aiEditor: metadata.aiEditor || false
      }
    }
    
    articlesData.articles.push(newArticle)
    await fs.writeFile(articlesFilePath, JSON.stringify(articlesData, null, 2))
    
    const article = newArticle

    console.log('✅ تم إنشاء المقال:', {
      id: article.id,
      title: article.title,
      status: article.status,
      isSmartDraft: metadata.isSmartDraft
    })

    return NextResponse.json({
      success: true,
      article,
      message: 'تم حفظ المقال بنجاح'
    })
  } catch (error) {
    console.error('❌ خطأ في إنشاء المقال:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'خطأ في حفظ المقال',
        details: error instanceof Error ? error.message : 'خطأ غير معروف'
      },
      { status: 500 }
    )
  }
}

// دوال مساعدة
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\u0600-\u06FF\w\s-]/g, '') // إزالة الأحرف غير المسموحة
    .replace(/\s+/g, '-') // استبدال المسافات بشرطة
    .replace(/-+/g, '-') // إزالة الشرطات المتكررة
    .trim()
    .substring(0, 100) // تحديد الطول
}

function calculateReadingTime(content: string): number {
  const wordsCount = content.split(/\s+/).length
  return Math.ceil(wordsCount / 200)
}

// DELETE: حذف مقالات (حذف ناعم)
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const ids = body.ids || []

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'معرفات المقالات مطلوبة'
      }, { status: 400 })
    }

    // تحديث حالة المقالات إلى "محذوف" في الملف المحلي
    const articlesFilePath = path.join(process.cwd(), 'data', 'articles.json')
    const articlesData = JSON.parse(await fs.readFile(articlesFilePath, 'utf-8'))
    
    let affectedCount = 0
    articlesData.articles = articlesData.articles.map((article: any) => {
      if (ids.includes(article.id)) {
        article.status = 'deleted'
        affectedCount++
      }
      return article
    })
    
    await fs.writeFile(articlesFilePath, JSON.stringify(articlesData, null, 2))
    
    const result = { count: affectedCount }

    return NextResponse.json({
      success: true,
      affected: result.count,
      message: `تم حذف ${result.count} مقال(ات) بنجاح`
    })
  } catch (error) {
    console.error('خطأ في حذف المقالات:', error)
    return NextResponse.json({
      success: false,
      error: 'فشل في حذف المقالات',
      message: error instanceof Error ? error.message : 'خطأ غير معروف'
    }, { status: 500 })
  }
} 