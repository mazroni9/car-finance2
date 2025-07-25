# فلو شارت - مسار بيانات جدول قواعد التمويل

```mermaid
flowchart TD
    A[قاعدة البيانات installment_rules] --> B[/api/finance/rules]
    B --> C[صفحة /car-finance]
    C --> D[CarFinanceTable.tsx]
    D --> E[عرض البيانات في الجدول]
    
    %% تفاصيل قاعدة البيانات
    subgraph "قاعدة البيانات"
        DB1[installment_rules table]
        DB2[price_category]
        DB3[duration_months]
        DB4[profit_target_percent]
        DB5[monthly_installment]
        DB6[annual_income]
    end
    
    %% تفاصيل API Route
    subgraph "API Route"
        API1[/api/finance/rules]
        API2[GET request]
        API3[Supabase query]
        API4[JSON response]
    end
    
    %% تفاصيل الصفحة
    subgraph "صفحة العرض"
        PAGE1[/car-finance/page.tsx]
        PAGE2[CarFinancePage component]
        PAGE3[useEffect hook]
        PAGE4[fetch data]
    end
    
    %% تفاصيل المكون
    subgraph "مكون الجدول"
        COMP1[CarFinanceTable.tsx]
        COMP2[useState rules]
        COMP3[useEffect fetch]
        COMP4[render table]
    end
    
    %% تفاصيل العرض
    subgraph "عرض البيانات"
        UI1[HTML Table]
        UI2[Price Category]
        UI3[Duration Months]
        UI4[Monthly Installment]
        UI5[Annual Income]
        UI6[ROI]
    end
    
    %% ربط المكونات
    DB1 --> API3
    API3 --> API4
    API4 --> PAGE4
    PAGE4 --> COMP3
    COMP3 --> COMP4
    COMP4 --> UI1
```

## تفاصيل كل مرحلة:

### **1. قاعدة البيانات (installment_rules):**
- يحتوي على جميع قواعد التمويل
- أعمدة: price_category, duration_months, profit_target_percent, إلخ

### **2. API Route (/api/finance/rules):**
- يستقبل GET request
- يرسل query إلى Supabase
- يرجع JSON response

### **3. صفحة car-finance:**
- تستدعي مكون CarFinanceTable
- تستخدم useEffect لجلب البيانات

### **4. مكون CarFinanceTable:**
- يستخدم useState لحفظ البيانات
- يستخدم useEffect لجلب البيانات من API
- يعرض البيانات في جدول HTML

### **5. عرض البيانات:**
- جدول منسق يعرض:
  - فئة السعر
  - مدة التمويل
  - القسط الشهري
  - الدخل السنوي
  - العائد على الاستثمار 