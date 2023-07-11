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
    const [puntuacion, setPuntuacion] = useState(null);
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
        console.log(dato);
        setListaElegida(dato.info.COMPETIDORES);
        setPuntuacion(null);
        setSelectComp({});
        setSelectItem({
            ...dato.filtro, 'GRADO': dato.info.GRADO, 'TIPOC': dato.info.TIPOC
        })
        //setShowModal(false);
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
        <div className='vh-100 bg-primary bg-gradient' tabIndex={0} onKeyDown={(e) => console.log(e)}>
            <Header puntuacion={true} />
            <div className="btn-group btn-group-sm" role="group" aria-label="Basic example">
                <Link className='btn btn-sm botonMenu' data-bs-toggle="tooltip"
                    data-bs-placement="bottom" title="Abrir pantalla extendida"
                    to={'/scoreDobleR'} target='blanck'>
                    <i className="fa-brands fa-windows fa-2xl"></i>
                </Link>
                <button type="button" className="btn mx-1 btn-sm botonMenu"
                    data-bs-toggle="tooltip" data-bs-placement="bottom" title="Ver peleas del Campeonato"
                    onClick={() => { setTipoM('L'); setShowModal(!showModal); }}>
                    <i className="fa-solid fa-network-wired fa-2xl"></i></button>
                <button type="button" className="btn mx-1 btn-sm botonMenu"
                    data-bs-toggle="tooltip" data-bs-placement="bottom" title="Recetear valores iniciales"
                    onClick={() => console.log("")}>
                    <i className="fa-solid fa-repeat fa-2xl"></i></button>
                {runPlay === true && <button type="button" className="btn mx-1 btn-sm botonMenu"
                    data-bs-toggle="tooltip" data-bs-placement="bottom" title="Pausar Competencia"
                    onClick={() => {
                        localStorage.setItem('puntuacionRompimiento', JSON.stringify({
                            selectComp, selectItem, puntuacion, 'runPlay': false
                        })); setRunPlay(false)
                    }}>
                    <i className="fa-solid fa-circle-pause fa-2xl"></i>
                </button>}
                {runPlay === false && <button type="button" className="btn mx-1 btn-sm botonMenu"
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
            <div className='container-fluid py-2 ' style={{ height: '50vh' }}>
                <div className='row row-cols-2 g-1 mb-2'>
                    <div className='col' style={{ width: '300px' }}>
                        <div className='card bg-transparent'>
                            <div className='card-header bg-dark'>
                                <div className='text-light'>Lista Competidores</div>
                            </div>
                            <div className='card-body m-0 p-0'>
                                <div className='overflow-auto' style={{ maxHeight: '60vh' }}>
                                    <div className='bg-secondary'>
                                        <ul className="list-group">
                                            {listaElegida.map((item, index) => {
                                                return (
                                                    <li className={`${index == selectComp.position ? 'bg-success ' : 'bg-dark '}list-group-item w-100 mb-1`} key={index} onClick={() => selectCompetidor({ ...item, 'position': index })}>
                                                        <div className="card bg-transparent flex-row m-0 p-0" style={{ border: 'none' }} >
                                                            {UtilsBuffer.getFotoCard(item.FOTO, 40)}
                                                            <div className='ps-2 my-auto text-start' style={{ fontSize: '16px' }}>
                                                                <div className="letrasContenido text-light">{item.nombres + ' ' + item.apellidos}</div>
                                                                <div className='letrasContenido text-light'>club: <span className='fw-bold'>{item.club}</span></div>
                                                                <div className='letrasContenido text-light'>rompimiento: <span className='fw-bold'>{item.tiponombre}</span></div>
                                                            </div>
                                                        </div>
                                                    </li>)
                                            })}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col'>
                        <div className='container-fluid'>
                            <div className='w-100 bg-transparent text-center text-light mx-auto'>
                                <div className='ps-2 my-auto ' style={{ fontSize: '20px' }}>
                                    <div className="letrasContenido text-light fw-bold">{selectComp.nombres + ' ' + selectComp.apellidos}</div>
                                    <div className='letrasContenido text-light'>club: <span className='fw-bold'>{selectComp.club}</span></div>
                                    <div className='letrasContenido text-light'>rompimiento: <span className='fw-bold'>{selectComp.tiponombre}</span></div>
                                </div>
                            </div>
                            <div className='container-fluid d-flex justify-content-center'>
                                <div className='card bg-gradient'>
                                    {puntuacion == null && <div className='puntuacionTextE text-light text-center'>ok</div>}
                                    {puntuacion !== null && <div className='puntuacionTextE text-center'>
                                        {puntuacion ? <span className='text-success'>✓</span> : <span className='text-danger'>✖</span>}
                                    </div>}
                                    <div className='card-footer m-0 p-0'>
                                        <div className='container-fluid text-center w-100'>
                                            <div className='btn-group btn-group-sm'>
                                                <button className='btn btn-sm bg-success bg-gradient text-light '
                                                    onClick={() => {
                                                        localStorage.setItem('puntuacionRompimiento', JSON.stringify({
                                                            selectComp, selectItem, 'puntuacion': true, runPlay
                                                        })); cambiarPuntuacion(true)
                                                    }}
                                                    style={{ fontSize: '18px' }}>
                                                    <i className="fa-solid fa-circle-check"></i> Rompio
                                                </button>
                                                <button className='btn btn-sm bg-danger bg-gradient text-light mx-2'
                                                    onClick={() => {
                                                        localStorage.setItem('puntuacionRompimiento', JSON.stringify({
                                                            selectComp, selectItem, 'puntuacion': false, runPlay
                                                        })); cambiarPuntuacion(false)
                                                    }}
                                                    style={{ fontSize: '18px' }}>
                                                    <i className="fa-solid fa-circle-xmark"></i> No Rompio
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                {selectItem.categoria !== undefined && <div className=' w-100'>
                    <div className='row row-cols-2 g-1'>
                        <div className='col'>
                            <div className='tituloHeader text-light'>Categoria: <span className='fw-bold'>{selectItem.categoria}</span> {selectItem.genero == 'M' ? 'Masculino' : 'Femenino'}</div>
                            <div className='tituloHeader text-light'>Sub-Categoria: <span className='fw-bold'>{selectItem.subcategoria}</span></div>
                        </div>
                        <div className='col'>
                            <div className='tituloHeader text-light text-end'>Edad: <span className='fw-bold'>{selectItem.edadini}</span> - <span className='fw-bold'>{selectItem.edadfin} Años</span></div>
                            <div className='tituloHeader text-light text-end'>Grado: <span className='fw-bold'>{selectItem.GRADO.nombre}</span></div>
                        </div>
                    </div>
                </div>}
            </div>
            {showModal &&
                <div className='bg-dark bg-gradient py-1 overflow-auto' style={{ height: '45vh' }}>
                    <PrincipalLlaveRom categorias={categorias} idcampeonato={campeonato.idcampeonato}
                        genero={''} llaves={competidores} tipo={'R'} tipoL={'A'} collback={elegirListado} />
                </div>
            }
        </div>
    )
}

export default PrincipalPuntRompi