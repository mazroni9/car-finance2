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
    color TEXT,
    mileage INT,
    status VARCHAR(20) DEFAULT 'available',
    transmission VARCHAR(20) DEFAULT 'أوتوماتيك',
    fuel_type VARCHAR(20) DEFAULT 'بنزين',
    images TEXT[],
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
INSERT INTO cars (model, brand, year, price, color, mileage, status, transmission, fuel_type)
VALUES 
  ('Camry', 'Toyota', 2021, 75000, 'أبيض', 15000, 'available', 'أوتوماتيك', 'بنزين'),
  ('Sonata', 'Hyundai', 2022, 82000, 'أسود', 10000, 'available', 'أوتوماتيك', 'بنزين'),
  ('Accord', 'Honda', 2023, 95000, 'فضي', 5000, 'available', 'أوتوماتيك', 'هايبرد'),
  ('Elantra', 'Hyundai', 2022, 68000, 'أحمر', 20000, 'available', 'أوتوماتيك', 'بنزين');

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

-- Function to get financial summary
CREATE OR REPLACE FUNCTION get_financial_summary()
RETURNS TABLE (
    total_monthly_installments NUMERIC,
    total_annual_income NUMERIC,
    total_purchase_cost NUMERIC,
    total_profit_full_period NUMERIC,
    avg_roi_full_period NUMERIC,
    avg_roi_annual NUMERIC,
    total_down_payments NUMERIC,
    total_last_payments_per_year NUMERIC,
    total_annual_profit_before_costs NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    WITH summary AS (
        SELECT 
            SUM(monthly_payment) as total_monthly,
            SUM(down_payment) as total_down,
            SUM(final_payment) as total_final,
            SUM(car_id::float8 * price) as total_cost,
            COUNT(*) as total_requests,
            AVG(financing_percentage) as avg_financing
        FROM financing_requests fr
        JOIN cars c ON fr.car_id = c.id
        WHERE fr.status = 'approved'
    )
    SELECT
        summary.total_monthly,
        (summary.total_monthly * 12) as yearly_income,
        summary.total_cost,
        ((summary.total_monthly * 12) + summary.total_down + summary.total_final - summary.total_cost) as full_period_profit,
        CASE 
            WHEN summary.total_cost > 0 
            THEN (((summary.total_monthly * 12) + summary.total_down + summary.total_final - summary.total_cost) / summary.total_cost)
            ELSE 0 
        END as roi_full_period,
        CASE 
            WHEN summary.total_cost > 0 
            THEN (((summary.total_monthly * 12) - summary.total_cost) / summary.total_cost)
            ELSE 0 
        END as roi_annual,
        summary.total_down,
        summary.total_final,
        ((summary.total_monthly * 12) - summary.total_cost) as annual_profit_before_costs
    FROM summary;
END;
$$ LANGUAGE plpgsql;
