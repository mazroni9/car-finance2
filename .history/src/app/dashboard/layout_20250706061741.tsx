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
        <h2>Admin Dashboard</h2>
        <nav style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <Link href="/dashboard/summary" className="flex items-center gap-2">
            <span>📊</span>
            <span>Summary</span>
          </Link>
          <Link href="/dashboard/admin-report" className="flex items-center gap-2">
            <span>📋</span>
            <span>Admin Report</span>
          </Link>
          <Link href="/dashboard/wallets" className="flex items-center gap-2">
            <span>💰</span>
            <span>Wallets</span>
          </Link>
          <Link href="/dashboard/subscriptions" className="flex items-center gap-2">
            <span>📝</span>
            <span>Subscriptions</span>
          </Link>
          <Link href="/dashboard/users" className="flex items-center gap-2">
            <span>👥</span>
            <span>Users</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "20px", backgroundColor: "#121212", color: "#fff" }}>
        {children}
      </main>
    </div>
  );
}
