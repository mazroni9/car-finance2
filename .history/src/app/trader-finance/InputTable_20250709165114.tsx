"use client";
import React from 'react';

export default function InputTable({ entries, setEntries }) {
  const handleChange = (index, field, value) => {
    const newEntries = [...entries];
    newEntries[index][field] = value;
    setEntries(newEntries);
  };

  const addRow = () => {
    setEntries([
      ...entries,
      {
        financingRate: '',
        monthlySubscription: '',
        subscribers: '',
        dealers: '',
        operationsPerDealer: '',
        capitalPerDealer: '',
        transferFee: '',
        floorFee: ''
      }
    ]);
  };

  const removeRow = (index) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-3">إدخال بيانات الشرائح</h2>
      <table className="table-auto w-full border mb-3">
        <thead>
          <tr className="bg-gray-100">
            <th>نسبة التمويل</th>
            <th>الاشتراك الشهري</th>
            <th>عدد المشتركين</th>
            <th>عدد المعارض</th>
            <th>عمليات/تاجر</th>
            <th>رأس المال</th>
            <th>رسوم نقل الملكية</th>
            <th>رسوم الأرضية</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {entries.map((row, i) => (
            <tr key={i}>
              {Object.keys(row).map((field) => (
                <td key={field} className="border p-1">
                  <input
                    type="number"
                    value={row[field]}
                    onChange={(e) => handleChange(i, field, e.target.value)}
                    className="w-full p-1 border rounded"
                  />
                </td>
              ))}
              <td>
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
      <button
        onClick={addRow}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        إضافة شريحة جديدة
      </button>
    </div>
  );
}
