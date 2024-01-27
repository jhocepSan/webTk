import React, { useContext, useEffect, useRef, useState } from 'react'
import Header from '../Header';
import Modal from 'react-bootstrap/Modal';
import UtilsCargador from '../utils/UtilsCargador';
import MsgUtils from '../utils/MsgUtils';
import Competidor from '../RegistroCompetidor/Competidor';
import { downloadExcel } from 'react-export-table-to-excel';
import PrincipalLlaves from './PrincipalLlaves';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import CompetidoresPdf from './CompetidoresPdf';
import { ContextAplicacions } from '../Context/ContextAplicacion';
import { useNavigate } from 'react-router-dom';
import { server } from '../utils/MsgUtils';
import PrincipalLlaveRom from './PrincipalLlaveRom';
import PrincipalLlavePoomse from './PrincipalLlavePoomse';
import UtilsBuffer from '../utils/UtilsBuffer';
import imgTK from '../../assets/tkd.png'

function PrincipalListaCompetidor() {
    const navigate = useNavigate();
    const { setLogin, setUserLogin, campeonato, setCampeonato, setTitulo } = useContext(ContextAplicacions);
    const [cargador, setCargador] = useState(false);
    const [tituloo, setTituloo] = useState('');
    const [idCampeonato, setIdCampeonato] = useState(0);
    const [tipo, setTipo] = useState('');
    const [genero, setGenero] = useState('');
    const [categorias, setCategorias] = useState([]);
    const [subCategorias, setSubCategorias] = useState([]);
    const [idCategoria, setIdCategoria] = useState(0);
    const [idSubCategoria, setIdSubCategoria] = useState(0);
    const [listaCompetidores, setListaCompetidores] = useState([]);
    const [buscado, setBuscado] = useState(false);
    const [hayLlaves, setHayLlaves] = useState(false);
    const [listaLlaves, setListaLlaves] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [tituloModal, setTituloModal] = useState('');
    const [noValido, setNoValido] = useState(false);
    const [tipoM, setTipoM] = useState('');
    const [listaClubs, setListaClubs] = useState([]);
    const [idClub, setIdClub] = useState(0);
    const [listaTiposCam, setListaTiposCam] = useState([]);
    const header = ["Nombres", "Apellidos", "Edad", "Peso", "Altura", "Club", "Cinturon", "Grado", "Categoria", "Sub-Categoria"];

    function handleDownloadExcel() {
        var body = []
        var listafiltrada = listaCompetidores.filter((item) => (idCategoria == item.idcategoria || idCategoria == 0) && (idSubCategoria == 0 || item.idsubcategoria == idSubCategoria))
        for (var item of listafiltrada) {
            body.push({
                "nombres": item.nombres,
                "apellidos": item.apellidos,
                "edad": item.edad,
                "peso": item.peso,
                "altura": item.altura,
                "club": item.club,
                "cinturon": item.cinturon,
                "grado": item.grado,
                "categoria": item.nombrecategoria,
                "subcategoria": item.nombresubcategoria
            })
        }
        downloadExcel({
            fileName: "react-export-table-to-excel -> downloadExcel method",
            sheet: "react-export-table-to-excel",
            tablePayload: {
                header,
                body: body,
            },
        });
    }
    function buscarCompetidor() {
        var input, filter, table, tr, td, i;
        input = document.getElementById("competidor");
        filter = input.value.toUpperCase();
        table = document.getElementById("competidoresLista");
        tr = table.getElementsByTagName("tr");
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("div")[0];
            if (td) {
                var valor = td.getElementsByTagName('div')[1].innerHTML;
                if (valor.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    }
    function buscarClub() {
        var input, filter, table, tr, td, i;
        input = document.getElementById("nombreClub");
        filter = input.value.toUpperCase();
        table = document.getElementById("competidoresLista");
        tr = table.getElementsByTagName("tr");
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("div")[0];
            if (td) {
                var valor = td.getElementsByTagName('div')[2].innerHTML;
                if (valor.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    }
    function getInformacionCategoria(info) {
        fetch(`${server}/config/getConfiCategoria`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ idcampeonato: info.idcampeonato, genero })
        })
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    setCategorias(data.ok);
                } else {
                    MsgUtils.msgError(data.error);
                }
            })
            .catch(error => MsgUtils.msgError(error));
    }
    function buscarCategoria(dato, row) {
        var table, tr, td, i, txtValue;
        table = document.getElementById("competidoresLista");
        tr = table.getElementsByTagName("tr");
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[row];
            if (td) {
                txtValue = td.textContent || td.innerText;
                if (txtValue.toUpperCase() === ('' + dato) || dato === '') {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    }
    function cambiarCategoria(i) {
        console.log(i, "categoria");
        setIdCategoria(i);
        var cat = categorias.filter((item) => item.idcategoria === parseInt(i));
        console.log(cat);
        if (cat.length !== 0) {
            setIdSubCategoria(0);
            setSubCategorias(cat[0].SUBCATEGORIA);
            buscarCategoria(i, 4);
        } else {
            console.log("entro")
            setIdSubCategoria(0);
            setSubCategorias([]);
            buscarCategoria('', 4);
        }
    }
    function cambiarSubCategoria(i) {
        console.log(i, "subcategoria");
        setIdSubCategoria(i);
        if (i != 0) {
            buscarCategoria(i, 5);
        } else {
            buscarCategoria('', 5);
        }
    }
    function obtenerLLaves() {
        fetch(`${server}/competidor/obtenerLlaves`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ idCampeonato, genero, tipo })
        })
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    setListaLlaves(data.ok);
                    var filtroGenero = data.ok.filter((item) => item.genero == genero)
                    if (filtroGenero.length !== 0) {
                        setHayLlaves(true);
                    } else {
                        setHayLlaves(false);
                    }
                } else {
                    MsgUtils.msgError(data.error);
                }
            })
            .catch(error => MsgUtils.msgError(error));
    }

    function buscarCompetidores() {
        if (genero !== '' && tipo !== '' && tipo !== 'D') {
            setCargador(true);
            fetch(`${server}/competidor/getCompetidorClasificadoLista`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify({ idCampeonato, genero, tipo, idClub })
            })
                .then(res => res.json())
                .then(data => {
                    setCargador(false);
                    if (data.ok) {
                        obtenerLLaves();
                        comprobarEstado(data.ok);
                        setListaCompetidores(data.ok);
                        setBuscado(true);
                    } else {
                        MsgUtils.msgError(data.error);
                    }
                })
                .catch(error => MsgUtils.msgError(error));
        } else if (tipo !== '' && tipo == 'D') {
            console.log(tipo)
            setCargador(true);
            fetch(`${server}/competidor/getEquipoDemostration`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify({ idCampeonato })
            })
                .then(res => res.json())
                .then(data => {
                    setCargador(false);
                    if (data.ok) {
                        setListaCompetidores(data.ok);
                        setBuscado(true);
                    } else {
                        MsgUtils.msgError(data.error);
                    }
                })
                .catch(error => MsgUtils.msgError(error));
        } else {
            MsgUtils.msgError("Elija el tipo y el genero para buscar")
        }
    }
    function GenerarLlaves() {
        console.log("generar llaves")
        if (tipo !== '' && genero !== '') {
            setCargador(true);
            if (listaCompetidores.length !== 0) {
                if (tipo == 'C') {
                    fetch(`${server}/competidor/generateLLaves`, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json;charset=utf-8',
                        },
                        body: JSON.stringify({ categorias, idCampeonato, genero, tipo })
                    })
                        .then(res => res.json())
                        .then(data => {
                            if (data.ok) {
                                buscarCompetidores();
                                MsgUtils.msgCorrecto(data.ok);
                            } else {
                                MsgUtils.msgError(data.error);
                            }
                        })
                        .catch(error => MsgUtils.msgError(error));
                } else if (tipo == 'R') {
                    fetch(`${server}/competidor/generarLlaveRompimiento`, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json;charset=utf-8',
                        },
                        body: JSON.stringify({ categorias, idCampeonato, genero, tipo })
                    })
                        .then(res => res.json())
                        .then(data => {
                            if (data.ok) {
                                buscarCompetidores();
                                MsgUtils.msgCorrecto(data.ok);
                            } else {
                                MsgUtils.msgError(data.error);
                            }
                        })
                        .catch(error => MsgUtils.msgError(error));
                } else if (tipo == 'P') {
                    fetch(`${server}/competidor/generarLlavePoomse`, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json;charset=utf-8',
                        },
                        body: JSON.stringify({ categorias, idCampeonato, genero, tipo })
                    })
                        .then(res => res.json())
                        .then(data => {
                            if (data.ok) {
                                buscarCompetidores();
                                MsgUtils.msgCorrecto(data.ok);
                            } else {
                                MsgUtils.msgError(data.error);
                            }
                        })
                        .catch(error => MsgUtils.msgError(error));
                }
            } else {
                MsgUtils.msgError("No hay competidores registrados")
            }
        } else {
            MsgUtils.msgError("Elija el tipo y el genero para generar las LLAVES")
        }
    }
    function comprobarEstado(dato) {
        var info = dato.filter((item) => item.idsubcategoria == null || item.idcategoria == null || item.grado == null || item.cinturon == null)
        if (info.length !== 0) {
            setNoValido(true);
        } else {
            setNoValido(false);
        }
    }
    const handleDownload = () => {
        if (tipo !== 'D') {
            setTipoM('P');
            setTituloModal('Clasificación de Competidores');
            setShowModal(true);
        } else {
            console.log("generar pdf ")
        }
    };
    function renderTipoCmp(competidorSelect) {
        if (competidorSelect.idtipocompetencia != undefined || competidorSelect.idtipocompetencia != null) {
            var tiposCmp = competidorSelect.idtipocompetencia.split(':');
            return (
                <td style={{ minWidth: '200px' }}>
                    {tiposCmp.map((item, index) => {
                        var val = listaTiposCam.filter((v) => v.idtipo == parseInt(item));
                        if (val.length !== 0) {
                            return (
                                <div className='container-fluid mb-1' key={index}>
                                    <span className="badge rounded-pill bg-primary position-relative">{val[0].descripcion}
                                    </span>
                                </div>
                            )
                        }
                    })}
                </td>)
        }
    }
    function obtenerTiposCampeonato() {
        fetch(`${server}/config/getTiposCampeonato`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({
                'idcampeonato': idCampeonato, tipo
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    setListaTiposCam(data.ok);
                } else {
                    MsgUtils.msgError(data.error);
                }
                setCargador(false);
            })
            .catch(error => MsgUtils.msgError(error));
    }
    function generarTargetaComp() {
        var cmpSelect = JSON.parse(localStorage.getItem('campeonato'));
        var subtitulo = '';
        if (tipo == 'C') {
            subtitulo = 'KYORUGUI';
        } else if (tipo == 'P') {
            subtitulo = 'POOMSAE';
        } else if (tipo == 'D') {
            subtitulo = 'DEMOSTRACIONES';
        } else if (tipo == 'R') {
            subtitulo = 'ROMPIMIENTO';
        }
        var optiones = {
            orientation: 'p',
            unit: 'mm',
            format: 'letter',
            putOnlyUsedFonts: true,
            floatPrecision: 16 // or "smart", default is 16
        }
        var doc = new jsPDF(optiones);
        var x = 5, numColum = 0,pagina=1;
        var y = 5, numCard = 0;
        var width = doc.internal.pageSize.getWidth();
        var height = doc.internal.pageSize.getHeight();
        for (var est of listaCompetidores) {
            if (numColum <=2) {
                doc.setFontSize(6);
                doc.setTextColor(255, 0, 0);
                doc.setDrawColor(255, 0, 0);
                doc.setLineWidth(1.5);
                doc.line(x, y, x + 60, y, 'FD');
                doc.line(x, y - 0.5, x, y + 35.5, 'FD');
                doc.line(x + 60, y - 0.5, x + 60, y + 35.5, 'FD');
                doc.line(x, y + 35, x + 60, y + 35, 'FD');
                doc.setDrawColor(0, 0, 255);
                doc.setLineWidth(0.8);
                doc.line(x+2, y, x + 60, y, 'FD');
                doc.line(x, y +2, x, y + 35.5, 'FD');
                doc.setLineWidth(1.5);
                doc.line(x,y+2,x+2,y,'FD');
                doc.setLineWidth(0.8);
                doc.line(x + 60, y - 0.5, x + 60, y + 35.5, 'FD');
                doc.line(x, y + 35, x + 60, y + 35, 'FD');
                y += 3;
                doc.setTextColor(0, 0, 255);
                doc.text('ASOCIACIÓN TRADICIONAL DE CLUBES DE', x + 3, y);
                doc.text('TAEKWONDO COCHABAMBA', x + 9, y + 3);
                doc.setTextColor(250, 193, 41);
                doc.setFontSize(7);
                doc.text('Tarjeta de competencia', x + 4, y + 8);
                doc.setFontSize(6);
                doc.setTextColor(0, 0, 0);
                doc.text('Nombre.- ' + est.nombres + ' ' + est.apellidos, x + 3, y + 13);
                doc.text('Club.- ' + est.club, x + 3, y + 16);
                doc.text('Peso/kg.- '+ est.peso, x + 3, y + 19);
                doc.text('Grado.- ' + est.grado + ' - ' + est.cinturon, x + 3, y + 22);
                doc.text('Categoria.- ' + est.nombrecategoria, x + 3, y + 25);
                doc.setFontSize(7);
                doc.setTextColor(0, 0, 255);
                doc.text(subtitulo, x + 24, y + 29);
                doc.setTextColor(0, 0, 0);
                doc.setDrawColor(0, 0, 0);
                doc.setLineWidth(0.8);
                doc.line(x+42,y+24,x+57,y+24,'FD')
                doc.text('Puesto', x + 45, y + 27);
                doc.addImage(imgTK, 'JPEG', x + 47, y - 1, 10, 10);
                y += 36
                if(numCard<6){
                    numCard+=1
                }else{
                    numCard=0
                    numColum+=1
                    x+=64
                    y=5
                }
            } else {
                numColum=0;
                pagina+=1;
                doc.addPage();
                doc.setPage(pagina);
                x=5,y=5;
            }
        }
        doc.save(cmpSelect.nombre.replace(' ', '') + subtitulo + 'Tarjetas.pdf');
    }
    useEffect(() => {
        if (genero != '') {
            getInformacionCategoria({ idcampeonato: idCampeonato, genero })
        }
    }, [genero])
    useEffect(() => {
        var info = JSON.parse(localStorage.getItem('campeonato'));
        var sessionActiva = JSON.parse(localStorage.getItem('login'));
        setTituloo(info.nombre);
        setIdCampeonato(info.idcampeonato);
        if (sessionActiva !== null) {
            setTitulo('LISTA COMPETIDORES')
            setCampeonato(info);
            setLogin(true);
            setUserLogin(sessionActiva);
            navigate("/listCompe", { replace: true });
        }
    }, [])
    useEffect(() => {
        if (listaClubs.length == 0) {
            setCargador(true);
            fetch(`${server}/club/getListaClub`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=utf-8',
                }
            })
                .then(res => res.json())
                .then(data => {
                    setCargador(false);
                    if (data.ok) {
                        console.log(data.ok);
                        setListaClubs(data.ok);
                    } else {
                        MsgUtils.msgError(data.error);
                    }
                })
                .catch(error => MsgUtils.msgError(error));
        }
    }, [])
    return (
        <div>
            <Header />
            <UtilsCargador show={cargador} />
            <div className='container-fluid bg-dark bg-gradient py-2'>
                <div className='row g-2'>
                    <div className='col-12 col-md-3 my-auto'>
                        <div className='text-light letraMontserratr'>
                            Competidores Camp. {tituloo}
                        </div>
                    </div>
                    <div className='col' style={{ maxWidth: '120px', minWidth: '120px' }}>
                        <select className="form-select form-select-sm btn-secondary letraBtn" value={tipo}
                            onChange={(e) => { setTipo(e.target.value); setBuscado(false); }}>
                            <option value=''>Tipo (Ninguno)</option>
                            <option value="C">Combate</option>
                            <option value="P">Poomse</option>
                            <option value="D">Demostraciones</option>
                            <option value="R">Rompimiento</option>
                        </select>
                    </div>
                    {tipo != 'D' && <div className='col' style={{ maxWidth: '100px', minWidth: '100px' }}>
                        <select className="form-select form-select-sm bg-secondary text-light border-secondary letraBtn"
                            value={genero} onChange={(e) => { setGenero(e.target.value); setBuscado(false); listaTiposCam.length == 0 ? obtenerTiposCampeonato() : '' }}>
                            <option value={''}>Genero</option>
                            <option value={'M'}>Masculino</option>
                            <option value={'F'}>Femenino</option>
                        </select>
                    </div>}
                    {tipo != 'D' && <div className='col' style={{ maxWidth: '130px', minWidth: '130px' }}>
                        <select className="form-select form-select-sm bg-secondary text-light border-secondary letraBtn"
                            value={idClub} onChange={(e) => { setIdClub(e.target.value) }}>
                            <option value={0}>Club?(Todos)</option>
                            {listaClubs.map((item, index) => {
                                return (
                                    <option value={item.idclub} key={index}>{item.nombre}</option>
                                )
                            })}
                        </select>
                    </div>}
                    <div className='col' style={{ maxWidth: '100px', minWidth: '100px' }}>
                        <button className='btn btn-sm btn-success letraBtn w-100' onClick={() => buscarCompetidores()}>
                            <i className="fa-solid fa-spinner "></i> Buscar
                        </button>
                    </div>
                    {hayLlaves === false && listaCompetidores.length !== 0 && tipo !== 'D' &&
                        <div className='col' style={{ maxWidth: '100px', minWidth: '100px' }}>
                            <button className='btn btn-sm btn-warning letraBtn w-100'
                                disabled={noValido}
                                onClick={() => GenerarLlaves()}>
                                <i className="fa-solid fa-network-wired"></i> Crear
                            </button>
                        </div>}
                    {hayLlaves && tipo !== 'D' && <div className='col' style={{ maxWidth: '110px', minWidth: '110px' }}>
                        <button className='btn btn-sm btn-primary letraBtn w-100' onClick={() => { setTipoM('L'); setTituloModal('Llaves Generadas'); setShowModal(true) }}>
                            <i className="fa-solid fa-network-wired"></i> Llaves
                        </button>
                    </div>}
                </div>
            </div>
            {buscado && listaCompetidores.length !== 0 && tipo != 'D' && <>
                <div className='container-fluid colorFiltro bg-gradient py-1'>
                    <div className='row g-1'>
                        <div className='col my-auto' style={{ maxWidth: '90px', minWidth: '90px' }}>
                            <div className='text-light letraMontserratr'>
                                Filtros
                            </div>
                        </div>
                        <div className='col' style={{ maxWidth: '130px', minWidth: '130px' }}>
                            <select className="form-select form-select-sm btn-dark letraBtn" value={idCategoria}
                                onChange={(e) => cambiarCategoria(e.target.value)}>
                                <option value={0}>Categoria ?</option>
                                {categorias.map((item, index) => {
                                    return (
                                        <option value={item.idcategoria} key={index}>{item.nombre}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className='col' style={{ maxWidth: '130px', minWidth: '130px' }}>
                            <select className="form-select form-select-sm btn-dark letraBtn" value={idSubCategoria}
                                onChange={(e) => cambiarSubCategoria(e.target.value)}>
                                <option value={0}>Sub Categoria ?</option>
                                {subCategorias.map((item, index) => {
                                    return (
                                        <option value={item.idsubcategoria} key={index}>{item.nombre}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className='col' style={{ maxWidth: '160px', minWidth: '160px' }}>
                            <div className="input-group input-group-sm">
                                <input type="text" className="form-control form-control-sm"
                                    placeholder="Buscar Competidor" id='competidor' onChange={() => buscarCompetidor()} />
                                <button className='btn btn-sm btn-danger m-0 p-0' onClick={() => { document.getElementById('competidor').value = ''; buscarCompetidor(); }}>
                                    <i className="fa-solid fa-delete-left fa-xl"></i>
                                </button>
                            </div>
                        </div>
                        <div className='col d-none' style={{ maxWidth: '160px', minWidth: '160px' }}>
                            <div className="input-group input-group-sm">
                                <input type="text" className="form-control form-control-sm"
                                    placeholder="Buscar CLUB" id='nombreClub' onChange={() => buscarClub()} />
                                <button className='btn btn-sm btn-danger m-0 p-0' onClick={() => { document.getElementById('nombreClub').value = ''; buscarClub(); }}>
                                    <i className="fa-solid fa-delete-left fa-xl"></i>
                                </button>
                            </div>
                        </div>
                        <div className='col' style={{ maxWidth: '140px', minWidth: '140px' }}>
                            <button className='btn btn-sm btn-success w-100' onClick={() => handleDownloadExcel()}>
                                <i className="fa-solid fa-file-excel"></i> Exportar excel </button>
                        </div>
                        <div className='col' style={{ maxWidth: '140px', minWidth: '140px' }}>
                            <button className='btn btn-sm btn-primary w-100' onClick={() => handleDownload()}>
                                <i className="fa-solid fa-file-pdf"></i> Generar Pdf</button>
                        </div>
                        <div className='col' style={{ maxWidth: '140px', minWidth: '140px' }}>
                            <button className='btn btn-sm btn-info w-100' onClick={() => generarTargetaComp()}>
                                <i className="fa-solid fa-address-card"></i> Generar Tarjeta</button>
                        </div>
                    </div>
                </div>
                <div className='container-fluid text-danger w-100 bg-light text-center fw-bold '>
                    Numero Competidores {listaCompetidores.length}
                </div>
                <div className='table-responsive py-2'>
                    <table className="table table-dark table-striped table-hover table-bordered" id='competidoresLista' >
                        <thead>
                            <tr className='text-center'>
                                <th scope="col">Estudiante</th>
                                <th scope="col">Datos</th>
                                <th scope="col">Genero</th>
                                <th scope="col">Datos Campeonato</th>
                                {tipo == 'R' && <th scope="col">Tipos Competencia</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {listaCompetidores.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td scope="row" className='col-1 col-md-4'>
                                            <Competidor user={item} /></td>
                                        <td className='col-3 col-md-2'>
                                            <div className='container-fluid p-0 m-0' style={{ fontSize: '16px' }}>
                                                <div className='letraMontserratr'>{'Edad: ' + item.edad + ' años'}</div>
                                                <div className='letraMontserratr'>{'Peso: ' + item.peso + ' kg'}</div>
                                                <div className='letraMontserratr'>{'Altura: ' + item.altura + ' m'}</div>
                                            </div>
                                        </td>
                                        <td className='my-auto col-2 col-md-1'>
                                            <div className='container-fluid letraMontserratr'>
                                                {item.genero === 'M' ? 'MASCULINO' : 'FEMENINO'}
                                            </div>
                                        </td>
                                        <td>
                                            <div className='container-fluid p-0 m-0' style={{ fontSize: '16px' }}>
                                                <div className='letraMontserratr' >{'GRADO: ' + item.grado}</div>
                                                <div className='letraMontserratr'>{'CATEGORIA: ' + item.nombrecategoria}</div>
                                                <div className='letraMontserratr'>{'SUB-CATEGORIA: ' + item.nombresubcategoria}</div>
                                                {(item.idsubcategoria == null || item.idcategoria == null || item.grado == null || item.cinturon == null) &&
                                                    <div className='badge bg-danger'>Inconcistencia</div>}
                                            </div>
                                        </td>
                                        {tipo == 'R' && renderTipoCmp(item)}
                                        <td className='d-none'>
                                            {item.idcategoria}
                                        </td>
                                        <td className='d-none'>
                                            {item.idsubcategoria}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div></>}
            {buscado && listaCompetidores.length !== 0 && tipo == 'D' &&
                <>
                    <div className='container-fluid text-danger w-100 bg-light text-center fw-bold '>
                        Numero Equipos {listaCompetidores.length}
                    </div>
                    <div className='table-responsive'>
                        <table className="table table-dark table-striped table-hover" id='competidoresLista'>
                            <tbody>
                                {listaCompetidores.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td className='my-auto' style={{ width: '150px' }}>
                                                {item.nombre}
                                            </td>
                                            <td>
                                                <textarea className="form-control" style={{ height: '150px' }}
                                                    disabled={true} value={UtilsBuffer.getText(item.descripcion)}></textarea>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </>}
            <Modal show={showModal} onHide={() => setShowModal(false)}
                size={'xl'}
                aria-labelledby="contained-modal-title-vcenter"
                contentClassName='bg-dark bg-gradient'>
                <Modal.Header bsPrefix='modal-header m-0 p-0 px-2 ' closeButton closeVariant='white'>
                    <Modal.Title >
                        <div className='text-light letraMontserratr mx-auto'>
                            <i className="fa-solid fa-network-wired fa-xl"></i> {tituloModal}
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body bsPrefix='modal-body'>
                    {tipoM === 'L' && tipo == 'C' && <PrincipalLlaves idcampeonato={idCampeonato} genero={genero} llaves={listaLlaves} tipoL={'E'} callback={() => console.log("jola")} />}
                    {tipoM === 'P' && <CompetidoresPdf categorias={categorias} listaCompetidores={listaCompetidores} campeonato={tituloo} tipo={tipo} idcampeonato={idCampeonato} listaTiposCam={listaTiposCam} />}
                    {tipoM === 'L' && tipo === 'R' && <PrincipalLlaveRom categorias={categorias} idcampeonato={idCampeonato} genero={genero} llaves={listaLlaves} tipo={tipo} tipoL={'E'} />}
                    {tipoM === 'L' && tipo === 'P' && <PrincipalLlavePoomse categorias={categorias} idcampeonato={idCampeonato} genero={genero} llaves={listaLlaves} tipo={tipo} tipoL={'E'} />}
                </Modal.Body>
            </Modal>

        </div>
    )
}

export default PrincipalListaCompetidor