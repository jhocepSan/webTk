import React, { createContext, useEffect, useState } from 'react'
import Header from '../Header';
import PuntuacionUser from './PuntuacionUser';
import Modal from 'react-bootstrap/Modal';
import Configuraciones from './Configuraciones';
import ListaPeleas from './ListaPeleas';
import RelojPelea from './RelojPelea';
export const ContextPuntuacion = createContext();

function PrincipalPuntuacion() {
    const [showModal, setShowModal] = useState(false);
    const [tipoModal, setTipoModal] = useState(false);
    const [pausa, setPausa] = useState(false);
    const [runPelea, setRunPelea] = useState(false);
    const [puntoAzul, setPuntoAzul] = useState(0);
    const [puntoRojo, setPuntoRojo] = useState(0);
    const [faltasAzul, setFaltasAzul] = useState(0);
    const [faltasRojo, setFaltasRojo] = useState(0);
    const [jugadorAzul, setJugadorAzul] = useState({});
    const [jugadorRojo, setJugadorRojo] = useState({});
    const [configJuego, setConfigJuego] = useState({});
    const [config, setConfig] = useState(false);
    const [nameConfig, setNameConfig] = useState('');
    const [tipo, setTipo] = useState('');
    const [genero, setGenero] = useState('');
    const [campeonato, setCampeonato] = useState({});
    const [playGanador,setPlayGanador] =useState({});
    const [numPelea,setNumPelea]=useState('');
    function procesarFalta(tipo, color) {
        if (tipo) {
            if (color == 'A') {
                setFaltasAzul(faltasAzul + 1);
                setPuntoRojo(puntoRojo + parseInt(configJuego.falta));
            } else {
                setFaltasRojo(faltasRojo + 1);
                setPuntoAzul(puntoAzul + parseInt(configJuego.falta));
            }
        } else {
            if (color == 'A') {
                setFaltasAzul(faltasAzul - 1);
                setPuntoRojo(puntoRojo - parseInt(configJuego.falta));
            } else {
                setFaltasRojo(faltasRojo - 1);
                setPuntoAzul(puntoAzul - parseInt(configJuego.falta));
            }
        }
    }
    function guardarDatosGanador(){
        setShowModal(false);
    }
    useEffect(() => {
        setCampeonato(JSON.parse(localStorage.getItem('campeonato')));
    }, [])
    return (
        <ContextPuntuacion.Provider value={{
            pausa, setPausa, puntoAzul, setPuntoAzul, puntoRojo, setPuntoRojo, setShowModal, campeonato, setConfigJuego, configJuego,
            jugadorAzul, setJugadorAzul, jugadorRojo, setJugadorRojo, runPelea, setRunPelea, tipo, setTipo, genero, setGenero,
            nameConfig, setNameConfig, config, setConfig, faltasAzul, setFaltasAzul, faltasRojo, setFaltasRojo,setTipoModal,
            playGanador,setPlayGanador,numPelea,setNumPelea
        }}>
            <Header puntuacion={true} />
            <div className='bg-transparent menu-flotante'>
                <div className="btn-group btn-group-sm" role="group" aria-label="Basic example">
                    <button className='btn btn-sm botonMenu' data-bs-toggle="tooltip" data-bs-placement="bottom" title="Abrir pantalla extendida">
                        <i className="fa-brands fa-windows fa-2xl"></i>
                    </button>
                    <button type="button" className="btn mx-1 btn-sm botonMenu"
                        data-bs-toggle="tooltip" data-bs-placement="bottom" title="Configuraciones de puntuacion"
                        onClick={() => { setTipoModal('C'); setShowModal(true); }}>
                        <i className="fa-solid fa-gear fa-2xl"></i></button>
                    <button type="button" className="btn mx-1 btn-sm botonMenu"
                        data-bs-toggle="tooltip" data-bs-placement="bottom" title="Ver peleas del Campeonato"
                        onClick={() => { setTipoModal('P'); setShowModal(true); }}>
                        <i className="fa-solid fa-network-wired fa-2xl"></i></button>
                    <button type="button" className="btn mx-1 btn-sm botonMenu"
                        data-bs-toggle="tooltip" data-bs-placement="bottom" title="Recetear valores iniciales">
                        <i className="fa-solid fa-repeat fa-2xl"></i></button>
                    {runPelea === true && <button type="button" className="btn mx-1 btn-sm botonMenu"
                        data-bs-toggle="tooltip" data-bs-placement="bottom" title="Pausar Competencia"
                        onClick={() => { setPausa(true); setRunPelea(false) }}>
                        <i className="fa-solid fa-circle-pause fa-2xl"></i>
                    </button>}
                    {pausa && <button type="button" className="btn mx-1 btn-sm botonMenu"
                        data-bs-toggle="tooltip" data-bs-placement="bottom" title="Iniciar Competencia"
                        onClick={() => { setPausa(false); setRunPelea(true); }}>
                        <i className="fa-solid fa-circle-play fa-2xl"></i>
                    </button>}
                </div>
                {numPelea!==''&&<div className='numeroPelea text-light fa-fade'>
                    {`Pelea #${numPelea}`}
                </div>}
            </div>
            <div className='container-fluid'>
                <div className='row row-cols-2 vh-100'>
                    <div className='col bg-primary d-flex justify-content-center '>
                        <PuntuacionUser position={true} />
                    </div>
                    <div className='col bg-danger d-flex justify-content-center'>
                        <PuntuacionUser position={false} />
                    </div>
                </div>
            </div>
            <div className='relojPelea'>
                {config && <div className='nameSeccion text-center'>Area # {nameConfig}</div>}
                <RelojPelea />
            </div>
            {pausa && <div className='container-fluid footer-flotante'>
                <div className='row row-cols-2 g-0'>
                    <div className='col text-center'>
                        <div className='container-fluid'>
                            <div className='row row-cols-2 g-0'>
                                <div className='col'>
                                    <div className='text-light'>
                                        Kyong-go
                                    </div>
                                    <div className='container-fluid'>
                                        <div className="btn-group btn-group-sm">
                                            <button className='btn btn-sm btnScore'>
                                                <i className="fa-solid fa-circle-plus fa-2xl"></i>
                                            </button>
                                            <button className='btn btn-sm btnScore'>
                                                <i className="fa-solid fa-circle-minus fa-2xl"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className='col'>
                                    <div className='text-light'>
                                        Gam-jeom
                                    </div>
                                    <div className='container-fluid'>
                                        <div className="btn-group btn-group-sm">
                                            <button className='btn btn-sm btnScore' onClick={() => procesarFalta(true, 'A')}>
                                                <i className="fa-solid fa-circle-plus fa-2xl"></i>
                                            </button>
                                            <button className='btn btn-sm btnScore' onClick={() => procesarFalta(false, 'A')}>
                                                <i className="fa-solid fa-circle-minus fa-2xl"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col text-center'>
                        <div className='container-fluid'>
                            <div className='row row-cols-2 g-0'>
                                <div className='col'>
                                    <div className='text-light'>
                                        Kyong-go
                                    </div>
                                    <div className='container-fluid'>
                                        <div className="btn-group btn-group-sm">
                                            <button className='btn btn-sm btnScore'>
                                                <i className="fa-solid fa-circle-plus fa-2xl"></i>
                                            </button>
                                            <button className='btn btn-sm btnScore'>
                                                <i className="fa-solid fa-circle-minus fa-2xl"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className='col'>
                                    <div className='text-light'>
                                        Gam-jeom
                                    </div>
                                    <div className='container-fluid'>
                                        <div className="btn-group btn-group-sm">
                                            <button className='btn btn-sm btnScore' onClick={() => procesarFalta(true, 'R')}>
                                                <i className="fa-solid fa-circle-plus fa-2xl"></i>
                                            </button>
                                            <button className='btn btn-sm btnScore' onClick={() => procesarFalta(false, 'R')}>
                                                <i className="fa-solid fa-circle-minus fa-2xl"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
            <Modal show={showModal} onHide={() => setShowModal(false)}
                size={'xl'}
                backdrop="static"
                aria-labelledby="contained-modal-title-vcenter"
                contentClassName='bg-dark bg-gradient'>
                <Modal.Header bsPrefix='modal-header m-0 p-0 px-2 w-100' closeButton={tipoModal==='W'?false:true} closeVariant='white'>
                    {tipoModal === 'C' && <div className='text-light letraMontserratr mx-auto'>
                        <i className="fa-solid fa-gear fa-xl"></i> Configuraciones
                    </div>}
                    {tipoModal === 'P' && <div className='text-light letraMontserratr mx-auto'>
                        <i className="fa-solid fa-network-wired fa-xl"></i> Peleas
                    </div>}
                    {tipoModal === 'W' && <div className='text-light letraMontserratr mx-auto w-100 text-center'>
                        <i className="fa-solid fa-burst fa-xl fa-fade"></i> Hay Ganador <i className="fa-solid fa-burst fa-xl fa-fade"></i>
                    </div>}
                </Modal.Header>
                <Modal.Body bsPrefix='modal-body m-0 p-0 '>
                    {tipoModal === 'C' && <Configuraciones />}
                    {tipoModal === 'P' && <ListaPeleas />}
                    {tipoModal === 'W' &&
                    <div className={`container-fluid bg-gradient ${playGanador.color==='R'?'bg-danger':'bg-primary'}`}>
                        <div className='ganadorTitulo fa-fade text-center'>
                            {playGanador.nombre}
                        </div>
                        <div className='py-1 w-100'>
                            <button className='btn btn-sm bg-gradient btn-success w-100' onClick={()=>guardarDatosGanador()}>
                                Aceptar
                            </button>
                        </div>
                    </div>
                    }
                </Modal.Body>
            </Modal>
        </ContextPuntuacion.Provider>
    )
}

export default PrincipalPuntuacion
