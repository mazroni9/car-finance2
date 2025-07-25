const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://uhdopxhxmrxwystnbmmp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoZG9weGh4bXJ4d3lzdG5ibW1wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDQxMzU5NywiZXhwIjoyMDY1OTg5NTk3fQ.VtG_dOMBD-_k8AVZVBP7Ch_cEpa9HQcKhqhS6K7IoEE';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
    try {
        console.log('🔍 جاري فحص البيانات في الجداول...\n');

        // فحص بيانات السيارات
        console.log('🚗 بيانات السيارات:');
        const { data: cars, error: carsError } = await supabase
            .from('car_showcase')
            .select('*');

        if (carsError) {
            console.log('❌ خطأ في جلب السيارات:', carsError.message);
        } else {
            console.log('✅ عدد السيارات:', cars?.length || 0);
            if (cars && cars.length > 0) {
                console.log('📋 أول سيارة:', {
                    id: cars[0].id,
                    make: cars[0].make,
                    model: cars[0].model,
                    price: cars[0].price,
                    image_url: cars[0].image_url,
                    image_url_type: typeof cars[0].image_url,
                    image_url_length: Array.isArray(cars[0].image_url) ? cars[0].image_url.length : 'N/A'
                });
            }
        }

        // فحص بيانات العملاء
        console.log('\n👥 بيانات العملاء:');
        const { data: customers, error: customersError } = await supabase
            .from('customers')
            .select('*');

        if (customersError) {
            console.log('❌ خطأ في جلب العملاء:', customersError.message);
        } else {
            console.log('✅ عدد العملاء:', customers?.length || 0);
            if (customers && customers.length > 0) {
                console.log('📋 أول عميل:', customers[0]);
            }
        }

        // فحص بيانات قواعد الأقساط
        console.log('\n📋 بيانات قواعد الأقساط:');
        const { data: rules, error: rulesError } = await supabase
            .from('installment_rules')
            .select('*');

        if (rulesError) {
            console.log('❌ خطأ في جلب قواعد الأقساط:', rulesError.message);
        } else {
            console.log('✅ عدد قواعد الأقساط:', rules?.length || 0);
            if (rules && rules.length > 0) {
                console.log('📋 أول قاعدة:', rules[0]);
            }
        }

        // فحص بيانات طلبات التمويل
        console.log('\n💰 بيانات طلبات التمويل:');
        const { data: financing, error: financingError } = await supabase
            .from('financing_requests')
            .select('*');

        if (financingError) {
            console.log('❌ خطأ في جلب طلبات التمويل:', financingError.message);
        } else {
            console.log('✅ عدد طلبات التمويل:', financing?.length || 0);
            if (financing && financing.length > 0) {
                console.log('📋 أول طلب:', financing[0]);
            }
        }

        // فحص بيانات المستخدمين
        console.log('\n👤 بيانات المستخدمين:');
        const { data: users, error: usersError } = await supabase
            .from('users')
            .select('*');

        if (usersError) {
            console.log('❌ خطأ في جلب المستخدمين:', usersError.message);
        } else {
            console.log('✅ عدد المستخدمين:', users?.length || 0);
            if (users && users.length > 0) {
                console.log('📋 أول مستخدم:', users[0]);
            }
        }

        // فحص بيانات المحافظ
        console.log('\n💳 بيانات المحافظ:');
        const { data: wallets, error: walletsError } = await supabase
            .from('wallets')
            .select('*');

        if (walletsError) {
            console.log('❌ خطأ في جلب المحافظ:', walletsError.message);
        } else {
            console.log('✅ عدد المحافظ:', wallets?.length || 0);
            if (wallets && wallets.length > 0) {
                console.log('📋 أول محفظة:', wallets[0]);
            }
        }

        console.log('\n✅ ملخص البيانات:');
        console.log(`🚗 السيارات: ${cars?.length || 0}`);
        console.log(`👥 العملاء: ${customers?.length || 0}`);
        console.log(`📋 قواعد الأقساط: ${rules?.length || 0}`);
        console.log(`💰 طلبات التمويل: ${financing?.length || 0}`);
        console.log(`👤 المستخدمين: ${users?.length || 0}`);
        console.log(`💳 المحافظ: ${wallets?.length || 0}`);

    } catch (error) {
        console.error('❌ خطأ عام في فحص البيانات:', error);
    }
}

checkData(); 