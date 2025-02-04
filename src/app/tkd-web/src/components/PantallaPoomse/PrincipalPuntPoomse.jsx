import React, { useContext, useEffect, useState } from 'react'
import Header from '../Header';
import { useNavigate, Link } from 'react-router-dom';
import { limpiarLecturasPoomse, getPuntosPoomse, setPuntuacionPoomse, savePuntuacionPoomse } from '../utils/UtilsConsultas';
import { ContextAplicacions } from '../Context/ContextAplicacion';
import MsgUtils, { server } from '../utils/MsgUtils';
import PrincipalLlavePoomse from '../ListaCompetidores/PrincipalLlavePoomse';
import UtilsBuffer from '../utils/UtilsBuffer';
import Modal from 'react-bootstrap/Modal';

function PrincipalPuntPoomse() {
  const navigate = useNavigate();
  const { setLogin, setUserLogin, campeonato, setCampeonato, setTitulo } = useContext(ContextAplicacions);
  const [config, setConfig] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showResultado, setShowResultado] = useState(false);
  const [tipom, setTipoM] = useState('');
  const [runPlay, setRunPlay] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [competidores, setCompetidores] = useState([]);
  const [selectItem, setSelectItem] = useState(null);
  const [puntuacion, setPuntuacion] = useState(0);
  const [selectComp, setSelectComp] = useState({});
  const [segundo, setSegundo] = useState(0);
  const [sectorLectura, setSectorLectura] = useState(0);
  const [puntoLeido, setPuntoLeido] = useState([]);
  const [actualizar,setActualizar] = useState(false);
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
    if(tipo==1){
      await setPuntuacionPoomse({ 'puntuacion': puntuacion, 'idclasificacion': selectComp.idclasificacion })
      await savePuntuacionPoomse({ 'puntosLeidos': puntoLeido, 'infoCompetidor': selectComp, 'puntuacion': puntuacion })
      getInformacionPoomse();
      setActualizar(!actualizar);
    }
    setPuntuacion(0);
    //setShowResultado(false);
    //setRunPlay(false);
  }
  function sacarPromedio(lista) {
    var sumatoria = lista.reduce(function (acumulador, siguienteValor) {
      return acumulador + siguienteValor;
    }, 0);
    return sumatoria / lista.length
  }
  const obtenerDatosPunto = async () => {
    if (runPlay == true) {
      var datos = await getPuntosPoomse({ 'sector': sectorLectura })
      if (datos.ok) {
        console.log(datos.ok);
        setPuntoLeido(datos.ok)
        if (datos.ok.length == parseInt(config.numJueces)) {
          if (config.enablePromedio) {
            var resultadoFinal = 0;
            var puntuacionMando = datos.ok.map(item => item.poomseaccuracy + item.poomsepresentation);
            if (config.promedioEliminador) {
              if (parseInt(config.numJueces) <= 3) {
                resultadoFinal = sacarPromedio(puntuacionMando);
              } else if (parseInt(config.numJueces) >= 4) {
                puntuacionMando.sort(function (a, b) { return a - b });
                puntuacionMando.pop();
                puntuacionMando.shift();
                resultadoFinal = sacarPromedio(puntuacionMando);
              }
              localStorage.setItem('puntuacionPoomse', JSON.stringify({
                'selectComp': selectComp,
                'puntuacion': (resultadoFinal).toFixed(1),
                'selectItem': selectItem,
                'runPlay': runPlay
              }));
              setPuntuacion((resultadoFinal).toFixed(1));
            } else if (config.promedioTradicional) {
              resultadoFinal = sacarPromedio(puntuacionMando);
              localStorage.setItem('puntuacionPoomse', JSON.stringify({
                'selectComp': selectComp,
                'puntuacion': (resultadoFinal).toFixed(1),
                'selectItem': selectItem,
                'runPlay': runPlay
              }));
              setPuntuacion((resultadoFinal).toFixed(1));
            }
          } else if (config.enableMaximo) {
            var puntuacionMando = datos.ok.map(item => item.poomseaccuracy + item.poomsepresentation);
            var puntoMaximo = Math.max(...puntuacionMando);
            localStorage.setItem('puntuacionPoomse', JSON.stringify({
              'selectComp': selectComp,
              'puntuacion': (puntoMaximo).toFixed(1),
              'selectItem': selectItem,
              'runPlay': runPlay
            }));
            setPuntuacion((puntoMaximo).toFixed(1));
          }
        }
      }
    }
    setSegundo(segundo + 1)
  }
  useEffect(() => {
    // Configurar el temporizador al montar el componente
    const timeoutId = setTimeout(() => {
      obtenerDatosPunto();
    }, 2000);

    // Limpiar el temporizador al desmontar el componente
    return () => {
      clearTimeout(timeoutId);
    };
  }, [segundo]);
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
      navigate("/gamePoomse", { replace: true });
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
      <div className="btn-group btn-group-sm" role="group" aria-label="Basic example">
        <Link className='btn btn-sm botonMenu' data-bs-toggle="tooltip"
          data-bs-placement="bottom" title="Abrir pantalla extendida"
          to={'/scoreDobleP'} target='blanck'>
          <i className="fa-brands fa-windows fa-2xl"></i>
        </Link>
        <button type="button" className="btn mx-1 btn-sm botonMenu"
          data-bs-toggle="tooltip" data-bs-placement="bottom" title="Ver peleas del Campeonato"
          onClick={() => { setTipoM('L'); setShowModal(!showModal); }}>
          <i className="fa-solid fa-network-wired fa-2xl"></i></button>
        <button type="button" className="btn mx-1 btn-sm botonMenu"
          data-bs-toggle="tooltip" data-bs-placement="bottom" title="Recetear valores iniciales"
          onClick={() => recetearValores(0)}>
          <i className="fa-solid fa-repeat fa-2xl"></i></button>
        {runPlay === true && <button type="button" className="btn mx-1 btn-sm botonMenu"
          data-bs-toggle="tooltip" data-bs-placement="bottom" title="Pausar Competencia"
          onClick={() => {
            localStorage.setItem('puntuacionPoomse', JSON.stringify({
              'selectComp': selectComp,
              'puntuacion': puntuacion,
              'selectItem': selectItem,
              'runPlay': false
            })); setRunPlay(false)
          }}>
          <i className="fa-solid fa-circle-pause fa-2xl"></i>
        </button>}
        {runPlay === false && <button type="button" className="btn mx-1 btn-sm botonMenu"
          data-bs-toggle="tooltip" data-bs-placement="bottom" title="Iniciar Competencia"
          onClick={() => {
            localStorage.setItem('puntuacionPoomse', JSON.stringify({
              'selectComp': selectComp,
              'puntuacion': puntuacion,
              'selectItem': selectItem,
              'runPlay': true
            }));
            setRunPlay(true);
          }}>
          <i className="fa-solid fa-circle-play fa-2xl"></i>
        </button>}
      </div>
      <div className='container-fluid mb-2' style={{ height: '50vh' }}>
        <div className='row row-cols-sm-1 row-cols-md-2 gx-2'>
          <div className='col' style={{ minWidth: '450px' }}>
            <div className='container-fluid'>
              <div className="input-group input-group-sm">
                <span className="input-group-text" >Area </span>
                <select className="form-select form-select-sm"
                  title='Elegimos el are de calificación'
                  value={sectorLectura}
                  onChange={(e) => setSectorLectura(e.target.value)}>
                  <option value={0}>Area 0</option>
                  <option value={1}>Area 1</option>
                  <option value={2}>Area 2</option>
                  <option value={3}>Area 3</option>
                </select>
              </div>
            </div>
            <div className='card bg-transparent'>
              <div className='card-header bg-dark'>
                <div className='text-light'>Lectura Calificaciones</div>
              </div>
              <div className='card-body m-0 p-0'>
                <div className='overflow-auto' style={{ maxHeight: '45vh' }}>
                  <div className='bg-secondary container-fluid'>
                    <div className='row row-cols g-1'>
                      {puntoLeido.map((item, index) => {
                        return (
                          <div className='col text-light' key={index} style={{ maxWidth: '110px', borderRight: 'solid', borderColor: 'white' }} >
                            <div className='row row-cols g-1'>
                              <div className='col lh-sm'>
                                <div className='text-center' style={{ fontSize: '9px' }}>Accuracy</div>
                                <div className='text-center fw-bold'>{item.poomseaccuracy}</div>
                              </div>
                              <div className='col lh-sm'>
                                <div className='text-center' style={{ fontSize: '9px' }}>Presentation</div>
                                <div className='text-center fw-bold'>{item.poomsepresentation}</div>
                              </div>
                              <div className='col lh-sm'>
                                <div className='text-center' style={{ fontSize: '9px' }}>Promedio</div>
                                <div className='text-center fw-bold'>{(item.poomsepresentation+item.poomseaccuracy).toFixed(1)}</div>
                              </div>
                            </div>
                            <hr style={{ margin: '0', padding: '0' }} className='text-light'></hr>
                            <div className='row row-cols g-1'>
                              <div className='col my-auto mx-auto' style={{maxWidth:'27px'}}>
                                {item.ruta != null && <img width='25' src={`${server}/adjunto/${item.ruta}`}></img>}
                              </div>
                              <div className='col text-start lh-sm'>
                                <div className='text-center fw-bold' style={{ fontSize: '10px' }}>Albitro: {index + 1}</div>
                                <div className='text-center fw-bold' style={{ fontSize: '10px' }}>{item.nombres}</div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col' style={{ minWidth: '550px' }}>
            <div className='card w-100 bg-transparent'>
              <div className='card-header '>
                {selectItem !== null &&
                  <div className='row row-cols-2 g-1'>
                    <div className='col lh-1'>
                      <div className="letrasContenido text-light fw-bold">{selectItem.categoria}</div>
                      <div className="letrasContenido text-light fw-bold">{selectItem.nombre}</div>
                    </div>
                    <div className='col'>
                      <div className="letrasContenido text-light fw-bold text-end">{selectItem.genero == 'M' ? 'Masculino' : 'Femenino'}</div>
                    </div>
                  </div>}
              </div>
              <div className='card-body bg-light'>
                <div className='puntuacionTextE text-dark text-center lh-1'>{puntuacion}</div>
              </div>
              <div className='card-footer lh-1'>
                <div className="letrasContenido text-light fw-bold">{selectComp.nombres + ' ' + selectComp.apellidos}</div>
                <div className="letrasContenido text-light fw-bold">{selectComp.club}</div>
                <div className="input-group mb-3">
                  <span className="input-group-text" >Puntos Manual</span>
                  <input type="number" className="form-control form-control-sm" placeholder="Puntuación"
                    onChange={(e) => setPuntuacion(e.target.value)} />
                  <button className='btn btn-success btn-sm' onClick={() => recetearValores(1)}>
                    Guardar Puntuación
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showModal &&
        <div className='bg-dark bg-gradient py-1' style={{ height: '45vh' }}>
          <PrincipalLlavePoomse categorias={categorias} idcampeonato={campeonato.idcampeonato}
            genero={actualizar} llaves={competidores} tipo={'P'} tipoL={'A'} collback={elegirCompetidor} />
        </div>
      }
      <Modal show={showResultado} onHide={() => setShowResultado(false)}
        aria-labelledby="contained-modal-title-vcenter"
        contentClassName='bg-dark bg-gradient'>
        <Modal.Header closeButton closeVariant='white' bsPrefix='modal-header m-0 p-0 px-2 '>
          <Modal.Title >
            <div className='text-light letraMontserratr mx-auto'>
              calificado
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <button className='btn btn-success' onClick={() => recetearValores(1)}>Aceptar</button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default PrincipalPuntPoomse