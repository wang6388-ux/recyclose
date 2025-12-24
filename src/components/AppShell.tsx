import BottomNav from "./BottomNav";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-md min-h-screen bg-white">
        <div className="pb-16">{children}</div>
        <BottomNav />
      </div>
    </div>
  );
}