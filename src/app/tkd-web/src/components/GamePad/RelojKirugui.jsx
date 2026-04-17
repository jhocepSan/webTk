import React, { useEffect, useState, useCallback } from 'react';

function RelojKirugui({ valor, conf, tipo, collback, doble }) {
    const [segundo, setSegundo] = useState(0);

    // 1. Función para formatear el tiempo (00:00)
    const formatearTiempo = (segundosTotales) => {
        const minutos = Math.floor(segundosTotales / 60);
        const segundos = segundosTotales % 60;
        return `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
    };

    // 2. Determinar tiempo máximo según el tipo
    const tiempoMaximo = tipo === 'r' ? parseInt(conf.timeRound) : parseInt(conf.timeDescanso);
    const tiempoRestante = Math.max(0, tiempoMaximo - segundo);

    // 3. Manejo del temporizador
    useEffect(() => {
        let intervalo = null;

        if (valor.reset && tipo === 'r') {
            setSegundo(0);
        }

        if (valor.isPlay) {
            intervalo = setInterval(() => {
                setSegundo(prev => {
                    const nuevoSegundo = prev + 1;
                    
                    // Lógica de finalización
                    if (nuevoSegundo >= tiempoMaximo) {
                        if (tipo === 'r') {
                            collback('FIN_ROUND'); // Llama directamente a la función, no al click
                            localStorage.setItem('segundo', 0);
                        }
                        return tiempoMaximo;
                    }

                    if (tipo === 'r') localStorage.setItem('segundo', nuevoSegundo);
                    return nuevoSegundo;
                });
            }, 1000);
        }

        return () => clearInterval(intervalo);
    }, [valor.isPlay, valor.reset, tipo, tiempoMaximo]);

    // 4. Modificar reloj manualmente
    const modificarReloj = (nuevoSeg) => {
        if (!valor.isPlay) {
            const ajustado = Math.max(0, Math.min(nuevoSeg, tiempoMaximo));
            setSegundo(ajustado);
            localStorage.setItem('segundo', ajustado);
        }
    };

    return (
        <div className={`${tipo === 'r' ? 'reloj-digital btn-group btn-group-sm' : 'reloj-digitaP'} text-center w-100 my-auto`}>
            {tipo === 'r' && (
                <button className='btn btn-sm text-light' onClick={() => modificarReloj(segundo + 1)}>
                    <i className="fa-solid fa-circle-minus fa-2xl"></i>
                </button>
            )}
            
            <div className='text-center text-light fw-bold m-0 p-0 lh-1 my-auto'>
                {formatearTiempo(tiempoRestante)}
            </div>

            {tipo === 'r' && (
                <button className='btn btn-sm text-light' onClick={() => modificarReloj(segundo - 1)}>
                    <i className="fa-solid fa-circle-plus fa-2xl"></i>
                </button>
            )}
        </div>
    );
}

export default RelojKirugui;
