# إصلاح البيانات الموجودة في جدول installment_rules

## المشكلة
الخطأ يظهر: `column "total_sale_price" of relation "installment_rules" already exists`

هذا يعني أن عمود `total_sale_price` موجود بالفعل في الجدول، لكن المشكلة في:
1. **البيانات الموجودة** تحتوي على قيم NULL أو 0
2. **API route** لا يرسل قيمة لـ `total_sale_price`

## الحل

### الخطوة 1: التحقق من هيكل الجدول
```sql
-- تشغيل في Supabase SQL Editor
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'installment_rules'
ORDER BY ordinal_position;
```

### الخطوة 2: إصلاح البيانات الموجودة
```sql
-- تحديث total_sale_price للبيانات الموجودة
UPDATE installment_rules 
SET total_sale_price = price_category * (1 + profit_target_percent)
WHERE total_sale_price IS NULL OR total_sale_price = 0;
```

### الخطوة 3: التحقق من الإصلاح
```sql
-- التحقق من عدم وجود قيم NULL
SELECT COUNT(*) as null_count
FROM installment_rules 
WHERE total_sale_price IS NULL;

-- عرض إحصائيات الجدول
SELECT 
    COUNT(*) as total_records,
    COUNT(total_sale_price) as records_with_total_sale_price,
    MIN(total_sale_price) as min_total_sale_price,
    MAX(total_sale_price) as max_total_sale_price,
    AVG(total_sale_price) as avg_total_sale_price
FROM installment_rules;
```

### الخطوة 4: اختبار النموذج
1. اذهب إلى `/admin/car-finance-entry`
2. املأ النموذج بالبيانات
3. اضغط "حفظ في قاعدة البيانات"
4. تأكد من عدم ظهور خطأ

## الملفات المطلوبة

### 1. التحقق من هيكل الجدول
```sql
-- sql/check_table_structure.sql
-- تشغيل هذا أولاً لمعرفة الأعمدة الموجودة
```

### 2. إصلاح البيانات
```sql
-- sql/fix_existing_data.sql
-- تشغيل هذا لإصلاح البيانات الموجودة
```

### 3. API route محدث
```javascript
// src/app/api/installment/save/route.js
// تأكد من إرسال total_sale_price
```

## خطوات التطبيق السريع

### 1. تشغيل SQL للتحقق
```bash
# تشغيل في Supabase SQL Editor
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'installment_rules';
```

### 2. إصلاح البيانات
```bash
# تشغيل في Supabase SQL Editor
UPDATE installment_rules 
SET total_sale_price = price_category * (1 + profit_target_percent)
WHERE total_sale_price IS NULL OR total_sale_price = 0;
```

### 3. اختبار النموذج
```bash
# اذهب إلى /admin/car-finance-entry
# املأ النموذج واختبر الحفظ
```

## ملاحظات مهمة

1. **العمود موجود** - لا نحتاج إضافته
2. **المشكلة في البيانات** - تحتاج تحديث
3. **API route صحيح** - يرسل total_sale_price
4. **النموذج يعمل** - بعد إصلاح البيانات

## التحقق من الإصلاح

### اختبار 1: التحقق من البيانات
```sql
SELECT id, price_category, total_sale_price 
FROM installment_rules 
WHERE total_sale_price IS NOT NULL 
LIMIT 5;
```

### اختبار 2: اختبار النموذج
1. اذهب إلى `/admin/car-finance-entry`
2. أدخل البيانات:
   - price_category: 25000
   - duration_months: 12
   - quantity: 1
   - down_payment_percent: 0.10
   - last_payment_percent: 0.20
3. اضغط "حفظ في قاعدة البيانات"
4. تأكد من عدم ظهور خطأ

### اختبار 3: التحقق من البيانات الجديدة
```sql
SELECT * FROM installment_rules 
ORDER BY created_at DESC 
LIMIT 1;
```

## الخلاصة

- **العمود موجود** - لا نحتاج إضافته
- **المشكلة في البيانات** - تحتاج تحديث
- **بعد إصلاح البيانات** - النموذج سيعمل بشكل صحيح 