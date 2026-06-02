import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Isio tlbr — PowerPoint Toolbar Guide",
  robots: { index: false, follow: false },
};

export default function IsioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
