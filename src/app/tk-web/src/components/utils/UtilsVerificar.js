import {useContext} from 'react'
import { ContextAplicacions } from '../Context/ContextAplicacion';
import { useNavigate } from 'react-router-dom';

function ValidarUsuario(url){
    const navigate = useNavigate();
    const { setLogin, setUserLogin } = useContext(ContextAplicacions);
    var sessionActiva = JSON.parse(localStorage.getItem('login'))
    if (sessionActiva !== null) {
      setLogin(true);
      setUserLogin(sessionActiva);
      navigate(url, { replace: true });
    }
}

export default {ValidarUsuario}
