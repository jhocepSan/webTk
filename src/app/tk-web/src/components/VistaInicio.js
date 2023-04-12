import React, { useEffect, useState, useContext } from 'react'
import { ContextAplicacions } from './Context/ContextAplicacion';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Modal from 'react-bootstrap/Modal';
import MsgUtils from './utils/MsgUtils';
import UtilsCargador from './utils/UtilsCargador';
const server = process.env.REACT_APP_SERVER

function VistaInicio() {
  const navigate = useNavigate();
  const { setLogin, setUserLogin, login, campeonato, setCampeonato,userLogin } = useContext(ContextAplicacions);
  const [campeonatos, setCampeonatos] = useState([]);
  const [idCampeonato, setIdCampeonato] = useState();
  const [showModal, setShowModal] = useState(false);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [actualizar,setActualizar] = useState(false);
  const [cargador,setCargador] = useState(false);
  const cambiarCampeonato = (dato) => {
    var info = campeonatos.filter((item) => item.idcampeonato == dato);
    setCampeonatos(dato);
    setCampeonato(info[0]);
    localStorage.setItem("campeonato", JSON.stringify(info[0]));
  }
  function guardarCampeonato() {
    if (nombre !== '') {
      setCargador(true);
      fetch(`${server}/login/crearCampeonato`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({ nombre, descripcion })
      })
        .then(res => res.json())
        .then(data => { 
          setCargador(false);
          if (data.ok) {
            setNombre('');
            setDescripcion('');
            setActualizar(!actualizar); 
            setShowModal(false);
          } else {
            MsgUtils.msgError(data.error);
          }
        })
        .catch(error => MsgUtils.msgError(error));
    } else {
      MsgUtils.msgError("Colocar nombre del campeonato por favor .");
    }
  }
  useEffect(() => {
    if (login) {
      fetch(`${server}/config/getCampeonato`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=utf-8',
        }
      })
        .then(res => res.json())
        .then(data => {
          console.log(data.ok);
          if (data.ok) {
            setCampeonatos(data.ok);
            setIdCampeonato(data.ok[0].idcampeonato);
            setCampeonato(data.ok[0]);
            localStorage.setItem("campeonato", JSON.stringify(data.ok[0]));
          } else {
            MsgUtils.msgError(data.error);
          }
        })
        .catch(error => MsgUtils.msgError(error));
    }
  }, [login,actualizar])
  useEffect(() => {
    var sessionActiva = JSON.parse(localStorage.getItem('login'))
    if (sessionActiva !== null) {
      setLogin(true);
      setUserLogin(sessionActiva);
      navigate("/inicio", { replace: true });
    }
  }, [])
  return (
    <>
      <Header />
      <div className='container-fluid py-4'>
        <div className='card bg-dark bg-gradient'>
          <div className="card-header text-light text-center tituloInicial">
            <i className="fa-solid fa-arrows-to-circle fa-fade fa-xl"></i> Configuracion Inicial Del Campeonato <i className="fa-solid fa-arrows-to-circle fa-fade fa-xl"></i>
          </div>
          <div className="card-body m-0 p-0">
            <div className='container-fluid py-2'>
              <div className='row row-cols-sm-1 row-cols-md-2 g-1'>
                <div className='col my-auto'>
                  <div className='text-light letrasContenido'>
                    ELEGIR EL CAMPEONATO PARA EL USO DEL SISTEMA SI EN CASO NO ESTA SELECCIONADO !!!
                  </div>
                </div>
                <div className='col my-auto'>
                  <div className='container-fluid btn-group-sm w-100'>
                    <div className='row row-cols-1 row-cols-sm-1 row-cols-md-2 g-0'>
                      <div className='col col-sm-12 col-md-6'>
                        <select className="form-select form-select-sm btn-secondary" value={idCampeonato} onChange={(e) => cambiarCampeonato(e.target.value)}>
                          {campeonatos.map((item, index) => {
                            return (
                              <option value={item.idcampeonato} key={index}>{item.nombre}</option>
                            )
                          })}
                        </select>
                      </div>
                      <div className='col col-sm-12 col-md-6'>
                        {userLogin.estado=='A'&&<button className='btn btn-sm btn-success bg-gradient w-100' onClick={() => setShowModal(true)}>
                          <i className="fa-solid fa-circle-plus"></i> Nuevo
                        </button>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='container-fluid py-4'>
        <div className="card bg-dark bg-gradient">
          <div className="card-header text-light text-center tituloInicial">
            Bienvenidos Al Sistema TK
          </div>
          <div className="card-body">
            <h5 className="card-title text-light letrasContenido">Sistema desarrollado en COCHABAMBA_BOLIVIA</h5>
            <p className="card-text text-light letrasContenido">Ayuda a tener mas control, en competencias, y manejo de estudiantes
              en la asociacion de TEKWONDO CBBA, y manejo de los diferentes clubs de la misma.</p>
            <p className="card-text text-light letrasContenido">Gracias por utilizar el sistema cualquier Información comunicarce con el DESARROLLADOR, JUAN JOSE SANCHEZ CHOQUECALLATA numero de referencia 60790682</p>
          </div>
        </div>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}
        aria-labelledby="contained-modal-title-vcenter"
        contentClassName='bg-dark bg-gradient'>
        <Modal.Header closeButton closeVariant='white' bsPrefix='modal-header m-0 p-0 px-2 '>
          <Modal.Title >
            <div className='text-light letraMontserratr mx-auto'>
              Crear un Nuevo Campeonato
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body bsPrefix='modal-header m-0 p-0'>
          <div className='container-fluid'>
            <div className="mb-3">
              <label className="form-label text-light fw-bold"><i className="fa-solid fa-signature fa-fade"></i> Nombre Campeonato</label>
              <input type="text" className="form-control" placeholder='Escriba el nombre unico del campeonato' value={nombre} onChange={(e) => setNombre(e.target.value.toUpperCase())} />
            </div>
            <div className="mb-3">
              <label className="form-label text-light fw-bold"><i className="fa-solid fa-file-signature fa-fade"></i> Descripción</label>
              <textarea type="text" className="form-control" placeholder='Escriba el nombre unico del campeonato' value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
            </div>
            <button className='btn btn-sm w-100 bg-gradient bg-success mb-3 text-light' onClick={() => guardarCampeonato()}>
              <i className="fa-solid fa-floppy-disk"></i> Guardar
            </button>
          </div>
        </Modal.Body>
      </Modal>
      <UtilsCargador show={cargador} />
    </>
  )
}

export default VistaInicio
