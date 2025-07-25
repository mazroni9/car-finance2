"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showCosts, setShowCosts] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [platformFee, setPlatformFee] = useState<number | null>(null);
  const showroomFee = 117;
  const trafficFee = 383;
  const totalShowroom = showroomFee + trafficFee;
  const total = car && typeof platformFee === 'number' ? car.price + platformFee + showroomFee + trafficFee : 0;

  const searchParams = useSearchParams();

  useEffect(() => {
    fetchCar(params.id).then((data) => {
      setCar(data);
      setSelectedImage(data?.image_url?.[0] || null);
      setLoading(false);
    });
  }, [params.id]);

  useEffect(() => {
    if (searchParams.get("showCosts") === "1") setShowCosts(true);
  }, [searchParams]);

  // جلب عمولة المنصة ديناميكياً
  useEffect(() => {
    async function fetchFee() {
      if (!car?.price) return;
      try {
        const res = await fetch('/api/platform-fee/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ salePrice: car.price })
        });
        const data = await res.json();
        if (typeof data.platformFee === 'number') setPlatformFee(data.platformFee);
        else setPlatformFee(null);
      } catch {
        setPlatformFee(null);
      }
    }
    fetchFee();
  }, [car?.price]);

  const handleConfirm = async () => {
    setConfirming(true);
    setError(null);
    try {
      // تسوية صافي المبلغ للبائع
      const settlementResponse = await fetch("/api/settlements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: 'car_sale',
          amount: car?.price || 0,
          from_wallet: '00000000-0000-0000-0000-000000000001', // محفظة المشتري (افتراضية)
          to_wallet: car?.seller_id || '2bf61df6-da52-45f1-88c4-05316e51df04', // محفظة البائع
          car_id: car?.id,
          buyer_id: '00000000-0000-0000-0000-000000000001',
          seller_id: car?.seller_id || '2bf61df6-da52-45f1-88c4-05316e51df04',
          description: `بيع سيارة ${car?.make} ${car?.model} ${car?.year}`,
        }),
      });
      if (!settlementResponse.ok) {
        throw new Error("فشل في إنشاء تسوية بيع السيارة");
      }
      // تسوية عمولة المنصة
      if (typeof platformFee === 'number') {
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
      }
      // تسوية عمولة المعرض + المرور
      const showroomSettlementResponse = await fetch("/api/settlements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: 'showroom_fees',
          amount: totalShowroom,
          from_wallet: '00000000-0000-0000-0000-000000000001', // محفظة المشتري
          to_wallet: car?.seller_id || '2bf61df6-da52-45f1-88c4-05316e51df04', // محفظة المعرض
          car_id: car?.id,
          buyer_id: '00000000-0000-0000-0000-000000000001',
          seller_id: car?.seller_id || '2bf61df6-da52-45f1-88c4-05316e51df04',
          description: `رسوم المعرض والمرور لشراء ${car?.make} ${car?.model}`,
        }),
      });
      if (!showroomSettlementResponse.ok) {
        throw new Error("فشل في إنشاء تسوية رسوم المعرض والمرور");
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
    <div className="max-w-5xl mx-auto py-10 px-4 relative">
      {/* زر الرجوع */}
      <button
        onClick={() => router.back()}
        className="fixed top-4 right-4 z-50 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
      >
        عودة
      </button>
      {/* باقي الصفحة */}
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
              <div className="bg-blue-900 text-white rounded-lg p-6 mt-6">
                <h2 className="text-lg font-bold mb-4">ملخص التكاليف</h2>
                <div className="space-y-2">
                  <div>سعر السيارة: {car.price.toLocaleString('ar-SA')} ريال</div>
                  <div>عمولة المنصة: {platformFee !== null ? platformFee + ' ريال' : 'جاري التحميل...'}</div>
                  <div>عمولة المعرض: {showroomFee} ريال</div>
                  <div>عمولة المرور: {trafficFee} ريال</div>
                  <div className="font-bold">الإجمالي: {platformFee !== null ? total.toLocaleString('ar-SA') + ' ريال' : '---'}</div>
                </div>
                <button
                  className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition"
                  onClick={handleConfirm}
                  disabled={confirming || platformFee === null}
                >
                  {confirming ? 'جاري التأكيد...' : 'تأكيد الشراء'}
                </button>
                {error && <div className="text-red-500 mt-2">{error}</div>}
                {success && <div className="text-green-500 mt-2">تمت العملية بنجاح!</div>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
