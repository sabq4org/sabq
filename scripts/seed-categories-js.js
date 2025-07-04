const { PrismaClient } = require('../lib/generated/prisma');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 بدء عملية Seeding...');
  
  // التصنيفات الأساسية
  const categories = [
    {
      name: 'تقنية',
      slug: 'technology',
      description: JSON.stringify({
        ar: 'أخبار وتطورات التقنية والذكاء الاصطناعي',
        en: 'Technology and AI news and developments',
        name_ar: 'تقنية',
        name_en: 'Technology',
        color_hex: '#8B5CF6',
        icon: '💻',
        order: 1,
        is_default: true
      }),
      displayOrder: 1,
      isActive: true,
    },
    {
      name: 'رياضة',
      slug: 'sports',
      description: JSON.stringify({
        ar: 'أخبار رياضية محلية وعالمية',
        en: 'Local and international sports news',
        name_ar: 'رياضة',
        name_en: 'Sports',
        color_hex: '#F59E0B',
        icon: '⚽',
        order: 2,
        is_default: true
      }),
      displayOrder: 2,
      isActive: true,
    },
    {
      name: 'اقتصاد',
      slug: 'economy',
      description: JSON.stringify({
        ar: 'تقارير السوق والمال والأعمال والطاقة',
        en: 'Market, finance, business and energy reports',
        name_ar: 'اقتصاد',
        name_en: 'Economy',
        color_hex: '#10B981',
        icon: '💰',
        order: 3,
        is_default: true
      }),
      displayOrder: 3,
      isActive: true,
    },
    {
      name: 'سياسة',
      slug: 'politics',
      description: JSON.stringify({
        ar: 'مستجدات السياسة المحلية والدولية وتحليلاتها',
        en: 'Local and international political updates and analysis',
        name_ar: 'سياسة',
        name_en: 'Politics',
        color_hex: '#EF4444',
        icon: '🏛️',
        order: 4,
        is_default: true
      }),
      displayOrder: 4,
      isActive: true,
    },
    {
      name: 'محليات',
      slug: 'local',
      description: JSON.stringify({
        ar: 'أخبار المناطق والمدن السعودية',
        en: 'Saudi regions and cities news',
        name_ar: 'محليات',
        name_en: 'Local',
        color_hex: '#3B82F6',
        icon: '🗺️',
        order: 5,
        is_default: true
      }),
      displayOrder: 5,
      isActive: true,
    },
    {
      name: 'ثقافة ومجتمع',
      slug: 'culture',
      description: JSON.stringify({
        ar: 'فعاليات ثقافية، مناسبات، قضايا اجتماعية',
        en: 'Cultural events, occasions, social issues',
        name_ar: 'ثقافة ومجتمع',
        name_en: 'Culture',
        color_hex: '#EC4899',
        icon: '🎭',
        order: 6,
        is_default: true
      }),
      displayOrder: 6,
      isActive: true,
    },
    {
      name: 'مقالات رأي',
      slug: 'opinion',
      description: JSON.stringify({
        ar: 'تحليلات ووجهات نظر كتاب الرأي',
        en: 'Analysis and perspectives from opinion writers',
        name_ar: 'مقالات رأي',
        name_en: 'Opinion',
        color_hex: '#7C3AED',
        icon: '✍️',
        order: 7,
        is_default: true
      }),
      displayOrder: 7,
      isActive: true,
    },
    {
      name: 'منوعات',
      slug: 'misc',
      description: JSON.stringify({
        ar: 'أخبار خفيفة، لقطات، طرائف وأحداث غير تقليدية',
        en: 'Light news, snapshots, curiosities and unconventional events',
        name_ar: 'منوعات',
        name_en: 'Misc',
        color_hex: '#6B7280',
        icon: '🎉',
        order: 8,
        is_default: true
      }),
      displayOrder: 8,
      isActive: true,
    },
  ];

  console.log('📝 إضافة التصنيفات الأساسية...');
  
  for (const category of categories) {
    try {
      const result = await prisma.category.upsert({
        where: { slug: category.slug },
        update: {
          name: category.name,
          description: category.description,
          displayOrder: category.displayOrder,
          isActive: category.isActive,
        },
        create: category,
      });
      
      const metadata = JSON.parse(result.description || '{}');
      console.log(`   ✅ ${metadata.icon || '📁'} ${category.name} (${category.slug})`);
    } catch (error) {
      console.error(`   ❌ خطأ في إضافة ${category.name}:`, error.message);
    }
  }

  console.log('\n✨ تمت عملية Seeding بنجاح!');
  
  // عرض ملخص التصنيفات
  const totalCategories = await prisma.category.count();
  const activeCategories = await prisma.category.count({ where: { isActive: true } });
  
  console.log(`\n📊 ملخص:`);
  console.log(`   • إجمالي التصنيفات: ${totalCategories}`);
  console.log(`   • التصنيفات النشطة: ${activeCategories}`);
}

main()
  .catch((e) => {
    console.error('❌ خطأ في عملية Seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('\n🔌 تم قطع الاتصال بقاعدة البيانات');
  }); 