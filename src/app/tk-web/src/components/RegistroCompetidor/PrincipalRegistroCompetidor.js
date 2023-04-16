import React, { useContext, useEffect, useState } from 'react'
import UtilsCargador from '../utils/UtilsCargador';
import Header from '../Header';
import MsgUtils from '../utils/MsgUtils';
import Modal from 'react-bootstrap/Modal';
import AddEditCompetidor from './AddEditCompetidor';
import Competidor from './Competidor';
import { ContextAplicacions } from '../Context/ContextAplicacion';
import { useNavigate } from 'react-router-dom';
const server = process.env.REACT_APP_SERVER;

function PrincipalRegistroCompetidor() {
  const { setLogin, setUserLogin, campeonato, setCampeonato, setTitulo,userLogin } = useContext(ContextAplicacions);
  const navigate = useNavigate();
  const [cmp, setCmp] = useState('');
  const [listaClubs, setListaClubs] = useState([]);
  const [club, setClub] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [tipo, setTipo] = useState('');
  const [genero, setGenero] = useState('');
  const [actualizar, setActualizar] = useState(false);
  const [idCampeonato, setIdCampeonato] = useState(0);
  const [listaCompetidores, setListaCompetidores] = useState([]);
  const [selectItem, setSelectItem] = useState({});
  const [cargador, setCargador] = useState(false);
  const editarUsuario = (dato) => {
    setSelectItem(dato);
    setShowModal(true);
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
  const eliminarUsuario = (dato) => {
    dato.estado = 'E'
    cambiarEstadoC(dato);
  }
  function cambiarEstado(dato) {
    if (dato.estado === 'P') {
      dato.estado = 'A';
    } else {
      dato.estado = 'P';
    }
    cambiarEstadoC(dato);
  }
  function actualizarDatos() {
    setSelectItem({});
    setShowModal(false);
    setActualizar(!actualizar);
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
        var valor=td.getElementsByTagName('div')[1].innerHTML;        
        if (valor.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }
  useEffect(() => {
    if (tipo !== '' && genero !== '') {
      setCargador(true);
      fetch(`${server}/competidor/getCompetidores`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({
          idCampeonato, tipo, genero, club
        })
      })
        .then(res => res.json())
        .then(data => {
          if (data.ok) {
            setListaCompetidores(data.ok);
          } else {
            MsgUtils.msgError(data.error);
          }
          setCargador(false);
        })
        .catch(error => MsgUtils.msgError(error));
    }
  }, [tipo, genero, club, actualizar])
  useEffect(() => {
    var info = JSON.parse(localStorage.getItem('campeonato'));
    var user = JSON.parse(localStorage.getItem('login'));
    if (user !== null) {
      setCmp(info.nombre);
      setIdCampeonato(info.idcampeonato);
      setTitulo('Registro Competidor')
      setCampeonato(info);
      setLogin(true);
      setUserLogin(user);
      navigate("/regCompe", { replace: true });
  }
    fetch(`${server}/club/getListaClub`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          setListaClubs(data.ok);
          setClub(user.idclub);
        } else {
          MsgUtils.msgError(data.error);
        }
      })
      .catch(error => MsgUtils.msgError(error));
  }, [])
  return (
    <>
      <Header />
      <UtilsCargador show={cargador} />
      <div className='container-fluid bg-dark bg-gradient py-1'>
        <div className='row g-1'>
          <div className='col-12 col-md-4 my-auto'>
            <div className='text-light letraMontserratr'>
              Registro Campeonato <u><b>{cmp}</b></u> del Club:
            </div>
          </div>
          <div className='col' style={{maxWidth:'140px',minWidth:'140px'}}>
            <select className="form-select form-select-sm bg-secondary text-light border-secondary"
              value={club} onChange={(e) => setClub(e.target.value)} disabled={userLogin.tipo=='A'?false:true}>
              {listaClubs.map((item, index) => {
                return (
                  <option value={item.idclub} key={index}>{item.nombre}</option>
                )
              })}
            </select>
          </div>
          <div className='col' style={{maxWidth:'130px',minWidth:'130px'}}>
            <select className="form-select form-select-sm btn-secondary" value={tipo}
              onChange={(e) => setTipo(e.target.value)}>
              <option value=''>Tipo (Ninguno)</option>
              <option value="C">Combate</option>
              <option value="P">Poomse</option>
              <option value="D">Demostraciones</option>
              <option value="R">Rompimiento</option>
            </select>
          </div>
          <div className='col' style={{maxWidth:'120px',minWidth:'120px'}}>
            <select className="form-select form-select-sm bg-secondary text-light border-secondary"
              value={genero} onChange={(e) => setGenero(e.target.value)}>
              <option value={''}>Genero</option>
              <option value={'M'}>Masculino</option>
              <option value={'F'}>Femenino</option>
            </select>
          </div>
          <div className='col' style={{maxWidth:'160px',minWidth:'160px'}}>
            <div className="input-group input-group-sm">
              <input type="text" className="form-control form-control-sm"
                placeholder="Buscar Competidor" id='competidor' onChange={() => buscarCompetidor()} />
              <button className='btn btn-sm btn-danger m-0 p-0' onClick={() => {document.getElementById('competidor').value = '';buscarCompetidor();}}>
                <i className="fa-solid fa-delete-left fa-xl"></i>
              </button>
            </div>
          </div>
          <div className='col text-start' style={{maxWidth:'120px',minWidth:'120px'}}>
            <button className='btn btn-sm btn-success bg-gradient '
              disabled={(genero !== '' && tipo !== '') ? false : true}
              onClick={() => setShowModal(true)}>
              Agregar <i className="fa-solid fa-user-plus fa-xl"></i>
            </button>
          </div>
        </div>
      </div>
      <div className='table-responsive'>
        <table className="table table-dark table-striped table-hover" id='competidoresLista'>
          <tbody>
            {listaCompetidores.map((item, index) => {
              return (
                <tr key={index}>
                  <td scope="row" className='col-1 col-md-6'><Competidor user={item} /></td>
                  <td className='col-3 col-md-2'>
                    <div className='container-fluid p-0 m-0' style={{ fontSize: '16px' }}>
                      <div className='letraMontserratr' id='nombre'>{'Edad: ' + item.edad + ' años'}</div>
                      <div className='letraMontserratr'>{'Peso: ' + item.peso + ' kg'}</div>
                      <div className='letraMontserratr'>{'Altura: ' + item.altura + ' m'}</div>
                    </div>
                  </td>
                  <td className='my-auto col-2 col-md-1'>
                    <div className='container-fluid'>
                      {item.genero === 'M' ? 'MASCULINO' : 'FEMENINO'}
                    </div>
                    {userLogin.tipo=='A'==<div className='container-fluid d-none'>
                      <div className="form-check form-switch">
                        <input className="form-check-input" type="checkbox"
                          checked={item.estado === 'P' ? false : true}
                          onChange={() => cambiarEstado(item)} />
                        <label className="form-check-label" ><span className={item.estado === 'P' ? 'badge bg-warning' : 'badge bg-success'}>{item.estado === 'P' ? 'COMPETIRA?' : 'COMPETIDOR'}</span></label>
                      </div>
                    </div>}
                  </td>
                  <td>
                    <div className="btn-group" role="group" aria-label="Basic example">
                      <button type="button" className="btn btn-sm text-danger m-0 p-0 d-none"
                        onClick={() => eliminarUsuario(item)}>
                        <i className="fa-solid fa-trash-can fa-xl"></i>
                      </button>
                      <button type="button" className="btn btn-sm text-warning m-0 p-0 mx-2 d-none"
                        onClick={() => editarUsuario(item)}>
                        <i className="fa-solid fa-pen-to-square fa-xl"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}

          </tbody>
        </table>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}
        aria-labelledby="contained-modal-title-vcenter"
        contentClassName='bg-dark bg-gradient'>
        <Modal.Header closeButton closeVariant='white' bsPrefix='modal-header m-0 p-0 px-2 '>
          <Modal.Title >
            <div className='text-light letraMontserratr mx-auto'>
              <i className="fa-solid fa-user-plus fa-xl"></i> Competidor ...
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddEditCompetidor listaClubs={listaClubs} selectItem={selectItem} club={club}
            tipo={tipo} actualizarDatos={actualizarDatos} generoee={genero} />
        </Modal.Body>
      </Modal>
    </>
  )
}

export default PrincipalRegistroCompetidor
