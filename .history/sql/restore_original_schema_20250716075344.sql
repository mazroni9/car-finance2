-- =====================================================
-- استرجاع الإسكيم الأصلي لمنصة تمويل السيارات
-- =====================================================
-- هذا الملف يسترجع الإسكيم الأصلي مع منطق التأجير الصحيح
-- تاريخ الإنشاء: 2025-01-XX
-- =====================================================

-- =====================================================
-- 1. حذف جميع الجداول الحالية
-- =====================================================

DROP TABLE IF EXISTS settlements CASCADE;
DROP TABLE IF EXISTS dealer_transactions CASCADE;
DROP TABLE IF EXISTS dealer_wallets CASCADE;
DROP TABLE IF EXISTS wallet_transactions CASCADE;
DROP TABLE IF EXISTS wallets CASCADE;
DROP TABLE IF EXISTS finance_transactions CASCADE;
DROP TABLE IF EXISTS financing_requests CASCADE;
DROP TABLE IF EXISTS installment_rules CASCADE;
DROP TABLE IF EXISTS pricing_rules CASCADE;
DROP TABLE IF EXISTS investor_profits CASCADE;
DROP TABLE IF EXISTS investment_cycles CASCADE;
DROP TABLE IF EXISTS investors CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS car_showcase CASCADE;

-- =====================================================
-- 2. إنشاء الجداول الأصلية
-- =====================================================

-- جدول السيارات الأصلي
CREATE TABLE car_showcase (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    make text NOT NULL,
    model text NOT NULL,
    year int4 NOT NULL,
    price numeric NOT NULL,
    image_url text[] NULL,  -- مصفوفة نصوص (كما كان أصلاً)
    color text NULL,
    mileage numeric NULL,
    fuel_type text NULL,
    transmission text NULL DEFAULT 'أوتوماتيك',
    status text NULL DEFAULT 'available',
    seller_id uuid NULL,
    description text NULL,
    technical_report_url text NULL,
    registration_image_url text NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

-- جدول العملاء
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    full_name text NOT NULL,
    phone_number varchar(20),
    national_id varchar(15) UNIQUE,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

-- جدول المستخدمين
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username text UNIQUE NOT NULL,
    password text NOT NULL,
    role varchar(20) DEFAULT 'admin',
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

-- جدول قواعد الأقساط الأصلية
CREATE TABLE installment_rules (
    id SERIAL PRIMARY KEY,
    name text NOT NULL,
    description text,
    min_amount decimal(12,2),
    max_amount decimal(12,2),
    down_payment_percentage decimal(5,2),
    monthly_payment_percentage decimal(5,2),
    term_months integer,
    interest_rate decimal(5,2),
    platform_fee decimal(12,2),
    status varchar(20) DEFAULT 'active',
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

-- جدول طلبات التمويل الأصلية
CREATE TABLE financing_requests (
    id SERIAL PRIMARY KEY,
    customer_id integer REFERENCES customers(id),
    car_id uuid REFERENCES car_showcase(id),
    down_payment numeric(12,2),
    final_payment numeric(12,2),
    monthly_payment numeric(12,2),
    financing_percentage numeric(5,2),
    term_months integer,
    status varchar(20) DEFAULT 'pending',
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

-- جدول العمليات المالية
CREATE TABLE finance_transactions (
    id SERIAL PRIMARY KEY,
    financing_request_id integer REFERENCES financing_requests(id),
    amount numeric(12,2),
    type varchar(20),
    paid_at timestamp DEFAULT CURRENT_TIMESTAMP
);

-- جدول المحافظ
CREATE TABLE wallets (
    id SERIAL PRIMARY KEY,
    user_id uuid NOT NULL,
    type varchar(20) NOT NULL,
    balance decimal(14,2) DEFAULT 0,
    status varchar(20) DEFAULT 'active',
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

-- جدول معاملات المحافظ
CREATE TABLE wallet_transactions (
    id SERIAL PRIMARY KEY,
    wallet_id integer REFERENCES wallets(id),
    type varchar(20) NOT NULL,
    amount decimal(14,2) NOT NULL,
    description text,
    reference_id uuid,
    status varchar(20) DEFAULT 'completed',
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 3. إضافة البيانات التجريبية الأصلية
-- =====================================================

-- إضافة سيارات أصلية
INSERT INTO car_showcase (make, model, year, price, image_url, color, mileage, fuel_type, description)
VALUES 
    ('تويوتا', 'كامري', 2024, 150000, ARRAY['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop'], 'أبيض', 0, 'بنزين', 'سيارة تويوتا كامري 2024 بحالة ممتازة'),
    ('مرسيدس', 'C-Class', 2024, 190000, ARRAY['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop'], 'أسود', 0, 'بنزين', 'مرسيدس C-Class 2024 فاخرة'),
    ('هيونداي', 'سوناتا', 2022, 82000, ARRAY['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop'], 'أسود', 10000, 'بنزين', 'هيونداي سوناتا 2022 اقتصادية'),
    ('هوندا', 'أكورد', 2023, 95000, ARRAY['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop'], 'فضي', 5000, 'هايبرد', 'هوندا أكورد 2023 هجينة');

-- إضافة عملاء
INSERT INTO customers (full_name, phone_number, national_id)
VALUES 
    ('عبدالله السالم', '0501234567', '1012345678'),
    ('سارة المانع', '0559876543', '1023456789');

-- إضافة مستخدمين
INSERT INTO users (username, password, role)
VALUES 
    ('admin', 'adminpass', 'admin'),
    ('tuser', 'traderpass', 'trader');

-- إضافة قواعد أقساط أصلية
INSERT INTO installment_rules (name, description, min_amount, max_amount, down_payment_percentage, monthly_payment_percentage, term_months, interest_rate, platform_fee)
VALUES 
    ('قاعدة أساسية', 'قاعدة التقسيط الأساسية', 50000, 200000, 20.0, 5.0, 24, 0.0, 1000),
    ('قاعدة متقدمة', 'قاعدة التقسيط للمبالغ الكبيرة', 200000, 500000, 30.0, 4.0, 36, 0.0, 2000);

-- إضافة طلبات تمويل تجريبية
INSERT INTO financing_requests (customer_id, car_id, down_payment, final_payment, monthly_payment, financing_percentage, term_months, status)
VALUES 
    (1, (SELECT id FROM car_showcase LIMIT 1), 30000, 30000, 3750, 60, 24, 'approved'),
    (2, (SELECT id FROM car_showcase OFFSET 1 LIMIT 1), 38000, 38000, 4750, 60, 24, 'approved');

-- إضافة محافظ تجريبية
INSERT INTO wallets (user_id, type, balance)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'buyer', 50000),
    ('00000000-0000-0000-0000-000000000002', 'platform', 1000000);

-- =====================================================
-- 4. إضافة Indexes للأداء
-- =====================================================

CREATE INDEX idx_car_showcase_seller ON car_showcase(seller_id);
CREATE INDEX idx_car_showcase_status ON car_showcase(status);
CREATE INDEX idx_car_showcase_price ON car_showcase(price);
CREATE INDEX idx_car_showcase_year ON car_showcase(year);

CREATE INDEX idx_financing_requests_customer ON financing_requests(customer_id);
CREATE INDEX idx_financing_requests_car ON financing_requests(car_id);
CREATE INDEX idx_financing_requests_status ON financing_requests(status);

CREATE INDEX idx_wallets_user_id ON wallets(user_id);
CREATE INDEX idx_wallets_type ON wallets(type);

-- =====================================================
-- 5. إضافة Triggers
-- =====================================================

-- Trigger لتحديث updated_at في جدول السيارات
CREATE OR REPLACE FUNCTION update_car_showcase_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_car_showcase_timestamp
    BEFORE UPDATE ON car_showcase
    FOR EACH ROW
    EXECUTE FUNCTION update_car_showcase_updated_at();

-- =====================================================
-- 6. إضافة Function لحساب الملخص المالي الأصلي
-- =====================================================

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
            COUNT(*) as total_requests,
            AVG(financing_percentage) as avg_financing
        FROM financing_requests fr
        WHERE fr.status = 'approved'
    ),
    car_costs AS (
        SELECT SUM(price) as total_car_cost
        FROM car_showcase
        WHERE status = 'available'
    )
    SELECT 
        s.total_monthly,
        s.total_monthly * 12 as total_annual_income,
        COALESCE(cc.total_car_cost, 0) as total_purchase_cost,
        (s.total_monthly * 12) - COALESCE(cc.total_car_cost, 0) as total_profit_full_period,
        CASE 
            WHEN COALESCE(cc.total_car_cost, 0) > 0 
            THEN ((s.total_monthly * 12) - COALESCE(cc.total_car_cost, 0)) / COALESCE(cc.total_car_cost, 0)
            ELSE 0 
        END as avg_roi_full_period,
        CASE 
            WHEN COALESCE(cc.total_car_cost, 0) > 0 
            THEN ((s.total_monthly * 12) - COALESCE(cc.total_car_cost, 0)) / COALESCE(cc.total_car_cost, 0) / 12
            ELSE 0 
        END as avg_roi_annual,
        s.total_down,
        s.total_final as total_last_payments_per_year,
        (s.total_monthly * 12) - COALESCE(cc.total_car_cost, 0) as total_annual_profit_before_costs
    FROM summary s, car_costs cc;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- تم استرجاع الإسكيم الأصلي بنجاح!
-- ===================================================== 