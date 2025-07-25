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