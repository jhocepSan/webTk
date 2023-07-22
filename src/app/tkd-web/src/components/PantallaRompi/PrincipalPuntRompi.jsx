import React, { useContext, useEffect, useState } from 'react'
import Header from '../Header'
import { useNavigate, Link } from 'react-router-dom';
import { ContextAplicacions } from '../Context/ContextAplicacion';
import MsgUtils from '../utils/MsgUtils';
import Modal from 'react-bootstrap/Modal';
import { server } from '../utils/MsgUtils';
import PrincipalLlaveRom from '../ListaCompetidores/PrincipalLlaveRom';
import UtilsBuffer from '../utils/UtilsBuffer';
import UtilsCargador from '../utils/UtilsCargador';

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
    const [loading, setLoading] = useState(false);
    function actualizarInfo(){
        setLoading(true);
        getInformacionRompimiento()
    }
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
                setLoading(false);
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
    function setRompimientoValorDecimal(tipoS, item, tipo) {
        if (tipoS == 'R') {
            if (tipo) {
                setRompimientoValor(item, true, 0.1)
            } else {
                setRompimientoValor(item, true, -0.1)
            }
        } else {
            if (tipo) {
                setRompimientoValor(item, false, 0.1)
            } else {
                setRompimientoValor(item, false, -0.1)
            }
        }
    }
    function setRompimientoValor(comp, tipo, incremento) {
        if (puntuacion.length == 0) {
            if (tipo) {
                setPuntuacion([...puntuacion, { 'idclasificacion': comp.idclasificacion, 'rompio': incremento, 'norompio': 0 }])
            } else {
                setPuntuacion([...puntuacion, { 'idclasificacion': comp.idclasificacion, 'rompio': 0, 'norompio': (-1 * incremento) }])
            }
        } else {
            var puntua = puntuacion.filter((item) => item.idclasificacion == comp.idclasificacion);
            if (puntua.length !== 0) {
                var aux = puntuacion.filter((item) => item.idclasificacion !== comp.idclasificacion);
                if (tipo) {
                    var suma = parseFloat(puntua[0].rompio) + incremento;
                    puntua[0].rompio = suma.toFixed(1)
                    setPuntuacion([...aux, puntua[0]])
                } else {
                    var suma = parseFloat(puntua[0].norompio) - incremento;
                    puntua[0].norompio = suma.toFixed(1)
                    setPuntuacion([...aux, puntua[0]])
                }
            } else {
                if (tipo) {
                    setPuntuacion([...puntuacion, { 'idclasificacion': comp.idclasificacion, 'rompio': incremento, 'norompio': 0 }])
                } else {
                    setPuntuacion([...puntuacion, { 'idclasificacion': comp.idclasificacion, 'rompio': 0, 'norompio': -1 * incremento }])
                }
            }
        }
    }
    function getValorRomp(valor, tipo) {
        var punto = puntuacion.filter((item) => item.idclasificacion == valor.idclasificacion);
        if (punto.length == 0) {
            return 0
        } else {
            if (tipo) {
                return punto[0].rompio;
            } else {
                return punto[0].norompio;
            }
        }
    }
    function guardarPuntuacion() {
        if (puntuacion.length !== 0) {
            setLoading(true);
            fetch(`${server}/competidor/guardarRompimientoPuntos`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify({ 'idCampeonato': campeonato.idcampeonato, 'tipo': 'R', 'competidores': puntuacion })
            })
                .then(res => res.json())
                .then(data => {
                    setLoading(false);
                    if (data.ok) {
                        MsgUtils.msgCorrecto(data.ok);
                    } else {
                        MsgUtils.msgError(data.error);
                    }
                })
                .catch(error => MsgUtils.msgError(error));
        } else {
            MsgUtils.msgError("No es posible guardar")
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
                {selectItem.categoria !== undefined && <div className=' w-100'>
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
                                <table className="table  table-striped">
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
                                                    <td className='m-1 text-center' style={{ width: '320px' }}>
                                                        <div className='container-fluid my-auto mx-auto'>
                                                            <div className='row row-cols-2 g-1'>
                                                                <div className='col-9 my-auto'>
                                                                    <div className="input-group mb-2">
                                                                        <span className="input-group-text text-dark my-auto fa-xl ">{getValorRomp(item, true)}</span>
                                                                        <button className='btn btn-sm btn-success' onClick={() => setRompimientoValor(item, true, 1)}><i className="fa-solid fa-thumbs-up fa-2xl"></i></button>
                                                                    </div>
                                                                </div>
                                                                <div className='col-3 m-0 p-0'>
                                                                    <div className='container-fluid m-0 p-0'>
                                                                        <button className='btn text-light' onClick={() => setRompimientoValorDecimal('R', item, true)}>
                                                                            <i className="fa-solid fa-circle-plus"></i>
                                                                        </button>
                                                                        <button className='btn text-light' onClick={() => setRompimientoValorDecimal('R', item, false)}>
                                                                            <i className="fa-solid fa-circle-minus"></i>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <hr style={{ background: '#ffffff' }} className='m-0 p-0 mb-1'></hr>
                                                            <div className='row row-cols-2 g-0 '>
                                                                <div className='col-9 my-auto'>
                                                                    <div className="input-group ">
                                                                        <span className="input-group-text text-dark my-auto fa-xl">{getValorRomp(item, false)}</span>
                                                                        <button className='btn btn-sm btn-danger' onClick={() => setRompimientoValor(item, false, 1)}><i className="fa-solid fa-thumbs-down fa-2xl"></i></button>
                                                                    </div>
                                                                </div>
                                                                <div className='col-3 m-0 p-0'>
                                                                    <div className='container-fluid m-0 p-0'>
                                                                        <button className='btn text-light' onClick={() => setRompimientoValorDecimal('N', item, true)}>
                                                                            <i className="fa-solid fa-circle-plus"></i>
                                                                        </button>
                                                                        <button className='btn text-light' onClick={() => setRompimientoValorDecimal('N', item, false)}>
                                                                            <i className="fa-solid fa-circle-minus"></i>
                                                                        </button>
                                                                    </div>
                                                                </div>
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
                        <button className='btn btn-success btn-sm w-100' onClick={() => guardarPuntuacion()}>Guadar</button>
                    </div>
                </div>
            </div>
            {showModal &&
                <div className='bg-dark bg-gradient py-1 ' style={{ height: '45vh' }}>
                    <PrincipalLlaveRom categorias={categorias} idcampeonato={campeonato.idcampeonato}
                        genero={''} llaves={competidores} tipo={'R'} tipoL={'A'} collback={elegirListado} actualizarInfo={()=>actualizarInfo()}/>
                </div>
            }
            <UtilsCargador show={loading} />
        </div>
    )
}

export default PrincipalPuntRompi