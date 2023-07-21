import React, { useContext, useEffect, useState } from 'react'
import Header from '../Header'
import { useNavigate, Link } from 'react-router-dom';
import { ContextAplicacions } from '../Context/ContextAplicacion';
import MsgUtils from '../utils/MsgUtils';
import Modal from 'react-bootstrap/Modal';
import { server } from '../utils/MsgUtils';
import PrincipalLlaveRom from '../ListaCompetidores/PrincipalLlaveRom';
import UtilsBuffer from '../utils/UtilsBuffer';

function PrincipalPuntRompi() {
    const navigate = useNavigate();
    const { setLogin, setUserLogin, campeonato, setCampeonato, setTitulo } = useContext(ContextAplicacions);
    const [showModal, setShowModal] = useState(false);
    const [categorias, setCategorias] = useState([]);
    const [competidores, setCompetidores] = useState([]);
    const [listaElegida, setListaElegida] = useState([]);
    const [selectItem, setSelectItem] = useState({});
    const [selectComp, setSelectComp] = useState({});
    const [puntuacion, setPuntuacion] = useState([]);
    const [runPlay, setRunPlay] = useState(false);
    const [tipoM, setTipoM] = useState('');
    function getInformacionCategoria() {
        fetch(`${server}/config/getConfiCategoriaUnido`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ 'idcampeonato': campeonato.idcampeonato })
        })
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    console.log(data.ok);
                    setCategorias(data.ok);
                } else {
                    MsgUtils.msgError(data.error);
                }
            })
            .catch(error => MsgUtils.msgError(error));
    }
    function getInformacionRompimiento() {
        fetch(`${server}/competidor/getInformacionRompimiento`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ 'idCampeonato': campeonato.idcampeonato, 'tipo': 'R' })
        })
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    console.log(data.ok);
                    setCompetidores(data.ok);
                } else {
                    MsgUtils.msgError(data.error);
                }
            })
            .catch(error => MsgUtils.msgError(error));
    }
    function elegirListado(dato) {
        setListaElegida(dato.info.COMPETIDORES);
        setPuntuacion([]);
        setSelectComp({});
        setSelectItem({
            ...dato.filtro, 'GRADO': dato.info.GRADO, 'TIPOC': dato.info.TIPOC
        })
        //setShowModal(false);
    }
    function setRompimientoValor(comp,tipo){

        if(puntuacion.length==0){
            if(tipo){
                puntuacion.push({'idclasificacion':comp.idclasificacion,'rompio':1,'norompio':0})
            }else{

                puntuacion.push({'idclasificacion':comp.idclasificacion,'rompio':1,'norompio':0})
            }
        }
    }
    function cambiarPuntuacion(estado) {
        if (estado) {
            setPuntuacion(true);
        } else {
            setPuntuacion(false);
        }
    }
    function selectCompetidor(dato) {
        setPuntuacion(null);
        setSelectComp(dato);
        localStorage.setItem('puntuacionRompimiento', JSON.stringify({
            'selectComp': dato, selectItem, 'puntuacion': null, runPlay
        }));
    }
    useEffect(() => {
        var sessionActiva = JSON.parse(localStorage.getItem('login'));
        var cmp = JSON.parse(localStorage.getItem('campeonato'));
        categorias.length == 0 ? getInformacionCategoria() : '';
        competidores.length == 0 ? getInformacionRompimiento() : '';
        if (sessionActiva !== null) {
            setTitulo('')
            setCampeonato(cmp);
            setLogin(true);
            setUserLogin(sessionActiva);
            navigate("/gameRompim", { replace: true });
        }
    }, [])
    return (
        <div className='vh-100 bg-primary bg-gradient'>
            <Header puntuacion={true} />
            <div className="btn-group btn-group-sm " role="group" aria-label="Basic example">
                <Link className='btn btn-sm botonMenu d-none' data-bs-toggle="tooltip"
                    data-bs-placement="bottom" title="Abrir pantalla extendida"
                    to={'/scoreDobleR'} target='blanck'>
                    <i className="fa-brands fa-windows fa-2xl"></i>
                </Link>
                <button type="button" className="btn mx-1 btn-sm botonMenu"
                    data-bs-toggle="tooltip" data-bs-placement="bottom" title="Ver peleas del Campeonato"
                    onClick={() => { setTipoM('L'); setShowModal(!showModal); }}>
                    <i className="fa-solid fa-network-wired fa-2xl"></i></button>
                <button type="button " className="btn mx-1 btn-sm botonMenu d-none"
                    data-bs-toggle="tooltip" data-bs-placement="bottom" title="Recetear valores iniciales"
                    onClick={() => console.log("")}>
                    <i className="fa-solid fa-repeat fa-2xl"></i></button>
                {runPlay === true && <button type="button" className="btn mx-1 btn-sm botonMenu d-none"
                    data-bs-toggle="tooltip" data-bs-placement="bottom" title="Pausar Competencia"
                    onClick={() => {
                        localStorage.setItem('puntuacionRompimiento', JSON.stringify({
                            selectComp, selectItem, puntuacion, 'runPlay': false
                        })); setRunPlay(false)
                    }}>
                    <i className="fa-solid fa-circle-pause fa-2xl"></i>
                </button>}
                {runPlay === false && <button type="button" className="btn mx-1 btn-sm botonMenu d-none"
                    data-bs-toggle="tooltip" data-bs-placement="bottom" title="Iniciar Competencia"
                    onClick={() => {
                        localStorage.setItem('puntuacionRompimiento', JSON.stringify({
                            selectComp, selectItem, puntuacion, 'runPlay': true
                        }));
                        setRunPlay(true);
                    }}>
                    <i className="fa-solid fa-circle-play fa-2xl"></i>
                </button>}
            </div>
            <div className='container-fluid py-2 ' style={{ height: '95vh' }}>
                {selectItem.categoria!==undefined&&<div className=' w-100'>
                    <div className='row row-cols-2 g-1'>
                        <div className='col'>
                            <div className='tituloHeader text-light'>Categoria: <span className='fw-bold'>{selectItem.categoria}</span> {selectItem.genero == 'M' ? 'Masculino' : 'Femenino'}</div>
                            <div className='tituloHeader text-light'>Rompimiento: <span className='fw-bold'>{selectItem.TIPOC.descripcion}</span></div>
                        </div>
                        <div className='col'>
                            <div className='tituloHeader text-light text-start'>Edad:<span className='fw-bold'>{selectItem.edadini}</span> - <span className='fw-bold'>{selectItem.edadfin} Años</span></div>
                            <div className='tituloHeader text-light text-start'>Grado:<span className='fw-bold'>{selectItem.GRADO.nombre}</span></div>
                        </div>
                    </div>
                </div>}
                <div className='card bg-transparent m-0 p-0'>
                    <div className='card-header bg-dark'>
                        <div className='text-light'>Lista Competidores a Calificar</div>
                    </div>
                    <div className='card-body m-0 p-0'>
                        <div className='overflow-auto' style={{ maxHeight: '65vh' }}>
                            <div className='bg-secondary table-resposive'>
                                <table className="table table-dark table-striped">
                                    <tbody>
                                        {listaElegida.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <th style={{ width: '300px' }} className='m-1'>
                                                        <div className="card bg-transparent flex-row m-0 p-0" style={{ border: 'none' }} >
                                                            <div className='ps-2 my-auto text-start' style={{ fontSize: '14px' }}>
                                                                <div className="letrasContenido text-light">{item.nombres + ' ' + item.apellidos}</div>
                                                                <div className='letrasContenido text-light'>club: <span className='fw-bold'>{item.club}</span></div>
                                                                <div className='letrasContenido text-light'>rompimiento: <span className='fw-bold'>{item.tiponombre}</span></div>
                                                            </div>
                                                        </div>
                                                    </th>
                                                    <td className='m-1 text-center' style={{ width: '250px' }}>
                                                        <div className='container-fluid my-auto mx-auto'>
                                                            <div className="input-group mb-2">
                                                                <span className="input-group-text text-dark my-auto fa-2xl ">{item.rompio == undefined ? 0 : item.rompio}</span>
                                                                <button className='btn btn-sm btn-success' onClick={()=>setRompimientoValor(item,true)}><i className="fa-solid fa-thumbs-up fa-2xl"></i></button>
                                                            </div>
                                                            <div className="input-group ">
                                                                <span className="input-group-text text-dark my-auto fa-2xl">{item.norompio == undefined ? 0 : item.norompio}</span>
                                                                <button className='btn btn-sm btn-danger' onClick={()=>setRompimientoValor(item,true)}><i className="fa-solid fa-thumbs-down fa-2xl"></i></button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>)
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className='card-footer text-center'>
                        <button className='btn btn-success btn-sm w-100'>Guadar</button>
                    </div>
                </div>
            </div>
            {showModal &&
                <div className='bg-dark bg-gradient py-1 ' style={{ height: '45vh' }}>
                    <PrincipalLlaveRom categorias={categorias} idcampeonato={campeonato.idcampeonato}
                        genero={''} llaves={competidores} tipo={'R'} tipoL={'A'} collback={elegirListado} />
                </div>
            }
        </div>
    )
}

export default PrincipalPuntRompi