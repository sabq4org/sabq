# 🚨 حل سريع لمشكلة "Load failed" على Vercel

## المشكلة:
رفع الصور فشل على الموقع المباشر رغم أنه يعمل في الاختبار المحلي

## الحل الفوري (خطوتين فقط):

### 1️⃣ في Vercel Dashboard:

1. اذهب إلى: https://vercel.com/dashboard
2. اختر مشروع `sabq-ai-cms`
3. **Settings** > **Environment Variables**
4. اضغط **Add New**:
   ```
   Name: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
   Value: dybhezmvb
   Environment: ✅ Production ✅ Preview ✅ Development
   ```
5. اضغط **Save**

### 2️⃣ أعد النشر:

1. في نفس الصفحة، اذهب إلى **Deployments**
2. اضغط على الثلاث نقاط (...) بجانب آخر deployment
3. اختر **Redeploy**
4. **مهم**: أزل علامة ✅ من "Use existing Build Cache"
5. اضغط **Redeploy**

## 🔍 للتأكد من نجاح الحل:

بعد اكتمال النشر (3-5 دقائق)، افتح Console (F12) في الموقع المباشر واكتب:

```javascript
// للتحقق من المتغير
console.log(typeof window !== 'undefined' && process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);
// يجب أن يظهر: dybhezmvb

// أو افتح
window.open('https://sabq-ai-cms.vercel.app/api/check-env');
```

## ✅ بعد ذلك:
- جرب رفع صورة من لوحة التحكم
- ستعمل تماماً مثل الاختبار المحلي!

## 💡 تلميح:
إذا كنت ترى هذه الصفحة في المتصفح، يمكنك نسخ القيمة مباشرة:
```
dybhezmvb
``` 