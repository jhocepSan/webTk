import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { ContextAplicacions } from '../Context/ContextAplicacion';
import VistaMandos from '../GamePad/VistaMandos';
import { getListaClubs } from '../utils/UtilsConsultas';
import RelojKirugui from '../GamePad/RelojKirugui';
import VisorPunto from '../GamePad/VisorPunto';
import VisorFaltas from '../GamePad/VisorFaltas';
import Modal from 'react-bootstrap/Modal';
import MsgUtils from '../utils/MsgUtils';
import EstadisticaPelea from '../GamePad/EstadisticaPelea';
import AdminLlaves from '../ListaCompetidores/AdminLlaves';
import LlavesConsultas from '../ConsultasApi/LlavesConsultas';

const accionesTeclado = {
    r: 'puntoRN', R: 'puntoRP', L: 'L', l: 'l',
    f: 'faltaAR', F: 'faltaA', A: 'puntoAP', a: 'puntoAN',
    P: 'buttonPlay', Q: 'faltaR', q: 'faltaRR',
    '.': 'btnReset', '-': 'btnSubMin', '+': 'btnSumMin'
};

// Forma unica del estado de un combate: evita objetos con campos que aparecen y desaparecen
const PUNTAJE_INICIAL = {
    'isPlay': false, 'round': 1, 'reset': false, 'newRound': false,
    'puntoA': 0, 'faltaA': 0, 'puntoR': 0, 'faltaR': 0, 'gano': '', 'final': null
};

// Valores numericos de configuracion con su valor por defecto (evita los NaN)
const CONFIG_POR_DEFECTO = {
    'falta': 1, 'diffPuntos': 0, 'maxFaltas': 0, 'numRound': 0, 'maxJueces': 0
};

// tipoM -> color ganador ('AP' = azul por puntos, 'RR' = rojo por rondas, etc.)
const COLOR_GANADOR = { 'A': 'A', 'AP': 'A', 'AR': 'A', 'R': 'R', 'RP': 'R', 'RR': 'R' };

const NOTAS = [261, 277, 293, 311, 329, 349, 369, 392, 415, 440, 466, 493];

function aEntero(valor, porDefecto = 0) {
    const numero = parseInt(valor, 10);
    return Number.isFinite(numero) ? numero : porDefecto;
}

function leerJSON(clave, porDefecto = null) {
    try {
        const valor = localStorage.getItem(clave);
        return valor ? JSON.parse(valor) : porDefecto;
    } catch (error) {
        return porDefecto;
    }
}

// Deja la configuracion con todos sus numeros validos, conservando el resto de claves
function normalizarConfig(conf) {
    const origen = (conf && typeof conf === 'object') ? conf : {};
    const normalizada = { ...origen };
    Object.keys(CONFIG_POR_DEFECTO).forEach((clave) => {
        normalizada[clave] = aEntero(origen[clave], CONFIG_POR_DEFECTO[clave]);
    });
    return normalizada;
}

// Un solo AudioContext para toda la pantalla: los navegadores limitan cuantos se pueden crear
let contextoAudio = null;
function obtenerContextoAudio() {
    const Constructor = window.AudioContext || window.webkitAudioContext;
    if (!Constructor) return null;
    if (!contextoAudio || contextoAudio.state === 'closed') contextoAudio = new Constructor();
    if (contextoAudio.state === 'suspended') contextoAudio.resume().catch(() => { });
    return contextoAudio;
}

function PrincipalKirugui({ area = 0, setPagina }) {
    const navigate = useNavigate();
    const { setLogin, setUserLogin, campeonato, setCampeonato, setTitulo, userLogin } = useContext(ContextAplicacions);
    const [activarLectura, setActivarLectura] = useState(false);
    const [configure, setConfigure] = useState(() => normalizarConfig(null));
    const [clubes, setClubes] = useState([]);
    const [idClubA, setIdClubA] = useState(-1);
    const [idClubR, setIdClubR] = useState(-1);
    const [nombreA, setNombreA] = useState('');
    const [nombreR, setNombreR] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [tipoM, setTipoM] = useState('');
    const [mapPuntos, setMapPuntos] = useState({});
    const [puntoJuego, setPuntoJuego] = useState({ ...PUNTAJE_INICIAL });
    const [idArea, setIdArea] = useState(area);
    const [msgModal, setMsgModal] = useState({});
    const [resultPre, setResultPre] = useState([]);
    const [mandoLec, setMandoLec] = useState([]);
    const [ventana, setVentana] = useState(0);
    const [selectPelea, setSelectPelea] = useState(null);
    const [enviando, setEnviando] = useState(false);

    // Resumen de las rondas ya cerradas: se calcula una sola vez por cambio de resultPre
    const resumenPre = useMemo(() => {
        let faltasA = 0, faltasR = 0, roundsA = 0, roundsR = 0;
        for (const item of resultPre) {
            faltasA += aEntero(item.faltaA);
            faltasR += aEntero(item.faltaR);
            if (item.gano === 'A') roundsA += 1;
            else if (item.gano === 'R') roundsR += 1;
        }
        return { faltasA, faltasR, roundsA, roundsR };
    }, [resultPre]);

    // Faltas de las rondas anteriores + las de la ronda en curso
    function getFaltasTotales(color) {
        return color === 'A'
            ? resumenPre.faltasA + aEntero(puntoJuego.faltaA)
            : resumenPre.faltasR + aEntero(puntoJuego.faltaR);
    }

    function getRoundWin(color) {
        return color === 'A' ? resumenPre.roundsA : resumenPre.roundsR;
    }

    // Unica salida hacia la pantalla extendida: siempre con los mismos campos
    function publicarPantalla(estado, extra = {}) {
        localStorage.setItem('doblePant', JSON.stringify({
            ...PUNTAJE_INICIAL, ...estado, nombreA, nombreR, area: idArea, ...extra
        }));
    }

    // Cambia el estado y lo publica en un solo paso
    function aplicarEstado(cambios, extra = {}) {
        const nuevo = { ...puntoJuego, ...cambios };
        setPuntoJuego(nuevo);
        publicarPantalla(nuevo, extra);
        return nuevo;
    }

    // Regla de diferencia de puntos: se cierra al alcanzar la diferencia configurada
    function evaluarDiferencia(puntos) {
        if (!configure.enableDif) return '';
        const diferenciaMaxima = aEntero(configure.diffPuntos);
        if (diferenciaMaxima <= 0) return '';
        const diferencia = aEntero(puntos.puntoA) - aEntero(puntos.puntoR);
        if (diferencia >= diferenciaMaxima) return 'A';
        if (-diferencia >= diferenciaMaxima) return 'R';
        return '';
    }

    function hayGanador(color) {
        Sonido(5);
        setTipoM(color);
        setShowModal(true);
    }
    function recetearValores() {
        setNombreA('');
        setNombreR('');
        setIdClubA(-1);
        setIdClubR(-1);
        setPuntoJuego({ ...PUNTAJE_INICIAL, 'reset': true });
        setResultPre([]);
        setSelectPelea(null);
        setMsgModal({});
        publicarPantalla({ ...PUNTAJE_INICIAL, 'reset': true }, { nombreA: '', nombreR: '' });
    }
    const getClubes = async () => {
        if (clubes.length > 0) return;
        try {
            const resut = await getListaClubs();
            if (resut.ok) {
                setClubes(resut.ok);
            } else {
                MsgUtils.msgError(resut.error);
            }
        } catch (error) {
            MsgUtils.msgError(error.message);
        }
    }
    function getClubesNombre(id) {
        const club = clubes.find((item) => item.idclub == id);
        return club ? club.nombre : '';
    }
    function procesarFalta(tipo, valor) {
        const delta = aEntero(valor);
        const campoFalta = tipo ? 'faltaA' : 'faltaR';
        const campoRival = tipo ? 'puntoR' : 'puntoA';
        const faltaActual = aEntero(puntoJuego[campoFalta]);
        if (delta < 0 && faltaActual <= 0) return;

        const nuevaFalta = Math.max(0, faltaActual + delta);
        const puntosFalta = aEntero(configure.falta);
        const nuevo = {
            ...puntoJuego,
            [campoFalta]: nuevaFalta,
            [campoRival]: aEntero(puntoJuego[campoRival]) + (delta * puntosFalta),
            'gano': '', 'final': null
        };

        const maxFaltas = aEntero(configure.maxFaltas);
        if (maxFaltas > 0 && nuevaFalta >= maxFaltas) {
            const ganoFalta = tipo ? 'R' : 'A';
            const finalizado = { ...nuevo, 'isPlay': false, 'reset': true, 'gano': ganoFalta };
            setPuntoJuego(finalizado);
            publicarPantalla(finalizado);
            hayGanador(ganoFalta);
            return;
        }

        aplicarEstado(nuevo);
    }
    function procesarPunto(color, valor) {
        const delta = aEntero(valor);
        const campo = color ? 'puntoA' : 'puntoR';
        const actual = aEntero(puntoJuego[campo]);
        if (delta < 0 && actual <= 0) return;

        const nuevo = { ...puntoJuego, [campo]: Math.max(0, actual + delta), 'gano': '', 'final': null };
        const ganoDiferencia = evaluarDiferencia(nuevo);
        if (ganoDiferencia) {
            aplicarEstado({ ...nuevo, 'isPlay': false, 'reset': true, 'gano': ganoDiferencia });
            hayGanador(ganoDiferencia);
            return;
        }
        aplicarEstado(nuevo);
    }

    // Cierra la ronda/combate cuando se acaba el tiempo: una sola regla decide
    function calcularResultado() {
        ejecutarJuego(false);
        if (configure.enableMaxRound) {
            const diferencia = aEntero(puntoJuego.puntoA) - aEntero(puntoJuego.puntoR);
            if (diferencia > 0) declararFinPeriodo('A');
            else if (diferencia < 0) declararFinPeriodo('R');
            // Ronda empatada: el combate no puede quedarse sin cerrar
            else declararFinPeriodo('EM');
        } else if (configure.enableMaxPoint) {
            const diferencia = aEntero(puntoJuego.puntoA) - aEntero(puntoJuego.puntoR);
            if (diferencia > 0) declararFinPeriodo('A');
            else if (diferencia < 0) declararFinPeriodo('R');
            else declararFinPeriodo('EM');
        }
    }

    function declararFinPeriodo(color) {
        // El modal muestra los puntos de esta ronda, nunca los de un combate anterior
        setMsgModal({
            'azul': aEntero(puntoJuego.puntoA),
            'rojo': aEntero(puntoJuego.puntoR),
            'tipo': 'puntosActuales'
        });
        aplicarEstado({ 'gano': color, 'isPlay': false, 'final': null });
        hayGanador(color);
    }

    function declararGanador(punto, color) {
        if (color == 'A') aplicarEstado({ 'puntoA': aEntero(punto), 'gano': 'A' });
        else if (color == 'R') aplicarEstado({ 'puntoR': aEntero(punto), 'gano': 'R' });
        hayGanador(color);
    }

    // El ganador sale del resultado del combate (tipoM), nunca del texto del modal
    const resultadoFinal = async (colorForzado) => {
        const colorGanador = colorForzado || COLOR_GANADOR[tipoM] || '';
        if (!colorGanador) {
            MsgUtils.msgError('Combate empatado: elija quien gana antes de guardar.');
            return;
        }
        if (!selectPelea) {
            MsgUtils.msgError('Elija una pelea antes de guardar ...');
            return;
        }
        if (enviando) return;
        setEnviando(true);
        try {
            const esAzul = colorGanador === 'A';
            const idganador = esAzul ? selectPelea.idcompetidor1 : selectPelea.idcompetidor2;
            const idperdedor = esAzul ? selectPelea.idcompetidor2 : selectPelea.idcompetidor1;
            const result = await LlavesConsultas.procesarLlavePelea({
                idganador, idperdedor, 'nivel': selectPelea.tipo, 'idpelea': selectPelea.idpelea, 'idllave': selectPelea.idllave
            });
            if (result.ok) {
                MsgUtils.msgCorrecto(result.ok);
                setShowModal(false);
                recetearValores();
            } else {
                MsgUtils.msgError(result.error)
            }
        } catch (error) {
            MsgUtils.msgError(error.message);
        } finally {
            setEnviando(false);
        }
    }
    function lecturadeDatos(datos) {
        const [repeticiones, valorPunto] = datos; // Desestructuración para claridad [2, 'P']
        if (!puntoJuego.isPlay || valorPunto === '') return;

        const minJueces = aEntero(configure.maxJueces);
        // Sin configuracion de jueces no se otorgan puntos por lectura
        if (minJueces <= 0 || repeticiones < minJueces) return;

        const valorASumar = aEntero(mapPuntos[valorPunto]);
        const campo = ['d', 'D', 'P', 'c', 'C'].includes(valorPunto) ? 'puntoA' : 'puntoR';
        const nuevoPunto = {
            ...puntoJuego,
            [campo]: aEntero(puntoJuego[campo]) + valorASumar,
            'gano': '', 'final': null
        };

        const gano = evaluarDiferencia(nuevoPunto);
        if (gano) {
            nuevoPunto.isPlay = false;
            nuevoPunto.reset = true;
            nuevoPunto.gano = gano;
            hayGanador(gano);
        }

        setPuntoJuego(nuevoPunto);
        localStorage.setItem('contAux', 0);
        publicarPantalla(nuevoPunto);
    }
    const guardarCombate = async (colorForzado) => {
        if (enviando) return;
        if (!selectPelea) {
            MsgUtils.msgError('Elija una pelea antes de guardar ...');
            return;
        }
        setEnviando(true);
        try {
            const result = await LlavesConsultas.addSeguimientoPelea({ ...puntoJuego, 'idpelea': selectPelea.idpelea });
            if (!result.ok) {
                MsgUtils.msgError(result.error);
                return;
            }

            // Se guarda una sola vez por ronda: el boton queda bloqueado mientras se envia
            // colorForzado decide el ganador de una ronda empatada (modo max round)
            const datos = [...resultPre, { ...puntoJuego, 'gano': colorForzado || tipoM }];
            setResultPre(datos);
            const totalRondas = aEntero(configure.numRound);

            if (totalRondas === aEntero(puntoJuego.round)) {
                if (configure.enableMaxPoint) {
                    const sumaA = datos.reduce((acumulador, item) => acumulador + aEntero(item.puntoA), 0);
                    const sumaR = datos.reduce((acumulador, item) => acumulador + aEntero(item.puntoR), 0);
                    const final = { 'tipo': 'puntos', 'azul': sumaA, 'rojo': sumaR };
                    setMsgModal({ 'azul': sumaA, 'rojo': sumaR, 'tipo': 'sumaPuntos' });
                    if (sumaA > sumaR) {
                        setTipoM('AP');
                        aplicarEstado({ 'gano': 'A', 'isPlay': false, 'final': { ...final, 'gano': 'A' } });
                    } else if (sumaR > sumaA) {
                        setTipoM('RP');
                        aplicarEstado({ 'gano': 'R', 'isPlay': false, 'final': { ...final, 'gano': 'R' } });
                    } else {
                        // Empate en el combate: la pantalla del publico muestra EMPATE
                        setTipoM('EP');
                        aplicarEstado({ 'gano': 'EM', 'isPlay': false, 'final': { ...final, 'gano': 'EM' } });
                    }
                } else if (configure.enableMaxRound) {
                    const roundA = datos.filter((item) => item.gano == 'A');
                    const roundR = datos.filter((item) => item.gano == 'R');
                    const final = { 'tipo': 'rounds', 'azul': roundA.length, 'rojo': roundR.length };
                    setMsgModal({ 'azul': roundA.length, 'rojo': roundR.length, 'tipo': 'conteoRondas' });
                    if (roundA.length > roundR.length) {
                        setTipoM('AR');
                        aplicarEstado({ 'gano': 'A', 'isPlay': false, 'final': { ...final, 'gano': 'A' } });
                    } else if (roundR.length > roundA.length) {
                        setTipoM('RR');
                        aplicarEstado({ 'gano': 'R', 'isPlay': false, 'final': { ...final, 'gano': 'R' } });
                    } else {
                        setTipoM('ER');
                        aplicarEstado({ 'gano': 'EM', 'isPlay': false, 'final': { ...final, 'gano': 'EM' } });
                    }
                }
                return;
            }

            const siguienteRound = aEntero(puntoJuego.round) + 1;
            if (configure.enableMaxRound) {
                const roundA = datos.filter((item) => item.gano == 'A');
                const roundR = datos.filter((item) => item.gano == 'R');
                const final = { 'tipo': 'rounds', 'azul': roundA.length, 'rojo': roundR.length };
                // Combate decidido por rounds aunque todavia queden rounds por pelear
                const ganoCombate = (totalRondas - roundA.length) === 1 ? 'A'
                    : (totalRondas - roundR.length) === 1 ? 'R' : '';
                aplicarEstado({
                    ...PUNTAJE_INICIAL, 'round': siguienteRound, 'newRound': true, 'reset': true,
                    // El publico tambien anuncia al ganador del combate
                    'gano': ganoCombate,
                    'final': ganoCombate ? { ...final, 'gano': ganoCombate } : null
                });
                if (ganoCombate == 'A') {
                    setMsgModal({ 'azul': roundA.length, 'rojo': roundR.length, 'tipo': 'conteoRondas' });
                    setTipoM('AR');
                } else if (ganoCombate == 'R') {
                    setMsgModal({ 'azul': roundA.length, 'rojo': roundR.length, 'tipo': 'conteoRondas' });
                    setTipoM('RR');
                } else {
                    setShowModal(false);
                }
            }
            if (configure.enableMaxPoint) {
                aplicarEstado({ 'round': siguienteRound, 'isPlay': false, 'newRound': true, 'reset': true });
                setShowModal(false);
            }
        } catch (error) {
            MsgUtils.msgError(error.message);
        } finally {
            setEnviando(false);
        }
    }
    function Sonido(nota) {
        const context = obtenerContextoAudio();
        if (!context) return;
        const osc = context.createOscillator();
        // admite: sine, square, sawtooth, triangle
        osc.type = 'sawtooth';
        osc.frequency.value = NOTAS[nota] || NOTAS[5];
        osc.connect(context.destination);
        osc.start();
        osc.stop(context.currentTime + .5);
    }
    function elegirCompetidor(pelea) {
        document.getElementById('PuntoKirugui')?.scrollIntoView();
        setSelectPelea(pelea);
        if (pelea.idcompetidor1 != 0) {
            setNombreA(pelea.nombres)
            setIdClubA(pelea.idclubuno)
        } else {
            setNombreA('')
            setIdClubA(-1)
        }
        if (pelea.idcompetidor2 != 0) {
            setNombreR(pelea.nombres2)
            setIdClubR(pelea.idclubdos)
        } else {
            setNombreR('');
            setIdClubR(-1)
        }
    }
    function ejecutarJuego(valor) {
        if (selectPelea == null) {
            MsgUtils.msgError("Elija una pelea antes de iniciar ...");
            return;
        }
        Sonido(valor ? 11 : 5);
        localStorage.setItem('contAux', 0);
        aplicarEstado({ 'isPlay': valor, 'reset': false, 'newRound': false, 'gano': '', 'final': null });
    }
    function showStadistic(valor) {
        setMandoLec(valor);
        setTipoM('S');
        setShowModal(true);
    }
    const manejarAtajoTeclado = useCallback((event) => {
        // No puntuar mientras se repite la tecla ni al usar atajos del navegador (Ctrl+R, etc.)
        if (event.repeat || event.ctrlKey || event.metaKey || event.altKey) return;
        const id = accionesTeclado[event.key];
        if (id === 'L') {
            setActivarLectura(true);
        } else if (id === 'l') {
            setActivarLectura(false);
        } else if (id) {
            document.getElementById(id)?.click();
        }
    }, []);
    // mostrarMensaje=false en la carga inicial: no avisar de algo que el usuario no pidio
    const refreshConfiguration = (mostrarMensaje = true) => {
        const conf = leerJSON('kirugui', null);
        if (conf === null) {
            MsgUtils.msgError("Configuracion no Existente ....");
            return;
        }
        setMapPuntos({
            'd': conf.puntosCabeza, 'D': conf.puntosCabezaGiro, 'P': conf.puntosPunio, 'c': conf.puntosPeto, 'C': conf.puntosPetoGiro,
            'b': conf.puntosCabeza, 'B': conf.puntosCabezaGiro, 'E': conf.puntosPunio, 'a': conf.puntosPeto, 'A': conf.puntosPetoGiro
        });
        setConfigure(normalizarConfig(conf));
        if (mostrarMensaje) MsgUtils.msgCorrecto("Configuracion de Combate Realizado ...");
    }
    useEffect(() => {
        window.addEventListener('keydown', manejarAtajoTeclado);
        return () => {
            window.removeEventListener('keydown', manejarAtajoTeclado);
        };
    }, [manejarAtajoTeclado]);
    useEffect(() => {
        localStorage.setItem("contAux", 0);
        const sessionActiva = leerJSON('login', null);
        const cmp = leerJSON('campeonato', null);
        if (sessionActiva !== null) {
            setTitulo('PUNTUACION COMBATE');
            setCampeonato(cmp);
            setLogin(true);
            setUserLogin(sessionActiva);
            navigate("/nuevaPantallaK", { replace: true });
            getClubes();
        }
        refreshConfiguration(false);
    }, [])
    return (
        <div>
            <div className='container-fluid py-2' id='PuntoKirugui'>
                <div className='row row-cols-1 row-cols-sm-1 row-cols-md-2 gx-1 mb-1' style={{ height: '75%' }}>
                    <div className='col col-sm-12 col-md-2'>
                        {selectPelea != null &&
                            <div className='fw-bold text-light text-center bg-dark' style={{ fontSize: '29px' }}>
                                Pelea #{selectPelea.nropelea}
                            </div>}
                        <div className='bg-light lh-sm fw-bold text-center' style={{ fontSize: '18px' }}>
                            <div className='text-danger'>Rojo GANO {getRoundWin('R')} round</div>
                            <div className='text-primary'>Azul GANO {getRoundWin('A')} round</div>
                        </div>
                        <VistaMandos datos={null} setActivarLectura={setActivarLectura}
                            activarLectura={activarLectura}
                            configure={configure.numMandos != undefined ? configure : null}
                            collback={lecturadeDatos}
                            puntoJuego={puntoJuego} showStadistic={showStadistic} areaname={area} userLogin={userLogin} />
                    </div>
                    <div className='col col-sm-12 col-md-10'>
                        <div className='container-fluid'>
                            <div className="row row-cols g-0">
                                <button type="button" className="btn btn-sm mx-1 btn-sm botonMenu d-none"
                                    id='buttonFinal'
                                    data-bs-toggle="tooltip" data-bs-placement="bottom" title="Pausar Competencia"
                                    onClick={() => calcularResultado()}>
                                    <i className="fa-solid fa-circle-pause fa-xl"></i>
                                </button>
                                <div className='col my-auto' style={{ minWidth: '40px', maxWidth: '40px' }}>
                                    <Link className='btn btn-sm botonMenu my-auto mx-auto'
                                        title="Abrir pantalla extendida"
                                        aria-label="Abrir pantalla extendida"
                                        onClick={() => publicarPantalla(puntoJuego)}
                                        to={'/scoreDobleK'} target='_blank'>
                                        <i className="fa-brands fa-windows fa-2xl"></i>
                                    </Link>
                                </div>
                                <div className='col my-auto' style={{ minWidth: '65px', maxWidth: '65px' }}>
                                    <button type="button" className="btn btn-sm botonMenu m-0 p-0"
                                        title="Iniciar Competencia" id='buttonPlay'
                                        onClick={() => ejecutarJuego(!puntoJuego.isPlay)}>
                                        <span className='fh-1' style={{ fontSize: '34px' }}>{puntoJuego.isPlay ? '⌚' : '⏵'}</span>(P)
                                    </button>
                                </div>
                                <div className='col my-auto' style={{ minWidth: '70px', maxWidth: '70px' }}>
                                    <button type="button" className="btn mx-1 btn-sm botonMenu" id='btnReset'
                                        title="Recetear valores iniciales"
                                        onClick={() => recetearValores()}>
                                        <i className="fa-solid fa-repeat fa-2xl"></i>(.)</button>
                                </div>
                                <div className='text-center text-light tituloMenu fw-bold lh-1'
                                    style={{ fontSize: '33px', width: '180px' }}>
                                    Round {puntoJuego.round}<br></br>AREA {idArea == 0 ? '?' : idArea}
                                </div>
                                <div className='text-center my-auto mx-1 mx-auto' style={{ fontSize: '45px', width: '230px' }} >
                                    <RelojKirugui valor={puntoJuego} conf={configure} tipo='r' collback={() => { calcularResultado() }} doble={false} />
                                </div>
                                <div className='text-center my-auto mx-1 mx-auto' style={{ fontSize: '45px', width: '230px' }} >
                                    {puntoJuego.isPlay == false &&
                                        <RelojKirugui valor={puntoJuego} conf={configure} tipo='s' collback={() => ''} doble={false} />}
                                </div>
                                <div className='col my-auto' style={{ minWidth: '65px', maxWidth: '65px' }}>
                                    <button type="button" className="btn mx-1 btn-sm botonMenu"
                                        id='btnRefresh' title="Recargar configuracion de combate"
                                        aria-label="Recargar configuracion de combate"
                                        onClick={() => refreshConfiguration()}>
                                        <span className='fs-2 fh-1'>⚙️</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className='container-fluid'>
                            <div className='row row-cols-1 row-cols-sm-2 row-cols-md-2 gx-0'>
                                <div className='col bg-primary bg-gradient col-md-6'>
                                    <div className='w-100 p-2 lh-1'>
                                        <h1 className='text-start tituloMenu text-light lh-1' style={{ fontSize: '30px' }}>
                                            {nombreA != '' ? nombreA : 'TKD AZUL'}
                                        </h1>
                                        {getClubesNombre(idClubA) !== '' &&
                                            <h4 className='text-start tituloMenu text-light lh-1'>
                                                {getClubesNombre(idClubA)}
                                            </h4>}
                                    </div>
                                    <VisorPunto valor={puntoJuego} tipo='A' />
                                    <VisorFaltas valor={puntoJuego} tipo='A'
                                        resultPre={getFaltasTotales('A')} maxFaltas={configure.maxFaltas}
                                        botones={useMemo(() => Array(puntoJuego.faltaA || 0).fill(0).map((_, j) => (
                                            <button className='btn btn-sm btn-warning mx-2 text-light text-center fw-bold' key={j}>
                                                F{j + 1}
                                            </button>
                                        )), [puntoJuego.faltaA])} />
                                </div>
                                <div className='col bg-danger bg-gradient col-md-6'>
                                    <div className='w-100 p-2 lh-1'>
                                        <h1 className='text-end tituloMenu text-light lh-1' style={{ fontSize: '30px' }}>
                                            {nombreR != '' ? nombreR : 'TKD ROJO'}
                                        </h1>
                                        {getClubesNombre(idClubR) !== '' &&
                                            <h4 className='text-end tituloMenu text-light lh-1'>
                                                {getClubesNombre(idClubR)}
                                            </h4>}
                                    </div>
                                    <VisorPunto valor={puntoJuego} tipo='R' />
                                    <VisorFaltas valor={puntoJuego} tipo='R' resultPre={getFaltasTotales('R')} maxFaltas={configure.maxFaltas}
                                        botones={useMemo(() => Array(puntoJuego.faltaR || 0).fill(0).map((_, j) => (
                                            <button className='btn btn-sm btn-warning mx-2 text-light text-center fw-bold' key={j}>
                                                F{j + 1}
                                            </button>
                                        )), [puntoJuego.faltaR])} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='container-fluid'>
                    <div className='row row-cols-1 row-cols-sm-1 row-cols-md-2 g-1'>
                        <div className='col text-center bg-primary '>
                            <div className='container-fluid py-2'>
                                <div className='row row-cols-3 g-0'>
                                    <div className='col'>
                                        <div className='text-light lh-1'>
                                            Derrota por
                                        </div>
                                        <div className='container-fluid'>
                                            <div className="btn-group btn-group-sm">
                                                <button className='btn btn-sm btnScore text-light m-0 p-0'
                                                    type="button" disabled
                                                    title="Derrota por nocaut (todavia no implementado)">
                                                    <i className="fa-solid fa-skull-crossbones fa-2xl"></i>
                                                </button>
                                                <button className='btn btn-sm btnScore text-info m-0 p-0 mx-2'
                                                    type="button" title='Declarar ganador azul'
                                                    aria-label='Declarar ganador azul'
                                                    onClick={() => declararGanador(puntoJuego.puntoA + 1, 'A')}>
                                                    <i className="fa-solid fa-trophy fa-2xl"></i>
                                                </button>
                                                <button className='btn btn-sm btnScore text-warning m-0 p-0'
                                                    type="button" disabled
                                                    title="Derrotado por el GAM-JEON (todavia no implementado)">
                                                    <i className="fa-solid fa-diamond fa-2xl"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <div className='text-light lh-1'>
                                            Gam-jeom
                                        </div>
                                        <div className='container-fluid'>
                                            <div className="btn-group btn-group-sm">
                                                <button className='btn btn-sm btnScore m-0 p-0 ' id='faltaA'
                                                    type="button" title="Gam-jeom al azul (F)"
                                                    onClick={() => procesarFalta(true, 1)}>
                                                    <i className="fa-solid fa-circle-plus fa-2xl"></i>(F)
                                                </button>
                                                <button className='btn btn-sm btnScore m-0 p-0' id='faltaAR'
                                                    type="button" title="Quitar gam-jeom al azul (f)"
                                                    onClick={() => procesarFalta(true, -1)}>
                                                    <i className="fa-solid fa-circle-minus fa-2xl"></i>(f)
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <div className='text-light lh-1'>
                                            Punto
                                        </div>
                                        <div className='container-fluid'>
                                            <div className="btn-group btn-group-sm">
                                                <button className='btn btn-sm btnScore m-0 p-0' id='puntoAP'
                                                    type="button" title="Sumar punto al azul (A)"
                                                    onClick={() => procesarPunto(true, 1)}>
                                                    <i className="fa-solid fa-circle-plus fa-2xl"></i>(A)
                                                </button>
                                                <button className='btn btn-sm btnScore m-0 p-0' id='puntoAN'
                                                    type="button" title="Quitar punto al azul (a)"
                                                    onClick={() => procesarPunto(true, -1)}>
                                                    <i className="fa-solid fa-circle-minus fa-2xl"></i>(a)
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col text-center bg-danger'>
                            <div className='container-fluid py-2'>
                                <div className='row row-cols-3 g-0'>
                                    <div className='col'>
                                        <div className='text-light lh-1'>
                                            Punto
                                        </div>
                                        <div className='container-fluid'>
                                            <div className="btn-group btn-group-sm">
                                                <button className='btn btn-sm btnScore m-0 p-0' id='puntoRP'
                                                    type="button" title="Sumar punto al rojo (R)"
                                                    onClick={() => procesarPunto(false, 1)}>
                                                    <i className="fa-solid fa-circle-plus fa-2xl"></i>(R)
                                                </button>
                                                <button className='btn btn-sm btnScore m-0 p-0' id='puntoRN'
                                                    type="button" title="Quitar punto al rojo (r)"
                                                    onClick={() => procesarPunto(false, -1)}>
                                                    <i className="fa-solid fa-circle-minus fa-2xl"></i>(r)
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <div className='text-light lh-1'>
                                            Gam-jeom
                                        </div>
                                        <div className='container-fluid'>
                                            <div className="btn-group btn-group-sm">
                                                <button className='btn btn-sm btnScore m-0 p-0' id='faltaR'
                                                    type="button" title="Gam-jeom al rojo (Q)"
                                                    onClick={() => procesarFalta(false, 1)}>
                                                    <i className="fa-solid fa-circle-plus fa-2xl"></i>(Q)
                                                </button>
                                                <button className='btn btn-sm btnScore m-0 p-0' id='faltaRR'
                                                    type="button" title="Quitar gam-jeom al rojo (q)"
                                                    onClick={() => procesarFalta(false, -1)}>
                                                    <i className="fa-solid fa-circle-minus fa-2xl"></i>(q)
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <div className='text-light lh-1'>
                                            Derrota Por
                                        </div>
                                        <div className='container-fluid'>
                                            <div className="btn-group btn-group-sm">
                                                <button className='btn btn-sm btnScore text-warning m-0 p-0'
                                                    type="button" disabled
                                                    title="Derrotado por GAM-JEON (todavia no implementado)">
                                                    <i className="fa-solid fa-diamond fa-2xl"></i>
                                                </button>
                                                <button className='btn btn-sm btnScore text-info m-0 p-0 mx-2'
                                                    type="button" title='Declarar ganador rojo'
                                                    aria-label='Declarar ganador rojo'
                                                    onClick={() => declararGanador(puntoJuego.puntoR + 1, 'R')}>
                                                    <i className="fa-solid fa-trophy fa-2xl"></i>
                                                </button>
                                                <button className='btn btn-sm btnScore text-light m-0 p-0'
                                                    type="button" disabled
                                                    title="Derrota por nocaut (todavia no implementado)">
                                                    <i className="fa-solid fa-skull-crossbones fa-2xl"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='container-fluid bg-dark bg-gradient py-1'>
                <div className='row row-cols gx-1'>
                    <div className='col' style={{ minWidth: '100px', maxWidth: '100px' }}>
                        {ventana == 0 && <button className='btn btn-sm w-100 btn-success'
                            title='Mostrar LLaves' onClick={() => setVentana(1)}
                        ><i className="fa-solid fa-magnifying-glass"></i> Llaves</button>}
                        {ventana == 1 && <button className='btn btn-sm w-100 btn-success'
                            title='Esconder LLaves' onClick={() => setVentana(0)}
                        ><i className="fa-solid fa-magnifying-glass"></i> Esconder</button>}
                    </div>
                    <div className='col' style={{ minWidth: '100px', maxWidth: '100px' }}>
                        <button className='btn btn-secondary btn-sm w-100'
                            title='salir de la pantalla puntuación'
                            onClick={() => setPagina(0)}>
                            <i className="fa-solid fa-circle-chevron-left fa-xl"></i> Salir
                        </button>
                    </div>
                </div>
            </div>
            {ventana == 1 &&
                <div className='overflow-auto' style={{ height: '400px' }}>
                    <AdminLlaves setVentana={setVentana}
                        idCampeonato={campeonato.idcampeonato}
                        tipo={'C'} tipoL={'O'} setCargador={() => { }}
                        area={area} collback={(dato) => elegirCompetidor(dato)} />
                </div>
            }
            <Modal show={showModal} onHide={() => setShowModal(false)}
                size={tipoM == 'S' ? 'lg' : 'xl'}
                backdrop="static"
                aria-labelledby="contained-modal-title-vcenter"
                contentClassName={`${(tipoM == 'A' || tipoM == 'AP' || tipoM == 'AR') ? 'bg-primary' : (tipoM == 'R' || tipoM == 'RP' || tipoM == 'RR') ? 'bg-danger' : 'bg-dark'} bg-gradient`}>
                {tipoM != 'S' &&
                    <Modal.Header bsPrefix='modal-header m-0 p-0 px-2 w-100 ' closeButton={false} closeVariant='white'>
                        <div className='fa-fade tituloMenu text-light fw-bold mx-auto' style={{ fontSize: '100px' }}>
                            {['EM', 'EP', 'ER'].includes(tipoM)
                                ? 'Empate ...!!'
                                : configure.enableMaxRound == true ? 'Ganador ...!!' : 'DESCANSO ...!!'}
                        </div>
                    </Modal.Header>}
                {tipoM == 'S' &&
                    <Modal.Header bsPrefix='modal-header m-0 p-0 px-2 w-100' closeButton={true} closeVariant='white'>
                        <div className='tituloMenu text-light fw-bold ' >
                            Estadisticas del Round
                        </div>
                    </Modal.Header>}
                {tipoM !== 'A' && tipoM !== 'R' &&
                    <Modal.Body>
                        {tipoM != 'S' && <div className='container-fluid bg-transparent'>
                            <div className='row row-cols-2 gx-2' >
                                <div className='col text-primary fw-bold tituloMenu text-center '
                                    style={{ fontSize: '90px' }}>
                                    <div className='bg-light'>
                                        {msgModal.tipo === 'conteoRondas'
                                            ? `Rondas ${msgModal.azul}`
                                            : msgModal.tipo === 'sumaPuntos'
                                                ? `Puntos ${msgModal.azul}`
                                                : msgModal.azul}
                                    </div>
                                </div>
                                <div className='col text-danger fw-bold tituloMenu text-center' style={{ fontSize: '90px' }}>
                                    <div className='bg-light'>
                                        {msgModal.tipo === 'conteoRondas'
                                            ? `Rondas ${msgModal.rojo}`
                                            : msgModal.tipo === 'sumaPuntos'
                                                ? `Puntos ${msgModal.rojo}`
                                                : msgModal.rojo}
                                    </div>
                                </div>
                            </div>
                        </div>}
                        {tipoM == 'S' && <EstadisticaPelea lista={mandoLec} />}
                    </Modal.Body>
                }
                <Modal.Footer>
                    {tipoM != 'S' && (tipoM == 'A' || tipoM == 'R') &&
                        <button type='button' className='btn btn-sm btn-info' disabled={enviando}
                            onClick={() => guardarCombate()}>
                            <i className="fa-solid fa-thumbs-up fa-2xl"></i>Aceptar
                        </button>}
                    {tipoM == 'EM' && configure.enableMaxRound &&
                        <>
                            {/* Ronda empatada en modo rounds: el arbitro decide a quien se la anota */}
                            <button type='button' className='btn btn-sm btn-primary' disabled={enviando}
                                onClick={() => setShowModal(false)}>
                                <i className="fa-solid fa-thumbs-up fa-2xl"></i> Aceptar
                            </button>
                        </>}
                    {tipoM == 'EM' && !configure.enableMaxRound &&
                        <button type='button' className='btn btn-sm btn-info' disabled={enviando}
                            onClick={() => guardarCombate()}>
                            <i className="fa-solid fa-thumbs-up fa-2xl"></i>Aceptar
                        </button>}
                    {tipoM != 'S' && (tipoM == 'EP' || tipoM == 'ER') &&
                        <>
                            <button type='button' className='btn btn-sm btn-primary' disabled={enviando}
                                onClick={() => resultadoFinal('A')}>
                                <i className="fa-solid fa-thumbs-up fa-2xl"></i> Gana Azul
                            </button>
                            <button type='button' className='btn btn-sm btn-danger' disabled={enviando}
                                onClick={() => resultadoFinal('R')}>
                                <i className="fa-solid fa-thumbs-up fa-2xl"></i> Gana Rojo
                            </button>
                        </>
                    }
                    {tipoM != 'S' && tipoM !== 'A' && tipoM !== 'R' && tipoM !== 'EM' && tipoM !== 'EP' && tipoM !== 'ER' &&
                        <button type='button' className='btn btn-sm btn-info' disabled={enviando}
                            onClick={() => resultadoFinal()}>
                            <i className="fa-solid fa-thumbs-up fa-2xl"></i> Aceptar
                        </button>}
                    {tipoM != 'S' && (tipoM == 'EP' || tipoM == 'ER') &&
                        <button type='button' className='btn btn-sm btn-secondary' disabled={enviando}
                            onClick={() => setShowModal(false)}>
                            Cerrar
                        </button>}
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default PrincipalKirugui
