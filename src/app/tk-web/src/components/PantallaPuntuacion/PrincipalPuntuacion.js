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
    const [jugadorAzul,setJugadorAzul]=useState({});
    const [jugadorRojo,setJugadorRojo]=useState({});
    const [config,setConfig] = useState(false);
    const [nameConfig,setNameConfig] = useState('');
    const [tipo,setTipo] = useState('');
    const [genero,setGenero] = useState('');
    const [campeonato,setCampeonato] = useState({})
    useEffect(()=>{
        setCampeonato(JSON.parse(localStorage.getItem('campeonato')));
    },[])
    return (
        <ContextPuntuacion.Provider value={{
            pausa,setPausa, puntoAzul, setPuntoAzul, puntoRojo, setPuntoRojo,setShowModal,campeonato,
            jugadorAzul,setJugadorAzul,jugadorRojo,setJugadorRojo,runPelea,setRunPelea,tipo,setTipo,genero,setGenero
        }}>
            <Header puntuacion={true} />
            <div className='bg-transparent menu-flotante'>
                <div className="btn-group btn-group-sm" role="group" aria-label="Basic example">
                    <button type="button" className="btn btn-sm botonMenu" onClick={() => { setTipoModal('C'); setShowModal(true); }}>
                        <i className="fa-solid fa-gear"></i> Configuraciones</button>
                    <button type="button" className="btn mx-1 btn-sm botonMenu" onClick={() => { setTipoModal('P'); setShowModal(true); }}>
                        <i className="fa-solid fa-network-wired"></i> Peleas</button>
                    <button type="button" className="btn mx-1 btn-sm botonMenu">
                        <i className="fa-solid fa-broom"></i> Reset</button>
                    {runPelea === true && <button type="button" className="btn mx-1 btn-sm botonMenu" onClick={() => { setPausa(true); setRunPelea(false) }}>
                        <i className="fa-solid fa-circle-pause"></i> Pausar
                    </button>}
                    {pausa && <button type="button" className="btn mx-1 btn-sm botonMenu" onClick={() => { setPausa(false); setRunPelea(true); }}>
                        <i className="fa-solid fa-circle-play"></i> Iniciar
                    </button>}
                </div>
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
                {config&&<div className='nameSeccion text-center'>Sección {nameConfig}</div>}
                <RelojPelea/>
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
                                            <button className='btn btn-sm btnScore'>
                                                <i className="fa-solid fa-circle-plus fa-2xl"></i>
                                            </button>
                                            <button className='btn btn-sm btnScore'>
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
                                            <button className='btn btn-sm btnScore'>
                                                <i className="fa-solid fa-circle-plus fa-2xl"></i>
                                            </button>
                                            <button className='btn btn-sm btnScore'>
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
            <Modal show={showModal} onHide={()=>setShowModal(false)}
                size={'xl'}
                aria-labelledby="contained-modal-title-vcenter"
                contentClassName='bg-dark bg-gradient'>
                <Modal.Header bsPrefix='modal-header m-0 p-0 px-2 ' closeButton closeVariant='white'>
                    <Modal.Title >
                        {tipoModal === 'C' && <div className='text-light letraMontserratr mx-auto'>
                            <i className="fa-solid fa-gear fa-xl"></i> Configuraciones
                        </div>}
                        {tipoModal === 'P' && <div className='text-light letraMontserratr mx-auto'>
                            <i className="fa-solid fa-network-wired fa-xl"></i> Peleas
                        </div>}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body bsPrefix='modal-body m-0 p-0 '>
                    {tipoModal === 'C' && <Configuraciones setShowModal={setShowModal} 
                        nameConfig={nameConfig} setNameConfig={setNameConfig}
                        config={config} setConfig={setConfig}/>}
                    {tipoModal === 'P' && <ListaPeleas />}
                </Modal.Body>
            </Modal>
        </ContextPuntuacion.Provider>
    )
}

export default PrincipalPuntuacion
