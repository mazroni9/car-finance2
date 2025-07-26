import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <aside style={{
        width: "220px",
        backgroundColor: "#111",
        color: "#fff",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        <h2 className="text-xl font-bold mb-6 text-blue-500">Admin Dashboard</h2>
        <nav className="flex flex-col items-center gap-4 w-full">
          <Link href="/dashboard/summary" className="w-full text-center hover:bg-white/10 py-2 rounded transition-colors">
            📊 Summary
          </Link>
          <Link href="/dashboard/admin-report" className="w-full text-center hover:bg-white/10 py-2 rounded transition-colors">
            📋 Admin Report
          </Link>
          <Link href="/dashboard/platform-wallet" className="w-full text-center hover:bg-white/10 py-2 rounded transition-colors">
            💰 رصيد المنصة
          </Link>
          <Link href="/dashboard/showroom-wallets" className="w-full text-center hover:bg-white/10 py-2 rounded transition-colors">
            🏪 محافظ المعارض
          </Link>
          <Link href="/dashboard/wallets" className="w-full text-center hover:bg-white/10 py-2 rounded transition-colors">
            👛 Wallets
          </Link>
          <Link href="/dashboard/wallet-balance" className="w-full text-center hover:bg-white/10 py-2 rounded transition-colors">
            🪙 تعديل رصيد المحافظ
          </Link>
          <Link href="/dashboard/financial-transactions" className="w-full text-center hover:bg-white/10 py-2 rounded transition-colors">
            📜 تقرير الحركات المالية
          </Link>
          <Link href="/dashboard/subscriptions" className="w-full text-center hover:bg-white/10 py-2 rounded transition-colors">
            📝 Subscriptions
          </Link>
          <Link href="/dashboard/users" className="w-full text-center hover:bg-white/10 py-2 rounded transition-colors">
            👥 Users
          </Link>
          <Link href="/dashboard/manual-registration" className="w-full text-center hover:bg-white/10 py-2 rounded transition-colors">
            🔍 Manual Registration
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "20px", backgroundColor: "#121212", color: "#fff", overflowY: "auto" }}>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-center text-blue-500"> منصة DASM-e   🎯</h1>
        </div>
        {children}
      </main>
    </div>
  );
}
