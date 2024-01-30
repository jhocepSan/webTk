import React, { useEffect, useState, useContext } from 'react'
import { ContextAplicacions } from './Context/ContextAplicacion';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Modal from 'react-bootstrap/Modal';
import MsgUtils from './utils/MsgUtils';
import UtilsCargador from './utils/UtilsCargador';
import { server } from './utils/MsgUtils';

function VistaInicio() {
  const navigate = useNavigate();
  const { setLogin, setUserLogin, login, campeonato, setCampeonato, userLogin, listaCampeonatos, setListaCampeonatos, inscripcionOpen, setInscripcionOpen } = useContext(ContextAplicacions);
  const [campeonatos, setCampeonatos] = useState([]);
  const [idCampeonato, setIdCampeonato] = useState();
  const [showModal, setShowModal] = useState(false);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [actualizar, setActualizar] = useState(false);
  const [cargador, setCargador] = useState(false);
  const [importCat, setImportCat] = useState(false);
  const [importGrad, setImportGrad] = useState(false);
  const [importId, setImportId] = useState(0);
  const cambiarCampeonato = (dato) => {
    var info = campeonatos.filter((item) => item.idcampeonato == dato);
    setIdCampeonato(dato);
    setCampeonato(info[0]);
    setInscripcionOpen(info[0].inscripcion == 'N' ? false : true);
    localStorage.setItem("campeonato", JSON.stringify(info[0]));
  }
  function cambiarEstadoInscripcion(dato) {
    var estado = dato ? 'S' : 'N';
    fetch(`${server}/config/cambiarInscripcion`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ estado, idCampeonato })
    })
      .then(res => res.json())
      .then(data => {
        setCargador(false);
        if (data.ok) {
          setInscripcionOpen(dato);
          MsgUtils.msgCorrecto(data.ok);
        } else {
          MsgUtils.msgError(data.error);
        }
      })
      .catch(error => MsgUtils.msgError(error));
  }
  function crearCampeonato() {
    fetch(`${server}/login/crearCampeonato`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ nombre, descripcion, importCat, importGrad, importId })
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
  }
  function guardarCampeonato() {
    if (nombre !== '') {
      setCargador(true);
      if ((importCat || importGrad) && importId !== 0) {
        crearCampeonato()
      } else if (!importCat && !importGrad) {
        crearCampeonato()
      } else {
        MsgUtils.msgError("Si quiere importar alguna configuracion, elija el campeonato de la cual se copiara...")
      }
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
          if (data.ok) {
            setListaCampeonatos(data.ok);
            setCampeonatos(data.ok);
            setIdCampeonato(data.ok[0].idcampeonato);
            setCampeonato(data.ok[0]);
            if (data.ok[0].inscripcion == 'N') {
              setInscripcionOpen(false);
            } else {
              setInscripcionOpen(true);
            }
            localStorage.setItem("campeonato", JSON.stringify(data.ok[0]));
          } else {
            MsgUtils.msgError(data.error);
          }
        })
        .catch(error => MsgUtils.msgError(error));
    }
  }, [login, actualizar])
  useEffect(() => {
    var sessionActiva = JSON.parse(localStorage.getItem('login'))
    if (sessionActiva !== null) {
      fetch(`${server}/login/getIpServidor`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=utf-8',
        }
      }).then(res => res.json())
        .then(data => {
          if (data.ok) {
            console.log(data.ok)
            setLogin(true);
            setUserLogin({...sessionActiva,serverIp:data.ok});
            navigate("/inicio", { replace: true });
          } else {
            setLogin(true);
            setUserLogin({...sessionActiva,serverIp:[]});
            navigate("/inicio", { replace: true });
            MsgUtils.msgError(data.error)
          }
        })
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
                        {userLogin.tipo === 'A' && <button className='btn btn-sm btn-success bg-gradient w-100' onClick={() => setShowModal(true)}>
                          <i className="fa-solid fa-circle-plus"></i> Nuevo
                        </button>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {userLogin.tipo === 'A' &&
            <div className='card-footer'>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox"
                  checked={inscripcionOpen}
                  onChange={() => cambiarEstadoInscripcion(!inscripcionOpen)} />
                <label className="form-check-label" ><span className={inscripcionOpen == false ? 'badge bg-danger' : 'badge bg-success'}>{inscripcionOpen == true ? 'Inscripciones Abiertas' : 'Inscripciones Cerradas'}</span></label>
              </div>
            </div>}
          {campeonato.nombre !== undefined && <div className='container-fluid'>
            <div className='tituloInicial text-center text-light'>Pequeño resumen del Campeonato</div>
            <div className='text-light letrasContenido'>{`Numero de alumnos sin Pelea: ${campeonato.SINPELEAS}`}</div>
            <div className='text-light letrasContenido'>{`Inscritos en POOMSE: ${campeonato.NPP}`}</div>
            <div className='text-light letrasContenido'>{`Inscritos en KIRUGUI: ${campeonato.NPK}`}</div>
          </div>}
        </div>
      </div>
      <div className='container-fluid mb-4'>
        <div className="card bg-warning bg-gradient">
          <div className="card-header text-dark text-center tituloInicial">
            <i className="fa-solid fa-server fa-fade"></i> Direccion Ip del Servidor TKD <i className="fa-solid fa-server fa-fade"></i>
          </div>
          {userLogin.serverIp !== undefined && <div className='card-body text-center'>
            {userLogin.serverIp.map((item, index) => {
              return (
                <div key={index}>
                  <div className='letrasContenido text-dark' style={{ fontSize: '19px' }}>
                    Red {item.name} la direccion Registro es = {item.ip}:4000
                  </div>
                  <div className='letrasContenido text-dark' style={{ fontSize: '19px' }}>
                    Red {item.name} la direccion APK es = {item.ip}:4001
                  </div>
                </div>
              )
            })}
          </div>}
        </div>
      </div>
      <div className='container-fluid '>
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
            {campeonatos.length != 0 &&
              <div className='mb-3'>
                <label className="form-label text-light fw-bold"><i className="fa-solid fa-gear fa-fade"></i> Importar Configuración ?</label>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" value={importCat} onClick={() => setImportCat(!importCat)} />
                  <label className="form-check-label text-light" >
                    Categorias
                  </label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" value={importGrad} onClick={() => setImportGrad(!importGrad)} />
                  <label className="form-check-label text-light" >
                    Grados
                  </label>
                </div>
                <label className="form-label text-light fw-bold">Del Campeonato :</label>
                <select className="form-select form-select-sm btn-secondary" value={importId} onChange={(e) => setImportId(e.target.value)}>
                  <option value={0}>NINGUNO</option>
                  {campeonatos.map((item, index) => {
                    return (
                      <option value={item.idcampeonato} key={index}>{item.nombre}</option>
                    )
                  })}
                </select>
              </div>
            }
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
