# دليل حماية قاعدة البيانات

## نظرة عامة

تم تطبيق نظام حماية متعدد الطبقات لمنع حذف البيانات من قاعدة البيانات بشكل غير مقصود أو متعمد.

## 🔒 طبقات الحماية المطبقة

### 1. حماية على مستوى Prisma Schema
- جميع العلاقات تستخدم `onDelete: NoAction` لمنع الحذف المتسلسل
- هذا يضمن عدم حذف السجلات المرتبطة تلقائياً

### 2. حماية على مستوى Prisma Client
- تم إضافة middleware يعترض جميع عمليات الحذف
- الجداول المحمية بالكامل:
  - `users` - المستخدمون
  - `articles` - المقالات
  - `categories` - التصنيفات
  - `comments` - التعليقات
  - `loyalty_points` - نقاط الولاء
  - `activity_logs` - سجلات النشاط

### 3. حماية على مستوى API Routes
- Middleware يفحص جميع طلبات DELETE
- يرفض الطلبات على الجداول المحمية مع رسالة خطأ واضحة

### 4. حماية على مستوى قاعدة البيانات
```sql
-- إنشاء مستخدم للقراءة فقط
CREATE USER 'readonly_user'@'%' IDENTIFIED BY 'strong_password';
GRANT SELECT ON j3uar_sabq_ai.* TO 'readonly_user'@'%';

-- إزالة صلاحيات DELETE من المستخدم الحالي (اختياري)
REVOKE DELETE ON j3uar_sabq_ai.* FROM 'current_user'@'%';
```

## 🚀 تفعيل الحماية

### 1. إضافة متغيرات البيئة
```env
# في ملف .env.local أو .env
ENABLE_DB_PROTECTION=true

# للنسخ الاحتياطي
BACKUP_SCHEDULE="0 2 * * *"  # يومياً في الساعة 2 صباحاً
BACKUP_RETENTION_DAYS=7
```

### 2. تشغيل النسخ الاحتياطي اليدوي
```bash
# نسخة احتياطية كاملة
npm run backup:full

# نسخة احتياطية للجداول المهمة فقط
npm run backup:critical

# تنظيف النسخ القديمة
npm run backup:clean
```

### 3. إضافة أوامر package.json
```json
{
  "scripts": {
    "backup:full": "ts-node scripts/backup-database.ts",
    "backup:critical": "ts-node -e \"require('./scripts/backup-database').backupCriticalTables()\"",
    "backup:clean": "ts-node -e \"require('./scripts/backup-database').cleanOldBackups()\""
  }
}
```

## 📊 مراقبة محاولات الحذف

جميع محاولات الحذف يتم تسجيلها في:
1. Console logs مع timestamp
2. جدول `activity_logs` (إذا كان متاحاً)
3. يمكن إضافة تنبيهات عبر البريد أو Slack

## 🔧 استثناءات الحماية

### الجداول المسموح بالحذف منها (بشروط):
- `interactions` - التفاعلات القديمة
- `analytics_data` - البيانات التحليلية القديمة  
- `email_logs` - سجلات البريد القديمة

### إضافة استثناء جديد:
```typescript
// في lib/database-protection.ts
const PARTIALLY_PROTECTED_TABLES = [
  'table_name', // إضافة الجدول هنا
];
```

## 🚨 في حالة الطوارئ

### إيقاف الحماية مؤقتاً:
```env
ENABLE_DB_PROTECTION=false
```

### استعادة من نسخة احتياطية:
```bash
# فك ضغط النسخة
gunzip backups/backup_j3uar_sabq_ai_2024-01-15.sql.gz

# استعادة قاعدة البيانات
mysql -h host -u user -p database < backups/backup_j3uar_sabq_ai_2024-01-15.sql
```

## 📝 أفضل الممارسات

1. **استخدم Soft Delete**: بدلاً من حذف السجلات، أضف حقل `deletedAt`
2. **أرشف البيانات القديمة**: انقل البيانات القديمة لجداول أرشيف
3. **راجع السجلات دورياً**: تحقق من `activity_logs` لأي محاولات مشبوهة
4. **اختبر النسخ الاحتياطية**: تأكد من إمكانية استعادة البيانات
5. **وثّق أي تغييرات**: سجل أي تعديلات على نظام الحماية

## 🔐 نصائح أمنية إضافية

1. **تشفير النسخ الاحتياطية**:
```bash
# تشفير النسخة
openssl enc -aes-256-cbc -salt -in backup.sql -out backup.sql.enc

# فك التشفير
openssl enc -d -aes-256-cbc -in backup.sql.enc -out backup.sql
```

2. **تخزين النسخ خارجياً**: استخدم S3 أو Google Cloud Storage

3. **مراجعة الصلاحيات**: تحقق دورياً من صلاحيات المستخدمين

4. **تفعيل Binary Logging**: لتتبع جميع التغييرات في MySQL

## 📞 الدعم

في حالة وجود أي مشاكل أو استفسارات:
1. راجع سجلات النظام
2. تحقق من رسائل الخطأ في Console
3. تواصل مع فريق الدعم الفني 