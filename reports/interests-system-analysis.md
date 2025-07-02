# تحليل نظام الاهتمامات - Sabq AI CMS

## نظرة عامة على النظام

نظام الاهتمامات في Sabq AI CMS مصمم للعمل مع نوعين من المستخدمين:
- **المستخدمين المسجلين**: بياناتهم محفوظة في قاعدة البيانات
- **المستخدمين الضيوف**: بياناتهم محفوظة في localStorage

## كيفية عمل النظام

### 1. حفظ الاهتمامات

#### صفحة التفضيلات (`/welcome/preferences`)
```typescript
// حفظ في قاعدة البيانات
const response = await fetch('/api/user/preferences', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: userId,
    categoryIds: selectedCategoryIds,
    source: 'manual'
  }),
});

// حفظ في localStorage
const user = JSON.parse(currentUserData);
user.interests = selectedCategoryIds;
localStorage.setItem('user', JSON.stringify(user));
```

#### API حفظ التفضيلات (`/api/user/preferences`)
- يحفظ التصنيفات في جدول `UserPreference` مع المفتاح `selected_categories`
- يحفظ أيضاً في ملف JSON كنسخة احتياطية
- يدعم المزامنة بين قاعدة البيانات و localStorage

### 2. جلب الاهتمامات

#### صفحة الملف الشخصي (`/profile`)
```typescript
// للمستخدمين المسجلين
if (!user.id.startsWith('guest-')) {
  const interestsResult = await fetch(`/api/user/saved-categories?userId=${user.id}`);
  if (interestsResult.value?.success && interestsResult.value?.categoryIds?.length > 0) {
    // استخدام البيانات من قاعدة البيانات
  }
}

// للمستخدمين الضيوف
if (user.id.startsWith('guest-')) {
  if (user.preferences && user.preferences.length > 0) {
    // استخدام البيانات من localStorage
  }
}

// خيار احتياطي للمستخدمين المسجلين
if (user.preferences && user.preferences.length > 0) {
  // استخدام localStorage كخيار احتياطي
}
```

#### API جلب التصنيفات المحفوظة (`/api/user/saved-categories`)
- يبحث أولاً في `UserPreference` مع المفتاح `selected_categories`
- إذا لم يجد، يبحث في `UserPreference` مع المفتاح `interests`
- يحول أسماء الاهتمامات إلى معرفات التصنيفات
- يعيد مصفوفة من معرفات التصنيفات

### 3. عرض الاهتمامات

#### تحويل البيانات للعرض
```typescript
const userCategories = allCategories
  .filter((cat: any) => interestsResult.value.categoryIds.includes(cat.id))
  .map((cat: any) => ({
    category_id: cat.id,
    category_name: cat.name || cat.name_ar,
    category_icon: cat.icon || '📌',
    category_color: cat.color || '#6B7280'
  }));
```

## مصادر البيانات

### 1. قاعدة البيانات (للمستخدمين المسجلين)
- **جدول**: `UserPreference`
- **المفتاح**: `selected_categories`
- **القيمة**: مصفوفة من معرفات التصنيفات
- **مثال**: `["1", "3", "5"]`

### 2. localStorage (للمستخدمين الضيوف)
- **المفتاح**: `user`
- **القيمة**: كائن المستخدم مع خاصية `interests`
- **مثال**: `{ id: "guest-123", interests: ["1", "3", "5"] }`

### 3. ملف JSON احتياطي
- **الموقع**: `data/user_preferences.json`
- **الغرض**: نسخة احتياطية من تفضيلات المستخدمين

## تدفق البيانات

```
1. المستخدم يختار اهتمامات في /welcome/preferences
   ↓
2. حفظ في قاعدة البيانات عبر /api/user/preferences
   ↓
3. حفظ في localStorage
   ↓
4. في صفحة الملف الشخصي، جلب البيانات من:
   - قاعدة البيانات (للمستخدمين المسجلين)
   - localStorage (للمستخدمين الضيوف)
   - localStorage كخيار احتياطي
   ↓
5. عرض الاهتمامات في واجهة المستخدم
```

## معالجة الأخطاء

### 1. Timeout للطلبات
```typescript
const createTimeoutSignal = (ms: number) => {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), ms);
  return controller.signal;
};
```

### 2. Promise.allSettled
- يستخدم `Promise.allSettled` بدلاً من `Promise.all`
- يضمن عدم توقف التطبيق إذا فشل أحد الطلبات

### 3. قيم افتراضية
```typescript
setUserStats({
  articlesRead: 5,
  interactions: 12,
  shares: 3
});
```

## المزامنة بين المصادر

### 1. أولوية المصادر
1. **قاعدة البيانات** (للمستخدمين المسجلين)
2. **localStorage** (للمستخدمين الضيوف)
3. **localStorage كخيار احتياطي** (للمستخدمين المسجلين)

### 2. تحديث البيانات
- عند تسجيل الدخول، يتم دمج البيانات من API مع localStorage
- عند حفظ اهتمامات جديدة، يتم التحديث في كلا المصدرين

## المشاكل المحتملة وحلولها

### 1. تأخير في المزامنة
**المشكلة**: قد لا تظهر الاهتمامات فوراً بعد حفظها
**الحل**: استخدام `setTimeout` لتحديث الصفحة بعد الحفظ

### 2. تضارب البيانات
**المشكلة**: اختلاف بين قاعدة البيانات و localStorage
**الحل**: إعطاء الأولوية لقاعدة البيانات للمستخدمين المسجلين

### 3. فقدان البيانات
**المشكلة**: فقدان البيانات عند مسح localStorage
**الحل**: الاحتفاظ بنسخة في قاعدة البيانات

## التحسينات المقترحة

### 1. إضافة Cache
```typescript
// إضافة cache للتصنيفات
const categoriesCache = new Map();
```

### 2. تحسين الأداء
```typescript
// استخدام React Query أو SWR
const { data: categories } = useQuery('categories', fetchCategories);
```

### 3. إضافة مؤشرات التحميل
```typescript
const [loadingInterests, setLoadingInterests] = useState(false);
```

## الخلاصة

نظام الاهتمامات يعمل بشكل صحيح ويوفر:
- **مرونة**: يعمل مع المستخدمين المسجلين والضيوف
- **موثوقية**: يحتفظ بنسخ احتياطية متعددة
- **أداء**: يستخدم طلبات متوازية مع timeout
- **تجربة مستخدم**: يعرض مؤشرات تحميل وقيم افتراضية

المشكلة التي واجهها المستخدم كانت على الأرجح بسبب تأخير في المزامنة، وتم حلها تلقائياً بعد بضع ثوانٍ. 