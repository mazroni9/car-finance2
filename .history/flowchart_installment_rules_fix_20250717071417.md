# فلو شارت - إصلاح ربط نموذج التمويل مع قاعدة البيانات

```mermaid
flowchart TD
    A[نموذج إضافة بيانات التمويل] --> B[صفحة /admin/car-finance-entry]
    B --> C[CarFinanceForm component]
    C --> D[حقول النموذج]
    
    D --> E[price_category: 25000]
    D --> F[duration_months: 12]
    D --> G[quantity: 10]
    D --> H[down_payment_percent: 0.10]
    D --> I[last_payment_percent: 0.20]
    
    E --> J[زر الحفظ]
    F --> J
    G --> J
    H --> J
    I --> J
    
    J --> K[/api/installment/save]
    K --> L[حساب القيم المطلوبة]
    
    L --> M[profit_target_percent = 0.30]
    L --> N[down_payment_value = 2500]
    L --> O[last_payment_value = 5000]
    L --> P[monthly_installment = 2083.33]
    L --> Q[possible_purchase_amount = 250000]
    L --> R[tracking_cost = 250]
    L --> S[guarantee_contract_cost = 500]
    L --> T[inspection_cost = 3000]
    L --> U[profit_per_car = 7500]
    
    M --> V[تجهيز البيانات للإدخال]
    N --> V
    O --> V
    P --> V
    Q --> V
    R --> V
    S --> V
    T --> V
    U --> V
    
    V --> W[Supabase insert]
    W --> X[جدول installment_rules]
    
    X --> Y[البيانات المحفوظة]
    Y --> Z[عرض رسالة نجاح]
    
    %% تفاصيل الجدول
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
        DB18[total_profit_full_period GENERATED]
        DB19[roi_full_period GENERATED]
        DB20[roi_annual GENERATED]
        DB21[created_at TIMESTAMP]
        DB22[updated_at TIMESTAMP]
    end
    
    %% ربط البيانات
    V --> DB2
    V --> DB3
    V --> DB4
    V --> DB5
    V --> DB6
    V --> DB7
    V --> DB8
    V --> DB9
    V --> DB10
    V --> DB11
    V --> DB12
    V --> DB13
    V --> DB14
    V --> DB15
```

## تفاصيل الإصلاح:

### **1. المشكلة الأصلية:**
- عدم تطابق أعمدة الجدول مع البيانات المرسلة
- أعمدة مفقودة مثل `down_payment_percent` و `last_payment_percent`
- أعمدة زائدة مثل `total_sale_price` و `remaining_amount`

### **2. الحل المطبق:**
- إعادة إنشاء الجدول بالهيكل الصحيح
- إضافة جميع الأعمدة المطلوبة
- إضافة Generated Columns للحسابات التلقائية
- إضافة Triggers لتحديث `updated_at`

### **3. البيانات المرسلة من النموذج:**
```json
{
  "price_category": 25000,
  "duration_months": 12,
  "quantity": 10,
  "down_payment_percent": 0.10,
  "last_payment_percent": 0.20
}
```

### **4. البيانات المحسوبة في API:**
```json
{
  "price_category": 25000,
  "duration_months": 12,
  "profit_target_percent": 0.30,
  "down_payment_percent": 0.10,
  "last_payment_percent": 0.20,
  "down_payment_value": 2500,
  "last_payment_value": 5000,
  "quantity": 10,
  "monthly_installment": 2083.33,
  "possible_purchase_amount": 250000,
  "tracking_cost": 250,
  "guarantee_contract_cost": 500,
  "inspection_cost": 3000,
  "profit_per_car": 7500
}
```

### **5. الأعمدة المحسوبة تلقائياً:**
- `monthly_income`: الدخل الشهري
- `annual_income`: الدخل السنوي
- `total_profit_full_period`: إجمالي الربح للفترة
- `roi_full_period`: عائد الاستثمار للفترة
- `roi_annual`: عائد الاستثمار السنوي

### **6. خطوات التطبيق:**
1. تشغيل ملف `sql/fix_installment_rules_table.sql`
2. اختبار النموذج في `/admin/car-finance-entry`
3. التأكد من حفظ البيانات بنجاح
4. عرض البيانات في `/car-finance` 