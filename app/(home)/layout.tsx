import { Header } from '@/modules/home/header';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background">
      <Header />
      {children}
    </div>
  );
}
