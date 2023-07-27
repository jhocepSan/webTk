import React, { useContext, useEffect, useState } from 'react'
import Header from '../Header';
import { ContextAplicacions } from '../Context/ContextAplicacion';
import { useNavigate } from 'react-router-dom';
import { server } from '../utils/MsgUtils';
import MsgUtils from '../utils/MsgUtils';
import UtilsBuffer from '../utils/UtilsBuffer';

function PrincipalPantallaDemo() {
    const navigate = useNavigate();
    const { setLogin, setUserLogin, login, campeonato, setCampeonato, userLogin, listaCampeonatos, setListaCampeonatos, inscripcionOpen, setInscripcionOpen } = useContext(ContextAplicacions);
    const [equipos, setEquipos] = useState([]);
    function guardarPuntuacion(dato){
        /*fetch(`${server}/competidor/getEquipoDemostration`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({
                'idCampeonato': campeonato.idcampeonato
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    setEquipos(data.ok);
                } else {
                    MsgUtils.msgError(data.error);
                }
            })
            .catch(error => MsgUtils.msgError(error));*/
    }
    function getEquipoDemostration() {
        fetch(`${server}/competidor/getEquipoDemostration`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({
                'idCampeonato': campeonato.idcampeonato
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    setEquipos(data.ok);
                } else {
                    MsgUtils.msgError(data.error);
                }
            })
            .catch(error => MsgUtils.msgError(error));
    }
    useEffect(() => {
        var sessionActiva = JSON.parse(localStorage.getItem('login'));
        getEquipoDemostration();
        if (sessionActiva !== null) {
            setLogin(true);
            setUserLogin(sessionActiva);
            navigate("/gameDemost", { replace: true });
        }
    }, [])
    return (
        <>
            <Header />
            <div className='container-fluid py-2'>
                <div className='row row-cols-1 row-cols-sm-1 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-1'>
                    {equipos.map((item, index) => {
                        return (
                            <div className='col' key={index}>
                                <div className='card bg-dark bg-gradient'>
                                    <div className='card-header text-center text-light'>
                                        {item.nombre}
                                    </div>
                                    <div className='card-body m-0 p-1'>
                                        <textarea className='form-control'
                                            disabled={true} style={{ minHeight: '250px' }}
                                            value={UtilsBuffer.getText(item.descripcion)}></textarea>
                                    </div>
                                    <div className='card-footer'>
                                        <div className="input-group">
                                            <input type="number" className="form-control" 
                                                placeholder="Puntuación" value={item.puntuacion!==undefined?item.puntuacion:''}/>
                                            <button className="btn btn-success" onClick={()=>guardarPuntuacion(item)}>
                                                <i className="fa-solid fa-floppy-disk"></i> Guardar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}

export default PrincipalPantallaDemo