import React, { useEffect, useState } from 'react'
import MsgUtils from '../utils/MsgUtils';
import { server } from '../utils/MsgUtils';

function PrincipalLlavePoomse(props) {
    const { categorias, idcampeonato, genero, llaves, tipo, tipoL, collback } = props;
    const [selectItem, setSelectItem] = useState({});
    const [listaFiltrada, setListaFiltrada] = useState([]);
    const [grados, setGrados] = useState([]);
    const [idcompetidor,setIdCompetidor] = useState(0);
    function verLlavesCategoriaOficial(dato) {
        setSelectItem(dato);
        var filtro = llaves.filter((item) => item.idcategoria == dato.idcategoria);
        var listaAux = []
        for (var gra of grados) {
            var aux = filtro.filter((item) => item.idgrado == gra.idgrado);
            if (aux.length !== 0) {
                listaAux.push({ 'GRADO': gra, 'COMPETIDORES': aux })
            }
        }
        console.log(listaAux);
        setListaFiltrada(listaAux);
    }
    useEffect(() => {
        console.log(idcampeonato, tipo)
        if (grados.length == 0) {
            fetch(`${server}/config/getGradoCompleto`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify({
                    'info': { 'idcampeonato': idcampeonato, 'tipo': tipo }
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.ok) {
                        setGrados(data.ok.grados);
                    } else {
                        MsgUtils.msgError(data.error);
                    }
                })
                .catch(error => MsgUtils.msgError(error));
        }
    }, [])
    return (
        <div>
            <div className=' mb-2'>
                <div className='btn-group btn-group-sm mb-2'>
                    {categorias.map((item, index) => {
                        return (
                            <button className={`btn btn-sm letraBtn ${selectItem.idcategoria === item.idcategoria ? 'botonLlave' : item.genero == 'M' ? 'botonMasc' : 'botonFeme'}`}
                                onClick={() => verLlavesCategoriaOficial(item)}
                                key={index} style={{ marginRight: '2px' }}>
                                {item.nombre} {tipoL == 'A' && <span>{item.genero == 'M' ? 'Masculino' : 'Femenino'}</span>}
                            </button>
                        )
                    })}
                </div>
            </div>
            {listaFiltrada.length == 0 &&
                <div className='container-fluid w-100'>
                    <div className="alert alert-warning w-100 text-center" role="alert">
                        No existe competidores !!!!
                    </div>
                </div>}
            {listaFiltrada.length !== 0 &&
                <div className='container-fluid bg-light overflow-auto' style={{height:'37vh'}}>
                    {listaFiltrada.map((item, index) => {
                        return (
                            <div key={index}>
                                <div className='row row-cols g-1' >
                                    <div className='col'>
                                        <div className='tituloHeader'>Categoria: <span className='fw-bold'>{selectItem.nombre}</span> {selectItem.genero == 'M' ? 'Masculino' : 'Femenino'}</div>
                                        <div className='tituloHeader'>Grado: <span className='fw-bold'>{item.GRADO.nombre}</span></div>
                                    </div>
                                    <div className='col'>
                                        <div className='tituloHeader'>Edad: <span className='fw-bold'>{selectItem.edadini}</span> - <span className='fw-bold'>{selectItem.edadfin} Años</span></div>
                                    </div>
                                    {tipoL == 'A' && <div className='col-2 my-auto d-none'>
                                        <button className='btn btn-success btn-gradient w-100'
                                            onClick={() => collback({...item,...selectItem})}>
                                            <i className="fa-solid fa-check-double"></i> Elegir
                                        </button>
                                    </div>}
                                </div>
                                <div className='container-fluid' >
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Nombre</th>
                                                <th>Edad</th>
                                                <th>Club</th>
                                                <th>Cinturon</th>
                                                <th>Grado</th>
                                                <th>Punto</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {item.COMPETIDORES.map((comp, kj) => {
                                                return (
                                                    <tr key={kj} className={`${idcompetidor==comp.idcompetidor?'botonMasc':''}`}>
                                                        <td>{comp.nombres + ' ' + comp.apellidos}</td>
                                                        <td>{comp.edad}</td>
                                                        <td>{comp.club}</td>
                                                        <td>{comp.cinturon}</td>
                                                        <td>{comp.grado}</td>
                                                        <td>{comp.puntuacion!=undefined?comp.puntuacion:''}</td>
                                                        {tipoL == 'A' &&
                                                        <th>
                                                            <button className='btn btn-sm btn-outline-success'
                                                                onClick={()=>{setIdCompetidor(comp.idcompetidor);collback({...item,...selectItem,'competidor':comp});}}>
                                                                <i className="fa-solid fa-file-signature"></i>
                                                            </button>
                                                        </th>}
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>)
                    })}
                </div>}
        </div>
    )
}

export default PrincipalLlavePoomse