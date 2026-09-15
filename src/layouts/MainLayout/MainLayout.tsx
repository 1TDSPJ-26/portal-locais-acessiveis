
import type { ReactNode } from 'react';
import { Header } from '../../components/Header';
import Footer from '../../components/Footer';

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}