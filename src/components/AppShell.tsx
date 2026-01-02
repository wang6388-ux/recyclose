import BottomNav from "./BottomNav";

export default function AppShell({
  children,
  fullScreen = false,
}: {
  children: React.ReactNode;
  fullScreen?: boolean;
}) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-md min-h-screen bg-white relative overflow-hidden">
        {/* 给所有页面留出底部空间，避免被 BottomNav 挡住 */}
        <div className="pb-[88px]">{children}</div>

        <BottomNav />
      </div>
    </div>
  );
}
