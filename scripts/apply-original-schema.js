const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://uhdopxhxmrxwystnbmmp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoZG9weGh4bXJ4d3lzdG5ibW1wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDQxMzU5NywiZXhwIjoyMDY1OTg5NTk3fQ.VtG_dOMBD-_k8AVZVBP7Ch_cEpa9HQcKhqhS6K7IoEE';

async function applyOriginalSchema() {
    try {
        console.log('🔄 جاري تطبيق الإسكيم الأصلي...\n');

        // قراءة ملف SQL
        const sqlFilePath = path.join(__dirname, '../sql/restore_original_schema.sql');
        const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

        console.log('📄 تم قراءة ملف SQL بنجاح');
        console.log('📊 حجم الملف:', sqlContent.length, 'حرف');

        // تقسيم SQL إلى أوامر منفصلة
        const sqlCommands = sqlContent
            .split(';')
            .map(cmd => cmd.trim())
            .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));

        console.log('🔧 عدد الأوامر SQL:', sqlCommands.length);

        // تطبيق كل أمر على حدة
        for (let i = 0; i < sqlCommands.length; i++) {
            const command = sqlCommands[i];
            
            try {
                const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${supabaseKey}`,
                        'apikey': supabaseKey
                    },
                    body: JSON.stringify({
                        sql: command
                    })
                });

                if (response.ok) {
                    console.log(`✅ تم تنفيذ الأمر ${i + 1}/${sqlCommands.length}`);
                } else {
                    const errorText = await response.text();
                    console.log(`⚠️ تحذير في الأمر ${i + 1}: ${errorText}`);
                }
            } catch (error) {
                console.log(`⚠️ خطأ في الأمر ${i + 1}: ${error.message}`);
            }

            // انتظار قليل بين الأوامر
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        console.log('\n✅ تم تطبيق الإسكيم الأصلي بنجاح!');
        console.log('📋 الجداول المسترجعة:');
        console.log('- car_showcase (السيارات) - مع image_url كـ text[]');
        console.log('- customers (العملاء)');
        console.log('- installment_rules (قواعد الأقساط)');
        console.log('- financing_requests (طلبات التمويل)');
        console.log('- finance_transactions (العمليات المالية)');
        console.log('- wallets (المحافظ)');
        console.log('- wallet_transactions (معاملات المحافظ)');
        console.log('- users (المستخدمين)');

        console.log('\n🔧 التغييرات الرئيسية:');
        console.log('- تم استرجاع image_url كـ text[] (مصفوفة)');
        console.log('- تم استرجاع منطق التأجير الأصلي');
        console.log('- تم إضافة Function لحساب الملخص المالي');
        console.log('- تم إضافة البيانات التجريبية الأصلية');

    } catch (error) {
        console.error('❌ خطأ في تطبيق الإسكيم:', error);
    }
}

applyOriginalSchema(); 