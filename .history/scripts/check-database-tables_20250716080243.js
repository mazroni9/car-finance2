const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://uhdopxhxmrxwystnbmmp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoZG9weGh4bXJ4d3lzdG5ibW1wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDQxMzU5NywiZXhwIjoyMDY1OTg5NTk3fQ.VtG_dOMBD-_k8AVZVBP7Ch_cEpa9HQcKhqhS6K7IoEE';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabaseTables() {
    try {
        console.log('🔍 جاري فحص الجداول في قاعدة البيانات...\n');

        // فحص جدول car_showcase
        console.log('🚗 فحص جدول car_showcase:');
        const { data: cars, error: carsError } = await supabase
            .from('car_showcase')
            .select('*')
            .limit(1);

        if (carsError) {
            console.log('❌ جدول car_showcase غير موجود:', carsError.message);
        } else {
            console.log('✅ جدول car_showcase موجود');
            console.log('📊 عدد السيارات:', cars?.length || 0);
        }

        // فحص جدول customers
        console.log('\n👥 فحص جدول customers:');
        const { data: customers, error: customersError } = await supabase
            .from('customers')
            .select('*')
            .limit(1);

        if (customersError) {
            console.log('❌ جدول customers غير موجود:', customersError.message);
        } else {
            console.log('✅ جدول customers موجود');
            console.log('📊 عدد العملاء:', customers?.length || 0);
        }

        // فحص جدول installment_rules
        console.log('\n📋 فحص جدول installment_rules:');
        const { data: rules, error: rulesError } = await supabase
            .from('installment_rules')
            .select('*')
            .limit(1);

        if (rulesError) {
            console.log('❌ جدول installment_rules غير موجود:', rulesError.message);
        } else {
            console.log('✅ جدول installment_rules موجود');
            console.log('📊 عدد القواعد:', rules?.length || 0);
        }

        // فحص جدول financing_requests
        console.log('\n💰 فحص جدول financing_requests:');
        const { data: financing, error: financingError } = await supabase
            .from('financing_requests')
            .select('*')
            .limit(1);

        if (financingError) {
            console.log('❌ جدول financing_requests غير موجود:', financingError.message);
        } else {
            console.log('✅ جدول financing_requests موجود');
            console.log('📊 عدد الطلبات:', financing?.length || 0);
        }

        // فحص جدول users
        console.log('\n👤 فحص جدول users:');
        const { data: users, error: usersError } = await supabase
            .from('users')
            .select('*')
            .limit(1);

        if (usersError) {
            console.log('❌ جدول users غير موجود:', usersError.message);
        } else {
            console.log('✅ جدول users موجود');
            console.log('📊 عدد المستخدمين:', users?.length || 0);
        }

        // فحص جدول wallets
        console.log('\n💳 فحص جدول wallets:');
        const { data: wallets, error: walletsError } = await supabase
            .from('wallets')
            .select('*')
            .limit(1);

        if (walletsError) {
            console.log('❌ جدول wallets غير موجود:', walletsError.message);
        } else {
            console.log('✅ جدول wallets موجود');
            console.log('📊 عدد المحافظ:', wallets?.length || 0);
        }

        console.log('\n📋 ملخص الجداول:');
        console.log('✅ الجداول الموجودة:');
        if (!carsError) console.log('- car_showcase');
        if (!customersError) console.log('- customers');
        if (!rulesError) console.log('- installment_rules');
        if (!financingError) console.log('- financing_requests');
        if (!usersError) console.log('- users');
        if (!walletsError) console.log('- wallets');

        console.log('\n❌ الجداول المفقودة:');
        if (carsError) console.log('- car_showcase');
        if (customersError) console.log('- customers');
        if (rulesError) console.log('- installment_rules');
        if (financingError) console.log('- financing_requests');
        if (usersError) console.log('- users');
        if (walletsError) console.log('- wallets');

    } catch (error) {
        console.error('❌ خطأ عام في فحص الجداول:', error);
    }
}

checkDatabaseTables(); 