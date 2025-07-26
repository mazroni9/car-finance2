
-- === car_finance_schema.sql ===

-- إنشاء جدول العملاء
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    full_name TEXT NOT NULL,
    phone_number VARCHAR(20),
    national_id VARCHAR(15) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول السيارات
CREATE TABLE cars (
    id SERIAL PRIMARY KEY,
    model TEXT NOT NULL,
    brand TEXT,
    year INT,
    price NUMERIC(12, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول طلبات التمويل
CREATE TABLE financing_requests (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    car_id INTEGER REFERENCES cars(id),
    down_payment NUMERIC(12,2),
    final_payment NUMERIC(12,2),
    monthly_payment NUMERIC(12,2),
    financing_percentage NUMERIC(5,2),
    term_months INTEGER,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول العمليات المالية
CREATE TABLE finance_transactions (
    id SERIAL PRIMARY KEY,
    financing_request_id INTEGER REFERENCES financing_requests(id),
    amount NUMERIC(12,2),
    type VARCHAR(20), -- installment / down_payment / final_payment
    paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول المستخدمين إن لزم
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول المستثمرين
CREATE TABLE investors (
    id SERIAL PRIMARY KEY,
    full_name TEXT NOT NULL,
    phone_number VARCHAR(20),
    email TEXT UNIQUE,
    national_id VARCHAR(15) UNIQUE,
    wallet_balance NUMERIC(14,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول اشتراكات المستخدمين
CREATE TABLE subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    plan_type VARCHAR(20), -- basic / trader_25 / trader_50 / trader_75 / trader_100 / showroom
    monthly_fee NUMERIC(8,2),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

-- جدول استثمار رأس المال
CREATE TABLE investment_cycles (
    id SERIAL PRIMARY KEY,
    investor_id INTEGER REFERENCES investors(id),
    amount NUMERIC(14,2),
    expected_annual_return NUMERIC(5,2), -- مثلاً 30%
    start_date DATE,
    payout_schedule VARCHAR(20), -- quarterly / bimonthly
    reinvestment_policy VARCHAR(50), -- full_reinvest / partial / no_reinvest
    status VARCHAR(20) DEFAULT 'active'
);

-- جدول أرباح المستثمرين
CREATE TABLE investor_profits (
    id SERIAL PRIMARY KEY,
    investment_id INTEGER REFERENCES investment_cycles(id),
    profit_amount NUMERIC(12,2),
    distributed_on DATE,
    reinvested BOOLEAN DEFAULT FALSE
);


-- بيانات تجريبية

-- بيانات أولية للعملاء
INSERT INTO customers (full_name, phone_number, national_id)
VALUES 
  ('عبدالله السالم', '0501234567', '1012345678'),
  ('سارة المانع', '0559876543', '1023456789');

-- بيانات أولية للسيارات
INSERT INTO cars (model, brand, year, price)
VALUES 
  ('Camry', 'Toyota', 2021, 75000),
  ('Sonata', 'Hyundai', 2022, 82000);

-- بيانات أولية لطلبات التمويل
INSERT INTO financing_requests (customer_id, car_id, down_payment, final_payment, monthly_payment, financing_percentage, term_months)
VALUES 
  (1, 1, 15000, 10000, 2000, 50.00, 24),
  (2, 2, 18000, 12000, 2500, 40.00, 30);

-- بيانات أولية للمستثمرين
INSERT INTO investors (full_name, phone_number, email, national_id, wallet_balance)
VALUES 
  ('محمد الزهراني', '0530001122', 'mzahrani@example.com', '1034567890', 100000),
  ('نورة العتيبي', '0549992211', 'nora@example.com', '1045678901', 75000);

-- اشتراكات المستخدمين
INSERT INTO users (username, password, role) VALUES
  ('admin', 'adminpass', 'admin'),
  ('tuser', 'traderpass', 'trader');

INSERT INTO subscriptions (user_id, plan_type, monthly_fee, started_at, expires_at)
VALUES
  (1, 'showroom', 3000, CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days'),
  (2, 'trader_50', 1000, CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days');

-- دورة استثمارية
INSERT INTO investment_cycles (investor_id, amount, expected_annual_return, start_date, payout_schedule, reinvestment_policy)
VALUES
  (1, 50000, 30.0, CURRENT_DATE, 'quarterly', 'partial'),
  (2, 25000, 25.0, CURRENT_DATE, 'bimonthly', 'full_reinvest');

-- أرباح المستثمرين
INSERT INTO investor_profits (investment_id, profit_amount, distributed_on, reinvested)
VALUES
  (1, 3750, CURRENT_DATE + INTERVAL '90 days', FALSE),
  (2, 3125, CURRENT_DATE + INTERVAL '60 days', TRUE);


-- === installment_rules_schema.sql ===

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

