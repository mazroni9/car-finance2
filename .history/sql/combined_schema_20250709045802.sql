
-- sql/car_finance_schema.sql
-- إنشاء جدول العملاء
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    full_name TEXT NOT NULL,
    phone_number VARCHAR(20),
    national_id VARCHAR(15) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول السيارات (محدث)
DROP TABLE IF EXISTS cars;
CREATE TABLE car_showcase (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    make text NOT NULL,      -- الشركة المصنعة
    model text NOT NULL,     -- الموديل
    year int4 NOT NULL,      -- سنة الصنع
    price numeric NOT NULL,  -- السعر الأساسي
    image_url text NULL,     -- صورة رئيسية
    images text[] NULL,      -- روابط صور متعددة (Cloudinary)
    color text NULL,         -- اللون
    mileage numeric NULL,    -- المسافة المقطوعة
    fuel_type text NULL,     -- نوع الوقود
    transmission text NULL DEFAULT 'أوتوماتيك'::text,
    status text NULL DEFAULT 'available'::text,
    seller_id uuid NULL,     -- معرف المعرض
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

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

-- جدول طلبات التمويل (تحديث المرجع للسيارات)
CREATE TABLE financing_requests (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    car_id uuid REFERENCES car_showcase(id),  -- تحديث نوع المعرف
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
INSERT INTO car_showcase (make, model, year, price, image_url, images, color, mileage, fuel_type)
VALUES 
  ('Toyota', 'Camry', 2021, 75000, 'https://example.com/camry.jpg', ARRAY['https://example.com/camry1.jpg', 'https://example.com/camry2.jpg'], 'أبيض', 15000, 'بنزين'),
  ('Hyundai', 'Sonata', 2022, 82000, 'https://example.com/sonata.jpg', ARRAY['https://example.com/sonata1.jpg', 'https://example.com/sonata2.jpg'], 'أسود', 10000, 'بنزين'),
  ('Honda', 'Accord', 2023, 95000, 'https://example.com/accord.jpg', ARRAY['https://example.com/accord1.jpg', 'https://example.com/accord2.jpg'], 'فضي', 5000, 'هايبرد'),
  ('Hyundai', 'Elantra', 2022, 68000, 'https://example.com/elantra.jpg', ARRAY['https://example.com/elantra1.jpg', 'https://example.com/elantra2.jpg'], 'أحمر', 20000, 'بنزين');

-- بيانات أولية لطلبات التمويل
INSERT INTO financing_requests (customer_id, car_id, down_payment, final_payment, monthly_payment, financing_percentage, term_months)
VALUES 
  (1, '00000000-0000-0000-0000-000000000001', 15000, 10000, 2000, 50.00, 24),
  (2, '00000000-0000-0000-0000-000000000002', 18000, 12000, 2500, 40.00, 30);

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

-- تحديث function لحساب الملخص المالي
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
            SUM(price) as total_cost,  -- تحديث للتناسب مع الجدول الجديد
            COUNT(*) as total_requests,
            AVG(financing_percentage) as avg_financing
        FROM financing_requests fr
        JOIN car_showcase c ON fr.car_id = c.id
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


-- sql/car_showcase_schema.sql
-- حذف الجدول إذا كان موجوداً
DROP TABLE IF EXISTS public.car_showcase;

-- إنشاء الجدول من جديد
CREATE TABLE public.car_showcase (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    make text NOT NULL,      -- الشركة المصنعة
    model text NOT NULL,     -- الموديل
    year int4 NOT NULL,      -- سنة الصنع
    price numeric NOT NULL,  -- السعر الأساسي
    image_url text NULL,     -- صورة رئيسية
    images text[] NULL,      -- روابط صور متعددة (Cloudinary)
    color text NULL,         -- اللون
    mileage numeric NULL,    -- المسافة المقطوعة
    fuel_type text NULL,     -- نوع الوقود
    transmission text NULL DEFAULT 'أوتوماتيك'::text,
    status text NULL DEFAULT 'available'::text,
    seller_id uuid NULL,     -- معرف المعرض
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

-- إضافة تعليقات توضيحية
COMMENT ON TABLE public.car_showcase IS 'جدول عرض السيارات المتاحة في المنصة';
COMMENT ON COLUMN public.car_showcase.id IS 'معرف فريد للسيارة';
COMMENT ON COLUMN public.car_showcase.make IS 'الشركة المصنعة للسيارة';
COMMENT ON COLUMN public.car_showcase.model IS 'موديل السيارة';
COMMENT ON COLUMN public.car_showcase.year IS 'سنة صنع السيارة';
COMMENT ON COLUMN public.car_showcase.price IS 'السعر الأساسي للسيارة';
COMMENT ON COLUMN public.car_showcase.image_url IS 'رابط الصورة الرئيسية';
COMMENT ON COLUMN public.car_showcase.images IS 'مصفوفة روابط الصور من Cloudinary';
COMMENT ON COLUMN public.car_showcase.seller_id IS 'معرف المعرض البائع';

-- إضافة Indexes للبحث السريع
CREATE INDEX idx_car_showcase_seller ON public.car_showcase(seller_id);
CREATE INDEX idx_car_showcase_status ON public.car_showcase(status);
CREATE INDEX idx_car_showcase_price ON public.car_showcase(price);
CREATE INDEX idx_car_showcase_year ON public.car_showcase(year);

-- إضافة Trigger لتحديث updated_at
CREATE OR REPLACE FUNCTION update_car_showcase_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_car_showcase_timestamp
    BEFORE UPDATE ON public.car_showcase
    FOR EACH ROW
    EXECUTE FUNCTION update_car_showcase_updated_at();

-- إدخال البيانات التي تم إضافتها مسبقاً
INSERT INTO public.car_showcase 
(make, model, year, price, color, mileage, fuel_type, images, seller_id)
VALUES 
('تويوتا', 'كامري', 2024, 150000, 'أبيض', 0, 'بنزين', 
 ARRAY['https://res.cloudinary.com/demo/image/upload/bmw-1.jpg', 'https://res.cloudinary.com/demo/image/upload/bmw-2.jpg'],
 NULL),
('مرسيدس', 'C-Class', 2024, 190000, 'أسود', 0, 'بنزين',
 ARRAY['https://res.cloudinary.com/demo/image/upload/mercedes-1.jpg', 'https://res.cloudinary.com/demo/image/upload/mercedes-2.jpg'],
 NULL);

-- Function لربط السيارات بمعرض معين
CREATE OR REPLACE FUNCTION link_cars_to_showroom(showroom_uuid uuid)
RETURNS void AS $$
BEGIN
    UPDATE public.car_showcase
    SET seller_id = showroom_uuid
    WHERE seller_id IS NULL;
    
    INSERT INTO showroom_transactions (
        showroom_id,
        type,
        amount,
        description,
        status
    ) VALUES (
        showroom_uuid,
        'inventory_update',
        0,
        'تم إضافة سيارات جديدة للمخزون',
        'completed'
    );
END;
$$ LANGUAGE plpgsql; 

-- sql/installment_rules_schema.sql
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


-- sql/dealer_wallets_schema.sql
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create dealer wallets table
CREATE TABLE IF NOT EXISTS dealer_wallets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    dealer_id UUID REFERENCES users(id),
    balance DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create dealer transactions table
CREATE TABLE IF NOT EXISTS dealer_transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    wallet_id UUID REFERENCES dealer_wallets(id),
    amount DECIMAL(12,2) NOT NULL,
    type TEXT CHECK (type IN ('credit', 'debit')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for dealer_wallets
CREATE TRIGGER update_dealer_wallets_updated_at
    BEFORE UPDATE ON dealer_wallets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to update wallet balance
CREATE OR REPLACE FUNCTION update_wallet_balance()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.type = 'credit' THEN
        UPDATE dealer_wallets
        SET balance = balance + NEW.amount
        WHERE id = NEW.wallet_id;
    ELSIF NEW.type = 'debit' THEN
        UPDATE dealer_wallets
        SET balance = balance - NEW.amount
        WHERE id = NEW.wallet_id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for automatic balance update
CREATE TRIGGER update_wallet_balance_on_transaction
    AFTER INSERT ON dealer_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_wallet_balance();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_dealer_wallets_dealer_id ON dealer_wallets(dealer_id);
CREATE INDEX IF NOT EXISTS idx_dealer_transactions_wallet_id ON dealer_transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_dealer_transactions_created_at ON dealer_transactions(created_at); 

-- sql/wallets_schema.sql
-- جدول المحافظ الرئيسية
CREATE TABLE IF NOT EXISTS wallets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    balance DECIMAL(12,2) DEFAULT 0,
    currency TEXT DEFAULT 'SAR',
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'closed')),
    type TEXT NOT NULL CHECK (type IN ('personal', 'business', 'showroom', 'platform', 'system')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- إنشاء Indexes للبحث السريع
CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_wallets_type ON wallets(type);
CREATE INDEX IF NOT EXISTS idx_wallets_status ON wallets(status);
CREATE INDEX IF NOT EXISTS idx_wallets_created_at ON wallets(created_at);

-- Trigger لتحديث updated_at
CREATE OR REPLACE FUNCTION update_wallets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_wallets_timestamp
    BEFORE UPDATE ON wallets
    FOR EACH ROW
    EXECUTE FUNCTION update_wallets_updated_at();

-- دالة لزيادة رصيد المحفظة
CREATE OR REPLACE FUNCTION increment_wallet_balance(p_user_id UUID, p_amount DECIMAL)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE wallets
    SET balance = balance + p_amount
    WHERE user_id = p_user_id AND status = 'active';
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- دالة لخصم رصيد المحفظة
CREATE OR REPLACE FUNCTION decrement_wallet_balance(p_user_id UUID, p_amount DECIMAL)
RETURNS BOOLEAN AS $$
DECLARE
    current_balance DECIMAL;
BEGIN
    -- التحقق من الرصيد الحالي
    SELECT balance INTO current_balance
    FROM wallets
    WHERE user_id = p_user_id AND status = 'active';
    
    IF current_balance IS NULL OR current_balance < p_amount THEN
        RETURN FALSE;
    END IF;
    
    -- خصم المبلغ
    UPDATE wallets
    SET balance = balance - p_amount
    WHERE user_id = p_user_id AND status = 'active';
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- إدخال محافظ افتراضية للنظام
INSERT INTO wallets (
    id,
    user_id,
    balance,
    type,
    status
) VALUES 
    ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 1000000, 'system', 'active'),
    ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 500000, 'platform', 'active'),
    ('2bf61df6-da52-45f1-88c4-05316e51df04', '2bf61df6-da52-45f1-88c4-05316e51df04', 250000, 'showroom', 'active')
ON CONFLICT (id) DO NOTHING; 

-- sql/settlements_schema.sql
-- جدول التسويات المالية
CREATE TABLE IF NOT EXISTS settlements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('car_sale', 'commission', 'transfer_fee', 'refund', 'platform_fee', 'showroom_fee')),
    amount DECIMAL(12,2) NOT NULL,
    from_wallet UUID NOT NULL,
    to_wallet UUID NOT NULL,
    car_id UUID REFERENCES car_showcase(id),
    buyer_id UUID REFERENCES users(id),
    seller_id UUID REFERENCES users(id),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    completed_at TIMESTAMP WITH TIME ZONE,
    failed_reason TEXT,
    transaction_hash TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- إنشاء Indexes للبحث السريع
CREATE INDEX IF NOT EXISTS idx_settlements_type ON settlements(type);
CREATE INDEX IF NOT EXISTS idx_settlements_status ON settlements(status);
CREATE INDEX IF NOT EXISTS idx_settlements_created_at ON settlements(created_at);
CREATE INDEX IF NOT EXISTS idx_settlements_from_wallet ON settlements(from_wallet);
CREATE INDEX IF NOT EXISTS idx_settlements_to_wallet ON settlements(to_wallet);
CREATE INDEX IF NOT EXISTS idx_settlements_car_id ON settlements(car_id);

-- Trigger لتحديث updated_at
CREATE OR REPLACE FUNCTION update_settlements_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_settlements_timestamp
    BEFORE UPDATE ON settlements
    FOR EACH ROW
    EXECUTE FUNCTION update_settlements_updated_at();

-- دالة لإكمال التسوية
CREATE OR REPLACE FUNCTION complete_settlement(settlement_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    settlement_record settlements%ROWTYPE;
    from_wallet_record wallets%ROWTYPE;
    to_wallet_record wallets%ROWTYPE;
BEGIN
    -- الحصول على بيانات التسوية
    SELECT * INTO settlement_record
    FROM settlements
    WHERE id = settlement_id AND status = 'pending';
    
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- الحصول على بيانات المحفظة المرسلة
    SELECT * INTO from_wallet_record
    FROM wallets
    WHERE id = settlement_record.from_wallet;
    
    -- الحصول على بيانات المحفظة المستقبلة
    SELECT * INTO to_wallet_record
    FROM wallets
    WHERE id = settlement_record.to_wallet;
    
    -- التحقق من رصيد المحفظة المرسلة
    IF from_wallet_record.balance < settlement_record.amount THEN
        -- تحديث حالة التسوية إلى فشل
        UPDATE settlements
        SET status = 'failed', failed_reason = 'رصيد غير كافي'
        WHERE id = settlement_id;
        RETURN FALSE;
    END IF;
    
    -- خصم المبلغ من المحفظة المرسلة
    UPDATE wallets
    SET balance = balance - settlement_record.amount
    WHERE id = settlement_record.from_wallet;
    
    -- إضافة المبلغ إلى المحفظة المستقبلة
    UPDATE wallets
    SET balance = balance + settlement_record.amount
    WHERE id = settlement_record.to_wallet;
    
    -- تحديث حالة التسوية إلى مكتمل
    UPDATE settlements
    SET status = 'completed', completed_at = TIMEZONE('utc'::text, NOW())
    WHERE id = settlement_id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- دالة لإلغاء التسوية
CREATE OR REPLACE FUNCTION cancel_settlement(settlement_id UUID, reason TEXT DEFAULT 'تم الإلغاء من قبل المستخدم')
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE settlements
    SET status = 'cancelled', failed_reason = reason
    WHERE id = settlement_id AND status = 'pending';
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- دالة لحساب ملخص التسويات
CREATE OR REPLACE FUNCTION get_settlements_summary()
RETURNS TABLE (
    total_settlements BIGINT,
    total_amount DECIMAL,
    pending_amount DECIMAL,
    completed_amount DECIMAL,
    failed_amount DECIMAL,
    today_settlements BIGINT,
    today_amount DECIMAL,
    monthly_settlements BIGINT,
    monthly_amount DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*)::BIGINT as total_settlements,
        COALESCE(SUM(amount), 0) as total_amount,
        COALESCE(SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END), 0) as pending_amount,
        COALESCE(SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END), 0) as completed_amount,
        COALESCE(SUM(CASE WHEN status = 'failed' THEN amount ELSE 0 END), 0) as failed_amount,
        COUNT(CASE WHEN created_at >= CURRENT_DATE THEN 1 END)::BIGINT as today_settlements,
        COALESCE(SUM(CASE WHEN created_at >= CURRENT_DATE THEN amount ELSE 0 END), 0) as today_amount,
        COUNT(CASE WHEN created_at >= DATE_TRUNC('month', CURRENT_DATE) THEN 1 END)::BIGINT as monthly_settlements,
        COALESCE(SUM(CASE WHEN created_at >= DATE_TRUNC('month', CURRENT_DATE) THEN amount ELSE 0 END), 0) as monthly_amount
    FROM settlements;
END;
$$ LANGUAGE plpgsql;

-- إدخال بيانات تجريبية للتسويات
INSERT INTO settlements (
    type,
    amount,
    from_wallet,
    to_wallet,
    description,
    status
) VALUES 
    ('car_sale', 50000, '2bf61df6-da52-45f1-88c4-05316e51df04', '00000000-0000-0000-0000-000000000001', 'بيع سيارة تويوتا كامري 2021', 'completed'),
    ('commission', 2500, '00000000-0000-0000-0000-000000000001', '2bf61df6-da52-45f1-88c4-05316e51df04', 'عمولة بيع السيارة', 'completed'),
    ('transfer_fee', 1000, '00000000-0000-0000-0000-000000000001', '2bf61df6-da52-45f1-88c4-05316e51df04', 'رسوم نقل الملكية', 'pending'),
    ('platform_fee', 1500, '2bf61df6-da52-45f1-88c4-05316e51df04', '00000000-0000-0000-0000-000000000002', 'رسوم المنصة', 'completed'),
    ('refund', 5000, '2bf61df6-da52-45f1-88c4-05316e51df04', '00000000-0000-0000-0000-000000000001', 'استرداد مبلغ', 'pending'); 

-- sql/check_mazbrothers.sql
-- 1. التحقق من وجود المستخدم mazbrothers
DO $$ 
BEGIN
    -- التحقق من وجود المستخدم
    IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'mazbrothers') THEN
        -- إنشاء المستخدم إذا لم يكن موجوداً
        INSERT INTO users (
            id,
            username,
            role,
            status,
            email,
            created_at
        ) VALUES (
            '2bf61df6-da52-45f1-88c4-05316e51df04'::uuid, -- معرف المعرض الفعلي
            'mazbrothers',
            'showroom',
            'active',
            'info@mazbrothers.com',
            CURRENT_TIMESTAMP
        );

        -- إنشاء محفظة للمعرض
        INSERT INTO wallets (
            user_id,
            balance,
            status,
            type
        ) VALUES (
            '2bf61df6-da52-45f1-88c4-05316e51df04'::uuid,
            0,
            'active',
            'showroom'
        );

        RAISE NOTICE 'تم إنشاء حساب ومحفظة معرض mazbrothers بنجاح';
    ELSE
        RAISE NOTICE 'معرض mazbrothers موجود بالفعل';
    END IF;
END $$; 
