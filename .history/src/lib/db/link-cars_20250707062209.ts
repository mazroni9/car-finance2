import { supabase } from '@/lib/supabase/client';

const MAZBROTHERS_ID = '2bf61df6-da52-45f1-88c4-05316e51df04';

export async function linkCarsToMazbrothers() {
    try {
        // 1. التحقق من وجود المعرض
        const { data: showroom, error: showroomError } = await supabase
            .from('users')
            .select('*')
            .eq('id', MAZBROTHERS_ID)
            .single();

        if (showroomError) {
            console.error('خطأ في التحقق من المعرض:', showroomError);
            return;
        }

        // 2. جلب السيارات غير المرتبطة
        const { data: cars, error: carsError } = await supabase
            .from('car_showcase')
            .select('*')
            .is('owner_id', null);

        if (carsError) {
            console.error('خطأ في جلب السيارات:', carsError);
            return;
        }

        console.log(`تم العثور على ${cars?.length || 0} سيارة غير مرتبطة`);

        // 3. تحديث السيارات
        if (cars && cars.length > 0) {
            const { error: updateError } = await supabase
                .from('car_showcase')
                .update({
                    owner_id: MAZBROTHERS_ID,
                    status: 'available',
                    updated_at: new Date().toISOString()
                })
                .is('owner_id', null);

            if (updateError) {
                console.error('خطأ في تحديث السيارات:', updateError);
                return;
            }

            // 4. تسجيل المعاملة
            const { error: transactionError } = await supabase
                .from('showroom_transactions')
                .insert({
                    showroom_id: MAZBROTHERS_ID,
                    type: 'inventory_update',
                    description: `تم إضافة ${cars.length} سيارة للمخزون`,
                    amount: 0,
                    status: 'completed'
                });

            if (transactionError) {
                console.error('خطأ في تسجيل المعاملة:', transactionError);
                return;
            }

            console.log(`✅ تم ربط ${cars.length} سيارة بمعرض mazbrothers بنجاح`);
        } else {
            console.log('لا توجد سيارات تحتاج للربط');
        }

    } catch (error) {
        console.error('خطأ غير متوقع:', error);
    }
} 