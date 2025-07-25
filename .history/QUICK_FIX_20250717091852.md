# حل سريع لمشكلة الحفظ

## 🚨 المشكلة
النموذج يحسب القيم بشكل صحيح لكن يفشل في الحفظ مع رسالة "خطأ: X فشل في حفظ البيانات"

## ⚡ الحل السريع

### 1. اختبار الاتصال
```bash
# اذهب إلى هذا الرابط
http://localhost:3000/api/test-connection
```

### 2. إذا فشل الاتصال، تحقق من متغيرات البيئة
أضف هذا الملف: `.env.local`
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. تشغيل SQL Script
في Supabase SQL Editor، شغل هذا الملف:
```sql
-- انسخ محتوى sql/check_installment_rules.sql
-- والصقه في SQL Editor
```

### 4. إعادة تشغيل الخادم
```bash
# أوقف الخادم (Ctrl+C)
npm run dev
```

### 5. اختبار النموذج
1. اذهب إلى: `http://localhost:3000/admin/car-finance-entry`
2. املأ البيانات
3. اضغط "حفظ في قاعدة البيانات"

## 🔍 إذا استمرت المشكلة

### تحقق من Console
1. اضغط F12
2. اذهب إلى Console
3. ابحث عن أي أخطاء

### تحقق من Network
1. اذهب إلى Network tab
2. اضغط "حفظ"
3. ابحث عن request إلى `/api/installment/save`
4. تحقق من Response

## 📞 إذا لم تحل المشكلة

1. **تحقق من Supabase Dashboard:**
   - اذهب إلى Table Editor
   - تحقق من وجود جدول `installment_rules`
   - تحقق من RLS policies

2. **تحقق من Logs:**
   - اذهب إلى Supabase Logs
   - ابحث عن أي أخطاء

3. **اختبار مباشر:**
```javascript
// في console المتصفح
fetch('/api/installment/save', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    price_category: 20000,
    duration_months: 12,
    quantity: 1,
    down_payment_percent: 0.10,
    last_payment_percent: 0.20,
    profit_target_percent: 30
  })
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));
```

## ✅ علامات النجاح
- رسالة "✅ تم الحفظ بنجاح"
- البيانات تظهر في جدول `installment_rules`
- لا توجد أخطاء في Console 