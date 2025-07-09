# دليل إعداد البريد الإلكتروني مع Gmail لموقع سبق

## 📋 المتطلبات المسبقة

### 1. حساب Gmail
- بريد إلكتروني: `sabqai@sabq.ai`
- كلمة المرور: `MNVTLUh<L<%n3nP&`

### 2. تفعيل المصادقة الثنائية
1. اذهب إلى [حسابي Google](https://myaccount.google.com)
2. الأمان > المصادقة الثنائية > تفعيل
3. اتبع الخطوات لتفعيل المصادقة

### 3. إنشاء كلمة مرور التطبيق
1. اذهب إلى [كلمات مرور التطبيقات](https://myaccount.google.com/apppasswords)
2. اختر "تطبيق آخر (اسم مخصص)"
3. اكتب اسم التطبيق: "سبق CMS"
4. انقر على "إنشاء"
5. احفظ كلمة المرور المكونة من 16 حرف

## 🔧 إعدادات الخادم

### البريد الصادر (SMTP)
- **الخادم**: `smtp.gmail.com`
- **المنفذ**: `465` (مع SSL) أو `587` (مع TLS)
- **الأمان**: SSL/TLS
- **المصادقة**: مطلوبة

### البريد الوارد (IMAP)
- **الخادم**: `imap.gmail.com`
- **المنفذ**: `993`
- **الأمان**: SSL/TLS
- **المصادقة**: مطلوبة

### البريد الوارد (POP3)
- **الخادم**: `pop.gmail.com`
- **المنفذ**: `995`
- **الأمان**: SSL/TLS
- **المصادقة**: مطلوبة

## 🚀 خطوات الإعداد

### الطريقة الأولى: استخدام السكريبت التلقائي

```bash
# تشغيل سكريبت الإعداد
bash scripts/setup-gmail-email.sh
```

### الطريقة الثانية: الإعداد اليدوي

#### 1. إنشاء ملف `.env.local`

```env
# Gmail Email Settings
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=sabqai@sabq.ai
SMTP_PASS=[كلمة مرور التطبيق - 16 حرف]
SMTP_SECURE=true
EMAIL_FROM_NAME=صحيفة سبق
EMAIL_FROM_ADDRESS=sabqai@sabq.ai
ENABLE_EMAIL_VERIFICATION=true
SKIP_EMAIL_VERIFICATION=false

# IMAP Settings (for incoming mail)
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
IMAP_USER=sabqai@sabq.ai
IMAP_PASS=[كلمة مرور التطبيق - 16 حرف]
IMAP_SECURE=true
```

#### 2. تثبيت المكتبات المطلوبة

```bash
npm install nodemailer
npm install --save-dev @types/nodemailer
```

#### 3. اختبار الإعدادات

```bash
# اختبار الاتصال والإرسال
node scripts/test-gmail-email.js
```

## 📧 أنواع الرسائل المدعومة

### 1. رسائل التحقق من التسجيل
```typescript
// إرسال رمز التحقق
await emailService.sendVerificationEmail(
  'user@example.com',
  'اسم المستخدم',
  '123456'
);
```

### 2. رسائل إعادة تعيين كلمة المرور
```typescript
// إرسال رابط إعادة تعيين كلمة المرور
await emailService.sendPasswordResetEmail(
  'user@example.com',
  'اسم المستخدم',
  'https://sabq.ai/reset-password?token=abc123'
);
```

### 3. رسائل الترحيب
```typescript
// إرسال بريد ترحيب
await emailService.sendWelcomeEmail(
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
1. تأكد من تفعيل المصادقة الثنائية
2. استخدم كلمة مرور التطبيق وليس كلمة المرور العادية
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
1. استخدم كلمة مرور التطبيق دائماً
2. لا تشارك كلمات المرور في الكود
3. استخدم متغيرات البيئة
4. شغل التشفير (SSL/TLS)
5. راجع سجلات الوصول بانتظام

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

---

**ملاحظة:** هذا الدليل مخصص لإعداد البريد الإلكتروني مع Gmail لموقع سبق. تأكد من تحديث المعلومات حسب إعداداتك الفعلية. 