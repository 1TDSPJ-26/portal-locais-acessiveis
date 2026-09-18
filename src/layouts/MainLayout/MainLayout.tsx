
import { useRef, type ReactNode } from 'react';
import { Header } from '../../components/Header';
import Footer from '../../components/Footer';

export function MainLayout({ children }: { children: ReactNode }) {
  const conteudoRef = useRef<HTMLElement>(null);

  return (
    <>
      <a
        href="#conteudo-principal"
        className="skip-link"
        onClick={() => conteudoRef.current?.focus()}
      >
        Pular para o conteúdo
      </a>

      <Header />

      <main
        id="conteudo-principal"
        ref={conteudoRef}
        tabIndex={-1}
      >
        {children}
      </main>

      <Footer />
    </>
  );
}
