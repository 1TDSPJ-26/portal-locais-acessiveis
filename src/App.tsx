import { MainLayout } from './layouts/MainLayout/MainLayout';
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <MainLayout>
      <AppRoutes />
    </MainLayout>
  )
}