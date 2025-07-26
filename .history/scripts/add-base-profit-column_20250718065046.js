const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://uhdopxhxmrxwystnbmmp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoZG9weGh4bXJ4d3lzdG5ibW1wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDQxMzU5NywiZXhwIjoyMDY1OTg5NTk3fQ.VtG_dOMBD-_k8AVZVBP7Ch_cEpa9HQcKhqhS6K7IoEE';
const supabase = createClient(supabaseUrl, supabaseKey);

async function addBaseProfitColumn() {
    try {
        console.log('🔍 جاري إضافة عمود base_profit إلى جدول installment_rules...\n');

        // التحقق من وجود العمود أولاً
        const { data: existingData, error: checkError } = await supabase
            .from('installment_rules')
            .select('*')
            .limit(1);

        if (checkError) {
            console.log('❌ خطأ في الوصول لجدول installment_rules:', checkError.message);
            return;
        }

        if (existingData && existingData.length > 0) {
            const firstRecord = existingData[0];
            
            // التحقق من وجود عمود base_profit
            if ('base_profit' in firstRecord) {
                console.log('✅ عمود base_profit موجود بالفعل');
                console.log('📊 قيمة base_profit في السجل الأول:', firstRecord.base_profit);
            } else {
                console.log('❌ عمود base_profit غير موجود');
                console.log('🔧 سيتم إضافته عبر SQL مباشرة');
                
                // إضافة العمود عبر SQL
                const { error: alterError } = await supabase.rpc('exec_sql', {
                    sql: `
                        -- إضافة عمود base_profit إذا لم يكن موجود
                        DO $$ 
                        BEGIN
                            IF NOT EXISTS (
                                SELECT 1 FROM information_schema.columns 
                                WHERE table_name = 'installment_rules' 
                                AND column_name = 'base_profit'
                            ) THEN
                                ALTER TABLE installment_rules ADD COLUMN base_profit NUMERIC(12,2);
                                RAISE NOTICE 'تم إضافة عمود base_profit';
                            ELSE
                                RAISE NOTICE 'عمود base_profit موجود بالفعل';
                            END IF;
                        END $$;
                        
                        -- تحديث البيانات الموجودة بحساب base_profit
                        UPDATE installment_rules 
                        SET base_profit = price_category * profit_target_percent
                        WHERE base_profit IS NULL;
                        
                        -- جعل العمود NOT NULL بعد التحديث
                        ALTER TABLE installment_rules ALTER COLUMN base_profit SET NOT NULL;
                    `
                });

                if (alterError) {
                    console.log('❌ خطأ في إضافة العمود:', alterError.message);
                    console.log('💡 يجب تشغيل SQL يدوياً في Supabase Dashboard');
                    console.log('\n📋 SQL المطلوب:');
                    console.log(`
-- إضافة عمود base_profit إذا لم يكن موجود
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'installment_rules' 
        AND column_name = 'base_profit'
    ) THEN
        ALTER TABLE installment_rules ADD COLUMN base_profit NUMERIC(12,2);
        RAISE NOTICE 'تم إضافة عمود base_profit';
    ELSE
        RAISE NOTICE 'عمود base_profit موجود بالفعل';
    END IF;
END $$;

-- تحديث البيانات الموجودة بحساب base_profit
UPDATE installment_rules 
SET base_profit = price_category * profit_target_percent
WHERE base_profit IS NULL;

-- جعل العمود NOT NULL بعد التحديث
ALTER TABLE installment_rules ALTER COLUMN base_profit SET NOT NULL;
                    `);
                } else {
                    console.log('✅ تم إضافة عمود base_profit بنجاح');
                }
            }
        } else {
            console.log('❌ جدول installment_rules فارغ');
        }

        // التحقق من النتيجة
        console.log('\n🔍 التحقق من النتيجة:');
        const { data: finalData, error: finalError } = await supabase
            .from('installment_rules')
            .select('id, price_category, profit_target_percent, base_profit')
            .limit(3);

        if (finalError) {
            console.log('❌ خطأ في التحقق من النتيجة:', finalError.message);
        } else {
            console.log('✅ البيانات المحدثة:');
            finalData.forEach((record, index) => {
                console.log(`السجل ${index + 1}:`);
                console.log(`  - id: ${record.id}`);
                console.log(`  - price_category: ${record.price_category}`);
                console.log(`  - profit_target_percent: ${record.profit_target_percent}`);
                console.log(`  - base_profit: ${record.base_profit}`);
                console.log('');
            });
        }

    } catch (error) {
        console.error('❌ خطأ عام:', error);
    }
}

addBaseProfitColumn(); 