import UpperTabBar from "@/components/upper-tab-bar";
import { getIsOwner } from "./page";

export default async function TabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const isOwner = await getIsOwner();
  return (
    <div>
      {/* <UpperTabBar /> */}
      {children}
    </div>
  );
}
