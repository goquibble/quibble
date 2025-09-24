import QuibletInfo from "@/components/quiblet-info";

export default function QuibletLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="mx-auto flex max-w-300 flex-1">
      <div className="flex flex-1 flex-col p-4 pr-2">{children}</div>
      <QuibletInfo />
    </div>
  );
}
