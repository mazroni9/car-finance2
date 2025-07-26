const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://uhdopxhxmrxwystnbmmp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoZG9weGh4bXJ4d3lzdG5ibW1wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDQxMzU5NywiZXhwIjoyMDY1OTg5NTk3fQ.VtG_dOMBD-_k8AVZVBP7Ch_cEpa9HQcKhqhS6K7IoEE';
const supabase = createClient(supabaseUrl, supabaseKey);

async function addFinancingData() {
    try {
        console.log('🔧 جاري إضافة بيانات التمويل التجريبية...');

        // جلب معرفات العملاء
        const { data: customers } = await supabase
            .from('customers')
            .select('id')
            .limit(2);

        // جلب معرفات السيارات
        const { data: cars } = await supabase
            .from('car_showcase')
            .select('id')
            .limit(4);

        if (!customers || customers.length === 0) {
            console.error('❌ لا يوجد عملاء في قاعدة البيانات');
            return;
        }

        if (!cars || cars.length === 0) {
            console.error('❌ لا توجد سيارات في قاعدة البيانات');
            return;
        }

        // بيانات التمويل التجريبية
        const financingRequests = [
            {
                customer_id: customers[0].id,
                car_id: cars[0].id,
                down_payment: 30000, // 20% من 150,000
                final_payment: 30000, // 20% من 150,000
                monthly_payment: 3750, // 90,000 / 24 شهر
                financing_percentage: 60, // 60% من سعر السيارة
                term_months: 24,
                status: 'approved'
            },
            {
                customer_id: customers[1]?.id || customers[0].id,
                car_id: cars[1]?.id || cars[0].id,
                down_payment: 57000, // 30% من 190,000
                final_payment: 38000, // 20% من 190,000
                monthly_payment: 3167, // 95,000 / 30 شهر
                financing_percentage: 50, // 50% من سعر السيارة
                term_months: 30,
                status: 'approved'
            },
            {
                customer_id: customers[0].id,
                car_id: cars[2]?.id || cars[0].id,
                down_payment: 16400, // 20% من 82,000
                final_payment: 16400, // 20% من 82,000
                monthly_payment: 2050, // 49,200 / 24 شهر
                financing_percentage: 60, // 60% من سعر السيارة
                term_months: 24,
                status: 'approved'
            },
            {
                customer_id: customers[1]?.id || customers[0].id,
                car_id: cars[3]?.id || cars[0].id,
                down_payment: 19000, // 20% من 95,000
                final_payment: 19000, // 20% من 95,000
                monthly_payment: 2375, // 57,000 / 24 شهر
                financing_percentage: 60, // 60% من سعر السيارة
                term_months: 24,
                status: 'approved'
            }
        ];

        // إضافة طلبات التمويل
        const { data: insertedRequests, error: insertError } = await supabase
            .from('financing_requests')
            .insert(financingRequests)
            .select();

        if (insertError) {
            console.error('❌ خطأ في إضافة طلبات التمويل:', insertError);
            return;
        }

        console.log('✅ تم إضافة طلبات التمويل بنجاح:', insertedRequests.length);

        // إضافة معاملات مالية تجريبية
        const financeTransactions = insertedRequests.map((request, index) => ({
            financing_request_id: request.id,
            amount: request.down_payment,
            type: 'down_payment',
            paid_at: new Date().toISOString()
        }));

        const { error: transactionError } = await supabase
            .from('finance_transactions')
            .insert(financeTransactions);

        if (transactionError) {
            console.error('❌ خطأ في إضافة المعاملات المالية:', transactionError);
        } else {
            console.log('✅ تم إضافة المعاملات المالية بنجاح');
        }

        console.log('✅ تم إضافة جميع بيانات التمويل التجريبية بنجاح');

    } catch (error) {
        console.error('❌ حدث خطأ:', error);
    }
}

addFinancingData(); 