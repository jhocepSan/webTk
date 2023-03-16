import React, { useContext, useEffect, useState } from 'react'
import MsgUtils from '../utils/MsgUtils';
import CardCinturon from './CardCinturon';
//import ContextAplicacion from '../Context/ContextAplicacion';
const server = process.env.REACT_APP_SERVER;
function GradosConfig(props) {
    const { campeonato, setCampeonato } = props;
    const [actualizar, setActualizar] = useState(false);
    const [grados, setGrados] = useState([]);
    const [nombre, setNombre] = useState('');
    const [tipo, setTipo] = useState('');
    const agregarGrado = () => {
        if (nombre !== '') {
            const lista = grados.filter((item) => item.nombre === nombre);
            if (lista.length == 0) {
                fetch(`${server}/config/addGrado`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json;charset=utf-8',
                    },
                    body: JSON.stringify({
                        info: {
                            nombre, tipo, idcampeonato: campeonato.idcampeonato,
                        }
                    })
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.ok) {
                            if (data.ok.affectedRows === 1) {
                                setNombre('');
                                setActualizar(!actualizar);
                            } else {
                                MsgUtils.msgError("Intente Nuevamente");
                            }
                        } else {
                            MsgUtils.msgError(data.error);
                        }
                    })
                    .catch(error => MsgUtils.msgError(error));
            } else {
                MsgUtils.msgError("Ya TIENES UNO CON EL MISMO NOMBRE");
            }
        } else {
            MsgUtils.msgError("Coloque nombre del grado!!")
        }
    }
    function recuperarInfo(valor) {
        fetch(`${server}/config/getGrados`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({
                info: {
                    idcampeonato: campeonato.idcampeonato, tipo: valor
                }
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.ok) {
                    setGrados(data.ok);
                    //setActualizar(!actualizar);
                } else {
                    MsgUtils.msgError(data.error);
                }
            })
            .catch(error => MsgUtils.msgError(error));
    }
    const recuperarDatos = (e) => {
        var valor = e.target.value;
        setTipo(valor);
        recuperarInfo(valor);
    }
    const eliminarGrado = (dato) => {
        console.log(dato);
        fetch(`${server}/config/deleteGrado`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({
                info: {
                    idgrado: dato.idgrado
                }
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    if (data.ok.affectedRows === 1) {
                        setActualizar(!actualizar);
                    } else {
                        MsgUtils.msgError("Intente Nuevamente");
                    }
                } else {
                    MsgUtils.msgError(data.error);
                }
            })
            .catch(error => MsgUtils.msgError(error));
    }
    useEffect(() => {
        if (tipo !== '') {
            recuperarInfo(tipo);
        }
    }, [actualizar])
    return (
        <>
            <div className='container-fluid bg-dark bg-gradient py-2'>
                <div className="row row-cols-1 row-cols-sm-1 row-cols-md-3 g-1">
                    <div className='col-4 col-md-1'>
                        <select className="form-select form-select-sm btn-secondary"  value={tipo}
                            onChange={(e) => recuperarDatos(e)}>
                            <option value=''>Ninguno</option>
                            <option value="C">Combate</option>
                            <option value="P">Poomse</option>
                            <option value="D">Demostraciones</option>
                            <option value="R">Rompimiento</option>
                        </select>
                    </div>
                    <div className='col-8 col-md-8'>
                    {tipo !== '' &&
                        <div className="input-group input-group-sm ">
                            <span className="input-group-text bg-transparent border-dark text-light letraMontserratr" >Nombre Grado: </span>
                            <input type="text" className="form-control letraMontserratr "
                                placeholder="Grado" value={nombre} onChange={(e) => setNombre(e.target.value.toUpperCase())} />
                        </div>}
                    </div>
                    <div className='col-4 col-md-3'>
                    {tipo !== '' &&
                        <button className='btn btn-sm btn-success letraBtn' onClick={() => agregarGrado()}>
                            <i className="fa-solid fa-circle-plus fa-fade fa-xl "></i> Agregar
                        </button>}
                    </div>
                </div>
            </div>
            <div className='container-fluid py-2'>
                <div className='row row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-lg-3 g-1'>
                    {grados.map((item, index) => {
                        return (
                            <div key={index} className='col'>
                                <CardCinturon info={item} eliminarGrado={eliminarGrado} />
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}

export default GradosConfig
