#!/bin/bash

# سكريبت إعداد البيئة للإنتاج
# يستخدم على السيرفر لضمان الإعدادات الصحيحة

echo "🚀 إعداد البيئة للإنتاج..."

# التحقق من وجود المتغيرات المطلوبة
check_env_var() {
    if [ -z "${!1}" ]; then
        echo "❌ خطأ: المتغير $1 غير موجود!"
        return 1
    else
        echo "✅ $1 موجود"
        return 0
    fi
}

echo ""
echo "📋 التحقق من متغيرات البيئة المطلوبة..."
echo "========================================="

# المتغيرات الأساسية
REQUIRED_VARS=(
    "DATABASE_URL"
    "JWT_SECRET"
    "NEXT_PUBLIC_API_URL"
    "NEXT_PUBLIC_SITE_URL"
)

# المتغيرات الاختيارية
OPTIONAL_VARS=(
    "OPENAI_API_KEY"
    "CLOUDINARY_CLOUD_NAME"
    "CLOUDINARY_API_KEY"
    "CLOUDINARY_API_SECRET"
    "SMTP_HOST"
    "SMTP_USER"
    "SMTP_PASS"
)

# التحقق من المتغيرات المطلوبة
ALL_GOOD=true
for var in "${REQUIRED_VARS[@]}"; do
    if ! check_env_var "$var"; then
        ALL_GOOD=false
    fi
done

# التحقق من المتغيرات الاختيارية
echo ""
echo "📋 التحقق من المتغيرات الاختيارية..."
echo "========================================="
for var in "${OPTIONAL_VARS[@]}"; do
    check_env_var "$var" || true
done

if [ "$ALL_GOOD" = false ]; then
    echo ""
    echo "❌ بعض المتغيرات المطلوبة مفقودة!"
    echo "يرجى إضافتها في لوحة تحكم السيرفر"
    exit 1
fi

echo ""
echo "🔧 توليد Prisma Client..."
echo "========================================="
npx prisma generate

echo ""
echo "🔍 اختبار الاتصال بقاعدة البيانات..."
echo "========================================="
node scripts/test-database-connection.js

if [ $? -ne 0 ]; then
    echo "❌ فشل اختبار قاعدة البيانات!"
    exit 1
fi

echo ""
echo "🏗️ بناء المشروع..."
echo "========================================="
npm run build

if [ $? -ne 0 ]; then
    echo "❌ فشل بناء المشروع!"
    exit 1
fi

echo ""
echo "✅ تم إعداد البيئة بنجاح!"
echo ""
echo "📝 ملاحظات مهمة:"
echo "1. تأكد من أن DATABASE_URL يحتوي على ?sslmode=require"
echo "2. تأكد من أن JWT_SECRET قوي وآمن"
echo "3. تأكد من أن NEXT_PUBLIC_API_URL يشير إلى النطاق الصحيح"
echo ""
echo "🎉 يمكنك الآن تشغيل المشروع باستخدام: npm start" 