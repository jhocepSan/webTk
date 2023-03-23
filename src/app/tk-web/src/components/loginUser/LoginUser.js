import React, { useContext, useEffect, useState } from 'react';
import MsgUtils from '../utils/MsgUtils';
import { useNavigate } from 'react-router-dom';
import ImgLogin from '../../assets/login.png';
import SingUp from './SingUp';
import { ContextAplicacions } from '../Context/ContextAplicacion';
import Header from '../Header';
import ForgotPassword from './ForgotPassword';

const server = process.env.REACT_APP_SERVER

function LoginUser() {
    const navigate = useNavigate();
    const { setLogin, setUserLogin } = useContext(ContextAplicacions);
    const [ventana, setVentana] = useState(0);
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState({});
    function validarInformacion() {
        if (correo !== '' && password !== '') {
            return true;
        } else {
            setError({ "error": "Campos Vacios !!!" })
            return false;
        }
    }
    const ingresarSistema = () => {
        if (validarInformacion()) {
            fetch(`${server}/login/iniciarSession`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify({
                    correo, password
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.ok) {
                        localStorage.setItem("login", JSON.stringify(data.ok));
                        setLogin(true);
                        setUserLogin(data.ok);
                        MsgUtils.msgCorrecto('Ingresado Correctamente');
                        navigate("/inicio", { replace: true });
                    } else {
                        setError({ "errorUser": data.error })
                        MsgUtils.msgError(data.error);
                    }
                })
                .catch(error => MsgUtils.msgError(error));
        } else {
            MsgUtils.msgError("No se Aceptan Campos Vacios !!")
        }
    }
    useEffect(() => {
        var sessionActiva = JSON.parse(localStorage.getItem('login'))
        if (sessionActiva !== null) {
            setLogin(true);
            setUserLogin(sessionActiva);
            navigate("/inicio", { replace: true });
        }
    }, [])
    return (
        <div>
            <Header/>
            {ventana === 0 &&
                <div className='container-fluid py-2'>
                    <div className="card col-sm-12 col-md-4 mx-auto bg-dark bg-gradient" >
                        <div className='card-header m-0 p-0'>
                            <div className='row row-cols-2 g-0'>
                                <div className='col col-4 text-center'>
                                    <img src={ImgLogin} className="card-img-top fa-bounce" style={{ width: "100px" }} />
                                </div>
                                <div className='col col-6 text-start my-auto'>
                                    <span className='text-light fw-bold'>INGRESAR AL SISTEMA</span>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="mb-3">
                                <label className="form-label text-light fw-bold"><i className="fa-solid fa-user fa-fade"></i> Correo</label>
                                <input type="email" className="form-control" placeholder='Correo del Usuario' value={correo} onChange={(e) => { setCorreo(e.target.value); setError({}) }} />
                                {error.error && correo === '' && <div className="alert alert-danger m-0 p-0" role="alert">
                                    {error.error}
                                </div>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label text-light fw-bold"><i className="fa-solid fa-key fa-fade"></i> Contraseña</label>
                                <input type="password" className="form-control" placeholder='Tu Contraseña' value={password} onChange={(e) => { setPassword(e.target.value); setError({}) }} />
                                {error.error && password === '' && <div className="alert alert-danger m-0 p-0" role="alert">
                                    {error.error}
                                </div>}
                            </div>
                            <div className='text-center'>
                                <div>
                                    <a className='text-light fw-bold btn btn-transparent' onClick={()=>setVentana(2)}
                                    >Olvidaste tu Contraseña ?</a>
                                </div>
                                <div>
                                    <a className='text-light fw-bold btn btn-transparent' onClick={() => setVentana(1)}>Crear una Cuenta</a>
                                </div>
                                <div>
                                    <button className='btn btn-sm btn-light' onClick={ingresarSistema}>
                                        <i className="fa-solid fa-check-to-slot "></i> INGRESAR
                                    </button>
                                </div>
                                {error.errorUser && <div className="text-center alert alert-danger m-0 p-0" role="alert">
                                    {error.errorUser}
                                </div>}
                            </div>
                        </div>
                    </div>
                </div>}
            {ventana === 1 && <SingUp setVentana={setVentana} />}
            {ventana === 2 && <ForgotPassword setVentana={setVentana} />}
        </div>
    )
}

export default LoginUser
