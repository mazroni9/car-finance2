# 🚗 Car Finance Dashboard - منصة تمويل السيارات

## 📋 نظرة عامة

منصة شاملة لإدارة تمويل السيارات والتأجير، مبنية بـ Next.js 14 و Supabase. تدعم جميع أنواع التمويل والتأجير مع واجهة عربية كاملة.

## ✨ الميزات الرئيسية

### 🏦 أنظمة التمويل
- **نظام التأجير المنتهي بالتمليك التقليدي** - تمويل تقليدي مع حسابات متقدمة
- **نظام التأجير المطور** - تأجير مع خيارات متعددة
- **تمويل التاجر** - نظام مخصص للتجار

### 🚗 إدارة السيارات
- معرض سيارات شامل (19 سيارة متنوعة)
- تفاصيل كاملة لكل سيارة
- نظام شراء متكامل
- صور عالية الجودة

### 📊 التقارير والتحليلات
- تقارير مالية مفصلة
- ملخصات شهرية وسنوية
- تصدير Excel و PDF
- رسوم بيانية تفاعلية

### 👥 إدارة المستخدمين
- لوحة تحكم للمدير
- إدارة المعارض
- نظام المحافظ المالية
- تتبع المعاملات

## 🛠️ التقنيات المستخدمة

- **Frontend:** Next.js 14, React 18, TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Deployment:** Vercel
- **Icons:** React Icons
- **Charts:** Recharts
- **PDF:** jsPDF
- **Excel:** xlsx

## 🚀 النشر على Vercel

### 1. إعداد المشروع
```bash
git clone [repository-url]
cd car-finance2
npm install
```

### 2. متغيرات البيئة
أضف المتغيرات التالية في Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=https://uhdopxhxmrxwystnbmmp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoZG9weGh4bXJ4d3lzdG5ibW1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MTM1OTcsImV4cCI6MjA2NTk4OTU5N30.zOHoKktnz2qTpejeXKdJMhIpoy66uJ8FiD3WvmMDa5s
DATABASE_URL=postgresql://postgres:Maz232.5supabase@db.uhdopxhxmrxwystnbmmp.supabase.co:5432/postgres
NODE_ENV=production
```

### 3. النشر
```bash
git add .
git commit -m "Production ready"
git push origin main
```

ثم اربط المستودع بـ Vercel وانتظر النشر.

## 📁 هيكل المشروع

```
src/
├── app/                    # صفحات التطبيق
│   ├── car-finance/       # نظام التمويل التقليدي
│   ├── car-leasing/       # نظام التأجير المطور
│   ├── trader-finance/    # تمويل التاجر
│   ├── cars/              # معرض السيارات
│   ├── dashboard/         # لوحة التحكم
│   └── api/              # API endpoints
├── components/            # المكونات المشتركة
├── lib/                   # المكتبات والخدمات
└── types/                # تعريفات TypeScript
```

## 🎯 الصفحات الرئيسية

- **الصفحة الرئيسية** (`/`) - نظرة عامة على المنصة
- **معرض السيارات** (`/cars`) - عرض جميع السيارات
- **نظام التمويل** (`/car-finance`) - حسابات التمويل التقليدي
- **نظام التأجير** (`/car-leasing`) - حسابات التأجير المطور
- **تمويل التاجر** (`/trader-finance`) - نظام التمويل للتجار
- **لوحة التحكم** (`/dashboard`) - إدارة النظام

## 🔧 التطوير المحلي

```bash
# تثبيت التبعيات
npm install

# تشغيل في وضع التطوير
npm run dev

# بناء للإنتاج
npm run build

# تشغيل الإنتاج محلياً
npm start
```

## 📊 قاعدة البيانات

المشروع يستخدم Supabase مع الجداول التالية:
- `car_showcase` - بيانات السيارات
- `installment_rules` - قواعد التمويل
- `users` - المستخدمين
- `wallets` - المحافظ المالية
- `transactions` - المعاملات

## 🎨 التصميم

- واجهة عربية كاملة (RTL)
- تصميم متجاوب (Responsive)
- ألوان متناسقة
- أيقونات واضحة
- تجربة مستخدم سلسة

## 🔒 الأمان

- مصادقة آمنة عبر Supabase
- حماية API endpoints
- تشفير البيانات الحساسة
- مراقبة الأخطاء

## 📞 الدعم

لأي استفسارات أو مشاكل، يرجى التواصل مع فريق التطوير.

---

**تم التطوير بـ ❤️ لمعرض محمد أحمد الزهراني وإخوانه للسيارات**
