import React, { useContext, useEffect, useState } from 'react'
import { ContextPuntuacion } from './PrincipalPuntuacion';

function RelojPelea() {
    const {runPelea,setRunPelea} = useContext(ContextPuntuacion)
    const [segundo,setSegundo] = useState(0);
    const [minuto,setMinuto] = useState(2);
    const [tiempo,setTiempo] = useState('00:00');
    const [compensar,setCompensar] = useState(false);
    setTimeout(() => {
        if(runPelea){
            setSegundo(segundo + 1);
        }
    }, 1000);
    function compensarFallo(){
        if(segundo!==0){
            setCompensar(true);
            setSegundo(segundo-1);
        }
    }
    useEffect(() => {
        if(runPelea){
            setCompensar(false);
            var sec=(minuto*60)-segundo;
            var aux=Math.round(((sec/60)-Math.trunc(sec/60))*60);
            aux=aux<10?'0'+aux:aux;
            var seco=Math.trunc(sec/60)==0?'00':Math.trunc(sec/60)
            var conversion=seco+':'+aux
            setTiempo(conversion);
            if (sec <= 0) {
                console.log("detener conteo");
                setRunPelea(false);
            }
        }else{
            if(compensar==false){
                compensarFallo();
            }
        }
    }, [segundo]);

    return (
        <div className='card reloj-digital text-center'>
            {tiempo}
        </div>
    )
}

export default RelojPelea
