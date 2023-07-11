import React, { useEffect, useState } from 'react'

function ScoreRompimiento() {
    const [selectItem, setSelectItem] = useState({});
    const [selectComp, setSelectComp] = useState({});
    const [puntuacion, setPuntuacion] = useState(null);
    const [runPlay, setRunPlay] = useState(false);
    const [value, setValue] = useState(0);
    setTimeout(() => {
        setValue(value+1);
    }, 500);
    useEffect(() => {
        console.log("informacion")
        var datos = JSON.parse(localStorage.getItem('puntuacionRompimiento'));
        if (datos !== null && datos !== undefined) {
            if (datos.runPlay == true) {
                setPuntuacion(datos.puntuacion);
                setRunPlay(datos.runPlay);
                setSelectComp(datos.selectComp);
                setSelectItem(datos.selectItem);
            }
        }
    }, [value])
    return (
        <div className='vh-100 bg-primary bg-gradient'>
            <div className='container-fluid bg-dark'>
                <div className='row row-cols-2 g-1' >
                    <div className='col text-light' >
                        <div className='tituloHeader ' style={{fontSize:'24px'}}>Categoria: <span className='fw-bold'>{selectItem.nombre}</span> {selectItem.genero == 'M' ? 'Masculino' : 'Femenino'}</div>
                    </div>
                    <div className='col text-light' >
                        <div className='tituloHeader' style={{fontSize:'24px'}}>Edad: <span className='fw-bold'>{selectItem.edadini}</span> - <span className='fw-bold'>{selectItem.edadfin} Años</span></div>
                    </div>
                </div>
            </div>
            <div className='container-fluid w-100 bg-transparent text-light mx-auto'>
                <div className='ps-2 my-auto ' style={{ fontSize: '26px' }}>
                    <div className="letrasContenido text-light fw-bold">Competidor: {selectComp.nombres + ' ' + selectComp.apellidos}</div>
                    <div className='letrasContenido text-light'>club: <span className='fw-bold'>{selectComp.club}</span></div>
                </div>
            </div>
            <div className='container-fluid d-flex justify-content-center'>
                <div className='card w-75 '>
                    <div className='card-body mx-auto'>
                    {puntuacion == null && <div className='puntuacionText text-light'>ok</div>}
                    {puntuacion !== null && <div className='puntuacionText text-center'>
                        {puntuacion ? <span className='text-success'>✓</span> : <span className='text-danger'>✖</span>}
                    </div>}
                    </div>
                    <div className='card-footer'>
                        <div className='tituloMenu text-dark text-center' style={{fontSize:'30px'}}><span className='fw-bold'>{selectComp.tiponombre}</span></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ScoreRompimiento