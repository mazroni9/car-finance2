const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://uhdopxhxmrxwystnbmmp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoZG9weGh4bXJ4d3lzdG5ibW1wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDQxMzU5NywiZXhwIjoyMDY1OTg5NTk3fQ.VtG_dOMBD-_k8AVZVBP7Ch_cEpa9HQcKhqhS6K7IoEE';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkInstallmentData() {
    try {
        console.log('🔍 فحص بيانات جدول installment_rules...\n');

        // جلب جميع البيانات من جدول installment_rules
        const { data, error } = await supabase
            .from('installment_rules')
            .select('*');

        if (error) {
            console.error('❌ خطأ في جلب البيانات:', error);
            return;
        }

        console.log(`✅ تم جلب ${data.length} صف من جدول installment_rules`);

        // عرض أول 3 صفوف
        console.log('\n📋 أول 3 صفوف:');
        data.slice(0, 3).forEach((row, index) => {
            console.log(`صف ${index + 1}:`, {
                id: row.id,
                quantity: row.quantity,
                price_category: row.price_category,
                duration_months: row.duration_months,
                profit_percent: row.profit_percent
            });
        });

        // حساب إجمالي عدد السيارات
        const totalCars = data.reduce((sum, row) => sum + (row.quantity || 0), 0);
        console.log(`\n🚗 إجمالي عدد السيارات: ${totalCars}`);

        // حساب عدد السيارات لكل فئة سعرية
        const carsByCategory = {};
        data.forEach(row => {
            const category = row.price_category;
            if (!carsByCategory[category]) {
                carsByCategory[category] = 0;
            }
            carsByCategory[category] += (row.quantity || 0);
        });

        console.log('\n📊 عدد السيارات حسب الفئة السعرية:');
        Object.entries(carsByCategory).forEach(([category, count]) => {
            console.log(`  ${category} ريال: ${count} سيارة`);
        });

    } catch (error) {
        console.error('❌ خطأ غير متوقع:', error);
    }
}

// تشغيل السكريبت
checkInstallmentData(); 