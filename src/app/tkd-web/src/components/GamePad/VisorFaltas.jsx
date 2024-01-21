import React, { useEffect, useState } from 'react'

function VisorFaltas(props) {
    const { valor, tipo } = props;
    const [lista, setLista] = useState([]);
    useEffect(() => {
        if (tipo == 'A') {
            setLista(Array(valor.faltaA).fill(0));
        } else {
            setLista(Array(valor.faltaR).fill(0));
        }
    }, [valor])
    return (
        <div className='py-2'>
            <div className='text-center w-100'>
                <h4 className='text-light tituloMenu' style={{fontSize:''}}>Faltas</h4>
            </div>
            {lista && <div className="btn-group btn-group-sm">
                {lista.map((i, j) => {
                    return (
                        <button className='btn btn-sm btn-warning mx-1 text-light text-center fw-bold' key={j}>
                            F{j+1}
                        </button>
                    )
                })}
            </div>}
        </div>
    )
}

export default VisorFaltas
