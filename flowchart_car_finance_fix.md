# فلو شارت - إصلاح ربط CarFinanceTable مع قاعدة البيانات

```mermaid
flowchart TD
    A[صفحة /car-finance] --> B[CarFinanceTable.tsx]
    B --> C[useEffect fetch data]
    C --> D[/api/finance/rules]
    D --> E[Supabase Query]
    E --> F[جدول installment_rules]
    
    %% تفاصيل المكون
    subgraph "CarFinanceTable Component"
        COMP1[useState rules]
        COMP2[useEffect fetchRules]
        COMP3[formatNumber function]
        COMP4[formatPercent function]
        COMP5[render table]
    end
    
    %% تفاصيل API Route
    subgraph "API Route /api/finance/rules"
        API1[GET request]
        API2[createClient]
        API3[supabase.from'installment_rules']
        API4[select all columns]
        API5[order by price_category, duration_months]
        API6[JSON response]
    end
    
    %% تفاصيل قاعدة البيانات
    subgraph "جدول installment_rules"
        DB1[id SERIAL PRIMARY KEY]
        DB2[price_category NUMERIC]
        DB3[duration_months INTEGER]
        DB4[profit_target_percent NUMERIC]
        DB5[down_payment_percent NUMERIC]
        DB6[last_payment_percent NUMERIC]
        DB7[down_payment_value NUMERIC]
        DB8[last_payment_value NUMERIC]
        DB9[quantity INTEGER]
        DB10[monthly_installment NUMERIC]
        DB11[possible_purchase_amount NUMERIC]
        DB12[tracking_cost NUMERIC]
        DB13[guarantee_contract_cost NUMERIC]
        DB14[inspection_cost NUMERIC]
        DB15[profit_per_car NUMERIC]
        DB16[monthly_income GENERATED]
        DB17[annual_income GENERATED]
        DB18[total_monthly_installments GENERATED]
        DB19[financed_amount GENERATED]
        DB20[total_monthly_profit GENERATED]
        DB21[total_profit_full_period GENERATED]
        DB22[annual_profit_before_costs GENERATED]
        DB23[total_purchase_cost GENERATED]
        DB24[roi_full_period GENERATED]
        DB25[roi_annual GENERATED]
        DB26[created_at TIMESTAMP]
        DB27[updated_at TIMESTAMP]
    end
    
    %% تفاصيل عرض البيانات
    subgraph "عرض البيانات في الجدول"
        UI1[HTML Table]
        UI2[Price Category]
        UI3[Duration Months]
        UI4[Profit Target %]
        UI5[Down Payment Value]
        UI6[Last Payment Value]
        UI7[Quantity]
        UI8[Monthly Installment]
        UI9[Monthly Income]
        UI10[Annual Income]
        UI11[Possible Purchase Amount]
        UI12[Total Profit Full Period]
        UI13[Profit Per Car]
        UI14[Annual Profit]
        UI15[Tracking Cost]
        UI16[Guarantee Contract Cost]
        UI17[Inspection Cost]
        UI18[ROI Full Period]
        UI19[ROI Annual]
    end
    
    %% ربط المكونات
    COMP2 --> API1
    API3 --> DB1
    API6 --> COMP1
    COMP5 --> UI1
    
    %% ربط البيانات
    DB2 --> UI2
    DB3 --> UI3
    DB4 --> UI4
    DB7 --> UI5
    DB8 --> UI6
    DB9 --> UI7
    DB10 --> UI8
    DB16 --> UI9
    DB17 --> UI10
    DB11 --> UI11
    DB21 --> UI12
    DB15 --> UI13
    DB22 --> UI14
    DB12 --> UI15
    DB13 --> UI16
    DB14 --> UI17
    DB24 --> UI18
    DB25 --> UI19
```

## تفاصيل الإصلاح:

### **1. المشكلة الأصلية:**
- عدم تطابق أعمدة الجدول مع الأعمدة المطلوبة في API route
- أعمدة مفقودة في الجدول مثل `down_payment_percent`, `last_payment_percent`
- أعمدة محسوبة مفقودة مثل `total_monthly_installments`, `financed_amount`

### **2. الحل المطبق:**
- إعادة إنشاء الجدول بالهيكل الكامل
- إضافة جميع الأعمدة المطلوبة في API route
- إضافة Generated Columns لجميع الحسابات التلقائية
- إضافة Triggers لتحديث `updated_at`

### **3. الأعمدة المطلوبة في API Route:**
```sql
SELECT 
  id,
  price_category,
  duration_months,
  profit_target_percent,
  down_payment_value,
  down_payment_percent,
  last_payment_value,
  last_payment_percent,
  quantity,
  monthly_installment,
  monthly_income,
  total_monthly_installments,
  annual_income,
  possible_purchase_amount,
  tracking_cost,
  guarantee_contract_cost,
  inspection_cost,
  financed_amount,
  profit_per_car,
  total_monthly_profit,
  total_profit_full_period,
  annual_profit_before_costs,
  total_purchase_cost,
  roi_full_period,
  roi_annual,
  created_at
```

### **4. الأعمدة المحسوبة تلقائياً:**
- `monthly_income`: الدخل الشهري = `monthly_installment * quantity`
- `annual_income`: الدخل السنوي = `monthly_installment * quantity * 12`
- `total_monthly_installments`: إجمالي الأقساط = `monthly_installment * duration_months`
- `financed_amount`: المبلغ الممول = `possible_purchase_amount - down_payment_value - last_payment_value`
- `total_monthly_profit`: إجمالي الربح الشهري = `profit_per_car * quantity`
- `total_profit_full_period`: إجمالي الربح للفترة = `profit_per_car * quantity`
- `annual_profit_before_costs`: الربح السنوي قبل التكاليف (محسوب حسب المدة)
- `total_purchase_cost`: إجمالي تكلفة الشراء = `possible_purchase_amount + tracking_cost + guarantee_contract_cost + inspection_cost`
- `roi_full_period`: عائد الاستثمار للفترة = `(profit_per_car / possible_purchase_amount) * 100`
- `roi_annual`: عائد الاستثمار السنوي (محسوب حسب المدة)

### **5. خطوات التطبيق:**
1. تشغيل ملف `sql/fix_installment_rules_complete.sql`
2. اختبار API route `/api/finance/rules`
3. اختبار صفحة `/car-finance`
4. التأكد من عرض جميع البيانات في الجدول

### **6. اختبار الإصلاح:**
1. اذهب إلى `/car-finance`
2. تأكد من ظهور البيانات في الجدول
3. تأكد من عدم وجود أخطاء في console
4. تأكد من عمل جميع الأعمدة المحسوبة 