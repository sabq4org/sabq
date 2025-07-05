# دليل حماية قاعدة البيانات من الحذف العرضي
📅 التاريخ: 29 يناير 2025

## 🚨 **الأوامر الخطيرة (ممنوعة):**

### ❌ **ممنوع تماماً:**
```bash
# يحذف جميع البيانات نهائياً
npx prisma db push --force-reset

# يحذف جميع الجداول
npx prisma migrate reset

# يحذف قاعدة البيانات بالكامل
npx prisma db push --force-reset --accept-data-loss
```

## ✅ **الأوامر الآمنة:**

### 🔄 **للتحديثات:**
```bash
# تحديث المخطط فقط (آمن)
npx prisma db push

# تطبيق الترحيلات الجديدة (آمن)
npx prisma migrate deploy

# مزامنة المخطط مع قاعدة البيانات (آمن)
npx prisma db pull
```

### 📊 **للنسخ الاحتياطية:**
```bash
# إنشاء نسخة احتياطية
npx prisma db pull --print > schema_backup_$(date +%Y%m%d_%H%M%S).prisma

# تصدير البيانات
npx prisma db seed --preview-feature
```

## 🛡️ **إجراءات الحماية:**

### 1. **قبل أي عملية:**
```bash
# 1. إنشاء نسخة احتياطية
mysqldump -h aws.connect.psdb.cloud -u USERNAME -p DATABASE_NAME > backup_$(date +%Y%m%d_%H%M%S).sql

# 2. التحقق من البيانات
npx prisma studio

# 3. اختبار على بيئة تطوير
# تأكد من أن DATABASE_URL يشير إلى قاعدة بيانات اختبار
```

### 2. **إعدادات PlanetScale:**
- ✅ **تفعيل النسخ الاحتياطية التلقائية**
- ✅ **تفعيل استعادة النقاط الزمنية**
- ✅ **تفعيل حماية من الحذف**
- ✅ **إعداد تنبيهات للحذف**

### 3. **إجراءات الفريق:**
- ✅ **مراجعة مزدوجة** قبل أي أمر خطير
- ✅ **اختبار على بيئة تطوير** أولاً
- ✅ **توثيق جميع العمليات**
- ✅ **تدريب الفريق** على الأوامر الآمنة

## 🔧 **إعدادات البيئة:**

### `.env` **للبيئات المختلفة:**
```bash
# التطوير (آمن)
DATABASE_URL="mysql://dev_user:dev_pass@localhost/dev_db"

# الاختبار (آمن)
DATABASE_URL="mysql://test_user:test_pass@localhost/test_db"

# الإنتاج (محمي)
DATABASE_URL="mysql://prod_user:prod_pass@aws.connect.psdb.cloud/prod_db"
```

### **سكريبت الحماية:**
```bash
#!/bin/bash
# scripts/safe-db-operations.sh

echo "⚠️  تحذير: هل أنت متأكد من أنك في البيئة الصحيحة؟"
echo "قاعدة البيانات الحالية: $DATABASE_URL"
read -p "اكتب 'YES' للتأكيد: " confirm

if [ "$confirm" != "YES" ]; then
    echo "❌ تم إلغاء العملية"
    exit 1
fi

echo "✅ بدء العملية الآمنة..."
```

## 📋 **قائمة مراجعة قبل أي عملية:**

- [ ] إنشاء نسخة احتياطية
- [ ] التحقق من البيئة (dev/test/prod)
- [ ] اختبار على بيئة تطوير
- [ ] مراجعة مزدوجة من عضو آخر في الفريق
- [ ] توثيق العملية
- [ ] إعداد خطة استعادة في حالة الطوارئ

## 🚨 **في حالة الطوارئ:**

### **إذا تم حذف البيانات:**
1. **لا تفعل أي شيء آخر** - توقف فوراً
2. **تحقق من النسخ الاحتياطية** في PlanetScale
3. **استخدم استعادة النقاط الزمنية** إذا كانت متاحة
4. **راجع سجلات العمليات** لتحديد ما حدث
5. **تواصل مع الدعم الفني** إذا لزم الأمر

### **أرقام الطوارئ:**
- **PlanetScale Support**: support@planetscale.com
- **فريق التطوير**: [أرقام الفريق]
- **مدير النظام**: [رقم المدير]

## 📚 **موارد إضافية:**

- [Prisma Database Safety](https://www.prisma.io/docs/guides/database/database-safety)
- [PlanetScale Backup & Restore](https://planetscale.com/docs/concepts/backup-and-restore)
- [MySQL Safety Best Practices](https://dev.mysql.com/doc/refman/8.0/en/backup-methods.html)

---

**تذكر: الوقاية خير من العلاج! 🛡️** 