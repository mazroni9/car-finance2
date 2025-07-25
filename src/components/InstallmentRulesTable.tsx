'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface InstallmentRule {
  id: string;
  price_category: number;
  duration_months: number;
  profit_target_percent: number;
  down_payment_value: number;
  last_payment_value: number;
  quantity: number;
  monthly_installment: number;
  monthly_income: number;
  annual_income: number;
  possible_purchase_amount: number;
  tracking_cost: number;
  guarantee_contract_cost: number;
  inspection_cost: number;
  profit_per_car: number;
  total_profit_full_period: number;
  roi_full_period: number;
  roi_annual: number;
}

interface GroupedRule {
  priceRange: string;
  terms: number[];
  profitPercentages: string[];
  averageROI: number;
  note: string;
}

export default function InstallmentRulesTable() {
  const [rules, setRules] = useState<InstallmentRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groupedRules, setGroupedRules] = useState<GroupedRule[]>([]);

  // جلب البيانات من API
  useEffect(() => {
    const fetchRules = async () => {
      try {
        const response = await fetch('/api/finance/rules');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setRules(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch rules');
      } finally {
        setLoading(false);
      }
    };

    fetchRules();
  }, []);

  // تجميع القواعد حسب الفئة السعرية
  useEffect(() => {
    if (rules.length === 0) return;

    const grouped = new Map<string, InstallmentRule[]>();
    
    // تجميع القواعد حسب الفئة السعرية
    rules.forEach(rule => {
      const priceCategory = rule.price_category;
      const key = priceCategory.toString();
      
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(rule);
    });

    // تحويل البيانات المجمعة إلى الشكل المطلوب
    const groupedArray: GroupedRule[] = Array.from(grouped.entries()).map(([priceCategory, ruleGroup]) => {
      const terms = [...new Set(ruleGroup.map(r => r.duration_months))].sort((a, b) => a - b);
      const profitPercentages = [...new Set(ruleGroup.map(r => `${r.profit_target_percent}%`))];
      const averageROI = ruleGroup.reduce((sum, r) => sum + r.roi_full_period, 0) / ruleGroup.length;
      
      // تحديد النطاق السعري
      const minPrice = Math.min(...ruleGroup.map(r => r.price_category));
      const maxPrice = Math.max(...ruleGroup.map(r => r.price_category));
      const priceRange = minPrice === maxPrice 
        ? `${minPrice.toLocaleString()} ريال`
        : `${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()} ريال`;

      // تحديد الملاحظة حسب النطاق السعري
      let note = "تقسيط عادي";
      if (maxPrice <= 20000) {
        note = "تقسيط قصير";
      } else if (maxPrice <= 35000) {
        note = "تقسيط متوسط";
      } else {
        note = "تقسيط طويل مع مرونة خصم";
      }

      return {
        priceRange,
        terms,
        profitPercentages,
        averageROI,
        note
      };
    });

    // ترتيب حسب السعر
    groupedArray.sort((a, b) => {
      const aMin = parseInt(a.priceRange.split(' - ')[0].replace(/,/g, ''));
      const bMin = parseInt(b.priceRange.split(' - ')[0].replace(/,/g, ''));
      return aMin - bMin;
    });

    setGroupedRules(groupedArray);
  }, [rules]);

  // حالة التحميل
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-4">
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  // حالة الخطأ
  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-4">
        <div className="text-center py-8 text-red-500">
          <p className="text-lg">❌ خطأ في جلب البيانات</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  // حالة عدم وجود بيانات
  if (groupedRules.length === 0) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-4">
        <div className="text-center py-8 text-gray-500">
          لا توجد قواعد تمويل متاحة
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h2 className="text-xl font-bold mb-4">قواعد الربح حسب الفئة السعرية</h2>
      <div className="grid gap-4">
        {groupedRules.map((rule, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <p><strong>السعر:</strong> {rule.priceRange}</p>
              <p><strong>المدة المسموحة:</strong> {rule.terms.join('، ')} شهر</p>
              <p><strong>نسبة الربح:</strong> {rule.profitPercentages.join('، ')}</p>
              <p><strong>متوسط العائد على الاستثمار:</strong> {rule.averageROI.toFixed(2)}%</p>
              <p><strong>ملاحظة:</strong> {rule.note}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}