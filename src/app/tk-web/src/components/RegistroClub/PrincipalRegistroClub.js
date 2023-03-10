import React, { useEffect, useState, useContext } from 'react';
import { ContextAplicacions } from '../Context/ContextAplicacion';
import { useNavigate } from 'react-router-dom';
import MsgUtils from '../utils/MsgUtils';
import UtilsBuffer from '../utils/UtilsBuffer';
import AddEditClub from './AddEditClub';
import Modal from 'react-bootstrap/Modal';
import Header from '../Header';
const server = process.env.REACT_APP_SERVER

function PrincipalRegistroClub() {
  const navigate = useNavigate();
  const { setLogin, setUserLogin } = useContext(ContextAplicacions);
  const [listaClubs, setListaClubs] = useState([]);
  const [actualizar, setActualizar] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [clubSelect, setClubSelect] = useState({});
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
          setActualizar(!actualizar);
        } else {
          MsgUtils.msgError(data.error);
        }
      })
      .catch(error => MsgUtils.msgError(error));
  }
  const editarClub = (clb) => {
    setClubSelect(clb);
    setTitulo("Editar Club " + clb.abreviado);
    setShowModal(true);
  }
  useEffect(() => {
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
      <div className='container-fluid bg-dark bg-gradient'>
        <div className='row row-cols-2 g-0'>
          <div className='col-9 m-0 p-0'>
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
        <table className="table table-sm table-dark table-striped table-hover">
          <thead>
            <tr className='text-center'>
              <th scope="col">CLUB</th>
              <th scope="col">ABR.</th>
              <th scope="col">DIRECCION</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {listaClubs.map((item, index) => {
              return (
                <tr key={index} className='letraMontserratr'>
                  <th scope="row" className='col-2'>{item.nombre}</th>
                  <td className='col-1'>{item.abreviado}</td>
                  <td>{UtilsBuffer.getText(item.direccion)}</td>
                  <td className='text-end'>
                    <div className="btn-group btn-group-sm" role="group" aria-label="Basic example">
                      <button type="button" className="btn btn-transparent text-warning"
                        onClick={() => editarClub(item)}>
                        <i className="fa-solid fa-pen-to-square fa-xl"></i>
                      </button>
                      <button type="button" className="btn btn-transparent text-danger"
                        onClick={() => eliminarClub(item)}>
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
    </div>
  )
}

export default PrincipalRegistroClub
