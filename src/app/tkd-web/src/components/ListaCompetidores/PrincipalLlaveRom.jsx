import React, { useEffect, useState } from 'react'
import MsgUtils, { server } from '../utils/MsgUtils';

function PrincipalLlaveRom(props) {
    const { categorias, idcampeonato, genero, llaves, tipo, tipoL, collback } = props;
    const [selectItem, setSelectItem] = useState({});
    const [listaFiltrada, setListaFiltrada] = useState([]);
    const [grados, setGrados] = useState([]);
    const [tipoCamp, setTipoCamp] = useState([]);
    function verLlavesCategoriaOficial(dato) {
        setSelectItem(dato);
        var filtro = llaves.filter((item) => item.idcategoria == dato.idcategoria);
        var seleccionado = []
        for (var subcat of dato.SUBCATEGORIA) {
            var listaAux = []
            for (var gra of grados) {
                for (var tpc of tipoCamp) {
                    var aux = filtro.filter((item) => item.idsubcategoria == subcat.idsubcategoria && item.idgrado == gra.idgrado && item.idtipocompetencia == tpc.idtipo);
                    if (aux.length !== 0) {
                        listaAux.push({ 'GRADO': gra, 'TIPOC': tpc, 'COMPETIDORES': aux })
                    }
                }
            }
            if (listaAux.length !== 0) {
                seleccionado.push({ ...subcat, 'COMPETIDORES': listaAux })
            }
        }
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
                                        <div className='tituloHeader'>Sub-Categoria: <span className='fw-bold'>{item.nombre}</span></div>
                                    </div>
                                    <div className='col'>
                                        <div className='tituloHeader'>Edad: <span className='fw-bold'>{selectItem.edadini}</span> - <span className='fw-bold'>{selectItem.edadfin} Años</span></div>
                                        <div className='tituloHeader'>Peso: <span className='fw-bold'>{item.pesoini}</span> - <span className='fw-bold'>{item.pesofin} Kg</span></div>
                                    </div>
                                </div>
                                {item.COMPETIDORES.map((dato, id) => {
                                    return (
                                        <div className='container-fluid' key={id}>
                                            <div className='row row-cols g-1'>
                                                <div className='col'>
                                                    <div className='text-center fw-bold' >{dato.GRADO.nombre}</div>
                                                </div>
                                                <div className='col'>
                                                    <div className='text-center fw-bold' >{dato.TIPOC.descripcion}</div>
                                                </div>
                                                {tipoL == 'A' && <div className='col-2 my-auto'>
                                                    <button className='btn btn-success btn-gradient w-100' 
                                                        onClick={() => collback({'filtro':{'idcategoria':item.idcategoria,
                                                                            'categoria':selectItem.nombre,
                                                                            'genero':selectItem.genero,
                                                                            'edadini':selectItem.edadini,
                                                                            'edadfin':selectItem.edadfin,
                                                                            'idsubcategoria':item.idsubcategoria,
                                                                            'subcategoria':item.nombre,
                                                                            'pesofin':item.pesofin,
                                                                            'pesoini':item.pesoini},'info':dato})}>
                                                        <i className="fa-solid fa-check-double"></i> Elegir
                                                    </button>
                                                </div>}
                                            </div>
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th>Orden Competición</th>
                                                        <th>Nombre</th>
                                                        <th>edad</th>
                                                        <th>club</th>
                                                        <th>Tipo Rompimiento</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {dato.COMPETIDORES.map((comp, kj) => {
                                                        return (
                                                            <tr key={kj}>
                                                                <th>{comp.orden}</th>
                                                                <td>{comp.nombres + ' ' + comp.apellidos}</td>
                                                                <td>{comp.edad}</td>
                                                                <td>{comp.club}</td>
                                                                <td>{comp.tiponombre}</td>
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    )
                                })}
                            </div>)
                    })}
                </div>}
        </div>
    )
}

export default PrincipalLlaveRom