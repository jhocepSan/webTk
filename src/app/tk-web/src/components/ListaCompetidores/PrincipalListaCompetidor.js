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
const server = process.env.REACT_APP_SERVER;

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
                    console.log(data.ok);
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
                    console.log(data.ok);
                    setListaLlaves(data.ok);
                    if (data.ok.length !== 0) {
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
        if (genero !== '' && tipo !== '') {
            setCargador(true);
            fetch(`${server}/competidor/getCompetidorClasificado`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify({ idCampeonato, genero, tipo })
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
        } else {
            MsgUtils.msgError("Elija el tipo y el genero para buscar")
        }
    }
    function GenerarLlaves() {
        console.log("generar llaves")
        if (tipo !== '' && genero !== '') {
            setCargador(true);
            if (listaCompetidores.length !== 0) {
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
        setTipoM('P');
        setTituloModal('Clasificación de Competidores');
        setShowModal(true);
    };
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
                    <div className='col-4 col-md-2'>
                        <select className="form-select form-select-sm btn-secondary letraBtn" value={tipo}
                            onChange={(e) => { setTipo(e.target.value); setBuscado(false) }}>
                            <option value=''>Tipo (Ninguno)</option>
                            <option value="C">Combate</option>
                            <option value="P">Poomse</option>
                            <option value="D">Demostraciones</option>
                            <option value="R">Rompimiento</option>
                        </select>
                    </div>
                    <div className='col-4 col-md-2'>
                        <select className="form-select form-select-sm bg-secondary text-light border-secondary letraBtn"
                            value={genero} onChange={(e) => { setGenero(e.target.value); setBuscado(false) }}>
                            <option value={''}>Genero</option>
                            <option value={'M'}>Masculino</option>
                            <option value={'F'}>Femenino</option>
                        </select>
                    </div>
                    <div className='col-4 col-md-1'>
                        <button className='btn btn-sm btn-success letraBtn' onClick={() => buscarCompetidores()}>
                            <i className="fa-solid fa-spinner "></i> Buscar
                        </button>
                    </div>
                    {hayLlaves === false && listaCompetidores.length !== 0 &&
                        <div className='col-4 col-md-1'>
                            <button className='btn btn-sm btn-warning letraBtn'
                                disabled={noValido}
                                onClick={() => GenerarLlaves()}>
                                <i className="fa-solid fa-network-wired"></i> Crear
                            </button>
                        </div>}
                    {hayLlaves && <div className='col-4 col-md-1'>
                        <button className='btn btn-sm btn-primary letraBtn' onClick={() => { setTipoM('L'); setTituloModal('Llaves Generadas'); setShowModal(true) }}>
                            <i className="fa-solid fa-network-wired"></i> Llaves
                        </button>
                    </div>}
                </div>
            </div>
            {buscado && <>
                <div className='container-fluid colorFiltro bg-gradient py-1'>
                    <div className='row g-1'>
                        <div className='col-3 col-md-1 my-auto'>
                            <div className='text-light letraMontserratr'>
                                Filtros
                            </div>
                        </div>
                        <div className='col-4 col-md-2'>
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
                        <div className='col-4 col-md-2'>
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
                        <div className='col-8 col-md-2'>
                            <div className="input-group input-group-sm">
                                <input type="text" className="form-control form-control-sm"
                                    placeholder="Buscar Competidor" id='competidor' onChange={() => buscarCompetidor()} />
                                <button className='btn btn-sm btn-danger m-0 p-0' onClick={() => { document.getElementById('competidor').value = ''; buscarCompetidor(); }}>
                                    <i className="fa-solid fa-delete-left fa-xl"></i>
                                </button>
                            </div>
                        </div>
                        <div className='col-6 col-md-2'>
                            <button className='btn btn-sm btn-success' onClick={() => handleDownloadExcel()}>
                                <i className="fa-solid fa-file-excel"></i> Exportar excel </button>
                        </div>
                        <div className='col-6 col-md-2'>
                            <button className='btn btn-sm btn-success' onClick={() => handleDownload()}>
                                <i className="fa-solid fa-file-pdf"></i> Generar Pdf</button>
                        </div>
                    </div>
                </div>
                <div className='table-responsive py-2'>
                    <table className="table table-dark table-striped table-hover table-bordered" id='competidoresLista' >
                        <thead>
                            <tr className='text-center'>
                                <th scope="col">Estudiante</th>
                                <th scope="col">Datos</th>
                                <th scope="col">Genero</th>
                                <th scope="col">Datos Campeonato</th>
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
                    {tipoM === 'L' && <PrincipalLlaves idcampeonato={idCampeonato} genero={genero} llaves={listaLlaves} />}
                    {tipoM === 'P' && <CompetidoresPdf categorias={categorias} listaCompetidores={listaCompetidores} campeonato={tituloo} tipo={tipo} idcampeonato={idCampeonato}/>}
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default PrincipalListaCompetidor