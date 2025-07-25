interface Transaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  created_at: string;
}

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-right font-bold">التاريخ</th>
              <th className="px-6 py-3 text-right font-bold">النوع</th>
              <th className="px-6 py-3 text-right font-bold">الوصف</th>
              <th className="px-6 py-3 text-right font-bold">المبلغ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(transaction.created_at).toLocaleDateString('ar-SA')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold ${
                      transaction.type === 'credit'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {transaction.type === 'credit' ? 'إيداع' : 'سحب'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {transaction.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={
                      transaction.type === 'credit'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }
                  >
                    {transaction.amount.toLocaleString()} ريال
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 