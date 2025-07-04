#!/bin/bash

echo "==============================================="
echo "🌱 Sabq AI CMS - نظام إضافة التصنيفات الأساسية"
echo "==============================================="
echo ""

# التحقق من وجود متغيرات البيئة
if [ ! -f .env ]; then
    echo "❌ خطأ: لم يتم العثور على ملف .env"
    echo "   يرجى التأكد من وجود ملف .env مع بيانات الاتصال بقاعدة البيانات"
    exit 1
fi

# التحقق من وجود NODE_ENV
if [ -z "$NODE_ENV" ]; then
    echo "⚠️  تحذير: NODE_ENV غير محدد، سيتم استخدام 'production'"
    export NODE_ENV=production
fi

echo "📊 معلومات البيئة:"
echo "   • البيئة: $NODE_ENV"
echo "   • قاعدة البيانات: PlanetScale"
echo ""

# التحقق من التثبيتات
echo "🔍 التحقق من التثبيتات..."
if ! command -v node &> /dev/null; then
    echo "❌ خطأ: Node.js غير مثبت"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ خطأ: npm غير مثبت"
    exit 1
fi

echo "   ✅ Node.js: $(node --version)"
echo "   ✅ npm: $(npm --version)"
echo ""

# تأكيد من المستخدم
echo "⚠️  تحذير: سيتم تنفيذ العمليات التالية:"
echo "   1. إضافة/تحديث 8 تصنيفات أساسية"
echo "   2. إنشاء حسابات إدارية أساسية (إذا لم تكن موجودة)"
echo ""
echo "📝 التصنيفات التي سيتم إضافتها:"
echo "   • تقنية (technology)"
echo "   • رياضة (sports)"
echo "   • اقتصاد (economy)"
echo "   • سياسة (politics)"
echo "   • محليات (local)"
echo "   • ثقافة ومجتمع (culture)"
echo "   • مقالات رأي (opinion)"
echo "   • منوعات (misc)"
echo ""

read -p "هل تريد المتابعة؟ (y/N) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ تم إلغاء العملية"
    exit 1
fi

# توليد Prisma Client
echo ""
echo "🔧 توليد Prisma Client..."
npm run prisma:generate
if [ $? -ne 0 ]; then
    echo "❌ فشل توليد Prisma Client"
    exit 1
fi

# تشغيل Seed
echo ""
echo "🌱 تشغيل عملية Seed..."
npm run prisma:seed
if [ $? -ne 0 ]; then
    echo "❌ فشل تشغيل عملية Seed"
    exit 1
fi

echo ""
echo "==============================================="
echo "✅ تمت عملية إضافة التصنيفات بنجاح!"
echo "==============================================="
echo ""
echo "📝 الخطوات التالية:"
echo "   1. تحقق من التصنيفات في لوحة التحكم"
echo "   2. قم بتغيير كلمات المرور الافتراضية للحسابات الإدارية"
echo "   3. تأكد من ظهور التصنيفات في الواجهة الأمامية"
echo ""
echo "💡 نصيحة: يمكنك تشغيل 'npm run prisma:studio' لعرض البيانات"
echo "" 