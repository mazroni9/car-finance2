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
    <form onSubmit={handleSubmit} className={`bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto mt-10 space-y-4 ${className}`}>
      <h2 className="text-2xl font-bold mb-4 text-center">ادخل معلومات سياراتك</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-bold mb-1">الماركة</label>
          <input name="make" value={form.make} onChange={handleChange} className="input" required />
        </div>
        <div>
          <label className="block font-bold mb-1">الموديل</label>
          <input name="model" value={form.model} onChange={handleChange} className="input" required />
        </div>
        <div>
          <label className="block font-bold mb-1">السنة</label>
          <input name="year" type="number" value={form.year} onChange={handleChange} className="input" required />
        </div>
        <div>
          <label className="block font-bold mb-1">السعر</label>
          <input name="price" type="number" value={form.price} onChange={handleChange} className="input" required />
        </div>
        <div>
          <label className="block font-bold mb-1">اللون</label>
          <input name="color" value={form.color} onChange={handleChange} className="input" required />
        </div>
        <div>
          <label className="block font-bold mb-1">المسافة المقطوعة (كم)</label>
          <input name="mileage" type="number" value={form.mileage} onChange={handleChange} className="input" required />
        </div>
        <div>
          <label className="block font-bold mb-1">نوع الوقود</label>
          <select name="fuel_type" value={form.fuel_type} onChange={handleChange} className="input">
            <option value="بنزين">بنزين</option>
            <option value="ديزل">ديزل</option>
            <option value="كهرباء">كهرباء</option>
            <option value="هايبرد">هايبرد</option>
          </select>
        </div>
        <div>
          <label className="block font-bold mb-1">نوع القير</label>
          <select name="transmission" value={form.transmission} onChange={handleChange} className="input">
            <option value="أوتوماتيك">أوتوماتيك</option>
            <option value="عادي">عادي</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block font-bold mb-1">الوصف</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="input" rows={2} />
        </div>
        <div className="md:col-span-2">
          <label className="block font-bold mb-1">صور السيارة (يمكن اختيار أكثر من صورة)</label>
          <input type="file" accept="image/*" multiple onChange={handleImagesChange} className="input" required />
        </div>
        <div className="md:col-span-2">
          <label className="block font-bold mb-1">التقرير الفني (PDF)</label>
          <input type="file" accept="application/pdf" onChange={handleReportChange} className="input" />
        </div>
        <div className="md:col-span-2">
          <label className="block font-bold mb-1">استمارة السيارة (صورة، اختياري)</label>
          <input type="file" accept="image/*" onChange={handleRegistrationChange} className="input" />
        </div>
      </div>
      {error && <div className="text-red-600 text-center">{error}</div>}
      {success && <div className="text-green-600 text-center">تمت إضافة السيارة بنجاح!</div>}
      <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 text-lg disabled:opacity-50">
        {loading ? "جاري الإضافة..." : "إضافة السيارة"}
      </button>
    </form>
  );
} 