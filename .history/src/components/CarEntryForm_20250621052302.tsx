"use client";

import { useState } from 'react';
import { Input } from './ui/input';
import { Select } from './ui/select';
import { Button } from './ui/button';
import { Card, CardHeader, CardContent } from './ui/card';

interface CarData {
  model: string;
  year: number;
  purchasePrice: number;
  category: 'economy' | 'mid' | 'luxury';
  ownershipTransferFee: number;
  purchaseCommission: number;
  insurance: number;
  repairs: number;
  inspectionCost: number;
  warrantyCost: number;
  trackingCost: number;
  additionalCosts: number;
  notes: string;
}

const defaultCarData: CarData = {
  model: '',
  year: new Date().getFullYear(),
  purchasePrice: 0,
  category: 'economy',
  ownershipTransferFee: 382, // ثابتة
  purchaseCommission: 200, // تتغير حسب الفئة
  insurance: 0,
  repairs: 0,
  inspectionCost: 300,
  warrantyCost: 500,
  trackingCost: 250,
  additionalCosts: 0,
  notes: ''
};

export default function CarEntryForm() {
  const [formData, setFormData] = useState<CarData>(defaultCarData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // حساب العمولة حسب فئة السيارة
  const calculateCommission = (category: string) => {
    switch (category) {
      case 'economy': return 200;
      case 'mid': return 300;
      case 'luxury': return 400;
      default: return 200;
    }
  };

  // حساب إجمالي التكاليف
  const calculateTotalCost = () => {
    const total = 
      formData.purchasePrice +
      formData.ownershipTransferFee +
      formData.purchaseCommission +
      formData.insurance +
      formData.repairs +
      formData.inspectionCost +
      formData.warrantyCost +
      formData.trackingCost +
      formData.additionalCosts;
    
    return total;
  };

  const handleCategoryChange = (category: CarData['category']) => {
    setFormData({
      ...formData,
      category,
      purchaseCommission: calculateCommission(category)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          totalCost: calculateTotalCost()
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'فشل في إضافة السيارة');
      }

      setSuccess(true);
      setFormData(defaultCarData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold">إضافة سيارة جديدة للمخزون</h2>
        {error && (
          <div className="error-message mt-2">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-2 p-2 bg-green-500/20 text-green-700 rounded-lg">
            تم إضافة السيارة بنجاح
          </div>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">موديل السيارة</label>
              <Input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                required
                placeholder="مثال: تويوتا كامري"
              />
            </div>

            <div>
              <label className="form-label">سنة الصنع</label>
              <Input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                required
                min={2000}
                max={new Date().getFullYear() + 1}
              />
            </div>

            <div>
              <label className="form-label">سعر الشراء</label>
              <Input
                type="number"
                value={formData.purchasePrice}
                onChange={(e) => setFormData({ ...formData, purchasePrice: Number(e.target.value) })}
                required
                placeholder="مثال: 50000"
              />
            </div>

            <div>
              <label className="form-label">فئة السيارة</label>
              <Select
                value={formData.category}
                onChange={(e) => handleCategoryChange(e.target.value as CarData['category'])}
                required
              >
                <option value="economy">اقتصادية</option>
                <option value="mid">متوسطة</option>
                <option value="luxury">فاخرة</option>
              </Select>
            </div>

            <div>
              <label className="form-label">رسوم نقل الملكية</label>
              <Input
                type="number"
                value={formData.ownershipTransferFee}
                disabled
              />
            </div>

            <div>
              <label className="form-label">عمولة الشراء</label>
              <Input
                type="number"
                value={formData.purchaseCommission}
                disabled
              />
            </div>

            <div>
              <label className="form-label">تكلفة التأمين</label>
              <Input
                type="number"
                value={formData.insurance}
                onChange={(e) => setFormData({ ...formData, insurance: Number(e.target.value) })}
                placeholder="أدخل تكلفة التأمين"
              />
            </div>

            <div>
              <label className="form-label">تكاليف الإصلاحات</label>
              <Input
                type="number"
                value={formData.repairs}
                onChange={(e) => setFormData({ ...formData, repairs: Number(e.target.value) })}
                placeholder="تكاليف الإصلاحات إن وجدت"
              />
            </div>

            <div>
              <label className="form-label">تكلفة الفحص</label>
              <Input
                type="number"
                value={formData.inspectionCost}
                onChange={(e) => setFormData({ ...formData, inspectionCost: Number(e.target.value) })}
              />
            </div>

            <div>
              <label className="form-label">تكلفة الضمان</label>
              <Input
                type="number"
                value={formData.warrantyCost}
                onChange={(e) => setFormData({ ...formData, warrantyCost: Number(e.target.value) })}
              />
            </div>

            <div>
              <label className="form-label">تكلفة التتبع</label>
              <Input
                type="number"
                value={formData.trackingCost}
                onChange={(e) => setFormData({ ...formData, trackingCost: Number(e.target.value) })}
              />
            </div>

            <div>
              <label className="form-label">تكاليف إضافية</label>
              <Input
                type="number"
                value={formData.additionalCosts}
                onChange={(e) => setFormData({ ...formData, additionalCosts: Number(e.target.value) })}
                placeholder="أي تكاليف إضافية"
              />
            </div>
          </div>

          <div>
            <label className="form-label">ملاحظات</label>
            <textarea
              className="input-field h-24"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="أي ملاحظات إضافية عن السيارة"
            />
          </div>

          <div className="flex justify-between items-center mt-6">
            <div className="text-lg">
              <span className="font-bold">إجمالي التكلفة: </span>
              <span className="text-primary">{calculateTotalCost().toLocaleString()} ريال</span>
            </div>
            <div className="flex gap-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setFormData(defaultCarData)}
                disabled={loading}
              >
                إعادة تعيين
              </Button>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'جاري الإضافة...' : 'إضافة السيارة'}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 