import { MainLayout } from "./layouts/MainLayout/MainLayout";
import AppRoutes from "./routes/AppRoutes";
import { PreferenciasProvider } from "./PreferenciasProvider";
import { LocaisProvider } from "./LocaisProvider";
import { LocalizacaoProvider } from "./LocalizacaoProvider";
import { FavoritosProvider } from "./FavoritosProvider";

export default function App() {
  return (
    <PreferenciasProvider>
      <LocaisProvider>
        <FavoritosProvider>
          <LocalizacaoProvider>
            <MainLayout>
              <AppRoutes />
            </MainLayout>
          </LocalizacaoProvider>
        </FavoritosProvider>
      </LocaisProvider>
    </PreferenciasProvider>
  );
}
