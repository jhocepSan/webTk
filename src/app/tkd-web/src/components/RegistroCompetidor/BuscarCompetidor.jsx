import React, { useState } from 'react'
import MsgUtils, { server } from '../utils/MsgUtils';
import Competidor from './Competidor';

function BuscarCompetidor(props) {
    const { tipo, club, setCargador, actualizarDatos } = props
    const [competidor, setCompetidor] = useState('');
    const [listaCompetidor, setListaCompetidor] = useState([]);
    const [selectItem, setSelectItem] = useState({});
    function buscarCompetidor() {
        if (competidor !== '') {
            setCargador(true);
            fetch(`${server}/competidor/buscarCompetidor`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify({ tipo, competidor,club })
            })
                .then(res => res.json())
                .then(data => {
                    setCargador(false);
                    console.log(data.ok)
                    if (data.ok) {
                        setListaCompetidor(data.ok);
                    } else {
                        MsgUtils.msgError(data.error);
                    }
                })
                .catch(error => { MsgUtils.msgError(error); setCargador(false) });
        } else {
            MsgUtils.msgError("Escriba que competidor buscar !!!");
        }
    }
    function agregarCompetidor() {
        if (selectItem) {
            var cpt = JSON.parse(localStorage.getItem('campeonato'));
            var edad = new Date().getFullYear()-new Date(selectItem.fecha).getFullYear()
            fetch(`${server}/competidor/addEditCompetidor`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify({
                    'idCompetidor':0, 'nombres':selectItem.nombres, 'apellidos':selectItem.apellidos, 'ciUser':selectItem.ci, 
                    'idClub':selectItem.idclub, 'cinturon':0,
                    'peso':selectItem.peso, 'altura':selectItem.altura, 'tipos':tipo, 'idCampeonato':cpt.idcampeonato,
                    'edad':parseInt(edad), 'fecha':new Date(selectItem.fecha).toISOString().substring(0, 10), 'idGrado':0, 'genero':selectItem.genero, 'listaCTipoC':[]
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.ok) {
                        MsgUtils.msgCorrecto(data.ok);
                        setCompetidor('');
                        setListaCompetidor([]);
                        setSelectItem({});
                        actualizarDatos();
                    } else {
                        MsgUtils.msgError(data.error);
                    }
                })
                .catch(error => MsgUtils.msgError(error));
        }
    }
    return (
        <div className='card bg-transparent'>
            <div className='card-header'>
                <div className="input-group mb-3">
                    <span className="input-group-text" >Competidor</span>
                    <input type="text" className="form-control"
                        value={competidor}
                        placeholder="Nombre competidor"
                        onChange={(e) => setCompetidor(e.target.value.toUpperCase())} />
                    <button className='btn btn-success' onClick={() => buscarCompetidor()}><i className="fa-solid fa-magnifying-glass"></i> Buscar</button>
                </div>
            </div>
            <div className='card-body'>
                <div className='table-responsive overflow-auto' style={{maxHeight:'400px'}}>
                    <table className="table table-dark table-hover table-bordered ">
                        <tbody>
                            {listaCompetidor.map((item, index) => {
                                return (
                                    <tr key={index} onClick={() => setSelectItem(item)} className={`${(selectItem.idcompetidor === item.idcompetidor) ? 'colorSelection' : ''}`}>
                                        <td className='text-light' >
                                            <Competidor user={item} />
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className='card-footer'>
                <button className='btn btn-success bg-gradient w-100' onClick={() => agregarCompetidor()}><i className="fa-solid fa-user-plus"></i> Agregar</button>
            </div>
        </div>
    )
}

export default BuscarCompetidor
