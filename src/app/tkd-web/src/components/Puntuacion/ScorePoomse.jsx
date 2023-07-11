import React, { useEffect, useState } from 'react'

function ScorePoomse() {
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
        var datos = JSON.parse(localStorage.getItem('puntuacionPoomse'));
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
                        <div className='tituloHeader ' style={{fontSize:'24px'}}>Categoria: <span className='fw-bold'>{selectItem.categoria}</span> {selectItem.genero == 'M' ? 'Masculino' : 'Femenino'}</div>
                    </div>
                    <div className='col text-light' >
                        <div className='tituloHeader text-end' style={{fontSize:'24px'}}>Grado: <span className='fw-bold'>{selectItem.nombre}</span></div>
                    </div>
                </div>
            </div>
            <div className='container-fluid w-100 bg-transparent text-light mx-auto mb-4'>
                <div className='ps-2 my-auto ' style={{ fontSize: '30px' }}>
                    <div className="letrasContenido text-light fw-bold">Competidor: {selectComp.nombres + ' ' + selectComp.apellidos}</div>
                    <div className='letrasContenido text-light'>club: <span className='fw-bold'>{selectComp.club}</span></div>
                </div>
            </div>
            <div className='container-fluid d-flex justify-content-center'>
                <div className='card w-75 '>
                    <div className='card-body mx-auto'>
                    {puntuacion == null && <div className='puntuacionText text-light'>ok</div>}
                    {puntuacion !== null && <div className='puntuacionText text-center text-dark'>
                        {puntuacion}
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

export default ScorePoomse