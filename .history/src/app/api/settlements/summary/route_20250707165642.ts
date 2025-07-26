import { NextResponse } from 'next/server';
import { supabase } from '@/lib/services/supabase';
import { checkRateLimit } from '@/lib/rate-limit';
import type { SettlementSummary } from '@/types/settlement';

export async function GET(request: Request) {
  try {
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
    const isAllowed = await checkRateLimit(clientIP);
    if (!isAllowed) {
      return NextResponse.json(
        { error: 'عدد طلبات كثير جداً، حاول مرة أخرى بعد دقيقة' },
        { status: 429 }
      );
    }

    // الحصول على جميع التسويات
    const { data: settlements, error } = await supabase
      .from('settlements')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching settlements:', error);
      return NextResponse.json(
        { error: 'فشل في جلب بيانات التسويات' },
        { status: 500 }
      );
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // حساب الإحصائيات
    const summary: SettlementSummary = {
      total_settlements: settlements?.length || 0,
      total_amount: 0,
      pending_amount: 0,
      completed_amount: 0,
      failed_amount: 0,
      today_settlements: 0,
      today_amount: 0,
      monthly_settlements: 0,
      monthly_amount: 0,
    };

    settlements?.forEach((settlement) => {
      const amount = settlement.amount || 0;
      const createdAt = new Date(settlement.created_at);
      
      // إجمالي المبالغ
      summary.total_amount += amount;
      
      // حسب الحالة
      switch (settlement.status) {
        case 'pending':
          summary.pending_amount += amount;
          break;
        case 'completed':
          summary.completed_amount += amount;
          break;
        case 'failed':
          summary.failed_amount += amount;
          break;
      }
      
      // تسويات اليوم
      if (createdAt >= today) {
        summary.today_settlements++;
        summary.today_amount += amount;
      }
      
      // تسويات الشهر
      if (createdAt >= monthStart) {
        summary.monthly_settlements++;
        summary.monthly_amount += amount;
      }
    });

    return NextResponse.json(summary);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ غير متوقع' },
      { status: 500 }
    );
  }
} 