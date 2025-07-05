# إعداد البريد الإلكتروني مع Microsoft 365

## 📋 المتطلبات:
1. حساب Microsoft 365 للأعمال
2. بريد إلكتروني مخصص (مثل: noreply@sabq.org)
3. كلمة مرور التطبيق (App Password)

## 🔧 الخطوة 1: إنشاء كلمة مرور التطبيق

### أ. تفعيل المصادقة الثنائية:
1. اذهب إلى [حسابي Microsoft](https://account.microsoft.com)
2. الأمان > المصادقة الثنائية > تفعيل

### ب. إنشاء كلمة مرور التطبيق:
1. اذهب إلى [إعدادات الأمان](https://account.microsoft.com/security)
2. "خيارات أمان إضافية"
3. "كلمات مرور التطبيقات"
4. أنشئ كلمة مرور جديدة
5. احفظ كلمة المرور (16 حرف)

## 📝 الخطوة 2: إعدادات SMTP لـ Microsoft 365

```env
# إعدادات البريد الإلكتروني - Microsoft 365
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=noreply@sabq.org
SMTP_PASS=[كلمة مرور التطبيق - 16 حرف]
SMTP_SECURE=false
SMTP_TLS=true

# معلومات المرسل
EMAIL_FROM_NAME=صحيفة سبق
EMAIL_FROM_ADDRESS=noreply@sabq.org

# تفعيل التحقق من البريد
ENABLE_EMAIL_VERIFICATION=true
SKIP_EMAIL_VERIFICATION=false
```

## 🛠️ الخطوة 3: تحديث ملف البيئة

### للتطوير المحلي (.env.local):
```env
# Microsoft 365 Email Settings
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=noreply@sabq.org
SMTP_PASS=xxxx xxxx xxxx xxxx
SMTP_SECURE=false
SMTP_TLS=true
EMAIL_FROM_NAME=صحيفة سبق
EMAIL_FROM_ADDRESS=noreply@sabq.org
ENABLE_EMAIL_VERIFICATION=true
```

### للإنتاج (DigitalOcean):
نفس الإعدادات، لكن في متغيرات البيئة في App Platform

## 🔍 الخطوة 4: اختبار الإعدادات

### سكريبت اختبار البريد:
```javascript
// scripts/test-microsoft-email.js
const nodemailer = require('nodemailer');

async function testEmail() {
  const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    auth: {
      user: 'noreply@sabq.org',
      pass: 'كلمة مرور التطبيق'
    },
    tls: {
      ciphers: 'SSLv3'
    }
  });

  try {
    await transporter.verify();
    console.log('✅ الاتصال بخادم البريد ناجح!');
    
    // إرسال بريد تجريبي
    const info = await transporter.sendMail({
      from: '"صحيفة سبق" <noreply@sabq.org>',
      to: 'test@example.com',
      subject: 'اختبار البريد الإلكتروني',
      text: 'هذا اختبار للبريد الإلكتروني من سبق',
      html: '<p>هذا اختبار للبريد الإلكتروني من <b>سبق</b></p>'
    });
    
    console.log('✅ تم إرسال البريد:', info.messageId);
  } catch (error) {
    console.error('❌ خطأ:', error);
  }
}

testEmail();
```

## 📧 أنواع الإيميلات المرسلة:

### 1. بريد التحقق من الحساب:
- يُرسل عند التسجيل
- يحتوي على رابط التحقق
- صالح لمدة 24 ساعة

### 2. بريد إعادة تعيين كلمة المرور:
- يُرسل عند طلب استعادة كلمة المرور
- يحتوي على رابط مؤقت
- صالح لمدة ساعة واحدة

### 3. بريد الترحيب:
- يُرسل بعد التحقق من الحساب
- يحتوي على معلومات عن الموقع

## ⚠️ حل المشاكل الشائعة:

### 1. خطأ "Authentication Failed":
- تأكد من استخدام كلمة مرور التطبيق وليس كلمة مرور الحساب
- تأكد من تفعيل المصادقة الثنائية

### 2. خطأ "Connection Timeout":
- تأكد من أن المنفذ 587 مفتوح
- جرب استخدام المنفذ 25 كبديل

### 3. خطأ "TLS Error":
```javascript
tls: {
  rejectUnauthorized: false,
  ciphers: 'SSLv3'
}
```

## 🔒 نصائح الأمان:

1. **لا تستخدم** كلمة مرور حسابك الرئيسي
2. **استخدم دائماً** كلمة مرور التطبيق
3. **احفظ** كلمة المرور في متغيرات البيئة
4. **لا تشارك** كلمة المرور في الكود

## 📊 مراقبة الإرسال:

### في لوحة تحكم Microsoft 365:
1. اذهب إلى [مركز الإدارة](https://admin.microsoft.com)
2. التقارير > استخدام البريد الإلكتروني
3. راقب عدد الرسائل المرسلة

### حدود الإرسال:
- 10,000 مستلم يومياً
- 30 رسالة في الدقيقة
- 500 مستلم لكل رسالة 