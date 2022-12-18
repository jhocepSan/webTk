import React, { useEffect, useState } from 'react'
import Header from '../Header'

function PrincipalRegistroCompetidor() {
  const [titulo, setTitulo] = useState('');
  useEffect(() => {
    var info = JSON.parse(localStorage.getItem('campeonato'))
    setTitulo(info.nombre);
  }, [])
  return (
    <>
      <Header />
      <div className='container-fluid bg-dark'>
        <div className='row'>
          <div className='col'>
            <div className='text-light letraMontserratr'>
              Registro en el campeonato {titulo}
            </div>
          </div>
          <div className='col-2'>
            <div className="input-group input-group-sm">
              <input type="text" className="form-control form-control-sm" placeholder="Buscar Competidor" />
              <button className='btn btn-sm btn-danger'>
                <i className="fa-solid fa-delete-left"></i>
              </button>
            </div>
          </div>
          <div className='col-2 text-end'>
            <button className='btn btn-sm btn-success bg-gradient'>
              Agregar <i className="fa-solid fa-square-plus fa-xl"></i>
            </button>
          </div>
        </div>
      </div>
      <div className='table-responsive'>
        <table className="table table-dark table-striped table-hover">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">First</th>
              <th scope="col">Last</th>
              <th scope="col">Handle</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1</th>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>Jacob</td>
              <td>Thornton</td>
              <td>@fat</td>
            </tr>
            <tr>
              <th scope="row">3</th>
              <td colspan="2">Larry the Bird</td>
              <td>@twitter</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

export default PrincipalRegistroCompetidor
