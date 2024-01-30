import React, { useEffect, useState } from 'react'

function RelojKirugui(props) {
    const { valor, conf, tipo, collback, doble } = props;
    const [segundo, setSegundo] = useState(0);
    const [tiempo, setTiempo] = useState('00:00')
    function calcularReloj() {
        if (doble) { collback() }
        if (valor.reset && tipo == 'r') { setSegundo(0); setTiempo('00:00') }
        if (valor.isPlay && tipo == 'r') {
            var sec = parseInt(conf.timeRound) - segundo
            var aux = Math.round(((sec / 60) - Math.trunc(sec / 60)) * 60);
            aux = aux < 10 ? '0' + aux : aux;
            var seco = Math.trunc(sec / 60) == 0 ? '0' : Math.trunc(sec / 60)
            seco = seco < 10 ? '0' + seco : seco;
            var conversion = seco + ':' + aux
            setTiempo(conversion);
            if (sec > 0) {
                localStorage.setItem('segundo', parseInt(segundo + 1));
                setSegundo(segundo + 1);
            } else {
                localStorage.setItem('segundo', parseInt(0));
                setSegundo(0);
                document.getElementById('buttonFinal').click();
            }
        } else if (!valor.isPlay && tipo == 's') {
            var sec = parseInt(conf.timeDescanso) - segundo;
            var aux = Math.round(((sec / 60) - Math.trunc(sec / 60)) * 60);
            aux = aux < 10 ? '0' + aux : aux;
            var seco = Math.trunc(sec / 60) == 0 ? '0' : Math.trunc(sec / 60);
            seco = seco < 10 ? '0' + seco : seco;
            var conversion = seco + ':' + aux
            setTiempo(conversion);
            if (sec > 0) {
                setSegundo(segundo + 1);
            } else {
                setSegundo(segundo - 10);
            }
        }
    }
    function modificarReloj(seg) {
        if(!valor.isPlay){
            var sec = parseInt(conf.timeRound) - seg
            var aux = Math.round(((sec / 60) - Math.trunc(sec / 60)) * 60);
            aux = aux < 10 ? '0' + aux : aux;
            var seco = Math.trunc(sec / 60) == 0 ? '0' : Math.trunc(sec / 60)
            seco = seco < 10 ? '0' + seco : seco;
            var conversion = seco + ':' + aux
            setTiempo(conversion);
            if (sec > 0) {
                localStorage.setItem('segundo', parseInt(seg));
                setSegundo(seg);
            } else {
                localStorage.setItem('segundo', parseInt(0));
                setSegundo(0);
                document.getElementById('buttonFinal').click();
            }
        }
    }
    useEffect(() => {
        // Configurar el temporizador al montar el componente
        const timeoutId = setTimeout(() => {
            calcularReloj();
        }, 1000);

        // Limpiar el temporizador al desmontar el componente
        return () => {
            clearTimeout(timeoutId);
        };
    }, [segundo, valor]);
    return (
        <div className={`${tipo == 'r' ? 'reloj-digital btn-group btn-group-sm ' : 'reloj-digitaP my-auto'} text-center w-100 my-auto`} style={{ borderRadius: '15px' }}>
            {tipo == 'r' && <button className='btn btn-sm mx-auto m-0 p-0 text-light' id='btnSubMin' onClick={() => { modificarReloj(segundo -1);}}>
                <i className="fa-solid fa-circle-minus fa-2xl"></i></button>}
            <div className='text-center text-light fw-bold m-0 p-0 lh-1'>{tiempo}</div>
            {tipo == 'r' && <button className='btn btn-sm mx-auto m-0 p-0 text-light' id='btnSumMin' onClick={() => { modificarReloj(segundo + 1);}}>
                <i className="fa-solid fa-circle-plus fa-2xl"></i></button>}
        </div>
    )
}

export default RelojKirugui

