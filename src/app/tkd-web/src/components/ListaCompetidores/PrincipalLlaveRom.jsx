import React, { useEffect, useState } from 'react'
import MsgUtils, { server } from '../utils/MsgUtils';

function PrincipalLlaveRom(props) {
    const { categorias, idcampeonato, genero, llaves, tipo, tipoL, collback,actualizarInfo } = props;
    const [selectItem, setSelectItem] = useState({});
    const [listaFiltrada, setListaFiltrada] = useState([]);
    const [grados, setGrados] = useState([]);
    const [tipoCamp, setTipoCamp] = useState([]);
    function verLlavesCategoriaOficial(dato) {
        setSelectItem(dato);
        var filtro = llaves.filter((item) => item.idcategoria == dato.idcategoria);
        var seleccionado = []
        for (var gra of grados) {
            for (var tpc of tipoCamp) {
                var aux = filtro.filter((item) => item.idgrado == gra.idgrado && item.idtipocompetencia == tpc.idtipo);
                if (aux.length !== 0) {
                    seleccionado.push({ 'GRADO': gra, 'TIPOC': tpc, 'COMPETIDORES': aux })
                }
            }
        }
        console.log(seleccionado)
        /*if (listaAux.length !== 0) {
            seleccionado.push({ ...subcat, 'COMPETIDORES': listaAux })
        }*/
        setListaFiltrada(seleccionado);
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
                        setTipoCamp(data.ok.tipocamp);
                    } else {
                        MsgUtils.msgError(data.error);
                    }
                })
                .catch(error => MsgUtils.msgError(error));
        }
    }, [])
    return (
        <div>
            <div className='overflow-auto mb-2'>
                <div className='btn-group btn-group-sm mb-2'>
                    {tipoL == 'A' && <button className='btn btn-success' onClick={()=>{setListaFiltrada([]);setSelectItem({});actualizarInfo()}}><i className="fa-solid fa-rotate"></i>Actualizar</button>}
                    {categorias.map((item, index) => {
                        return (
                            <button className={`btn btn-sm letraBtn ${selectItem.idcategoria === item.idcategoria ? 'botonLlave' : 'btn-light'}`} onClick={() => verLlavesCategoriaOficial(item)}
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
                <div className='container-fluid bg-light'>
                    {listaFiltrada.map((item, index) => {
                        return (
                            <div key={index}>
                                <div className='row row-cols g-1' >
                                    <div className='col'>
                                        <div className='tituloHeader'>Categoria: <span className='fw-bold'>{selectItem.nombre}</span> {selectItem.genero == 'M' ? 'Masculino' : 'Femenino'}</div>
                                    </div>
                                    <div className='col'>
                                        <div className='tituloHeader'>Edad: <span className='fw-bold'>{selectItem.edadini}</span> - <span className='fw-bold'>{selectItem.edadfin} Años</span></div>
                                    </div>
                                </div>
                                <div className='row row-cols g-1'>
                                    <div className='col'>
                                        <div className='text-start fw-bold' >{'Grado: ' + item.GRADO.nombre}</div>
                                    </div>
                                    <div className='col'>
                                        <div className='text-start fw-bold' >{item.TIPOC.descripcion}</div>
                                    </div>
                                    {tipoL == 'A' && <div className='col-2 my-auto'>
                                        <button className='btn btn-success btn-gradient w-100'
                                            onClick={() => collback({
                                                'filtro': {
                                                    'idcategoria': item.idcategoria,
                                                    'categoria': selectItem.nombre,
                                                    'genero': selectItem.genero,
                                                    'edadini': selectItem.edadini,
                                                    'edadfin': selectItem.edadfin,
                                                    'idsubcategoria': item.idsubcategoria,
                                                    'subcategoria': item.nombre,
                                                    'pesofin': item.pesofin,
                                                    'pesoini': item.pesoini
                                                }, 'info': item
                                            })}>
                                            <i className="fa-solid fa-check-double"></i> Elegir
                                        </button>
                                    </div>}
                                </div>
                                <div className='container-fluid table-responsive m-0 p-0' >
                                    <table className="table table-dark">
                                        <thead>
                                            <tr>
                                                <th>Nombre</th>
                                                <th>edad</th>
                                                <th>club</th>
                                                <th>Grado</th>
                                                <th>Tipo Rompimiento</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {item.COMPETIDORES.map((comp, kj) => {
                                                return (
                                                    <tr key={kj}>
                                                        <th>{comp.nombres + ' ' + comp.apellidos}</th>
                                                        <td>{comp.edad}</td>
                                                        <td>{comp.club}</td>
                                                        <td>{comp.grado}</td>
                                                        <td>{comp.tiponombre}</td>
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

export default PrincipalLlaveRom