import React, { useEffect, useState, useContext } from 'react'
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
import ConfiguracionAreaKirugui from './ConfiguracionAreaKirugui';
import ConfiguracionAreaPoomse from './ConfiguracionAreaPoomse';

const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json;charset=utf-8',
};

const PESTANAS = [
  { id: 0, texto: 'Categorías', icono: 'fa-solid fa-landmark' },
  { id: 1, texto: 'Grados', icono: 'fa-solid fa-graduation-cap' },
  { id: 2, texto: 'Kirugui', icono: 'fa-solid fa-person-military-to-person' },
  { id: 3, texto: 'Poomse', icono: 'fa-solid fa-person-circle-check' },
];

function PrincipalConfiguracion() {
  const navigate = useNavigate();
  const { userLogin, setLogin, setUserLogin, campeonato, setCampeonato } = useContext(ContextAplicacions);
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

  const esAdmin = userLogin.tipo === 'A';

  const editarCategoria = (dato) => {
    setSelectCategoria(dato);
    setTitulo("Editar categoría " + dato.nombre);
    setShowModal(true);
  }

  const eliminarCategoria = (dato) => {
    fetch(`${server}/config/deleteCategoria`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ info: { dato } })
    })
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
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
    fetch(`${server}/config/cambiarEstadoCategoria`, {
      method: 'POST',
      headers,
      body: JSON.stringify(dato)
    })
      .then(res => res.json())
      .then(data => {
        if (data.ok) setActualizar(!actualizar);
        else MsgUtils.msgError(data.error);
      })
      .catch(error => MsgUtils.msgError(error));
  }

  // Ahora también se recarga al cambiar género o tipo (antes dependía de togglear "actualizar" a mano)
  useEffect(() => {
    if (tipo === '') {
      setCategorias([]);
      setSelectCategoria({});
      return;
    }
    setCargador(true);
    fetch(`${server}/config/getCategoria`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ campeonato, genero, tipo })
    })
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          setSelectCategoria({});
          setCategorias(data.ok);
        } else {
          MsgUtils.msgError(data.error);
        }
      })
      .catch(error => MsgUtils.msgError(error))
      .finally(() => setCargador(false));
  }, [actualizar, genero, tipo])

  useEffect(() => {
    const sessionActiva = JSON.parse(localStorage.getItem('login'));
    const cmp = JSON.parse(localStorage.getItem('campeonato'));
    if (sessionActiva !== null) {
      setCampeonato(cmp);
      setLogin(true);
      setUserLogin(sessionActiva);
      navigate("/configuracion", { replace: true });
    }
  }, [])

  // Controles compartidos por la tabla (escritorio) y las tarjetas (móvil)
  const controlLlave = (item) => {
    const conLlave = item.estado !== 'P';
    return (
      <div className='d-inline-flex align-items-center gap-2'>
        {esAdmin &&
          <div className='form-check form-switch m-0'>
            <input className='form-check-input' type='checkbox' role='switch'
              aria-label={`Llave de ${item.nombre}`}
              checked={conLlave}
              onChange={() => cambiarEstadoCate(item)} />
          </div>}
        <span className={`badge ${conLlave ? 'bg-success' : 'bg-warning text-dark'}`}>
          {conLlave ? 'Con llave' : 'Sin llave'}
        </span>
      </div>
    );
  }

  const accionesCategoria = (item) => (
    <div className='btn-group btn-group-sm'>
      <button className='btn btn-outline-success' title='Ver subcategorías'
        aria-label={`Ver subcategorías de ${item.nombre}`}
        onClick={() => alternarCategoria(item)}>
        <i className='fa-solid fa-chart-simple'></i>
      </button>
      {esAdmin &&
        <button className='btn btn-outline-warning' title='Editar'
          aria-label={`Editar ${item.nombre}`}
          onClick={() => editarCategoria(item)}>
          <i className='fa-solid fa-pen-to-square'></i>
        </button>}
      {esAdmin &&
        <button className='btn btn-outline-danger' title='Eliminar'
          aria-label={`Eliminar ${item.nombre}`}
          onClick={() => { setSelectCategoria(item); setShowMessage(true); }}>
          <i className='fa-solid fa-trash'></i>
        </button>}
    </div>
  );

  const alternarCategoria = (item) =>
    setSelectCategoria(selectCategoria.idcategoria === item.idcategoria ? {} : item);

  // Panel de subcategorías: se abre justo debajo de la categoría elegida
  const panelSubcategorias = (
    <div className='rounded-3 p-3 my-2'
      style={{ backgroundColor: '#2b3036', borderLeft: '3px solid #198754' }}>
      <PrincipalSubCategoria selectCategoria={selectCategoria} tipo={userLogin.tipo} />
    </div>
  );

  const mensajeVacio = tipo === ''
    ? 'Seleccione un tipo para ver sus categorías.'
    : 'No hay categorías para este género y tipo.';

  return (
    <div>
      <Header />
      <UtilsCargador show={cargador} />

      {/* Barra superior: título y pestañas */}
      <div className='bg-dark border-bottom border-secondary'>
        <div className='container-xl py-2'>
          <div className='d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2'>
            <div>
              <h1 className='h5 text-light mb-0'>Configuración</h1>
              {campeonato?.nombre && <div className='small text-light text-opacity-50'>{campeonato.nombre}</div>}
            </div>
            <ul className='nav nav-pills nav-fill gap-1 flex-nowrap overflow-auto'>
              {PESTANAS.map((p) => (
                <li className='nav-item' key={p.id}>
                  <button
                    className={`nav-link py-1 px-3 text-nowrap ${ventana === p.id ? 'active bg-success' : 'text-light text-opacity-75'}`}
                    onClick={() => { setVentana(p.id); if (p.id === 0) setActualizar(!actualizar); }}>
                    <i className={`${p.icono} me-1`}></i>{p.texto}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {ventana === 0 &&
        <div className='container-xl py-3'>

          {/* Filtros y acción principal */}
          <div className='row g-2 align-items-end mb-3'>
            <div className='col-6 col-md-3 col-lg-2'>
              <label className='form-label small text-secondary mb-1' htmlFor='selGenero'>Género</label>
              <select id='selGenero' className='form-select form-select-sm' value={genero} onChange={(e) => setGenero(e.target.value)}>
                <option value='M'>Masculino</option>
                <option value='F'>Femenino</option>
              </select>
            </div>
            <div className='col-6 col-md-3 col-lg-2'>
              <label className='form-label small text-secondary mb-1' htmlFor='selTipo'>Tipo</label>
              <select id='selTipo' className='form-select form-select-sm' value={tipo} onChange={(e) => setTipo(e.target.value)}>
                <option value=''>Seleccione</option>
                <option value='C'>Combate</option>
                <option value='P'>Poomse</option>
                <option value='D'>Demostraciones</option>
                <option value='R'>Rompimiento</option>
              </select>
            </div>
            {esAdmin &&
              <div className='col-12 col-md ms-md-auto text-md-end'>
                <button className='btn btn-sm btn-success' disabled={tipo === ''}
                  onClick={() => { setSelectCategoria({}); setTitulo("Registrar nueva categoría"); setShowModal(true); }}>
                  <i className='fa-solid fa-plus me-1'></i> Agregar categoría
                </button>
              </div>}
          </div>

          <div>
            <div>
              <div className='card bg-dark border-0 shadow-sm d-none d-md-block'>
                <div className='table-responsive'>
                  <table className='table table-dark table-hover align-middle mb-0'>
                    <thead>
                      <tr className='text-secondary small'>
                        <th>Categoría</th>
                        <th className='text-center'>Edad inicial</th>
                        <th className='text-center'>Edad final</th>
                        <th className='text-center'>Llave</th>
                        <th className='text-end pe-3'>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categorias.length === 0 &&
                        <tr>
                          <td colSpan={5} className='text-center text-secondary py-5'>
                            {mensajeVacio}
                          </td>
                        </tr>}
                      {categorias.map((item) => {
                        const activa = selectCategoria.idcategoria === item.idcategoria;
                        return (
                          <React.Fragment key={item.idcategoria}>
                          <tr role='button'
                            className={activa ? 'table-active' : ''}
                            onClick={() => alternarCategoria(item)}>
                            <td className='fw-semibold'>{item.nombre}</td>
                            <td className='text-center'>{item.edadini}</td>
                            <td className='text-center'>{item.edadfin}</td>
                            <td className='text-center' onClick={(e) => e.stopPropagation()}>{controlLlave(item)}</td>
                            <td className='text-end pe-3' onClick={(e) => e.stopPropagation()}>{accionesCategoria(item)}</td>
                          </tr>
                          {activa &&
                            <tr>
                              <td colSpan={5} className='p-0 border-0'>{panelSubcategorias}</td>
                            </tr>}
                          </React.Fragment>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* Móvil: una tarjeta por categoría */}
              <div className='d-md-none'>
                {categorias.length === 0 &&
                  <div className='text-center text-secondary py-5'>{mensajeVacio}</div>}
                <div className='d-grid gap-2'>
                  {categorias.map((item) => {
                    const activa = selectCategoria.idcategoria === item.idcategoria;
                    return (
                      <div key={item.idcategoria}>
                      <div role='button' onClick={() => alternarCategoria(item)}
                        className={`card bg-dark text-light border-2 ${activa ? 'border-success' : 'border-0'}`}>
                        <div className='card-body p-3'>
                          <div className='d-flex justify-content-between align-items-start gap-2 mb-2'>
                            <div>
                              <div className='fw-semibold'>{item.nombre}</div>
                              <div className='small text-secondary'>Edad {item.edadini} a {item.edadfin} años</div>
                            </div>
                            <div onClick={(e) => e.stopPropagation()}>{controlLlave(item)}</div>
                          </div>
                          <div className='d-flex justify-content-end' onClick={(e) => e.stopPropagation()}>{accionesCategoria(item)}</div>
                        </div>
                      </div>
                      {activa && panelSubcategorias}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        </div>}

      {ventana === 1 && <GradosConfig campeonato={campeonato} setCampeonato={setCampeonato} tipou={userLogin.tipo} />}
      {ventana === 2 && <ConfiguracionAreaKirugui />}
      {ventana === 3 && <ConfiguracionAreaPoomse />}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName='bg-dark text-light'>
        <Modal.Header closeButton closeVariant='white' className='border-secondary'>
          <Modal.Title className='h5'>{titulo}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddEditCategoria actualizar={actualizar} selectCategoria={selectCategoria} tipo={tipo}
            setActualizar={setActualizar} setShowModal={setShowModal} genero={genero} categorias={categorias} />
        </Modal.Body>
      </Modal>
      <MsgDialogo show={showMessage} msg='¿Está seguro de eliminar esta categoría?'
        okFunction={() => eliminarCategoria(selectCategoria)} notFunction={() => setShowMessage(false)} />
    </div>
  )
}

export default PrincipalConfiguracion