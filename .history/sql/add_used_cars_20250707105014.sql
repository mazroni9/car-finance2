-- Set client encoding to UTF8
SET client_encoding = 'UTF8';

-- إضافة سيارات مستعملة لمعرض mazbrothers
INSERT INTO car_showcase 
(make, model, year, price, color, mileage, fuel_type, transmission, status, seller_id, images)
VALUES 
-- 1. تويوتا كامري 2014
(N'تويوتا', N'كامري', 2014, 19500, N'فضي', 180000, N'بنزين', N'أوتوماتيك', 'available', '2bf61df6-da52-45f1-88c4-05316e51df04',
ARRAY['https://res.cloudinary.com/demo/image/upload/used-camry-2014.jpg']),

-- 2. هونداي سوناتا 2013
(N'هونداي', N'سوناتا', 2013, 17800, N'أسود', 200000, N'بنزين', N'أوتوماتيك', 'available', '2bf61df6-da52-45f1-88c4-05316e51df04',
ARRAY['https://res.cloudinary.com/demo/image/upload/used-sonata-2013.jpg']),

-- 3. نيسان التيما 2014
(N'نيسان', N'التيما', 2014, 18500, N'أبيض', 190000, N'بنزين', N'أوتوماتيك', 'available', '2bf61df6-da52-45f1-88c4-05316e51df04',
ARRAY['https://res.cloudinary.com/demo/image/upload/used-altima-2014.jpg']),

-- 4. فورد فيوجن 2012
(N'فورد', N'فيوجن', 2012, 15000, N'رمادي', 220000, N'بنزين', N'أوتوماتيك', 'available', '2bf61df6-da52-45f1-88c4-05316e51df04',
ARRAY['https://res.cloudinary.com/demo/image/upload/used-fusion-2012.jpg']),

-- 5. كيا اوبتيما 2013
(N'كيا', N'اوبتيما', 2013, 16500, N'أزرق', 195000, N'بنزين', N'أوتوماتيك', 'available', '2bf61df6-da52-45f1-88c4-05316e51df04',
ARRAY['https://res.cloudinary.com/demo/image/upload/used-optima-2013.jpg']),

-- 6. تويوتا كورولا 2014
(N'تويوتا', N'كورولا', 2014, 17000, N'أبيض', 175000, N'بنزين', N'أوتوماتيك', 'available', '2bf61df6-da52-45f1-88c4-05316e51df04',
ARRAY['https://res.cloudinary.com/demo/image/upload/used-corolla-2014.jpg']),

-- 7. هونداي النترا 2012
(N'هونداي', N'النترا', 2012, 14500, N'أحمر', 210000, N'بنزين', N'أوتوماتيك', 'available', '2bf61df6-da52-45f1-88c4-05316e51df04',
ARRAY['https://res.cloudinary.com/demo/image/upload/used-elantra-2012.jpg']),

-- 8. مازدا 6 2013
(N'مازدا', N'6', 2013, 16800, N'أسود', 185000, N'بنزين', N'أوتوماتيك', 'available', '2bf61df6-da52-45f1-88c4-05316e51df04',
ARRAY['https://res.cloudinary.com/demo/image/upload/used-mazda6-2013.jpg']),

-- 9. شيفروليه ماليبو 2014
(N'شيفروليه', N'ماليبو', 2014, 18000, N'فضي', 170000, N'بنزين', N'أوتوماتيك', 'available', '2bf61df6-da52-45f1-88c4-05316e51df04',
ARRAY['https://res.cloudinary.com/demo/image/upload/used-malibu-2014.jpg']),

-- 10. كرايسلر 300 2011
(N'كرايسلر', N'300', 2011, 20000, N'أسود', 230000, N'بنزين', N'أوتوماتيك', 'available', '2bf61df6-da52-45f1-88c4-05316e51df04',
ARRAY['https://res.cloudinary.com/demo/image/upload/used-chrysler300-2011.jpg']);

-- إضافة سجل في جدول المعاملات
INSERT INTO showroom_transactions (
    showroom_id,
    type,
    amount,
    description,
    status
) VALUES (
    '2bf61df6-da52-45f1-88c4-05316e51df04',
    'inventory_update',
    0,
    N'تم إضافة 10 سيارات مستعملة للمخزون',
    'completed'
); 