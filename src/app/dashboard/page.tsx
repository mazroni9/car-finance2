import { supabase } from '@/lib/services/supabase'

interface DashboardStats {
  totalUsers: number
  totalTransactions: number
  totalRevenue: number
}

async function fetchDashboardStats(): Promise<DashboardStats> {
  const [users, transactions] = await Promise.all([
    supabase.from('users').select('count'),
    supabase.from('transactions').select('amount')
  ])

  if (users.error) throw users.error
  if (transactions.error) throw transactions.error

  const totalRevenue = transactions.data.reduce((sum, tx) => sum + (tx.amount || 0), 0)

  return {
    totalUsers: users.count || 0,
    totalTransactions: transactions.data.length,
    totalRevenue
  }
}

export default async function DashboardPage() {
  const stats = await fetchDashboardStats()

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Users</h2>
          <p className="text-3xl">{stats.totalUsers}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Transactions</h2>
          <p className="text-3xl">{stats.totalTransactions}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Revenue</h2>
          <p className="text-3xl">${stats.totalRevenue.toFixed(2)}</p>
        </div>
      </div>
    </div>
  )
} 