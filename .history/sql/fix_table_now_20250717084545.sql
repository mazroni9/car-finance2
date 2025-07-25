-- إصلاح فوري لجدول installment_rules
-- تشغيل هذا في Supabase SQL Editor

-- 1. التحقق من هيكل الجدول
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'installment_rules'
ORDER BY ordinal_position;

-- 2. إصلاح البيانات الموجودة
UPDATE installment_rules 
SET total_sale_price = price_category * (1 + profit_target_percent)
WHERE total_sale_price IS NULL OR total_sale_price = 0;

-- 3. التحقق من الإصلاح
SELECT 
    id,
    price_category,
    duration_months,
    profit_target_percent,
    total_sale_price,
    (price_category * (1 + profit_target_percent)) as calculated_total_sale_price
FROM installment_rules 
LIMIT 3;

-- 4. التحقق من عدم وجود قيم NULL
SELECT COUNT(*) as null_count
FROM installment_rules 
WHERE total_sale_price IS NULL;

-- 5. إذا كان هناك قيم NULL، إصلاحها
UPDATE installment_rules 
SET total_sale_price = price_category * (1 + profit_target_percent)
WHERE total_sale_price IS NULL; 