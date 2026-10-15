import { MainLayout } from "./layouts/MainLayout/MainLayout";
import AppRoutes from "./routes/AppRoutes";
import { PreferenciasProvider } from "./PreferenciasProvider";
import { LocaisProvider } from "./LocaisProvider";
import { LocalizacaoProvider } from "./LocalizacaoProvider";

export default function App() {
  return (
    <PreferenciasProvider>
      <LocaisProvider>
        <LocalizacaoProvider>
          <MainLayout>
            <AppRoutes />
          </MainLayout>
        </LocalizacaoProvider>
      </LocaisProvider>
    </PreferenciasProvider>
  );
}
