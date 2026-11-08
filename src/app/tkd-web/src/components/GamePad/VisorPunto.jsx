import React, { useMemo } from 'react'

function VisorPunto(props) {
    const { valor, tipo } = props;
    const punto = useMemo(() => tipo === 'A' ? valor.puntoA : valor.puntoR, [valor, tipo]);

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