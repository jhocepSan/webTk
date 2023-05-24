import React, { useContext, useEffect, useState } from 'react'
import { ContextPuntuacion } from './PrincipalPuntuacion';

function RelojPelea() {
    const {runPelea,setRunPelea,configJuego,resetJuego,setPausa,numeroRound,setNumeRound,setEndTiempo,getPuntosMando} = useContext(ContextPuntuacion)
    const [segundo,setSegundo] = useState(0);
    const [minuto,setMinuto] = useState(null);
    const [tiempo,setTiempo] = useState('00:00');
    const [compensar,setCompensar] = useState(false);
    const [configurado,setConfigurado] = useState(false);
    setTimeout(() => {
        if(runPelea){
            if(minuto==null){
                var numero = configJuego.timeRound.split(':');
                console.log(parseInt(numero[2])/60);
                numero= parseInt(numero[1])+(parseInt(numero[2])/60)
                setMinuto(numero);
                setConfigurado(true);
                setSegundo(0);
            }else{
                setSegundo(segundo+1);
            }
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
            getPuntosMando();
            setCompensar(false);
            var sec=(minuto*60)-segundo;
            var aux=Math.round(((sec/60)-Math.trunc(sec/60))*60);
            aux=aux<10?'0'+aux:aux;
            var seco=Math.trunc(sec/60)==0?'00':Math.trunc(sec/60)
            var conversion=seco+':'+aux
            setTiempo(conversion);
            if (sec <= 0 && configurado ===false) {
                console.log("detener conteo");
                setRunPelea(false);
                setPausa(true);
                if(numeroRound<parseInt(configJuego.numRound)&&minuto!==null){
                    setEndTiempo(true);
                    setNumeRound(numeroRound+1);
                    setMinuto(null);
                    setTiempo('00:00');
                }
            }
            setConfigurado(false);
        }else{
            if(compensar==false){
                compensarFallo();
            }
        }
    }, [segundo]);
    useEffect(()=>{
        setConfigurado(false);
        setMinuto(null);
        setSegundo(0);
        setTiempo('00:00');
    },[resetJuego])
    return (
        <div className='card reloj-digital text-center'>
            {tiempo}
        </div>
    )
}

export default RelojPelea
