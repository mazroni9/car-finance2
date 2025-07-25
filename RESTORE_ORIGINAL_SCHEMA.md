# استرجاع الإسكيم الأصلي لمنصة تمويل السيارات

## المشكلة
بعد تطبيق الإسكيم الموحد، اختفت الجداول الأصلية (34 جدول) وتم استبدالها بجداول جديدة. هذا أدى إلى:
- فقدان البيانات الأصلية
- تغيير منطق التأجير
- تغيير هيكل قاعدة البيانات

## الحل: استرجاع الإسكيم الأصلي

### الخطوة 1: تطبيق الإسكيم الأصلي في Supabase

1. **اذهب إلى لوحة تحكم Supabase**
2. **افتح SQL Editor**
3. **انسخ محتوى ملف `sql/restore_original_schema.sql`**
4. **اضغط Run لتنفيذ الإسكيم**

### الخطوة 2: التحقق من التطبيق

بعد تطبيق الإسكيم، يجب أن تجد الجداول التالية:

#### الجداول الرئيسية:
- `car_showcase` - السيارات (مع `image_url` كـ `text[]`)
- `customers` - العملاء
- `users` - المستخدمين
- `installment_rules` - قواعد الأقساط
- `financing_requests` - طلبات التمويل
- `finance_transactions` - العمليات المالية
- `wallets` - المحافظ
- `wallet_transactions` - معاملات المحافظ

#### البيانات التجريبية:
- 4 سيارات مختلفة
- 2 عملاء
- 2 مستخدمين
- 2 قواعد أقساط
- 2 طلبات تمويل
- محافظ تجريبية

### الخطوة 3: التحقق من عمل المنصة

1. **تشغيل الخادم:**
   ```bash
   pnpm dev --port 3000
   ```

2. **اختبار الصفحات:**
   - `http://localhost:3000/cars` - صفحة السيارات
   - `http://localhost:3000/car-finance` - صفحة ملخص التمويل
   - `http://localhost:3000/api/cars` - API السيارات
   - `http://localhost:3000/api/finance/summary` - API ملخص التمويل

### التغييرات الرئيسية في الكود:

#### 1. تحديث interface Car:
```typescript
interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  image_url: string[] | null;  // مصفوفة نصوص (كما كان أصلاً)
  color: string;
  mileage: number;
  fuel_type: string;
  transmission: string;
  description: string;
}
```

#### 2. تحديث عرض الصور:
```typescript
// عرض الصورة الرئيسية أو أول صورة من المصفوفة
{(car.image_url && car.image_url.length > 0) ? (
  <Image
    src={car.image_url[0]}
    alt={`${car.make} ${car.model}`}
    fill
    className="object-cover"
  />
) : (
  <div className="flex items-center justify-center h-full text-black font-bold text-lg">
    لا توجد صورة
  </div>
)}
```

#### 3. تحديث سلايدر الصور:
```typescript
{car.image_url?.map((img, idx) => (
  <button
    key={idx}
    onClick={() => setSelectedImage(img)}
    className={`border rounded-lg p-1 ${selectedImage === img ? "border-blue-600" : "border-gray-200"}`}
  >
    <Image src={img} alt="صورة مصغرة" width={80} height={60} className="object-cover rounded" />
  </button>
))}
```

### Function لحساب الملخص المالي:

تم إضافة Function `get_financial_summary()` في قاعدة البيانات لحساب:
- إجمالي الأقساط الشهرية
- إجمالي الدخل السنوي
- إجمالي تكلفة الشراء
- الربح السنوي
- متوسط ROI السنوي والكامل
- إجمالي الدفعات الأولى والأخيرة

### الملفات المحدثة:

- ✅ `src/app/cars/page.tsx` - تحديث interface Car
- ✅ `src/app/cars/[id]/page.tsx` - تحديث عرض الصور
- ✅ `src/app/api/cars/route.ts` - تحديث API السيارات
- ✅ `src/app/api/finance/summary/route.ts` - تحديث API ملخص التمويل
- ✅ `sql/restore_original_schema.sql` - الإسكيم الأصلي

### التحقق من النجاح:

1. **صفحة السيارات تعرض الصور بشكل صحيح**
2. **سلايدر الصور يعمل في صفحة التفاصيل**
3. **صفحة ملخص التمويل تعرض البيانات الصحيحة**
4. **لا توجد أخطاء في وحدة التحكم**

### ملاحظات مهمة:

- **image_url** الآن هو `text[]` (مصفوفة) وليس `string`
- **المنطق المالي** يعتمد على Function الأصلية في قاعدة البيانات
- **البيانات التجريبية** متوفرة للاختبار
- **جميع العلاقات** بين الجداول محفوظة

---

**إذا واجهت أي مشكلة، تأكد من:**
1. تطبيق الإسكيم بنجاح في Supabase
2. تشغيل الخادم على المنفذ 3000
3. مراجعة وحدة التحكم للأخطاء
4. التحقق من متغيرات البيئة في `.env.local` 