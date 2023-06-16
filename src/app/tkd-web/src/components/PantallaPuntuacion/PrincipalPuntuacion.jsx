import React, { createContext, useContext, useEffect, useState } from 'react'
import Header from '../Header';
import PuntuacionUser from './PuntuacionUser';
import Modal from 'react-bootstrap/Modal';
import Configuraciones from './Configuraciones';
import ListaPeleas from './ListaPeleas';
import RelojPelea from './RelojPelea';
import RelojPausa from './RelojPausa';
import MsgUtils from '../utils/MsgUtils';
import { ContextAplicacions } from '../Context/ContextAplicacion';
import { useNavigate,Link } from 'react-router-dom';
export const ContextPuntuacion = createContext();
import {server} from '../utils/MsgUtils';

function PrincipalPuntuacion() {
    const navigate = useNavigate();
    const { setLogin, setUserLogin, campeonato, setCampeonato, setTitulo } = useContext(ContextAplicacions);
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
    const [playGanador, setPlayGanador] = useState({});
    const [numPelea, setNumPelea] = useState('');
    const [resetJuego, setResetJuego] = useState(false);
    const [numeroRound, setNumeRound] = useState(0);
    const [listaNumRound, setListaNumRound] = useState([]);
    const [roundWinAzul, setRoundWinAzul] = useState(0);
    const [roundWinRojo, setRoundWinRojo] = useState(0);
    const [endTiempo, setEndTiempo] = useState(false);
    const [mapPuntos,setMapPuntos] = useState({});
    function recetearValores() {
        setListaNumRound([]);
        setRoundWinAzul(0);
        setRoundWinRojo(0);
        setNumeRound(0);
        setPausa(false);
        setRunPelea(false);
        setPuntoAzul(0);
        setPuntoRojo(0);
        setFaltasAzul(0);
        setFaltasRojo(0);
        setJugadorAzul({});
        setJugadorRojo({});
        setNumPelea('');
        setPlayGanador({});
        setResetJuego(!resetJuego);
    }
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
    function guardarDatosGanador() {
        setShowModal(false);
        if (configJuego.enableMaxRound === true) {
            if (endTiempo === true) {
                setEndTiempo(false);
                if (numeroRound === parseInt(configJuego.numRound)) {
                    //mostrar ganador final
                } else {
                    setPuntoAzul(0);
                    setPuntoRojo(0);
                    setFaltasAzul(0);
                    setFaltasRojo(0);
                }
            } else {
                setEndTiempo(false);
                console.log(playGanador);
            }
        }
    }
    function functionContarPunto(lista){
        let conteo = {}
        let rep_max = 0;
        let elem_max;
        lista.map(element=> {
            if(conteo[element]){
                conteo[element] += 1;
            }else{
                conteo[element] = 1;   
            }
            if(rep_max<conteo[element]){
                rep_max=conteo[element];
                elem_max=element
            }
        });
        return [rep_max,elem_max]
    }
    function hayDiferencia(azul,rojo){
        if(configJuego.enableDif){
            if(parseInt(azul)>parseInt(rojo)){
                var diferencia = Math.abs(azul-rojo);
                if(diferencia>=parseInt(configJuego.diffPuntos)){
                    setRoundWinAzul(roundWinAzul+1);
                    setPlayGanador({...jugadorAzul,'color':'A'});
                    setTipoModal('W');
                    setShowModal(true);
                }
            }else{
                var diferencia = Math.abs(azul-rojo);
                if(diferencia>=parseInt(configJuego.diffPuntos)){
                    setRoundWinRojo(roundWinRojo+1);
                    setPlayGanador({...jugadorRojo,'color':'R'});
                    setTipoModal('W');
                    setShowModal(true);
                }
            }
        }
    }
    function getPuntosMando() {
        fetch(`${server}/mandojuec/getPuntosMando`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({
                'sector':nameConfig,'numMandos':configJuego.numMandos
            })
        })
            .then(res => res.json())
            .then(data => {
                if(data.ok){
                    var puntos = data.ok.map(item=>item.dato)
                    puntos = functionContarPunto(puntos)
                    console.log(puntos);
                    if(puntos[1]!=''&& puntos[0]>=configJuego.maxJueces){
                        if(puntos[1]=='d'||puntos[1]=='D'||puntos[1]=='P'||puntos[1]=='c'||puntos[1]=='C'){
                            console.log("agregando punto al azul");
                            var ptA = puntoAzul+parseInt(mapPuntos[puntos[1]]);
                            hayDiferencia(ptA,puntoRojo);
                            setPuntoAzul(ptA);
                            
                        }else{
                            console.log("agregar punto al rojo");
                            var ptR = puntoRojo+parseInt(mapPuntos[puntos[1]]);
                            hayDiferencia(puntoAzul,ptR);
                            setPuntoRojo(ptR);
                        }
                        //validar si hay diferencia de puntos
                        //
                    }
                }
            })
            .catch(error => MsgUtils.msgError(error));
    }
    useEffect(() => {
        console.log("aumento lista de round")
        if (config && endTiempo === true) {
            setListaNumRound(Array(numeroRound).fill(0));
            if (configJuego.enableMaxRound === true) {
                if (puntoAzul > puntoRojo) {
                    setRoundWinAzul(roundWinAzul + 1);
                    setTipoModal('W');
                    setPlayGanador({ ...jugadorAzul, 'color': 'A' });
                    setShowModal(true);
                } else if (puntoAzul < puntoRojo) {
                    setRoundWinRojo(roundWinRojo + 1);
                    setTipoModal('W');
                    setPlayGanador({ ...jugadorRojo, 'color': 'R' });
                    setShowModal(true);
                } else {
                    //empate
                }
            }
        }
    }, [numeroRound])
    useEffect(() => {
        var sessionActiva = JSON.parse(localStorage.getItem('login'));
        var cmp = JSON.parse(localStorage.getItem('campeonato'));
        if (sessionActiva !== null) {
            setTitulo('')
            setCampeonato(cmp);
            setLogin(true);
            setUserLogin(sessionActiva);
            navigate("/gamePunt", { replace: true });
        }
    }, [])
    return (
        <ContextPuntuacion.Provider value={{
            pausa, setPausa, puntoAzul, setPuntoAzul, puntoRojo, setPuntoRojo, setShowModal, campeonato, setConfigJuego, configJuego,
            jugadorAzul, setJugadorAzul, jugadorRojo, setJugadorRojo, runPelea, setRunPelea, tipo, setTipo, genero, setGenero,
            nameConfig, setNameConfig, config, setConfig, faltasAzul, setFaltasAzul, faltasRojo, setFaltasRojo, setTipoModal,
            playGanador, setPlayGanador, numPelea, setNumPelea, resetJuego, numeroRound, setNumeRound, endTiempo, setEndTiempo,
            roundWinAzul, setRoundWinAzul, roundWinRojo, setRoundWinRojo, getPuntosMando,mapPuntos,setMapPuntos
        }}>
            <Header puntuacion={true} />
            <div className='bg-transparent menu-flotante'>
                <div className="btn-group btn-group-sm" role="group" aria-label="Basic example">
                    <Link className='btn btn-sm botonMenu' data-bs-toggle="tooltip" 
                        data-bs-placement="bottom" title="Abrir pantalla extendida"
                        to={'/scoreDobleK'} target='blanck'>
                        <i className="fa-brands fa-windows fa-2xl"></i>
                    </Link>
                    <button type="button" className="btn mx-1 btn-sm botonMenu"
                        data-bs-toggle="tooltip" data-bs-placement="bottom" title="Configuraciones de puntuacion"
                        onClick={() => { setTipoModal('C'); setShowModal(true); }}>
                        <i className="fa-solid fa-gear fa-2xl"></i></button>
                    <button type="button" className="btn mx-1 btn-sm botonMenu"
                        data-bs-toggle="tooltip" data-bs-placement="bottom" title="Ver peleas del Campeonato"
                        onClick={() => { setTipoModal('P'); setShowModal(true); }}>
                        <i className="fa-solid fa-network-wired fa-2xl"></i></button>
                    <button type="button" className="btn mx-1 btn-sm botonMenu"
                        data-bs-toggle="tooltip" data-bs-placement="bottom" title="Recetear valores iniciales"
                        onClick={() => recetearValores()}>
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
                {numPelea !== '' &&
                    <div>
                        <div className='numeroPelea text-light fa-fade'>
                            {`Pelea #${numPelea}`}
                        </div>
                        {listaNumRound &&
                            <div className="btn-group btn-group-sm">
                                {listaNumRound.map((i, j) => {
                                    return (
                                        <button className='btn btn-sm btn-success mx-1 text-light text-center' key={j}>
                                            <i className="fa-solid fa-circle fa-2xl"></i>
                                        </button>
                                    )
                                })}
                            </div>}
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
                {pausa && runPelea == false && <RelojPausa />}
            </div>
            {pausa && <div className='container-fluid footer-flotante'>
                <div className='row row-cols-2 g-0'>
                    <div className='col text-center'>
                        <div className='container-fluid'>
                            <div className='row row-cols-2 g-0'>
                                <div className='col'>
                                    <div className='text-light'>
                                        Derrota por
                                    </div>
                                    <div className='container-fluid'>
                                        <div className="btn-group btn-group-sm">
                                            <button className='btn btn-sm btnScore text-danger'>
                                                <i className="fa-solid fa-skull-crossbones fa-2xl"></i>
                                            </button>
                                            <button className='btn btn-sm btnScore text-warning'>
                                                <i className="fa-solid fa-diamond fa-2xl"></i>
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
                                <div className='col'>
                                    <div className='text-light'>
                                        Derrota Por
                                    </div>
                                    <div className='container-fluid'>
                                        <div className="btn-group btn-group-sm">
                                            <button className='btn btn-sm btnScore text-warning'>
                                                <i className="fa-solid fa-diamond fa-2xl"></i>
                                            </button>
                                            <button className='btn btn-sm btnScore text-danger'>
                                                <i className="fa-solid fa-skull-crossbones fa-2xl"></i>
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
                <Modal.Header bsPrefix='modal-header m-0 p-0 px-2 w-100' closeButton={tipoModal === 'W' ? false : true} closeVariant='white'>
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
                        <div className={`container-fluid bg-gradient ${playGanador.color === 'R' ? 'bg-danger' : 'bg-primary'}`}>
                            <div className='ganadorTitulo fa-fade text-center'>
                                {playGanador.nombre}
                            </div>
                            <div className='ganadorSubtitulo fa-fade text-center bg-dark w-100'>
                                {playGanador.club}
                            </div>
                            <div className='py-1 w-100'>
                                <button className='btn btn-sm bg-gradient btn-success w-100' onClick={() => guardarDatosGanador()}>
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
