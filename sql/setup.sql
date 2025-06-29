-- إنشاء قاعدة البيانات والمستخدم
CREATE DATABASE car_finance;
CREATE USER car_finance_user WITH PASSWORD 'Maz232.5';
GRANT ALL PRIVILEGES ON DATABASE car_finance TO car_finance_user;

-- الاتصال بقاعدة البيانات
\c car_finance;

-- إنشاء الجداول
CREATE TABLE installment_plans (
    id SERIAL PRIMARY KEY,
    months INTEGER NOT NULL,
    profit_rate DECIMAL(4,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cars (
    id SERIAL PRIMARY KEY,
    price_category INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    down_payment_rate DECIMAL(4,2) NOT NULL,
    down_payment INTEGER NOT NULL,
    last_payment INTEGER NOT NULL,
    monthly_income INTEGER NOT NULL,
    annual_income INTEGER NOT NULL,
    inspection_cost INTEGER NOT NULL,
    warranty_cost INTEGER NOT NULL,
    tracking_cost INTEGER NOT NULL,
    purchase_cost INTEGER NOT NULL,
    selling_price INTEGER NOT NULL,
    installment_plan_id INTEGER REFERENCES installment_plans(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE financial_summaries (
    id SERIAL PRIMARY KEY,
    total_annual_cost INTEGER NOT NULL,
    total_annual_income INTEGER NOT NULL,
    salary_expense INTEGER NOT NULL,
    rent_expense INTEGER NOT NULL,
    inspection_expense INTEGER NOT NULL,
    warranty_expense INTEGER NOT NULL,
    tracking_expense INTEGER NOT NULL,
    operating_expense INTEGER NOT NULL,
    net_profit INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- إضافة خطط التقسيط الأساسية
INSERT INTO installment_plans (months, profit_rate) VALUES
(12, 0.30),  -- خطة 12 شهر بنسبة ربح 30%
(24, 0.50),  -- خطة 24 شهر بنسبة ربح 50%
(36, 0.65);  -- خطة 36 شهر بنسبة ربح 65%

-- إنشاء دالة لتحديث updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- إضافة Triggers لتحديث updated_at
CREATE TRIGGER update_cars_updated_at
    BEFORE UPDATE ON cars
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_installment_plans_updated_at
    BEFORE UPDATE ON installment_plans
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_financial_summaries_updated_at
    BEFORE UPDATE ON financial_summaries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 