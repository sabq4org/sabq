# حل مشكلة رفع الصور على Vercel

## ✅ بما أن الرفع يعمل في صفحة الاختبار، المشكلة في Vercel فقط

### 1. أضف متغير البيئة في Vercel:

1. اذهب إلى [Vercel Dashboard](https://vercel.com/dashboard)
2. اختر مشروع `sabq-ai-cms`
3. اذهب إلى **Settings** > **Environment Variables**
4. أضف:
   ```
   Key: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
   Value: dybhezmvb
   Environment: Production, Preview, Development ✅ (اختر الثلاثة)
   ```
5. اضغط **Save**

### 2. أعد نشر المشروع:

1. في نفس الصفحة، اذهب إلى **Deployments**
2. اضغط على الثلاث نقاط (...) بجانب آخر deployment
3. اختر **Redeploy**
4. اختر **Use existing Build Cache** ❌ (لا تختره)
5. اضغط **Redeploy**

### 3. انتظر اكتمال النشر (3-5 دقائق)

### 4. اختبر الرفع على الموقع المباشر:

1. افتح: https://sabq-ai-cms.vercel.app/dashboard/categories
2. عدّل أي تصنيف
3. ارفع صورة
4. يجب أن تعمل الآن! 🎉

## 🔍 للتحقق من المتغيرات:

افتح Console (F12) في الموقع المباشر واكتب:
```javascript
console.log(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME)
```

يجب أن يظهر: `dybhezmvb`

إذا ظهر `undefined`، فالمتغير غير مُعرّف في Vercel.

## 📝 ملاحظات مهمة:

- **NEXT_PUBLIC_** ضروري في بداية اسم المتغير
- يجب إعادة النشر بعد إضافة المتغيرات
- المتغيرات تظهر فقط في البناء الجديد

## ✨ النتيجة المتوقعة:

بعد هذه الخطوات، رفع الصور سيعمل تماماً كما في صفحة الاختبار! 