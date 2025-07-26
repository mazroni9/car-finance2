interface WalletSummaryProps {
  balance: number;
  transactions: {
    id: string;
    amount: number;
    type: 'credit' | 'debit';
    created_at: string;
  }[];
}

export function WalletSummary({ balance, transactions }: WalletSummaryProps) {
  const totalIncome = transactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-bold mb-2">الرصيد الحالي</h3>
        <p className="text-3xl font-bold text-blue-600">
          {balance.toLocaleString()} ريال
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-bold mb-2">إجمالي الدخل</h3>
        <p className="text-3xl font-bold text-green-600">
          {totalIncome.toLocaleString()} ريال
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-bold mb-2">إجمالي المصروفات</h3>
        <p className="text-3xl font-bold text-red-600">
          {totalExpenses.toLocaleString()} ريال
        </p>
      </div>
    </div>
  );
} 