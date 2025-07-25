-- إضافة عمود base_profit إلى جدول installment_rules
-- تشغيل هذا في Supabase SQL Editor

-- إضافة عمود base_profit إذا لم يكن موجود
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'installment_rules' 
        AND column_name = 'base_profit'
    ) THEN
        ALTER TABLE installment_rules ADD COLUMN base_profit NUMERIC(12,2);
        RAISE NOTICE 'تم إضافة عمود base_profit';
    ELSE
        RAISE NOTICE 'عمود base_profit موجود بالفعل';
    END IF;
END $$;

-- تحديث البيانات الموجودة بحساب base_profit
UPDATE installment_rules 
SET base_profit = price_category * profit_target_percent
WHERE base_profit IS NULL;

-- جعل العمود NOT NULL بعد التحديث
ALTER TABLE installment_rules ALTER COLUMN base_profit SET NOT NULL;

-- التحقق من البيانات
SELECT 
    id,
    price_category,
    duration_months,
    profit_target_percent,
    base_profit,
    (price_category * profit_target_percent) as calculated_base_profit
FROM installment_rules 
LIMIT 5;

-- عرض إحصائيات الجدول
SELECT 
    COUNT(*) as total_records,
    COUNT(base_profit) as records_with_base_profit,
    MIN(base_profit) as min_base_profit,
    MAX(base_profit) as max_base_profit,
    AVG(base_profit) as avg_base_profit
FROM installment_rules; 