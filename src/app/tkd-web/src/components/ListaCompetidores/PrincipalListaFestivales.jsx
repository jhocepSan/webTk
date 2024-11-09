import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ContextAplicacions } from '../Context/ContextAplicacion';
import { downloadExcel } from 'react-export-table-to-excel';
import Header from '../Header';
import jsPDF from 'jspdf';
import Competidor from '../RegistroCompetidor/Competidor';
import MsgUtils from '../utils/MsgUtils';
import UtilsCargador from '../utils/UtilsCargador'
import { server } from '../utils/MsgUtils';
import MsgDialogo from '../utils/MsgDialogo';
import imgTK from '../../assets/tkd.png'
import UtilsExport from '../utils/UtilsExport';

function PrincipalListaFestivales() {
    const tableRef = useRef(null);
    const { setLogin, setUserLogin, campeonato, setCampeonato, setTitulo } = useContext(ContextAplicacions);
    const navigate = useNavigate();
    const [cargador, setCargador] = useState(false);
    const [genero, setGenero] = useState('');
    const [tipo, setTipo] = useState('');
    const [listaCompetidores, setListaCompetidores] = useState([]);
    const [genManual, setGenManual] = useState(false);
    const [listaManual, setListaManual] = useState([]);
    const [selectItem, setSelectItem] = useState({});
    const [actualizar, setActualizar] = useState(false);
    const [listaClubs, setListaClubs] = useState([]);
    const [idClub, setIdClub] = useState(0);
    const [listaTiposCam, setListaTiposCam] = useState([]);
    const [grados, setGrados] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const header = ["Nombres", "Apellidos", "Edad", "Peso", "Altura", "Club", "Cinturon", "Grado", "Categoria", "Sub-Categoria"];
    const [generado, setGenerado] = useState(false);
    const [showDialogo,setShowDialogo] = useState(false);
    function esDeTipo(dato, tipo) {
        if (dato.idtipocompetencia !== null) {
            var tipoc = dato.idtipocompetencia.split(':');
            var estado = tipoc.indexOf(tipo.idtipo.toString()) >= 0
            return estado
        } else {
            return false
        }
    }
    const generarTargetaComp=async()=>{
        setCargador(true);
        try {
            await UtilsExport.exportarTargetaCompetidor(listaCompetidores,tipo);
        } catch (error) {
            console.log(error.message);
            MsgUtils.msgError(error.message);
        }finally{
            setCargador(false);
        }
    }
    function sgenerarTargetaComp() {
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
            orientation: 'l',
            unit: 'mm',
            format: 'A4',
            putOnlyUsedFonts: true,
            floatPrecision: 16 // or "smart", default is 16
        }
        var doc = new jsPDF(optiones);
        var x = 6, numColum = 0, pagina = 1;
        var y = 6, numCard = 0;
        var width = doc.internal.pageSize.getWidth();
        var height = doc.internal.pageSize.getHeight();
        for (var est of listaCompetidores) {
            if (numColum <= 2) {
                doc.setTextColor(255, 0, 0);
                doc.setDrawColor(255, 0, 0);
                doc.setLineWidth(1.5);
                doc.line(x, y, x + 87, y, 'FD');
                doc.line(x, y - 0.5, x, y + 48, 'FD');
                doc.line(x + 87, y - 0.5, x + 87, y + 48, 'FD');
                doc.line(x, y + 47.5, x + 87, y + 47.5, 'FD');
                doc.setDrawColor(0, 0, 255);
                doc.setLineWidth(0.8);
                doc.line(x + 2, y, x + 87, y, 'FD');
                doc.line(x, y + 2, x, y + 48, 'FD');
                doc.setLineWidth(1.5);
                doc.line(x, y + 2, x + 2, y, 'FD');
                doc.setLineWidth(0.8);
                doc.line(x + 87, y - 0.5, x + 87, y + 48, 'FD');
                doc.line(x, y + 47.5, x + 87, y + 47.5, 'FD');
                y += 3;
                doc.setFontSize(9);
                doc.setTextColor(0, 0, 255);
                doc.setFont('arial','bold');
                doc.text('ASOCIACIÓN TRADICIONAL DE CLUBES DE', x + 6, y+2);
                doc.text('TAEKWONDO COCHABAMBA', x + 12, y + 6);
                doc.setTextColor(250, 193, 41);
                doc.setFontSize(12);
                doc.text('Tarjeta de competencia', x + 4, y + 13);
                doc.setFontSize(9);
                doc.setFont('arial','');
                doc.setTextColor(0, 0, 0);
                doc.text('Nombre.- ' + est.nombres + ' ' + est.apellidos, x + 3, y + 20);
                doc.text('Club.- ' + est.club, x + 3, y + 24);
                doc.text('Peso/kg.- ' + est.peso, x + 3, y + 28);
                doc.text('Grado.- ' + est.grado + ' - ' + est.cinturon, x + 3, y + 32);
                doc.text('Categoria.- ' + est.nombrecategoria, x + 3, y + 36);
                doc.setFontSize(13);
                doc.setTextColor(0, 0, 255);
                doc.setFont('arial','bold');
                doc.text(subtitulo, x + 34, y + 42);
                doc.setTextColor(0, 0, 0);
                doc.setDrawColor(0, 0, 0);
                doc.setLineWidth(0.8);
                doc.setFontSize(10);
                doc.line(x + 60, y + 34, x + 84, y + 34, 'FD')
                doc.text('Puesto', x + 68, y + 38);
                doc.addImage(imgTK, 'JPEG', x +71, y+2 , 14, 14);
                y += 47
                if (numCard < 3) {
                    numCard += 1
                } else {
                    numCard = 0
                    numColum += 1
                    x += 89
                    y = 6
                }
            } else {
                numColum = 0;
                pagina += 1;
                doc.addPage();
                doc.setPage(pagina);
                x = 6, y = 6;
            }
        }
        doc.save(cmpSelect.nombre.replace(' ', '') + subtitulo + 'FestivalTarjetas.pdf');
        setCargador(false);
    }
    function generarPdf() {
        var cmpSelect = JSON.parse(localStorage.getItem('campeonato'));
        var optiones = {
            orientation: 'p',
            unit: 'mm',
            format: 'a4',
            putOnlyUsedFonts: true,
            floatPrecision: 16 // or "smart", default is 16
        }
        var doc = new jsPDF(optiones);
        var x = 10;
        var y = 10;
        var width = doc.internal.pageSize.getWidth();
        var height = doc.internal.pageSize.getHeight();
        doc.setFontSize(13);
        doc.text(`Lista de Estudiantes Festival ${genero == 'M' ? 'MASCULINO' : 'FEMENINO'}`, x + 40, y);
        y += 7
        if (tipo == 'C' || tipo == 'P') {
            var listaFiltrada = listaCompetidores.sort(function (a, b) { return a.edad - b.edad });
            if (listaFiltrada.length !== 0) {
                doc.setFontSize(11);
                doc.line(x, y - 4, width - 10, y - 4, 'S');
                doc.text('Nombre Completo', x, y);
                doc.text('Edad', x + 80, y);
                doc.text('Grado', x + 93, y);
                doc.text('Cinturon', x + 136, y);
                doc.text('Club', x + 156, y);
                doc.line(x, y + 2, width - 10, y + 2, 'S');
                y = y + 7
                doc.setFontSize(9);
                for (var cmp of listaFiltrada) {
                    doc.text(cmp.nombres + ' ' + cmp.apellidos, x, y);
                    doc.text(cmp.edad.toString(), x + 80, y);
                    doc.text(cmp.grado, x + 93, y);
                    doc.text(cmp.cinturon, x + 136, y);
                    doc.text(cmp.club, x + 156, y);
                    doc.line(x, y + 1, width - 10, y + 1, 'S');
                    y = y + 7;
                    if (y >= height - 20) {
                        doc.addPage();
                        x = 10;
                        y = 10;
                        doc.setFontSize(11);
                        doc.line(x, y - 1, width - 10, y - 1, 'S');
                        doc.text('Nombre Completo', x, y);
                        doc.text('Edad', x + 80, y);
                        doc.text('Grado', x + 93, y);
                        doc.text('Cinturon', x + 136, y);
                        doc.text('Club', x + 156, y);
                        doc.line(x, y + 4, width - 10, y + 4, 'S');
                        y = y + 5
                    }
                }
            }
        } else if (tipo == 'R') {
            for (var cat of categorias) {
                for (var gr of grados) {
                    if (y >= height - 20) {
                        doc.addPage();
                        x = 10;
                        y = 10;
                    }
                    for (var rmp of listaTiposCam) {
                        if (y >= height - 30) {
                            doc.addPage();
                            x = 10;
                            y = 10;
                        }
                        var listaFiltrada = listaCompetidores.filter((dato) => dato.idcategoria == cat.idcategoria && dato.idgrado == gr.idgrado && esDeTipo(dato, rmp));
                        if (listaFiltrada.length !== 0) {
                            doc.setFontSize(12);
                            doc.text(`Nombre del grado: ${gr.nombre}`, x, y + 10);
                            doc.text(`Rompimiento: ${rmp.descripcion}`, x + 80, y + 10);
                            doc.text(`Categoria: ${cat.nombre} -> EDAD ${cat.edadini} - ${cat.edadfin} años`, x, y + 15);
                            doc.setFontSize(11);
                            doc.line(x, y + 17, width - 10, y + 17, 'S');
                            doc.text('Nombre Completo', x, y + 22);
                            doc.text('Edad', x + 80, y + 22);
                            doc.text('Grado', x + 93, y + 22);
                            doc.text('Cinturon', x + 136, y + 22);
                            doc.text('Club', x + 156, y + 22);
                            doc.line(x, y + 23, width - 10, y + 23, 'S');
                            y = y + 24
                            if (y >= height - 20) {
                                doc.addPage();
                                x = 10;
                                y = 10;
                            }
                            doc.setFontSize(9);
                            for (var cmp of listaFiltrada) {
                                doc.text(cmp.nombres + ' ' + cmp.apellidos, x, y + 5);
                                doc.text(cmp.edad.toString(), x + 80, y + 5);
                                doc.text(cmp.grado, x + 93, y + 5);
                                doc.text(cmp.cinturon, x + 136, y + 5);
                                doc.text(cmp.club, x + 156, y + 5);
                                doc.line(x, y + 6, width - 10, y + 6, 'S');
                                y = y + 7;
                                if (y >= height - 20) {
                                    doc.addPage();
                                    x = 10;
                                    y = 10;
                                }
                            }
                        }
                    }
                }
            }
        }
        doc.save(cmpSelect.nombre.replace(' ', '') + `Festival${genero == 'M' ? 'MASCULINO' : 'FEMENINO'}.pdf`);
    }
    function getListaFestival() {
        if (tipo !== '' && genero !== '') {
            setCargador(true);
            fetch(`${server}/competidor/getCompetidoresFestival`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify({ "idCampeonato": campeonato.idcampeonato, genero, tipo, idClub })
            })
                .then(res => res.json())
                .then(data => {
                    setCargador(false);
                    if (data.ok) {
                        console.log(data.ok);
                        setListaCompetidores(data.ok);
                    } else {
                        MsgUtils.msgError(data.error);
                    }
                })
                .catch(error => MsgUtils.msgError(error));
        } else {
            MsgUtils.msgError("Seleccione el tipo de competición y el genero, por favor...")
        }
    }
    function agregarListaManual() {
        if (selectItem) {
            listaManual.push(selectItem);
            setListaCompetidores(listaCompetidores.filter((item) => item.idcompetidor !== selectItem.idcompetidor));
            setSelectItem({});
        } else {
            MsgUtils.msgError("Seleccione de la lista de sin peleas.")
        }
    }
    function sacarListaManual() {
        if (selectItem) {
            setListaManual(listaManual.filter((item) => item.idcompetidor !== selectItem.idcompetidor));
            listaCompetidores.push(selectItem);
            setSelectItem({});
        } else {
            MsgUtils.msgError("Seleccione que estudiante sacar de la lista.")
        }
    }
    function GenerarLlaves() {
        if (tipo !== 'R') {
            if (genManual) {
                if (listaManual.length !== 0) {
                    setListaCompetidores([...listaCompetidores, ...listaManual]);
                    setListaManual([]);
                }
            }
            setSelectItem({});
            setGenManual(!genManual);
        } else {
            fetch(`${server}/competidor/generarLlaveRompimientoFestival`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify({ categorias, 'idCampeonato': campeonato.idcampeonato, genero, tipo })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.ok) {
                        setGenerado(true);
                        MsgUtils.msgCorrecto(data.ok);
                    } else {
                        MsgUtils.msgError(data.error);
                    }
                })
                .catch(error => MsgUtils.msgError(error));
        }
    }
    function crearLlaveManual() {
        fetch(`${server}/competidor/generateLLaveManual`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({})
        })
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    console.log(data.ok);
                } else {
                    MsgUtils.msgError(data.error);
                }
            })
            .catch(error => MsgUtils.msgError(error));
    }
    function cambiarEstadoC(dato) {
        fetch(`${server}/competidor/deleteCompetidor`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify(dato)
        })
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    setActualizar(!actualizar);
                } else {
                    MsgUtils.msgError(data.error);
                }
            })
            .catch(error => MsgUtils.msgError(error));
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
    function sacarDeListas(dato) {
        dato.estado = 'I'
        cambiarEstadoC(dato);
    }
    function obtenerTiposCampeonato(val) {
        var cmpSelect = JSON.parse(localStorage.getItem('campeonato'));
        fetch(`${server}/config/getTiposCampeonato`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({
                'idcampeonato': cmpSelect.idcampeonato, 'tipo': val
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data.ok)
                if (data.ok) {
                    setListaTiposCam(data.ok);
                } else {
                    MsgUtils.msgError(data.error);
                }
                setCargador(false);
            })
            .catch(error => MsgUtils.msgError(error));
    }
    function cambiarTipoCompetencia(valor) {
        console.log(valor)
        if (valor == 'R') {
            obtenerTiposCampeonato(valor);
            obtenerGrado(valor)
        }
        setTipo(valor);
    }
    function obtenerGrado(val) {
        fetch(`${server}/config/getGrados`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({
                info: {
                    'idcampeonato': campeonato.idcampeonato, 'tipo': val
                }
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.ok) {
                    setGrados(data.ok);
                    //setActualizar(!actualizar);
                } else {
                    MsgUtils.msgError(data.error);
                }
            })
            .catch(error => MsgUtils.msgError(error));
    }
    function getInformacionCategoria(genero) {
        fetch(`${server}/config/getConfiCategoriaFestival`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ 'idcampeonato': campeonato.idcampeonato, genero })
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
    function handleDownloadExcel() {
        var body = []
        var listafiltrada = listaCompetidores;
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
    useEffect(() => {
        var sessionActiva = JSON.parse(localStorage.getItem('login'));
        var cmp = JSON.parse(localStorage.getItem('campeonato'));
        if (sessionActiva !== null) {
            setTitulo('LISTA FESTIVAL')
            setCampeonato(cmp);
            setLogin(true);
            setUserLogin(sessionActiva);
            navigate("/listCompeFest", { replace: true });
        }
    }, [])
    useEffect(() => {
        if (listaClubs.length == 0) {
            setCargador(true);
            fetch(`${server}/club/getListaClubPuntuado`, {
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
    useEffect(() => {
        if (listaCompetidores.length !== 0) {
            getListaFestival()
        }
    }, [actualizar])
    return (
        <>
            <Header />
            <UtilsCargador show={cargador} />
            <div className='container-fluid bg-dark bg-gradient py-1'>
                <div className='row g-1'>
                    <div className='col' style={{ minWidth: '160px', maxWidth: '160px' }}>
                        <select className="form-select form-select-sm btn-secondary letraBtn w-100"
                            value={tipo}
                            onChange={(e) => { cambiarTipoCompetencia(e.target.value); }}>
                            <option value=''>Tipo (Ninguno)</option>
                            <option value="C">Combate</option>
                            <option value="P">Poomse</option>
                            <option value="R">Rompimiento</option>
                        </select>
                    </div>
                    <div className='col' style={{ minWidth: '160px', maxWidth: '160px' }}>
                        <select className="form-select form-select-sm bg-secondary text-light border-secondary letraBtn"
                            value={genero} onChange={(e) => { getInformacionCategoria(e.target.value); setGenero(e.target.value) }}>
                            <option value={''}>Genero</option>
                            <option value={'M'}>Masculino</option>
                            <option value={'F'}>Femenino</option>
                        </select>
                    </div>
                    <div className='col' style={{ minWidth: '150px', maxWidth: '150px' }}>
                        <select className="form-select form-select-sm bg-secondary text-light border-secondary letraBtn"
                            value={idClub} onChange={(e) => { setIdClub(e.target.value) }}>
                            <option value={0}>Club?(Todos)</option>
                            {listaClubs.map((item, index) => {
                                return (
                                    <option value={item.idclub} key={index}>{item.nombre}</option>
                                )
                            })}
                        </select>
                    </div>
                    <div className='col' style={{ minWidth: '100px', maxWidth: '100px' }}>
                        <button className='btn btn-sm btn-success bg-gradient w-100' onClick={() => getListaFestival()}>
                            <i className="fa-solid fa-rotate-right fa-fade fa-xl"></i> Listar
                        </button>
                    </div>
                    {listaCompetidores.length !== 0 &&
                        <div className='col' style={{ minWidth: '100px', maxWidth: '100px' }}>
                            <button className='btn btn-sm btn-success bg-gradient w-100' onClick={() => generarPdf()}>
                                <i className="fa-solid fa-file-pdf"></i> PDF
                            </button>
                        </div>}
                    {listaCompetidores.length !== 0 &&
                        <div className='col' style={{ minWidth: '160px', maxWidth: '160px' }}>
                            <button className='btn btn-sm btn-info bg-gradient w-100' 
                                id='generarTargetas'
                                onClick={() => generarTargetaComp()}>
                            <i className="fa-solid fa-address-card"></i> Generar Tarjetas
                            </button>
                        </div>}
                    <div className='col' style={{ minWidth: '150px', maxWidth: '150px' }}>
                        <button className='btn btn-sm btn-success w-100' onClick={() => handleDownloadExcel()}>
                            <i className="fa-solid fa-file-excel"></i> Exportar excel </button>
                    </div>
                    <div className='col' style={{ minWidth: '150px', maxWidth: '150px' }}>
                        <div className="input-group input-group-sm">
                            <input type="text" className="form-control form-control-sm"
                                placeholder="Buscar Competidor" id='competidor' onChange={() => buscarCompetidor()} />
                            <button className='btn btn-sm btn-danger m-0 p-0' onClick={() => { document.getElementById('competidor').value = ''; buscarCompetidor(); }}>
                                <i className="fa-solid fa-delete-left fa-xl"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='container-fluid text-danger w-100 bg-light text-center fw-bold '>
                Numero Competidores {listaCompetidores.length}
            </div>
            {<div className='table-responsive'>
                <table className="table table-dark table-hover table-bordered" id='competidoresLista' ref={tableRef}>
                    <thead>
                        <tr className='text-center'>
                            <th className="col-3">Estudiante</th>
                            <th className="col-2">Datos</th>
                            <th className="col-2">Genero</th>
                            <th className="col">Datos Campeonato</th>
                            <th className='col-1'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {listaCompetidores.map((item, index) => {
                            return (
                                <tr key={index} onClick={() => setSelectItem(item)}
                                    className={`${(genManual && selectItem.idcompetidor === item.idcompetidor) ? 'colorSelection' : ''}`}>
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
                                        <div className='container-fluid'>
                                            {item.genero === 'M' ? 'MASCULINO' : 'FEMENINO'}
                                        </div>
                                    </td>
                                    <td>
                                        <div className='container-fluid p-0 m-0' style={{ fontSize: '16px' }}>
                                            <div className='letraMontserratr' >{'GRADO: ' + item.grado}</div>
                                            <div className='letraMontserratr'>{'CATEGORIA: ' + item.nombrecategoria}</div>
                                        </div>
                                    </td>
                                    {tipo == 'R' && renderTipoCmp(item)}
                                    <td className='my-auto text-center'>
                                        <button className='btn text-danger' onClick={() => {setSelectItem(item);setShowDialogo(true)}}>
                                            <i className="fa-regular fa-circle-xmark fa-2xl"></i>
                                        </button>
                                    </td>
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
            </div>}
            {genManual &&
                <div className=''>
                    <div className='container-fluid text-center'>
                        <div className='row row-cols-2 g-0'>
                            <div className='col text-end'>
                                <button className='btn btn-sm' onClick={() => agregarListaManual()} style={{ fontSize: '40px' }}>
                                    <i className="fa-solid fa-circle-down" ></i>
                                </button>
                            </div>
                            <div className='col text-start'  >
                                <button className='btn btn-sm' onClick={() => sacarListaManual()} style={{ fontSize: '40px' }}>
                                    <i className="fa-solid fa-circle-up"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className={`table-responsive py-2 ${genManual ? 'tableIgual' : ''}`} >
                        <table className="table table-dark table-hover table-bordered">
                            <thead>
                                <tr className='text-center'>
                                    {listaManual.length < 2 && <th scope="col">Estudiante</th>}
                                    {listaManual.length >= 2 &&
                                        <th>
                                            <button className='btn btn-sm btn-success bg-gradient' onClick={() => crearLlaveManual()}>
                                                <i className="fa-solid fa-network-wired"></i> Guardar
                                            </button>
                                        </th>
                                    }
                                    <th scope="col">Datos</th>
                                    <th scope="col">Genero</th>
                                    <th scope="col">Datos Campeonato</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listaManual.map((item, index) => {
                                    return (
                                        <tr key={index} onClick={() => setSelectItem(item)}
                                            className={`${(genManual && selectItem.idcompetidor === item.idcompetidor) ? 'colorSelection' : ''}`}>
                                            <td scope="row" className='col-1 col-md-4'>
                                                <Competidor user={item} /></td>
                                            <td className='col-3 col-md-2'>
                                                <div className='container-fluid p-0 m-0' style={{ fontSize: '13px' }}>
                                                    <div className='letraMontserratr'>{'Edad: ' + item.edad + ' años'}</div>
                                                    <div className='letraMontserratr'>{'Peso: ' + item.peso + ' kg'}</div>
                                                    <div className='letraMontserratr'>{'Altura: ' + item.altura + ' m'}</div>
                                                </div>
                                            </td>
                                            <td className='my-auto col-2 col-md-1'>
                                                <div className='container-fluid'>
                                                    {item.genero === 'M' ? 'MASCULINO' : 'FEMENINO'}
                                                </div>
                                            </td>
                                            <td>
                                                <div className='container-fluid p-0 m-0' style={{ fontSize: '13px' }}>
                                                    <div className='letraMontserratr' >{'GRADO: ' + item.grado}</div>
                                                    <div className='letraMontserratr'>{'CATEGORIA: ' + item.nombrecategoria}</div>
                                                    <div className='letraMontserratr'>{'SUB-CATEGORIA: ' + item.nombresubcategoria}</div>
                                                </div>
                                            </td>
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
                    </div>
                </div>
            }
            <MsgDialogo show={showDialogo} msg={`Seguro de Eliminar a ${selectItem.nombres} ${selectItem.apellidos}`} okFunction={()=>{sacarDeListas(selectItem);setShowDialogo(false)}} notFunction={()=>{setShowDialogo(false);setSelectItem({})}}/>
        </>
    )
}

export default PrincipalListaFestivales
