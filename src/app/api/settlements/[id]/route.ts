import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkRateLimit } from '@/lib/rate-limit';

// الحصول على تفاصيل تسوية واحدة
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  try {
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
    const isAllowed = await checkRateLimit(clientIP);
    if (!isAllowed) {
      return NextResponse.json(
        { error: 'عدد طلبات كثير جداً، حاول مرة أخرى بعد دقيقة' },
        { status: 429 }
      );
    }

    const { data, error } = await supabase
      .from('settlements')
      .select(`
        *,
        car_showcase!inner(
          make,
          model,
          year,
          price
        )
      `)
      .eq('id', params.id)
      .single();

    if (error) {
      console.error('Error fetching settlement:', error);
      return NextResponse.json(
        { error: 'فشل في جلب تفاصيل التسوية' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ غير متوقع' },
      { status: 500 }
    );
  }
}

// إكمال تسوية
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  try {
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
    const isAllowed = await checkRateLimit(clientIP);
    if (!isAllowed) {
      return NextResponse.json(
        { error: 'عدد طلبات كثير جداً، حاول مرة أخرى بعد دقيقة' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { action } = body;

    if (action === 'complete') {
      // استدعاء دالة إكمال التسوية
      const { data, error } = await supabase.rpc('complete_settlement', {
        settlement_id: params.id
      });

      if (error) {
        console.error('Error completing settlement:', error);
        return NextResponse.json(
          { error: 'فشل في إكمال التسوية' },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, message: 'تم إكمال التسوية بنجاح' });
    }

    if (action === 'cancel') {
      const { reason } = body;
      
      // استدعاء دالة إلغاء التسوية
      const { data, error } = await supabase.rpc('cancel_settlement', {
        settlement_id: params.id,
        reason: reason || 'تم الإلغاء من قبل المستخدم'
      });

      if (error) {
        console.error('Error cancelling settlement:', error);
        return NextResponse.json(
          { error: 'فشل في إلغاء التسوية' },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, message: 'تم إلغاء التسوية بنجاح' });
    }

    return NextResponse.json(
      { error: 'إجراء غير معروف' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ غير متوقع' },
      { status: 500 }
    );
  }
} 