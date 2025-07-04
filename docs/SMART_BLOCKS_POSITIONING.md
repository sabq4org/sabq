# نظام مواقع البلوكات الذكية

## نظرة عامة

تم تطوير نظام ديناميكي لعرض البلوكات الذكية في مواقع مختلفة من واجهة المستخدم بناءً على إعدادات لوحة التحكم.

## المواقع المتاحة

### 1. أسفل الهيدر مباشرة (`below_header`)
- **الموقع**: بين الهيدر وبلوك "الجرعات الثلاث"
- **الاستخدام المثالي**: إعلانات مهمة، أخبار عاجلة، بلوكات ترحيبية
- **مثال**: بلوك "صيف عسير" الحالي

### 2. أسفل المحتوى المخصص (`below_personalized`)
- **الموقع**: بعد بلوك "محتوى ذكي مخصص لك"
- **الاستخدام المثالي**: محتوى تكميلي، اقتراحات ذات صلة
- **مثال**: بلوكات التوصيات الذكية

### 3. تحت التحليل العميق (`below_deep_analysis`)
- **الموقع**: أسفل بلوك "التحليلات العميقة من سبق"
- **الاستخدام المثالي**: محتوى تحليلي إضافي، استطلاعات رأي
- **مثال**: بلوكات الآراء والتحليلات

### 4. أعلى الفوتر (`above_footer`)
- **الموقع**: مباشرة قبل الفوتر (خاتمة الصفحة)
- **الاستخدام المثالي**: دعوات للعمل، اشتراكات، محتوى ختامي
- **مثال**: بلوك الاشتراك في النشرة الإخبارية

## المواقع القديمة (للتوافق)

### 5. Top Banner (`topBanner`)
- **الحالة**: مدعوم للتوافق مع النظام القديم
- **الموقع**: بعد `below_header`

### 6. After Highlights (`afterHighlights`)
- **الحالة**: مدعوم للتوافق
- **الموقع**: حسب التصميم القديم

### 7. After Cards (`afterCards`)
- **الحالة**: مدعوم للتوافق
- **الموقع**: حسب التصميم القديم

### 8. Before Personalization (`beforePersonalization`)
- **الحالة**: مدعوم للتوافق
- **الموقع**: حسب التصميم القديم

### 9. Before Footer (`beforeFooter`)
- **الحالة**: مدعوم للتوافق
- **الموقع**: قبل `above_footer`

## كيفية الاستخدام

### 1. إنشاء بلوك جديد

```javascript
const newBlock = {
  name: "اسم البلوك",
  position: "below_header", // اختر الموقع المناسب
  type: "smart",
  status: "active",
  displayType: "hero-slider",
  keywords: ["كلمة1", "كلمة2"],
  articlesCount: 6,
  theme: {
    primaryColor: "#00a3d7",
    backgroundColor: "#e5effa", 
    textColor: "#1a1a1a"
  }
}
```

### 2. API Endpoints

```bash
# جلب البلوكات حسب الموقع
GET /api/smart-blocks?position=below_header&status=active

# جلب جميع البلوكات النشطة
GET /api/smart-blocks?status=active

# إنشاء بلوك جديد
POST /api/smart-blocks
```

### 3. استخدام SmartSlot في React

```jsx
import { SmartSlot } from '@/components/home/SmartSlot';

function HomePage() {
  return (
    <>
      <Header />
      
      {/* البلوكات أسفل الهيدر */}
      <SmartSlot position="below_header" />
      
      {/* المحتوى الرئيسي */}
      <MainContent />
      
      {/* البلوكات أعلى الفوتر */}
      <SmartSlot position="above_footer" />
      
      <Footer />
    </>
  );
}
```

## قواعد العرض

### 1. الشرط الأساسي
- **لا يتم عرض أي بلوك ما لم يتم تحديد موقعه**
- يجب أن يكون البلوك في حالة `active`

### 2. الترتيب
- البلوكات مرتبة حسب حقل `order`
- الأرقام الأصغر تظهر أولاً

### 3. الفلترة
- فلترة حسب الموقع (`position`)
- فلترة حسب الحالة (`status`)
- فلترة البلوكات المجدولة حسب التاريخ

## أمثلة عملية

### إنشاء بلوك إعلاني أسفل الهيدر

```bash
node scripts/create-test-block.js
```

### تحديث موقع بلوك موجود

```javascript
// تحديث بلوك "صيف عسير" ليظهر أسفل الهيدر
const updatedBlock = {
  ...existingBlock,
  position: "below_header",
  updatedAt: new Date().toISOString()
}
```

## التطوير المستقبلي

### 1. ميزات مخططة
- [ ] دعم ترتيب البلوكات بالسحب والإفلات
- [ ] دعم أنواع تصميم متعددة حسب الموقع
- [ ] إعدادات متقدمة للجدولة
- [ ] معاينة مباشرة في لوحة التحكم

### 2. تحسينات مقترحة
- [ ] تحليلات أداء البلوكات حسب الموقع
- [ ] A/B Testing للمواقع المختلفة
- [ ] تخصيص البلوكات حسب نوع المستخدم

## استكشاف الأخطاء

### البلوك لا يظهر
1. تحقق من أن `position` صحيح
2. تحقق من أن `status` = "active"
3. تحقق من وجود `SmartSlot` في الموقع المناسب

### البلوك يظهر في موقع خاطئ
1. تحقق من قيمة `position` في قاعدة البيانات
2. تحقق من ترتيب `SmartSlot` في الصفحة

### مشاكل في الترتيب
1. تحقق من قيم `order` للبلوكات
2. تأكد من عدم وجود قيم مكررة

## الملفات المعدلة

- `types/smart-block.ts` - تحديث interface
- `components/home/SmartSlot.tsx` - دعم المواقع الجديدة
- `app/api/smart-blocks/route.ts` - تحديث API
- `app/page.tsx` - إضافة المواقع الجديدة
- `scripts/create-test-block.js` - سكريبت إنشاء بلوكات تجريبية

## الخلاصة

تم تنفيذ نظام مرن وقابل للتوسع لعرض البلوكات الذكية في مواقع محددة من واجهة المستخدم. النظام يدعم:

✅ **4 مواقع جديدة** واضحة ومنطقية  
✅ **التوافق مع النظام القديم**  
✅ **فلترة ديناميكية** حسب الموقع والحالة  
✅ **ترتيب قابل للتخصيص**  
✅ **API مرن** لإدارة البلوكات  
✅ **سهولة الاستخدام** للمطورين والمحررين  

النظام جاهز للاستخدام ويمكن توسيعه بسهولة لإضافة مواقع أو ميزات جديدة. 