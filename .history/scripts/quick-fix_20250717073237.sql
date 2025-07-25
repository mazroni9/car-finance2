-- إصلاح سريع: إضافة عمود total_sale_price إلى الجدول الموجود
-- إذا كان الجدول موجود بالفعل، استخدم هذا الملف

-- إضافة عمود total_sale_price إذا لم يكن موجود
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'installment_rules' 
        AND column_name = 'total_sale_price'
    ) THEN
        ALTER TABLE installment_rules ADD COLUMN total_sale_price NUMERIC(12,2);
    END IF;
END $$;

-- تحديث البيانات الموجودة
UPDATE installment_rules 
SET total_sale_price = price_category * (1 + profit_target_percent)
WHERE total_sale_price IS NULL;

-- جعل العمود NOT NULL بعد التحديث
ALTER TABLE installment_rules ALTER COLUMN total_sale_price SET NOT NULL;

-- إضافة بيانات تجريبية جديدة (اختياري)
INSERT INTO installment_rules (
    price_category,
    duration_months,
    profit_target_percent,
    down_payment_percent,
    last_payment_percent,
    down_payment_value,
    last_payment_value,
    quantity,
    monthly_installment,
    possible_purchase_amount,
    tracking_cost,
    guarantee_contract_cost,
    inspection_cost,
    profit_per_car,
    total_sale_price
) VALUES 
(35000, 18, 0.40, 0.15, 0.15, 5250, 5250, 2, 1477.78, 70000, 50, 100, 600, 14000, 49000)
ON CONFLICT DO NOTHING; 