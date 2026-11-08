import React, { useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query';
import Header from '../Header';
import Modal from 'react-bootstrap/Modal';
import { ContextAplicacions } from '../Context/ContextAplicacion';
import { useNavigate, Link } from 'react-router-dom';
import VistaMandos from './VistaMandos';
import { getMandosPuntuados, getListaClubs } from '../utils/UtilsConsultas';
import MsgUtils from '../utils/MsgUtils';
import VisorPunto from './VisorPunto';
import VisorFaltas from './VisorFaltas';
import RelojKirugui from './RelojKirugui';
import { server } from '../utils/MsgUtils';
import EstadisticaPelea from './EstadisticaPelea';

function PrincipalTesting() {
    const navigate = useNavigate();
    const { setLogin, setUserLogin, campeonato, setCampeonato, setTitulo, userLogin } = useContext(ContextAplicacions);
    const [activarLectura, setActivarLectura] = useState(false);
    const [frecLectura, setFrecLectura] = useState(1000);
    const [configure, setConfigure] = useState({});
    const [clubes, setClubes] = useState([]);
    const [idClubA, setIdClubA] = useState(-1);
    const [idClubR, setIdClubR] = useState(-1);
    const [nombreA, setNombreA] = useState('');
    const [nombreR, setNombreR] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [tipoM, setTipoM] = useState('');
    const [mapPuntos, setMapPuntos] = useState({});
    const [puntoJuego, setPuntoJuego] = useState({
        'isPlay': false, 'round': 1, 'reset': false,
        'puntoA': 0, 'faltaA': 0,
        'puntoR': 0, 'faltaR': 0
    });
    const [msgModal, setMsgModal] = useState({});
    const [resultPre, setResultPre] = useState([]);
    const [mandoLec, setMandoLec] = useState([]);
    const [actualizar, setActualizar] = useState(false);

    // Lectura del mando (mantenida para el backend, podrías quitarla si no la necesitas)
    //const { isLoading, data, isError, error } = useQuery({
    //    queryKey: ['mandos'],
    //    queryFn: () => getMandosPuntuados({ sector: 0, cont: localStorage.getItem('contAux') != undefined ? 0 : localStorage.getItem('contAux') }),
    //    refetchInterval: activarLectura ? frecLectura : false
    //})

    const accionesTeclado = {
        r: 'puntoRN', R: 'puntoRP', L: 'L', l: 'L',
        f: 'faltaAR', F: 'faltaA', A: 'puntoAP', a: 'puntoAN',
        P: 'buttonPlay', Q: 'faltaR', q: 'faltaRR',
        '.': 'btnReset', '-': 'btnSubMin', '+': 'btnSumMin'
    };

    const manejarAtajoTeclado = (event) => {
        const id = accionesTeclado[event.key];
        if (id && id !== 'L' && id !== 'l') {
            document.getElementById(id)?.click();
        } else if (id === 'L') {
            setActivarLectura(true);
        } else if (id === 'l') {
            setActivarLectura(false);
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', manejarAtajoTeclado);
        return () => {
            window.removeEventListener('keydown', manejarAtajoTeclado);
        };
    }, [manejarAtajoTeclado]);

    const formatearTiempo = useCallback((segundosTotales) => {
        const minutos = Math.floor(segundosTotales / 60);
        const segundos = segundosTotales % 60;
        return `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
    }, []);

    const calcularGanador = useCallback((puntos) => {
        if (configure.enableDif) {
            const diff = puntos.puntoA - puntos.puntoR;
            const diffMax = parseInt(configure.diffPuntos);
            if (diff > diffMax) return 'A';
            if (diff < -diffMax) return 'R';
        }
        return null;
    }, [configure]);

    const completarRedondeo = (copia, gano) => {
        setPuntoJuego({ ...copia, isPlay: false, reset: true });
        localStorage.setItem('doblePant', JSON.stringify({ ...copia, nombreA, nombreR, gano: gano, reset: true }));
    };

    const Sonido = useCallback((nota) => {
        const Sonidos = [261, 277, 293, 311, 329, 349, 369, 392, 415, 440, 466, 493];
        let ctx;
        if (typeof window !== 'undefined') {
            const Ac = window.AudioContext || window.webkitAudioContext;
            if (!Ac) return;
            ctx = new Ac();
        }
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.value = Sonidos[nota];
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
        gain.disconnect();
        osc.disconnect();
    }, []);

    const hayGanador = useCallback((color) => {
        Sonido(5);
        setTipoM(color);
        setShowModal(true);
    }, [Sonido]);

    const ejecutarJuego = useCallback((valor) => {
        if (valor) Sonido(11);
        else Sonido(5);
        localStorage.setItem('contAux', 0);
        setPuntoJuego({ ...puntoJuego, isPlay: valor, reset: false, 'newRound': false });
        localStorage.setItem('doblePant', JSON.stringify({ ...puntoJuego, isPlay: valor, reset: false, nombreA, nombreR, 'gano': '' }));
    }, [puntoJuego, nombreA, nombreR]);

    const recetearValores = useCallback(() => {
        setNombreA('');
        setNombreR('');
        setIdClubA(-1);
        setIdClubR(-1);
        setPuntoJuego({
            'isPlay': false, 'round': 1, 'reset': true,
            'puntoA': 0, 'faltaA': 0,
            'puntoR': 0, 'faltaR': 0
        });
        setResultPre([]);
        setShowModal(false);
        setTipoM('');
        setActualizar(false);
        localStorage.setItem('segundo', 0);
        localStorage.setItem('doblePant', JSON.stringify({
            'isPlay': false, 'round': 1, 'reset': true, 'puntoA': 0, 'faltaA': 0,
            'puntoR': 0, 'faltaR': 0, 'nombreA': '', 'nombreR': '', 'gano': ''
        }));
    }, []);

    const recursarCombate = useCallback(() => {
        if (parseInt(configure.numRound) == puntoJuego.round) {
            setResultPre([...resultPre, { ...puntoJuego, 'gano': tipoM }]);
            var datos = [...resultPre, { ...puntoJuego, 'gano': tipoM }];

            if (configure.enableMaxPoint) {
                var sumaA = datos.map(item => parseInt(item.puntoA)).reduce((acumulador, numero) => acumulador + numero, 0);
                var sumaR = datos.map(item => parseInt(item.puntoR)).reduce((acumulador, numero) => acumulador + numero, 0);
                setMsgModal({ 'azul': sumaA, 'rojo': sumaR, 'tipo': 'sumaPuntos' });
                if (sumaA > sumaR) {
                    setTipoM('AP');
                    localStorage.setItem('doblePant', JSON.stringify({ ...puntoJuego, nombreA, nombreR, 'gano': 'A', isPlay: false }));
                } else if (sumaR > sumaA) {
                    setTipoM('RP');
                    localStorage.setItem('doblePant', JSON.stringify({ ...puntoJuego, nombreA, nombreR, 'gano': 'R', isPlay: false }));
                } else {
                    setTipoM('EP');
                }
            } else if (configure.enableMaxRound) {
                var roundA = datos.filter((item) => item.gano == 'A');
                var roundR = datos.filter((item) => item.gano == 'R');
                setMsgModal({ 'azul': roundA.length, 'rojo': roundR.length, 'tipo': 'conteoRondas' });
                if (roundA.length > roundR.length) {
                    setTipoM('AR');
                    localStorage.setItem('doblePant', JSON.stringify({ ...puntoJuego, nombreA, nombreR, 'gano': 'A', isPlay: false }));
                } else if (roundR.length > roundA.length) {
                    setTipoM('RR');
                    localStorage.setItem('doblePant', JSON.stringify({ ...puntoJuego, nombreA, nombreR, 'gano': 'R', isPlay: false }));
                } else {
                    setTipoM('ER');
                }
            }
        } else {
            if (configure.enableMaxRound == true) {
                setResultPre([...resultPre, { ...puntoJuego, 'gano': tipoM }]);
                setPuntoJuego({ 'round': puntoJuego.round + 1, 'puntoA': 0, 'faltaA': 0, 'puntoR': 0, 'faltaR': 0, 'isPlay': false, 'newRound': true });
                setShowModal(false);
                localStorage.setItem('doblePant', JSON.stringify({ 'round': puntoJuego.round + 1, 'puntoA': 0, 'faltaA': 0, 'puntoR': 0, 'faltaR': 0, 'isPlay': false, 'newRound': true }));
            }
            if (configure.enableMaxPoint == true) {
                setResultPre([...resultPre, { ...puntoJuego, 'gano': tipoM }]);
                setPuntoJuego({ ...puntoJuego, 'round': puntoJuego.round + 1, 'isPlay': false, 'newRound': true });
                setShowModal(false);
                localStorage.setItem('doblePant', JSON.stringify({ ...puntoJuego, 'round': puntoJuego.round + 1, 'isPlay': false, 'newRound': true }));
            }
        }
    }, [puntoJuego, resultPre, configure, tipoM, nombreA, nombreR]);

    const guardarCombate = useCallback(() => {
        console.log("sumatoria de rondas");
        recursarCombate();
    }, [recursarCombate]);

    const mostrarEstadistica = useCallback((valor) => {
        setMandoLec(valor);
        setTipoM('S');
        setShowModal(true);
    }, []);

    const getClubes = useCallback(async () => {
        if (clubes.length === 0) {
            var resut = await getListaClubs();
            if (resut.ok) {
                setClubes(resut.ok);
            } else {
                MsgUtils.msgError(resut.error);
            }
        }
    }, [clubes.length]);

    const getClubesNombre = useCallback((id) => {
        const encontrado = clubes.find(item => item.idclub == id);
        return encontrado ? encontrado.nombre : '';
    }, [clubes]);

    const getFaltaAcumulada = useCallback((color) => {
        let cont = 0;
        for (const valPre of resultPre) {
            if (color == 'A') {
                cont += parseInt(valPre.faltaA || 0);
            } else if (color == 'R') {
                cont += parseInt(valPre.faltaR || 0);
            }
        }
        return cont;
    }, [resultPre]);

    const functionContarPunto = useCallback((lista) => {
        if (!lista.length) return [0, null];
        let conteo = {};
        let rep_max = 0;
        let elem_max = null;

        for (const element of lista) {
            conteo[element] = (conteo[element] || 0) + 1;
            if (conteo[element] > rep_max) {
                rep_max = conteo[element];
                elem_max = element;
            }
        }

        return [rep_max, elem_max];
    }, []);

    const lecturadeDatos = useCallback((datos) => {
        const [repeticiones, valorPunto] = datos;

        if (puntoJuego.isPlay && valorPunto !== '') {
            const minJueces = parseInt(configure.maxJueces);

            if (repeticiones >= minJueces) {
                const nuevoPunto = { ...puntoJuego };
                const valorASumar = parseInt(mapPuntos[valorPunto] || 0);

                if (['d', 'D', 'P', 'c', 'C'].includes(valorPunto)) {
                    nuevoPunto.puntoA += valorASumar;
                } else {
                    nuevoPunto.puntoR += valorASumar;
                }

                let gano = '';
                if (configure.enableDif) {
                    const diff = nuevoPunto.puntoA - nuevoPunto.puntoR;
                    const diffMax = parseInt(configure.diffPuntos);
                    if (diff > diffMax) {
                        gano = 'A';
                        nuevoPunto.isPlay = false;
                        hayGanador('A');
                    } else if (diff < -diffMax) {
                        gano = 'R';
                        nuevoPunto.isPlay = false;
                        hayGanador('R');
                    }
                }

                setPuntoJuego(nuevoPunto);
                localStorage.setItem('contAux', 0);
                localStorage.setItem('doblePant', JSON.stringify({
                    ...nuevoPunto,
                    nombreA,
                    nombreR,
                    gano
                }));
            }
        }
    }, [puntoJuego, configure, mapPuntos, hayGanador]);

    const procesarFalta = (tipo, valor) => {
        if (tipo) {
            if ((parseInt(valor) < 0 && puntoJuego.faltaA > 0) || (parseInt(valor) > 0 && puntoJuego.faltaA >= 0)) {
                const faltas = puntoJuego.faltaA + valor;
                const puntos = puntoJuego.puntoR + (valor * parseInt(configure.falta));
                const copia = { ...puntoJuego, faltaA: faltas, puntoR: puntos };
                setPuntoJuego(copia);
                localStorage.setItem('doblePant', JSON.stringify({ ...copia, nombreA, nombreR, 'gano': '' }));
                if (faltas == configure.maxFaltas) {
                    hayGanador('R');
                    completarRedondeo(copia, 'R');
                }
            }
        } else {
            if ((parseInt(valor) < 0 && puntoJuego.faltaR > 0) || (parseInt(valor) > 0 && puntoJuego.faltaR >= 0)) {
                const faltas = puntoJuego.faltaR + valor;
                const puntos = puntoJuego.puntoA + (valor * parseInt(configure.falta));
                const copia = { ...puntoJuego, faltaR: faltas, puntoA: puntos };
                setPuntoJuego(copia);
                localStorage.setItem('doblePant', JSON.stringify({ ...copia, nombreA, nombreR, 'gano': '' }));
                if (faltas == configure.maxFaltas) {
                    hayGanador('A');
                    completarRedondeo(copia, 'A');
                }
            }
        }
    };

    const procesarPunto = (color, valor) => {
        let copia = { ...puntoJuego };
        if (color) {
            if ((parseInt(valor) < 0 && copia.puntoA > 0) || (parseInt(valor) > 0 && copia.puntoA >= 0)) {
                copia.puntoA += valor;
            }
        } else {
            if ((parseInt(valor) < 0 && copia.puntoR > 0) || (parseInt(valor) > 0 && copia.puntoR >= 0)) {
                copia.puntoR += valor;
            }
        }
        setPuntoJuego(copia);
        localStorage.setItem('doblePant', JSON.stringify({ ...copia, nombreA, nombreR, 'gano': '' }));

        if (configure.enableDif) {
            const gano = calcularGanador(copia);
            if (gano) {
                hayGanador(gano);
                completarRedondeo(copia, gano);
            }
        }
    };

    const declararGanador = (punto, color) => {
        if (color == 'A') {
            setPuntoJuego({ ...puntoJuego, puntoA: punto });
            hayGanador('A');
            localStorage.setItem('doblePant', JSON.stringify({ ...puntoJuego, puntoA: punto, nombreA, nombreR, 'gano': 'A' }));
        } else if (color == 'R') {
            setPuntoJuego({ ...puntoJuego, puntoR: punto });
            hayGanador('R');
            localStorage.setItem('doblePant', JSON.stringify({ ...puntoJuego, puntoR: punto, nombreA, nombreR, 'gano': 'R' }));
        }
    };

    const cerrarModal = useCallback(() => {
        setShowModal(false);
        setTipoM('');
    }, []);

    // 'Aceptar' del descanso: cierra el modal y prepara el siguiente round
    const resultadoFinal = useCallback(() => {
        cerrarModal();
        setActualizar(false);
        const siguiente = {
            'isPlay': false, 'round': (puntoJuego.round || 1) + 1, 'reset': true,
            'puntoA': 0, 'faltaA': 0, 'puntoR': 0, 'faltaR': 0
        };
        setPuntoJuego(siguiente);
        localStorage.setItem('segundo', 0);
        localStorage.setItem('doblePant', JSON.stringify({ ...siguiente, nombreA, nombreR, 'gano': '' }));
    }, [cerrarModal, puntoJuego.round, nombreA, nombreR]);

    const calcularResultado = useCallback(() => {
        // Solo se evalua si el round esta en juego: nunca abrir modales en reposo
        if (!puntoJuego.isPlay) return;
        ejecutarJuego(false);

        const gano = calcularGanador(puntoJuego);
        if (gano) {
            hayGanador(gano);
            localStorage.setItem('doblePant', JSON.stringify({ ...puntoJuego, nombreA, nombreR, 'gano': gano, isPlay: false }));
            return;
        }
        if (configure.enableMaxPoint) {
            hayGanador('EM');
            localStorage.setItem('doblePant', JSON.stringify({ ...puntoJuego, nombreA, nombreR, 'gano': 'EM', isPlay: false }));
            return;
        }
        // Fin del round sin ganador por diferencia: descanso
        setTipoM('');
        setMsgModal({ 'azul': puntoJuego.puntoA, 'rojo': puntoJuego.puntoR, 'tipo': 'puntosActuales' });
        setShowModal(true);
        localStorage.setItem('doblePant', JSON.stringify({ ...puntoJuego, nombreA, nombreR, 'gano': '', isPlay: false }));
    }, [puntoJuego, configure, nombreA, nombreR, ejecutarJuego, hayGanador, calcularGanador]);

    const refreshConfiguration = () => {
        var conf = JSON.parse(localStorage.getItem('kirugui'));
        if (conf !== null) {
            setMapPuntos({
                'd': conf.puntosCabeza, 'D': conf.puntosCabezaGiro, 'P': conf.puntosPunio, 'c': conf.puntosPeto, 'C': conf.puntosPetoGiro,
                'b': conf.puntosCabeza, 'B': conf.puntosCabezaGiro, 'E': conf.puntosPunio, 'a': conf.puntosPeto, 'A': conf.puntosPetoGiro
            });
            setFrecLectura(parseInt(conf.frecLectura));
            setConfigure(conf);
            MsgUtils.msgCorrecto("Configuracion de Combate Realizado ...")
        } else {
            MsgUtils.msgError("Configuracion no Existente ....");
        }
    }
    // Solo se evalua el resultado cuando el reloj del round avisa el fin del round.
    // Antes se ejecutaba en cada render y eso abria los modales en bucle.
    useEffect(() => {
        if (!actualizar) return;
        setActualizar(false);
        if (!puntoJuego.isPlay) return;
        calcularResultado();
    }, [actualizar, puntoJuego.isPlay, calcularResultado]);

    useEffect(() => {
        localStorage.setItem("contAux", 0);
        var sessionActiva = JSON.parse(localStorage.getItem('login'));
        var cmp = JSON.parse(localStorage.getItem('campeonato'));
        if (sessionActiva !== null) {
            setTitulo('PRUEBA MANDOS INALAMBRICOS');
            setCampeonato(cmp);
            setLogin(true);
            setUserLogin(sessionActiva);
            navigate("/gamePad", { replace: true });
            getClubes(cmp);
        }
        refreshConfiguration();
    }, []);

    return (
        <div>
            <Header />
            <div className='container-fluid py-1'>
                <div className='row row-cols gx-1 mb-1' style={{ height: '75%' }}>
                    <div className='col' style={{ maxWidth: '20%', minWidth: '20%' }}>
                        <VistaMandos datos={null} setActivarLectura={setActivarLectura} activarLectura={activarLectura}
                            configure={configure.numMandos != undefined ? configure : null} collback={lecturadeDatos}
                            puntoJuego={puntoJuego} showStadistic={mostrarEstadistica} areaname={0} userLogin={userLogin} />
                    </div>
                    <div className='col' style={{ maxWidth: '80%', minWidth: '80%' }}>
                        <div className='container-fluid'>
                            <div className="btn-group btn-group-sm" role="group" aria-label="Basic example">
                                <Link className='btn btn-sm botonMenu my-auto' data-bs-toggle="tooltip"
                                    data-bs-placement="bottom" title="Abrir pantalla extendida"
                                    onClick={() => localStorage.setItem('doblePant', JSON.stringify({
                                        'isPlay': false, 'round': 1, 'reset': false,
                                        'puntoA': 0, 'faltaA': 0, 'gano': '',
                                        'puntoR': 0, 'faltaR': 0, nombreA, nombreR
                                    }))}
                                    to={'/scoreDobleK'} target='blanck'>
                                    <i className="fa-brands fa-windows fa-xl"></i>
                                </Link>
                                <button type="button" className="btn mx-1 btn-sm botonMenu"
                                    data-bs-toggle="tooltip" data-bs-placement="bottom" title="Iniciar Competencia" id='buttonPlay'
                                    onClick={() => ejecutarJuego(!puntoJuego.isPlay)}>
                                    <span className='fs-2 fh-1'>{puntoJuego.isPlay ? '⌚' : '⏵'}</span>(P)
                                </button>
                                <button type="button" className="btn mx-1 btn-sm botonMenu d-none"
                                    id='buttonFinal'
                                    data-bs-toggle="tooltip" data-bs-placement="bottom" title="Pausar Competencia"
                                    onClick={() => calcularResultado()}>
                                    <i className="fa-solid fa-circle-pause fa-xl"></i>
                                </button>
                                <div className='text-center text-light tituloMenu fw-bold '
                                    style={{ fontSize: '45px', width: '290px' }}>
                                    Round {puntoJuego.round}
                                </div>
                                <div className='text-center mx-1' style={{ fontSize: '45px', width: '230px' }} >
                                    <RelojKirugui valor={puntoJuego} conf={configure} tipo='r'
                                        collback={() => setActualizar(true)} doble={false} />
                                </div>
                                <div className='text-center mx-1' style={{ fontSize: '45px', width: '230px' }} >
                                    {puntoJuego.isPlay == false && <RelojKirugui valor={puntoJuego} conf={configure} tipo='s'
                                        collback={() => ''} doble={false} />}
                                </div>
                                <button type="button" className="btn mx-1 btn-sm botonMenu" id='btnReset'
                                    data-bs-toggle="tooltip" data-bs-placement="bottom" title="Recetear valores iniciales"
                                    onClick={() => recetearValores()}>
                                    <i className="fa-solid fa-repeat fa-xl"></i>(.)</button>
                                <button type="button" className="btn mx-1 btn-sm botonMenu"
                                    text='Recargar Configuracion de Combates'
                                    data-bs-toggle="tooltip" data-bs-placement="bottom" title="Iniciar Competencia" id='buttonPlay'
                                    onClick={() => refreshConfiguration()}>
                                    <span className='fs-2 fh-1'>⚙️</span>
                                </button>
                            </div>
                        </div>

                        <div className='container-fluid'>
                            <div className='row row-cols-2 gx-0'>
                                <div className='col bg-primary bg-gradient col-6'>
                                    <div className='w-100 p-2'>
                                        <h1 className='text-start tituloMenu text-light fh-1' style={{ fontSize: '30px' }}>
                                            {nombreA != '' ? nombreA : 'TKD AZUL'}
                                        </h1>
                                        {idClubA != -1 &&
                                            <h4 className='text-start tituloMenu text-light fh-1'>
                                                {getClubesNombre(idClubA)}
                                            </h4>}
                                    </div>
                                    <VisorPunto valor={puntoJuego} tipo='A' />
                                    <VisorFaltas valor={puntoJuego} tipo='A'
                                        resultPre={getFaltaAcumulada('A')}
                                        botones={useMemo(() => Array(puntoJuego.faltaA || 0).fill(0).map((_, j) => (
                                            <button className='btn btn-sm btn-warning mx-2 text-light text-center fw-bold' key={j}>
                                                F{j + 1}
                                            </button>
                                        )), [puntoJuego.faltaA])} />
                                </div>
                                <div className='col bg-danger bg-gradient col-6'>
                                    <div className='w-100 p-2'>
                                        <h1 className='text-end tituloMenu text-light' style={{ fontSize: '30px' }}>
                                            {nombreR != '' ? nombreR : 'TKD ROJO'}
                                        </h1>
                                        {idClubR != -1 &&
                                            <h4 className='text-end tituloMenu text-light'>
                                                {getClubesNombre(idClubR)}
                                            </h4>}
                                    </div>
                                    <VisorPunto valor={puntoJuego} tipo='R' />
                                    <VisorFaltas valor={puntoJuego} tipo='R'
                                        resultPre={getFaltaAcumulada('R')}
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
                    <div className='row row-cols-2 g-0'>
                        <div className='col text-center bg-primary'>
                            <div className='container-fluid'>
                                <div className='row row-cols-3 gx-0'>
                                    <div className='col'>
                                        <div className='text-light'>
                                            Derrota por
                                        </div>
                                        <div className='container-fluid'>
                                            <div className="btn-group btn-group-sm">
                                                <button className='btn btn-sm btnScore text-light'
                                                    data-bs-toggle="tooltip" data-bs-placement="bottom" title="Derrotado por el Oponente">
                                                    <i className="fa-solid fa-skull-crossbones fa-2xl"></i>
                                                </button>
                                                <button className='btn btn-sm btnScore text-info'
                                                    onClick={() => declararGanador(puntoJuego.puntoA + 1, 'A')}>
                                                    <i className="fa-solid fa-trophy fa-2xl"></i>
                                                </button>
                                                <button className='btn btn-sm btnScore text-warning'
                                                    data-bs-toggle="tooltip" data-bs-placement="bottom" title="Derrotado por el GAM-JEON">
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
                                                <button className='btn btn-sm btnScore' id='faltaA' type="button"
                                                    onClick={() => procesarFalta(true, 1)}>
                                                    <i className="fa-solid fa-circle-plus fa-2xl"></i>(F)
                                                </button>
                                                <button className='btn btn-sm btnScore' id='faltaAR' type="button"
                                                    onClick={() => procesarFalta(true, -1)}>
                                                    <i className="fa-solid fa-circle-minus fa-2xl"></i>(f)
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <div className='text-light'>
                                            Punto
                                        </div>
                                        <div className='container-fluid'>
                                            <div className="btn-group btn-group-sm">
                                                <button className='btn btn-sm btnScore' id='puntoAP' type="button"
                                                    onClick={() => procesarPunto(true, 1)}>
                                                    <i className="fa-solid fa-circle-plus fa-2xl"></i>(A)
                                                </button>
                                                <button className='btn btn-sm btnScore' id='puntoAN' type="button"
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
                            <div className='container-fluid'>
                                <div className='row row-cols-3 gx-0'>
                                    <div className='col'>
                                        <div className='text-light'>
                                            Punto
                                        </div>
                                        <div className='container-fluid'>
                                            <div className="btn-group btn-group-sm">
                                                <button className='btn btn-sm btnScore' id='puntoRP' type="button"
                                                    onClick={() => procesarPunto(false, 1)}>
                                                    <i className="fa-solid fa-circle-plus fa-2xl"></i>(R)
                                                </button>
                                                <button className='btn btn-sm btnScore' id='puntoRN' type="button"
                                                    onClick={() => procesarPunto(false, -1)}>
                                                    <i className="fa-solid fa-circle-minus fa-2xl"></i>(r)
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
                                                <button className='btn btn-sm btnScore' id='faltaR' type="button"
                                                    onClick={() => procesarFalta(false, 1)}>
                                                    <i className="fa-solid fa-circle-plus fa-2xl"></i>(Q)
                                                </button>
                                                <button className='btn btn-sm btnScore' id='faltaRR' type="button"
                                                    onClick={() => procesarFalta(false, -1)}>
                                                    <i className="fa-solid fa-circle-minus fa-2xl"></i>(q)
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
                                                <button className='btn btn-sm btnScore text-warning'
                                                    data-bs-toggle="tooltip" data-bs-placement="bottom" title="Derrotado por GAM-JEON">
                                                    <i className="fa-solid fa-diamond fa-2xl"></i>
                                                </button>
                                                <button className='btn btn-sm btnScore text-info'
                                                    title='Declarar ganador'
                                                    onClick={() => declararGanador(puntoJuego.puntoR + 1, 'R')}>
                                                    <i className="fa-solid fa-trophy fa-2xl"></i>
                                                </button>
                                                <button className='btn btn-sm btnScore text-light'
                                                    data-bs-toggle="tooltip" data-bs-placement="bottom" title="Derrotado por el Oponente">
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
                <div className='container-fluid m-0 p-0 py-1 d-none'>
                    <div className='row row-cols-2 gx-1'>
                        <div className='col'>
                            <div className='card bg-primary bg-gradient'>
                                <div className='card-header text-center text-light fw-bold'>
                                    Competidor azul
                                </div>
                                <div className='card-body'>
                                    <div className="input-group input-group-sm mb-3">
                                        <span className="input-group-text" >Nombre</span>
                                        <input className="form-control form-control-sm" type='text'
                                            value={nombreA} onChange={(e) => setNombreA(e.target.value.toUpperCase())}></input>
                                    </div>
                                    <div className="input-group input-group-sm">
                                        <span className="input-group-text" >Club</span>
                                        <select className="form-select form-select-sm "
                                            value={idClubA} onChange={(e) => setIdClubA(e.target.value)}>
                                            <option value={-1}>Prueba</option>
                                            {clubes.map((item, index) => {
                                                return (
                                                    <option value={item.idclub} key={index}>{item.nombre}</option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col'>
                            <div className='card bg-danger bg-gradient'>
                                <div className='card-header text-center text-light fw-bold'>
                                    Competidor Rojo
                                </div>
                                <div className='card-body'>
                                    <div className="input-group input-group-sm mb-3">
                                        <span className="input-group-text" >Nombre</span>
                                        <input className="form-control form-control-sm" type='text'
                                            value={nombreR} onChange={(e) => setNombreR(e.target.value.toUpperCase())}></input>
                                    </div>
                                    <div className="input-group input-group-sm">
                                        <span className="input-group-text" >Club</span>
                                        <select className="form-select form-select-sm "
                                            value={idClubR} onChange={(e) => setIdClubR(e.target.value)}>
                                            <option value={-1}>Prueba</option>
                                            {clubes.map((item, index) => {
                                                return (
                                                    <option value={item.idclub} key={index}>{item.nombre}</option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal show={showModal} onHide={() => setShowModal(false)}
                size={`${tipoM == 'S' ? 'lm' : 'xl'}`} centered
                backdrop="static"
                aria-labelledby="contained-modal-title-vcenter"
                contentClassName={`${(tipoM == 'A' || tipoM == 'AP' || tipoM == 'AR') ? 'bg-primary' : (tipoM == 'R' || tipoM == 'RP' || tipoM == 'RR') ? 'bg-danger' : 'bg-dark'} bg-gradient`}>
                {tipoM != 'S' &&
                    <Modal.Header bsPrefix='modal-header m-0 p-0 px-2 w-100 ' closeButton={false} closeVariant='white'>
                        <div className='fa-fade tituloMenu text-light fw-bold mx-auto' style={{ fontSize: '100px' }}>
                            {configure.enableMaxRound == true ? 'Ganador ...!!' : 'DESCANSO ...!!'}
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
                    {tipoM != 'S' && (tipoM == 'A' || tipoM == 'R' || tipoM == 'EM') &&
                        <button className='btn btn-sm btn-info' onClick={() => { guardarCombate(); }}>
                            <i className="fa-solid fa-thumbs-up fa-2xl"></i>Aceptar
                        </button>}
                    {tipoM != 'S' && tipoM !== 'A' && tipoM !== 'R' && tipoM !== 'EM' &&
                        <button className='btn btn-sm btn-info' onClick={() => { resultadoFinal(); }}>
                            <i className="fa-solid fa-thumbs-up fa-2xl"></i>Aceptar
                        </button>}
                </Modal.Footer>
            </Modal>
        </div>

    )
}

export default PrincipalTesting