#!/bin/bash

# 🧹 سكريبت تنظيف وإعادة ضبط قاعدة البيانات
# =============================================
# هذا السكريبت يقوم بـ:
# 1. أخذ نسخة احتياطية
# 2. تنظيف قاعدة البيانات
# 3. إضافة التصنيفات الأساسية (اختياري)

# الألوان للطباعة
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# عنوان السكريبت
echo -e "${BLUE}"
echo "================================================"
echo "🧹 سكريبت تنظيف وإعادة ضبط قاعدة البيانات"
echo "================================================"
echo -e "${NC}"

# تحذير
echo -e "${RED}⚠️  تحذير هام ⚠️${NC}"
echo "هذا السكريبت سيقوم بحذف جميع البيانات التجريبية من قاعدة البيانات!"
echo "لا يمكن التراجع عن هذه العملية."
echo ""
echo -e "${YELLOW}هل تريد المتابعة؟ [y/N]${NC}"
read -r response

if [[ ! "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo -e "${YELLOW}تم إلغاء العملية.${NC}"
    exit 0
fi

# الخطوة 1: النسخ الاحتياطي
echo ""
echo -e "${BLUE}📦 الخطوة 1: أخذ نسخة احتياطية...${NC}"
echo -e "${YELLOW}هل تريد أخذ نسخة احتياطية أولاً؟ (ينصح بذلك) [Y/n]${NC}"
read -r backup_response

if [[ ! "$backup_response" =~ ^([nN][oO]|[nN])$ ]]; then
    echo -e "${BLUE}جاري أخذ النسخة الاحتياطية...${NC}"
    node scripts/backup-before-clean.js
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ تمت النسخة الاحتياطية بنجاح${NC}"
    else
        echo -e "${RED}❌ فشلت النسخة الاحتياطية${NC}"
        echo -e "${YELLOW}هل تريد المتابعة بدون نسخة احتياطية؟ [y/N]${NC}"
        read -r continue_response
        if [[ ! "$continue_response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
            echo -e "${YELLOW}تم إلغاء العملية.${NC}"
            exit 1
        fi
    fi
else
    echo -e "${YELLOW}تم تخطي النسخة الاحتياطية${NC}"
fi

# الخطوة 2: تنظيف قاعدة البيانات
echo ""
echo -e "${BLUE}🧹 الخطوة 2: تنظيف قاعدة البيانات...${NC}"
echo -e "${RED}سيتم حذف جميع البيانات التجريبية الآن!${NC}"
echo ""

node scripts/clean-database-full.js

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ تم تنظيف قاعدة البيانات بنجاح${NC}"
else
    echo -e "${RED}❌ فشل تنظيف قاعدة البيانات${NC}"
    exit 1
fi

# الخطوة 3: إضافة البيانات الأساسية (اختياري)
echo ""
echo -e "${BLUE}📝 الخطوة 3: إضافة البيانات الأساسية${NC}"
echo -e "${YELLOW}هل تريد إضافة التصنيفات الأساسية؟ [y/N]${NC}"
read -r categories_response

if [[ "$categories_response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo -e "${BLUE}جاري إضافة التصنيفات...${NC}"
    
    # التحقق من وجود سكريبت التصنيفات
    if [ -f "scripts/add-real-categories.js" ]; then
        node scripts/add-real-categories.js
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ تمت إضافة التصنيفات بنجاح${NC}"
        else
            echo -e "${RED}❌ فشل إضافة التصنيفات${NC}"
        fi
    else
        echo -e "${YELLOW}لم يتم العثور على سكريبت التصنيفات${NC}"
    fi
else
    echo -e "${YELLOW}تم تخطي إضافة التصنيفات${NC}"
fi

# الملخص النهائي
echo ""
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}✨ تمت العملية بنجاح!${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
echo -e "${BLUE}الخطوات التالية:${NC}"
echo "1. إضافة المؤلفين والمراسلين الحقيقيين"
echo "2. إضافة المحتوى الرسمي من إدارة الصحيفة"
echo "3. تكوين إعدادات النظام حسب احتياجات الصحيفة"
echo ""
echo -e "${YELLOW}ملاحظة: تم الاحتفاظ بالمستخدمين الإداريين فقط${NC}" 