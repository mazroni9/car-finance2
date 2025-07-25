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