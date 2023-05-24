import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import { ContextAplicacions } from '../Context/ContextAplicacion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import MsgUtils from '../utils/MsgUtils';
import {server} from '../utils/MsgUtils';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Resultados Oro',
    },
  },
};

function PrincipalResultados() {
  const navigate = useNavigate();
  const { setLogin, setUserLogin, campeonato, setCampeonato, setTitulo, listaCampeonatos } = useContext(ContextAplicacions);
  const [idCampeonato, setIdCampeonato] = useState(0);
  const [data, setData] = useState(null)
  const [dataP, setDataP] = useState(null)
  const [listaSN, setListaSN] = useState(null);
  const [listaCF, setListaCF] = useState([]);
  const [listaPF, setListaPF] = useState([]);
  const [listaSNP, setListaSNP] = useState([]);
  function obtenerPuntuacion() {
    setData(null);
    setDataP(null);
    setListaSN(null);
    console.log("sacarndo in formacion de las ")
    fetch(`${server}/competidor/obtenerDatosPuntuados`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ idCampeonato })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data.ok) {
          setListaCF(data.ok.FC)
          setListaPF(data.ok.FP)
          setListaSNP(data.ok.SNP)
          var datos = data.ok.FC.map(item => item.oro)
          var datosP = data.ok.FP.map(item => item.oro)
          console.log(datos);
          setData({
            labels: data.ok.FC.map(item => item.nombre),
            datasets: [
              {
                label: "FESTIVAL COMBATE",
                data: datos,
                backgroundColor: '#E8B400',
              }
            ]
          })
          setDataP({
            labels: data.ok.FP.map(item => item.nombre),
            datasets: [
              {
                label: "FESTIVAL POOMSE",
                data: datosP,
                backgroundColor: '#E8B400',
              }
            ]
          })
          setListaSN({
            labels: data.ok.SNP.map(item => item.nombre),
            datasets: [
              {
                label: 'COMPETIDOR SIN PELEA',
                data: data.ok.SNP.map(item => item.oro),
                backgroundColor: '#E8B400',
              }
            ]
          })
        } else {
          MsgUtils.msgError(data.error);
        }
      })
      .catch(error => MsgUtils.msgError(error));
  }
  useEffect(() => {
    var info = JSON.parse(localStorage.getItem('campeonato'));
    var sessionActiva = JSON.parse(localStorage.getItem('login'));
    if (sessionActiva !== null) {
      setTitulo('RESULTADOS')
      setCampeonato(info);
      setIdCampeonato(info.idcampeonato);
      setLogin(true);
      setUserLogin(sessionActiva);
      navigate("/resultCamp", { replace: true });
    }
  }, [])
  return (
    <>
      <Header />
      <div className='container-fluid py-2 bg-secondary bg-gradient'>
        <div className='row g-1'>
          <div className='col' style={{ maxWidth: '120px' }}>
            Campeonato
          </div>
          <div className='col' style={{ maxWidth: '180px' }}>
            <select className="form-select form-select-sm " value={idCampeonato} onChange={(e) => setIdCampeonato(e.target.value)}>
              {listaCampeonatos.map((item, index) => {
                return (
                  <option value={item.idcampeonato} key={index}>{item.nombre}</option>
                )
              })}
            </select>
          </div>
          <div className='col' style={{ maxWidth: '120px' }}>
            <button className='btn btn-sm btn-success' onClick={() => obtenerPuntuacion()}>
              <i className="fa-solid fa-magnifying-glass-chart fa-fade"></i> Buscar
            </button>
          </div>
        </div>
      </div>
      <div className='container-fluid py-2'>
        <div className='row row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-lg-2 g-2'>
          {data != null && <div className='col bg-light'>
            <div className='table-responsive py-2'>
              <table className='table table-sm table-striped table-hover'>
                <thead className='text-center bg-primary text-light'>
                  <tr>
                    <th className='col-1'>Club</th>
                    <th className='col-4'>Nombre</th>
                    <th className='col-1'>Medalla ORO</th>
                  </tr>
                </thead>
                <tbody>
                  {listaCF.map((item, index) => {
                    return (
                      <tr key={index}>
                        <th className='col-1'>{item.abreviado}</th>
                        <th className='col-4'>{item.nombre}</th>
                        <th className='col-1'>{item.oro}</th>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <Bar options={options} data={data} />
          </div>}
          {dataP != null && <div className='col bg-light'>
            <div className='table-responsive py-2'>
              <table className='table table-sm table-striped table-hover'>
                <thead className='text-center bg-primary text-light'>
                  <tr>
                    <th className='col-1'>Club</th>
                    <th className='col-4'>Nombre</th>
                    <th className='col-1'>Medalla ORO</th>
                  </tr>
                </thead>
                <tbody>
                  {listaPF.map((item, index) => {
                    return (
                      <tr key={index}>
                        <th className='col-1'>{item.abreviado}</th>
                        <th className='col-4'>{item.nombre}</th>
                        <th className='col-1'>{item.oro}</th>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <Bar options={options} data={dataP} />
          </div>}
        </div>
      </div>
      <div className='container-fluid py-2'>
        <div className='row row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-lg-2 g-2'>
          {listaSN != null && <div className='col bg-light'>
            <div className='table-responsive py-2'>
              <table className='table table-sm table-striped table-hover'>
                <thead className='text-center bg-primary text-light'>
                  <tr>
                    <th className='col-1'>Club</th>
                    <th className='col-4'>Nombre</th>
                    <th className='col-1'>Medalla ORO</th>
                  </tr>
                </thead>
                <tbody>
                  {listaSNP.map((item, index) => {
                    return (
                      <tr key={index}>
                        <th className='col-1'>{item.abreviado}</th>
                        <th className='col-4'>{item.nombre}</th>
                        <th className='col-1'>{item.oro}</th>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <Bar options={options} data={listaSN} />
          </div>}
        </div>
      </div>
    </>
  )
}

export default PrincipalResultados

