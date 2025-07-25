-- فحص وإصلاح جدول installment_rules

-- 1. التحقق من وجود الجدول
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'installment_rules'
) as table_exists;

-- 2. إنشاء الجدول إذا لم يكن موجوداً
CREATE TABLE IF NOT EXISTS installment_rules (
    id SERIAL PRIMARY KEY,
    price_category NUMERIC(12,2) NOT NULL,
    duration_months INTEGER NOT NULL,
    profit_target_percent NUMERIC(5,2) NOT NULL,
    down_payment_value NUMERIC(12,2) NOT NULL,
    last_payment_value NUMERIC(12,2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    monthly_installment NUMERIC(12,2) NOT NULL,
    monthly_income NUMERIC(12,2) GENERATED ALWAYS AS (
        monthly_installment * quantity
    ) STORED,
    annual_income NUMERIC(12,2) GENERATED ALWAYS AS (
        monthly_installment * quantity * 12
    ) STORED,
    possible_purchase_amount NUMERIC(12,2) NOT NULL,
    tracking_cost NUMERIC(12,2) NOT NULL DEFAULT 0,
    guarantee_contract_cost NUMERIC(12,2) NOT NULL DEFAULT 0,
    inspection_cost NUMERIC(12,2) NOT NULL DEFAULT 0,
    profit_per_car NUMERIC(12,2) NOT NULL,
    annual_profit NUMERIC(12,2) GENERATED ALWAYS AS (
        CASE 
            WHEN duration_months = 12 THEN profit_per_car * quantity
            WHEN duration_months = 18 THEN (profit_per_car * quantity) / 1.5
            WHEN duration_months = 24 THEN (profit_per_car * quantity) / 2
            ELSE 0
        END
    ) STORED,
    total_profit_full_period NUMERIC(12,2) GENERATED ALWAYS AS (
        profit_per_car * quantity
    ) STORED,
    roi_full_period NUMERIC(5,2) GENERATED ALWAYS AS (
        (profit_per_car / possible_purchase_amount) * 100
    ) STORED,
    roi_annual NUMERIC(5,2) GENERATED ALWAYS AS (
        CASE 
            WHEN duration_months = 12 THEN (profit_per_car / possible_purchase_amount) * 100
            WHEN duration_months = 18 THEN ((profit_per_car / possible_purchase_amount) * 100) / 1.5
            WHEN duration_months = 24 THEN ((profit_per_car / possible_purchase_amount) * 100) / 2
            ELSE 0
        END
    ) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. إضافة trigger لتحديث updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_installment_rules_updated_at ON installment_rules;
CREATE TRIGGER update_installment_rules_updated_at
    BEFORE UPDATE ON installment_rules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 4. إعداد RLS (Row Level Security)
ALTER TABLE installment_rules ENABLE ROW LEVEL SECURITY;

-- 5. إنشاء policies
DROP POLICY IF EXISTS "Enable insert for all users" ON installment_rules;
CREATE POLICY "Enable insert for all users" ON installment_rules FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Enable select for all users" ON installment_rules;
CREATE POLICY "Enable select for all users" ON installment_rules FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable update for all users" ON installment_rules;
CREATE POLICY "Enable update for all users" ON installment_rules FOR UPDATE USING (true);

-- 6. اختبار إدخال بيانات
INSERT INTO installment_rules (
    price_category,
    duration_months,
    profit_target_percent,
    down_payment_value,
    last_payment_value,
    quantity,
    monthly_installment,
    possible_purchase_amount,
    tracking_cost,
    guarantee_contract_cost,
    inspection_cost,
    profit_per_car
) VALUES (
    20000,
    12,
    30,
    2000,
    4000,
    1,
    1166.67,
    20000,
    25,
    50,
    300,
    6000
) ON CONFLICT DO NOTHING;

-- 7. التحقق من البيانات
SELECT 
    id,
    price_category,
    duration_months,
    profit_target_percent,
    monthly_installment,
    profit_per_car,
    created_at
FROM installment_rules 
ORDER BY created_at DESC 
LIMIT 5;

-- 8. عرض هيكل الجدول
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'installment_rules' 
ORDER BY ordinal_position; 