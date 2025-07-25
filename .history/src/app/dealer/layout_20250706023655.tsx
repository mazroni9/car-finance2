import { DealerSidebar } from '@/components/DealerSidebar';

export default function DealerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <DealerSidebar />
      <main className="flex-1 p-8 bg-gray-50">
        {children}
      </main>
    </div>
  );
} 