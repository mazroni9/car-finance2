# 🚀 دليل النشر - Deployment Guide

## 📋 نظرة عامة

هذا الدليل يوضح كيفية نشر مشروع نظام تمويل السيارات على منصات مختلفة.

## 🌐 النشر على Vercel (موصى به)

### 1. إعداد المشروع على Vercel

1. **إنشاء حساب على Vercel**
   - اذهب إلى [vercel.com](https://vercel.com)
   - سجل حساب جديد أو سجل الدخول

2. **ربط المستودع**
   - اضغط على "New Project"
   - اختر GitHub كمنصة
   - اختر مستودع `car-finance-3`
   - اضغط "Import"

3. **إعداد متغيرات البيئة**
   - في إعدادات المشروع، اذهب إلى "Environment Variables"
   - أضف المتغيرات التالية:

```env
NEXT_PUBLIC_SUPABASE_URL=https://uhdopxhxmrxwystnbmmp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoZG9weGh4bXJ4d3lzdG5ibW1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MTM1OTcsImV4cCI6MjA2NTk4OTU5N30.zOHoKktnz2qTpejeXKdJMhIpoy66uJ8FiD3WvmMDa5s
DATABASE_URL=postgresql://postgres:Maz232.5supabase@db.uhdopxhxmrxwystnbmmp.supabase.co:5432/postgres
NODE_ENV=production
```

4. **إعدادات البناء**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

5. **النشر**
   - اضغط "Deploy"
   - انتظر اكتمال عملية البناء
   - سيتم توفير رابط التطبيق

### 2. إعدادات إضافية

#### إعداد النطاق المخصص
1. اذهب إلى "Domains" في إعدادات المشروع
2. أضف النطاق المطلوب
3. اتبع التعليمات لتحديث DNS

#### إعدادات البيئة
- **Production**: للنشر النهائي
- **Preview**: للاختبار قبل النشر
- **Development**: للتطوير المحلي

## 🐳 النشر باستخدام Docker

### 1. إنشاء Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### 2. بناء وتشغيل الحاوية

```bash
# بناء الصورة
docker build -t car-finance-3 .

# تشغيل الحاوية
docker run -p 3000:3000 car-finance-3
```

## ☁️ النشر على AWS

### 1. إعداد EC2

```bash
# تحديث النظام
sudo apt update && sudo apt upgrade -y

# تثبيت Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# تثبيت PM2
sudo npm install -g pm2
```

### 2. استنساخ المشروع

```bash
git clone https://github.com/mazroni9/car-finance-3.git
cd car-finance-3
npm install
npm run build
```

### 3. تشغيل التطبيق

```bash
# تشغيل مع PM2
pm2 start npm --name "car-finance" -- start

# حفظ الإعدادات
pm2 save
pm2 startup
```

## 🔧 النشر المحلي

### 1. تثبيت التبعيات

```bash
npm install
```

### 2. إعداد متغيرات البيئة

```bash
cp .env.example .env.local
# تعديل المتغيرات حسب الحاجة
```

### 3. تشغيل التطبيق

```bash
# التطوير
npm run dev

# الإنتاج
npm run build
npm start
```

## 📊 مراقبة الأداء

### 1. Vercel Analytics

```bash
# تثبيت Vercel Analytics
npm install @vercel/analytics
```

### 2. إضافة المراقبة

```typescript
import { Analytics } from '@vercel/analytics/react';

export default function App() {
  return (
    <>
      <YourApp />
      <Analytics />
    </>
  );
}
```

## 🔒 الأمان

### 1. متغيرات البيئة

- لا تشارك متغيرات البيئة في الكود
- استخدم ملفات `.env.local` للتطوير المحلي
- استخدم متغيرات البيئة في Vercel للإنتاج

### 2. HTTPS

- Vercel يوفر HTTPS تلقائياً
- تأكد من تفعيل HTTPS في الإعدادات

### 3. CORS

```typescript
// إعداد CORS في API routes
export const config = {
  api: {
    externalResolver: true,
  },
};
```

## 🚨 استكشاف الأخطاء

### مشاكل شائعة

1. **خطأ في البناء**
   ```bash
   npm run build
   # تحقق من الأخطاء في Terminal
   ```

2. **مشاكل في قاعدة البيانات**
   - تحقق من متغيرات Supabase
   - تأكد من صحة الـ API keys

3. **مشاكل في الصور**
   - تحقق من إعدادات Cloudinary
   - تأكد من صحة الـ API keys

### سجلات الأخطاء

```bash
# Vercel
vercel logs

# PM2
pm2 logs car-finance

# Docker
docker logs container-name
```

## 📈 التحسينات

### 1. تحسين الأداء

```typescript
// استخدام Image Optimization
import Image from 'next/image';

// استخدام Dynamic Imports
const DynamicComponent = dynamic(() => import('./Component'));
```

### 2. تحسين SEO

```typescript
// إضافة Metadata
export const metadata = {
  title: 'Car Finance System',
  description: 'نظام تمويل السيارات المتكامل',
};
```

## 📞 الدعم

للحصول على المساعدة:
- إنشاء Issue في GitHub
- التواصل مع فريق التطوير
- مراجعة الوثائق

---

**آخر تحديث**: 26 يوليو 2025  
**الإصدار**: 1.0.0 