import React, { useEffect, useState } from 'react'
import Header from '../Header';
import UtilsCargador from '../utils/UtilsCargador';
const server = process.env.REACT_APP_SERVER;

function PrincipalListaCompetidor() {
    const [cargador, setCargador] = useState(false);
    const [titulo,setTitulo] = useState('');
    const [idCampeonato,setIdCampeonato] = useState();
    const [tipo, setTipo] = useState('');
    const [genero, setGenero] = useState('');
    function buscarCompetidor() {
        var input, filter, table, tr, td, i, txtValue;
        input = document.getElementById("competidor");
        filter = input.value.toUpperCase();
        table = document.getElementById("competidoresLista");
        tr = table.getElementsByTagName("tr");
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("div")[0];
            if (td) {
                var valor = td.getElementsByTagName('div')[1].innerHTML;
                if (valor.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    }
    useEffect(() => {
        var info = JSON.parse(localStorage.getItem('campeonato'));
        var user = JSON.parse(localStorage.getItem('login'));
        setTitulo(info.nombre);
        setIdCampeonato(info.idcampeonato);
        /*fetch(`${server}/club/getListaClub`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    setListaClubs(data.ok);
                    setClub(user.idclub);
                } else {
                    MsgUtils.msgError(data.error);
                }
            })
            .catch(error => MsgUtils.msgError(error));*/
    }, [])
    return (
        <div>
            <Header />
            <UtilsCargador show={cargador} />
            <div className='container-fluid bg-dark bg-gradient'>
                <div className='row g-1'>
                    <div className='col-8 col-md-4 my-auto'>
                        <div className='text-light letraMontserratr'>
                            Competidores Camp. {titulo}
                        </div>
                    </div>
                    <div className='col-4 col-md-2'>
                        <select className="form-select form-select-sm btn-secondary" value={tipo}
                            onChange={(e) => setTipo(e.target.value)}>
                            <option value=''>Tipo (Ninguno)</option>
                            <option value="C">Combate</option>
                            <option value="P">Poomse</option>
                            <option value="CN">Cintas Negras</option>
                            <option value="R">Rompimiento</option>
                        </select>
                    </div>
                    <div className='col-4 col-md-2'>
                        <select className="form-select form-select-sm bg-secondary text-light border-secondary"
                            value={genero} onChange={(e) => setGenero(e.target.value)}>
                            <option value={''}>Genero</option>
                            <option value={'M'}>Masculino</option>
                            <option value={'F'}>Femenino</option>
                        </select>
                    </div>
                    <div className='col-8 col-md-2'>
                        <div className="input-group input-group-sm">
                            <input type="text" className="form-control form-control-sm"
                                placeholder="Buscar Competidor" id='competidor' onChange={() => buscarCompetidor()} />
                            <button className='btn btn-sm btn-danger m-0 p-0' onClick={() => { document.getElementById('competidor').value = ''; buscarCompetidor(); }}>
                                <i className="fa-solid fa-delete-left fa-xl"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='container-fluid bg-secondary bg-gradient'>
                <div className='row g-1'>
                
                </div>
            </div>

        </div>
    )
}

export default PrincipalListaCompetidor