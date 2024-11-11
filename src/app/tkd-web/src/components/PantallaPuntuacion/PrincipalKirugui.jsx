import React, { useContext, useEffect, useState } from 'react'
import { server } from '../utils/MsgUtils';
import { useNavigate, Link } from 'react-router-dom';
import { ContextAplicacions } from '../Context/ContextAplicacion';
import VistaMandos from '../GamePad/VistaMandos';
import { useQuery } from '@tanstack/react-query';
import { getMandosPuntuados, getListaClubs } from '../utils/UtilsConsultas';
import RelojKirugui from '../GamePad/RelojKirugui';
import VisorPunto from '../GamePad/VisorPunto';
import VisorFaltas from '../GamePad/VisorFaltas';
import Modal from 'react-bootstrap/Modal';
import MsgUtils from '../utils/MsgUtils';
import EstadisticaPelea from '../GamePad/EstadisticaPelea';
import AdminLlaves from '../ListaCompetidores/AdminLlaves';
import LlavesConsultas from '../ConsultasApi/LlavesConsultas';

function PrincipalKirugui(props) {
    const { area, setPagina } = props;
    const navigate = useNavigate();
    const { setLogin, setUserLogin, campeonato, setCampeonato, setTitulo } = useContext(ContextAplicacions);
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
    const [areas, setAreas] = useState([]);
    const [idArea, setIdArea] = useState(area);
    const [msgModal, setMsgModal] = useState({});
    const [resultPre, setResultPre] = useState([]);
    const [mandoLec, setMandoLec] = useState([]);
    const [ventana, setVentana] = useState(0);
    const [selectPelea, setSelectPelea] = useState(null);
    const { isLoading, data, isError, error } = useQuery(
        {
            queryKey: ['mandos'],
            queryFn: () => getMandosPuntuados(
                {
                    sector: area,
                    cont: localStorage.getItem('contAux') != undefined ? 0 : localStorage.getItem('contAux')
                }),
            refetchInterval: activarLectura ? frecLectura : false
        }
    )
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
        setPuntoJuego({
            'isPlay': false, 'round': 1, 'reset': true,
            'puntoA': 0, 'faltaA': 0,
            'puntoR': 0, 'faltaR': 0
        })
        setResultPre([]);
        setSelectPelea(null);
        setMsgModal({});
        localStorage.setItem('doblePant', JSON.stringify({
            'isPlay': false, 'round': 1, 'reset': true, 'puntoA': 0, 'faltaA': 0,
            'puntoR': 0, 'faltaR': 0, 'nombreA': '', 'nombreR': '', 'gano': '', 'area': idArea
        }))
    }
    const getClubes = async () => {
        if (clubes.length == 0) {
            var resut = await getListaClubs();
            if (resut.ok) {
                setClubes(resut.ok);
            } else {
                MsgUtils.msgError(resut.error);
            }
        }
    }
    function getClubesNombre(id) {
        var nombre = clubes.filter((item) => item.idclub == id)[0]
        return nombre.nombre;
    }
    function procesarFalta(tipo, valor) {
        if (tipo) {
            if ((parseInt(valor) < 0 && puntoJuego.faltaA > 0) || (parseInt(valor) > 0 && puntoJuego.faltaA >= 0)) {
                setPuntoJuego({ ...puntoJuego, faltaA: puntoJuego.faltaA + valor, puntoR: puntoJuego.puntoR + (valor * parseInt(configure.falta)) });
                localStorage.setItem('doblePant', JSON.stringify({ ...puntoJuego, faltaA: puntoJuego.faltaA + valor, nombreA, nombreR, puntoR: puntoJuego.puntoR + (valor * parseInt(configure.falta)), 'gano': '' }))
                if (puntoJuego.faltaA + valor == configure.maxFaltas) {
                    hayGanador('R');
                    setPuntoJuego({ ...puntoJuego, isPlay: false, faltaA: puntoJuego.faltaA + valor, 'reset': true, puntoR: puntoJuego.puntoR + (valor * parseInt(configure.falta)) });
                    localStorage.setItem('doblePant', JSON.stringify({ ...puntoJuego, isPlay: false, faltaA: puntoJuego.faltaA + valor, nombreA, nombreR, 'gano': 'R', 'reset': true, puntoR: puntoJuego.puntoR + (valor * parseInt(configure.falta)) }))
                }
            }
        } else {
            if ((parseInt(valor) < 0 && puntoJuego.faltaR > 0) || (parseInt(valor) > 0 && puntoJuego.faltaR >= 0)) {
                setPuntoJuego({ ...puntoJuego, faltaR: puntoJuego.faltaR + valor, puntoA: puntoJuego.puntoA + (valor * parseInt(configure.falta)) });
                localStorage.setItem('doblePant', JSON.stringify({ ...puntoJuego, faltaR: puntoJuego.faltaR + valor, nombreA, nombreR, 'gano': '', puntoA: puntoJuego.puntoA + (valor * parseInt(configure.falta)) }))
                if (puntoJuego.faltaR + valor == configure.maxFaltas) {
                    setPuntoJuego({ ...puntoJuego, isPlay: false, faltaR: puntoJuego.faltaR + valor, 'reset': true, puntoA: puntoJuego.puntoA + (valor * parseInt(configure.falta)) });
                    localStorage.setItem('doblePant', JSON.stringify({ ...puntoJuego, isPlay: false, 'reset': true, faltaR: puntoJuego.faltaR + valor, nombreA, nombreR, 'gano': 'A', puntoA: puntoJuego.puntoA + (valor * parseInt(configure.falta)) }))
                    hayGanador('A');
                }
            }
        }
    }
    function procesarPunto(color, valor) {
        var puntoj = puntoJuego;
        if (color) {
            if ((parseInt(valor) < 0 && puntoJuego.puntoA > 0) || (parseInt(valor) > 0 && puntoJuego.puntoA >= 0)) {
                puntoj.puntoA += valor;
                setPuntoJuego({ ...puntoJuego, puntoA: puntoj.puntoA });
                localStorage.setItem('doblePant', JSON.stringify({ ...puntoj, nombreA, nombreR, 'gano': '' }))
            }
        } else {
            if ((parseInt(valor) < 0 && puntoJuego.puntoR > 0) || (parseInt(valor) > 0 && puntoJuego.puntoR >= 0)) {
                puntoj.puntoR += valor;
                setPuntoJuego({ ...puntoJuego, puntoR: puntoj.puntoR });
                localStorage.setItem('doblePant', JSON.stringify({ ...puntoj, nombreA, nombreR, 'gano': '' }))
            }
        }
        if (configure.enableDif) {
            if (puntoj.puntoA - puntoj.puntoR >= parseInt(configure.diffPuntos)) {
                hayGanador('A');
                setPuntoJuego({ ...puntoj, isPlay: false, 'reset': true, })
                Sonido(5);
                localStorage.setItem('doblePant', JSON.stringify({ ...puntoj, isPlay: false, nombreA, nombreR, 'gano': 'A', 'reset': true }))
            } else if (puntoj.puntoR - puntoj.puntoA >= parseInt(configure.diffPuntos)) {
                hayGanador('R');
                Sonido(5);
                setPuntoJuego({ ...puntoj, isPlay: false, 'reset': true, })
                localStorage.setItem('doblePant', JSON.stringify({ ...puntoj, isPlay: false, nombreA, nombreR, 'gano': 'R', 'reset': true }))
            }
        }
    }
    function calcularResultado() {
        ejecutarJuego(false);
        if (configure.enableMaxRound) {
            if (parseInt(puntoJuego.puntoA) > parseInt(puntoJuego.puntoR)) {
                hayGanador('A');
                localStorage.setItem('doblePant', JSON.stringify({ ...puntoJuego, nombreA, nombreR, 'gano': 'A', isPlay: false }))
            } else if (parseInt(puntoJuego.puntoR) > parseInt(puntoJuego.puntoA)) {
                hayGanador('R');
                localStorage.setItem('doblePant', JSON.stringify({ ...puntoJuego, nombreA, nombreR, 'gano': 'R', isPlay: false }))
            }
        }
        if (configure.enableMaxPoint) {
            if (parseInt(puntoJuego.puntoA) > parseInt(puntoJuego.puntoR)) {
                hayGanador('A');
                localStorage.setItem('doblePant', JSON.stringify({ ...puntoJuego, nombreA, nombreR, 'gano': 'A', isPlay: false }))
            } else if (parseInt(puntoJuego.puntoR) > parseInt(puntoJuego.puntoA)) {
                hayGanador('R');
                localStorage.setItem('doblePant', JSON.stringify({ ...puntoJuego, nombreA, nombreR, 'gano': 'R', isPlay: false }))
            } else {
                hayGanador('EM');
                localStorage.setItem('doblePant', JSON.stringify({ ...puntoJuego, nombreA, nombreR, 'gano': 'EM', isPlay: false }))
            }
        }
    }
    function declararGanador(punto, color) {
        if (color == 'A') {
            setPuntoJuego({ ...puntoJuego, puntoA: punto });
            hayGanador('A');
            localStorage.setItem('doblePant', JSON.stringify({ ...puntoJuego, puntoA: punto, nombreA, nombreR, 'gano': 'A' }))
        } else if (color == 'R') {
            setPuntoJuego({ ...puntoJuego, puntoR: punto });
            hayGanador('R');
            localStorage.setItem('doblePant', JSON.stringify({ ...puntoJuego, puntoA: punto, nombreA, nombreR, 'gano': 'R' }))
        }
    }
    const resultadoFinal = async () => {
        console.log(msgModal)
        console.log(resultPre)
        console.log(puntoJuego)
        console.log(selectPelea)
        var idganador, idperdedor;
        try {
            if (msgModal.azul > msgModal.rojo) {
                idganador = selectPelea.idcompetidor1;
                idperdedor = selectPelea.idcompetidor2;
            } else {
                idganador = selectPelea.idcompetidor2;
                idperdedor = selectPelea.idcompetidor1;
            }
            var result = await LlavesConsultas.procesarLlavePelea({
                idganador, idperdedor, 'nivel': selectPelea.tipo, 'idpelea': selectPelea.idpelea, 'idllave': selectPelea.idllave
            });
            if (result.ok) {
                MsgUtils.msgCorrecto(result.ok);
                setResultPre([])
                setShowModal(false);
                document.getElementById('btnReset').click();
            } else {
                MsgUtils.msgError(result.error)
            }
        } catch (error) {
            MsgUtils.msgError(error.message);
        }
    }
    function functionContarPunto(lista) {
        let conteo = {}
        let rep_max = 0;
        let elem_max;
        lista.map(element => {
            if (conteo[element]) {
                conteo[element] += 1;
            } else {
                conteo[element] = 1;
            }
            if (rep_max < conteo[element]) {
                rep_max = conteo[element];
                elem_max = element
            }
        });
        return [rep_max, elem_max]
    }
    function lecturadeDatos(datos) {
        if (puntoJuego.isPlay) {
            var cont = parseInt(localStorage.getItem('contAux'));
            if (cont < parseInt(configure.esperaTime)) {
                var valores = functionContarPunto(datos)
                if (valores[1] != '') {
                    if (valores[0] >= parseInt(configure.maxJueces)) {
                        var prePunt = puntoJuego
                        if (valores[1] == 'd' || valores[1] == 'D' || valores[1] == 'P' || valores[1] == 'c' || valores[1] == 'C') {
                            prePunt.puntoA = prePunt.puntoA + parseInt(mapPuntos[valores[1]]);
                        } else {
                            prePunt.puntoR = prePunt.puntoR + parseInt(mapPuntos[valores[1]]);
                        }
                        localStorage.setItem('doblePant', JSON.stringify({ ...prePunt, nombreA, nombreR, 'gano': '' }))
                        localStorage.setItem('contAux', 0);
                        if (configure.enableDif) {
                            if ((prePunt.puntoA - prePunt.puntoR) > parseInt(configure.diffPuntos)) {
                                hayGanador('A');
                                setPuntoJuego({ ...prePunt, isPlay: false });
                                localStorage.setItem('doblePant', JSON.stringify({ ...prePunt, nombreA, nombreR, 'gano': 'A', isPlay: false ,'reset':true}));
                            } else if ((prePunt.puntoR - prePunt.puntoA) > parseInt(configure.diffPuntos)) {
                                setPuntoJuego({ ...prePunt, isPlay: false })
                                hayGanador('R');
                                localStorage.setItem('doblePant', JSON.stringify({ ...prePunt, nombreA, nombreR, 'gano': 'R', isPlay: false,'reset':true }));
                            }
                            setPuntoJuego({ ...prePunt })
                        } else {
                            setPuntoJuego({ ...prePunt })
                        }
                        recetearValoresDb()
                    } else {
                        localStorage.setItem('contAux', cont + 1);
                    }
                }
            } else {
                localStorage.setItem('contAux', 0);
            }
        }
    }
    function recetearValoresDb() {
        fetch(`${server}/mandojuec/limpiarLecturas/${0}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            }
        })
            .then(res => res.json())
            .then(data => {

            })
            .catch(error => MsgUtils.msgError(error));
    }
    const guardarCombate = async () => {
        try {
            var result = await LlavesConsultas.addSeguimientoPelea({ ...puntoJuego, 'idpelea': selectPelea.idpelea });
            if (result.ok) {
                setResultPre([...resultPre, { ...puntoJuego, 'gano': tipoM }])
                var datos = [...resultPre, { ...puntoJuego, 'gano': tipoM }]
                if (parseInt(configure.numRound) == puntoJuego.round) {
                    if (configure.enableMaxPoint) {
                        var sumaA = datos.map(item => parseInt(item.puntoA)).reduce((acumulador, numero) => acumulador + numero, 0);
                        var sumaR = datos.map(item => parseInt(item.puntoA)).reduce((acumulador, numero) => acumulador + numero, 0);
                        setMsgModal({ 'azul': sumaA, 'rojo': sumaR })
                        if (sumaA > sumaR) {
                            setTipoM('AP');
                            localStorage.setItem('doblePant', JSON.stringify({ ...puntoJuego, nombreA, nombreR, 'gano': 'A', isPlay: false }))
                        } else if (sumaR > sumaA) {
                            setTipoM('RP');
                            localStorage.setItem('doblePant', JSON.stringify({ ...puntoJuego, nombreA, nombreR, 'gano': 'R', isPlay: false }))
                        } else {
                            setTipoM('EP');
                        }
                        //setShowModal(true);
                    } else if (configure.enableMaxRound) {
                        var roundA = datos.filter((item) => item.gano == 'A');
                        var roundR = datos.filter((item) => item.gano == 'R');
                        setMsgModal({ 'azul': roundA.length, 'rojo': roundR.length })
                        if (roundA.length > roundR.length) {
                            setTipoM('AR');
                        } else if (roundR.length > roundA.length) {
                            setTipoM('RR');
                        } else {
                            setTipoM('ER');
                        }
                        //setShowModal(true);
                    }
                } else {
                    if (configure.enableMaxRound == true) {
                        var roundA = datos.filter((item) => item.gano == 'A');
                        var roundR = datos.filter((item) => item.gano == 'R');
                        setPuntoJuego({ 'round': puntoJuego.round + 1, 'puntoA': 0, 'faltaA': 0, 'puntoR': 0, 'faltaR': 0, 'isPlay': false, 'newRound': true });
                        localStorage.setItem('doblePant', JSON.stringify({ 'round': puntoJuego.round + 1, 'puntoA': 0, 'faltaA': 0, 'puntoR': 0, 'faltaR': 0, 'isPlay': false, 'newRound': true }))
                        if ((parseInt(configure.numRound) - roundA.length) == 1) {
                            localStorage.setItem('doblePant', JSON.stringify({ 'round': puntoJuego.round + 1, 'puntoA': 0, 'faltaA': 0, 'puntoR': 0, 'faltaR': 0, 'isPlay': false, 'newRound': true,'reset':true }))
                            setMsgModal({ 'azul': roundA.length, 'rojo': roundR.length })
                            setTipoM('AR');
                        } else if ((parseInt(configure.numRound) - roundR.length) == 1) {
                            localStorage.setItem('doblePant', JSON.stringify({ 'round': puntoJuego.round + 1, 'puntoA': 0, 'faltaA': 0, 'puntoR': 0, 'faltaR': 0, 'isPlay': false, 'newRound': true,'reset':true }))
                            setMsgModal({ 'azul': roundA.length, 'rojo': roundR.length })
                            setTipoM('RR');
                        } else {
                            setShowModal(false);
                        }
                    }
                    if (configure.enableMaxPoint == true) {
                        console.log("esta porocesando maximo puntos")
                        //setResultPre([...resultPre, { ...puntoJuego, 'gano': tipoM }]);
                        setPuntoJuego({ ...puntoJuego, 'round': puntoJuego.round + 1, 'isPlay': false, 'newRound': true })
                        setShowModal(false);
                        localStorage.setItem('doblePant', JSON.stringify({ ...puntoJuego, 'round': puntoJuego.round + 1, 'isPlay': false, 'newRound': true }))
                    }
                }
            } else {
                MsgUtils.msgError(result.error);
            }
        } catch (error) {
            MsgUtils.msgError(error.message);
        }

    }
    function Sonido(nota) {
        var Sonidos = [261, 277, 293, 311, 329, 349, 369, 392, 415, 440, 466, 493];
        var context = new (window.AudioContext || window.webkitAudioContext)();
        var osc = context.createOscillator();
        // admite: sine, square, sawtooth, triangle
        osc.type = 'sawtooth';
        osc.frequency.value = Sonidos[nota];
        osc.connect(context.destination);
        osc.start();
        osc.stop(context.currentTime + .5);
    }
    function elegirCompetidor(pelea) {
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
    function getRoundWin(color) {
        var roundA = resultPre.filter((item) => item.gano == color);
        return roundA.length
    }
    function ejecutarJuego(valor) {
        if (selectPelea != null) {
            if (valor) {
                Sonido(11);
            } else {
                Sonido(5);
            }
            localStorage.setItem('contAux', 0);
            setPuntoJuego({ ...puntoJuego, isPlay: valor, reset: false, 'newRound': false })
            localStorage.setItem('doblePant', JSON.stringify({ ...puntoJuego, isPlay: valor, reset: false, nombreA, nombreR, 'gano': '' }))
        } else {
            MsgUtils.msgError("Elija una pelea antes de iniciar ...")
        }
    }
    function getFaltaAcumulada(color) {
        var cont = 0;
        for (var valPre of resultPre) {
            if (color == 'A') {
                cont += parseInt(valPre.faltaA);
            } else if (color == 'R') {
                cont += parseInt(valPre.faltaR);
            }
        }
        return cont;
    }
    function showStadistic(valor) {
        setMandoLec(valor);
        setTipoM('S');
        setShowModal(true);
    }
    const manejarAtajoTeclado = (event) => {
        //console.log(event)
        if (event.key == 'r') {
            document.getElementById('puntoRN').click()
        } else if (event.key == 'R') {
            document.getElementById('puntoRP').click()
        } else if (event.key == 'L') {
            setActivarLectura(true);
        } else if (event.key == 'l') {
            setActivarLectura(false);
        } else if (event.key == 'f') {
            document.getElementById('faltaAR').click()
        } else if (event.key == 'F') {
            document.getElementById('faltaA').click()
        } else if (event.key == 'A') {
            document.getElementById('puntoAP').click()
        } else if (event.key == 'a') {
            document.getElementById('puntoAN').click()
        } else if (event.key == 'P') {
            document.getElementById('buttonPlay').click()
        } else if (event.key == 'Q') {
            document.getElementById('faltaR').click()
        } else if (event.key == 'q') {
            document.getElementById('faltaRR').click()
        } else if (event.key == '.') {
            document.getElementById('btnReset').click()
        } else if (event.key == '-') {
            document.getElementById('btnSubMin').click()
        } else if (event.key == '+') {
            document.getElementById('btnSumMin').click()
        }
    };
    useEffect(() => {
        //setCargador(true);
        localStorage.setItem("contAux", 0);
        var sessionActiva = JSON.parse(localStorage.getItem('login'));
        var cmp = JSON.parse(localStorage.getItem('campeonato'));
        var conf = JSON.parse(localStorage.getItem('kirugui'));
        if (sessionActiva !== null) {
            setTitulo('PUNTUACION COMBATE');
            setCampeonato(cmp);
            setLogin(true);
            setUserLogin(sessionActiva);
            navigate("/nuevaPantallaK", { replace: true });
            getClubes(cmp);
        }
        if (conf !== null) {
            setMapPuntos({
                'd': conf.puntosCabeza, 'D': conf.puntosCabezaGiro, 'P': conf.puntosPunio, 'c': conf.puntosPeto, 'C': conf.puntosPetoGiro,
                'b': conf.puntosCabeza, 'B': conf.puntosCabezaGiro, 'E': conf.puntosPunio, 'a': conf.puntosPeto, 'A': conf.puntosPetoGiro
            })
            setFrecLectura(parseInt(conf.frecLectura));
            setConfigure(conf);
            var listaAr = []
            for (var i = 0; i < parseInt(conf.cantAreas); i++) {
                listaAr.push({ 'id': i + 1, 'nombre': 'Area ' + (i + 1) })
            }
            setAreas(listaAr)
        } else {
            MsgUtils.msgError("Configuracion no Existente ....")
        }
        window.addEventListener('keydown', manejarAtajoTeclado);

        // Limpiar el evento de escucha al desmontar el componente
        return () => {
            window.removeEventListener('keydown', manejarAtajoTeclado);
        };
    }, [])

    return (
        <div>
            {isLoading && <div>Cargando ...</div>}
            {isError && <div>error: {error.message}</div>}
            {isError == false &&
                <>
                    <div className='container-fluid py-2'>
                        <div className='row row-cols-1 row-cols-sm-1 row-cols-md-2 gx-1 mb-1' style={{ height: '75%' }}>
                            <div className='col col-sm-12 col-md-2'>
                                {selectPelea != null &&
                                    <div className='fw-bold text-light text-center bg-dark' style={{ fontSize: '29px' }}>
                                        Pelea #{selectPelea.nropelea}
                                    </div>}
                                <div className='bg-light lh-sm fw-bold text-center' style={{fontSize:'18px'}}>
                                    <div className='text-danger'>Rojo GANO {getRoundWin('R')} round</div>
                                    <div className='text-primary'>Azul GANO {getRoundWin('A')} round</div>
                                </div>
                                <VistaMandos datos={data} setActivarLectura={setActivarLectura}
                                    activarLectura={activarLectura}
                                    configure={configure.numMandos != undefined ? configure : null}
                                    collback={lecturadeDatos}
                                    puntoJuego={puntoJuego} showStadistic={showStadistic} />
                            </div>
                            <div className='col col-sm-12 col-md-10'>
                                <div className='container-fluid fondoControles '>
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
                                                onClick={() => localStorage.setItem('doblePant', JSON.stringify({
                                                    'isPlay': false, 'round': 1, 'reset': false,
                                                    'puntoA': 0, 'faltaA': 0, 'gano': '',
                                                    'puntoR': 0, 'faltaR': 0, nombreA, nombreR, 'area': idArea
                                                }))}
                                                to={'/scoreDobleK'} target='blanck'>
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
                                            <RelojKirugui valor={puntoJuego} conf={configure} tipo='r' collback={() => ''} doble={false} />
                                        </div>
                                        <div className='text-center my-auto mx-1 mx-auto' style={{ fontSize: '45px', width: '230px' }} >
                                            {puntoJuego.isPlay == false &&
                                                <RelojKirugui valor={puntoJuego} conf={configure} tipo='s' collback={() => ''} doble={false} />}
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
                                                {idClubA != -1 &&
                                                    <h4 className='text-start tituloMenu text-light lh-1'>
                                                        {getClubesNombre(idClubA)}
                                                    </h4>}
                                            </div>
                                            <VisorPunto valor={puntoJuego} tipo='A' />
                                            <VisorFaltas valor={puntoJuego} tipo='A' resultPre={getFaltaAcumulada('A')} />
                                        </div>
                                        <div className='col bg-danger bg-gradient col-md-6'>
                                            <div className='w-100 p-2 lh-1'>
                                                <h1 className='text-end tituloMenu text-light lh-1' style={{ fontSize: '30px' }}>
                                                    {nombreR != '' ? nombreR : 'TKD ROJO'}
                                                </h1>
                                                {idClubR != -1 &&
                                                    <h4 className='text-end tituloMenu text-light lh-1'>
                                                        {getClubesNombre(idClubR)}
                                                    </h4>}
                                            </div>
                                            <VisorPunto valor={puntoJuego} tipo='R' />
                                            <VisorFaltas valor={puntoJuego} tipo='R' resultPre={getFaltaAcumulada('R')} />
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
                                                        <button className='btn btn-sm btnScore text-light m-0 p-0 '
                                                            data-bs-toggle="tooltip" data-bs-placement="bottom" title="Derrota por nocaut">
                                                            <i className="fa-solid fa-skull-crossbones fa-2xl"></i>
                                                        </button>
                                                        <button className='btn btn-sm btnScore text-info m-0 p-0 mx-2'
                                                            title='declarar ganador'
                                                            onClick={() => declararGanador(puntoJuego.puntoA + 1, 'A')}>
                                                            <i className="fa-solid fa-trophy fa-2xl"></i>
                                                        </button>
                                                        <button className='btn btn-sm btnScore text-warning m-0 p-0'
                                                            data-bs-toggle="tooltip" data-bs-placement="bottom" title="Derrotado por el GAM-JEON">
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
                                                        <button className='btn btn-sm btnScore m-0 p-0 ' id='faltaA' onClick={() => procesarFalta(true, 1)}>
                                                            <i className="fa-solid fa-circle-plus fa-2xl"></i>(F)
                                                        </button>
                                                        <button className='btn btn-sm btnScore m-0 p-0' id='faltaAR' onClick={() => procesarFalta(true, -1)}>
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
                                                        <button className='btn btn-sm btnScore m-0 p-0' id='puntoAP' onClick={() => procesarPunto(true, 1)}>
                                                            <i className="fa-solid fa-circle-plus fa-2xl"></i>(A)
                                                        </button>
                                                        <button className='btn btn-sm btnScore m-0 p-0' id='puntoAN' onClick={() => procesarPunto(true, -1)}>
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
                                                        <button className='btn btn-sm btnScore m-0 p-0' id='puntoRP' onClick={() => procesarPunto(false, 1)}>
                                                            <i className="fa-solid fa-circle-plus fa-2xl"></i>(R)
                                                        </button>
                                                        <button className='btn btn-sm btnScore m-0 p-0' id='puntoRN' onClick={() => procesarPunto(false, -1)}>
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
                                                        <button className='btn btn-sm btnScore m-0 p-0' id='faltaR' onClick={() => procesarFalta(false, 1)}>
                                                            <i className="fa-solid fa-circle-plus fa-2xl"></i>(Q)
                                                        </button>
                                                        <button className='btn btn-sm btnScore m-0 p-0' id='faltaRR' onClick={() => procesarFalta(false, -1)}>
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
                                                            data-bs-toggle="tooltip" data-bs-placement="bottom" title="Derrotado por GAM-JEON">
                                                            <i className="fa-solid fa-diamond fa-2xl"></i>
                                                        </button>
                                                        <button className='btn btn-sm btnScore text-info m-0 p-0 mx-2'
                                                            title='Declarar ganador'
                                                            onClick={() => declararGanador(puntoJuego.puntoR + 1, 'R')}>
                                                            <i className="fa-solid fa-trophy fa-2xl"></i>
                                                        </button>
                                                        <button className='btn btn-sm btnScore text-light m-0 p-0'
                                                            data-bs-toggle="tooltip" data-bs-placement="bottom"
                                                            title="Derrotado por nocaut">
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
                </>
            }
            <Modal show={showModal} onHide={() => setShowModal(false)}
                size={`${tipoM == 'S' ? 'lm' : 'xl'}`}
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
                                    <div className='bg-light'>{msgModal.azul}</div>
                                </div>
                                <div className='col text-danger fw-bold tituloMenu text-center' style={{ fontSize: '90px' }}>
                                    <div className='bg-light'>{msgModal.rojo}</div>
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
                            <i className="fa-solid fa-thumbs-up fa-2xl"></i> Aceptar
                        </button>}
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default PrincipalKirugui
