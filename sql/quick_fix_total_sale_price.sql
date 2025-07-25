-- حل سريع لمشكلة total_sale_price
-- تشغيل هذا في Supabase SQL Editor

-- 1. التحقق من البيانات الموجودة
SELECT 
    id,
    price_category,
    duration_months,
    profit_target_percent,
    total_sale_price,
    (price_category * (1 + profit_target_percent)) as calculated_total_sale_price
FROM installment_rules 
LIMIT 5;

-- 2. تحديث البيانات التي تحتوي على NULL أو 0
UPDATE installment_rules 
SET total_sale_price = price_category * (1 + profit_target_percent)
WHERE total_sale_price IS NULL OR total_sale_price = 0;

-- 3. التحقق من التحديث
SELECT 
    id,
    price_category,
    duration_months,
    profit_target_percent,
    total_sale_price
FROM installment_rules 
WHERE total_sale_price IS NOT NULL 
LIMIT 5;

-- 4. التحقق من عدم وجود قيم NULL
SELECT COUNT(*) as null_count
FROM installment_rules 
WHERE total_sale_price IS NULL;

-- 5. إحصائيات الجدول
SELECT 
    COUNT(*) as total_records,
    COUNT(total_sale_price) as records_with_total_sale_price,
    MIN(total_sale_price) as min_total_sale_price,
    MAX(total_sale_price) as max_total_sale_price
FROM installment_rules; 