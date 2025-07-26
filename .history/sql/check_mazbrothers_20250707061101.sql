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
            '550e8400-e29b-41d4-a716-446655440000'::uuid, -- معرف ثابت للمعرض
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
            '550e8400-e29b-41d4-a716-446655440000'::uuid,
            0,
            'active',
            'showroom'
        );

        RAISE NOTICE 'تم إنشاء حساب ومحفظة معرض mazbrothers بنجاح';
    ELSE
        RAISE NOTICE 'معرض mazbrothers موجود بالفعل';
    END IF;
END $$; 