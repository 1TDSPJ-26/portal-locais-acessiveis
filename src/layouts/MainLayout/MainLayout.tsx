import { useEffect, useRef, type ReactNode } from 'react';
import { Header } from '../../components/Header';
import { useLocation } from 'react-router';
import Footer from '../../components/Footer';

export function MainLayout({ children }: { children: ReactNode }) {
  const conteudoRef = useRef<HTMLElement>(null);

  const location = useLocation();
  const primeiroCarregamento = useRef(true);

  useEffect(() => {
    if (primeiroCarregamento.current) {
      primeiroCarregamento.current = false;
      return;
    }
    conteudoRef.current?.focus();
  }, [location.pathname]);

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
