# 📦 دليل إدارة البلوكات الذكية

## 🎯 الوضع الحالي

### البلوكات النشطة:
1. **بانر ترحيبي** - أعلى الصفحة (تم تفعيله الآن)
2. **الهلال في بطولة العالم** - بعد بطاقات المقالات

### البلوكات غير النشطة:
- أخبار الهلال
- أخبار الرياضة
- إعلان مميز
- أخبار التقنية
- بلوك تجريبي جديد

## 🚀 كيفية إدارة البلوكات

### 1️⃣ من لوحة التحكم
```
http://localhost:3000/dashboard/smart-blocks
```

### 2️⃣ تفعيل/تعطيل البلوكات
- انقر على أيقونة الطاقة (⚡) لتغيير حالة البلوك
- الأخضر = نشط
- الرمادي = غير نشط

### 3️⃣ إنشاء بلوك جديد
1. انقر على "بلوك جديد"
2. اختر النوع:
   - **smart**: لعرض مقالات بناءً على كلمات مفتاحية
   - **html**: لمحتوى HTML مخصص
   - **custom**: لبلوكات مخصصة خاصة

### 4️⃣ المواضع المتاحة
- `topBanner` - أعلى الصفحة
- `afterHighlights` - بعد الأخبار البارزة
- `afterCards` - بعد بطاقات المقالات
- `beforePersonalization` - قبل المحتوى المخصص
- `beforeFooter` - قبل التذييل

## 💡 نصائح مهمة

1. **البلوكات الفارغة**: لن تظهر رسالة "جاري التحميل" بعد الآن
2. **ترتيب البلوكات**: استخدم قيمة "order" لترتيب البلوكات في نفس الموضع
3. **الكلمات المفتاحية**: ضرورية للبلوكات من نوع "smart" لجلب المقالات

## 🔧 حل المشاكل

### المشكلة: لا توجد بلوكات في الصفحة
**الحل**: فعّل بلوك واحد على الأقل من لوحة التحكم

### المشكلة: البلوك لا يعرض مقالات
**الحل**: تأكد من:
- وجود كلمات مفتاحية
- وجود مقالات منشورة تحتوي على هذه الكلمات

---
📅 آخر تحديث: 26 يونيو 2025 