-- إصلاح البيانات الموجودة في جدول installment_rules
-- تشغيل هذا في Supabase SQL Editor

-- 1. تحديث total_sale_price للبيانات الموجودة
UPDATE installment_rules 
SET total_sale_price = price_category * (1 + profit_target_percent)
WHERE total_sale_price IS NULL OR total_sale_price = 0;

-- 2. التحقق من البيانات المحدثة
SELECT 
    id,
    price_category,
    duration_months,
    profit_target_percent,
    total_sale_price,
    (price_category * (1 + profit_target_percent)) as calculated_total_sale_price
FROM installment_rules 
LIMIT 5;

-- 3. التحقق من عدم وجود قيم NULL
SELECT COUNT(*) as null_count
FROM installment_rules 
WHERE total_sale_price IS NULL;

-- 4. عرض إحصائيات الجدول
SELECT 
    COUNT(*) as total_records,
    COUNT(total_sale_price) as records_with_total_sale_price,
    MIN(total_sale_price) as min_total_sale_price,
    MAX(total_sale_price) as max_total_sale_price,
    AVG(total_sale_price) as avg_total_sale_price
FROM installment_rules; 