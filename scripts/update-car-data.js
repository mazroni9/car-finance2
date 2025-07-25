const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://uhdopxhxmrxwystnbmmp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoZG9weGh4bXJ4d3lzdG5ibW1wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDQxMzU5NywiZXhwIjoyMDY1OTg5NTk3fQ.VtG_dOMBD-_k8AVZVBP7Ch_cEpa9HQcKhqhS6K7IoEE';
const supabase = createClient(supabaseUrl, supabaseKey);

async function updateCarData() {
    try {
        console.log('🔧 جاري تحديث بيانات السيارات...');

        // حذف جميع السيارات الموجودة
        const { error: deleteError } = await supabase
            .from('car_showcase')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000'); // حذف جميع السيارات

        if (deleteError) {
            console.error('❌ خطأ في حذف السيارات:', deleteError);
            return;
        }

        console.log('✅ تم حذف السيارات القديمة');

        // إضافة سيارات جديدة مع روابط صور صحيحة
        const newCars = [
            {
                make: 'تويوتا',
                model: 'كامري',
                year: 2024,
                price: 150000,
                image_url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
                images: [
                    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
                    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop'
                ],
                color: 'أبيض',
                mileage: 0,
                fuel_type: 'بنزين',
                transmission: 'أوتوماتيك',
                status: 'available',
                description: 'سيارة تويوتا كامري 2024 بحالة ممتازة'
            },
            {
                make: 'مرسيدس',
                model: 'C-Class',
                year: 2024,
                price: 190000,
                image_url: 'https://images.unsplash.com/photo-1618843479618-39b0c7b2a8a8?w=800&h=600&fit=crop',
                images: [
                    'https://images.unsplash.com/photo-1618843479618-39b0c7b2a8a8?w=800&h=600&fit=crop',
                    'https://images.unsplash.com/photo-1618843479618-39b0c7b2a8a8?w=800&h=600&fit=crop'
                ],
                color: 'أسود',
                mileage: 0,
                fuel_type: 'بنزين',
                transmission: 'أوتوماتيك',
                status: 'available',
                description: 'مرسيدس C-Class 2024 فاخرة'
            },
            {
                make: 'هيونداي',
                model: 'سوناتا',
                year: 2022,
                price: 82000,
                image_url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop',
                images: [
                    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop',
                    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop'
                ],
                color: 'أسود',
                mileage: 10000,
                fuel_type: 'بنزين',
                transmission: 'أوتوماتيك',
                status: 'available',
                description: 'هيونداي سوناتا 2022 اقتصادية'
            },
            {
                make: 'هوندا',
                model: 'أكورد',
                year: 2023,
                price: 95000,
                image_url: 'https://images.unsplash.com/photo-1618843479618-39b0c7b2a8a8?w=800&h=600&fit=crop',
                images: [
                    'https://images.unsplash.com/photo-1618843479618-39b0c7b2a8a8?w=800&h=600&fit=crop',
                    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop'
                ],
                color: 'فضي',
                mileage: 5000,
                fuel_type: 'هايبرد',
                transmission: 'أوتوماتيك',
                status: 'available',
                description: 'هوندا أكورد 2023 هجينة'
            }
        ];

        // إضافة السيارات الجديدة
        const { data: cars, error: insertError } = await supabase
            .from('car_showcase')
            .insert(newCars)
            .select();

        if (insertError) {
            console.error('❌ خطأ في إضافة السيارات:', insertError);
            return;
        }

        console.log('✅ تم إضافة السيارات الجديدة بنجاح:', cars.length);
        console.log('✅ جميع السيارات تستخدم الآن روابط صور صحيحة من Unsplash');

    } catch (error) {
        console.error('❌ حدث خطأ:', error);
    }
}

updateCarData(); 