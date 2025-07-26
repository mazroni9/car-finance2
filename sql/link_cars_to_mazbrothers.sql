-- 2. ربط السيارات بمعرض mazbrothers
DO $$ 
DECLARE
    mazbrothers_id uuid := '2bf61df6-da52-45f1-88c4-05316e51df04'::uuid;
    cars_count int;
BEGIN
    -- التحقق من وجود المعرض
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = mazbrothers_id) THEN
        RAISE EXCEPTION 'معرض mazbrothers غير موجود!';
    END IF;

    -- عدد السيارات التي سيتم تحديثها
    SELECT COUNT(*)
    INTO cars_count
    FROM car_showcase
    WHERE owner_id IS NULL OR status IS NULL;

    -- تحديث السيارات غير المملوكة فقط
    UPDATE car_showcase
    SET 
        owner_id = mazbrothers_id,
        status = 'available',
        updated_at = CURRENT_TIMESTAMP
    WHERE owner_id IS NULL OR status IS NULL;

    -- تأكيد عدد السيارات التي تم تحديثها
    RAISE NOTICE 'تم ربط % سيارة بمعرض mazbrothers', cars_count;

    -- إضافة سجل في جدول المعاملات
    IF cars_count > 0 THEN
        INSERT INTO showroom_transactions (
            showroom_id,
            type,
            description,
            amount,
            status
        ) VALUES (
            mazbrothers_id,
            'inventory_update',
            format('تم إضافة %s سيارة للمخزون', cars_count),
            0,
            'completed'
        );
    END IF;

END $$; 