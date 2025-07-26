-- =====================================================
-- UNIFIED CAR FINANCE PLATFORM SCHEMA
-- =====================================================
-- هذا الملف يجمع جميع الإسكيمات في مكان واحد
-- تاريخ الإنشاء: 2025-01-XX
-- =====================================================

-- =====================================================
-- 1. جداول المستخدمين والصلاحيات
-- =====================================================

-- جدول المستخدمين
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول العملاء
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    full_name TEXT NOT NULL,
    phone_number VARCHAR(20),
    national_id VARCHAR(15) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 2. جداول السيارات والمعارض
-- =====================================================

-- جدول السيارات الرئيسي
DROP TABLE IF EXISTS car_showcase;
CREATE TABLE car_showcase (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    make text NOT NULL,      -- الشركة المصنعة
    model text NOT NULL,     -- الموديل
    year int4 NOT NULL,      -- سنة الصنع
    price numeric NOT NULL,  -- السعر الأساسي
    image_url text NULL,     -- صورة رئيسية (نص واحد)
    images text[] NULL,      -- روابط صور متعددة (Cloudinary)
    color text NULL,         -- اللون
    mileage numeric NULL,    -- المسافة المقطوعة
    fuel_type text NULL,     -- نوع الوقود
    transmission text NULL DEFAULT 'أوتوماتيك'::text,
    status text NULL DEFAULT 'available'::text,
    seller_id uuid NULL,     -- معرف المعرض
    description text NULL,   -- وصف السيارة
    technical_report_url text NULL, -- رابط التقرير الفني
    registration_image_url text NULL, -- صورة استمارة السيارة
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

-- إضافة تعليقات توضيحية
COMMENT ON TABLE car_showcase IS 'جدول عرض السيارات المتاحة في المنصة';
COMMENT ON COLUMN car_showcase.id IS 'معرف فريد للسيارة';
COMMENT ON COLUMN car_showcase.make IS 'الشركة المصنعة للسيارة';
COMMENT ON COLUMN car_showcase.model IS 'موديل السيارة';
COMMENT ON COLUMN car_showcase.year IS 'سنة صنع السيارة';
COMMENT ON COLUMN car_showcase.price IS 'السعر الأساسي للسيارة';
COMMENT ON COLUMN car_showcase.image_url IS 'رابط الصورة الرئيسية';
COMMENT ON COLUMN car_showcase.images IS 'مصفوفة روابط الصور من Cloudinary';
COMMENT ON COLUMN car_showcase.seller_id IS 'معرف المعرض البائع';

-- إضافة Indexes للبحث السريع
CREATE INDEX idx_car_showcase_seller ON car_showcase(seller_id);
CREATE INDEX idx_car_showcase_status ON car_showcase(status);
CREATE INDEX idx_car_showcase_price ON car_showcase(price);
CREATE INDEX idx_car_showcase_year ON car_showcase(year);

-- Trigger لتحديث updated_at
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
-- 3. جداول المحافظ والمعاملات المالية
-- =====================================================

-- جدول المحافظ
CREATE TABLE IF NOT EXISTS wallets (
    id SERIAL PRIMARY KEY,
    user_id uuid NOT NULL,
    type VARCHAR(20) NOT NULL, -- 'buyer', 'seller', 'platform', 'showroom'
    balance DECIMAL(14,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول معاملات المحافظ
CREATE TABLE IF NOT EXISTS wallet_transactions (
    id SERIAL PRIMARY KEY,
    wallet_id INTEGER REFERENCES wallets(id),
    type VARCHAR(20) NOT NULL, -- 'deposit', 'withdrawal', 'transfer', 'purchase'
    amount DECIMAL(14,2) NOT NULL,
    description TEXT,
    reference_id uuid, -- معرف مرجعي (مثل معرف السيارة)
    status VARCHAR(20) DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول محافظ المعارض
CREATE TABLE IF NOT EXISTS dealer_wallets (
    id SERIAL PRIMARY KEY,
    dealer_id uuid NOT NULL,
    balance DECIMAL(14,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول معاملات المعارض
CREATE TABLE IF NOT EXISTS dealer_transactions (
    id SERIAL PRIMARY KEY,
    wallet_id INTEGER REFERENCES dealer_wallets(id),
    type VARCHAR(20) NOT NULL, -- 'sale', 'purchase', 'commission', 'withdrawal'
    amount DECIMAL(14,2) NOT NULL,
    description TEXT,
    car_id uuid REFERENCES car_showcase(id),
    status VARCHAR(20) DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 4. جداول التمويل والتقسيط
-- =====================================================

-- جدول طلبات التمويل
CREATE TABLE IF NOT EXISTS financing_requests (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    car_id uuid REFERENCES car_showcase(id),
    down_payment NUMERIC(12,2),
    final_payment NUMERIC(12,2),
    monthly_payment NUMERIC(12,2),
    financing_percentage NUMERIC(5,2),
    term_months INTEGER,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول العمليات المالية
CREATE TABLE IF NOT EXISTS finance_transactions (
    id SERIAL PRIMARY KEY,
    financing_request_id INTEGER REFERENCES financing_requests(id),
    amount NUMERIC(12,2),
    type VARCHAR(20), -- installment / down_payment / final_payment
    paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول قواعد التقسيط
CREATE TABLE IF NOT EXISTS installment_rules (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    min_amount DECIMAL(12,2),
    max_amount DECIMAL(12,2),
    down_payment_percentage DECIMAL(5,2),
    monthly_payment_percentage DECIMAL(5,2),
    term_months INTEGER,
    interest_rate DECIMAL(5,2),
    platform_fee DECIMAL(12,2),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 5. جداول المستثمرين والاستثمارات
-- =====================================================

-- جدول المستثمرين
CREATE TABLE IF NOT EXISTS investors (
    id SERIAL PRIMARY KEY,
    full_name TEXT NOT NULL,
    phone_number VARCHAR(20),
    email TEXT UNIQUE,
    national_id VARCHAR(15) UNIQUE,
    wallet_balance NUMERIC(14,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول استثمار رأس المال
CREATE TABLE IF NOT EXISTS investment_cycles (
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
CREATE TABLE IF NOT EXISTS investor_profits (
    id SERIAL PRIMARY KEY,
    investment_id INTEGER REFERENCES investment_cycles(id),
    profit_amount NUMERIC(12,2),
    distributed_on DATE,
    reinvested BOOLEAN DEFAULT FALSE
);

-- =====================================================
-- 6. جداول الاشتراكات والخدمات
-- =====================================================

-- جدول اشتراكات المستخدمين
CREATE TABLE IF NOT EXISTS subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    plan_type VARCHAR(20), -- basic / trader_25 / trader_50 / trader_75 / trader_100 / showroom
    monthly_fee NUMERIC(8,2),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

-- =====================================================
-- 7. جداول التسويات والمدفوعات
-- =====================================================

-- جدول التسويات
CREATE TABLE IF NOT EXISTS settlements (
    id SERIAL PRIMARY KEY,
    type VARCHAR(20) NOT NULL, -- 'purchase', 'commission', 'refund'
    from_wallet INTEGER REFERENCES wallets(id),
    to_wallet INTEGER REFERENCES wallets(id),
    amount DECIMAL(14,2) NOT NULL,
    car_id uuid REFERENCES car_showcase(id),
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 8. جداول قواعد الأسعار والعمولات
-- =====================================================

-- جدول قواعد الأسعار
CREATE TABLE IF NOT EXISTS pricing_rules (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    min_price DECIMAL(12,2),
    max_price DECIMAL(12,2),
    platform_fee_percentage DECIMAL(5,2),
    showroom_fee DECIMAL(12,2),
    traffic_fee DECIMAL(12,2),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 9. FUNCTIONS و TRIGGERS
-- =====================================================

-- Function لتحديث رصيد المحفظة
CREATE OR REPLACE FUNCTION update_wallet_balance()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE wallets 
        SET balance = balance + NEW.amount,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.wallet_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE wallets 
        SET balance = balance - OLD.amount,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = OLD.wallet_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger لتحديث رصيد المحفظة
CREATE TRIGGER update_wallet_balance_on_transaction
    AFTER INSERT OR DELETE ON wallet_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_wallet_balance();

-- Function لتحديث رصيد محفظة المعرض
CREATE OR REPLACE FUNCTION update_dealer_wallet_balance()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE dealer_wallets 
        SET balance = balance + NEW.amount,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.wallet_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE dealer_wallets 
        SET balance = balance - OLD.amount,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = OLD.wallet_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger لتحديث رصيد محفظة المعرض
CREATE TRIGGER update_dealer_wallet_balance_on_transaction
    AFTER INSERT OR DELETE ON dealer_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_dealer_wallet_balance();

-- Function لربط السيارات بمعرض معين
CREATE OR REPLACE FUNCTION link_cars_to_showroom(showroom_uuid uuid)
RETURNS void AS $$
BEGIN
    UPDATE car_showcase
    SET seller_id = showroom_uuid
    WHERE seller_id IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Function لحساب الملخص المالي
DROP FUNCTION IF EXISTS get_financial_summary();
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
    )
    SELECT 
        s.total_monthly,
        s.total_monthly * 12 as total_annual_income,
        0 as total_purchase_cost, -- سيتم حسابها من جدول السيارات
        0 as total_profit_full_period,
        0 as avg_roi_full_period,
        0 as avg_roi_annual,
        s.total_down,
        0 as total_last_payments_per_year,
        0 as total_annual_profit_before_costs
    FROM summary s;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 10. بيانات تجريبية أولية
-- =====================================================

-- بيانات أولية للسيارات
INSERT INTO car_showcase (make, model, year, price, image_url, images, color, mileage, fuel_type, description)
VALUES 
  ('تويوتا', 'كامري', 2024, 150000, 'https://res.cloudinary.com/demo/image/upload/bmw-1.jpg', 
   ARRAY['https://res.cloudinary.com/demo/image/upload/bmw-1.jpg', 'https://res.cloudinary.com/demo/image/upload/bmw-2.jpg'],
   'أبيض', 0, 'بنزين', 'سيارة تويوتا كامري 2024 بحالة ممتازة'),
  ('مرسيدس', 'C-Class', 2024, 190000, 'https://res.cloudinary.com/demo/image/upload/mercedes-1.jpg',
   ARRAY['https://res.cloudinary.com/demo/image/upload/mercedes-1.jpg', 'https://res.cloudinary.com/demo/image/upload/mercedes-2.jpg'],
   'أسود', 0, 'بنزين', 'مرسيدس C-Class 2024 فاخرة'),
  ('هيونداي', 'سوناتا', 2022, 82000, 'https://example.com/sonata.jpg',
   ARRAY['https://example.com/sonata1.jpg', 'https://example.com/sonata2.jpg'],
   'أسود', 10000, 'بنزين', 'هيونداي سوناتا 2022 اقتصادية'),
  ('هوندا', 'أكورد', 2023, 95000, 'https://example.com/accord.jpg',
   ARRAY['https://example.com/accord1.jpg', 'https://example.com/accord2.jpg'],
   'فضي', 5000, 'هايبرد', 'هوندا أكورد 2023 هجينة');

-- بيانات أولية للعملاء
INSERT INTO customers (full_name, phone_number, national_id)
VALUES 
  ('عبدالله السالم', '0501234567', '1012345678'),
  ('سارة المانع', '0559876543', '1023456789');

-- بيانات أولية للمستخدمين
INSERT INTO users (username, password, role) VALUES
  ('admin', 'adminpass', 'admin'),
  ('tuser', 'traderpass', 'trader');

-- بيانات أولية للمستثمرين
INSERT INTO investors (full_name, phone_number, email, national_id, wallet_balance)
VALUES 
  ('محمد الزهراني', '0530001122', 'mzahrani@example.com', '1034567890', 100000),
  ('نورة العتيبي', '0549992211', 'nora@example.com', '1045678901', 75000);

-- بيانات أولية للمحافظ
INSERT INTO wallets (user_id, type, balance) VALUES
  ('00000000-0000-0000-0000-000000000001', 'buyer', 50000),
  ('00000000-0000-0000-0000-000000000002', 'platform', 1000000);

-- بيانات أولية لقواعد التقسيط
INSERT INTO installment_rules (name, description, min_amount, max_amount, down_payment_percentage, monthly_payment_percentage, term_months, interest_rate, platform_fee)
VALUES 
  ('قاعدة أساسية', 'قاعدة التقسيط الأساسية', 50000, 200000, 20.0, 5.0, 24, 0.0, 1000),
  ('قاعدة متقدمة', 'قاعدة التقسيط للمبالغ الكبيرة', 200000, 500000, 30.0, 4.0, 36, 0.0, 2000);

-- بيانات أولية لقواعد الأسعار
INSERT INTO pricing_rules (name, description, min_price, max_price, platform_fee_percentage, showroom_fee, traffic_fee)
VALUES 
  ('قاعدة السيارات الاقتصادية', 'للأسعار من 50,000 إلى 100,000', 50000, 100000, 2.0, 117, 383),
  ('قاعدة السيارات المتوسطة', 'للأسعار من 100,000 إلى 200,000', 100000, 200000, 2.5, 117, 383),
  ('قاعدة السيارات الفاخرة', 'للأسعار أكثر من 200,000', 200000, 1000000, 3.0, 117, 383);

-- =====================================================
-- 11. INDEXES إضافية للأداء
-- =====================================================

-- Indexes للمحافظ
CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_wallets_type ON wallets(type);
CREATE INDEX IF NOT EXISTS idx_wallets_status ON wallets(status);
CREATE INDEX IF NOT EXISTS idx_wallets_created_at ON wallets(created_at);

-- Indexes للمعاملات
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_wallet_id ON wallet_transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_type ON wallet_transactions(type);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_created_at ON wallet_transactions(created_at);

-- Indexes للمعارض
CREATE INDEX IF NOT EXISTS idx_dealer_wallets_dealer_id ON dealer_wallets(dealer_id);
CREATE INDEX IF NOT EXISTS idx_dealer_transactions_wallet_id ON dealer_transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_dealer_transactions_created_at ON dealer_transactions(created_at);

-- Indexes للتسويات
CREATE INDEX IF NOT EXISTS idx_settlements_type ON settlements(type);
CREATE INDEX IF NOT EXISTS idx_settlements_status ON settlements(status);
CREATE INDEX IF NOT EXISTS idx_settlements_created_at ON settlements(created_at);
CREATE INDEX IF NOT EXISTS idx_settlements_from_wallet ON settlements(from_wallet);
CREATE INDEX IF NOT EXISTS idx_settlements_to_wallet ON settlements(to_wallet);
CREATE INDEX IF NOT EXISTS idx_settlements_car_id ON settlements(car_id);

-- =====================================================
-- END OF UNIFIED SCHEMA
-- ===================================================== 