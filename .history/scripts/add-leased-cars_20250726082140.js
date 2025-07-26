const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://uhdopxhxmrxwystnbmmp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoZG9weGh4bXJ4d3lzdG5ibW1wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDQxMzU5NywiZXhwIjoyMDY1OTg5NTk3fQ.VtG_dOMBD-_k8AVZVBP7Ch_cEpa9HQcKhqhS6K7IoEE';
const supabase = createClient(supabaseUrl, supabaseKey);

async function addLeasedCars() {
    try {
        console.log('🚗 إضافة سيارات مؤجرة للاختبار...\n');

        // إضافة سيارات مؤجرة
        const leasedCars = [
            {
                make: 'تويوتا',
                model: 'كامري',
                year: 2022,
                price: 120000,
                color: 'أبيض',
                mileage: 15000,
                fuel_type: 'بنزين',
                transmission: 'أوتوماتيك',
                status: 'leased',
                seller_id: '2bf61df6-da52-45f1-88c4-05316e51df04',
                description: 'سيارة مؤجرة - عقد إيجار سنوي'
            },
            {
                make: 'هونداي',
                model: 'سوناتا',
                year: 2021,
                price: 95000,
                color: 'أسود',
                mileage: 25000,
                fuel_type: 'بنزين',
                transmission: 'أوتوماتيك',
                status: 'leased',
                seller_id: '2bf61df6-da52-45f1-88c4-05316e51df04',
                description: 'سيارة مؤجرة - عقد إيجار 6 أشهر'
            },
            {
                make: 'نيسان',
                model: 'التيما',
                year: 2023,
                price: 110000,
                color: 'رمادي',
                mileage: 8000,
                fuel_type: 'بنزين',
                transmission: 'أوتوماتيك',
                status: 'leased',
                seller_id: '2bf61df6-da52-45f1-88c4-05316e51df04',
                description: 'سيارة مؤجرة - عقد إيجار سنوي'
            },
            {
                make: 'كيا',
                model: 'اوبتيما',
                year: 2022,
                price: 85000,
                color: 'أزرق',
                mileage: 18000,
                fuel_type: 'بنزين',
                transmission: 'أوتوماتيك',
                status: 'leased',
                seller_id: '2bf61df6-da52-45f1-88c4-05316e51df04',
                description: 'سيارة مؤجرة - عقد إيجار 9 أشهر'
            },
            {
                make: 'فورد',
                model: 'فيوجن',
                year: 2021,
                price: 78000,
                color: 'أبيض',
                mileage: 32000,
                fuel_type: 'بنزين',
                transmission: 'أوتوماتيك',
                status: 'leased',
                seller_id: '2bf61df6-da52-45f1-88c4-05316e51df04',
                description: 'سيارة مؤجرة - عقد إيجار سنوي'
            }
        ];

        // إضافة السيارات المؤجرة
        const { data: cars, error: carsError } = await supabase
            .from('car_showcase')
            .insert(leasedCars)
            .select();

        if (carsError) {
            console.error('❌ خطأ في إضافة السيارات المؤجرة:', carsError);
            return;
        }

        console.log(`✅ تم إضافة ${cars.length} سيارة مؤجرة بنجاح`);

        // التحقق من عدد السيارات المؤجرة
        const { count: leasedCount, error: countError } = await supabase
            .from('car_showcase')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'leased');

        if (countError) {
            console.error('❌ خطأ في عد السيارات المؤجرة:', countError);
        } else {
            console.log(`📊 إجمالي عدد السيارات المؤجرة: ${leasedCount}`);
        }

        // إضافة سجل المعاملة
        const { error: transactionError } = await supabase
            .from('showroom_transactions')
            .insert({
                showroom_id: '2bf61df6-da52-45f1-88c4-05316e51df04',
                type: 'leasing_update',
                amount: 0,
                description: `تم إضافة ${cars.length} سيارة مؤجرة`,
                status: 'completed'
            });

        if (transactionError) {
            console.error('❌ خطأ في تسجيل المعاملة:', transactionError);
        } else {
            console.log('✅ تم تسجيل المعاملة بنجاح');
        }

        console.log('\n🎉 تم إضافة السيارات المؤجرة بنجاح!');

    } catch (error) {
        console.error('❌ خطأ غير متوقع:', error);
    }
}

// تشغيل السكريبت
addLeasedCars(); 