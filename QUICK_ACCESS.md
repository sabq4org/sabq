# 🚀 دليل الوصول السريع - مشروع سبق

## تشغيل المشروع
```bash
./run-sabq.sh
```

## الروابط الأساسية
- **الموقع**: http://localhost:3000
- **لوحة التحكم**: http://localhost:3000/dashboard
- **API Health**: http://localhost:3000/api/health

## حسابات الدخول
| النوع | البريد | كلمة المرور |
|-------|--------|--------------|
| مدير | admin@sabq.ai | Test@123456 |
| محرر | editor@sabq.ai | Test@123456 |
| مستخدم | user@sabq.ai | Test@123456 |

## أوامر مفيدة
```bash
# إيقاف المشروع
pkill -f "next dev"

# عرض السجلات
tail -f dev.log

# فتح قاعدة البيانات
npx prisma studio
```

## حالة المشروع الحالية
✅ الخادم يعمل على المنفذ 3000
✅ قاعدة البيانات البعيدة متصلة (MySQL/PlanetScale)
✅ جميع الخدمات تعمل بشكل طبيعي 