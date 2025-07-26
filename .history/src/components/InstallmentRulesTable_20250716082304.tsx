import { Card, CardContent } from "@/components/ui/card";

const rules = [
  {
    min: 0,
    max: 20000,
    terms: [12, 15, 18],
    profit: "30%",
    note: "تقسيط قصير"
  },
  {
    min: 21000,
    max: 35000,
    terms: [24, 27, 30],
    profit: "50%",
    note: "تقسيط متوسط"
  },
  {
    min: 36000,
    max: 60000,
    terms: [34, 37, 40],
    profit: "60% (خصم حتى 55%)",
    note: "تقسيط طويل مع مرونة خصم"
  }
];

export default function InstallmentRulesTable() {
  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h2 className="text-xl font-bold mb-4">قواعد الربح حسب الفئة السعرية</h2>
      <div className="grid gap-4">
        {rules.map((r, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <p><strong>السعر:</strong> من {r.min.toLocaleString()} إلى {r.max.toLocaleString()} ريال</p>
              <p><strong>المدة المسموحة:</strong> {r.terms.join('، ')} شهر</p>
              <p><strong>نسبة الربح:</strong> {r.profit}</p>
              <p><strong>ملاحظة:</strong> {r.note}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}