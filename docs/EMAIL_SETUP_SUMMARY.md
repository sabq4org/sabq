# 📧 ملخص إعداد البريد الإلكتروني مع Gmail لموقع سبق

## ✅ الإعدادات المكتملة

### 1. تحديث إعدادات البريد الإلكتروني
- ✅ تم تحديث `config/email.config.ts` لإعدادات Gmail
- ✅ تم تحديث `lib/services/emailService.ts` للتوافق مع Gmail
- ✅ تم إضافة دالة `sendPasswordResetEmail` لإعادة تعيين كلمة المرور

### 2. السكريبتات المساعدة
- ✅ `scripts/setup-gmail-email.sh` - سكريبت الإعداد التلقائي
- ✅ `scripts/test-gmail-email.js` - سكريبت اختبار البريد
- ✅ `env.gmail.example` - ملف مثال للإعدادات

### 3. الدليل الشامل
- ✅ `docs/GMAIL_EMAIL_SETUP_GUIDE.md` - دليل مفصل للإعداد

## 🔧 إعدادات الخادم

### البريد الصادر (SMTP)
```
الخادم: smtp.gmail.com
المنفذ: 465 (مع SSL) أو 587 (مع TLS)
الأمان: SSL/TLS
المصادقة: مطلوبة
البريد: sabqai@sabq.ai
كلمة المرور: MNVTLUh<L<%n3nP&
```

### البريد الوارد (IMAP)
```
الخادم: imap.gmail.com
المنفذ: 993
الأمان: SSL/TLS
المصادقة: مطلوبة
```

## 🚀 خطوات التفعيل

### الطريقة الأولى: الإعداد التلقائي
```bash
# تشغيل سكريبت الإعداد
bash scripts/setup-gmail-email.sh
```

### الطريقة الثانية: الإعداد اليدوي
```bash
# 1. نسخ ملف الإعدادات
cp env.gmail.example .env.local

# 2. تحديث القيم في .env.local
# 3. اختبار الإعدادات
node scripts/test-gmail-email.js
```

## 📧 أنواع الرسائل المدعومة

### 1. رسائل التحقق من التسجيل
```typescript
import { sendVerificationEmail } from '@/lib/services/emailService';

await sendVerificationEmail(
  'user@example.com',
  'اسم المستخدم',
  'verification-token'
);
```

### 2. رسائل إعادة تعيين كلمة المرور
```typescript
import { sendPasswordResetEmail } from '@/lib/services/emailService';

await sendPasswordResetEmail(
  'user@example.com',
  'اسم المستخدم',
  'reset-token'
);
```

### 3. رسائل الترحيب
```typescript
import { sendWelcomeEmail } from '@/lib/services/emailService';

await sendWelcomeEmail(
  'user@example.com',
  'اسم المستخدم'
);
```

## 🔍 اختبار الإعدادات

### اختبار الاتصال
```bash
# اختبار SMTP
openssl s_client -connect smtp.gmail.com:465 -crlf

# اختبار IMAP
openssl s_client -connect imap.gmail.com:993 -crlf
```

### اختبار الإرسال
```bash
# تشغيل سكريبت الاختبار
node scripts/test-gmail-email.js
```

## 🛠️ حل المشاكل الشائعة

### مشكلة: "Invalid login"
**الحل:**
1. تأكد من تفعيل المصادقة الثنائية في Gmail
2. استخدم كلمة مرور التطبيق (App Password)
3. تأكد من صحة البريد الإلكتروني

### مشكلة: "Connection timeout"
**الحل:**
1. تأكد من صحة اسم الخادم والمنفذ
2. تحقق من إعدادات الجدار الناري
3. جرب المنفذ البديل (587 بدلاً من 465)

### مشكلة: "SSL certificate error"
**الحل:**
1. تأكد من استخدام SSL/TLS
2. تحقق من إعدادات التاريخ والوقت
3. جرب إضافة `rejectUnauthorized: false` مؤقتاً للاختبار

## 📊 مراقبة الأداء

### سجلات البريد الإلكتروني
```bash
# مراقبة سجلات البريد
tail -f logs/email.log
```

### إحصائيات الإرسال
- عدد الرسائل المرسلة يومياً
- معدل النجاح
- وقت الاستجابة
- الأخطاء الشائعة

## 🔒 الأمان

### أفضل الممارسات
1. ✅ استخدم كلمة مرور التطبيق دائماً
2. ✅ لا تشارك كلمات المرور في الكود
3. ✅ استخدم متغيرات البيئة
4. ✅ شغل التشفير (SSL/TLS)
5. ✅ راجع سجلات الوصول بانتظام

### إعدادات الأمان الإضافية
```env
# إعدادات أمان إضافية
EMAIL_DEBUG=false
NODE_ENV=production
SMTP_TLS=true
SMTP_REJECT_UNAUTHORIZED=true
```

## 📞 الدعم

### في حالة المشاكل
1. راجع سجلات الخطأ
2. اختبر الاتصال يدوياً
3. تحقق من إعدادات Gmail
4. راجع دليل حل المشاكل

### روابط مفيدة
- [إعدادات Gmail](https://myaccount.google.com/security)
- [كلمات مرور التطبيقات](https://myaccount.google.com/apppasswords)
- [دليل SMTP](https://support.google.com/mail/answer/7126229)
- [دليل IMAP](https://support.google.com/mail/answer/7126229)

## ✅ التحقق النهائي

بعد الإعداد، تأكد من:
- [ ] تم تفعيل المصادقة الثنائية
- [ ] تم إنشاء كلمة مرور التطبيق
- [ ] تم تحديث ملف `.env.local`
- [ ] نجح اختبار الاتصال
- [ ] نجح اختبار الإرسال
- [ ] تعمل رسائل التحقق
- [ ] تعمل رسائل إعادة تعيين كلمة المرور

## 🎯 الميزات المضافة

### 1. دعم Gmail الكامل
- ✅ إعدادات SMTP لـ Gmail
- ✅ إعدادات IMAP لـ Gmail
- ✅ دعم SSL/TLS
- ✅ دعم كلمة مرور التطبيق

### 2. قوالب البريد المحسنة
- ✅ تصميم متجاوب
- ✅ دعم اللغة العربية
- ✅ روابط تفاعلية
- ✅ تتبع النقرات

### 3. نظام إدارة الأخطاء
- ✅ رسائل خطأ واضحة
- ✅ حلول مقترحة
- ✅ سجلات مفصلة
- ✅ إعادة المحاولة التلقائية

### 4. أدوات الاختبار
- ✅ سكريبت اختبار الاتصال
- ✅ سكريبت اختبار الإرسال
- ✅ سكريبت الإعداد التلقائي
- ✅ دليل مفصل

---

**ملاحظة:** هذا الملخص يغطي جميع جوانب إعداد البريد الإلكتروني مع Gmail لموقع سبق. تأكد من اتباع جميع الخطوات بدقة لضمان عمل النظام بشكل صحيح. 