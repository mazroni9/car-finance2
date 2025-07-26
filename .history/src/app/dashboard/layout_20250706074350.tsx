import Link from "next/link";
import PlatformWalletSummary from '@/components/PlatformWalletSummary';
import ShowroomWalletsSidebar from '@/components/admin/ShowroomWalletsSidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <aside style={{
        width: "280px",
        backgroundColor: "#111",
        color: "#fff",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        overflowY: "auto"
      }}>
        <h2 className="text-xl font-bold">Admin Dashboard</h2>
        
        <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Link href="/dashboard/summary">📊 Summary</Link>
          <Link href="/dashboard/admin-report">📋 Admin Report</Link>
          <Link href="/dashboard/platform-wallet">💰 رصيد المنصة</Link>
          <Link href="/dashboard/wallets">👛 Wallets</Link>
          <Link href="/dashboard/subscriptions">📝 Subscriptions</Link>
          <Link href="/dashboard/users">👥 Users</Link>
        </nav>

        {/* محافظ المعارض */}
        <div className="mt-4">
          <ShowroomWalletsSidebar />
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "20px", backgroundColor: "#121212", color: "#fff", overflowY: "auto" }}>
        {children}
      </main>
    </div>
  );
}
