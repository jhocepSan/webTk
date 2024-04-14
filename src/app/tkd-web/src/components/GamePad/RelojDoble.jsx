import React, { useEffect, useState } from 'react'

function RelojDoble(props) {
    const {valor,conf,tipo,collback,doble}=props;
    const [segundo,setSegundo]=useState(0);
    const [tiempo,setTiempo] = useState('00:00')
    function calcularReloj() { 
        if(doble){collback()}
        if(valor.reset&&tipo=='r'){setSegundo(0);setTiempo('00:00')}
        if(valor.isPlay&&tipo=='r'){
            var sec=parseInt(conf.timeRound)-segundo
            var aux=Math.round(((sec/60)-Math.trunc(sec/60))*60);
            aux=aux<10?'0'+aux:aux;
            var seco=Math.trunc(sec/60)==0?'0':Math.trunc(sec/60)
            seco=seco<10?'0'+seco:seco;
            var conversion=seco+':'+aux
            setTiempo(conversion);
            if(sec>0){
                setSegundo(parseInt(localStorage.getItem('segundo')));
            }else{
                setSegundo(0);
            }
        }else if(!valor.isPlay&&tipo=='s'){
            var sec=parseInt(conf.timeDescanso)-segundo;
            var aux=Math.round(((sec/60)-Math.trunc(sec/60))*60);
            aux=aux<10?'0'+aux:aux;
            var seco=Math.trunc(sec/60)==0?'0':Math.trunc(sec/60)
            var conversion=seco+':'+aux
            setTiempo(conversion);
            if(sec>0){
                setSegundo(segundo+0.5);
            }else{
                setSegundo(segundo-10);
            }
        }
    }
    
    useEffect(() => {
        // Configurar el temporizador al montar el componente
        const timeoutId = setTimeout(() => {
            calcularReloj();
        }, 500);

        // Limpiar el temporizador al desmontar el componente
        return () => {
            clearTimeout(timeoutId);
        };
    }, [segundo,valor]);
    return (
        <div className={`${tipo=='r'?'reloj-digital':'reloj-digitaP'} text-center text-light fw-bold lh-1`} style={{borderRadius:'15px'}}>
            {tiempo}
        </div>
    )
}

export default RelojDoble

