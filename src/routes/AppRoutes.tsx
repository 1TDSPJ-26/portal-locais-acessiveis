import { Routes, Route } from 'react-router';
import NotFound  from "../pages/NotFound";
import Home from '../pages/Home';
import LocaisPage from '../pages/LocaisPage';
import Cadastro from '../pages/Cadastro';
import Sobre from '../pages/Sobre';
<<<<<<< HEAD

=======
import Acessibilidade from '../pages/Acessibilidade';
 
>>>>>>> e7df4cf (feat: Foi criado a página Acessibilidade, rota acessibilidade, link adicionado no header e footer e conteudo inicial da página foi colocado.)
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/locais" element={<LocaisPage />} />
      <Route path="/cadastrar" element={<Cadastro />} />
      <Route path="/sobre" element={<Sobre />} />
      <Route path="/acessibilidade" element={<Acessibilidade />} />
      <Route path="*" element={<NotFound/>} />
    </Routes>
  );
}
