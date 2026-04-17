import React, { useContext, useEffect, useState } from 'react'
import Header from '../Header';
import { useNavigate, Link } from 'react-router-dom';
import { limpiarLecturasPoomse, getPuntosPoomse, setPuntuacionPoomse, savePuntuacionPoomse } from '../utils/UtilsConsultas';
import apiUsuarios from '../ConsultasApi/UsuarioConsultas';
import { ContextAplicacions } from '../Context/ContextAplicacion';
import MsgUtils, { server } from '../utils/MsgUtils';
import PrincipalLlavePoomse from '../ListaCompetidores/PrincipalLlavePoomse';
import UtilsBuffer from '../utils/UtilsBuffer';
import Modal from 'react-bootstrap/Modal';
import useWebSocket from 'react-use-websocket'
import ModalVictoria from '../utils/ModalVictoria';

const connectionStatus = {
  0: 'Conectando...',
  1: 'Conectado',
  2: 'Cerrando...',
  3: 'Desconectado',
};
function PrincipalPuntPoomse() {
  const navigate = useNavigate();
  const { setLogin, setUserLogin, campeonato, setCampeonato, setTitulo } = useContext(ContextAplicacions);
  const [config, setConfig] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showResultado, setShowResultado] = useState(true);
  const [categorias, setCategorias] = useState([]);
  const [competidores, setCompetidores] = useState([]);
  const [selectItem, setSelectItem] = useState(null);
  const [puntuacion, setPuntuacion] = useState(0);
  const [selectComp, setSelectComp] = useState(null);
  const [sectorLectura, setSectorLectura] = useState(-1);
  const [puntoLeido, setPuntoLeido] = useState({});
  const [actualizar, setActualizar] = useState(false);
  const [serverIo, setServerIo] = useState(null);
  const [entradaTexto, setEntradaTexto] = useState('');
  const [historialPuntos, setHistorialPuntos] = useState([]);
  const [mostrarFelicitacion,setMostrarFelicitacion] = useState(false);
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(serverIo, {
    shouldReconnect: () => true,
    enabled: !!serverIo,
    onOpen: () => {
      if (sectorLectura != -1) {
        sendJsonMessage({ type: 'IDENTIFY', area: sectorLectura + 'P', role: 'SCREEN' });
      }
    }
  });

  function elegirCompetidor(dato) {
    console.log(dato);
    setSelectComp(dato.competidor)
    setSelectItem({ ...dato.GRADO, 'categoria': dato.nombre, 'genero': dato.genero });
    /*setListaElegida(dato.COMPETIDORES);*/
  }
  function getInformacionCategoria() {
    fetch(`${server}/config/getConfiCategoriaUnido`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ 'idcampeonato': campeonato.idcampeonato })
    })
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          console.log(data.ok);
          setCategorias(data.ok);
        } else {
          MsgUtils.msgError(data.error);
        }
      })
      .catch(error => MsgUtils.msgError(error));
  }
  function getInformacionPoomse() {
    fetch(`${server}/competidor/getInformacionRompimiento`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ 'idCampeonato': campeonato.idcampeonato, 'estado': 'A', 'tipo': 'P' })
    })
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          console.log(data.ok);
          setCompetidores(data.ok);
        } else {
          MsgUtils.msgError(data.error);
        }
      })
      .catch(error => MsgUtils.msgError(error));
  }

  function selectCompetidor(dato) {
    setSelectComp(dato);
  }
  const recetearValores = async (tipo) => {
    await limpiarLecturasPoomse({ 'sector': sectorLectura })
    if (tipo == 1) {
      await setPuntuacionPoomse({ 'puntuacion': puntuacion, 'idclasificacion': selectComp.idclasificacion })
      //await savePuntuacionPoomse({ 'puntosLeidos': puntoLeido, 'infoCompetidor': selectComp, 'puntuacion': puntuacion })
      getInformacionPoomse();
      setActualizar(!actualizar);
    }
    setPuntuacion(0);
    setPuntoLeido({});
    setHistorialPuntos([]);
  }
  function sacarPromedio(lista) {
    var sumatoria = lista.reduce(function (acumulador, siguienteValor) {
      return acumulador + siguienteValor;
    }, 0);
    return sumatoria / lista.length
  }
  const procesarPuntos = async (nuevoPuntoLeido) => {
    const juecesActuales = Object.values(nuevoPuntoLeido);
    console.log(juecesActuales)
    if (juecesActuales.length === parseInt(config.numJueces)) {
      let resultadoFinal = 0;

      // Obtenemos los puntajes sumando Accuracy + Presentation
      let puntuacionMando = juecesActuales.map(item =>
        parseFloat(item.ACCURACY) + parseFloat(item.PRESENTATION)
      );

      if (config.enablePromedio) {
        if (config.promedioEliminador) {
          if (puntuacionMando.length >= 4) {
            puntuacionMando.sort((a, b) => a - b);
            puntuacionMando.pop();   // Quita el máximo
            puntuacionMando.shift(); // Quita el mínimo
          }
          resultadoFinal = sacarPromedio(puntuacionMando);
        } else if (config.promedioTradicional) {
          resultadoFinal = sacarPromedio(puntuacionMando);
        }
      } else if (config.enableMaximo) {
        resultadoFinal = Math.max(...puntuacionMando);
      }

      // Guardar y actualizar
      const puntuacionFinal = resultadoFinal.toFixed(1);
      localStorage.setItem('puntuacionPoomse', JSON.stringify({
        selectComp,
        puntuacion: puntuacionFinal,
        selectItem
      }));
      setPuntuacion(puntuacionFinal);
      setMostrarFelicitacion(true);
    }
  }
  function guardarServidor() {
    if (entradaTexto != '' && sectorLectura != -1) {
      setServerIo(entradaTexto.replace('http://', 'ws://').replace('https://', 'wss://'))
      setShowResultado(false);
    } else {
      MsgUtils.msgError('Debe seleccionar un area y servidor');
    }
  }
  function mostrarEstado() {
    if (readyState == 1) {
      return (<button className='btn-sm btn-light bg-gradient p-1' onClick={() => setShowResultado(true)}>
        <i className="fa-solid fa-circle text-success"></i> <span className="badge bg-success bg-gradient">{connectionStatus[readyState]}</span>
      </button>)
    } else if (readyState == -1) {
      return (<button className='btn-sm btn-light bg-gradient p-1' onClick={() => setShowResultado(true)}>
        <i className="fa-solid fa-circle text-info"></i> <span className="badge bg-info bg-gradient">No Configurado</span>
      </button>)
    } else {
      return (<button className='btn-sm btn-light bg-gradient p-1' onClick={() => setShowResultado(true)}>
        <i className="fa-solid fa-circle text-danger"></i> <span className="badge bg-danger bg-gradient">{connectionStatus[readyState]}</span>
      </button>)
    }
  }
  useEffect(() => {
    if (serverIo != null) {
      if (readyState == 1 && lastJsonMessage != null) {
        if (sectorLectura == lastJsonMessage.sector && lastJsonMessage.tipo == 'P') {
          const nuevoPuntoLeido = {
            ...puntoLeido,
            [lastJsonMessage.id]: lastJsonMessage
          };
          setPuntoLeido(nuevoPuntoLeido);
          procesarPuntos(nuevoPuntoLeido);
        }
      }
    }
  }, [readyState, lastJsonMessage])
  useEffect(() => {
    var sessionActiva = JSON.parse(localStorage.getItem('login'));
    var cmp = JSON.parse(localStorage.getItem('campeonato'));
    var confi = JSON.parse(localStorage.getItem('poomse'))
    categorias.length == 0 ? getInformacionCategoria() : '';
    competidores.length == 0 ? getInformacionPoomse() : '';
    if (sessionActiva !== null) {
      setTitulo('')
      setCampeonato(cmp);
      setLogin(true);
      setUserLogin(sessionActiva);
      //navigate("/gamePoomse", { replace: true });
    }
    if (confi != undefined || confi != null) {
      setConfig(confi);
    } else {
      MsgUtils.msgError("No tiene la configuracion de poomse.")
    }
  }, [])

  return (
    <div className='vh-100 bg-primary bg-gradient' tabIndex={0} onKeyDown={(e) => { }}>
      <Header puntuacion={true} />
      {showModal == false &&
        <div className='container-fluid mb-2'>
          <div className='card bg-transparent'>
            <div className='card-header bg-transparent text-center p-1'>
              <div className='row row-cols g-0'>
                <div className='col-1 text-end'>
                  <div className='btn-group'>
                    <button className='btn btn-info btn-sm text-light'
                      title='Lista de Estudiantes en Poomsea'
                      onClick={() => setShowModal(true)}>
                      <i className="fa-solid fa-circle-arrow-left text-light "></i> Lista</button>
                    <button type="button" className="btn mx-1 btn-sm botonMenu"
                      data-bs-toggle="tooltip" data-bs-placement="bottom" title="Recetear valores iniciales"
                      onClick={() => recetearValores(0)}>
                      <i className="fa-solid fa-repeat fa-2xl"></i></button>
                  </div>
                </div>
                <div className='col-10 text-center'>
                  <div className='row g-0 align-items-center'> {/* g-0 elimina el espacio entre columnas */}

                    {/* Usamos w-auto para que la columna solo ocupe lo que necesita su texto */}
                    <div className='col-auto text-light me-3 fs-3 fw-bold'>Area {sectorLectura}</div>

                    {historialPuntos.length > 0 && (
                      historialPuntos.map((item, index) => {
                        return (
                          <div
                            className='col-auto text-light fw-bold px-1 fa-xl bordered bg-gradient bg-secondary mx-1'
                            style={{ height: '40px', display: 'flex', alignItems: 'center' }}
                            key={index}
                          >
                            <span>{item}</span>
                          </div>
                        )
                      })
                    )}

                    {historialPuntos.length > 0 && (
                      <div className='col-auto ps-2' style={{ height: '40px', display: 'flex', alignItems: 'center' }}>
                        <button className='btn btn-sm btn-success p-1'
                          onClick={() => setPuntuacion((historialPuntos.reduce((a, b) => a + parseFloat(b), 0) / historialPuntos.length).toFixed(2)) }>
                          <i className="fa-solid fa-calculator fa-lg"></i>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className='col-1'>

                </div>
              </div>
            </div>
            <div className='card-body m-0 p-0 '>
              <div className='overflow-auto bg-secondary bg-gradient' style={{ height: '185px' }}>
                <div className='container-fluid m-0 p-1'>
                  <div className='row row-cols g-1'>
                    {Object.values(puntoLeido).map((item, index) => {
                      return (
                        <div className='col text-light' key={item.id || index} style={{ maxWidth: '210px', borderRight: 'solid', borderColor: 'white' }} >
                          <div className='text-center fw-bold' style={{ fontSize: '15px' }}>
                            <i className="fa-solid fa-circle fs-6" style={{ color: '#9dff1c' }}></i> Árbitro: {index + 1}
                          </div>
                          <hr style={{ margin: '0', padding: '0' }} className='text-light'></hr>

                          <div className='row row-cols g-0'>
                            <div className='col lh-1'>
                              <div className='text-center' style={{ fontSize: '15px' }}>Accuracy</div>
                              <div className='text-center fw-bold' style={{ fontSize: '45px' }}>{item.ACCURACY}</div>
                            </div>
                            <div className='col lh-1'>
                              <div className='text-center' style={{ fontSize: '15px' }}>Presentation</div>
                              <div className='text-center fw-bold' style={{ fontSize: '45px' }}>{item.PRESENTATION}</div>
                            </div>
                          </div>

                          <hr style={{ margin: '0', padding: '0', color: '#969696' }} ></hr>

                          <div className='col lh-1'>
                            <div className='text-center' style={{ fontSize: '15px' }}>Promedio</div>
                            <div className='text-center fw-bold' style={{ fontSize: '45px' }}>
                              {(parseFloat(item.PRESENTATION) + parseFloat(item.ACCURACY)).toFixed(1)}
                            </div>
                          </div>

                          <hr style={{ margin: '0', padding: '0' }} className='text-light container-fluid'></hr>

                          <div className='row row-cols g-1'>
                            <div className='col my-auto mx-auto' style={{ maxWidth: '27px' }}>
                              {item.ruta != null && <img width='25' src={`${server}/adjunto/${item.ruta}`} alt="firma" />}
                            </div>
                            <div className='col text-start lh-1'>
                              <div className='text-center fw-bold' style={{ fontSize: '25px' }}>{item.nombres}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='container-fluid m-0 p-0'>
            <div className='card w-100 bg-transparent'>
              <div className='card-body bg-light m-0 p-0 lh-1'>
                <div className='puntuacionTextE text-dark text-center lh-1'>{puntuacion}</div>
              </div>
              <div className='card-footer lh-1'>
                <div className='row row-col row-cols-sm-1 row-cols-md-2 row-cols-lg-2 g-1'>
                  {selectComp != null &&
                    <div className='col-md-8 col-lg-8 col-sm-12'>
                      <div className="fs-2 text-light fw-bold">{selectComp.nombres + ' ' + selectComp.apellidos}</div>
                      <div className="fs-5 text-light fw-bold">{selectComp.club} - {selectItem.categoria} / {selectItem.nombre} / {selectItem.genero == 'M' ? 'Masculino' : 'Femenino'}</div>
                    </div>}
                  <div className='col-md-4 col-lg-4 col-sm-12'>
                    <div className="input-group mb-3">
                      <button className='btn btn-sm btn-transparent text-light fw-bold'
                        title='Guardar Punto, y seguir puntuando'
                        onClick={() => {
                          setHistorialPuntos([...historialPuntos, puntuacion]);
                          setPuntoLeido({});
                          setPuntuacion(0);
                        }
                        }>
                        <i className="fa-solid fa-clipboard-check fs-3"></i>
                      </button>
                      {mostrarEstado()}
                      <input type="number" className="form-control form-control-sm" placeholder="Puntuación Manual"
                        onChange={(e) => setPuntuacion(e.target.value)} />
                      <button className='btn btn-success btn-sm' onClick={() => recetearValores(1)}>
                        Guardar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>}
      {showModal &&
        <div className='bg-dark bg-gradient py-1'>
          <div className='row row-cols g-0'>
            <div className='col-1'>
              <button className='btn btn-secondary btn-sm' onClick={() => setShowModal(false)}>
                <i className="fa-solid fa-circle-arrow-left text-light"></i> Puntos</button>
            </div>
            <div className='col'>
              <div className='text-light '>Lista de Competidores</div>
            </div>
          </div>
          <PrincipalLlavePoomse categorias={categorias} idcampeonato={campeonato.idcampeonato}
            genero={actualizar} llaves={competidores} tipo={'P'} tipoL={'A'} collback={elegirCompetidor} />
        </div>
      }
      <ModalVictoria show={mostrarFelicitacion} handleClose={() => setMostrarFelicitacion(false)} />
      <Modal show={showResultado} onHide={() => setShowResultado(false)}
        size='sm' centered
        backdrop="static"
        aria-labelledby="contained-modal-title-vcenter"
        contentClassName='bg-dark bg-gradient'
      >
        <Modal.Header bsPrefix='modal-header m-0 p-0 px-2 w-100 ' closeButton={false} closeVariant='white'>
          <div className='fa-fade tituloMenu text-light fw-bold mx-auto' style={{ fontSize: '20px' }}>
            Url Servidor
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="container-fluid ">
            <input type="txt" className="form-control form-control-sm mb-2"
              id="exampleFormControlInput1" placeholder="http://192.168.1.11:4001"
              value={entradaTexto} onChange={(e) => setEntradaTexto(e.target.value)}
            />
            <div className="input-group input-group-sm">
              <span className="input-group-text" >Area </span>
              <select className="form-select form-select-sm"
                title='Elegimos el are de calificación'
                value={sectorLectura}
                onChange={(e) => setSectorLectura(e.target.value)}>
                <option value={-1}>NINGUNO</option>
                <option value={0}>Area 0</option>
                <option value={1}>Area 1</option>
                <option value={2}>Area 2</option>
                <option value={3}>Area 3</option>
              </select>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className='btn btn-success btn-sm'
            onClick={() => guardarServidor()}>
            Guardar y Conectar
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default PrincipalPuntPoomse