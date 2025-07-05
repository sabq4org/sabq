#!/bin/bash

# سكريبت تشغيل مشروع سبق
# يتأكد من وجود الإعدادات الصحيحة ثم يشغل المشروع

echo "🚀 بدء تشغيل مشروع سبق..."

# التحقق من وجود ملف الإعدادات الصحيح
if [ ! -f .env.local ] || ! grep -q "postgresql://" .env.local; then
    echo "⚠️  الإعدادات غير صحيحة، جاري إعداد البيئة..."
    ./scripts/setup-env.sh
fi

# توليد Prisma Client
echo "🔧 توليد Prisma Client..."
npx prisma generate

# تشغيل المشروع
echo "🎉 تشغيل المشروع..."
npm run dev 