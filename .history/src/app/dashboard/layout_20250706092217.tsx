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
          
          {/* قسم إدارة المعارض */}
          <div className="w-full pt-4 mt-4 border-t border-gray-700">
            <h3 className="text-sm font-medium text-gray-400 mb-2 text-center">إدارة المعارض</h3>
            <Link href="/dashboard/showrooms" className="w-full text-center hover:bg-white/10 py-2 rounded transition-colors block">
              🏢 قائمة المعارض
            </Link>
            <Link href="/dashboard/showroom-requests" className="w-full text-center hover:bg-white/10 py-2 rounded transition-colors block">
              📥 طلبات الانضمام
            </Link>
            <Link href="/dashboard/showroom-reports" className="w-full text-center hover:bg-white/10 py-2 rounded transition-colors block">
              📈 تقارير المعارض
            </Link>
          </div>

          <Link href="/dashboard/wallets" className="w-full text-center hover:bg-white/10 py-2 rounded transition-colors">
            👛 Wallets
          </Link>
          <Link href="/dashboard/subscriptions" className="w-full text-center hover:bg-white/10 py-2 rounded transition-colors">
            📝 Subscriptions
          </Link>
          <Link href="/dashboard/users" className="w-full text-center hover:bg-white/10 py-2 rounded transition-colors">
            👥 Users
          </Link>
          
          {/* رابط التسجيل اليدوي */}
          <div className="w-full pt-4 mt-4 border-t border-gray-700">
            <Link href="/dashboard/admin/manual-registration" className="w-full text-center hover:bg-white/10 py-2 rounded transition-colors block">
              🧾 تسجيل يدوي
            </Link>
          </div>
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
