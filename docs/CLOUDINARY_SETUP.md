# دليل إعداد Cloudinary

## المشكلة الحالية
تظهر رسالة خطأ: `Invalid Signature` عند محاولة رفع الصور

## السبب
هذا يعني أن `CLOUDINARY_API_SECRET` غير صحيح أو مفقود

## الحل

### 1. الحصول على بيانات Cloudinary الصحيحة

1. اذهب إلى [Cloudinary Dashboard](https://cloudinary.com/console)
2. سجل دخولك أو أنشئ حساب جديد مجاني
3. في الصفحة الرئيسية ستجد قسم **API Environment variable**
4. انسخ القيم التالية:
   - Cloud name
   - API Key
   - API Secret

### 2. إضافة البيانات إلى ملف البيئة

أضف هذه القيم إلى ملف `.env.local`:

```bash
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### 3. إعادة تشغيل الخادم

```bash
# أوقف الخادم بـ Ctrl+C ثم
npm run dev
```

## نصائح مهمة

1. **تأكد من نسخ API Secret بالكامل** - قد يكون طويلاً
2. **لا تضع مسافات** قبل أو بعد القيم
3. **لا تستخدم علامات اقتباس مزدوجة** إذا كانت القيمة تحتوي على رموز خاصة

## البديل المؤقت

إذا لم تتمكن من إعداد Cloudinary الآن، سيستخدم النظام صور placeholder تلقائياً.

## التحقق من الإعداد

بعد إضافة البيانات وإعادة التشغيل، يجب أن ترى في السجلات:

```
🔧 إعدادات Cloudinary: {
  cloud_name: 'your-cloud-name',
  api_key: 'your-api-key',
  api_secret: 'your-api-s...'
}
```

بدون رسائل تحذير. 