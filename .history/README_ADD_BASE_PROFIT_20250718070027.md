# إضافة عمود "الربح الأساسي" إلى جدول installment_rules

## المشكلة
كان عمود "الربح الأساسي" (base_profit) مفقود من جدول `installment_rules` في قاعدة البيانات، بينما كان موجوداً في صفحة car-leasing ويتم حسابه وعرضه هناك.

## الحل المطبق

### 1. إضافة العمود إلى قاعدة البيانات
تم إنشاء ملف `sql/add_base_profit_column_final.sql` الذي يحتوي على:

```sql
-- إضافة عمود base_profit إذا لم يكن موجود
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'installment_rules' 
        AND column_name = 'base_profit'
    ) THEN
        ALTER TABLE installment_rules ADD COLUMN base_profit NUMERIC(12,2);
        RAISE NOTICE '✅ تم إضافة عمود base_profit';
    ELSE
        RAISE NOTICE 'ℹ️ عمود base_profit موجود بالفعل';
    END IF;
END $$;

-- تحديث البيانات الموجودة بحساب base_profit
UPDATE installment_rules 
SET base_profit = price_category * profit_target_percent
WHERE base_profit IS NULL;

-- جعل العمود NOT NULL بعد التحديث
ALTER TABLE installment_rules ALTER COLUMN base_profit SET NOT NULL;
```

### 2. تحديث API Route
تم تحديث ملف `src/app/api/installment/save/route.js` لإضافة حساب وحفظ `base_profit`:

```javascript
// حساب الربح الأساسي
const base_profit = price_category * (calculatedProfitTargetPercent / 100);

// تجهيز البيانات للإدخال
const insertData = {
  // ... البيانات الأخرى
  base_profit: Number(base_profit)
};
```

### 3. تحديث TypeScript Types
تم تحديث ملف `src/types/finance.ts` لإضافة `baseProfit` إلى interface:

```typescript
export interface InstallmentRule {
  // ... الحقول الأخرى
  baseProfit: number;
  // ... باقي الحقول
}
```

### 4. تحديث CarFinanceTable
تم تحديث ملف `src/app/car-finance/components/CarFinanceTable.tsx` لإضافة:

- إضافة `base_profit` إلى نوع البيانات
- إضافة عمود "الربح الأساسي" في رأس الجدول
- إضافة عرض قيمة `base_profit` في صفوف الجدول

### 5. تحديث جدول النتائج في car-leasing
تم تحديث ملف `src/app/car-leasing/page.tsx` لإضافة:

- إضافة عمود "الربح الأساسي" في رأس جدول النتائج
- إضافة عرض قيمة `base_profit` في صفوف جدول النتائج
- تحديث صف المجاميع ليشمل مجموع الربح الأساسي
- تحديث رسالة "لا توجد بيانات" لتشمل العمود الجديد

## خطوات التطبيق

### الخطوة 1: تشغيل SQL في Supabase
1. اذهب إلى Supabase Dashboard
2. افتح SQL Editor
3. انسخ محتوى ملف `sql/add_base_profit_column_final.sql`
4. شغل الكود

### الخطوة 2: اختبار API
1. اذهب إلى `/admin/car-finance-entry`
2. أضف بيانات جديدة
3. تأكد من حفظ البيانات بنجاح

### الخطوة 3: اختبار العرض
1. اذهب إلى `/car-finance`
2. تأكد من ظهور عمود "الربح الأساسي" في الجدول
3. تأكد من صحة القيم المعروضة

## التحقق من النتيجة

### في قاعدة البيانات:
```sql
-- التحقق من وجود العمود
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'installment_rules' 
AND column_name = 'base_profit';

-- التحقق من البيانات
SELECT 
    id,
    price_category,
    profit_target_percent,
    base_profit,
    (price_category * profit_target_percent) as calculated_base_profit
FROM installment_rules 
LIMIT 5;
```

### في الواجهة:
- عمود "الربح الأساسي" يظهر في جدول `/car-finance`
- القيم محسوبة بشكل صحيح: `base_profit = price_category * profit_target_percent`

## الملفات المعدلة

### 1. ملفات SQL:
- `sql/add_base_profit_column_final.sql` - إضافة العمود إلى قاعدة البيانات

### 2. ملفات API:
- `src/app/api/installment/save/route.js` - إضافة حساب وحفظ base_profit

### 3. ملفات TypeScript:
- `src/types/finance.ts` - إضافة baseProfit إلى interface
- `src/app/car-finance/components/CarFinanceTable.tsx` - إضافة عرض العمود
- `src/app/car-leasing/page.tsx` - إضافة عمود "الربح الأساسي" إلى جدول النتائج

### 4. ملفات التوثيق:
- `README_ADD_BASE_PROFIT.md` - هذا الملف

## ملاحظات مهمة

1. **البيانات الموجودة**: سيتم تحديث جميع البيانات الموجودة بحساب `base_profit`
2. **البيانات الجديدة**: سيتم حساب وحفظ `base_profit` تلقائياً
3. **التوافق**: العمود متوافق مع صفحة car-leasing الموجودة
4. **الاختبار**: تأكد من اختبار جميع الوظائف بعد التطبيق

## الدعم

إذا واجهت أي مشاكل:
1. تحقق من تشغيل SQL بشكل صحيح
2. تحقق من console في المتصفح للأخطاء
3. تحقق من logs في Supabase
4. اختبر API route مباشرة 