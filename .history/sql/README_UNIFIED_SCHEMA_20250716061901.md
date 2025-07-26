# الإسكيم الموحد لمنصة تمويل السيارات

## المشكلة الأصلية
كانت هناك تعارضات في تعريفات الجداول بين ملفات الإسكيم المختلفة، مما أدى إلى:
- عدم ظهور السيارات في الصفحة
- خطأ 500 في API `/api/cars`
- توقف سلايدر الصور

## الحل: الإسكيم الموحد

### 1. الملف الجديد: `sql/unified_schema.sql`
هذا الملف يجمع جميع الإسكيمات في مكان واحد منظم ويحل التعارضات.

### 2. التغييرات الرئيسية في جدول `car_showcase`:

**قبل التحديث:**
```sql
image_url text[] NULL,  -- مصفوفة نصوص
```

**بعد التحديث:**
```sql
image_url text NULL,     -- صورة رئيسية (نص واحد)
images text[] NULL,      -- روابط صور متعددة (Cloudinary)
```

### 3. كيفية تطبيق الإسكيم الموحد

#### الطريقة الأولى: عبر لوحة تحكم Supabase
1. اذهب إلى لوحة تحكم Supabase
2. افتح SQL Editor
3. انسخ محتوى ملف `sql/unified_schema.sql`
4. اضغط Run لتنفيذ الإسكيم

#### الطريقة الثانية: عبر السكريبت
```bash
node scripts/apply-unified-schema.js
```

### 4. التحديثات المطلوبة في الكود

#### أ. تحديث واجهة Car في `src/app/cars/page.tsx`:
```typescript
interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  image_url: string | null;  // صورة رئيسية (نص واحد)
  images: string[] | null;   // مصفوفة صور متعددة
  color: string;
  mileage: number;
  fuel_type: string;
  transmission: string;
  description: string;
}
```

#### ب. تحديث عرض الصور:
```typescript
// عرض الصورة الرئيسية أو أول صورة من المصفوفة
{(car.image_url || (car.images && car.images.length > 0)) ? (
  <Image
    src={car.image_url || car.images![0]}
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

#### ج. تحديث سلايدر الصور في `src/components/CarImageSlider.tsx`:
```typescript
// إضافة الصورة الرئيسية إذا كانت موجودة
if (car.image_url && typeof car.image_url === 'string') {
  allImages.push(car.image_url);
}
// إضافة الصور من المصفوفة إذا كانت موجودة
if (Array.isArray(car.images) && car.images.length > 0) {
  allImages.push(...car.images);
}
```

### 5. البيانات التجريبية المضمنة

الإسكيم الموحد يتضمن بيانات تجريبية:
- 4 سيارات مختلفة
- بيانات عملاء
- بيانات مستخدمين
- بيانات مستثمرين
- محافظ تجريبية
- قواعد تقسيط وأسعار

### 6. التحقق من التطبيق

بعد تطبيق الإسكيم، تحقق من:
1. زيارة `http://localhost:3000/cars` - يجب أن تظهر السيارات
2. زيارة `http://localhost:3000/api/cars` - يجب أن ترجع JSON مع البيانات
3. سلايدر الصور في الصفحة الرئيسية - يجب أن يعمل

### 7. إضافة طباعة الأخطاء

تم إضافة طباعة مفصلة في:
- `src/app/cars/page.tsx`
- `src/app/api/cars/route.ts`
- `src/components/CarImageSlider.tsx`

راقب الكونسول لمعرفة أي أخطاء.

### 8. الملفات المحدثة

- ✅ `sql/unified_schema.sql` - الإسكيم الموحد الجديد
- ✅ `src/app/cars/page.tsx` - تحديث واجهة Car
- ✅ `src/components/CarImageSlider.tsx` - تحديث سلايدر الصور
- ✅ `src/app/api/cars/route.ts` - تحسين طباعة الأخطاء
- ✅ `scripts/apply-unified-schema.js` - سكريبت تطبيق الإسكيم

### 9. الخطوات التالية

1. **طبق الإسكيم الموحد** على قاعدة البيانات
2. **أعد تشغيل السيرفر** (`pnpm dev --port 3000`)
3. **تحقق من الصفحات** للتأكد من عملها
4. **راقب الكونسول** لأي أخطاء

### 10. استكشاف الأخطاء

إذا استمرت المشكلة:
1. تحقق من متغيرات البيئة في `.env.local`
2. تأكد من تطبيق الإسكيم بنجاح
3. راقب كونسول السيرفر للأخطاء
4. تحقق من لوحة تحكم Supabase للتأكد من وجود الجداول

---

**ملاحظة:** هذا الإسكيم الموحد يحل جميع التعارضات ويضمن عمل المنصة بشكل صحيح. 