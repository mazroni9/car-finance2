export default function ShowroomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#121212]">
      <main className="max-w-7xl mx-auto p-6">
        {children}
      </main>
    </div>
  );
} 