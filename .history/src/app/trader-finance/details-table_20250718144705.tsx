"use client";
import React from 'react';

type Detail = {
  id: number;
  financingRate: number;
  capital: number;
  operationsMonthly: number;
};

type DetailsTableProps = {
  details: Detail[];
  setDetails: (newDetails: Detail[]) => void;
  financingRates: number[];
};

export default function DetailsTable({ details, setDetails, financingRates }: DetailsTableProps) {
  const handleChange = (index: number, field: keyof Detail, value: string | number) => {
    const newDetails = [...details];
    newDetails[index][field] = typeof value === 'string' ? Number(value) : value;
    setDetails(newDetails);
  };

  const addRow = () => {
    setDetails([
      ...details,
      {
        id: details.length + 1,
        financingRate: financingRates[0],
        capital: 0,
        operationsMonthly: 0
      }
    ]);
  };

  const removeRow = (index: number) => {
    setDetails(details.filter((_, i) => i !== index));
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 text-center">تفاصيل المشتركين</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border mb-3">
          <thead>
            <tr className="bg-blue-800">
              <th className="text-white p-2">رقم المشترك</th>
              <th className="text-white p-2">نسبة التمويل (%)</th>
              <th className="text-white p-2">رأس المال (ريال)</th>
              <th className="text-white p-2">عدد العمليات في هذا الشهر</th>
              <th className="text-white p-2">عمولة المنصة (ريال)</th>
              <th className="text-white p-2"></th>
            </tr>
          </thead>
          <tbody>
            {details.map((row, i) => (
              <tr key={i}>
                <td className="border p-1 text-center">{row.id}</td>
                <td className="border p-1">
                  <select
                    value={row.financingRate}
                    onChange={(e) => handleChange(i, 'financingRate', e.target.value)}
                    className="w-full p-1 border rounded"
                  >
                    {financingRates.map((rate) => (
                      <option key={rate} value={rate}>{rate}%</option>
                    ))}
                  </select>
                </td>
                <td className="border p-1">
                  <input
                    type="number"
                    value={row.capital}
                    onChange={(e) => handleChange(i, 'capital', e.target.value)}
                    className="w-full p-1 border rounded"
                  />
                </td>
                <td className="border p-1">
                  <input
                    type="number"
                    value={row.operationsMonthly}
                    onChange={(e) => handleChange(i, 'operationsMonthly', e.target.value)}
                    className="w-full p-1 border rounded"
                  />
                </td>
                <td className="border p-1 text-center text-green-700 font-bold">0</td>
                <td className="border p-1 text-center">
                  <button
                    onClick={() => removeRow(i)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-center">
        <button
          onClick={addRow}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow"
        >
          إضافة مشترك جديد
        </button>
      </div>
    </div>
  );
}
