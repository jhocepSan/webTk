import React, { useState } from 'react'
import ImgLogin from '../../assets/login.png';
import MsgUtils from '../utils/MsgUtils';
import {server} from '../utils/MsgUtils';
 
function ForgotPassword(props) {
    const { setVentana,setCargador } = props;
    const [error, setError] = useState({});
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordR, setNewPasswordR] = useState('');
    const [ci, setCi] = useState('');
    function validarCampos() {
        if (email !== '' && ci !== '' && newPassword != '' && newPasswordR !== '') {
            if (newPassword === newPasswordR) {
                return true;
            } else {
                MsgUtils.msgError("No Coinciden las contraseñas ingresadas");
                setError({ "error": "No Coinciden las contraseñas ingresadas" });
                return false;
            }
        } else {
            setError({ "error": "No se permite campos vacios ..." })
            return false;
        }
    }
    function guardarNuevaContraseña() {
        if (validarCampos()) {
            setCargador(true);
            fetch(`${server}/login/recuperarCuenta`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify({
                    newPassword,ci,email
                })
            })
                .then(res => res.json())
                .then(data => {
                    setCargador(false);
                    if (data.ok) {
                        setVentana(0);
                        MsgUtils.msgCorrecto(data.ok);
                    } else {
                        MsgUtils.msgError(data.error);
                    }
                })
                .catch(error => MsgUtils.msgError(error));
        } else {
            MsgUtils.msgError("Ingrese los datos necesarios por favor...")
        }
    }
    return (
        <div className='container-fluid py-2'>
            <div className="card col-sm-12 col-md-4 mx-auto bg-dark bg-gradient" >
                <div className='card-header m-0 p-0'>
                    <div className='row row-cols-2 g-0'>
                        <div className='col col-4 text-center'>
                            <img src={ImgLogin} className="card-img-top fa-bounce" style={{ width: "60px" }} />
                        </div>
                        <div className='col col-6 text-start my-auto'>
                            <span className='text-light fw-bold'>Recuperación de la cuenta TKD</span>
                        </div>
                        <div className='col col-2 text-end my-auto'>
                            <button className='btn btn-sm btn-transparent text-danger' onClick={() => setVentana(0)}>
                                <i className="fa-solid fa-circle-xmark fa-2xl"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <div class="alert alert-warning letrasContenido">
                        Solo podras recuperar tu contraseña con tus datos personales, y ser miembro de la asociación ...
                    </div>
                    <div className="mb-3">
                        <label className="form-label text-light fw-bold"><i className="fa-solid fa-user fa-fade"></i> Correo</label>
                        <input type="email" className="form-control" placeholder='Correo del usuario'
                            value={email} onChange={(e) => { setEmail(e.target.value); setError({}) }} />
                        {error.error && email === '' && <div className="alert alert-danger m-0 p-0" role="alert">
                            Coloca su Correo por favor ...
                        </div>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label text-light fw-bold"><i className="fa-solid fa-address-card fa-fade"></i> Carnet de Identidad</label>
                        <input type="number" className="form-control" placeholder='Carnet de Identidad'
                            value={ci} onChange={(e) => { setCi(e.target.value); setError({}) }} />
                        {error.error && email === '' && <div className="alert alert-danger m-0 p-0" role="alert">
                            Ingrese su carnet por favor ...
                        </div>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label text-light fw-bold"><i className="fa-solid fa-key fa-fade"></i> Nueva Contraseña</label>
                        <input type="password" className="form-control" placeholder='Nueva contraseña'
                            value={newPassword} onChange={(e) => { setNewPassword(e.target.value); setError({}) }} />
                        {error.error && (newPassword === '' || newPassword !== newPasswordR) && <div className="alert alert-danger m-0 p-0" role="alert">
                            {error.error}
                        </div>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label text-light fw-bold"><i className="fa-solid fa-key fa-fade"></i> Repita su Nueva Contraseña</label>
                        <input type="password" className="form-control" placeholder='Repita su Nueva contraseña'
                            value={newPasswordR} onChange={(e) => { setNewPasswordR(e.target.value); setError({}) }} />
                        {error.error && (newPasswordR === '' || newPassword !== newPasswordR) && <div className="alert alert-danger m-0 p-0" role="alert">
                            {error.error}
                        </div>}
                    </div>
                </div>
                <div className='card-footer'>
                    <button className='btn btn-sm bg-gradient btn-success w-100 letraBtn' onClick={() => guardarNuevaContraseña()}>
                        <i className="fa-solid fa-floppy-disk fa-fade " style={{ color: "#87f7ad" }}></i> Guardar
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword
