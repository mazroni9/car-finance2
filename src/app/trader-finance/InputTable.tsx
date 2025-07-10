"use client";
import React from 'react';

type Detail = {
  id: number;
  capital: number;
  operationsMonthly: number;
};

type InputTableProps = {
  details: Detail[];
  setDetails: (newDetails: Detail[]) => void;
  financingRate: number;
};

export default function InputTable({ details, setDetails, financingRate }: any) {
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
        capital: 0,
        operationsMonthly: 0
      }
    ]);
  };

  const removeRow = (index: number) => {
    setDetails(details.filter((_: any, i: number) => i !== index));
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 text-center">تفاصيل المشتركين</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border mb-3">
          <thead>
            <tr className="bg-blue-800">
              <th className="text-white p-2">رقم المشترك</th>
              <th className="text-white p-2">رأس المال (ريال)</th>
              <th className="text-white p-2">نسبة التمويل (%)</th>
              <th className="text-white p-2">قيمة التمويل الثابتة (ريال)</th>
              <th className="text-white p-2">عدد العمليات في هذا الشهر</th>
              <th className="text-white p-2"></th>
            </tr>
          </thead>
          <tbody>
            {details.map((row, i) => {
              const coverageValue = (Number(row.capital) || 0) * (financingRate / 100);
              return (
                <tr key={i}>
                  <td className="border p-1 text-center">{row.id}</td>
                  <td className="border p-1">
                    <input
                      type="number"
                      value={row.capital}
                      onChange={(e) => handleChange(i, 'capital', e.target.value)}
                      className="w-full p-1 border rounded"
                    />
                  </td>
                  <td className="border p-1 text-center">{financingRate}%</td>
                  <td className="border p-1 text-center">{Math.round(coverageValue).toLocaleString()}</td>
                  <td className="border p-1">
                    <input
                      type="number"
                      value={row.operationsMonthly}
                      onChange={(e) => handleChange(i, 'operationsMonthly', e.target.value)}
                      className="w-full p-1 border rounded"
                    />
                  </td>
                  <td className="border p-1 text-center">
                    <button
                      onClick={() => removeRow(i)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              );
            })}
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
