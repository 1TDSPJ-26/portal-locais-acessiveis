import { Routes, Route } from 'react-router';
import Home from '../pages/Home';
import Locais from '../pages/Locais';
import Cadastro from '../pages/Cadastro';
import Sobre from '../pages/Sobre';
 
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/locais" element={<Locais />} />
      <Route path="/cadastrar" element={<Cadastro />} />
      <Route path="/sobre" element={<Sobre />} />
    </Routes>
  );
}