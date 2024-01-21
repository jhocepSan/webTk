import React, { useEffect, useState } from 'react'
import {limpiarMandos} from '../utils/UtilsConsultas'
function VistaMandos(props) {
    const { datos, setActivarLectura, activarLectura, configure, collback } = props;
    const [lecturas, setLecturas] = useState([]);
    const [cantJueces, setCantJueces] = useState([]);
    function getDibujo(valor) {
        //'d': '', 'D': puntosCabezaGiro, 'P': puntosPunio, 'c': puntosPeto, 'C': puntosPetoGiro,
        //      'b': puntosCabeza, 'B': puntosCabezaGiro, 'E': puntosPunio, 'a': puntosPeto, 'A': puntosPetoGiro
        if (valor == 'd' || valor == 'b') {
            return (
                <button className={`btn btn-sm fs-4 ${valor == 'd' ? 'btn-primary' : 'btn-danger'} `}>🤕</button>
            )
        } else if (valor == 'D' || valor == 'B') {
            return (
                <button className={`btn btn-sm fs-4 ${valor == 'D' ? 'btn-primary' : 'btn-danger'}`}>🤯</button>
            )
        } else if (valor == 'P' || valor == 'E') {
            return (
                <button className={`btn btn-sm fs-4 ${valor == 'P' ? 'btn-primary' : 'btn-danger'}`}>✊</button>
            )
        } else if (valor == 'c' || valor == 'a') {
            return (
                <button className={`btn btn-sm fs-4 ${valor == 'c' ? 'btn-primary' : 'btn-danger'}`}>🚶</button>
            )
        } else if (valor == 'C' || valor == 'A') {
            return (
                <button className={`btn btn-sm fs-4 ${valor == 'C' ? 'btn-primary' : 'btn-danger'}`}>🤸</button>
            )
        }
    }
    useEffect(() => {
        if (datos) {
            collback(datos.ok.map(item=>item.dato));
            /*var cont = parseInt(localStorage.getItem('contAux'));
            var validaData = datos.ok.filter(item=>item.dato!='')
            if(configure!=null && validaData.length!=0){
                if(cont<parseInt(configure.esperaTime)-1){
                    localStorage.setItem('contAux',cont+1);
                }else{
                    limpiarMandos(0);
                    localStorage.setItem('contAux',0);
                }
            }*/
            setLecturas([datos.ok, ...lecturas])
        }
    }, [datos])
    useEffect(() => {        
        if(configure!=null){
            var albitro = new Array(parseInt(configure.numMandos)).fill(0);
            setCantJueces(albitro);
        }
    }, [configure])
    return (
        <div className='card bg-dark bg-gradient'>
            <div className='card-header'>
                <div className="input-group">
                    <span className="text-light mx-2" >Lectura de Mandos</span>
                    <button className={`btn btn-sm ${activarLectura ? 'btn-danger' : 'btn-success'}`}
                        onClick={() => setActivarLectura(!activarLectura)}>
                        <i className="fa-solid fa-glasses"></i></button>
                </div>
            </div>
            <div className='table-responsive conainer-fluid' style={{ maxHeight: '63vh' }}>
                <table className="table table-sm table-bordered bg-light text-center">
                    <thead>
                        <tr>
                            {cantJueces.map((i, index) => {
                                return (<th scope="col" key={index}>{'Mando ' + (index + 1)}</th>)
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {lecturas.map((item, index) => {
                            return (
                                <tr key={index}>
                                    {cantJueces.map((i, j) => {
                                        return (<td scope="col" key={j}>{item[j] != undefined ? getDibujo(item[j].dato) : <i className="fa-solid fa-plug-circle-xmark text-danger fa-2xl"></i>}</td>)
                                    })}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default VistaMandos
