-- جدول قواعد التسعير حسب شريحة السعر
CREATE TABLE pricing_rules (
    id SERIAL PRIMARY KEY,
    min_price NUMERIC(10,2),
    max_price NUMERIC(10,2),
    allowed_terms INTEGER[],  -- الشهور الممكنة مثل: ARRAY[12, 15, 18]
    base_profit_rate NUMERIC(5,2), -- مثل: 30.0 أو 50.0
    min_discount_rate NUMERIC(5,2), -- مثلاً: 55.0 في حالة الخصم
    notes TEXT
);

-- جدول العروض الفعلية المقدمة للعميل بناءً على السيارة واختياره
CREATE TABLE installment_offers (
    id SERIAL PRIMARY KEY,
    car_price NUMERIC(10,2) NOT NULL,
    selected_term INTEGER NOT NULL,
    applied_profit_rate NUMERIC(5,2) NOT NULL,
    total_profit NUMERIC(12,2) GENERATED ALWAYS AS (
        (car_price * applied_profit_rate * selected_term / 12) / 100
    ) STORED,
    final_price NUMERIC(12,2) GENERATED ALWAYS AS (
        car_price + ((car_price * applied_profit_rate * selected_term / 12) / 100)
    ) STORED,
    monthly_payment NUMERIC(10,2) GENERATED ALWAYS AS (
        (car_price + ((car_price * applied_profit_rate * selected_term / 12) / 100)) / selected_term
    ) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول السيارات المباعة فعليًا
CREATE TABLE financed_vehicles (
    id SERIAL PRIMARY KEY,
    offer_id INTEGER REFERENCES installment_offers(id),
    car_model TEXT,
    buyer_name TEXT,
    delivered BOOLEAN DEFAULT FALSE,
    delivered_at TIMESTAMP
);

-- جدول قواعد التقسيط
DROP TABLE IF EXISTS installment_rules;

CREATE TABLE installment_rules (
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

-- بيانات أولية للقواعد

-- إدخال قواعد التسعير حسب الفئات

-- فئة 1: من 0 إلى 20,000 ريال
INSERT INTO pricing_rules (min_price, max_price, allowed_terms, base_profit_rate, min_discount_rate, notes)
VALUES (0, 20000, ARRAY[12, 15, 18], 30.0, 30.0, 'تقسيط قصير، نسبة ربح 30%');

-- فئة 2: من 21,000 إلى 35,000 ريال
INSERT INTO pricing_rules (min_price, max_price, allowed_terms, base_profit_rate, min_discount_rate, notes)
VALUES (21000, 35000, ARRAY[24, 27, 30], 50.0, 50.0, 'تقسيط متوسط، نسبة ربح 50%');

-- فئة 3: من 36,000 إلى 60,000 ريال
INSERT INTO pricing_rules (min_price, max_price, allowed_terms, base_profit_rate, min_discount_rate, notes)
VALUES (36000, 60000, ARRAY[34, 37, 40], 60.0, 55.0, 'تقسيط طويل، ربح مرن بين 60% و55% حسب التصنيف');


-- إنشاء VIEW لحساب عرض تقسيط

CREATE OR REPLACE VIEW installment_offer_view AS
WITH base AS (
  SELECT 
    30000 AS car_price,
    0.10 * 30000 AS down_payment,
    0.20 * 30000 AS final_payment,
    27 AS term_months,
    50.0 AS profit_rate
),
calc AS (
  SELECT *,
    (car_price - down_payment - final_payment) AS financed_amount,
    ((car_price - down_payment - final_payment) * profit_rate * term_months / 12) / 100 AS profit_amount,
    ((car_price - down_payment - final_payment) + 
     ((car_price - down_payment - final_payment) * profit_rate * term_months / 12) / 100) AS total_payable,
    (((car_price - down_payment - final_payment) + 
     ((car_price - down_payment - final_payment) * profit_rate * term_months / 12) / 100) / term_months) AS monthly_installment
  FROM base
)
SELECT 
  car_price,
  down_payment,
  final_payment,
  term_months,
  profit_rate,
  ROUND(financed_amount, 2) AS financed_amount,
  ROUND(profit_amount, 2) AS total_profit,
  ROUND(total_payable, 2) AS final_total,
  ROUND(monthly_installment, 2) AS monthly_payment
FROM calc;


-- دالة لحساب التقسيط بناءً على مدخلات المستخدم

CREATE OR REPLACE FUNCTION calculate_installment_offer(
    car_price NUMERIC,
    down_payment_percent NUMERIC,
    final_payment_percent NUMERIC,
    term_months INTEGER,
    profit_rate NUMERIC
)
RETURNS TABLE (
    car_price NUMERIC,
    down_payment NUMERIC,
    final_payment NUMERIC,
    term_months INTEGER,
    profit_rate NUMERIC,
    financed_amount NUMERIC,
    total_profit NUMERIC,
    final_total NUMERIC,
    monthly_payment NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    car_price,
    ROUND(car_price * down_payment_percent / 100, 2),
    ROUND(car_price * final_payment_percent / 100, 2),
    term_months,
    profit_rate,
    ROUND((car_price - (car_price * down_payment_percent / 100) - (car_price * final_payment_percent / 100)), 2),
    ROUND(((car_price - (car_price * down_payment_percent / 100) - (car_price * final_payment_percent / 100)) * profit_rate * term_months / 12) / 100, 2),
    ROUND((car_price - (car_price * down_payment_percent / 100) - (car_price * final_payment_percent / 100)) + 
         (((car_price - (car_price * down_payment_percent / 100) - (car_price * final_payment_percent / 100)) * profit_rate * term_months / 12) / 100), 2),
    ROUND(((car_price - (car_price * down_payment_percent / 100) - (car_price * final_payment_percent / 100)) + 
         (((car_price - (car_price * down_payment_percent / 100) - (car_price * final_payment_percent / 100)) * profit_rate * term_months / 12) / 100)) / term_months, 2);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_installment_rules_updated_at
    BEFORE UPDATE ON installment_rules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
