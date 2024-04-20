import React, { useContext, useEffect, useState } from 'react'
import Header from '../Header';
import { useNavigate, Link } from 'react-router-dom';
import { limpiarLecturasPoomse, getPuntosPoomse,setPuntuacionPoomse } from '../utils/UtilsConsultas';
import { ContextAplicacions } from '../Context/ContextAplicacion';
import MsgUtils, { server } from '../utils/MsgUtils';
import PrincipalLlavePoomse from '../ListaCompetidores/PrincipalLlavePoomse';
import UtilsBuffer from '../utils/UtilsBuffer';
import Modal from 'react-bootstrap/Modal';

function PrincipalPuntPoomse() {
  const navigate = useNavigate();
  const { setLogin, setUserLogin, campeonato, setCampeonato, setTitulo } = useContext(ContextAplicacions);
  const [config,setConfig] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showResultado, setShowResultado] = useState(false);
  const [tipom, setTipoM] = useState('');
  const [runPlay, setRunPlay] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [listaElegida, setListaElegida] = useState([]);
  const [competidores, setCompetidores] = useState([]);
  const [selectItem, setSelectItem] = useState(null);
  const [puntuacion, setPuntuacion] = useState(0);
  const [selectComp, setSelectComp] = useState({});
  const [segundo, setSegundo] = useState(0);
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
  const recetearValores=async()=>{
    await limpiarLecturasPoomse({'sector':1})
    await setPuntuacionPoomse({'puntuacion':puntuacion,'idclasificacion':selectComp.idclasificacion})
    setPuntuacion(0);
    setShowResultado(false);
    setRunPlay(false);
  }
  const obtenerDatosPunto=async()=>{
    if(runPlay==true){
      var datos = await getPuntosPoomse({'sector':1})
      if(datos.ok){
        if(datos.ok.length==parseInt(config.numJueces)){
          if(config.enablePromedio){
            var puntuacionMando=datos.ok.map(item=>item.poomseaccuracy+item.poomsepresentation);
            var sumatoria = puntuacionMando.reduce(function(acumulador, siguienteValor){
              return acumulador + siguienteValor;
            }, 0);
            localStorage.setItem('puntuacionPoomse', JSON.stringify({
              'selectComp': selectComp,
              'puntuacion': (sumatoria/datos.ok.length).toFixed(1),
              'selectItem': selectItem,
              'runPlay': runPlay
            }));
            setPuntuacion((sumatoria/datos.ok.length).toFixed(1));
            setShowResultado(true);
          }
        }
      }
    }
    setSegundo(segundo+1)
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
    if(confi!=undefined||confi!=null){
      setConfig(confi);
    }else{
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
          onClick={() => console.log("")}>
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
            <div className='card bg-transparent'>
              <div className='card-header bg-dark'>
                <div className='text-light'>Lista Competidores</div>
              </div>
              <div className='card-body m-0 p-0'>
                <div className='overflow-auto' style={{ maxHeight: '45vh' }}>
                  <div className='bg-secondary'>
                    <ul className="list-group">
                      {listaElegida.map((item, index) => {
                        return (
                          <li className={`${item.idcompetidor == selectComp.idcompetidor ? 'bg-success ' : 'bg-dark '}list-group-item w-100 mb-1`} key={index}
                            onClick={() => selectCompetidor({ ...item, 'position': index })}>
                            <div className="card bg-transparent flex-row m-0 p-0" style={{ border: 'none' }} >
                              {UtilsBuffer.getFotoCard(item.FOTO, 40)}
                              <div className='ps-2 my-auto text-start' style={{ fontSize: '16px' }}>
                                <div className="letrasContenido text-light">{item.nombres + ' ' + item.apellidos}</div>
                                <div className='letrasContenido text-light'>Club: <span className='fw-bold'>{item.club}</span></div>
                                <div className='letrasContenido text-light'>Grado: <span className='fw-bold'>{item.grado}</span></div>
                              </div>
                            </div>
                          </li>)
                      })}
                    </ul>
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
                    <div className='col'>
                      <div className="letrasContenido text-light fw-bold">{selectItem.categoria}</div>
                      <div className="letrasContenido text-light fw-bold">{selectItem.nombre}</div>
                    </div>
                    <div className='col'>
                      <div className="letrasContenido text-light fw-bold text-end">{selectItem.genero == 'M' ? 'Masculino' : 'Femenino'}</div>
                    </div>
                  </div>}
              </div>
              <div className='card-body bg-light'>
                <div className='puntuacionTextE text-dark text-center'>{puntuacion}</div>
              </div>
              <div className='card-footer'>
                <div className="letrasContenido text-light fw-bold">{selectComp.nombres + ' ' + selectComp.apellidos}</div>
                <div className="letrasContenido text-light fw-bold">{selectComp.club}</div>
                <div className="input-group mb-3">
                  <span className="input-group-text" >Puntos Manual</span>
                  <input type="number" className="form-control form-control-sm" placeholder="Puntuación" />
                  <button className='btn btn-success btn-sm'>Aceptar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showModal &&
        <div className='bg-dark bg-gradient py-1' style={{ height: '45vh' }}>
          <PrincipalLlavePoomse categorias={categorias} idcampeonato={campeonato.idcampeonato}
            genero={''} llaves={competidores} tipo={'P'} tipoL={'A'} collback={elegirCompetidor} />
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
          <button className='btn btn-success' onClick={()=>recetearValores()}>Aceptar</button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default PrincipalPuntPoomse