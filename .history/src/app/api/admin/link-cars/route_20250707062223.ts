import { NextResponse } from 'next/server';
import { linkCarsToMazbrothers } from '@/lib/db/link-cars';

export async function GET() {
    try {
        await linkCarsToMazbrothers();
        return NextResponse.json({ success: true, message: 'تم ربط السيارات بنجاح' });
    } catch (error) {
        console.error('خطأ في ربط السيارات:', error);
        return NextResponse.json(
            { success: false, message: 'حدث خطأ أثناء ربط السيارات' },
            { status: 500 }
        );
    }
} 