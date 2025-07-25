# دليل استكشاف الأخطاء - نموذج تمويل السيارات

## 🔍 خطوات التشخيص

### 1. اختبار الاتصال بقاعدة البيانات
```bash
# اذهب إلى هذا الرابط في المتصفح
http://localhost:3000/api/test-connection
```

**النتيجة المتوقعة:**
```json
{
  "success": true,
  "message": "✅ الاتصال بقاعدة البيانات يعمل بشكل صحيح"
}
```

### 2. التحقق من متغيرات البيئة
تأكد من وجود هذه المتغيرات في ملف `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. التحقق من جدول installment_rules
في Supabase Dashboard:
1. اذهب إلى Table Editor
2. تحقق من وجود جدول `installment_rules`
3. تحقق من هيكل الجدول

### 4. اختبار الحفظ مع بيانات بسيطة
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

## ❌ الأخطاء الشائعة وحلولها

### خطأ: "متغيرات البيئة مفقودة"
**الحل:**
1. تأكد من وجود ملف `.env.local`
2. أعد تشغيل الخادم: `npm run dev`

### خطأ: "خطأ في الاتصال بقاعدة البيانات"
**الحل:**
1. تحقق من صحة URL و Service Role Key
2. تأكد من أن جدول `installment_rules` موجود

### خطأ: "فشل في حفظ البيانات"
**الحل:**
1. تحقق من console المتصفح للحصول على تفاصيل الخطأ
2. تحقق من Network tab لرؤية الاستجابة الكاملة
3. تحقق من Supabase logs

### خطأ: "البيانات المطلوبة غير مكتملة"
**الحل:**
1. تأكد من إرسال جميع الحقول المطلوبة
2. تحقق من تنسيق البيانات

## 🔧 إصلاحات سريعة

### 1. إعادة تشغيل الخادم
```bash
# أوقف الخادم (Ctrl+C)
# ثم أعد تشغيله
npm run dev
```

### 2. مسح cache المتصفح
- اضغط `Ctrl+Shift+R` (Windows/Linux)
- أو `Cmd+Shift+R` (Mac)

### 3. التحقق من Supabase RLS
تأكد من أن جدول `installment_rules` يسمح بالإدخال:
```sql
-- في Supabase SQL Editor
ALTER TABLE installment_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable insert for authenticated users only" ON installment_rules FOR INSERT WITH CHECK (true);
```

## 📊 اختبار شامل

### 1. اختبار النموذج
1. اذهب إلى: `http://localhost:3000/admin/car-finance-entry`
2. املأ البيانات
3. اضغط "عرض المعاينة"
4. تأكد من صحة الحسابات
5. اضغط "حفظ في قاعدة البيانات"

### 2. التحقق من النتيجة
```sql
-- في Supabase SQL Editor
SELECT * FROM installment_rules ORDER BY created_at DESC LIMIT 1;
```

### 3. اختبار عرض البيانات
اذهب إلى: `http://localhost:3000/car-finance`
وتأكد من ظهور البيانات المحفوظة

## 🆘 إذا استمرت المشكلة

1. **تحقق من Console:**
   - افتح Developer Tools (F12)
   - اذهب إلى Console tab
   - ابحث عن أي أخطاء

2. **تحقق من Network:**
   - اذهب إلى Network tab
   - اضغط "حفظ" في النموذج
   - ابحث عن request إلى `/api/installment/save`
   - تحقق من Response

3. **تحقق من Supabase Logs:**
   - اذهب إلى Supabase Dashboard
   - اذهب إلى Logs
   - ابحث عن أي أخطاء

## ✅ علامات النجاح

- ✅ رسالة "✅ تم الحفظ بنجاح"
- ✅ البيانات تظهر في جدول `installment_rules`
- ✅ البيانات تظهر في صفحة `/car-finance`
- ✅ لا توجد أخطاء في Console 