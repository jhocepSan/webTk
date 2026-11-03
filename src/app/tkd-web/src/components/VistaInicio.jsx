import React, { useEffect, useState, useContext } from 'react'
import { ContextAplicacions } from './Context/ContextAplicacion';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Modal from 'react-bootstrap/Modal';
import MsgUtils from './utils/MsgUtils';
import UtilsCargador from './utils/UtilsCargador';
import { server } from './utils/MsgUtils';
import QrCode from './QrCode';

const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json;charset=utf-8',
};

// Tarjeta reutilizable para WEB y APK (antes estaba duplicada)
function TarjetaAcceso({ titulo, icono, url }) {
  return (
    <div className='card h-100 border-0 shadow-sm'>
      <div className='card-body text-center'>
        <div className='fw-semibold text-secondary mb-1'>
          <i className={`${icono} me-2`}></i>{titulo}
        </div>
        <a href={url} target='_blank' rel='noreferrer' className='d-block fs-5 fw-bold text-decoration-none mb-3'>
          {url}
        </a>
        <div className='d-inline-block bg-white p-2 rounded-3 border'>
          <QrCode texto={url} />
        </div>
      </div>
    </div>
  );
}

// Número grande + etiqueta, para el resumen del campeonato
function Dato({ valor, etiqueta, color }) {
  return (
    <div className='col'>
      <div className={`rounded-3 p-3 text-center bg-${color} bg-opacity-70 border border-${color} border-opacity-25`}>
        <div className={`fs-2 fw-bold text-dark`}>{valor ?? 0}</div>
        <div className='small text-secondary'>{etiqueta}</div>
      </div>
    </div>
  );
}

function VistaInicio() {
  const navigate = useNavigate();
  const { setLogin, setUserLogin, login, campeonato, setCampeonato, userLogin,
    setListaCampeonatos, inscripcionOpen, setInscripcionOpen } = useContext(ContextAplicacions);
  const [campeonatos, setCampeonatos] = useState([]);
  const [idCampeonato, setIdCampeonato] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showBienvenida, setShowBienvenida] = useState(false);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [actualizar, setActualizar] = useState(false);
  const [cargador, setCargador] = useState(false);
  const [importCat, setImportCat] = useState(false);
  const [importGrad, setImportGrad] = useState(false);
  const [importId, setImportId] = useState(0);

  const esAdmin = userLogin.tipo === 'A';

  const cambiarCampeonato = (dato) => {
    const info = campeonatos.find((item) => item.idcampeonato == dato);
    if (!info) return;
    setIdCampeonato(dato);
    setCampeonato(info);
    setInscripcionOpen(info.inscripcion !== 'N');
    localStorage.setItem("campeonato", JSON.stringify(info));
  }

  function cambiarEstadoInscripcion(dato) {
    const estado = dato ? 'S' : 'N';
    fetch(`${server}/config/cambiarInscripcion`, {
      method: 'POST',
      headers,
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
      headers,
      body: JSON.stringify({ nombre, descripcion, importCat, importGrad, importId })
    })
      .then(res => res.json())
      .then(data => {
        setCargador(false);
        if (data.ok) {
          setNombre('');
          setDescripcion('');
          setImportCat(false);
          setImportGrad(false);
          setImportId(0);
          setActualizar(!actualizar);
          setShowModal(false);
        } else {
          MsgUtils.msgError(data.error);
        }
      })
      .catch(error => MsgUtils.msgError(error));
  }

  function guardarCampeonato() {
    if (nombre === '') {
      MsgUtils.msgError("Escriba el nombre del campeonato.");
      return;
    }
    const quiereImportar = importCat || importGrad;
    if (quiereImportar && Number(importId) === 0) {
      MsgUtils.msgError("Para importar una configuración, elija el campeonato de origen.");
      return;
    }
    setCargador(true);
    crearCampeonato();
  }

  useEffect(() => {
    if (login) {
      setCargador(true);
      fetch(`${server}/config/getCampeonato`, { method: 'GET', headers })
        .then(res => res.json())
        .then(data => {
          if (data.ok) {
            setListaCampeonatos(data.ok);
            setCampeonatos(data.ok);
            setIdCampeonato(data.ok[0].idcampeonato);
            setCampeonato(data.ok[0]);
            setInscripcionOpen(data.ok[0].inscripcion !== 'N');
            localStorage.setItem("campeonato", JSON.stringify(data.ok[0]));
          } else {
            MsgUtils.msgError(data.error);
          }
        })
        .catch(error => MsgUtils.msgError(error))
        .finally(() => setCargador(false)); // antes: .finally(setCargador(false)) se ejecutaba de inmediato
    }
  }, [login, actualizar])

  useEffect(() => {
    const sessionActiva = JSON.parse(localStorage.getItem('login'))
    if (sessionActiva !== null) {
      fetch(`${server}/login/getIpServidor`, { method: 'GET', headers })
        .then(res => res.json())
        .then(data => {
          setLogin(true);
          setUserLogin({ ...sessionActiva, serverIp: data.ok ? data.ok : [] });
          navigate("/inicio", { replace: true });
          if (!data.ok) MsgUtils.msgError(data.error);
        })
        .catch(error => MsgUtils.msgError(error));
    }
  }, [])

  return (
    <>
      <Header />
      <div className='container-xl py-3'>

        {/* Selector de campeonato */}
        <div className='card bg-dark text-light border-0 shadow mb-3'>
          <div className='card-body'>
            <div className='row g-3 align-items-center'>
              <div className='col-md'>
                <h1 className='h4 mb-1'>Campeonato activo</h1>
                <div className='text-light text-opacity-75 small'>
                  Elija el campeonato con el que trabajará el sistema.
                </div>
              </div>
              <div className='col-md-6 col-lg-5'>
                <div className='input-group'>
                  <select className='form-select' value={idCampeonato} onChange={(e) => cambiarCampeonato(e.target.value)}>
                    {campeonatos.map((item) => (
                      <option value={item.idcampeonato} key={item.idcampeonato}>{item.nombre}</option>
                    ))}
                  </select>
                  {esAdmin &&
                    <button className='btn btn-success' onClick={() => setShowModal(true)}>
                      <i className="fa-solid fa-plus me-1"></i> Nuevo
                    </button>}
                </div>
              </div>
            </div>
          </div>
          {esAdmin &&
            <div className='card-footer border-secondary d-flex align-items-center gap-3'>
              <div className="form-check form-switch m-0">
                <input className="form-check-input" type="checkbox" role='switch' id='switchInscripcion'
                  checked={!!inscripcionOpen}
                  onChange={() => cambiarEstadoInscripcion(!inscripcionOpen)} />
                <label className="form-check-label" htmlFor='switchInscripcion'>Inscripciones</label>
              </div>
              <span className={`badge ${inscripcionOpen ? 'bg-success' : 'bg-danger'}`}>
                {inscripcionOpen ? 'Abiertas' : 'Cerradas'}
              </span>
            </div>}
        </div>

        {/* Resumen del campeonato */}
        {campeonato?.nombre !== undefined &&
          <div className='mb-3'>
            <h2 className='h6 text-secondary mb-2'>Resumen de {campeonato.nombre}</h2>
            <div className='row row-cols-1 row-cols-sm-3 g-2'>
              <Dato valor={campeonato.NPP} etiqueta='Inscritos en Poomse' color='primary' />
              <Dato valor={campeonato.NPK} etiqueta='Inscritos en Kirugui' color='warning' />
              <Dato valor={campeonato.SINPELEAS} etiqueta='Alumnos sin pelea' color='danger' />
            </div>
          </div>}

        {/* Accesos WEB y APK */}
        {userLogin.serverIp !== undefined && userLogin.serverIp.length > 0 &&
          <div>
            <h2 className='h6 text-secondary mb-2'>Conexión desde otros dispositivos</h2>
            {userLogin.serverIp.map((item, index) => (
              <div className='row row-cols-1 row-cols-md-2 g-2 mb-2' key={index}>
                <div className='col'>
                  <TarjetaAcceso titulo='Versión web' icono='fa-solid fa-globe' url={`http://${item.ip}:4005`} />
                </div>
                <div className='col'>
                  <TarjetaAcceso titulo='Aplicación móvil (APK)' icono='fa-brands fa-android' url={`http://${item.ip}:4001`} />
                </div>
              </div>
            ))}
          </div>}
      </div>

      {/* Botón flotante de bienvenida */}
      <button
        type='button'
        className='btn btn-success rounded-circle shadow-lg position-fixed bottom-0 end-0 m-3 d-flex align-items-center justify-content-center'
        style={{ width: 56, height: 56, zIndex: 1030 }}
        onClick={() => setShowBienvenida(true)}
        aria-label='Abrir información del sistema'
        title='Acerca del sistema'>
        <i className="fa-solid fa-circle-info fa-lg"></i>
      </button>

      {/* Modal de bienvenida */}
      <Modal show={showBienvenida} onHide={() => setShowBienvenida(false)} centered contentClassName='bg-dark text-light'>
        <Modal.Header closeButton closeVariant='white' className='border-secondary'>
          <Modal.Title className='h5'>Bienvenido al Sistema TK</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className='fw-semibold'>Desarrollado en Cochabamba, Bolivia.</p>
          <p>
            Ayuda a controlar las competencias y a gestionar estudiantes y clubes
            de la Asociación de Taekwondo de Cochabamba.
          </p>
          <p className='mb-0 text-light text-opacity-75'>
            Para consultas, comuníquese con el desarrollador Juan José Sánchez Choquecallata,
            número de referencia 60790682.
          </p>
        </Modal.Body>
      </Modal>

      {/* Modal nuevo campeonato */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName='bg-dark text-light'>
        <Modal.Header closeButton closeVariant='white' className='border-secondary'>
          <Modal.Title className='h5'>Crear un nuevo campeonato</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label className="form-label fw-semibold" htmlFor='nombreCamp'>Nombre</label>
            <input id='nombreCamp' type="text" className="form-control" placeholder='Nombre único del campeonato'
              value={nombre} onChange={(e) => setNombre(e.target.value.toUpperCase())} />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold" htmlFor='descCamp'>Descripción</label>
            <textarea id='descCamp' className="form-control" rows={3} placeholder='Detalles del campeonato (opcional)'
              value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
          </div>
          {campeonatos.length !== 0 &&
            <div className='mb-3'>
              <div className="form-label fw-semibold">¿Importar configuración?</div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id='impCat' checked={importCat} onChange={() => setImportCat(!importCat)} />
                <label className="form-check-label" htmlFor='impCat'>Categorías</label>
              </div>
              <div className="form-check mb-2">
                <input className="form-check-input" type="checkbox" id='impGrad' checked={importGrad} onChange={() => setImportGrad(!importGrad)} />
                <label className="form-check-label" htmlFor='impGrad'>Grados</label>
              </div>
              <label className="form-label small" htmlFor='impId'>Copiar desde el campeonato</label>
              <select id='impId' className="form-select" value={importId} onChange={(e) => setImportId(e.target.value)}>
                <option value={0}>Ninguno</option>
                {campeonatos.map((item) => (
                  <option value={item.idcampeonato} key={item.idcampeonato}>{item.nombre}</option>
                ))}
              </select>
            </div>}
          <button className='btn btn-success w-100' onClick={guardarCampeonato}>
            <i className="fa-solid fa-floppy-disk me-1"></i> Guardar campeonato
          </button>
        </Modal.Body>
      </Modal>
      <UtilsCargador show={cargador} />
    </>
  )
}

export default VistaInicio