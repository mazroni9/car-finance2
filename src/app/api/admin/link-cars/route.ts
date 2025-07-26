import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { linkCarsToMazbrothers } from '@/lib/db/link-cars';

export async function GET() {
    const supabase = createClient();
    try {
        // 1. التحقق من السيارات قبل الربط
        const { data: beforeCars } = await supabase
            .from('car_showcase')
            .select('*')
            .is('seller_id', null);

        const carsBeforeCount = beforeCars?.length || 0;

        // 2. تنفيذ عملية الربط
        await linkCarsToMazbrothers();

        // 3. التحقق من السيارات بعد الربط
        const { data: afterCars } = await supabase
            .from('car_showcase')
            .select('*')
            .eq('seller_id', '2bf61df6-da52-45f1-88c4-05316e51df04');

        const carsAfterCount = afterCars?.length || 0;

        // 4. جلب آخر المعاملات
        const { data: transactions } = await supabase
            .from('showroom_transactions')
            .select('*')
            .eq('showroom_id', '2bf61df6-da52-45f1-88c4-05316e51df04')
            .order('created_at', { ascending: false })
            .limit(1);

        return NextResponse.json({
            success: true,
            details: {
                before: {
                    unlinkedCars: carsBeforeCount,
                    message: `عدد السيارات غير المرتبطة قبل العملية: ${carsBeforeCount}`
                },
                after: {
                    linkedCars: carsAfterCount,
                    message: `عدد السيارات المرتبطة بعد العملية: ${carsAfterCount}`
                },
                changes: {
                    count: carsAfterCount - carsBeforeCount,
                    message: `تم ربط ${carsAfterCount - carsBeforeCount} سيارة`
                },
                lastTransaction: transactions?.[0] || null
            },
            message: 'تم تنفيذ العملية بنجاح'
        });
    } catch (error) {
        console.error('خطأ في ربط السيارات:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: error instanceof Error ? error.message : 'حدث خطأ غير معروف',
                message: 'حدث خطأ أثناء ربط السيارات'
            },
            { status: 500 }
        );
    }
} 