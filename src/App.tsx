import { MainLayout } from "./layouts/MainLayout/MainLayout";
import AppRoutes from "./routes/AppRoutes";
import { PreferenciasProvider } from "./PreferenciasProvider";
import { LocaisProvider } from "./LocaisProvider";

export default function App() {
  return (
    <PreferenciasProvider>
      <LocaisProvider>
        <MainLayout>
          <AppRoutes />
        </MainLayout>
      </LocaisProvider>
    </PreferenciasProvider>
  );
}
