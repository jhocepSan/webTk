import React, { useContext, useEffect, useState } from 'react'
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
import {server} from '../utils/MsgUtils';

function PrincipalTesting() {
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
    const [msgModal, setMsgModal] = useState({});
    const [resultPre, setResultPre] = useState([]);
    const { isLoading, data, isError, error } = useQuery(
        {
            queryKey: ['mandos'],
            queryFn: () => getMandosPuntuados({ sector: 0, cont: localStorage.getItem('contAux') != undefined ? 0 : localStorage.getItem('contAux') }),
            refetchInterval: activarLectura ? frecLectura : false
        }
    )
    function hayGanador(color) {
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
        localStorage.setItem('doblePant',JSON.stringify({ 'isPlay': false, 'round': 1, 'reset': true,'puntoA': 0, 'faltaA': 0,
            'puntoR': 0, 'faltaR': 0, 'nombreA':'','nombreR':'','gano':'' }))
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
                setPuntoJuego({ ...puntoJuego, faltaA: puntoJuego.faltaA + valor });
                localStorage.setItem('doblePant',JSON.stringify({ ...puntoJuego, faltaA: puntoJuego.faltaA + valor,nombreA,nombreR,'gano':'' }))
                if (puntoJuego.faltaA + valor == configure.maxFaltas) {
                    hayGanador('R');
                    setPuntoJuego({ ...puntoJuego,isPlay:false, faltaA: puntoJuego.faltaA + valor,'reset': true, });
                    localStorage.setItem('doblePant',JSON.stringify({ ...puntoJuego ,isPlay:false, faltaA: puntoJuego.faltaA + valor,nombreA,nombreR,'gano':'R','reset': true }))
                }
            }
        } else {
            if ((parseInt(valor) < 0 && puntoJuego.faltaR > 0) || (parseInt(valor) > 0 && puntoJuego.faltaR >= 0)) {
                setPuntoJuego({ ...puntoJuego, faltaR: puntoJuego.faltaR + valor });
                localStorage.setItem('doblePant',JSON.stringify({ ...puntoJuego, faltaR: puntoJuego.faltaR + valor,nombreA,nombreR,'gano':''}))
                if (puntoJuego.faltaR + valor == configure.maxFaltas) {
                    setPuntoJuego({ ...puntoJuego,isPlay:false, faltaR: puntoJuego.faltaR + valor,'reset': true });
                    localStorage.setItem('doblePant',JSON.stringify({ ...puntoJuego,isPlay:false,'reset': true, faltaR: puntoJuego.faltaR + valor,nombreA,nombreR,'gano':'A' }))
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
                localStorage.setItem('doblePant',JSON.stringify({ ...puntoj,nombreA,nombreR,'gano':'' }))
            }
        } else {
            if ((parseInt(valor) < 0 && puntoJuego.puntoR > 0) || (parseInt(valor) > 0 && puntoJuego.puntoR >= 0)) {
                puntoj.puntoR += valor;
                setPuntoJuego({ ...puntoJuego, puntoR: puntoj.puntoR });
                localStorage.setItem('doblePant',JSON.stringify({ ...puntoj,nombreA,nombreR,'gano':'' }))
            }
        }
        if (configure.enableDif) {
            if (puntoj.puntoA - puntoj.puntoR >= parseInt(configure.diffPuntos)) {
                hayGanador('A');
                setPuntoJuego({...puntoj,'reset': true,})
                localStorage.setItem('doblePant',JSON.stringify({ ...puntoj,isPlay:false,nombreA,nombreR,'gano':'A','reset': true }))
            } else if (puntoj.puntoR - puntoj.puntoA >= parseInt(configure.diffPuntos)) {
                hayGanador('R');
                setPuntoJuego({...puntoj,'reset': true,})
                localStorage.setItem('doblePant',JSON.stringify({ ...puntoj,isPlay:false,nombreA,nombreR,'gano':'R','reset': true }))
            }
        }
    }
    function calcularResultado() {
        ejecutarJuego(false);
        if (parseInt(puntoJuego.puntoA) > parseInt(puntoJuego.puntoR)) {
            hayGanador('A');
            localStorage.setItem('doblePant',JSON.stringify({ ...puntoj,nombreA,nombreR,'gano':'A' }))
        } else if (parseInt(puntoJuego.puntoR) > parseInt(puntoJuego.puntoA)) {
            hayGanador('R');
            localStorage.setItem('doblePant',JSON.stringify({ ...puntoj,nombreA,nombreR,'gano':'R' }))
        } else {

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
                if(valores[1]!=''){
                    if (valores[0] >= parseInt(configure.maxJueces)) {
                        var prePunt = puntoJuego
                        if (valores[1] == 'd' || valores[1] == 'D' || valores[1] == 'P' || valores[1] == 'c' || valores[1] == 'C') {
                            prePunt.puntoA = prePunt.puntoA + parseInt(mapPuntos[valores[1]]);
                        } else {
                            prePunt.puntoR = prePunt.puntoR + parseInt(mapPuntos[valores[1]]);
                        }
                        localStorage.setItem('doblePant',JSON.stringify({ ...prePunt,nombreA,nombreR,'gano':'' }))
                        localStorage.setItem('contAux', 0);
                        if (configure.enableDif) {
                            if ((prePunt.puntoA - prePunt.puntoR) > parseInt(configure.diffPuntos)) {
                                hayGanador('A');
                                setPuntoJuego({ ...prePunt, isPlay: false })
                            } else if ((prePunt.puntoR - prePunt.puntoA) > parseInt(configure.diffPuntos)) {
                                setPuntoJuego({ ...prePunt, isPlay: false })
                                hayGanador('R');
                            }
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
    function recetearValoresDb(){
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
    function guardarCombate() {
        if (parseInt(configure.numRound) == puntoJuego.round) {
            setResultPre([...resultPre, { ...puntoJuego, 'gano': tipoM }])
            var datos = [...resultPre, { ...puntoJuego, 'gano': tipoM }]
            console.log(datos)
            if (configure.enableMaxPoint) {
                var sumaA = datos.map(item => parseInt(item.puntoA)).reduce((acumulador, numero) => acumulador + numero, 0);
                var sumaR = datos.map(item => parseInt(item.puntoA)).reduce((acumulador, numero) => acumulador + numero, 0);
                setMsgModal({ 'azul': sumaA, 'rojo': sumaR })
                if (sumaA > sumaR) {
                    setTipoM('AP');
                } else if (sumaR > sumaA) {
                    setTipoM('RP');
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
            setResultPre([...resultPre, { ...puntoJuego, 'gano': tipoM }]);
            setPuntoJuego({ 'round': puntoJuego.round + 1, 'puntoA': 0, 'faltaA': 0, 'puntoR': 0, 'faltaR': 0, 'isPlay': false });
            setShowModal(false);
        }
    }
    function ejecutarJuego(valor) {
        localStorage.setItem('contAux', 0);
        setPuntoJuego({ ...puntoJuego, isPlay: valor, reset: false })
        localStorage.setItem('doblePant',JSON.stringify({ ...puntoJuego, isPlay: valor, reset: false,nombreA,nombreR,'gano':'' }))
    }
    const manejarAtajoTeclado = (event) => {
        console.log(event)
        if (event.key == 'r') {
            document.getElementById('puntoRN').click()
        } else if (event.key == 'R') {
            document.getElementById('puntoRP').click()
        } else if (event.key == 'L') {
            setActivarLectura(true);
        } else if (event.key == 'l') {
            setActivarLectura(false);
        } else if (event.key == 'f') {
            document.getElementById('faltaA').click()
        } else if (event.key == 'F') {
            document.getElementById('faltaR').click()
        } else if (event.key == 'A') {
            document.getElementById('puntoAP').click()
        } else if (event.key == 'a') {
            document.getElementById('puntoAN').click()
        } else if (event.key == 'P') {
            document.getElementById('buttonPlay').click()
        } else if (event.key == 'p') {
            document.getElementById('buttonStop').click()
        }

    };
    useEffect(() => {
        //setCargador(true);
        localStorage.setItem("contAux", 0);
        var sessionActiva = JSON.parse(localStorage.getItem('login'));
        var cmp = JSON.parse(localStorage.getItem('campeonato'));
        var conf = JSON.parse(localStorage.getItem('kirugui'));
        if (sessionActiva !== null) {
            setTitulo('PRUEBA MANDOS INALAMBRICOS');
            setCampeonato(cmp);
            setLogin(true);
            setUserLogin(sessionActiva);
            navigate("/gamePad", { replace: true });
            getClubes(cmp);
        }
        if (conf !== null) {
            setMapPuntos({
                'd': conf.puntosCabeza, 'D': conf.puntosCabezaGiro, 'P': conf.puntosPunio, 'c': conf.puntosPeto, 'C': conf.puntosPetoGiro,
                'b': conf.puntosCabeza, 'B': conf.puntosCabezaGiro, 'E': conf.puntosPunio, 'a': conf.puntosPeto, 'A': conf.puntosPetoGiro
            })
            setFrecLectura(parseInt(conf.frecLectura));
            setConfigure(conf)
        }
        window.addEventListener('keydown', manejarAtajoTeclado);

        // Limpiar el evento de escucha al desmontar el componente
        return () => {
            window.removeEventListener('keydown', manejarAtajoTeclado);
        };
    }, [])

    return (
        <div>
            <Header />
            {isLoading && <div>Cargando ...</div>}
            {isError && <div>error: {error.message}</div>}
            {isError == false &&
                <div className='container-fluid py-1'>
                    <div className='row row-cols gx-1' style={{ height: '70vh' }}>
                        <div className='col' style={{ maxWidth: '20%', minWidth: '20%' }}>
                            <VistaMandos datos={data} setActivarLectura={setActivarLectura} activarLectura={activarLectura} configure={configure.numMandos != undefined ? configure : null} collback={lecturadeDatos} />
                        </div>
                        <div className='col' style={{ maxWidth: '80%', minWidth: '80%' }}>
                            <div className='container-fluid fondoControles mb-1'>
                                <div className="btn-group btn-group-sm" role="group" aria-label="Basic example">
                                    <Link className='btn btn-sm botonMenu my-auto' data-bs-toggle="tooltip"
                                        data-bs-placement="bottom" title="Abrir pantalla extendida"
                                        onClick={() => localStorage.setItem('doblePant',JSON.stringify({
                                            'isPlay': false, 'round': 1, 'reset': false,
                                            'puntoA': 0, 'faltaA': 0,'gano':'',
                                            'puntoR': 0, 'faltaR': 0,nombreA,nombreR
                                        }))}
                                        to={'/scoreDobleK'} target='blanck'>
                                        <i className="fa-brands fa-windows fa-2xl"></i>
                                    </Link>
                                    <button type="button" className="btn mx-1 btn-sm botonMenu"
                                        data-bs-toggle="tooltip" data-bs-placement="bottom" title="Recetear valores iniciales"
                                        onClick={() => recetearValores()}>
                                        <i className="fa-solid fa-repeat fa-2xl"></i></button>
                                    {puntoJuego.isPlay === true && <button type="button" className="btn mx-1 btn-sm botonMenu"
                                        id='buttonStop'
                                        data-bs-toggle="tooltip" data-bs-placement="bottom" title="Pausar Competencia"
                                        onClick={() => ejecutarJuego(false)}>
                                        <i className="fa-solid fa-circle-pause fa-2xl"></i>
                                    </button>}
                                    {puntoJuego.isPlay === false && <button type="button" className="btn mx-1 btn-sm botonMenu"
                                        data-bs-toggle="tooltip" data-bs-placement="bottom" title="Iniciar Competencia" id='buttonPlay'
                                        onClick={() => ejecutarJuego(true)}>
                                        <i className="fa-solid fa-circle-play fa-2xl"></i>
                                    </button>}
                                    <button type="button" className="btn mx-1 btn-sm botonMenu d-none"
                                        id='buttonFinal'
                                        data-bs-toggle="tooltip" data-bs-placement="bottom" title="Pausar Competencia"
                                        onClick={() => calcularResultado()}>
                                        <i className="fa-solid fa-circle-pause fa-2xl"></i>
                                    </button>
                                    <div className='text-center text-light tituloMenu fw-bold ' style={{ fontSize: '45px', width: '290px' }}>
                                        Round {puntoJuego.round}
                                    </div>
                                    <div className='text-center' style={{ fontSize: '45px', width: '200px' }} >
                                        <RelojKirugui valor={puntoJuego} conf={configure} tipo='r' collback={()=>''} doble={false}/>
                                    </div>
                                    <div className='text-center' style={{ fontSize: '45px', width: '200px' }} >
                                        {puntoJuego.isPlay == false && <RelojKirugui valor={puntoJuego} conf={configure} tipo='s' collback={()=>''} doble={false}/>}
                                    </div>
                                </div>
                            </div>
                            <div className='container-fluid'>
                                <div className='row row-cols-2 gx-0'>
                                    <div className='col bg-primary bg-gradient col-6'>
                                        <div className='w-100 p-2'>
                                            <h1 className='text-start tituloMenu text-light' style={{ fontSize: '30px' }}>
                                                {nombreA != '' ? nombreA : 'TKD AZUL'}
                                            </h1>
                                            {idClubA != -1 &&
                                                <h4 className='text-start tituloMenu text-light'>
                                                    {getClubesNombre(idClubA)}
                                                </h4>}
                                        </div>
                                        <VisorPunto valor={puntoJuego} tipo='A' />
                                        <VisorFaltas valor={puntoJuego} tipo='A' />
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
                                        <VisorFaltas valor={puntoJuego} tipo='R' />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='container-fluid fondoControles'>
                        <div className='row row-cols-2 g-0'>
                            <div className='col text-center bg-primary'>
                                <div className='container-fluid'>
                                    <div className='row row-cols-3 g-0'>
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
                                                    <button className='btn btn-sm btnScore' id='faltaA' onClick={() => procesarFalta(true, 1)}>
                                                        <i className="fa-solid fa-circle-plus fa-2xl"></i>
                                                    </button>
                                                    <button className='btn btn-sm btnScore' onClick={() => procesarFalta(true, -1)}>
                                                        <i className="fa-solid fa-circle-minus fa-2xl"></i>
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
                                                    <button className='btn btn-sm btnScore' id='puntoAP' onClick={() => procesarPunto(true, 1)}>
                                                        <i className="fa-solid fa-circle-plus fa-2xl"></i>
                                                    </button>
                                                    <button className='btn btn-sm btnScore' id='puntoAN' onClick={() => procesarPunto(true, -1)}>
                                                        <i className="fa-solid fa-circle-minus fa-2xl"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='col text-center bg-danger'>
                                <div className='container-fluid'>
                                    <div className='row row-cols-3 g-0'>
                                        <div className='col'>
                                            <div className='text-light'>
                                                Punto
                                            </div>
                                            <div className='container-fluid'>
                                                <div className="btn-group btn-group-sm">
                                                    <button className='btn btn-sm btnScore' id='puntoRP' onClick={() => procesarPunto(false, 1)}>
                                                        <i className="fa-solid fa-circle-plus fa-2xl"></i>
                                                    </button>
                                                    <button className='btn btn-sm btnScore' id='puntoRN' onClick={() => procesarPunto(false, -1)}>
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
                                                    <button className='btn btn-sm btnScore' id='faltaR' onClick={() => procesarFalta(false, 1)}>
                                                        <i className="fa-solid fa-circle-plus fa-2xl"></i>
                                                    </button>
                                                    <button className='btn btn-sm btnScore' onClick={() => procesarFalta(false, -1)}>
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
                                                    <button className='btn btn-sm btnScore text-warning'
                                                        data-bs-toggle="tooltip" data-bs-placement="bottom" title="Derrotado por GAM-JEON">
                                                        <i className="fa-solid fa-diamond fa-2xl"></i>
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
                    <div className='container-fluid m-0 p-0 py-1'>
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
            }
            <Modal show={showModal} onHide={() => setShowModal(false)}
                size={'xl'} centered
                backdrop="static"
                aria-labelledby="contained-modal-title-vcenter"
                contentClassName={`${(tipoM == 'A' || tipoM == 'AP' || tipoM == 'AR') ? 'bg-primary' : (tipoM == 'R' || tipoM == 'RP' || tipoM == 'RR') ? 'bg-danger' : 'bg-dark'} bg-gradient`}>
                <Modal.Header bsPrefix='modal-header m-0 p-0 px-2 w-100 ' closeButton={false} closeVariant='white'>
                    <div className='fa-fade tituloMenu text-light fw-bold mx-auto' style={{ fontSize: '100px' }}>
                        Ganador ...!!
                    </div>
                </Modal.Header>
                {tipoM !== 'A' && tipoM !== 'R' &&
                    <Modal.Body>
                        <div className='container-fluid bg-transparent'>
                            <div className='row row-cols-2 gx-2' >
                                <div className='col text-primary fw-bold tituloMenu text-center ' style={{ fontSize: '90px' }}>
                                    <div className='bg-light'>{msgModal.azul}</div>
                                </div>
                                <div className='col text-danger fw-bold tituloMenu text-center' style={{ fontSize: '90px' }}>
                                    <div className='bg-light'>{msgModal.rojo}</div>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                }
                <Modal.Footer>
                    <button className='btn btn-sm btn-info' onClick={() => { guardarCombate(); }}><i className="fa-solid fa-thumbs-up fa-2xl"></i>Aceptar</button>
                </Modal.Footer>
            </Modal>
        </div>

    )
}

export default PrincipalTesting
