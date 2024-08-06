import TabBar from "../../components/tab-bar";

export default function TabLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}
      <div className="flex items-center justify-center">
        <TabBar />
      </div>
    </div>
  );
}
