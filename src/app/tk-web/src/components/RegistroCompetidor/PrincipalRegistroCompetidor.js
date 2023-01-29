import React, { useEffect, useState } from 'react'
import UtilsCargador from '../utils/UtilsCargador';
import Header from '../Header';
import MsgUtils from '../utils/MsgUtils';
import Modal from 'react-bootstrap/Modal';
import AddEditCompetidor from './AddEditCompetidor';
import Competidor from './Competidor';
const server = process.env.REACT_APP_SERVER;

function PrincipalRegistroCompetidor() {
  const [titulo, setTitulo] = useState('');
  const [listaClubs, setListaClubs] = useState([]);
  const [club, setClub] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [tipo, setTipo] = useState('');
  const [genero, setGenero] = useState('');
  const [actualizar, setActualizar] = useState(false);
  const [idCampeonato, setIdCampeonato] = useState(0);
  const [listaCompetidores, setListaCompetidores] = useState([]);
  const [selectItem,setSelectItem] = useState({});
  const [cargador,setCargador] = useState(false);
  const editarUsuario=(dato)=>{
    setSelectItem(dato);
    setShowModal(true);
  }
  const eliminarUsuario=(dato)=>{
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
  function actualizarDatos(){
    setSelectItem({});
    setShowModal(false);
    setActualizar(!actualizar);
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
  }, [tipo, genero,club ,actualizar])
  useEffect(() => {
    var info = JSON.parse(localStorage.getItem('campeonato'));
    var user = JSON.parse(localStorage.getItem('login'));
    setTitulo(info.nombre);
    setIdCampeonato(info.idcampeonato);
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
      <div className='container-fluid bg-dark bg-gradient'>
        <div className='row g-1'>
          <div className='col-8 col-md-4 my-auto'>
            <div className='text-light letraMontserratr'>
              Registro Campeonato <u><b>{titulo}</b></u> del Club:
            </div>
          </div>
          <div className='col-4 col-md-2'>
            <select className="form-select form-select-sm bg-secondary text-light border-secondary"
              value={club} onChange={(e) => setClub(e.target.value)}>
              {listaClubs.map((item, index) => {
                return (
                  <option value={item.idclub} key={index}>{item.nombre}</option>
                )
              })}
            </select>
          </div>
          <div className='col-4 col-md-2'>
            <select className="form-select form-select-sm btn-secondary" value={tipo}
              onChange={(e) => setTipo(e.target.value)}>
              <option value=''>Tipo (Ninguno)</option>
              <option value="C">Combate</option>
              <option value="P">Poomse</option>
              <option value="CN">Cintas Negras</option>
              <option value="R">Rompimiento</option>
            </select>
          </div>
          <div className='col-4 col-md-2'>
            <select className="form-select form-select-sm bg-secondary text-light border-secondary"
              value={genero} onChange={(e) => setGenero(e.target.value)}>
              <option value={''}>Genero</option>
              <option value={'M'}>Masculino</option>
              <option value={'F'}>Femenino</option>
            </select>
          </div>
          <div className='col-8 col-md-2'>
            <div className="input-group input-group-sm">
              <input type="text" className="form-control form-control-sm" placeholder="Buscar Competidor" />
              <button className='btn btn-sm btn-danger m-0 p-0'>
                <i className="fa-solid fa-delete-left fa-xl"></i>
              </button>
            </div>
          </div>
          <div className='col col-md-2 text-start'>
            <button className='btn btn-sm btn-success bg-gradient '
              disabled={(genero !== '' && tipo !== '') ? false : true}
              onClick={() => setShowModal(true)}>
              Agregar <i className="fa-solid fa-user-plus fa-xl"></i>
            </button>
          </div>
        </div>
      </div>
      <div className='table-responsive'>
        <table className="table table-dark table-striped table-hover">
          <tbody>
            {listaCompetidores.map((item, index) => {
              return (
                <tr key={index}>
                  <th scope="row" className='col-1 col-md-6'><Competidor user={item} /></th>
                  <td className='col-3 col-md-2'>
                    <div className='container-fluid p-0 m-0' style={{ fontSize: '13px' }}>
                      <div className='letraMontserratr'>{'Edad: ' + item.edad}</div>
                      <div className='letraMontserratr'>{'Peso: ' + item.peso}</div>
                      <div className='letraMontserratr'>{'Altura: ' + item.altura}</div>
                    </div>
                  </td>
                  <td className='my-auto col-2 col-md-1'>{item.genero == 'M' ? 'MASCULINO' : 'FEMENINO'}</td>
                  <td>
                    <div className="btn-group" role="group" aria-label="Basic example">
                      <button type="button" className="btn btn-sm text-danger m-0 p-0"
                        onClick={()=>eliminarUsuario(item)}>
                        <i className="fa-solid fa-trash-can fa-xl"></i>
                      </button>
                      <button type="button" className="btn btn-sm text-warning m-0 p-0 mx-2"
                        onClick={()=>editarUsuario(item)}>
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
            tipo={tipo} actualizarDatos={actualizarDatos} generoee={genero}/>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default PrincipalRegistroCompetidor
