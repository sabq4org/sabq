# خطوات نشر التحديثات على DigitalOcean

## 1. تحديث متغيرات البيئة في DigitalOcean App Platform:

### أ. اذهب إلى لوحة تحكم DigitalOcean
### ب. افتح تطبيقك
### ج. اذهب إلى Settings > Environment Variables
### د. حدث `DATABASE_URL` إلى:
```
postgresql://doadmin:[YOUR_PASSWORD]@private-db-sabq-ai-1755-do-user-23559731-0.m.db.ondigitalocean.com:25060/defaultdb?sslmode=require
```
**ملاحظة**: استخدم `private-` للاتصال الداخلي الأسرع

## 2. إضافة App Platform في Trusted Sources:
### أ. اذهب إلى قاعدة البيانات في DigitalOcean
### ب. Settings > Trusted Sources
### ج. أضف تطبيقك من القائمة

## 3. نشر التحديثات:
```bash
git add .
git commit -m "الترحيل إلى PostgreSQL على DigitalOcean"
git push origin main
```

## 4. التحقق من النشر:
- تحقق من logs في App Platform
- تأكد من أن التطبيق يعمل بشكل صحيح
- اختبر الوظائف الأساسية

## 🎉 مبروك! 
تم الترحيل بنجاح من PlanetScale MySQL إلى DigitalOcean PostgreSQL

### الفوائد:
- ✅ أداء أفضل (نفس مركز البيانات)
- ✅ تكلفة أقل ($15 بدلاً من $29)
- ✅ إدارة أسهل (كل شيء في مكان واحد)
- ✅ PostgreSQL أقوى وأكثر مرونة 