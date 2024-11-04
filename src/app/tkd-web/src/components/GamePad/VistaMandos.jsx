import React, { useEffect, useState } from 'react'

function VistaMandos(props) {
    const { datos, setActivarLectura, activarLectura, configure, collback,puntoJuego,showStadistic } = props;
    const [lecturas, setLecturas] = useState([]);
    const [cantJueces, setCantJueces] = useState([]);
    function getDibujo(valor) {
        //'d': '', 'D': puntosCabezaGiro, 'P': puntosPunio, 'c': puntosPeto, 'C': puntosPetoGiro,
        //      'b': puntosCabeza, 'B': puntosCabezaGiro, 'E': puntosPunio, 'a': puntosPeto, 'A': puntosPetoGiro
        if (valor == 'd' || valor == 'b') {
            return (
                <button className={` m-0 p-0 btn btn-sm fs-4 ${valor == 'd' ? 'btn-primary' : 'btn-danger'} `}>🤕</button>
            )
        } else if (valor == 'D' || valor == 'B') {
            return (
                <button className={`m-0 p-0  btn btn-sm fs-4 ${valor == 'D' ? 'btn-primary' : 'btn-danger'}`}>🤯</button>
            )
        } else if (valor == 'P' || valor == 'E') {
            return (
                <button className={`m-0 p-0  btn btn-sm fs-4 ${valor == 'P' ? 'btn-primary' : 'btn-danger'}`}>✊</button>
            )
        } else if (valor == 'c' || valor == 'a') {
            return (
                <button className={`m-0 p-0 btn btn-sm fs-4 ${valor == 'c' ? 'btn-primary' : 'btn-danger'}`}>🚶</button>
            )
        } else if (valor == 'C' || valor == 'A') {
            return (
                <button className={`m-0 p-0  btn btn-sm fs-4 ${valor == 'C' ? 'btn-primary' : 'btn-danger'}`}>🤸</button>
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
        console.log("modificacion de la lectura de mandos")   
        if(configure!=null){
            var albitro = new Array(parseInt(configure.numMandos)).fill(0);
            setCantJueces(albitro);
        }
        if(puntoJuego.reset==true||(puntoJuego.newRound==true &&puntoJuego.newRound!=undefined)){
            setLecturas([])
        }
    }, [configure,puntoJuego])
    return (
        <div className='card bg-dark bg-gradient'>
            <div className='card-header m-0 p-0'>
                <div className="input-group">
                    <span className="text-light mx-2" >Lectura Mando</span>
                    <button className={`btn btn-sm ${activarLectura ? 'btn-success' : 'botonNegro'}`}
                        onClick={() => setActivarLectura(!activarLectura)}>
                        <i className="fa-solid fa-glasses"></i>{activarLectura ?'(l)':'(L)'}</button>
                    <button className='btn btn-sm mx-2 botonNegro'
                        onClick={()=>showStadistic(lecturas)}>
                        <i className="fa-solid fa-magnifying-glass-chart"></i>
                    </button>
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
                                <tr key={index} className='m-0 p-0'>
                                    {cantJueces.map((i, j) => {
                                        return (
                                            <td scope="col m-0 p-0" key={j}>
                                                {item[j] != undefined ? getDibujo(item[j].dato) : <div className='m-0 p-0 my-auto'><i className="fa-solid fa-plug-circle-xmark text-danger fa-2xl"></i></div>}
                                                {item[j] != undefined &&<>
                                                    <div className='text-dark lh-1' style={{fontSize:'9px'}}>{item[j].nombres}</div>
                                                    <div className='text-dark lh-1' style={{fontSize:'9px'}}>{item[j].nameclub}</div>
                                                </>}
                                            </td>)
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
