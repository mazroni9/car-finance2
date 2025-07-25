# نظام تمويل السيارات - فلو شارت مفصل

```mermaid
flowchart TD
    A[المستخدم يدخل المنصة] --> B[صفحة السيارات المتاحة]
    B --> C[المستخدم يختار سيارة]
    C --> D[صفحة تفاصيل السيارة /cars/[id]/page.tsx]
    
    D --> E{المستخدم يضغط على}
    E -->|شراء مباشر| F[زر الشراء - BuyButton.tsx]
    E -->|تمويل| G[زر التمويل - CarFinanceTable.tsx]
    
    F --> H[صفحة إتمام الشراء /purchase-car/route.ts]
    G --> I[صفحة التمويل /car-finance/page.tsx]
    
    %% مسار الشراء المباشر
    H --> J[حساب عمولة المنصة]
    J --> K/api/platform-fee/calculate/route.ts]
    K --> L{حساب العمولة حسب الشرائح}
    L -->|0-5000ريال| M[300ريال]
    L -->|50,001000ريال| N[500يال]
    L -->|100,001500 ريال| O[1000يال]
    L -->|150,001000 ريال| P[1500 ريال]
    L -->|بعد 2000ريال| Qكل 1000ريال = 1000ريال إضافية]
    
    M --> R[عرض السعر + العمولة]
    N --> R
    O --> R
    P --> R
    Q --> R
    
    R --> S[المستخدم يؤكد الشراء]
    S --> T/api/purchase-car/route.ts]
    T --> Uخصم من محفظة المشتري]
    U --> V[walletService.ts - decrementBalance]
    V --> W[إضافة العمولة لمحفظة المنصة]
    W --> X[walletService.ts - incrementBalance]
    X --> Y[تسجيل العملية في settlements]
    Y --> Z[/api/settlements/route.ts]
    Z --> AA[تحديث حالة السيارة]
    AA --> BB[car_showcase.status = sold]
    BB --> CC[عرض رسالة نجاح]
    
    %% مسار التمويل
    I --> DD[عرض خيارات التمويل]
    DD --> EE[CarFinanceTable.tsx]
    EE --> FF[حساب الأقساط الشهرية]
    FF --> GG[/api/finance/calculate/route.ts]
    GG --> HH[عرض جدول الأقساط]
    HH --> II[المستخدم يختار خطة التمويل]
    II --> JJ[تأكيد التمويل]
    JJ --> KK[/api/finance/route.ts]
    KK --> LL[إنشاء طلب تمويل]
    LL --> MM[financing_requests table]
    MM --> NN[تسجيل الأقساط]
    NN --> OO[finance_transactions table]
    OO --> PP[عرض رسالة نجاح التمويل]
    
    %% ملفات قاعدة البيانات المرتبطة
    subgraphقاعدة البيانات      DB1[car_showcase - جدول السيارات]
        DB2[wallets - جدول المحافظ]
        DB3settlements - جدول التسويات]
        DB4[financing_requests - طلبات التمويل]
        DB5[finance_transactions - المعاملات المالية]
        DB6ealer_wallets - محافظ المعارض]
        DB7[dealer_transactions - معاملات المعارض]
    end
    
    %% ملفات الخدمات
    subgraph "خدمات النظام       SRV1walletService.ts - إدارة المحافظ]
        SRV2[supabase.ts - اتصال قاعدة البيانات]
        SRV3eries.ts - استعلامات قاعدة البيانات]
    end
    
    %% ملفات الواجهة
    subgraphواجهة المستخدم"
        UI1CarImageSlider.tsx - عرض صور السيارة]
        UI2[BuyButton.tsx - زر الشراء]
        UI3[CarFinanceTable.tsx - جدول التمويل]
        UI4FinanceSummary.tsx - ملخص التمويل]
        UI5Navigation.tsx - شريط التنقل]
    end
    
    %% ملفات API
    subgraph واجهات برمجة التطبيق"
        API1[/api/cars/route.ts - إدارة السيارات]
        API2/api/platform-fee/calculate/route.ts - حساب العمولة]
        API3/api/purchase-car/route.ts - شراء السيارة]
        API4[/api/finance/calculate/route.ts - حساب التمويل]
        API5[/api/finance/route.ts - طلبات التمويل]
        API6[/api/settlements/route.ts - التسويات]
        API7[/api/wallet/balance/route.ts - رصيد المحفظة]
    end
    
    %% ربط الملفات مع الفلو
    D -.-> DB1   T -.-> SRV1
    T -.-> DB2
    T -.-> DB3   KK -.-> DB4   KK -.-> DB5
    GG -.-> SRV2
    GG -.-> SRV3
```

## تفاصيل الملفات المرتبطة:

### **صفحات الواجهة:**
- `/cars/[id]/page.tsx` - صفحة تفاصيل السيارة
- `/car-finance/page.tsx` - صفحة التمويل
- `/purchase-car/route.ts` - صفحة إتمام الشراء

### **المكونات:**
- `CarImageSlider.tsx` - عرض صور السيارة
- `BuyButton.tsx` - زر الشراء المباشر
- `CarFinanceTable.tsx` - جدول خيارات التمويل
- `FinanceSummary.tsx` - ملخص التمويل
- `Navigation.tsx` - شريط التنقل

### **واجهات API:**
- `/api/platform-fee/calculate/route.ts` - حساب عمولة المنصة
- `/api/purchase-car/route.ts` - إتمام عملية الشراء
- `/api/finance/calculate/route.ts` - حساب الأقساط
- `/api/finance/route.ts` - إنشاء طلب التمويل
- `/api/settlements/route.ts` - تسجيل التسويات
- `/api/wallet/balance/route.ts` - إدارة رصيد المحفظة

### **خدمات النظام:**
- `walletService.ts` - إدارة المحافظ والمعاملات
- `supabase.ts` - اتصال قاعدة البيانات
- `queries.ts` - استعلامات قاعدة البيانات

### **جداول قاعدة البيانات:**
- `car_showcase` - معلومات السيارات
- `wallets` - محافظ المستخدمين
- `settlements` - تسجيل العمليات المالية
- `financing_requests` - طلبات التمويل
- `finance_transactions` - معاملات التمويل
- `dealer_wallets` - محافظ المعارض
- `dealer_transactions` - معاملات المعارض 