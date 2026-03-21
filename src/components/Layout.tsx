import AnimatedNavbar from './AnimatedNavbar.tsx';
import Footer from './Footer.tsx';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <AnimatedNavbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
