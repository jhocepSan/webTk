import React, { useEffect, useState } from 'react'
import { server } from '../utils/MsgUtils';
import MsgUtils from '../utils/MsgUtils';

function AddEditTipoCompeticion(props) {
    const {campeonato,tipo}=props;
    const [itemTipo, setItemTipo] = useState('');
    const [listaTipos, setListaTipos] = useState([]);
    function recuperarTipoCompetencia(valor) {
        fetch(`${server}/config/getTiposCampeonato`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({
                'idcampeonato': campeonato.idcampeonato, 'tipo': valor
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.ok) {
                    setListaTipos(data.ok);
                } else {
                    MsgUtils.msgError(data.error);
                }
                setCargador(false);
            })
            .catch(error => MsgUtils.msgError(error));
    }
    const guardarTiposCa = () => {
        fetch(`${server}/config/addTiposCampeonato`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({
                "info": listaTipos
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    MsgUtils.msgCorrecto(data.ok);
                } else {
                    MsgUtils.msgError(data.error);
                }
            })
            .catch(error => MsgUtils.msgError(error));
    }
    function eliminarListaTipo(valor){
        setListaTipos(listaTipos.filter((item)=>item.descripcion!=valor.descripcion &&item.idtipo!=valor.idtipo));
        if(valor.idtipo!=0){
            fetch(`${server}/config/deleteTiposCampeonato`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify({
                    'idtipo':valor.idtipo,'idcampeonato': campeonato.idcampeonato, "tipo": tipo
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.ok) {
                        MsgUtils.msgCorrecto(data.ok);
                    } else {
                        MsgUtils.msgError(data.error);
                    }
                })
                .catch(error => MsgUtils.msgError(error));       
        }
    }
    const agregarTipo = () => {
        if (itemTipo != '') {
            setListaTipos([...listaTipos, { "idtipo": 0, 'idcampeonato': campeonato.idcampeonato, "tipo": tipo, "descripcion": itemTipo }]);
        } else {
            MsgUtils.msgError("Coloque el nombre del tipo, por favor ...");
        }
    }
    useEffect(()=>{
        if(tipo!=''){
            recuperarTipoCompetencia(tipo);
        }
    },[])
    return (
        <div className='card w-100 bg-dark bg-gradient'>
            <div className='card-header'>
                <div className="input-group input-group-sm ">
                    <span className="input-group-text bg-transparent border-dark text-light letraMontserratr" >Tipo Rompimiento: </span>
                    <input type="text" className="form-control letraMontserratr "
                        placeholder="Nombre" value={itemTipo} onChange={(e) => setItemTipo(e.target.value.toUpperCase())} />
                    <button className='btn btn-sm letraBtn btn-success' onClick={() => agregarTipo()}>
                        Agregar
                    </button>
                </div>
            </div>
            <div className='card-body'>
                <ul className="list-group">
                    {listaTipos.length != 0 && listaTipos.map((item, index) => {
                        return (
                            <li className="list-group-item" key={index}>
                                <div className='container-fluid'>
                                    <div className='row row-cols-2 g-1'>
                                        <div className='col'>
                                            {item.descripcion}
                                        </div>
                                        <div className='col text-end'>
                                            <button className='btn btn-sm btn-danger' onClick={() => eliminarListaTipo(item)}>X</button>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </div>
            <div className='card-footer'>
                <button className='btn btn-sm letraBtn bg-gradient btn-success w-100' onClick={() => guardarTiposCa()}>
                    Guardar
                </button>
            </div>
        </div>
    )
}

export default AddEditTipoCompeticion