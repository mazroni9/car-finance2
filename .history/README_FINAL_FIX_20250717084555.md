# الحل النهائي: مشكلة حفظ البيانات

## المشكلة
النموذج لا يحفظ البيانات بسبب مشكلة في `total_sale_price`.

## الحل السريع

### 1. تشغيل SQL في Supabase
```sql
UPDATE installment_rules 
SET total_sale_price = price_category * (1 + profit_target_percent)
WHERE total_sale_price IS NULL OR total_sale_price = 0;
```

### 2. اختبار النموذج
1. اذهب إلى `/admin/car-finance-entry`
2. املأ النموذج
3. اضغط "حفظ في قاعدة البيانات"
4. يجب أن يعمل

## إذا لم يعمل

### تحقق من الخطأ في Console
1. افتح Developer Tools (F12)
2. اذهب إلى Console
3. املأ النموذج واضغط الحفظ
4. انسخ الخطأ وأرسله لي

### أو تحقق من Network Tab
1. افتح Developer Tools (F12)
2. اذهب إلى Network
3. املأ النموذج واضغط الحفظ
4. انظر إلى request `/api/installment/save`
5. انسخ Response وأرسله لي

## الخلاصة
- تشغيل SQL أعلاه
- اختبار النموذج
- إذا لم يعمل: إرسال الخطأ لي 