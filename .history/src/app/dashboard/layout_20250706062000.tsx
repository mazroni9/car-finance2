import Link from "next/link";
import PlatformWalletSummary from '@/components/PlatformWalletSummary';

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
        
        {/* Platform Wallet Summary */}
        <div className="bg-gray-800 rounded-lg p-4">
          <PlatformWalletSummary />
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Link href="/dashboard/summary">📊 Summary</Link>
          <Link href="/dashboard/admin-report">📋 Admin Report</Link>
          <Link href="/dashboard/wallets">💰 Wallets</Link>
          <Link href="/dashboard/subscriptions">📝 Subscriptions</Link>
          <Link href="/dashboard/users">👥 Users</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "20px", backgroundColor: "#121212", color: "#fff", overflowY: "auto" }}>
        {children}
      </main>
    </div>
  );
}
