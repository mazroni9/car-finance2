const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://uhdopxhxmrxwystnbmmp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoZG9weGh4bXJ4d3lzdG5ibW1wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDQxMzU5NywiZXhwIjoyMDY1OTg5NTk3fQ.VtG_dOMBD-_k8AVZVBP7Ch_cEpa9HQcKhqhS6K7IoEE';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkFinanceData() {
    try {
        console.log('🔍 جاري فحص بيانات التمويل...\n');

        // فحص جدول financing_requests
        console.log('📊 بيانات طلبات التمويل:');
        const { data: financingRequests, error: financingError } = await supabase
            .from('financing_requests')
            .select('*');

        if (financingError) {
            console.error('❌ خطأ في جلب طلبات التمويل:', financingError);
        } else {
            console.log('عدد طلبات التمويل:', financingRequests?.length || 0);
            if (financingRequests && financingRequests.length > 0) {
                console.log('أول طلب تمويل:', financingRequests[0]);
            }
        }

        // فحص جدول car_showcase
        console.log('\n🚗 بيانات السيارات:');
        const { data: cars, error: carsError } = await supabase
            .from('car_showcase')
            .select('*');

        if (carsError) {
            console.error('❌ خطأ في جلب السيارات:', carsError);
        } else {
            console.log('عدد السيارات:', cars?.length || 0);
            if (cars && cars.length > 0) {
                console.log('أول سيارة:', cars[0]);
            }
        }

        // فحص جدول customers
        console.log('\n👥 بيانات العملاء:');
        const { data: customers, error: customersError } = await supabase
            .from('customers')
            .select('*');

        if (customersError) {
            console.error('❌ خطأ في جلب العملاء:', customersError);
        } else {
            console.log('عدد العملاء:', customers?.length || 0);
            if (customers && customers.length > 0) {
                console.log('أول عميل:', customers[0]);
            }
        }

        // فحص جدول installment_rules
        console.log('\n📋 بيانات قواعد الأقساط:');
        const { data: rules, error: rulesError } = await supabase
            .from('installment_rules')
            .select('*');

        if (rulesError) {
            console.error('❌ خطأ في جلب قواعد الأقساط:', rulesError);
        } else {
            console.log('عدد قواعد الأقساط:', rules?.length || 0);
            if (rules && rules.length > 0) {
                console.log('أول قاعدة:', rules[0]);
            }
        }

        // حساب البيانات المالية يدوياً
        console.log('\n🧮 حساب البيانات المالية:');
        if (financingRequests && financingRequests.length > 0) {
            const totalMonthlyInstallments = financingRequests.reduce((sum, req) => {
                return sum + (req.monthly_installment || 0);
            }, 0);
            
            const totalFirstPayments = financingRequests.reduce((sum, req) => {
                return sum + (req.first_payment || 0);
            }, 0);

            console.log('إجمالي الأقساط الشهرية:', totalMonthlyInstallments);
            console.log('إجمالي الدفعات الأولى:', totalFirstPayments);
        }

    } catch (error) {
        console.error('❌ خطأ عام:', error);
    }
}

checkFinanceData(); 