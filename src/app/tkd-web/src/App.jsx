import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginUser from "./components/loginUser/LoginUser";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import VistaInicio from "./components/VistaInicio";
import ContextAplicacion from "./components/Context/ContextAplicacion";
import PrincipalRegistroCompetidor from "./components/RegistroCompetidor/PrincipalRegistroCompetidor";
import PrincipalConfiguracion from "./components/Configuraciones/PrincipalConfiguracion";
import PrincipalRegistroClub from "./components/RegistroClub/PrincipalRegistroClub";
import AdminUsuario from "./components/AdminUser/AdminUsuario";
import PrincipalTesting from "./components/GamePad/PrincipalTesting";
import PrincipalListaCompetidor from "./components/ListaCompetidores/PrincipalListaCompetidor";
import PrincipalPuntuacion from "./components/PantallaPuntuacion/PrincipalPuntuacion";
import PrincipalListaSinPelea from "./components/ListaCompetidores/PrincipalListaSinPelea";
import PrincipalListaFestivales from "./components/ListaCompetidores/PrincipalListaFestivales";
import PrincipalResultados from "./components/ResultadoCamp/PrincipalResultados";
import ScoreCombate from "./components/Puntuacion/scoreCombate";
import PrincipalPuntPoomse from "./components/PantallaPoomse/PrincipalPuntPoomse";
import PrincipalPuntRompi from "./components/PantallaRompi/PrincipalPuntRompi";
import ScoreRompimiento from "./components/Puntuacion/ScoreRompimiento";
import ScorePoomse from "./components/Puntuacion/ScorePoomse";
import PrincipalPuntuacionPrevia from "./components/PuntuacionPrevias/PrincipalPuntuacionPrevia";
import PrincipalPantallaDemo from "./components/PantallaDemostracion/PrincipalPantallaDemo";
function App() {
  return (
    <ContextAplicacion>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginUser />} />
          <Route path="/inicio" element={<VistaInicio />} />
          <Route path="/regCompe" element={<PrincipalRegistroCompetidor />} />
          <Route path="/configuracion" element={<PrincipalConfiguracion />} />
          <Route path="/regClub" element={<PrincipalRegistroClub />} />
          <Route path='/adminUser' element={<AdminUsuario />} />
          <Route path="/gamePad" element={<PrincipalTesting />} />
          <Route path="/listCompe" element={<PrincipalListaCompetidor />} />
          <Route path='/gamePunt' element={<PrincipalPuntuacion />} />
          <Route path="/listCompeSN" element={<PrincipalListaSinPelea />} />
          <Route path="/listCompeFest" element={<PrincipalListaFestivales />} />
          <Route path="/resultCamp" element={<PrincipalResultados />} />
          <Route path='/scoreDobleK' element={<ScoreCombate/>}/>
          <Route path='/scoreDobleR' element={<ScoreRompimiento/>}/>
          <Route path='/scoreDobleP' element={<ScorePoomse/>}/>
          <Route path='/pointPreviaC' element={<PrincipalPuntuacionPrevia/>}/>
          <Route path='/gameDemost' element={<PrincipalPantallaDemo/>}/>
          <Route path='/gamePoomse' element={<PrincipalPuntPoomse/>}/>
          <Route path='/gameRompim' element={<PrincipalPuntRompi/>}/>
        </Routes>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </BrowserRouter>
    </ContextAplicacion>
  );
}

export default App;
