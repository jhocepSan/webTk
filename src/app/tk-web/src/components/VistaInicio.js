import React, { useEffect, useState, useContext } from 'react'
import { ContextAplicacions } from './Context/ContextAplicacion';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import MsgUtils from './utils/MsgUtils';
const server = process.env.REACT_APP_SERVER

function VistaInicio() {
  const navigate = useNavigate();
  const { setLogin, setUserLogin,login } = useContext(ContextAplicacions);
  const [campeonatos, setCampeonatos] = useState([]);
  const [campeonato, setCampeonato] = useState();
  const cambiarCampeonato = (dato) => {
    var info = campeonatos.filter((item) => item.idcampeonato == dato);
    setCampeonatos(dato);
    localStorage.setItem("campeonato", JSON.stringify(info[0]));
  }
  useEffect(()=>{
    if(login){
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
            setCampeonato(data.ok[0].idcampeonato);
            localStorage.setItem("campeonato", JSON.stringify(data.ok[0]));
          } else {
            MsgUtils.msgError(data.error);
          }
        })
        .catch(error => MsgUtils.msgError(error));
    }
  },[login])
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
                  <div className='btn-group btn-group-sm w-100'>
                    <select className="form-select form-select-sm btn-secondary" value={campeonato} onChange={(e) => cambiarCampeonato(e.target.value)}>
                      {campeonatos.map((item, index) => {
                        return (
                          <option value={item.idcampeonato} key={index}>{item.nombre}</option>
                        )
                      })}
                    </select>
                    <button className='btn btn-sm btn-success bg-gradient w-25'>
                      <i className="fa-solid fa-circle-plus"></i> Nuevo
                    </button>
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
    </>
  )
}

export default VistaInicio
