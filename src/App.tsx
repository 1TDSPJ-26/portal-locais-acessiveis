import { MainLayout } from "./layouts/MainLayout/MainLayout";
import AppRoutes from "./routes/AppRoutes";
import { PreferenciasProvider } from "./PreferenciasProvider";

export default function App() {
  return (
    <PreferenciasProvider>
      <MainLayout>
        <AppRoutes />
      </MainLayout>
    </PreferenciasProvider>
  );
}
