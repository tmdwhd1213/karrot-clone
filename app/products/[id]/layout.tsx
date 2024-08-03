import UpperTabBar from "@/components/upper-tab-bar";

export default function TabLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <UpperTabBar />
      {children}
    </div>
  );
}
