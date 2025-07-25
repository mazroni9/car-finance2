const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://uhdopxhxmrxwystnbmmp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoZG9weGh4bXJ4d3lzdG5ibW1wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDQxMzU5NywiZXhwIjoyMDY1OTg5NTk3fQ.VtG_dOMBD-_k8AVZVBP7Ch_cEpa9HQcKhqhS6K7IoEE';
const supabase = createClient(supabaseUrl, supabaseKey);

async function restoreOriginalSchema() {
    try {
        console.log('🔄 جاري استرجاع الإسكيم الأصلي...\n');

        // حذف جميع الجداول الحالية
        console.log('🗑️ حذف الجداول الحالية...');
        const dropQueries = [
            'DROP TABLE IF EXISTS settlements CASCADE',
            'DROP TABLE IF EXISTS dealer_transactions CASCADE',
            'DROP TABLE IF EXISTS dealer_wallets CASCADE',
            'DROP TABLE IF EXISTS wallet_transactions CASCADE',
            'DROP TABLE IF EXISTS wallets CASCADE',
            'DROP TABLE IF EXISTS finance_transactions CASCADE',
            'DROP TABLE IF EXISTS financing_requests CASCADE',
            'DROP TABLE IF EXISTS installment_rules CASCADE',
            'DROP TABLE IF EXISTS pricing_rules CASCADE',
            'DROP TABLE IF EXISTS investor_profits CASCADE',
            'DROP TABLE IF EXISTS investment_cycles CASCADE',
            'DROP TABLE IF EXISTS investors CASCADE',
            'DROP TABLE IF EXISTS subscriptions CASCADE',
            'DROP TABLE IF EXISTS customers CASCADE',
            'DROP TABLE IF EXISTS users CASCADE',
            'DROP TABLE IF EXISTS car_showcase CASCADE'
        ];

        for (const query of dropQueries) {
            const { error } = await supabase.rpc('exec_sql', { sql: query });
            if (error) {
                console.log(`⚠️ تحذير في حذف الجدول: ${error.message}`);
            }
        }

        // إنشاء الجداول الأصلية مع منطق التأجير الصحيح
        console.log('🏗️ إنشاء الجداول الأصلية...');

        // جدول السيارات الأصلي
        const createCarShowcase = `
            CREATE TABLE car_showcase (
                id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                make text NOT NULL,
                model text NOT NULL,
                year int4 NOT NULL,
                price numeric NOT NULL,
                image_url text[] NULL,
                color text NULL,
                mileage numeric NULL,
                fuel_type text NULL,
                transmission text NULL DEFAULT 'أوتوماتيك',
                status text NULL DEFAULT 'available',
                seller_id uuid NULL,
                description text NULL,
                technical_report_url text NULL,
                registration_image_url text NULL,
                created_at timestamp DEFAULT CURRENT_TIMESTAMP,
                updated_at timestamp DEFAULT CURRENT_TIMESTAMP
            );
        `;

        // جدول العملاء
        const createCustomers = `
            CREATE TABLE customers (
                id SERIAL PRIMARY KEY,
                full_name text NOT NULL,
                phone_number varchar(20),
                national_id varchar(15) UNIQUE,
                created_at timestamp DEFAULT CURRENT_TIMESTAMP
            );
        `;

        // جدول قواعد الأقساط الأصلية
        const createInstallmentRules = `
            CREATE TABLE installment_rules (
                id SERIAL PRIMARY KEY,
                name text NOT NULL,
                description text,
                min_amount decimal(12,2),
                max_amount decimal(12,2),
                down_payment_percentage decimal(5,2),
                monthly_payment_percentage decimal(5,2),
                term_months integer,
                interest_rate decimal(5,2),
                platform_fee decimal(12,2),
                status varchar(20) DEFAULT 'active',
                created_at timestamp DEFAULT CURRENT_TIMESTAMP,
                updated_at timestamp DEFAULT CURRENT_TIMESTAMP
            );
        `;

        // جدول طلبات التمويل الأصلية
        const createFinancingRequests = `
            CREATE TABLE financing_requests (
                id SERIAL PRIMARY KEY,
                customer_id integer REFERENCES customers(id),
                car_id uuid REFERENCES car_showcase(id),
                down_payment numeric(12,2),
                final_payment numeric(12,2),
                monthly_payment numeric(12,2),
                financing_percentage numeric(5,2),
                term_months integer,
                status varchar(20) DEFAULT 'pending',
                created_at timestamp DEFAULT CURRENT_TIMESTAMP
            );
        `;

        // جدول العمليات المالية
        const createFinanceTransactions = `
            CREATE TABLE finance_transactions (
                id SERIAL PRIMARY KEY,
                financing_request_id integer REFERENCES financing_requests(id),
                amount numeric(12,2),
                type varchar(20),
                paid_at timestamp DEFAULT CURRENT_TIMESTAMP
            );
        `;

        // جدول المحافظ
        const createWallets = `
            CREATE TABLE wallets (
                id SERIAL PRIMARY KEY,
                user_id uuid NOT NULL,
                type varchar(20) NOT NULL,
                balance decimal(14,2) DEFAULT 0,
                status varchar(20) DEFAULT 'active',
                created_at timestamp DEFAULT CURRENT_TIMESTAMP,
                updated_at timestamp DEFAULT CURRENT_TIMESTAMP
            );
        `;

        // جدول معاملات المحافظ
        const createWalletTransactions = `
            CREATE TABLE wallet_transactions (
                id SERIAL PRIMARY KEY,
                wallet_id integer REFERENCES wallets(id),
                type varchar(20) NOT NULL,
                amount decimal(14,2) NOT NULL,
                description text,
                reference_id uuid,
                status varchar(20) DEFAULT 'completed',
                created_at timestamp DEFAULT CURRENT_TIMESTAMP
            );
        `;

        // إنشاء الجداول
        const createQueries = [
            createCarShowcase,
            createCustomers,
            createInstallmentRules,
            createFinancingRequests,
            createFinanceTransactions,
            createWallets,
            createWalletTransactions
        ];

        for (const query of createQueries) {
            const { error } = await supabase.rpc('exec_sql', { sql: query });
            if (error) {
                console.error(`❌ خطأ في إنشاء الجدول: ${error.message}`);
            } else {
                console.log('✅ تم إنشاء الجدول بنجاح');
            }
        }

        // إضافة بيانات تجريبية أصلية
        console.log('📊 إضافة البيانات التجريبية الأصلية...');

        // إضافة سيارات أصلية
        const insertCars = `
            INSERT INTO car_showcase (make, model, year, price, image_url, color, mileage, fuel_type, description)
            VALUES 
                ('تويوتا', 'كامري', 2024, 150000, ARRAY['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop'], 'أبيض', 0, 'بنزين', 'سيارة تويوتا كامري 2024 بحالة ممتازة'),
                ('مرسيدس', 'C-Class', 2024, 190000, ARRAY['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop'], 'أسود', 0, 'بنزين', 'مرسيدس C-Class 2024 فاخرة'),
                ('هيونداي', 'سوناتا', 2022, 82000, ARRAY['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop'], 'أسود', 10000, 'بنزين', 'هيونداي سوناتا 2022 اقتصادية'),
                ('هوندا', 'أكورد', 2023, 95000, ARRAY['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop'], 'فضي', 5000, 'هايبرد', 'هوندا أكورد 2023 هجينة');
        `;

        // إضافة عملاء
        const insertCustomers = `
            INSERT INTO customers (full_name, phone_number, national_id)
            VALUES 
                ('عبدالله السالم', '0501234567', '1012345678'),
                ('سارة المانع', '0559876543', '1023456789');
        `;

        // إضافة قواعد أقساط أصلية
        const insertRules = `
            INSERT INTO installment_rules (name, description, min_amount, max_amount, down_payment_percentage, monthly_payment_percentage, term_months, interest_rate, platform_fee)
            VALUES 
                ('قاعدة أساسية', 'قاعدة التقسيط الأساسية', 50000, 200000, 20.0, 5.0, 24, 0.0, 1000),
                ('قاعدة متقدمة', 'قاعدة التقسيط للمبالغ الكبيرة', 200000, 500000, 30.0, 4.0, 36, 0.0, 2000);
        `;

        // إضافة طلبات تمويل تجريبية
        const insertFinancing = `
            INSERT INTO financing_requests (customer_id, car_id, down_payment, final_payment, monthly_payment, financing_percentage, term_months, status)
            VALUES 
                (1, (SELECT id FROM car_showcase LIMIT 1), 30000, 30000, 3750, 60, 24, 'approved'),
                (2, (SELECT id FROM car_showcase OFFSET 1 LIMIT 1), 38000, 38000, 4750, 60, 24, 'approved');
        `;

        const insertQueries = [insertCars, insertCustomers, insertRules, insertFinancing];

        for (const query of insertQueries) {
            const { error } = await supabase.rpc('exec_sql', { sql: query });
            if (error) {
                console.error(`❌ خطأ في إضافة البيانات: ${error.message}`);
            } else {
                console.log('✅ تم إضافة البيانات بنجاح');
            }
        }

        console.log('\n✅ تم استرجاع الإسكيم الأصلي بنجاح!');
        console.log('📋 الجداول المسترجعة:');
        console.log('- car_showcase (السيارات)');
        console.log('- customers (العملاء)');
        console.log('- installment_rules (قواعد الأقساط)');
        console.log('- financing_requests (طلبات التمويل)');
        console.log('- finance_transactions (العمليات المالية)');
        console.log('- wallets (المحافظ)');
        console.log('- wallet_transactions (معاملات المحافظ)');

    } catch (error) {
        console.error('❌ خطأ في استرجاع الإسكيم:', error);
    }
}

restoreOriginalSchema(); 