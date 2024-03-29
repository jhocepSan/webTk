import React, { useEffect, useState, useContext } from 'react';
import { ContextAplicacions } from '../Context/ContextAplicacion';
import { useNavigate } from 'react-router-dom';
import MsgUtils from '../utils/MsgUtils';
import UtilsBuffer from '../utils/UtilsBuffer';
import AddEditClub from './AddEditClub';
import Modal from 'react-bootstrap/Modal';
import Header from '../Header';
import UtilsCargador from '../utils/UtilsCargador';
import { server } from '../utils/MsgUtils';
import MsgDialogo from '../utils/MsgDialogo';
import axios from 'axios';

function PrincipalRegistroClub() {
  const navigate = useNavigate();
  const { setLogin, setUserLogin } = useContext(ContextAplicacions);
  const [listaClubs, setListaClubs] = useState([]);
  const [actualizar, setActualizar] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [clubSelect, setClubSelect] = useState({});
  const [cargador, setCargador] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const eliminarClub = (clb) => {
    fetch(`${server}/club/deleteClub`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        info: clb
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          console.log(data.ok);
        } else {
          MsgUtils.msgError(data.error);
        }
        setShowMessage(false);
        setActualizar(!actualizar);
      })
      .catch(error => MsgUtils.msgError(error));
  }
  function updateClub(club,idImg) {
    fetch(`${server}/club/updateClubImg`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({club,idImg})
    })
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          console.log(data.ok);
          //setCargador(false);
        } else {
          MsgUtils.msgError(data.error);
        }
        setActualizar(!actualizar);
      })
      .catch(error => MsgUtils.msgError(error));
  }
  const cargarFoto = (e, tipo, club) => {
    setCargador(true);
    var archiv = e.target.files[0];
    console.log(archiv)
    if (archiv.size / 1000000 < 3.5) {
      var formData = new FormData()
      formData.append('FILE1', new Blob([archiv], { contentType: 'application/octet-stream', contentTransferEncoding: 'binary' }), archiv.name + "." + tipo + "." + club);
      console.log(formData)
      try {
        axios.post(`${server}/usuario/cargarAdjunto`, formData, {
          'Accept': 'application/json',
          'content-type': 'multipart/form-data'
        }).then(res => {
          console.log(res.data);
          if (res.data.ok) {
            updateClub(club, res.data.ok);
            MsgUtils.msgCorrecto("Imagen Cargada Correctamente")
          } else {
            setCargador(false);
            MsgUtils.msgError(res.data.error)
          }
        }).catch(error => {
          //MsgUtils.msgError(JSON.parse(error.request.response).error);
          console.log(error.message);
          setCargador(false);
        })
      } catch (error) {
        MsgUtils.msgError(error.message);
        console.error('Error al subir el archivo !!');
      }
    } else {
      setCargador(false);
      MsgUtils.msgError("Coloque Imagen < 3.5 Megas")
    }
  }
  const editarClub = (clb) => {
    setClubSelect(clb);
    setTitulo("Editar Club " + clb.abreviado);
    setShowModal(true);
  }
  function cambiarEstadoPuntuacion(dato) {
    if (dato.puntuado === 'I') {
      dato.puntuado = 'A';
    } else {
      dato.puntuado = 'I';
    }
    fetch(`${server}/club/setPuntuadoClub`, {
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
          setListaClubs(data.ok);
        } else {
          MsgUtils.msgError(data.error);
        }
      })
      .catch(error => MsgUtils.msgError(error));
  }, [actualizar])
  useEffect(() => {
    var sessionActiva = JSON.parse(localStorage.getItem('login'))
    if (sessionActiva !== null) {
      setLogin(true);
      setUserLogin(sessionActiva);
      navigate('/regcLUB', { replace: true });
    }
  }, [])
  return (
    <div>
      <Header />
      <div className='container-fluid bg-secondary bg-gradient py-2'>
        <div className='row row-cols-2 g-0'>
          <div className='col-9 m-0 p-0 my-auto'>
            <div className='text-center fw-bold text-light tituloMenu'>Lista de los Clubs   </div>
          </div>
          <div className='col-3 m-0 p-0 text-end'>
            <button className='btn btn-sm  btn-success bg-gradient letraBtn'
              onClick={() => { setShowModal(true); setTitulo("Registrar Club"); setClubSelect({}) }}>
              <span className='text-light d-none d-sm-inline'>AGREGAR  </span>
              <i className="fa-solid fa-circle-plus fa-2xl fa-fade"></i>
            </button>
          </div>
        </div>
      </div>
      <div className='table-responsive'>
        <table className="table table-sm table-dark table-striped table-hover table-bordered">
          <thead>
            <tr className='text-center'>
              <th style={{minWidth:'250px'}}>CLUB</th>
              <th scope="col">DIRECCION</th>
              <th className='col-1'>CLUB PUNTUADO</th>
              <th className="col-1"></th>
            </tr>
          </thead>
          <tbody>
            {listaClubs.map((item, index) => {
              return (
                <tr key={index} className='letraMontserratr'>
                  <th scope="row" className='col-2'>
                    <div className='container-fluid'>
                      <div className='row row-cols-2 gx-1'>
                        <div className='col-4'>
                          {item.imagen!=null&&<img width='55' src={`${server}/adjunto/${item.imagen}`}></img>}
                          {item.imagen==null&&<div><i className="fa-solid fa-house-flag fa-2xl"></i></div>}
                        </div>  
                        <div className='col-6'>
                          <div className='text-light'> {item.nombre}</div>
                          <div className='text-light'> {item.abreviado}</div>
                        </div>
                      </div>
                    </div>
                  </th>
                  <td>{UtilsBuffer.getText(item.direccion)}</td>
                  <td>
                    <div className="form-check form-switch text-center">
                      <input className="form-check-input" type="checkbox"
                        checked={item.puntuado === 'I' ? false : true}
                        onChange={() => cambiarEstadoPuntuacion(item)} />
                      <label className="form-check-label letraMontserratr" >
                        <span className={item.puntuado === 'I' ? 'badge bg-danger' : 'badge bg-success'}>
                          {item.puntuado === 'I' ? 'No entra a Puntuación' : 'Entra a Puntuación'}
                        </span>
                      </label>
                    </div>
                  </td>
                  <td className='text-end'>
                    <div className="btn-group btn-group-sm" role="group" aria-label="Basic example">
                      <label className='btn  text-success'>
                        <i className="fa-solid fa-image fa-xl"></i>
                        <input type="file" accept='image/*' onChange={(e) => cargarFoto(e, 'IMG', item.idclub)} />
                      </label>
                      <button type="button" className="btn btn-transparent text-warning"
                        onClick={() => editarClub(item)}>
                        <i className="fa-solid fa-pen-to-square fa-xl"></i>
                      </button>
                      <button type="button" className="btn btn-transparent text-danger"
                        onClick={() => { setClubSelect(item); setShowMessage(true) }}>
                        <i className="fa-solid fa-trash-can fa-xl"></i>
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
              {titulo}
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddEditClub setActualizar={setActualizar}
            dato={clubSelect}
            actualizar={actualizar}
            setShowModal={setShowModal} />
        </Modal.Body>
      </Modal>
      <UtilsCargador show={cargador} />
      <MsgDialogo show={showMessage} msg='Esta seguro de Eliminar EL CLUB' okFunction={() => eliminarClub(clubSelect)} notFunction={() => setShowMessage(false)} />
    </div>
  )
}

export default PrincipalRegistroClub
