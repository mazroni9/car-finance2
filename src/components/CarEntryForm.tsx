"use client";

import { useState } from "react";

interface CarForm {
  make: string;
  model: string;
  year: number;
  price: number;
  color: string;
  mileage: number;
  fuel_type: string;
  transmission: string;
  description: string;
  image_url: string[];
  technical_report_url?: string;
  registration_image_url?: string;
}

const initialState: CarForm = {
  make: "",
  model: "",
  year: new Date().getFullYear(),
  price: 0,
  color: "",
  mileage: 0,
  fuel_type: "بنزين",
  transmission: "أوتوماتيك",
  description: "",
  image_url: [],
};

export default function CarEntryForm({ className = "" }: { className?: string }) {
  const [form, setForm] = useState<CarForm>(initialState);
  const [images, setImages] = useState<File[]>([]);
  const [report, setReport] = useState<File | null>(null);
  const [registration, setRegistration] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // رفع ملف إلى Cloudinary
  const uploadToCloudinary = async (file: File, folder: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default"); // يجب ضبط upload_preset في Cloudinary
    formData.append("folder", folder);
    const res = await fetch("https://api.cloudinary.com/v1_1/dzbaenadw/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data.secure_url as string;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === "year" || name === "price" || name === "mileage" ? Number(value) : value }));
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleReportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReport(e.target.files[0]);
    }
  };

  const handleRegistrationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setRegistration(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      // رفع الصور
      let imageUrls: string[] = [];
      for (const img of images) {
        const url = await uploadToCloudinary(img, "cars");
        imageUrls.push(url);
      }
      // رفع التقرير الفني
      let reportUrl = "";
      if (report) {
        reportUrl = await uploadToCloudinary(report, "car_reports");
      }
      // رفع استمارة السيارة
      let registrationUrl = "";
      if (registration) {
        registrationUrl = await uploadToCloudinary(registration, "car_registrations");
      }
      // إرسال البيانات إلى API
      const res = await fetch("/api/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          image_url: imageUrls,
          technical_report_url: reportUrl || undefined,
          registration_image_url: registrationUrl || undefined,
        }),
      });
      if (!res.ok) throw new Error("فشل في إضافة السيارة");
      setSuccess(true);
      setForm(initialState);
      setImages([]);
      setReport(null);
      setRegistration(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`bg-white/80 rounded-2xl shadow-2xl p-8 max-w-xl w-full mx-auto border border-gray-200 backdrop-blur-md ${className}`}>
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-900 flex items-center justify-center gap-2">
        🚗 ادخل بيانات سيارتك
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-1">الماركة</label>
          <input name="make" value={form.make} onChange={handleChange} className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="مثال: تويوتا" required />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-1">الموديل</label>
          <input name="model" value={form.model} onChange={handleChange} className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="مثال: كامري" required />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-1">السنة</label>
          <input name="year" type="number" value={form.year} onChange={handleChange} className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="2024" required />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-1">السعر</label>
          <input name="price" type="number" value={form.price} onChange={handleChange} className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="مثال: 95000" required />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-1">اللون</label>
          <input name="color" value={form.color} onChange={handleChange} className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="أبيض" required />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-1">المسافة المقطوعة (كم)</label>
          <input name="mileage" type="number" value={form.mileage} onChange={handleChange} className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="0" required />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-1">نوع الوقود</label>
          <select name="fuel_type" value={form.fuel_type} onChange={handleChange} className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-200">
            <option value="بنزين">بنزين</option>
            <option value="ديزل">ديزل</option>
            <option value="كهرباء">كهرباء</option>
            <option value="هايبرد">هايبرد</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-1">نوع القير</label>
          <select name="transmission" value={form.transmission} onChange={handleChange} className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-200">
            <option value="أوتوماتيك">أوتوماتيك</option>
            <option value="عادي">عادي</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-1">الوصف</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-200" rows={2} placeholder="أي ملاحظات إضافية..." />
        </div>
        <div className="md:col-span-2">
          <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-1">صور السيارة</label>
          <input type="file" accept="image/*" multiple onChange={handleImagesChange} className="border border-gray-300 rounded-lg px-3 py-2 w-full bg-white" required />
        </div>
        <div className="md:col-span-2">
          <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-1">التقرير الفني (PDF)</label>
          <input type="file" accept="application/pdf" onChange={handleReportChange} className="border border-gray-300 rounded-lg px-3 py-2 w-full bg-white" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-gray-700 font-semibold mb-1 flex items-center gap-1">استمارة السيارة (صورة، اختياري)</label>
          <input type="file" accept="image/*" onChange={handleRegistrationChange} className="border border-gray-300 rounded-lg px-3 py-2 w-full bg-white" />
        </div>
      </div>
      {error && <div className="text-red-600 text-center">{error}</div>}
      {success && <div className="text-green-600 text-center">تمت إضافة السيارة بنجاح!</div>}
      <button type="submit" disabled={loading} className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-lg text-lg transition-all duration-200 disabled:opacity-50 mt-4 flex items-center justify-center gap-2">
        {loading ? "جاري الإضافة..." : <><span>إضافة السيارة</span> 🚀</>}
      </button>
    </form>
  );
} 