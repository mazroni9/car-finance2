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
          <Link href="/dashboard/summary">📊 Summary</Link>
          <Link href="/dashboard/admin-report">Admin Report 📋</Link>
          <Link href="/dashboard/wallets">💰 Wallets</Link>
          <Link href="/dashboard/subscriptions">📝 Subscriptions</Link>
          <Link href="/dashboard/users">👥 Users</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "20px", backgroundColor: "#121212", color: "#fff" }}>
        {children}
      </main>
    </div>
  );
}
