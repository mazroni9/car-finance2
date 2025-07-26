-- التحقق من هيكل جدول installment_rules الموجود
-- تشغيل هذا في Supabase SQL Editor لمعرفة الأعمدة الموجودة

-- عرض جميع الأعمدة في الجدول
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'installment_rules'
ORDER BY ordinal_position;

-- عرض عينة من البيانات الموجودة
SELECT 
    id,
    price_category,
    duration_months,
    profit_target_percent,
    down_payment_percent,
    last_payment_percent,
    down_payment_value,
    last_payment_value,
    quantity,
    monthly_installment,
    possible_purchase_amount,
    tracking_cost,
    guarantee_contract_cost,
    inspection_cost,
    profit_per_car,
    total_sale_price,
    created_at
FROM installment_rules 
LIMIT 3;

-- التحقق من القيود
SELECT 
    constraint_name,
    constraint_type,
    table_name
FROM information_schema.table_constraints 
WHERE table_name = 'installment_rules'; 