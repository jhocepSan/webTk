import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ContextAplicacions } from '../Context/ContextAplicacion';
import Header from '../Header';
import Competidor from '../RegistroCompetidor/Competidor';
import MsgUtils from '../utils/MsgUtils';
import UtilsCargador from '../utils/UtilsCargador';
import Modal from 'react-bootstrap/Modal';
import { server } from '../utils/MsgUtils';
import SingUp from '../loginUser/SingUp';
import MsgDialogo from '../utils/MsgDialogo';

function AdminUsuario() {
    const navigate = useNavigate();
    const { setLogin, setUserLogin, campeonato, setCampeonato, setTitulo } = useContext(ContextAplicacions);
    const [cargador, setCargador] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const [selectItem, setSelectItem] = useState({});
    const [actualizar, setActualizar] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [tipoModal, setTipoModal] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    function getEstadoUsuario(dato) {
        var descripcion = ''
        if (dato.estado == 'A') {
            descripcion = 'Administrador en el sistema TKD';
        } else if (dato.estado == 'I') {
            descripcion = 'Invitado en el sistema TKD';
        } else if (dato.estado == 'P') {
            descripcion = 'Inactivo en el sistema TKD';
        } else if (dato.estado == 'K') {
            descripcion = 'Kiosanin en el sistema TKD';
        }
        return (<div className='letraMontserratr'>{descripcion}</div>)
    }
    function cambiarEstadoUser(item, estado) {
        var usuarioSelec = null
        if (item == null) {
            usuarioSelec = selectItem;
        } else {
            usuarioSelec = item;
        }
        usuarioSelec.estado = estado;
        fetch(`${server}/usuario/cambiarEstadoUsuario`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify(usuarioSelec)
        })
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    setSelectItem({});
                    setShowModal(false);
                    setActualizar(!actualizar);
                } else {
                    MsgUtils.msgError(data.error);
                }
                setShowMessage(false);
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
    function cambiarEstadoAlbitro(dato) {
        if (dato.albitro == 'A') {
            dato.albitro = 'I';
        } else {
            dato.albitro = 'A';
        }
        fetch(`${server}/usuario/cambiarEstadoAlbitro`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ 'estado': dato.albitro, 'idusuario': dato.idusuario })
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
    useEffect(() => {
        setCargador(true);
        var sessionActiva = JSON.parse(localStorage.getItem('login'));
        var cmp = JSON.parse(localStorage.getItem('campeonato'));
        if (sessionActiva !== null) {
            setTitulo('ADMINISTAR USUARIOS')
            setCampeonato(cmp);
            setLogin(true);
            setUserLogin(sessionActiva);
            navigate("/adminUser", { replace: true });
        }
        fetch(`${server}/usuario/getUsuarios`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
        })
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    console.log(data.ok);
                    setUsuarios(data.ok);
                } else {
                    MsgUtils.msgError(data.error);
                }
                setCargador(false);
            })
            .catch(error => MsgUtils.msgError(error));
    }, [actualizar])
    return (
        <div>
            <Header />
            <div className='container-fluid colorFiltro bg-gradient py-1'>
                <div className='row g-1'>
                    <div className='col' style={{ minWidth: '170px', maxWidth: '170px' }}>
                        <div className='text-light letraMontserratr'>
                            Buscar por nombre
                        </div>
                    </div>
                    <div className='col' style={{ minWidth: '170px', maxWidth: '170px' }}>
                        <div className="input-group input-group-sm">
                            <input type="text" className="form-control form-control-sm"
                                placeholder="Buscar Competidor" id='competidor' onChange={() => buscarCompetidor()} />
                            <button className='btn btn-sm btn-danger m-0 p-0' onClick={() => { document.getElementById('competidor').value = ''; buscarCompetidor(); }}>
                                <i className="fa-solid fa-delete-left fa-xl"></i>
                            </button>
                        </div>
                    </div>
                    <div className='col' style={{ minWidth: '130px', maxWidth: '130px' }}>
                        <button className='btn btn-sm btn-success bg-gradient w-100'
                            onClick={() => { setSelectItem(null); setTipoModal('N'); setShowModal(true) }}>
                            <i className="fa-solid fa-user-plus"></i> Nuevo
                        </button>
                    </div>
                </div>
            </div>
            <div className='container-fluid text-center bg-light bg-gradient text-danger fw-bold'>
                {`Numero de Usuarios del sistema: ${usuarios.length}`}
            </div>
            {cargador == false &&
                <div className='table-responsive'>
                    <table className="table table-dark table-hover table-bordered table-striped" id='competidoresLista' >
                        <thead>
                            <tr className='text-center'>
                                <th className="col-3">Usuario Sistema</th>
                                <th className="col-2">Tipo Usuario</th>
                                <th className="col-2">Es Álbitro</th>
                                <th className='col-2'></th>
                                <th className='col'></th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map((item, index) => {
                                return (
                                    <tr key={index} >
                                        <td scope="row" className='col-1 col-md-4'>
                                            <Competidor user={item} tipo={'U'} /></td>
                                        <td className='col-3 col-md-2 '>
                                            <div className='container-fluid p-0 m-0 text-center' style={{ fontSize: '16px' }}>
                                                {getEstadoUsuario(item)}
                                            </div>
                                        </td>
                                        <td>
                                            <button className='btn btn-sm letraBtn bg-gradient btn-warning w-100'
                                                onClick={() => { setTipoModal('E'); setSelectItem(item); setShowModal(true); }}>
                                                <i className="fa-solid fa-user-gear"></i> Cambiar Estado
                                            </button>
                                        </td>
                                        <td className='my-auto col-2 col-md-1 '>
                                            <div className="form-check form-switch text-center">
                                                <input className="form-check-input" type="checkbox"
                                                    checked={item.albitro === 'I' ? false : true}
                                                    onChange={() => cambiarEstadoAlbitro(item)} />
                                                <label className="form-check-label letraMontserratr" >
                                                    <span className={item.albitro === 'I' ? 'badge bg-danger' : 'badge bg-success'}>
                                                        {item.albitro === 'I' ? 'No es Álbitro' : 'Si es Álbitro'}
                                                    </span>
                                                </label>
                                            </div>
                                        </td>
                                        <td className='my-auto text-end'>
                                            <div className="btn-group" role="group" aria-label="Basic example">
                                                <button className='btn text-warning' onClick={() => { setSelectItem(item); setTipoModal('M'); setShowModal(true); }}>
                                                    <i className="fa-solid fa-user-pen fa-xl"></i>
                                                </button>
                                                <button className='btn text-danger' onClick={() => { setSelectItem(item); setShowMessage(true); }}>
                                                    <i className="fa-solid fa-trash-can fa-xl"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>}
            <UtilsCargador show={cargador} />
            <Modal show={showModal} onHide={() => setShowModal(false)}
                aria-labelledby="contained-modal-title-vcenter"
                contentClassName='bg-dark bg-gradient'>
                <Modal.Header closeButton closeVariant='white' bsPrefix='modal-header m-0 p-0 px-2 '>
                    <Modal.Title >
                        {tipoModal == 'E' && <div className='text-light letraMontserratr mx-auto'>
                            Cambiar tipo de Usuario
                        </div>}
                        {tipoModal == 'N' && <div className='text-light letraMontserratr mx-auto'>
                            Crear Nuevo Usuario
                        </div>}
                        {tipoModal == 'M' && <div className='text-light letraMontserratr mx-auto'>
                            Editar Usuario
                        </div>}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body bsPrefix='modal-header m-0 p-0'>
                    {tipoModal == 'E' && <div className='container-fluid py-2'>
                        {selectItem &&
                            <div className='text-light letraMontserratr text-center'>
                                {selectItem.nombres + ' ' + selectItem.apellidos}
                            </div>}
                        <ul className="list-group list-group-sm">
                            <li className="list-group-item m-0 p-0">
                                <button className={`btn btn-sm w-100 letraBtn bg-gradient ${selectItem.estado == 'A' ? 'btn-success' : ''}`}
                                    onClick={() => cambiarEstadoUser(null, 'A')}>
                                    Administrador
                                </button>
                            </li>
                            <li className="list-group-item m-0 p-0">
                                <button className={`btn btn-sm w-100 letraBtn bg-gradient ${selectItem.estado == 'K' ? 'btn-success' : ''}`}
                                    onClick={() => cambiarEstadoUser(null, 'K')}>
                                    KIOSANIN
                                </button>
                            </li>
                            <li className="list-group-item m-0 p-0">
                                <button className={`btn btn-sm w-100 letraBtn ${selectItem.estado == 'P' ? 'btn-success' : ''}`}
                                    onClick={() => cambiarEstadoUser(null, 'P')}>
                                    Inactivo
                                </button>
                            </li>
                            <li className="list-group-item m-0 p-0">
                                <button className={`btn btn-sm w-100 letraBtn ${selectItem.estado == 'I' ? 'btn-success' : ''}`}
                                    onClick={() => cambiarEstadoUser(null, 'I')}>
                                    Invitado
                                </button>
                            </li>
                        </ul>
                    </div>}
                    {tipoModal != 'E' && <SingUp setCargador={setCargador} tipoModal={tipoModal} setActualizar={setActualizar}
                        actualizar={actualizar} setShowModal={setShowModal} selectItem={selectItem} setSelectItem={setSelectItem} />}
                </Modal.Body>
            </Modal>
            <MsgDialogo show={showMessage} msg='Esta seguro de Eliminar EL CLUB' okFunction={() => cambiarEstadoUser(selectItem, 'E')} notFunction={() => setShowMessage(false)} />
        </div>
    )
}

export default AdminUsuario
