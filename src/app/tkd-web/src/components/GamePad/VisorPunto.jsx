import React, { useEffect, useState } from 'react'

function VisorPunto(props) {
    const {valor,tipo}=props;
    const [punto,setPunto]= useState(valor.puntoA);
    useEffect(()=>{
        if(tipo=='A'){
            setPunto(valor.puntoA);
        }else{
            setPunto(valor.puntoR);
        }
    },[valor])
    return (
        <div className='card fondoPuntuacion m-0 p-0'>
            <div className='card-body text-center m-0 p-0'>
                <p className='puntuacionText m-0 p-0 lh-1'>
                    {punto}
                </p>
            </div>
        </div>
    )
}

export default VisorPunto
