import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ContextAplicacions } from '../Context/ContextAplicacion';
import { downloadExcel } from 'react-export-table-to-excel';
import Header from '../Header'
import Competidor from '../RegistroCompetidor/Competidor';
import MsgUtils from '../utils/MsgUtils';
import UtilsCargador from '../utils/UtilsCargador'
const server = process.env.REACT_APP_SERVER;

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
    const header = ["Nombres", "Apellidos", "Edad", "Peso", "Altura", "Club", "Cinturon", "Grado", "Categoria", "Sub-Categoria"];

    function getListaFestival() {
        if (tipo !== '' && genero !== '') {
            setCargador(true);
            fetch(`${server}/competidor/getCompetidoresFestival`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify({ "idCampeonato": campeonato.idcampeonato, genero, tipo })
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
        if (genManual) {
            if (listaManual.length !== 0) {
                setListaCompetidores([...listaCompetidores, ...listaManual]);
                setListaManual([]);

            }
        }
        setSelectItem({});
        setGenManual(!genManual);
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
    function sacarDeListas(dato) {
        dato.estado = 'I'
        cambiarEstadoC(dato);
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
                    <div className='col' style={{ maxWidth: '160px' }}>
                        <select className="form-select form-select-sm btn-secondary letraBtn w-100"
                            value={tipo}
                            onChange={(e) => { setTipo(e.target.value); }}>
                            <option value=''>Tipo (Ninguno)</option>
                            <option value="C">Combate</option>
                            <option value="P">Poomse</option>
                            <option value="D">Demostraciones</option>
                            <option value="R">Rompimiento</option>
                        </select>
                    </div>
                    <div className='col' style={{ maxWidth: '160px' }}>
                        <select className="form-select form-select-sm bg-secondary text-light border-secondary letraBtn"
                            value={genero} onChange={(e) => { setGenero(e.target.value) }}>
                            <option value={''}>Genero</option>
                            <option value={'M'}>Masculino</option>
                            <option value={'F'}>Femenino</option>
                        </select>
                    </div>
                    <div className='col' style={{ maxWidth: '100px' }}>
                        <button className='btn btn-sm btn-success bg-gradient w-100' onClick={() => getListaFestival()}>
                            <i className="fa-solid fa-rotate-right fa-fade fa-xl"></i> Listar
                        </button>
                    </div>
                    <div className='col' style={{ minWidth: '150px', maxWidth: '150px' }}>
                        <button className='btn btn-sm btn-success w-100' onClick={() => handleDownloadExcel()}>
                            <i className="fa-solid fa-file-excel"></i> Exportar excel </button>
                    </div>
                    {listaCompetidores.length !== 0 &&
                        <div className='col' style={{ maxWidth: '130px' }}>
                            <button className={`btn btn-sm bg-gradient w-100 ${genManual ? 'btn-danger' : 'btn-primary'}`} onClick={() => GenerarLlaves()}>
                                <i className="fa-solid fa-network-wired"></i> {genManual ? 'Desactivar' : 'LLave Manual'}
                            </button>
                        </div>}
                    {listaCompetidores.length !== 0 &&
                        <div className='col' style={{ maxWidth: '130px' }}>
                            <button className='btn btn-sm btn-primary bg-gradient w-100' onClick={() => getListaFestival()}>
                                <i className="fa-solid fa-network-wired"></i> Llave Auto...
                            </button>
                        </div>}
                </div>
            </div>
            <div className='container-fluid text-danger '>
                Numero Estudiantes {listaCompetidores.length}
            </div>
            {<div className='table-responsive py-2'>
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
                                            <div className='letraMontserratr'>{'SUB-CATEGORIA: ' + item.nombresubcategoria}</div>
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
        </>
    )
}

export default PrincipalListaFestivales
