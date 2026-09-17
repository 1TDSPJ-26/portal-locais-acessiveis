import { Routes, Route } from 'react-router';
import NotFound  from "../pages/NotFound";
import Home from '../pages/Home';
import LocaisPage from '../pages/LocaisPage';
import Cadastro from '../pages/Cadastro';
import Sobre from '../pages/Sobre';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/locais" element={<LocaisPage />} />
      <Route path="/cadastrar" element={<Cadastro />} />
      <Route path="/sobre" element={<Sobre />} />
      <Route path="*" element={<NotFound/>} />
    </Routes>
  );
}
