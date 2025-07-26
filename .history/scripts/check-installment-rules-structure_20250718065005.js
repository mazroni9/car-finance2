const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://uhdopxhxmrxwystnbmmp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoZG9weGh4bXJ4d3lzdG5ibW1wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDQxMzU5NywiZXhwIjoyMDY1OTg5NTk3fQ.VtG_dOMBD-_k8AVZVBP7Ch_cEpa9HQcKhqhS6K7IoEE';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkInstallmentRulesStructure() {
    try {
        console.log('🔍 جاري فحص هيكل جدول installment_rules...\n');

        // جلب عينة من البيانات لمعرفة الأعمدة الموجودة
        const { data: rules, error } = await supabase
            .from('installment_rules')
            .select('*')
            .limit(1);

        if (error) {
            console.log('❌ خطأ في الوصول لجدول installment_rules:', error.message);
            return;
        }

        if (rules && rules.length > 0) {
            console.log('✅ جدول installment_rules موجود');
            console.log('📊 الأعمدة الموجودة:');
            
            const firstRule = rules[0];
            Object.keys(firstRule).forEach(key => {
                console.log(`- ${key}: ${typeof firstRule[key]} = ${firstRule[key]}`);
            });

            console.log('\n🔍 البحث عن عمود "الربح الأساسي":');
            const profitColumns = Object.keys(firstRule).filter(key => 
                key.toLowerCase().includes('profit') || 
                key.toLowerCase().includes('ربح') ||
                key.toLowerCase().includes('base')
            );
            
            if (profitColumns.length > 0) {
                console.log('✅ أعمدة الربح الموجودة:');
                profitColumns.forEach(col => console.log(`- ${col}`));
            } else {
                console.log('❌ لم يتم العثور على أعمدة الربح');
            }

            console.log('\n📋 جميع الأعمدة:');
            Object.keys(firstRule).forEach((key, index) => {
                console.log(`${index + 1}. ${key}`);
            });

        } else {
            console.log('❌ جدول installment_rules فارغ');
        }

    } catch (error) {
        console.error('❌ خطأ عام في فحص هيكل الجدول:', error);
    }
}

checkInstallmentRulesStructure(); 