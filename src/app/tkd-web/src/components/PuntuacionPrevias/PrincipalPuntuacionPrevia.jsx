import React, { useContext, useEffect, useState } from 'react'
import Header from '../Header'
import { useNavigate } from 'react-router-dom';
import { ContextAplicacions } from '../Context/ContextAplicacion';
import { server } from '../utils/MsgUtils';
import UtilsCargador from '../utils/UtilsCargador';
import PrincipalLlaveRom from '../ListaCompetidores/PrincipalLlaveRom';

function PrincipalPuntuacionPrevia() {
  const navigate = useNavigate();
  const { setLogin, setUserLogin, login, campeonato, setCampeonato, userLogin, listaCampeonatos, setListaCampeonatos, inscripcionOpen, setInscripcionOpen } = useContext(ContextAplicacions);
  const [tipo, setTipo] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [loading,setLoading] = useState(false);
  const [competidores,setCompetidores] = useState([]);
  
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
  function getInformacionRompimiento() {
    fetch(`${server}/competidor/getInformacionRompimiento`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ 'idCampeonato': campeonato.idcampeonato, 'tipo': 'R','estado':'C' })
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.ok) {
          console.log(data.ok);
          setCompetidores(data.ok);
        } else {
          MsgUtils.msgError(data.error);
        }
      })
      .catch(error => MsgUtils.msgError(error));
  }
  function obtenerResultados(){
    if(tipo=='R'){
      getInformacionRompimiento();
    }
  }
  useEffect(() => {
    var sessionActiva = JSON.parse(localStorage.getItem('login'))
    categorias.length == 0 ? getInformacionCategoria() : '';
    if (sessionActiva !== null) {
      setLogin(true);
      setUserLogin(sessionActiva);
      navigate("/pointPreviaC", { replace: true });
    }
  }, [])
  return (
    <>
      <Header />
      <div className='container-fluid bg-dark bg-gradient py-1'>
        <div className='row row-cols g-1'>
          <div className='col' style={{ maxWidth: '120px', minWidth: '120px' }}>
            <select className="form-select form-select-sm btn-secondary letraBtn" value={tipo}
              onChange={(e) => { setTipo(e.target.value); }}>
              <option value=''>Tipo (Ninguno)</option>
              <option value="C">Combate</option>
              <option value="P">Poomse</option>
              <option value="D">Demostraciones</option>
              <option value="R">Rompimiento</option>
            </select>
          </div>
          <div className='col' style={{ maxWidth: '100px', minWidth: '100px' }}>
            <button className='btn btn-sm btn-success w-100' onClick={()=>obtenerResultados()}><i className="fa-solid fa-spinner"></i> Cargar</button>
          </div>
        </div>
      </div>
      <PrincipalLlaveRom categorias={categorias} idcampeonato={campeonato.idcampeonato} llaves={competidores} tipo={tipo} tipoL='R'/>
      <UtilsCargador show={loading} />
    </>
  )
}

export default PrincipalPuntuacionPrevia