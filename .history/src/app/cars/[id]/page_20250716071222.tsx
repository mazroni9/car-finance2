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
  image_url: string | null;
  images: string[] | null;
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
  // حساب الإجمالي
  const total = car && typeof platformFee === 'number' ? car.price + showroomFee + trafficFee + platformFee : null;

  const searchParams = useSearchParams();

  useEffect(() => {
    fetchCar(params.id).then((data) => {
      setCar(data);
      setSelectedImage(data?.image_url || data?.images?.[0] || null);
      setLoading(false);
    });
  }, [params.id]);

  useEffect(() => {
    if (searchParams.get("showCosts") === "1") setShowCosts(true);
  }, [searchParams]);

  // جلب عمولة المنصة ديناميكياً
  useEffect(() => {
    if (!car || typeof car.price !== 'number' || car.price <= 0) {
      console.warn('❌ السعر غير صالح أو السيارة لم تتحمل بعد');
      return;
    }

    async function fetchFee() {
      try {
        if (!car) return;
        console.log('✅ إرسال سعر السيارة إلى الحساب:', car.price);

        const res = await fetch('/api/platform-fee/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ salePrice: car.price })
        });

        const data = await res.json();
        console.log('✅ رد الحساب:', data);

        if (res.ok && typeof data.platformFee === 'number') {
          setPlatformFee(data.platformFee);
        } else {
          console.error('❌ لم يتم العثور على عمولة مناسبة في الرد:', data);
          setPlatformFee(null);
        }
      } catch (error) {
        console.error('❌ خطأ في جلب عمولة المنصة:', error);
        setPlatformFee(null);
      }
    }

    fetchFee();
  }, [car?.id, car?.price]);

  // دالة تنفيذ الشراء عبر API جديد
  const handleConfirmPurchase = async () => {
    setConfirming(true);
    setError(null);
    try {
      // مثال معرف المحافظ (يمكنك تعديلها حسب منطقك)
      const buyerWalletId = '00000000-0000-0000-0000-000000000001';
      const showroomWalletId = car?.seller_id || '2bf61df6-da52-45f1-88c4-05316e51df04';
      const platformWalletId = '00000000-0000-0000-0000-000000000002';
      const totalPrice = car && typeof car.price === 'number' ? car.price : 0;
      const res = await fetch('/api/purchase-car', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buyerWalletId, showroomWalletId, platformWalletId, totalPrice })
      });
      const data = await res.json();
      if (res.ok) {
        alert('تمت عملية الشراء بنجاح');
        setSuccess(true);
        router.push('/success');
      } else {
        alert(data.error || 'حدث خطأ أثناء تنفيذ الشراء');
        setError(data.error || 'حدث خطأ أثناء تنفيذ الشراء');
      }
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'خطأ غير متوقع';
      console.error('Error:', errorMessage);
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
        className="absolute top-0 left-0 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
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
            {car.images?.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`border rounded-lg p-1 ${selectedImage === img ? "border-blue-600" : "border-gray-200"}`}
                aria-label={`صورة مصغرة ${idx + 1}`}
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
                  <div>سعر السيارة: {car?.price?.toLocaleString('ar-SA')} ريال</div>
                  <div>عمولة المنصة: {platformFee !== null ? platformFee.toLocaleString('ar-SA') + ' ريال' : 'جار التحميل...'}</div>
                  <div>عمولة المعرض: {showroomFee.toLocaleString('ar-SA')} ريال</div>
                  <div>عمولة المرور: {trafficFee.toLocaleString('ar-SA')} ريال</div>
                  <div className="font-bold text-lg mt-2">الإجمالي: {total !== null ? total.toLocaleString('ar-SA') + ' ريال' : '---'}</div>
                </div>
                <button
                  className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition"
                  onClick={handleConfirmPurchase}
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
