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