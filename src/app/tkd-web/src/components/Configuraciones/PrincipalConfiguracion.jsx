import React, { useEffect, useState, useContext, createContext } from 'react'
import { ContextAplicacions } from '../Context/ContextAplicacion';
import { useNavigate } from 'react-router-dom';
import MsgUtils from '../utils/MsgUtils';
import UtilsCargador from '../utils/UtilsCargador';
import AddEditCategoria from './AddEditCategoria';
import Modal from 'react-bootstrap/Modal';
import PrincipalSubCategoria from './PrincipalSubCategoria';
import GradosConfig from './GradosConfig';
import Header from '../Header';
import { server } from '../utils/MsgUtils';
import MsgDialogo from '../utils/MsgDialogo';
import Configuraciones from '../PantallaPuntuacion/Configuraciones';
import ConfiguracionAreaKirugui from './ConfiguracionAreaKirugui';
import ConfiguracionAreaPoomse from './ConfiguracionAreaPoomse';

function PrincipalConfiguracion() {
  const navigate = useNavigate();
  const { userLogin, setLogin, setUserLogin, campeonato, setCampeonato, listaCampeonatos } = useContext(ContextAplicacions);
  const [ventana, setVentana] = useState(0);
  const [categorias, setCategorias] = useState([]);
  const [cargador, setCargador] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [actualizar, setActualizar] = useState(false);
  const [selectCategoria, setSelectCategoria] = useState({});
  const [genero, setGenero] = useState('M');
  const [showMessage, setShowMessage] = useState(false);
  const [tipo, setTipo] = useState('');
  const abrirSubCategoria = (dato) => {
    setSelectCategoria(dato);
    //setActualizar(!actualizar);
  }

  const editarCategoria = (dato) => {
    setSelectCategoria(dato);
    setTitulo("Editar Categoria " + dato.nombre);
    setShowModal(true);
  }

  const eliminarCategoria = (dato) => {
    fetch(`${server}/config/deleteCategoria`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        info: {
          dato
        }
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          console.log(data.ok);
          MsgUtils.msgCorrecto("Eliminado")
          setCategorias(categorias.filter((item) => item.idcategoria !== dato.idcategoria));
          setSelectCategoria({});
        } else {
          MsgUtils.msgError(data.error);
        }
        setShowMessage(false);
      })
      .catch(error => MsgUtils.msgError(error));
  }
  function cambiarEstadoCate(dato) {
    console.log("cambiando de estado")
    fetch(`${server}/config/cambiarEstadoCategoria`, {
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
  useEffect(() => {
    if(tipo=='') return;
    setCargador(true);
    fetch(`${server}/config/getCategoria`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        campeonato, genero,tipo
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          setSelectCategoria({});
          setCategorias(data.ok);
        } else {
          MsgUtils.msgError(data.error);
        }
        setCargador(false);
      })
      .catch(error => MsgUtils.msgError(error));
  }, [actualizar])
  useEffect(() => {
    var sessionActiva = JSON.parse(localStorage.getItem('login'));
    var cmp = JSON.parse(localStorage.getItem('campeonato'));

    if (sessionActiva !== null) {
      setCampeonato(cmp);
      setLogin(true);
      setUserLogin(sessionActiva);
      navigate("/configuracion", { replace: true });
    }
  }, [])
  return (
    <div>
      <Header />
      <UtilsCargador show={cargador} />
      <div className='container-fluid  bg-dark'>
        <div className="btn-group btn-group-sm">
          <button className={`btn btn-sm btn-gradient letraBtn ${ventana === 0 ? 'menuActivo' : 'btn-secondary'}`} onClick={() => { setVentana(0); setActualizar(!actualizar) }}>
            <i className="fa-solid fa-landmark"></i> Categorias
          </button>
          <button className={`btn btn-sm btn-gradient mx-2 letraBtn ${ventana === 1 ? 'menuActivo' : 'btn-secondary'}`} onClick={() => setVentana(1)}>
            <i className="fa-solid fa-graduation-cap"></i> Grados
          </button>
          <button className={`btn btn-sm btn-gradient letraBtn ${ventana === 2 ? 'menuActivo' : 'btn-secondary'}`} onClick={() => setVentana(2)}>
            <i className="fa-solid fa-person-military-to-person"></i> Kirugui
          </button>
          <button className={`btn btn-sm btn-gradient mx-2 letraBtn ${ventana === 3 ? 'menuActivo' : 'btn-secondary'}`} onClick={() => setVentana(3)}>
            <i className="fa-solid fa-person-circle-check"></i> Poomse
          </button>
        </div>
      </div>
      {ventana === 0 && <>
        <div className='container-fluid bg-dark bg-gradient py-1'>
          <div className='row row-cols g-2'>
            <div className='col' style={{ minWidth: '200px',maxWidth: '200px' }}>
              <div className="input-group input-group-sm" style={{ width: '200px' }}>
                <span className="input-group-text bg-transparent text-light border-dark letraBtn" >Genero</span>
                <select className="form-select form-select-sm bg-secondary text-light border-secondary letraBtn"
                  value={genero} onChange={(e) => { setGenero(e.target.value); setActualizar(!actualizar) }}>
                  <option value={'M'}>Masculino</option>
                  <option value={'F'}>Femenino</option>
                </select>
              </div>
            </div>
            <div className='col' style={{ minWidth: '200px',maxWidth: '200px' }}>
              <div className="input-group input-group-sm" style={{ width: '200px' }}>
                <span className="input-group-text bg-transparent text-light border-dark letraBtn" >Tipo</span>
                <select className="form-select form-select-sm btn-secondary" value={tipo}
                  onChange={(e) => { setTipo(e.target.value); setActualizar(!actualizar) }}>
                  <option value=''>Ninguno</option>
                  <option value="C">Combate</option>
                  <option value="P">Poomse</option>
                  <option value="D">Demostraciones</option>
                  <option value="R">Rompimiento</option>
                </select>
              </div>
            </div>
            <div className='col d-none' style={{ minWidth: '100px',maxWidth: '100px' }}>
              <button className='btn btn-sm btn-success btn-gradient'>
                Obtener
              </button>
            </div>
          </div>
        </div>
        <div className='container-fluid py-1 px-1'>
          <div className='row row-cols-1 row-cols-md-2 g-1'>
            <div className='col'>
              <div className='table-responsive'>
                <table className="table table-dark table-hover table-sm">
                  <thead>
                    <tr className='text-center'>
                      <th className="col-3">Categoria</th>
                      <th className="col-2">Edad Ini</th>
                      <th className="col-2">Edad Fin</th>
                      <th className="col-2">Estado</th>
                      <th className="col text-end">
                        {userLogin.tipo == 'A' && <button className='btn btn-sm btn-success bg-gradient'
                          onClick={() => { 
                            setSelectCategoria({}); 
                            setTitulo("Registrar Nueva Categoria"); 
                            setShowModal(true) }}>
                          <i className="fa-solid fa-circle-plus fa-fade fa-xl"></i> Agregar
                        </button>}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {categorias.map((item, index) => {
                      return (
                        <tr key={index} className={`text-center ${selectCategoria.idcategoria !== undefined && selectCategoria.idcategoria === item.idcategoria ? 'table-active' : ''}`}>
                          <th>{item.nombre}</th>
                          <td>{item.edadini}</td>
                          <td>{item.edadfin}</td>
                          <td>
                            <div className="form-check form-switch">
                              {userLogin.tipo == 'A' && <input className="form-check-input" type="checkbox"
                                checked={item.estado === 'P' ? false : true}
                                onChange={() => cambiarEstadoCate(item)} />}
                              <label className="form-check-label" ><span className={item.estado === 'P' ? 'badge bg-warning text-dark' : 'badge bg-success'}>{item.estado === 'P' ? 'No Llave' : 'Si Llave'}</span></label>
                            </div>
                          </td>
                          <td className='text-end'>
                            <div className='btn-group btn-group-sm'>
                              {userLogin.tipo == 'A' && <button className='btn btn-sm text-danger' onClick={() => { setShowMessage(true); setSelectCategoria(item) }}>
                                <i className="fa-solid fa-trash fa-xl"></i>
                              </button>}
                              {userLogin.tipo == 'A' && <button className='btn btn-sm text-warning' onClick={() => editarCategoria(item)}>
                                <i className="fa-solid fa-file-pen fa-xl"></i>
                              </button>}
                              <button className='btn btn-sm text-success' onClick={() => abrirSubCategoria(item)}>
                                <i className="fa-solid fa-chart-simple fa-xl"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            {selectCategoria.idcategoria !== undefined &&
              <div className='col'>
                <PrincipalSubCategoria selectCategoria={selectCategoria} tipo={userLogin.tipo} />
              </div>}
          </div>
        </div></>}
      {ventana === 1 &&
        <GradosConfig campeonato={campeonato} setCampeonato={setCampeonato} tipou={userLogin.tipo} />
      }
      {ventana === 2 && <ConfiguracionAreaKirugui />}
      {ventana === 3 && <ConfiguracionAreaPoomse />}
      <Modal show={showModal} onHide={() => setShowModal(false)}
        aria-labelledby="contained-modal-title-vcenter"
        contentClassName='bg-dark bg-gradient'>
        <Modal.Header closeButton closeVariant='white' bsPrefix='modal-header m-0 p-0 px-2 '>
          <Modal.Title >
            <div className='text-light letraMontserratr mx-auto'>
              {titulo}
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body bsPrefix='modal-header m-0 p-0'>
          <AddEditCategoria actualizar={actualizar} selectCategoria={selectCategoria} tipo={tipo}
            setActualizar={setActualizar} setShowModal={setShowModal} genero={genero} categorias={categorias} />
        </Modal.Body>
      </Modal>
      <MsgDialogo show={showMessage} msg='Esta seguro de Eliminar esta categoria' okFunction={() => eliminarCategoria(selectCategoria)} notFunction={() => setShowMessage(false)} />
    </div>
  )
}

export default PrincipalConfiguracion
