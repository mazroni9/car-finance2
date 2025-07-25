# إصلاح سريع: مشكلة total_sale_price

## المشكلة
الخطأ يظهر: `null value in column "total_sale_price" of relation "installment_rules" violates not-null constraint`

## السبب
عمود `total_sale_price` مفقود من الجدول أو API route لا يرسله.

## الحل السريع

### الخيار 1: إضافة العمود إلى الجدول الموجود
```sql
-- تشغيل هذا في Supabase SQL Editor
ALTER TABLE installment_rules ADD COLUMN total_sale_price NUMERIC(12,2);

-- تحديث البيانات الموجودة
UPDATE installment_rules 
SET total_sale_price = price_category * (1 + profit_target_percent)
WHERE total_sale_price IS NULL;

-- جعل العمود NOT NULL
ALTER TABLE installment_rules ALTER COLUMN total_sale_price SET NOT NULL;
```

### الخيار 2: استخدام ملف SQL الجاهز
تشغيل ملف `scripts/quick-fix.sql` في Supabase.

### الخيار 3: إعادة إنشاء الجدول بالكامل
تشغيل ملف `sql/fix_installment_rules_complete.sql` في Supabase.

## التحقق من الإصلاح

### 1. اختبار API Route
```bash
curl -X POST http://localhost:3000/api/installment/save \
  -H "Content-Type: application/json" \
  -d '{
    "price_category": 25000,
    "duration_months": 12,
    "quantity": 1,
    "down_payment_percent": 0.10,
    "last_payment_percent": 0.20
  }'
```

### 2. اختبار النموذج
1. اذهب إلى `/admin/car-finance-entry`
2. املأ النموذج
3. اضغط "حفظ في قاعدة البيانات"
4. تأكد من عدم ظهور خطأ

### 3. التحقق من البيانات
1. اذهب إلى `/car-finance`
2. تأكد من ظهور البيانات في الجدول

## الملفات المحدثة

1. `sql/fix_installment_rules_complete.sql` - إضافة `total_sale_price`
2. `src/app/api/installment/save/route.js` - إرسال `total_sale_price`
3. `scripts/quick-fix.sql` - إصلاح سريع للجدول الموجود

## ملاحظات

- **البيانات الموجودة**: إذا كان الجدول يحتوي على بيانات، استخدم الخيار 1 أو 2
- **الجدول الجديد**: إذا كنت تريد إعادة إنشاء الجدول، استخدم الخيار 3
- **الاختبار**: اختبر النموذج بعد التطبيق للتأكد من عمله 