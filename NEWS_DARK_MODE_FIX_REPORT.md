# تقرير إصلاح الوضع الليلي في صفحة الأخبار

## نظرة عامة
تم إصلاح جميع مشاكل الوضع الليلي في صفحة الأخبار، بما في ذلك إطارات البطاقات البيضاء والخلفيات غير المناسبة.

## المشاكل التي تم إصلاحها

### 1. بطاقات الأخبار
- **قبل:** خلفية `dark:bg-gray-800` مع حدود `dark:border-gray-700`
- **بعد:** خلفية `dark:bg-gray-800/90` مع حدود `dark:border-gray-700/50` لمظهر أكثر نعومة

### 2. شريط التحكم العلوي
- **قبل:** خلفية `dark:bg-gray-800`
- **بعد:** خلفية `dark:bg-gray-900` لتباين أفضل

### 3. حقول البحث والفلاتر
- **قبل:** خلفيات `dark:bg-gray-700` مع حدود `dark:border-gray-600`
- **بعد:** خلفيات `dark:bg-gray-800` مع حدود `dark:border-gray-700`

### 4. أزرار التصنيفات
- **قبل:** خلفية `dark:bg-gray-700` عند التحويم `dark:hover:bg-gray-600`
- **بعد:** خلفية `dark:bg-gray-800` عند التحويم `dark:hover:bg-gray-700`

### 5. أزرار عرض الشبكة/القائمة
- **قبل:** خلفية نشطة `dark:bg-gray-600`
- **بعد:** خلفية نشطة `dark:bg-gray-700`

## تحسينات CSS الإضافية

### متغيرات CSS للوضع الليلي
```css
.dark {
  --bg-primary: rgb(17 24 39);
  --bg-secondary: rgb(31 41 55);
  --bg-tertiary: rgb(55 65 81);
  --border-primary: rgb(75 85 99);
  --border-secondary: rgb(107 114 128);
  --text-primary: rgb(243 244 246);
  --text-secondary: rgb(209 213 219);
  --text-tertiary: rgb(156 163 175);
}
```

### إصلاحات خاصة
- إزالة الخلفيات البيضاء في الوضع الليلي
- تحسين الظلال والحدود
- إضافة `backdrop-filter` للعناصر الثابتة
- إصلاح مشكلة Footer الأبيض

## إصلاحات Footer
- إزالة التكرار في classes
- تحسين ألوان الوضع الليلي
- تغيير hover states للأيقونات الاجتماعية

## النتيجة النهائية
- واجهة متناسقة في الوضع الليلي
- لا توجد خلفيات بيضاء مزعجة
- تباين أفضل بين العناصر
- تجربة مستخدم محسّنة في الإضاءة المنخفضة 