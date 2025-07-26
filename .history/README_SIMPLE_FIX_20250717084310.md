# حل بسيط: مشكلة total_sale_price

## المشكلة
النموذج لا يحفظ البيانات بسبب مشكلة في عمود `total_sale_price`.

## الحل السريع

### الخطوة 1: تشغيل SQL في Supabase
```sql
-- انسخ والصق هذا في Supabase SQL Editor
UPDATE installment_rules 
SET total_sale_price = price_category * (1 + profit_target_percent)
WHERE total_sale_price IS NULL OR total_sale_price = 0;
```

### الخطوة 2: اختبار النموذج
1. اذهب إلى `/admin/car-finance-entry`
2. املأ النموذج
3. اضغط "حفظ في قاعدة البيانات"
4. يجب أن يعمل بدون أخطاء

## إذا لم يعمل

### تحقق من البيانات
```sql
-- تشغيل هذا في Supabase SQL Editor
SELECT COUNT(*) as null_count
FROM installment_rules 
WHERE total_sale_price IS NULL;
```

### إذا كان النتيجة 0، جرب هذا
```sql
-- إعادة حساب جميع البيانات
UPDATE installment_rules 
SET total_sale_price = price_category * (1 + profit_target_percent);
```

## اختبار سريع

1. **تشغيل SQL أعلاه**
2. **اختبار النموذج**
3. **إذا عمل** - المشكلة محلولة
4. **إذا لم يعمل** - أخبرني بالخطأ الجديد

## الخلاصة
- المشكلة في البيانات الموجودة
- الحل: تحديث `total_sale_price` للبيانات الموجودة
- بعد التحديث: النموذج سيعمل 