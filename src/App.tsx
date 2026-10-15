import { MainLayout } from "./layouts/MainLayout/MainLayout";
import AppRoutes from "./routes/AppRoutes";
import { PreferenciasProvider } from "./PreferenciasProvider";
import { LocaisProvider } from "./LocaisProvider";
import { FavoritosProvider } from "./FavoritosProvider";

export default function App() {
  return (
    <PreferenciasProvider>
      <LocaisProvider>
        <FavoritosProvider>
          <MainLayout>
            <AppRoutes />
          </MainLayout>
        </FavoritosProvider>
      </LocaisProvider>
    </PreferenciasProvider>
  );
}
