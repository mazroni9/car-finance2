"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  image_url: string[];
  color: string;
  mileage: number;
  fuel_type: string;
  transmission: string;
  description: string;
  technical_report_url?: string;
  registration_image_url?: string;
  seller_id?: string;
}

async function fetchCar(id: string): Promise<Car | null> {
  const res = await fetch(`/api/cars?id=${id}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data;
}

export default function CarDetailsPage({ params }: { params: { id: string } }) {
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showCosts, setShowCosts] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [platformFee, setPlatformFee] = useState<number | null>(null);

  useEffect(() => {
    fetchCar(params.id).then((data) => {
      setCar(data);
      setSelectedImage(data?.image_url?.[0] || null);
      setLoading(false);
    });
  }, [params.id]);

  // جلب عمولة المنصة ديناميكياً
  useEffect(() => {
    async function fetchFee() {
      if (!car?.price) return;
      try {
        const res = await fetch('/api/platform-fee/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ salePrice: car.price, feeType: 'car_sale' })
        });
        const data = await res.json();
        if (data.feeValue !== undefined) setPlatformFee(data.feeValue);
        else setPlatformFee(null);
      } catch {
        setPlatformFee(null);
      }
    }
    fetchFee();
  }, [car?.price]);

  const showroomFee = 383;
  const total = car && platformFee !== null ? car.price + platformFee + showroomFee : 0;

  const handleConfirm = async () => {
    setConfirming(true);
    setError(null);
    
    try {
      // إنشاء تسوية بيع السيارة
      const settlementResponse = await fetch("/api/settlements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: 'car_sale',
          amount: car?.price || 0,
          from_wallet: '00000000-0000-0000-0000-000000000001', // محفظة المشتري (افتراضية)
          to_wallet: car?.seller_id || '2bf61df6-da52-45f1-88c4-05316e51df04', // محفظة البائع
          car_id: car?.id,
          buyer_id: '00000000-0000-0000-0000-000000000001', // معرف المشتري (افتراضي)
          seller_id: car?.seller_id || '2bf61df6-da52-45f1-88c4-05316e51df04', // معرف البائع
          description: `بيع سيارة ${car?.make} ${car?.model} ${car?.year}`,
        }),
      });

      if (!settlementResponse.ok) {
        throw new Error("فشل في إنشاء تسوية بيع السيارة");
      }

      const settlementData = await settlementResponse.json();

      // إنشاء تسوية رسوم المنصة
      const platformSettlementResponse = await fetch("/api/settlements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: 'platform_fee',
          amount: platformFee,
          from_wallet: '00000000-0000-0000-0000-000000000001', // محفظة المشتري
          to_wallet: '00000000-0000-0000-0000-000000000002', // محفظة المنصة
          car_id: car?.id,
          buyer_id: '00000000-0000-0000-0000-000000000001',
          seller_id: car?.seller_id || '2bf61df6-da52-45f1-88c4-05316e51df04',
          description: `رسوم المنصة لشراء ${car?.make} ${car?.model}`,
        }),
      });

      if (!platformSettlementResponse.ok) {
        throw new Error("فشل في إنشاء تسوية رسوم المنصة");
      }

      // إنشاء تسوية رسوم المعرض
      const showroomSettlementResponse = await fetch("/api/settlements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: 'showroom_fee',
          amount: showroomFee,
          from_wallet: '00000000-0000-0000-0000-000000000001', // محفظة المشتري
          to_wallet: car?.seller_id || '2bf61df6-da52-45f1-88c4-05316e51df04', // محفظة المعرض
          car_id: car?.id,
          buyer_id: '00000000-0000-0000-0000-000000000001',
          seller_id: car?.seller_id || '2bf61df6-da52-45f1-88c4-05316e51df04',
          description: `رسوم المعرض لشراء ${car?.make} ${car?.model}`,
        }),
      });

      if (!showroomSettlementResponse.ok) {
        throw new Error("فشل في إنشاء تسوية رسوم المعرض");
      }

      setSuccess(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setConfirming(false);
    }
  };

  if (loading) return <div className="p-8 text-center">جاري تحميل التفاصيل...</div>;
  if (!car) return <div className="p-8 text-center text-red-600">لم يتم العثور على السيارة</div>;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row gap-8">
        {/* معرض الصور */}
        <div className="md:w-1/2">
          <div className="border rounded-lg overflow-hidden mb-4 bg-white flex items-center justify-center min-h-[320px]">
            {selectedImage ? (
              <Image src={selectedImage} alt="صورة السيارة" width={500} height={320} className="object-contain max-h-80" />
            ) : (
              <div className="text-gray-400 text-lg p-8">لا توجد صورة</div>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {car.image_url?.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`border rounded-lg p-1 ${selectedImage === img ? "border-blue-600" : "border-gray-200"}`}
              >
                <Image src={img} alt="صورة مصغرة" width={80} height={60} className="object-cover rounded" />
              </button>
            ))}
          </div>
          {/* صورة استمارة السيارة */}
          {car.registration_image_url && (
            <div className="mt-4">
              <h4 className="font-bold mb-2">استمارة السيارة</h4>
              <Image src={car.registration_image_url} alt="استمارة السيارة" width={200} height={120} className="rounded border" />
            </div>
          )}
        </div>

        {/* معلومات السيارة وجدول التفاصيل */}
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-2xl font-bold mb-2">{car.make} {car.model} {car.year}</h1>
          <table className="w-full text-right border rounded-lg bg-white">
            <tbody>
              <tr><td className="font-bold text-black">السعر</td><td className="text-black">{typeof car.price === 'number' ? car.price.toLocaleString('ar-SA') + ' ريال' : 'غير متوفر'}</td></tr>
              <tr><td className="font-bold text-black">اللون</td><td className="text-black">{car.color}</td></tr>
              <tr><td className="font-bold text-black">المسافة المقطوعة</td><td className="text-black">{typeof car.mileage === 'number' ? car.mileage.toLocaleString('ar-SA') + ' كم' : 'غير متوفر'}</td></tr>
              <tr><td className="font-bold text-black">الوقود</td><td className="text-black">{car.fuel_type}</td></tr>
              <tr><td className="font-bold text-black">القير</td><td className="text-black">{car.transmission}</td></tr>
              <tr><td className="font-bold text-black">الوصف</td><td className="text-black">{car.description}</td></tr>
            </tbody>
          </table>

          {/* عرض التقرير الفني PDF */}
          {car.technical_report_url && (
            <div className="mt-4">
              <h4 className="font-bold mb-2">التقرير الفني</h4>
              <iframe src={car.technical_report_url} className="w-full h-64 border rounded" title="التقرير الفني" />
            </div>
          )}

          {/* زر إتمام الشراء */}
          <div className="mt-8">
            {!showCosts ? (
              <button
                onClick={() => setShowCosts(true)}
                className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 text-lg"
              >
                إتمام الشراء
              </button>
            ) : (
              <div className="bg-blue-900 p-4 rounded-lg border mt-4">
                <h3 className="font-bold mb-4 text-lg text-white">ملخص التكاليف</h3>
                <ul className="mb-4 space-y-2">
                  <li>سعر السيارة: <span className="font-bold text-white">{typeof car?.price === 'number' ? car.price.toLocaleString('ar-SA') + ' ريال' : 'غير متوفر'}</span></li>
                  <li>عمولة المنصة: <span className="font-bold text-white">{platformFee !== null ? platformFee.toLocaleString('ar-SA') + ' ريال' : 'جاري التحميل...'}</span></li>
                  <li>عمولة المعرض: <span className="font-bold text-white">{typeof showroomFee === 'number' ? showroomFee.toLocaleString('ar-SA') + ' ريال' : 'غير متوفر'}</span></li>
                  <li>الإجمالي: <span className="font-bold text-yellow-300">{typeof total === 'number' ? total.toLocaleString('ar-SA') + ' ريال' : 'غير متوفر'}</span></li>
                </ul>
                {error && <div className="text-red-300 mb-2">{error}</div>}
                {success ? (
                  <div className="text-green-300 font-bold mb-2">
                    تم تنفيذ العملية بنجاح! 
                    <br />
                    <Link href="/dashboard/settlements" className="text-blue-300 underline">
                      عرض التسويات
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={handleConfirm}
                    disabled={confirming}
                    className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 text-lg disabled:opacity-50"
                  >
                    {confirming ? "جاري التنفيذ..." : "تأكيد الشراء"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
