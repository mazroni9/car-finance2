-- إصلاح جدول installment_rules ليتطابق مع النموذج
-- حذف الجدول القديم وإنشاء الجدول الجديد

DROP TABLE IF EXISTS installment_rules;

CREATE TABLE installment_rules (
    id SERIAL PRIMARY KEY,
    price_category NUMERIC(12,2) NOT NULL,
    duration_months INTEGER NOT NULL,
    profit_target_percent NUMERIC(5,2) NOT NULL,
    down_payment_percent NUMERIC(5,2) NOT NULL,
    last_payment_percent NUMERIC(5,2) NOT NULL,
    down_payment_value NUMERIC(12,2) NOT NULL,
    last_payment_value NUMERIC(12,2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    monthly_installment NUMERIC(12,2) NOT NULL,
    possible_purchase_amount NUMERIC(12,2) NOT NULL,
    tracking_cost NUMERIC(12,2) NOT NULL DEFAULT 0,
    guarantee_contract_cost NUMERIC(12,2) NOT NULL DEFAULT 0,
    inspection_cost NUMERIC(12,2) NOT NULL DEFAULT 0,
    profit_per_car NUMERIC(12,2) NOT NULL,
    monthly_income NUMERIC(12,2) GENERATED ALWAYS AS (
        monthly_installment * quantity
    ) STORED,
    annual_income NUMERIC(12,2) GENERATED ALWAYS AS (
        monthly_installment * quantity * 12
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
            WHEN duration_months = 36 THEN ((profit_per_car / possible_purchase_amount) * 100) / 3
            ELSE 0
        END
    ) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger لتحديث updated_at
CREATE OR REPLACE FUNCTION update_installment_rules_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_installment_rules_timestamp
    BEFORE UPDATE ON installment_rules
    FOR EACH ROW
    EXECUTE FUNCTION update_installment_rules_updated_at();

-- إنشاء Indexes للبحث السريع
CREATE INDEX idx_installment_rules_price_category ON installment_rules(price_category);
CREATE INDEX idx_installment_rules_duration_months ON installment_rules(duration_months);
CREATE INDEX idx_installment_rules_created_at ON installment_rules(created_at);

-- بيانات تجريبية
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
    profit_per_car
) VALUES 
(25000, 12, 0.30, 0.10, 0.20, 2500, 5000, 1, 2083.33, 25000, 25, 50, 300, 7500),
(30000, 24, 0.50, 0.15, 0.15, 4500, 4500, 1, 1312.50, 30000, 25, 50, 300, 15000),
(40000, 36, 0.60, 0.20, 0.10, 8000, 4000, 1, 1166.67, 40000, 25, 50, 300, 24000); 