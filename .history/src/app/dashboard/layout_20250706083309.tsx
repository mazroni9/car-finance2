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
      }}>
        <h2 className="text-xl font-bold mb-6">Admin Dashboard</h2>
        <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Link href="/dashboard/summary">📊 Summary</Link>
          <Link href="/dashboard/admin-report">📋 Admin Report</Link>
          <Link href="/dashboard/platform-wallet">💰 رصيد المنصة</Link>
          <Link href="/dashboard/showroom-wallets">🏪 محافظ المعارض</Link>
          <Link href="/dashboard/wallets">👛 Wallets</Link>
          <Link href="/dashboard/subscriptions">📝 Subscriptions</Link>
          <Link href="/dashboard/users">👥 Users</Link>
          
          {/* رابط التسجيل اليدوي */}
          <div className="mt-2 border-t border-gray-700 pt-2">
            <Link href="/dashboard/admin/manual-registration">
              🧾 تسجيل يدوي
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "20px", backgroundColor: "#121212", color: "#fff", overflowY: "auto" }}>
        {children}
      </main>
    </div>
  );
}
