import React, { useState, useContext, useEffect } from 'react';
import MsgUtils from '../utils/MsgUtils';
import { useNavigate } from 'react-router-dom';
import ImgLogin from '../../assets/login.png';
import { ContextAplicacions } from '../Context/ContextAplicacion';
import {server} from '../utils/MsgUtils';

function SingUp(props) {
    const { setVentana,setCargador,tipoModal,setActualizar,actualizar,setShowModal,selectItem,setSelectItem } = props;
    const navigate = useNavigate();
    const { setLogin, setUserLogin } = useContext(ContextAplicacions);
    const [nombres, setNombres] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [ciUser, setCiUser] = useState('');
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [passwordR, setPasswordR] = useState('');
    const [error, setError] = useState({});
    const [idClub,setIdClub] = useState(0);
    const [listaClub, setListaCLub] = useState([]);
    const [idUsuario,setIdUsuario] = useState(0);
    function validarInfomacion() {
        console.log(tipoModal)
        var validaModal = tipoModal=='M' ? false : (password === '' || passwordR === '');
        if (nombres === '' || apellidos === '' || ciUser === '' || correo === '' || validaModal ||idClub===0) {
            setError({ "error": "Campo Vacio" })
            return false;
        } else {
            if(tipoModal==null){
                if (password === passwordR) {
                    return true;
                } else {
                    setError({ "passwordE": "No Coinciden las Contraseñas" })
                    return false;
                }
            }else{
                return true;
            }
        }
    }
    const guardarInformacion = () => {
        if (validarInfomacion()) {
            setCargador(true);
            var info = {
                idUsuario,
                nombres,
                apellidos,
                ciUser,
                correo,
                password,
                idClub
            }
            fetch(`${server}/login/createUser`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify({
                    info
                })
            })
                .then(res => res.json())
                .then(data => {
                    setCargador(false);
                    if (data.ok) {
                        MsgUtils.msgCorrecto('!registrado!!');
                        if(tipoModal==null){
                            localStorage.setItem("login", JSON.stringify(data.ok));
                            setLogin(true);
                            setUserLogin(data.ok);
                            navigate("/inicio", { replace: true });
                        }else{
                            setSelectItem({});
                            setShowModal(false);
                            setActualizar(!actualizar);
                        }
                    } else {
                        MsgUtils.msgError(data.error);
                    }
                })
                .catch(error => MsgUtils.msgError(error));
        } else {
            MsgUtils.msgError("No se Aceptan campos vacios")
        }
    }
    useEffect(() => {
        if(selectItem.nombres!=undefined){
            setIdUsuario(selectItem.idusuario);
            setNombres(selectItem.nombres);
            setApellidos(selectItem.apellidos);
            setCorreo(selectItem.correo);
            setCiUser(selectItem.ci);
            setIdClub(selectItem.idclub);
        }
        fetch(`${server}/club/getListaClub`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    setListaCLub(data.ok);
                } else {
                    MsgUtils.msgError(data.error);
                }
            })
            .catch(error => MsgUtils.msgError(error));
        
    }, [])
    return (
        <div className='container-fluid py-2'>
            <div className={`${tipoModal!=null ? '' :'col-sm-12 col-md-4'} card mx-auto bg-dark bg-gradient `}>
                {tipoModal==null&&<div className='card-header m-0 p-0'>
                    <div className='row row-cols-2 g-0'>
                        <div className='col col-4 text-center'>
                            <img src={ImgLogin} className="card-img-top fa-bounce" style={{ width: "60px" }} />
                        </div>
                        <div className='col col-6 text-start my-auto'>
                            <span className='text-light fw-bold'>Creando Cuenta en TK</span>
                        </div>
                        <div className='col col-2 text-end my-auto'>
                            <button className='btn btn-sm btn-transparent text-danger' onClick={() => setVentana(0)}>
                                <i className="fa-solid fa-circle-xmark fa-2xl"></i>
                            </button>
                        </div>
                    </div>
                </div>}
                <div className="card-body">
                    <div className="mb-3">
                        <label className="form-label text-light fw-bold"><i className="fa-solid fa-user fa-fade"></i> Nombres</label>
                        <input type="text" className="form-control" placeholder='Escriba su nombre' value={nombres} onChange={(e) => { setNombres(e.target.value.toUpperCase()); setError({}) }} />
                        {error.error && nombres === '' && <div className="alert alert-danger m-0 p-0" role="alert">
                            {error.error}
                        </div>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label text-light fw-bold"><i className="fa-solid fa-user fa-fade"></i> Apellidos</label>
                        <input type="text" className="form-control" placeholder='Ingresa tus Apellidos' value={apellidos} onChange={(e) => { setApellidos(e.target.value.toUpperCase()); setError({}) }} />
                        {error.error && apellidos === '' && <div className="alert alert-danger m-0 p-0" role="alert">
                            {error.error}
                        </div>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label text-light fw-bold"><i className="fa-solid fa-id-card fa-fade"></i> Carnet Identidad</label>
                        <input type="text" className="form-control" placeholder='Ingrese su CI' value={ciUser} onChange={(e) => { setCiUser(e.target.value); setError({}) }} />
                        {error.error !== undefined && ciUser === '' && <div className="alert alert-danger m-0 p-0" role="alert">
                            {error.error}
                        </div>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label text-light fw-bold"><i className="fa-solid fa-at fa-fade"></i> Correo</label>
                        <input type="email" className="form-control" placeholder='Tu Correo' value={correo} onChange={(e) => { setCorreo(e.target.value); setError({}) }} />
                        {error.error && correo === '' && <div className="alert alert-danger m-0 p-0" role="alert">
                            {error.error}
                        </div>}
                    </div>
                    <div className='mb-3'>
                        <label className="form-label text-light fw-bold"><i className="fa-solid fa-school-flag fa-fade"></i> Club</label>
                        <select className="form-select form-select-sm bg-secondary text-light border-secondary"
                            value={idClub} onChange={(e) => setIdClub(e.target.value)}>
                                <option value={0}>Ninguno</option>
                            {listaClub.map((item, index) => {
                                return (
                                    <option value={item.idclub} key={index}>{item.nombre}</option>
                                )
                            })}
                        </select>
                        {error.error && idClub === 0 && <div className="alert alert-danger m-0 p-0" role="alert">
                            {error.error}
                        </div>}
                    </div>
                    {tipoModal!='M'&&<div className="mb-3">
                        <label className="form-label text-light fw-bold"><i className="fa-solid fa-key fa-fade"></i> Contraseña</label>
                        <input type="password" className="form-control" placeholder='Tu Contraseña' value={password} onChange={(e) => { setPassword(e.target.value); setError({}) }} />
                        {error.error && password === '' && <div className="alert alert-danger m-0 p-0" role="alert">
                            {error.error}
                        </div>}
                        {error.passwordE && <div className="alert alert-danger m-0 p-0" role="alert">
                            {error.passwordE}
                        </div>}
                    </div>}
                    {tipoModal!='M'&&<div className="mb-3">
                        <label className="form-label text-light fw-bold"><i className="fa-solid fa-key fa-fade"></i> Repita Contraseña</label>
                        <input type="password" className="form-control" placeholder='Tu Contraseña' value={passwordR} onChange={(e) => { setPasswordR(e.target.value); setError({}) }} />
                        {error.error && passwordR === '' && <div className="alert alert-danger m-0 p-0" role="alert">
                            {error.error}
                        </div>}
                        {error.passwordE && <div className="alert alert-danger m-0 p-0" role="alert">
                            {error.passwordE}
                        </div>}
                    </div>}
                    <div className='container-fluid text-center'>
                        <div className='row g-2'>
                            <div className='col'>
                                <button className='btn btn-sm btn-success bg-gradient w-100' onClick={guardarInformacion}>
                                    <i className="fa-solid fa-address-card fa-xl"></i> {selectItem.nombre!==undefined?'Actualizar':'CREAR'}
                                </button>
                            </div>
                            {tipoModal==null&&<div className='col'>
                                <button className='btn btn-sm btn-danger bg-gradient w-100' onClick={() => setVentana(0)}>
                                    <i className="fa-solid fa-circle-xmark fa-xl"></i> SALIR
                                </button>
                            </div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SingUp
