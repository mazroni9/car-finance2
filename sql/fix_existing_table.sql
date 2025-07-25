-- إصلاح الجدول الموجود: إضافة عمود total_sale_price
-- هذا الملف يصلح الجدول الموجود بدون حذفه أو إعادة إنشاؤه

-- إضافة عمود total_sale_price إذا لم يكن موجود
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'installment_rules' 
        AND column_name = 'total_sale_price'
    ) THEN
        ALTER TABLE installment_rules ADD COLUMN total_sale_price NUMERIC(12,2);
        RAISE NOTICE 'تم إضافة عمود total_sale_price';
    ELSE
        RAISE NOTICE 'عمود total_sale_price موجود بالفعل';
    END IF;
END $$;

-- تحديث البيانات الموجودة بحساب total_sale_price
UPDATE installment_rules 
SET total_sale_price = price_category * (1 + profit_target_percent)
WHERE total_sale_price IS NULL;

-- جعل العمود NOT NULL بعد التحديث
ALTER TABLE installment_rules ALTER COLUMN total_sale_price SET NOT NULL;

-- التحقق من البيانات
SELECT 
    id,
    price_category,
    duration_months,
    profit_target_percent,
    total_sale_price,
    (price_category * (1 + profit_target_percent)) as calculated_total_sale_price
FROM installment_rules 
LIMIT 5; 