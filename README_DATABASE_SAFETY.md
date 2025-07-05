# 🛡️ دليل حماية قاعدة البيانات - SABQ AI CMS

## ⚠️ **تحذير مهم:**
**قاعدة البيانات تحتوي على بيانات حقيقية للإنتاج. أي خطأ قد يؤدي إلى فقدان البيانات نهائياً!**

## 🚨 **الأوامر المحظورة (ممنوعة تماماً):**

```bash
# ❌ ممنوع - يحذف جميع البيانات
npx prisma db push --force-reset

# ❌ ممنوع - يحذف جميع الجداول
npx prisma migrate reset

# ❌ ممنوع - يحذف قاعدة البيانات
npx prisma db push --force-reset --accept-data-loss
```

## ✅ **الأوامر الآمنة:**

```bash
# ✅ آمن - تحديث المخطط فقط
npx prisma db push

# ✅ آمن - تطبيق الترحيلات الجديدة
npx prisma migrate deploy

# ✅ آمن - مزامنة المخطط
npx prisma db pull

# ✅ آمن - إنشاء نسخة احتياطية
./scripts/safe-db-operations.sh backup
```

## 🛡️ **استخدام سكريبت الحماية:**

### **بدلاً من الأوامر المباشرة، استخدم:**
```bash
# للتحديثات الآمنة
./scripts/safe-db-operations.sh push

# للنسخ الاحتياطية
./scripts/safe-db-operations.sh backup

# للعمليات الخطيرة (يتطلب تأكيدات متعددة)
./scripts/safe-db-operations.sh push-force-reset
```

## 📋 **قائمة مراجعة قبل أي عملية:**

- [ ] **هل أنت في البيئة الصحيحة؟** (dev/test/prod)
- [ ] **هل أنشأت نسخة احتياطية؟**
- [ ] **هل اختبرت على بيئة تطوير أولاً؟**
- [ ] **هل راجع عضو آخر في الفريق؟**
- [ ] **هل وثقت العملية؟**

## 🔧 **إعدادات البيئة:**

### **ملف `.env`:**
```bash
# تأكد من أن هذا يشير إلى البيئة الصحيحة
DATABASE_URL="mysql://USERNAME:PASSWORD@aws.connect.psdb.cloud/DATABASE_NAME?sslaccept=strict"

# متغيرات Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

## 📊 **إحصائيات قاعدة البيانات الحالية:**

- **التصنيفات:** 8 تصنيفات
- **المستخدمين:** 8 مستخدمين
- **المقالات:** 10 مقالات
- **النظام:** PlanetScale + Cloudinary

## 🚨 **في حالة الطوارئ:**

### **إذا تم حذف البيانات:**
1. **توقف فوراً** - لا تفعل أي شيء آخر
2. **تحقق من النسخ الاحتياطية** في PlanetScale
3. **استخدم استعادة النقاط الزمنية** إذا كانت متاحة
4. **تواصل مع الدعم الفني**

### **أرقام الطوارئ:**
- **PlanetScale Support:** support@planetscale.com
- **فريق التطوير:** [أرقام الفريق]
- **مدير النظام:** [رقم المدير]

## 📚 **الموارد:**

- [دليل الحماية الكامل](docs/DATABASE_SAFETY_GUIDE.md)
- [إعدادات PlanetScale](https://planetscale.com/docs)
- [أفضل ممارسات Prisma](https://www.prisma.io/docs/guides/database/database-safety)

## 🔐 **نصائح أمنية:**

1. **لا تشارك DATABASE_URL** مع أي شخص
2. **استخدم سكريبت الحماية** دائماً
3. **أنشئ نسخ احتياطية** قبل أي عملية
4. **اختبر على بيئة تطوير** أولاً
5. **وثق جميع العمليات**

---

**تذكر: الوقاية خير من العلاج! 🛡️**

**آخر تحديث:** 29 يناير 2025 