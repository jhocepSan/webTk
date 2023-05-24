import React, { useContext, useEffect, useRef, useState } from 'react'
import Header from '../Header';
import UtilsCargador from '../utils/UtilsCargador';
import MsgUtils from '../utils/MsgUtils';
import Competidor from '../RegistroCompetidor/Competidor';
import { downloadExcel } from 'react-export-table-to-excel';
import { ContextAplicacions } from '../Context/ContextAplicacion';
import { useNavigate } from 'react-router-dom';
import {server} from '../utils/MsgUtils';

function PrincipalListaSinPelea() {
    const tableRef = useRef(null);
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
    const [genManual, setGenManual] = useState(false);
    const [selectItem, setSelectItem] = useState({});
    const [listaManual, setListaManual] = useState([]);
    const [actualizar, setActualizar] = useState(false);
    const [listaClubs,setListaClubs] = useState([]);
    const [idClub,setIdClub] = useState(0);
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
                if (txtValue.toUpperCase() === ('' + dato)) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    }
    function cambiarCategoria(i) {
        setIdCategoria(i);
        //setBuscado(false);
        /*var cat = categorias.filter((item) => item.idcategoria === parseInt(i));
        if (cat.length !== 0) {
            setSubCategorias(cat[0].SUBCATEGORIA);
            buscarCategoria(i, 5);
        } else {
            setIdSubCategoria(0);
            setSubCategorias([]);
            buscarCategoria('', 5);
        }*/
    }
    function cambiarSubCategoria(i) {
        setIdSubCategoria(i);
        if (i != 0) {
            buscarCategoria(i, 6);
        } else {
            buscarCategoria('', 6);
        }
    }
    function buscarCompetidores() {
        if (genero !== '' && tipo !== '') {
            fetch(`${server}/competidor/getCompetidorSinPelea`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify({ idCampeonato, genero, tipo,idCategoria,idClub })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.ok) {
                        console.log(data.ok);
                        setListaCompetidores(data.ok);
                        setBuscado(true);
                    } else {
                        MsgUtils.msgError(data.error);
                    }
                })
                .catch(error => MsgUtils.msgError(error));
        } else {
            MsgUtils.msgError("Elija el tipo y genero por favor")
        }
    }
    function GenerarLlaves() {
        if (genManual) {
            if (listaManual.length !== 0) {
                setListaCompetidores([...listaCompetidores, ...listaManual]);
                setListaManual([]);
                setActualizar(!actualizar);
            }
        }
        setSelectItem({});
        setGenManual(!genManual);
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
    function crearLlaveManual() {
        fetch(`${server}/competidor/generateLLaveManual`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ idCampeonato, genero, tipo, listaManual })
        })
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    MsgUtils.msgCorrecto(data.ok);
                    setListaManual([]);
                    setGenManual(false);
                    setActualizar(!actualizar);
                } else {
                    MsgUtils.msgError(data.error);
                }
            })
            .catch(error => MsgUtils.msgError(error));
    }
    function cambiarEstadoC(dato) {
        fetch(`${server}/competidor/deleteCompetidorSP`, {
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
    function sacarDeListas(dato) {
        dato.estado = 'I'
        cambiarEstadoC(dato);
    }
    useEffect(() => {
        if (genero != '') {
            getInformacionCategoria({ idcampeonato: idCampeonato, genero })
        }
    }, [genero, actualizar])
    useEffect(() => {
        var info = JSON.parse(localStorage.getItem('campeonato'));
        var sessionActiva = JSON.parse(localStorage.getItem('login'));
        setTituloo(info.nombre);
        setIdCampeonato(info.idcampeonato);
        if (sessionActiva !== null) {
            setTitulo('LISTA SIN PELEA')
            setCampeonato(info);
            setLogin(true);
            setUserLogin(sessionActiva);
            navigate("/listCompeSN", { replace: true });
        }
    }, [])
    useEffect(()=>{
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
    },[])
    return (
        <div>
            <Header />
            <UtilsCargador show={cargador} />
            <div className='container-fluid bg-dark bg-gradient py-1'>
                <div className='row g-2'>
                    <div className='col-8 col-md-3 my-auto'>
                        <div className='text-light letraMontserratr'>
                            Competidores Camp. {tituloo}
                        </div>
                    </div>
                    <div className='col' style={{ minWidth: '120px', maxWidth: '120px' }}>
                        <select className="form-select form-select-sm btn-secondary" value={tipo}
                            onChange={(e) => { setTipo(e.target.value); setBuscado(false) }}>
                            <option value=''>Tipo (Ninguno)</option>
                            <option value="C">Combate</option>
                            <option value="P">Poomse</option>
                            <option value="D">Demostraciones</option>
                            <option value="R">Rompimiento</option>
                        </select>
                    </div>
                    <div className='col' style={{ minWidth: '120px', maxWidth: '120px' }}>
                        <select className="form-select form-select-sm bg-secondary text-light border-secondary"
                            value={genero} onChange={(e) => { setGenero(e.target.value); setBuscado(false) }}>
                            <option value={''}>Genero</option>
                            <option value={'M'}>Masculino</option>
                            <option value={'F'}>Femenino</option>
                        </select>
                    </div>
                    <div className='col' style={{ maxWidth: '150px' }}>
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
                    <div className='col' style={{ minWidth: '170px', maxWidth: '170px' }}>
                        <select className="form-select form-select-sm btn-secondary" value={idCategoria}
                            onChange={(e) => cambiarCategoria(e.target.value)}>
                            <option value={0}>Categoria(TODOS) ?</option>
                            {categorias.map((item, index) => {
                                return (
                                    <option value={item.idcategoria} key={index}>{item.nombre}</option>
                                )
                            })}
                        </select>
                    </div>
                    <div className='col' style={{ minWidth: '120px', maxWidth: '120px' }}>
                        <button className='btn btn-sm btn-success w-100' onClick={() => buscarCompetidores()}>
                            <i className="fa-solid fa-spinner fa-xl"></i> Buscar
                        </button>
                    </div>
                    <div className='col' style={{ minWidth: '120px', maxWidth: '120px' }}>
                        <button className={`btn btn-sm bg-gradient  w-100 ${genManual ? 'btn-danger' : 'btn-warning'}`} onClick={() => GenerarLlaves()}>
                            <i className="fa-solid fa-network-wired"></i> {genManual ? 'Desactivar' : 'Crear'}
                        </button>
                    </div>
                </div>
            </div>
            {buscado && <>
                <div className='container-fluid colorFiltro bg-gradient py-1'>
                    <div className='row g-1'>
                        <div className='col' style={{ minWidth: '220px', maxWidth: '220px' }}>
                            <div className='text-light letraMontserratr'>
                                Buscar por nombre
                            </div>
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
                        <div className='col' style={{ minWidth: '150px', maxWidth: '150px' }}>
                            <button className='btn btn-sm btn-success' onClick={() => handleDownloadExcel()}>
                                <i className="fa-solid fa-file-excel"></i> Exportar excel </button>
                        </div>
                    </div>
                </div>
                <div className='container-fluid text-danger '>
                    Numero Estudiantes {listaCompetidores.length}
                </div>
                <div className={`table-responsive py-2 ${genManual ? 'tableIgual' : ''}`} >
                    <table className="table table-dark table-hover table-bordered" id='competidoresLista' ref={tableRef}>
                        <thead>
                            <tr className='text-center'>
                                <th scope="col">Estudiante</th>
                                <th scope="col">Datos</th>
                                <th scope="col">Genero</th>
                                <th scope="col">Datos Campeonato</th>
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
                                            <div className='container-fluid letraMontserratr'>
                                                {item.genero === 'M' ? 'MASCULINO' : 'FEMENINO'}
                                            </div>
                                        </td>
                                        <td>
                                            <div className='container-fluid p-0 m-0' style={{ fontSize: '16px' }}>
                                                <div className='letraMontserratr' >{'GRADO: ' + item.grado}</div>
                                                <div className='letraMontserratr'>{'CATEGORIA: ' + item.nombrecategoria}</div>
                                                <div className='letraMontserratr'>{'SUB-CATEGORIA: ' + item.nombresubcategoria}</div>
                                                {(item.idsubcategoria == null || item.idcategoria == null) &&
                                                    <div className='badge bg-danger'>Inconcistencia</div>}
                                            </div>
                                        </td>
                                        <td className='my-auto text-center'>
                                            <button className='btn text-danger' onClick={() => sacarDeListas(item)}>
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
                </div></>}
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
                                                    {(item.idsubcategoria == null || item.idcategoria == null) &&
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
                    </div>
                </div>
            }
        </div>
    )
}

export default PrincipalListaSinPelea